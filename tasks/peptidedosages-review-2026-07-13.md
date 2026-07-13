# peptidedosages.com knowledge review — 2026-07-13

Source: https://peptidedosages.com/ (110 protocols: 95 single, 11 blends, 4 stacks + educational guides).

## Verdict
Site's value is **breadth**, not corrections. Spot-check of Retatrutide: our entry is *more*
current (2026 Phase 3 TRIUMPH-1 data, 2→4→6→9→12 ladder) than theirs (Phase 2 2023, 2→4→6→8).
Our existing 19 peptides are well-sourced — do NOT bulk-overwrite them. Mine the site to fill gaps.

**Caveat:** never trust a single site for dosing. Every new entry should be cross-checked against
a second source (trials/PubMed/community consensus) before shipping, same bar as existing entries.

## What we already have (19 + GLOW variants)
aod-9604, bpc-157, cjc-1295-dac, cjc-1295-no-dac, epithalon, ghk-cu, ipamorelin, kpv, mk-677,
nad-plus, pt-141, retatrutide, selank, semaglutide, semax, sermorelin, tb-500, tesamorelin, tirzepatide

## Gap analysis — high-value additions by existing category

### glp1 / fat_loss (fits current categories, high user demand)
- Cagrilintide — amylin analog, pairs with sema/tirz; hot right now
- Mazdutide (GLP-1/glucagon), Survodutide (GLP-1/glucagon) — reta-adjacent
- 5-Amino-1MQ — oral NNMT inhibitor, fat loss
- MOTS-C — mitochondrial, metabolic + endurance
- SLU-PP-332, Adipotide, AOD-9604 (have)

### gh_secretagogue
- GHRP-2, GHRP-6 — classic GHRPs, common stacks with CJC
- IGF-1 LR3, MGF / PEG-MGF — downstream GH axis
- Hexarelin, HGH 191AA

### healing
- Thymosin Alpha-1 — immune, well-researched
- LL-37 — antimicrobial/healing
- Blends: BPC-157+TB-500, Tri-Heal (TB-500+BPC-157+KPV)

### sexual_health
- Melanotan II (+ tanning), Kisspeptin, Oxytocin, Gonadorelin, HCG, HMG

### nootropic
- DSIP (sleep), Cerebrolysin, PE-22-28, Dihexa, P21

### cosmetic
- SNAP-8 (topical), (GHK-Cu already have)

### NEW category needed: longevity / bioregulators (Khavinson peptides)
Site has a large family we can't classify under current 7 categories:
- SS-31 / Elamipretide (mito), FOXO4-DRI (senolytic)
- Pinealon, Vesugen, Vilon, Cortagen, Livagen, Prostamax, Testagen, Ovagen, Cartalax, Chonluten
- Would require adding a `longevity` (or `bioregulator`) PeptideCategory.

### Blends we lack (we only have GLOW)
KLOW (80mg), BPC+TB-500 (10/20mg), Tri-Heal, Cagrilintide+Semaglutide,
CJC-1295+GHRP-2, CJC-1295 no-DAC+Ipamorelin, Tesamorelin+Ipamorelin.

## Educational content worth borrowing (into ExperienceGuide / docs)
Their guides are clean and citeable: Beginner's Guide, Reconstitution Guide, Syringe &
Measurement Guide, Storage Guide, Glossary, FAQ. Could enrich our experienceTimelines.ts
tips/mistakes sections and the recon calculator help text — no schema change needed.

## Recommended tiering
- **Tier 1 (biggest bang, fits schema):** Cagrilintide, GHRP-2, GHRP-6, Thymosin Alpha-1,
  Melanotan II, MOTS-C, IGF-1 LR3, Mazdutide + KLOW/BPC-TB/Tri-Heal blends. ~11 entries.
- **Tier 2:** remaining GH/sexual/nootropic singles above.
- **Tier 3 (NOT done):** new `longevity` category + bioregulator family (schema change).

## SHIPPED 2026-07-13 (Tier 1 + Tier 2)
26 new peptides added to `src/data/peptides.ts` (20 → 46 total), each cross-verified
against ≥2 sources (peptidedosages.com + trial data / independent reference):
- **Singles (21):** cagrilintide, mazdutide, survodutide, mots-c, 5-amino-1mq, slu-pp-332,
  ghrp-2, ghrp-6, igf-1-lr3, peg-mgf, hexarelin, thymosin-alpha-1, ll-37, melanotan-2,
  kisspeptin, oxytocin, hcg, gonadorelin, dsip, cerebrolysin, pe-22-28.
- **Blends (5):** klow, bpc-157-tb-500, tri-heal, tesamorelin-ipamorelin, cagrilintide-semaglutide.
- **Experience guides (8):** rich week-by-week guides added to `experienceTimelines.ts` for the
  highest-traffic new entries — cagrilintide, mazdutide, cagrilintide-semaglutide, mots-c,
  klow, bpc-157-tb-500, melanotan-2, thymosin-alpha-1 (folding in the site's reconstitution +
  syringe-measurement guidance). Remaining 18 render core data but have no deep guide yet
  (graceful — the guide page just omits the button).

Verified: `npx tsc -b` clean, `npm run build` OK, `npm test` 71/71, ESLint clean, no duplicate IDs.

## Known limitations to revisit
- **HCG uses `unit: 'mcg'` as a placeholder for IU** (schema has no `iu` unit). Real dosing
  (250–2500 IU) + 5000-IU vial are documented in mechanism/cycling text, but the recon calculator
  will show misleading mg/mcg. Proper fix = add `'iu'` to the unit enum + calculator support. Deferred.
- Bioregulators (SS-31, FOXO4-DRI, Khavinson family) still need a new `longevity` category (Tier 3).
