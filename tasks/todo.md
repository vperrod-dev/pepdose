# pepdose — working tasks

> Plans for in-flight work live here as checkable items (see Task Management in claude-config/CLAUDE.md).
> Cross-project backlog: claude-config/os/backlog.md
> Full context for continuing on a laptop: see `HANDOFF.md` at the repo root.

## Done (shipped to `main`, live)

- [x] Fix dose-quantity save bug (string-backed `DecimalInput`)
- [x] Dose reminders (service-worker notifications; open/backgrounded only)
- [x] Active Levels chart (logged doses + forward projection)
- [x] Per-dose symptom logging + trends view
- [x] Reconstitution calculator: reverse-BAC, blend breakdown, live U-100/U-40
- [x] Reconstitution-aware inventory: auto doses-per-vial, beyond-use-date countdown
- [x] Adherence streak on the Dashboard
- [x] Deep GLOW + retatrutide content; 6 new peptide guides
- [x] Ad-hoc dose logging + assorted review fixes
- [x] Docs updated (README, CLAUDE.md, HANDOFF.md)

## Done — backlog repair 2026-07-17

- [x] 1. Deletion ledger: `deletions` store (schema v3), operations record deletes, sync.ts ledger-driven tombstones + remote-delete propagation; delta cursor left as `ponytail:` comment (push side needs a dirty set); tests
- [x] 2. AuthGate tests (jsdom + @testing-library/react, 6 tests)
- [x] 3. Auto-sync errors surfaced via fixed status pill in AuthGate (aria-live, auto-clears on next clean sync)
- [x] 4. importData: `validateImport` rejects malformed backups before any write
- [x] Verify: 124/124 tests, clean build, lint clean on touched files

Conservative choices (data safety): legacy unmarked cloud tombstones (from the old
absence heuristic) never delete local data — the local row is pushed back to repair
the cloud. `clearAllData` wipes the device only (no ledger entries), so it can't
delete the cloud copy.

## Remaining (see HANDOFF.md § Remaining roadmap for pointers)

- [ ] `.ics` calendar export of upcoming doses (S, local-first)
- [ ] Doctor-ready PDF / printable report (M, local-first)
- [ ] Wire or remove the remaining dead settings: `unitSystem`, `darkMode` (S)
- [ ] NewProtocol "custom interval" total-dose estimate (use `daysInCycle / customFrequencyDays`) (S)
- [ ] Reliable push-when-closed reminders — **needs a backend / Web Push** (deliberate decision)
