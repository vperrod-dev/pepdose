# pepdose — Handoff

Snapshot for continuing this work on your laptop. Everything below is current as of
the merge of PR #1 (features) and PR #3 (docs) into `main`.

## Status: what's done and live

All of the following is merged to `main` and deployed at
**https://vperrod.github.io/pepdose/** (deploy runs automatically on push to `main`):

- **Dose-save bug fixed** — the reported "changing the quantity doesn't save" issue.
  Root cause + fix: string-backed `src/components/DecimalInput.tsx` (see Gotchas).
- **Dose reminders** — opt-in, fired via the service worker while the app is open/
  backgrounded (Settings → Push Notifications, with a test button).
- **Active Levels chart** (Insights → Active Levels) — in-system level from logged
  doses, projected forward through upcoming scheduled doses.
- **Per-dose symptom logging + trends** (Insights → Symptoms) — rate symptoms 1–10
  when logging a dose; charted with titration step-up markers.
- **Reconstitution calculator overhaul** — forward + **reverse-BAC**, **blend
  breakdown** (GLOW), live **U-100/U-40** setting, guide deep-link.
- **Reconstitution-aware inventory** — auto doses-per-vial, **beyond-use-date**
  countdown, decrement-on-log / restore-on-delete.
- **Adherence streak** on the Dashboard.
- **Deep GLOW + retatrutide content** and **6 new peptide guides** (KPV, CJC-1295
  DAC, Sermorelin, Tesamorelin, Semax, Selank).
- **Ad-hoc dose logging**, plus assorted review fixes.

Tests: `45 passing`. Build + typecheck clean.

## Run it locally

Prereqs: Node 20+ and npm.

```bash
git clone https://github.com/vperrod/pepdose.git
cd pepdose
npm install
npm run dev      # http://localhost:5173  (note: dev serves at "/", Pages serves at "/pepdose/")
```

Other commands:

```bash
npm test         # vitest — must pass before pushing
npm run build    # tsc -b && vite build → dist/   (this is exactly what CI gates on)
npm run preview  # serve the production build at /pepdose/ (matches prod base path)
npm run lint     # eslint — repo has pre-existing errors; just don't add new ones
```

Data lives in the browser's IndexedDB (`pepdose` DB). To reset while developing:
DevTools → Application → IndexedDB → delete `pepdose`, or Settings/Export-Import →
Clear all data.

## Deploying

Push to `main` → `.github/workflows/deploy.yml` builds and publishes to GitHub
Pages. No other environments. The Vite `base` is `/pepdose/` to match the Pages path.

## Remaining roadmap (with pointers)

Ordered by value ÷ effort. Each is local-first unless flagged.

### 1. `.ics` calendar export — **S, local-first**
Generate an iCalendar file of upcoming scheduled doses so they land in Apple/Google
Calendar (a serverless hedge for the reminder limitation, esp. iOS).
- New `src/utils/icsExport.ts` (pure, testable): take `ScheduledDose[]` → an ICS
  string (one `VEVENT` per dose; `DTSTART` from `date`+`time`, `SUMMARY` = peptide +
  dose). Trigger a Blob download like `ExportImport.tsx` already does for JSON.
- Surface a button in `ExportImport.tsx` or the Calendar page.

### 2. Doctor-ready PDF report — **M, local-first**
One-tap printable report: active protocols, dose history, adherence %, symptoms with
severities, health-marker trends, labs.
- Simplest path: a print stylesheet + a dedicated `/report` route with
  `window.print()` (no dependency). Or add `jspdf` for a real PDF.
- Pull data from `src/db/operations.ts` (getProtocols, getAllDoseLogs,
  getHealthMarkers) and reuse `utils/adherence.ts` + `utils/symptomTrends.ts`.
- Respect the two-user filter (per-user report).

### 3. Wire or remove the remaining dead settings — **S**
`src/pages/Settings.tsx` persists `unitSystem` (metric/imperial) and `darkMode` but
nothing reads them. Either wire `unitSystem` into `HealthMarkers` weight/measurement
display (kg↔lb, cm↔in) or remove the toggles so they don't imply functionality.
(`syringeType` is already wired into the calculator; `defaultInjectionTime` and
`reminderMinutesBefore` are used.)

### 4. NewProtocol "custom interval" total-dose estimate — **S**
`src/pages/NewProtocol.tsx` shows "~X total injections"; for a custom "every N days"
frequency it counts every day. Compute `daysInCycle / customFrequencyDays` instead.

### 5. Reliable push-when-closed reminders — **needs a backend (out of local-first scope)**
The current reminders can't wake a fully-closed app (no push server). True background
delivery (esp. installed iOS PWA, 16.4+) needs Web Push + a small push server. This is
the one item that breaks the no-backend constraint — decide deliberately before doing it.

Larger ideas from the competitor research, if you want them later: multi-compound
blend *vials* (not just the calculator), cost tracking, progress photos (IndexedDB
blobs), lab/bloodwork tracking with reference ranges, cycle/washout planner.

## Gotchas & conventions (read before editing)

- **Numeric inputs:** use `src/components/DecimalInput.tsx`, not a raw `type="number"`
  bound to numeric state — the raw version snaps decimals and clears to `0` (that was
  the original dose-save bug). See also `utils` that parse strings at save time.
- **Local-first is a hard constraint:** no backend, no external APIs, no accounts.
- **Analytics logic** goes in a pure `src/utils/*.ts` helper with a matching
  `.test.ts` (see `activeLevels`, `symptomTrends`, `adherence`), kept out of the
  component.
- **Schema additions:** IndexedDB is per-record schemaless, so *optional* fields on a
  record (e.g. `DoseLog.symptoms`) need no migration. A store/index change does — bump
  the version in `src/db/schema.ts` and add an `upgrade` block (see the v1→v2 owner
  backfill).
- **CI runs `npm run build` only.** Lint has ~12 pre-existing errors on `main`; keep
  your diff from adding new ones, but don't expect a clean lint.
- **Reminders limitation** is intentional and documented — don't "fix" it without a
  backend (see roadmap #5).
- **Verifying UI changes headlessly:** the pattern used here is to drive the
  `npm run preview` build with Playwright, seeding IndexedDB via `page.evaluate`
  (open `indexedDB.open('pepdose', 2)` and `put` records) then asserting on render.
  Handy for charts/forms that need data.
- **Git workflow:** work on a branch, open a PR, merge to `main` to deploy. Commit or
  push only what you intend to ship.

## Key files map

- Scheduling: `src/utils/scheduleEngine.ts`
- Storage: `src/db/schema.ts`, `src/db/operations.ts`
- Analytics helpers (pure + tested): `src/utils/{activeLevels,symptomTrends,adherence,injectionStats,titrationCoach}.ts`
- Reminders: `src/utils/notifications.ts` + `public/sw.js`
- Calculator: `src/pages/ReconCalculator.tsx`
- Peptide data/content: `src/data/peptides.ts`, `src/data/experienceTimelines.ts`, `src/data/symptoms.ts`
- Dose logging UI: `src/components/DoseActionSheet.tsx`, `src/pages/QuickLog.tsx`
- Project conventions: `CLAUDE.md`; user-facing feature list: `README.md`
