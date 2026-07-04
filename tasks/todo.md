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

## Remaining (see HANDOFF.md § Remaining roadmap for pointers)

- [ ] `.ics` calendar export of upcoming doses (S, local-first)
- [ ] Doctor-ready PDF / printable report (M, local-first)
- [ ] Wire or remove the remaining dead settings: `unitSystem`, `darkMode` (S)
- [ ] NewProtocol "custom interval" total-dose estimate (use `daysInCycle / customFrequencyDays`) (S)
- [ ] Reliable push-when-closed reminders — **needs a backend / Web Push** (deliberate decision)
