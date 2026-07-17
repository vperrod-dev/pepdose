import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveVial,
  getVials,
  decrementVialDose,
  incrementVialDose,
  logDose,
  deleteDoseLog,
  getAllDoseLogs,
  saveProtocol,
  getProtocol,
  saveScheduledDoses,
  getScheduledDosesForProtocol,
  deleteProtocol,
  clearAllData,
  importData,
  validateImport,
  exportAllData,
} from './operations';
import { predictEmptyDate } from '../utils/vialForecast';
import { getDB } from './schema';
import type { Vial } from './schema';

const baseVial: Omit<Vial, 'id' | 'createdAt'> = {
  owner: 'Victor',
  peptideId: 'bpc-157',
  amountMg: 5,
  bacWaterMl: 2,
  dosesRemaining: 3,
  totalDoses: 20,
  status: 'active',
};

const baseLog = {
  owner: 'Victor' as const,
  protocolId: 'p1',
  peptideId: 'bpc-157',
  date: '2026-07-15',
  time: '08:00',
  dose: 250,
  unit: 'mcg' as const,
  route: 'subq',
};

beforeEach(async () => {
  await clearAllData();
});

describe('decrementVialDose', () => {
  it('draws one dose from the active vial', async () => {
    await saveVial(baseVial);
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(2);
  });

  it('marks the vial empty when the last dose is drawn', async () => {
    await saveVial({ ...baseVial, dosesRemaining: 1 });
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.status).toBe('empty');
  });

  it('does nothing when no active vial matches', async () => {
    await saveVial({ ...baseVial, status: 'empty', dosesRemaining: 0 });
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(0);
  });

  it('keeps the run-out forecast in step with the draw-down', async () => {
    await saveVial(baseVial);
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    // Daily cadence: 2 doses left -> empty in 2 days.
    const forecast = predictEmptyDate(vial.dosesRemaining, ['2026-07-13', '2026-07-14', '2026-07-15'], new Date('2026-07-15T12:00:00Z'));
    expect(forecast).toBe('2026-07-17');
  });
});

describe('incrementVialDose', () => {
  it('returns a dose to the active vial', async () => {
    await saveVial(baseVial);
    await incrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(4);
  });

  it('reactivates an emptied vial', async () => {
    await saveVial({ ...baseVial, status: 'empty', dosesRemaining: 0 });
    await incrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial).toMatchObject({ status: 'active', dosesRemaining: 1 });
  });
});

describe('logDose / deleteDoseLog inventory round trip', () => {
  it('logging then deleting a dose leaves dosesRemaining unchanged', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await deleteDoseLog(log.id);
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(baseVial.dosesRemaining);
  });

  it('logging a dose draws down the vial', async () => {
    await saveVial(baseVial);
    await logDose(baseLog);
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(2);
  });

  it('deleting the log actually removes it', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await deleteDoseLog(log.id);
    expect(await getAllDoseLogs()).toEqual([]);
  });
});

describe('deleteProtocol', () => {
  it('removes the protocol and all of its scheduled doses together', async () => {
    const protocol = await saveProtocol({
      owner: 'Victor',
      name: 'Test',
      peptideIds: ['bpc-157'],
      doses: [],
      startDate: '2026-07-15',
      durationWeeks: 4,
      status: 'active',
    });
    await saveScheduledDoses([
      { id: 'd1', protocolId: protocol.id, peptideId: 'bpc-157', date: '2026-07-15', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
      { id: 'd2', protocolId: protocol.id, peptideId: 'bpc-157', date: '2026-07-16', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    await deleteProtocol(protocol.id);

    expect(await getProtocol(protocol.id)).toBeUndefined();
    expect(await getScheduledDosesForProtocol(protocol.id)).toEqual([]);
  });

  it('records the protocol and its doses in the deletion ledger', async () => {
    const protocol = await saveProtocol({
      owner: 'Victor', name: 'Test', peptideIds: ['bpc-157'], doses: [],
      startDate: '2026-07-15', durationWeeks: 4, status: 'active',
    });
    await saveScheduledDoses([
      { id: 'd1', protocolId: protocol.id, peptideId: 'bpc-157', date: '2026-07-15', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    await deleteProtocol(protocol.id);

    const db = await getDB();
    const ledger = await db.getAll('deletions');
    expect(ledger.map((d) => `${d.kind}:${d.id}`).sort())
      .toEqual([`protocols:${protocol.id}`, 'scheduledDoses:d1'].sort());
  });
});

describe('deleteDoseLog deletion ledger', () => {
  it('records the deleted log so sync can tombstone it', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await deleteDoseLog(log.id);
    const db = await getDB();
    expect(await db.get('deletions', log.id)).toMatchObject({ kind: 'doseLogs' });
  });
});

describe('validateImport', () => {
  it('rejects a non-object payload', () => {
    expect(() => validateImport([1, 2, 3])).toThrow('Backup must be a JSON object');
  });

  it('rejects a store that is not an array', () => {
    expect(() => validateImport({ protocols: 'nope' })).toThrow('protocols must be an array');
  });

  it('rejects an entry without an id', () => {
    expect(() => validateImport({ doseLogs: [{ peptideId: 'bpc-157', date: '2026-07-15' }] }))
      .toThrow('doseLogs entry missing required field: id');
  });

  it('rejects an entry missing a required field', () => {
    expect(() => validateImport({ protocols: [{ id: 'p1', name: 'T' }] }))
      .toThrow('protocols entry missing required field: startDate');
  });

  it('accepts a real export round trip', async () => {
    await saveVial(baseVial);
    const json = await exportAllData();
    expect(() => validateImport(JSON.parse(json))).not.toThrow();
  });
});

describe('importData', () => {
  it('rejects malformed input without touching existing state', async () => {
    await saveVial(baseVial);
    await expect(importData(JSON.stringify({ vials: [{ notEvenClose: true }] }))).rejects.toThrow();
    const vials = await getVials('bpc-157');
    expect(vials).toHaveLength(1);
  });

  it('clears a pending deletion for a re-imported record', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    const exported = await exportAllData();
    await deleteDoseLog(log.id);

    await importData(exported);

    const db = await getDB();
    expect(await db.get('deletions', log.id)).toBeUndefined();
    expect((await getAllDoseLogs()).map((l) => l.id)).toEqual([log.id]);
  });
});
