// E2E smoke test: drives the real app in headless Chromium through the core
// user journeys (log, ad-hoc, reschedule, skip) and fails on any console error.
//
// Usage:
//   node scripts/e2e-smoke.mjs                 # spawns its own dev server (local mode, no Supabase)
//   BASE=http://host/pepdose node scripts/e2e-smoke.mjs   # test an already-running instance
//
// Scenario catalog these map to: docs/USER-TESTING.md

import { spawn } from 'node:child_process';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // ponytail: VM has playwright only via the global @playwright/cli install
  ({ chromium } = await import('/usr/lib/node_modules/@playwright/cli/node_modules/playwright/index.mjs'));
}

const PORT = 5199;
const external = !!process.env.BASE;
const BASE = process.env.BASE || `http://localhost:${PORT}/pepdose`;
const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

let server;
if (!external) {
  // Local-only mode: empty Supabase env disables the login gate so the smoke
  // test exercises the IndexedDB paths every user shares.
  server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
    env: { ...process.env, VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
    stdio: 'ignore',
    detached: true,
  });
  for (let i = 0; ; i++) {
    try { await fetch(BASE + '/'); break; }
    catch { if (i > 30) throw new Error('dev server never came up'); await new Promise(r => setTimeout(r, 500)); }
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push(e.message));

await page.addInitScript(() => localStorage.setItem('pepdose-onboarded', 'true'));
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

async function seedDose(id, status = 'upcoming') {
  await page.evaluate(async ({ id, status, today }) => {
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('pepdose');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    await new Promise((res, rej) => {
      const tx = db.transaction('scheduledDoses', 'readwrite');
      tx.objectStore('scheduledDoses').put({
        id, owner: 'Victor', protocolId: 'smoke-proto', peptideId: 'bpc-157',
        date: today, time: '08:00', dose: 250, unit: 'mcg',
        route: 'subcutaneous', status, weekNumber: 1,
      });
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    db.close();
  }, { id, status, today });
}

async function readStore(store) {
  return page.evaluate(async (store) => {
    const db = await new Promise((res) => { const r = indexedDB.open('pepdose'); r.onsuccess = () => res(r.result); });
    const rows = await new Promise((res) => {
      const rq = db.transaction(store).objectStore(store).getAll();
      rq.onsuccess = () => res(rq.result);
    });
    db.close(); return rows;
  }, store);
}

const results = [];
async function scenario(name, fn) {
  try { await fn(); results.push(`PASS  ${name}`); }
  catch (e) { results.push(`FAIL  ${name} — ${e.message.split('\n')[0]}`); }
}

await scenario('S1 reschedule a pending dose from the Dashboard', async () => {
  await seedDose('smoke-s1');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByText('BPC-157').first().click();
  await page.getByText('Reschedule', { exact: true }).click();
  await page.locator('input[type="date"]').fill(tomorrow);
  await page.locator('button:has-text("Reschedule")').last().click();
  await page.waitForTimeout(600);
  const dose = (await readStore('scheduledDoses')).find(d => d.id === 'smoke-s1');
  if (dose?.date !== tomorrow) throw new Error(`dose date is ${dose?.date}, expected ${tomorrow}`);
});

await scenario('S2 skip a pending dose from the Dashboard', async () => {
  await seedDose('smoke-s2');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByText('BPC-157').first().click();
  await page.getByText('Skip Dose').click();
  await page.waitForTimeout(600);
  const dose = (await readStore('scheduledDoses')).find(d => d.id === 'smoke-s2');
  if (dose?.status !== 'skipped') throw new Error(`status is ${dose?.status}`);
});

await scenario('S3 log a pending dose with details (dose sheet)', async () => {
  await seedDose('smoke-s3');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByText('BPC-157').first().click();
  await page.getByText('Log Dose', { exact: true }).first().click();
  await page.locator('button:has-text("Log Dose")').last().click();
  await page.waitForTimeout(600);
  const log = (await readStore('doseLogs')).find(l => l.scheduledDoseId === 'smoke-s3');
  if (!log) throw new Error('no dose log written');
});

await scenario('S4 ad-hoc dose for a past date from Quick Log', async () => {
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  await page.goto(BASE + '/log', { waitUntil: 'networkidle' });
  await page.getByText('Ad-hoc dose').click();
  await page.locator('select').selectOption({ label: 'BPC-157' });
  await page.locator('input[inputmode="decimal"]').first().fill('250');
  await page.locator('input[type="date"]').fill(yesterday);
  await page.locator('button:has-text("Log Dose")').click();
  await page.waitForTimeout(800);
  const log = (await readStore('doseLogs')).find(l => !l.scheduledDoseId && l.date === yesterday);
  if (!log) throw new Error('no ad-hoc log with the chosen past date');
  if (await page.locator('button:has-text("Saving")').count()) throw new Error('sheet stuck on Saving…');
});

await scenario('S5 rescheduled dose appears on its new calendar day', async () => {
  await page.goto(BASE + '/calendar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const doses = await readStore('scheduledDoses');
  const moved = doses.find(d => d.id === 'smoke-s1');
  if (!moved?.editNote?.startsWith('Rescheduled from')) throw new Error('reschedule audit note missing');
});

console.log(results.join('\n'));
console.log(consoleErrors.length ? 'CONSOLE ERRORS:\n' + consoleErrors.join('\n') : 'console clean');
await browser.close();
if (server) process.kill(-server.pid);
process.exit(results.some(r => r.startsWith('FAIL')) || consoleErrors.length ? 1 : 0);
