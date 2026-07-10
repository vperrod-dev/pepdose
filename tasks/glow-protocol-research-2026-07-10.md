# GLOW protocol research + data update — 2026-07-10

Verified GLOW (70mg: GHK-Cu 50 + TB-500 10 + BPC-157 10) dosing protocols against
live vendor sources and updated the peptide data. **All sources are vendor/community,
not clinical** — no human trials of the blend exist. The only literature-backed piece
is the GHK-Cu copper-cycling mechanism.

## Consensus verified

- **Per-dose standard: 2.33mg = 10 units** on a U-100 syringe, from a **70mg + 3.0mL**
  reconstitution (23.3mg/mL). Confirmed by peptidedeck, peptidedosages,
  peptidedosingprotocols. The "10 units = 2.33mg" identity only holds at 3.0mL — one
  source (peptidefox) uses 2.5mL, which silently changes the math. Our data uses 3.0mL.
- **Modal cycle:** ~2.33mg daily, ~4 weeks on / 2–4 weeks off. Longer 8–12wk runs pair
  with a taper (daily → 5×/wk → 2–3×/wk) and a longer 4–8wk break.
- **High-dose tier:** 3–5mg (13–21 units), 5-on/2-off, 4–6wk.
- **Limiting factor = GHK-Cu copper accumulation** (not BPC-157/TB-500). Off-cycle length
  is contested: 10–14 days (mechanistic CTR1-recovery argument) vs 2–4+ weeks (community)
  vs 30–60 on / equal off (general GHK-Cu). Warning signs: metallic taste, nausea, GI upset.
- **Zinc 15–25mg/day** recommended to counterbalance copper (new detail, was not in the app).

## Changes shipped

- `data/peptides.ts` glow-blend variants:
  - Renamed `glow-weekdays` → **"Standard (5-on/2-off, 8wk)"** and reordered it first — it
    is the canonical protocol, was previously buried under a homemade "short taper".
  - Added **`glow-maintenance`** (every-other-day, 8wk) — the lightest standalone cadence
    (2–3×/wk isn't expressible in the frequency enum; EOD is the closest schedulable option).
  - Added off-cycle spacing to every variant description (short cycles 2–4wk off, long 4–8wk).
  - Kept all existing variant IDs stable (saved protocols reference `variantId`).
- `data/peptides.ts` glow-blend `cyclingReason`: locked the 3.0mL mix rationale, added the
  contested off-cycle guidance and zinc counterbalance.
- `data/experienceTimelines.ts` glow-blend: expanded `postCycleNotes` (contested off-cycle
  length) and added a zinc community tip.
- `data/protocols.ts` retatrutide-glow: combo now defaults GLOW to the Standard cadence
  (variant reorder side effect) — description updated to match.

## Sources

- https://www.peptidedeck.com/glow-dosage-chart
- https://peptidedosages.com/peptide-blend-dosages/glow-peptide-blend-70-mg-vial-dosage-protocol/
- https://peptidefox.com/tools/glow-dosage-calculator
- https://www.peptidedosingprotocols.com/stacks/glow-stack
- https://www.realpeptides.co/tolerance-ghk-cu-cycling-research-protocols/ (CTR1 mechanism)

## Not done (deliberate)

- No new structured `offWeeks` field — the app schedules single cycles, so off-cycle is
  advisory only; text in descriptions/cyclingReason is enough.
- Skipped the "loading + maintenance split (no taper)" variant — near-duplicate of the
  existing Loading + Taper; 7 variants already cover the spectrum.
