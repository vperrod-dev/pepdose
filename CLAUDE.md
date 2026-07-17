# pepdose

Peptide dose-tracking PWA: protocols, smart injection scheduling (auto-titration,
phased variants), vial tracking, body-map site logging, dose reminders, and
insights (active-levels curve, symptom trends, adherence) — stored locally
(IndexedDB) with an **optional Supabase cloud mirror** for cross-device sync.
React 19 + Vite + TypeScript + Tailwind v4 + idb + Recharts.
Live: https://vperrod.github.io/pepdose/

Cloud sync (optional): active only when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`
are set — else fully local, no login. `src/db/supabase.ts` (client), `src/db/sync.ts`
(bidirectional union-merge, LWW, never destructive — see `planMerge`),
`src/components/AuthGate.tsx` (shared-account login gate + sync triggers). Schema +
setup: `supabase/migrations/0001_init.sql`, `docs/CLOUD_SYNC_SETUP.md`. Deletes are
explicit: every local delete writes a `deletions` ledger entry (IndexedDB store,
schema v3), which sync pushes as a `deleted: true` tombstone (marked `data._ledger`)
and prunes; marked remote tombstones delete the local row when newer (a newer
re-edit still wins). Legacy unmarked tombstones never delete local data — the
surviving row is pushed back to repair the cloud.

## Commands

```bash
npm install
npm run build        # tsc -b && vite build → dist/  (this is what CI gates on)
npm test             # vitest — must pass before push
npm run dev          # http://localhost:5173
npm run lint         # eslint — repo has pre-existing errors; don't add new ones
```

## Architecture

- **`src/`** — React app; scheduling engine (`utils/scheduleEngine.ts`) generates
  every injection from a protocol (titration ladders, phased schedules,
  weekday-only cadence) and regenerates safely on edit (preserves
  logged/skipped/missed doses). A titration ladder is **scaled to the user's
  chosen start dose** — the dose field defaults to the ladder's first step, and
  typing a different value shifts the whole ladder proportionally (see
  `getTitrationDose`), so a user can start e.g. Retatrutide at 0.5mg.
- Storage: IndexedDB via `idb` (`db/schema.ts` + `db/operations.ts`) — no backend,
  no accounts; data never leaves the device. Supports two users/profiles. Logging
  a dose decrements the peptide's active vial; deleting a log restores it.
- Charts/insights (Recharts, date-fns), each driven by a **pure, unit-tested**
  helper:
  - `utils/activeLevels.ts` → "Active Levels" (`HalfLife.tsx`): estimated
    in-system level from logged doses, projected forward through upcoming
    scheduled doses.
  - `utils/symptomTrends.ts` + `data/symptoms.ts` → "Symptoms" (`Symptoms.tsx`):
    per-dose symptoms (`DoseLog.symptoms`, 1–10 severity) charted with titration
    step-up markers.
  - `utils/adherence.ts` → Dashboard streak + weekly ratio.
  - `utils/injectionStats.ts` → injection-map zone volume; `utils/titrationCoach.ts`
    → next step-up hint.
- Reminders (`utils/notifications.ts`): timezone-aware (via pure `utils/tz.ts` +
  `settings.timezone`, DST-correct). Where the Notification Triggers API is available
  (`TimestampTrigger`), reminders are armed to fire even when the app is fully closed;
  otherwise they fall back to in-page timers fired through the service worker
  (`public/sw.js` `showNotification`), deduped per day. `triggeredNotificationsSupported()`
  gates the capability.
- Calendar (`pages/Calendar.tsx`): month grid (per-peptide color strip + legend) with a
  Month/Timeline toggle. The Gantt **Protocol Timeline** (`components/ProtocolTimeline.tsx`)
  is driven by pure `utils/protocolTimeline.ts` (`buildTimeline`), unit-tested.
- PWA "Next Dose" widget: `public/widgets/next-dose.html` + `widgets` member in
  `public/manifest.json` (self-contained, reads IndexedDB directly; Android/Chromium only).
- Reconstitution calculator (`ReconCalculator.tsx`): forward + reverse-BAC solve,
  blend per-component breakdown (`Peptide.reconstitution.components`), honors the
  U-100/U-40 setting. Deep-linkable via `/calculator?peptide=<id>`.
- Peptide content: `data/peptides.ts` (dosing/reconstitution/titration) and
  `data/experienceTimelines.ts` (`PeptideExperience` — weekly guide + optional
  evidence/dosing/tips/mistakes/stacking sections rendered by `ExperienceGuide.tsx`).
- Deploy: GitHub Pages (build → gh-pages), triggered on push to `main`. CI runs
  `npm run build` only.

## Conventions

- Local-first is a hard constraint: no backend, no external APIs.
- Schedule-engine edits must preserve already-logged history — test regeneration
  paths when touching protocol editing.
- New analytics logic goes in a **pure `utils/*.ts` helper with a `.test.ts`**, kept
  out of the component (see activeLevels/symptomTrends/adherence).
- Numeric inputs use the string-backed `components/DecimalInput.tsx` (a raw
  `type="number"` bound to numeric state snaps decimals/clears to 0).
- Peptide educational content is community/clinical-sourced and flags anecdotal vs
  clinical — keep the honesty (it's not medical advice).

## Agentic OS

- Registry entry: `pepdose` in `claude-config/os/registry.yaml` (autonomy: `report-only`)
- Cross-project backlog: `claude-config/os/backlog.md` under `## pepdose`
- Working tasks: `tasks/todo.md` · Lessons after corrections: `tasks/lessons.md`
- At session start, check the registry entry and this project's backlog section.
