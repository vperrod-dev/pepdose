# pepdose — lessons

> After ANY correction from the user: record the pattern here so the mistake isn't repeated.
> Review at session start.

- **Numeric inputs must be string-backed.** A controlled `type="number"` bound to
  numeric state with `parseFloat(e.target.value) || 0` snaps decimals and clears to
  `0` mid-typing — and if a Save button is disabled on `value <= 0`, edits silently
  fail. This was the user's original "changing the dose doesn't save" bug. Use
  `src/components/DecimalInput.tsx` (parses at save time) for any decimal field.

- **Deploy is Caddy on the VM, NOT GitHub Pages.** `scripts/deploy.sh` builds and
  rsyncs `dist/` → `/srv/pepdose`, served by Caddy at `/pepdose*`. Pushing to `main`
  does NOT deploy. The old `.github/workflows/deploy.yml` (Pages) is dead while the
  GitHub account block holds (ticket 4583559). Never say "GitHub Pages" for pepdose —
  read `scripts/deploy.sh` + CLAUDE.md before making any deploy/hosting claim. (User
  correction, twice: reading stale docs and repeating "GitHub Pages".)

- **"Still failing" after a committed fix → check the deployed bundle first, then
  reproduce like a user.** The 07-23 reschedule/ad-hoc fix (f3f3dfc) sat undeployed
  for 3 days — committed ≠ shipped for this project (deploy is manual
  `scripts/deploy.sh`). Every deploy must end with the live-URL check, and every
  user-facing fix now has to pass `npm run test:e2e` (scripts/e2e-smoke.mjs) —
  Victor's explicit ask: validate with user scenarios, not just unit tests.
  Catalog: docs/USER-TESTING.md.

- **Victor reads over a tunnel/phone — a VM file path is not a deliverable.** Writing
  a report to `tasks/*.md` and replying "it's at ~/projects/..." is useless to him
  (recurring correction, 2026-07-27: "cant see the markdown file - this is a tunnel!
  you always make the same mistake"). Every report/plan/proposal must ship a readable
  URL in the same turn: publish as a Claude artifact (private link) or serve via VM
  Caddy. The repo copy is the record; the URL is the deliverable.

- **Duplicate rows that survive deletion = a sync merge bug, not a UI bug.** 2026-08-05:
  Victor reported triplicated MOTS-c calendar entries. I burned three rounds on wrong
  hypotheses (paused-protocol leak, then duplicate protocols) because I reasoned from
  code instead of from his data, and each "fix" shipped without touching the cause. The
  real cause: `sync.ts rowTs` fell back to `date` — the *injection* day — so a future
  dose outranked the delete that removed it and the cloud handed it back on every sync.
  Rules taken from this: (1) when a delete doesn't stick, suspect LWW timestamps before
  anything else; (2) never merge on a domain date that can be in the future; (3) when a
  hypothesis can't be checked against the user's own data, say so and get the data —
  don't ship a speculative fix and call it a diagnosis. Victor cannot paste console
  output back, so diagnostics have to be reproducible locally from his described
  symptom (dose values 2.5/2.5/5 on one day were the decisive clue).
