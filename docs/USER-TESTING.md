# User testing scenarios

The validation catalog for pepdose. Three layers:

1. **Unit/component tests** — `npm test` (vitest). Every analytics helper, the db
   layer, sync merge, and the regression-prone UI flows (DecimalInput, ad-hoc
   sheet error path, auth gate, import/export).
2. **E2E smoke** — `node scripts/e2e-smoke.mjs`. Headless Chromium drives the
   real app (own dev server, local mode) through S1–S8 below and fails on any
   console error. Run it before every deploy; point it at a deployed instance
   with `BASE=https://…/pepdose node scripts/e2e-smoke.mjs` (needs a build
   without the Supabase login gate, or a signed-in storage state).
3. **Manual scenarios** — everything below. Walk the relevant section after
   touching that area; walk all of it before calling a release "done".

Conventions: seed data = one active protocol with today-doses (or use the
`smoke-*` seeds the e2e script writes). "DB" = IndexedDB `pepdose` database in
devtools → Application. Test on mobile viewport — this is a phone-first PWA.

## Dose logging (automated: S1–S5, S7, S11)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| S1 | Reschedule a pending dose | Dashboard/Calendar → tap pending dose → Reschedule → pick new date/time → Reschedule | Sheet closes, dose gone from old day, present on new day with "Rescheduled from…" note; survives reload |
| S2 | Skip a dose | Tap pending dose → Skip Dose | Marked skipped, not counted as missed, adherence unaffected by later logs |
| S3 | Log with details | Tap pending dose → Log Dose → adjust dose/time/site/symptoms → save | Log written, scheduled dose shows logged, vial draw-down by 1 |
| S4 | Ad-hoc dose, past date | Quick Log → Ad-hoc dose → peptide + dose + yesterday's date → Log Dose | Log appears on that date (History/Calendar), never on today; sheet never sticks on "Saving…"; a today-dated ad-hoc dose appears immediately in Completed and on the Dashboard with an ad-hoc chip (automated: S7); the dose shows on its Calendar day (strip + day list, Ad-hoc chip); every peptide (incl. oral/intranasal) is pickable |
| S5 | Reschedule persists across views | After S1, open Calendar month view | Dose strip renders on the new day only |
| S6 | Quick tap-log | Quick Log → tap a pending dose card | Check burst, moves to Completed, one log at current time |
| S7 | Failed save surfaces | Devtools → simulate IndexedDB error (or fill storage quota) → try S3/S4 | Inline red error, button re-enabled, no silent loss, sheet not stuck |
| S8 | Edit a logged dose | Tap a logged dose → change dose value → Save Changes | New value in History; vial count unchanged (edit ≠ second dose) |
| S9 | Decimal dose entry | In any dose field type `0.25` slowly | Intermediate states ("0.", "") never snap to 0; save keeps 0.25 |
| S11 | Delete a dose log (automated: S8 for ad-hoc) | Tap an ad-hoc dose anywhere (Completed / Dashboard / Calendar / journey) → Delete this dose → confirm; or open a logged scheduled dose → Delete log → confirm | Log removed everywhere, vial draw-down restored, scheduled dose (if any) back to pending, delete syncs to other devices as a tombstone |
| S10 | Protocol journey (automated: S6) | Protocols → tap a mid-run protocol | Current week open at top with "now" badge; past/future weeks collapsed to one-line summaries (done/missed/skipped counts); past undone doses labeled missed, never "upcoming"; ad-hoc doses of the protocol's peptides listed with an ad-hoc chip; header counts due doses only |

## Protocols & scheduling

| # | Scenario | Expected |
|---|----------|----------|
| P1 | Create flat protocol (e.g. BPC-157 daily 4wk) | Schedule generated for full duration, correct times, vial prompt |
| P2 | Create titration protocol with custom start dose | Ladder scales proportionally to typed start dose (see `getTitrationDose`) |
| P3 | Edit protocol time/dose mid-run | Future upcoming doses updated; logged/skipped history untouched |
| P4 | Pause/archive protocol | No further doses on Dashboard/Quick Log; history retained |
| P5 | Delete protocol | Its scheduled doses gone (no orphans), logs retained, deletion syncs as tombstone |
| P6 | Weekday-only / custom-frequency cadence | Generated dates match the cadence; non-positive frequency rejected |

## Sync & auth (cloud build only)

| # | Scenario | Expected |
|---|----------|----------|
| C1 | Sign in on second device | First sync pulls everything; no duplicates |
| C2 | Reschedule on device A → open device B | B shows the new date after sync (LWW: newest edit wins) |
| C3 | Delete a log on A → open B | Deletion propagates (tombstone), vial restored once, not twice |
| C4 | Offline edit → reconnect | Edit pushed on next sync tick/focus; no error toast left behind |
| C5 | Sign out | Local IndexedDB wiped (no cross-account leak); sign-in restores from cloud |
| C6 | Sync failure (airplane mode mid-sync) | Status pill shows the error; app keeps working locally |

## Inventory, insights, misc

| # | Scenario | Expected |
|---|----------|----------|
| M1 | Log dose with active vial | dosesRemaining −1; hits 0 → vial marked empty, next vial auto-activates on prompt |
| M2 | Delete a dose log | Vial count restored +1; scheduled dose back to upcoming |
| M3 | Recon calculator round-trip | Forward solve then reverse-BAC with the result returns the input; U-100/U-40 setting honored |
| M4 | Reminders | Scheduled reminder fires at protocol time in the configured timezone; logging before the time cancels it; fires once per day max |
| M5 | Export → Clear All → Import | Full restore: protocols, logs, vials, markers; counts match pre-export |
| M6 | Owner filter (Victor/Nadia) | Every list (doses, logs, insights) filters consistently |
| M7 | PWA update | After a deploy, closing and reopening the installed app serves the new version (network-first SW); hard-reload never required for correctness |

## Release checklist

1. `npm test` — all green.
2. `node scripts/e2e-smoke.mjs` — S1–S8 pass, console clean.
3. Manual pass over the section(s) the change touched.
4. `scripts/deploy.sh`, then verify **on the live URL** (fresh profile or
   hard-reload): the changed behavior is visible and works. Local success ≠ done.
