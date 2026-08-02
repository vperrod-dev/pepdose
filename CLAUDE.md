# pepdose

Peptide dose-tracking PWA: protocols, smart injection scheduling (auto-titration,
phased variants), vial tracking, body-map site logging, dose reminders, and
insights (active-levels curve, symptom trends, adherence) — stored locally
(IndexedDB) with an **optional Supabase cloud mirror** for cross-device sync.
React 19 + Vite + TypeScript + Tailwind v4 + idb + Recharts.
Live: https://claude-dev-vperrod.westeurope.cloudapp.azure.com/pepdose/ (Caddy on this VM; deploy with `scripts/deploy.sh`)

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
npm run test:e2e     # headless-Chromium smoke of core user journeys (scripts/e2e-smoke.mjs);
                     # full manual scenario catalog: docs/USER-TESTING.md
npm run dev          # http://localhost:5173
npm run lint         # eslint — repo has pre-existing errors; don't add new ones
```

## Architecture

- **`src/`** — React app; scheduling engine (`utils/scheduleEngine.ts`) generates
  every injection from a protocol (titration ladders, phased schedules,
  weekday-only cadence, scheduled off-week "breaks") and regenerates safely on
  edit (preserves logged/skipped/missed doses). A titration ladder is **scaled
  to the user's chosen start dose** — the dose field defaults to the ladder's
  first step, and typing a different value shifts the whole ladder
  proportionally (see `getTitrationDose`), so a user can start e.g.
  Retatrutide at 0.5mg.
  - **Protocol variants** (`data/peptides.ts` → `DosingProtocol.protocolVariants`):
    each peptide can declare multiple named, phased protocol variants (e.g.
    Retatrutide: clinical-trial ladder vs community 8-on/8-off vs microdose
    maintenance). The `selectTemplate` / `applyVariant` flows in `NewProtocol.tsx`
    and `Protocols.tsx` auto-pick the first variant, set its phases as the dose
    config's `schedulePhases`, and override the dose. The schedule engine reads
    `schedulePhases` to emit the correct cadence per week.
  - **Breaks** (`data/protocols.ts` → `ProtocolTemplate.breaks`, `db/schema.ts` →
    `UserProtocol.breaks`): explicit off-week ranges (`{ weekStart, weekEnd,
    reason }`) where no doses are generated. Templates with break-aware cycling
    (e.g. Retatrutide 8-on/8-off, NAD+ 4-on/2-off, MT2 2-on/4-off) pre-fill these.
    The schedule engine (`utils/scheduleEngine.ts`) skips dose generation during
    break weeks across all frequency paths (daily, EOD, weekly, biweekly, custom,
    and phased). The calendar month grid renders a purple diagonal hatch on
    break-week days with a tooltip; the Protocol Timeline Gantt distinguishes
    break weeks (purple hatch) from regular off-week days (gray hatch).
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
  Month/Timeline toggle. Break weeks render as a purple diagonal hatch on affected
  days with a tooltip showing the break reason. The Gantt **Protocol Timeline**
  (`components/ProtocolTimeline.tsx`) is driven by pure
  `utils/protocolTimeline.ts` (`buildTimeline`, unit-tested), which marks break
  weeks via the `isBreak` flag on each `WeekSegment`.
- PWA "Next Dose" widget: `public/widgets/next-dose.html` + `widgets` member in
  `public/manifest.json` (self-contained, reads IndexedDB directly; Android/Chromium only).
- Reconstitution calculator (`ReconCalculator.tsx`): forward + reverse-BAC solve,
  blend per-component breakdown (`Peptide.reconstitution.components`), honors the
  U-100/U-40 setting. Deep-linkable via `/calculator?peptide=<id>`.
- Peptide content: `data/peptides.ts` (dosing/reconstitution/titration/variants) and
  `data/experienceTimelines.ts` (`PeptideExperience` — weekly guide + optional
  evidence/dosing/tips/mistakes/stacking sections rendered by `ExperienceGuide.tsx`).
  39 compounds, each with an entry in BOTH files plus any relevant
  `data/stackingRules.ts` pairs — `data/dataIntegrity.test.ts` enforces that
  cross-referencing, so run `npm test` after touching any of them.
  Optional `Peptide` fields carry what marketing copy usually omits:
  `halfLifeNote` (most of these compounds have no human PK at all — say so rather
  than presenting a vendor number as fact), `regulatoryStatus` (approval and FDA
  compounding status, which moves — date it), and `safetyFlags` (boxed warnings,
  trial deaths, hard contraindications). `dosing.protocolVariants` holds named,
  phased cycling presets per peptide (e.g. clinical trial ladder vs community
  cycle for Retatrutide) — each with `phases`, `doseOverride`, and a `source` URL.
  Keep the honesty when editing: state what is trial-derived versus community
  consensus, and never invent a cycling rationale or a mechanism the literature
  does not support.
- GLP-1 stacking: `stackingRules.ts` generates a contraindication for every pair
  among `GLP1_RECEPTOR_ACTIVE`. Add any new GLP-1-receptor-active compound to
  that list, not just to `PEPTIDES`.
- Protocol library: `data/protocols.ts` defines `PROTOCOL_TEMPLATES` — curated
  named protocols spanning single peptides and stacks (Wolverine Healing, GH
  Boost, Retatrutide Clinical, Retatrutide Community Cycle, NAD+ Ramp/Steady,
  MT2 Loading, GHK-Cu Daily/EOD, GLOW Blend, MOTS-c 6-on/6-off, etc.). Each
  template can declare `breaks` (off-week ranges) that the schedule engine
  respects on creation and regeneration. NewProtocol.tsx and Protocols.tsx both
  surface template selection with one-click setup. Protocols have a lifecycle:
  active → paused / completed / archived — the actions sheet in Protocols.tsx
  provides Pause/Resume, Finish (marks completed; future doses become skipped),
  and Delete.
- Deploy: **`scripts/deploy.sh`** — builds and rsyncs `dist/` to `/srv/pepdose`
  on this VM, served by **Caddy** at `/pepdose*` (see `/etc/caddy/Caddyfile`).
  Live: https://claude-dev-vperrod.westeurope.cloudapp.azure.com/pepdose/ .
  Pushing to `main` does NOT deploy — you must run the script. The old GitHub
  Pages path (`.github/workflows/deploy.yml`) is DEAD while the account block
  holds (Actions disabled account-wide, ticket 4583559); Vite `base` stays
  `/pepdose/` so moving back needs no rebuild.

## Conventions

- Local-first is a hard constraint: no backend, no external APIs.
- Schedule-engine edits must preserve already-logged history — test regeneration
  paths when touching protocol editing. Break-week logic has dedicated tests in
  `scheduleEngine.test.ts` (`protocolBreaks` suppresses dose generation for daily,
  weekly, and phased schedules).
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
