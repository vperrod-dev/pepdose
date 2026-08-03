export interface ProtocolBreak {
  /** 1-based week number within the protocol's total span (including off-cycle weeks). */
  weekStart: number;
  /** 1-based week number within the protocol's total span. */
  weekEnd: number;
  /** Human-readable reason shown in the calendar/timeline. */
  reason: string;
}

export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string;
  peptides: {
    peptideId: string;
    doseOverride?: number;
    unitOverride?: 'mcg' | 'mg' | 'IU';
    frequencyOverride?: string;
    // Per-peptide cycle length. Lets a combo protocol run each peptide for a
    // different duration (e.g. GLP-1 for months while a cosmetic peptide cycles
    // for weeks). Falls back to the template's durationWeeks when unset.
    durationWeeksOverride?: number;
    // Pre-select a variant for this peptide when the template is chosen.
    variantId?: string;
  }[];
  durationWeeks: number;
  category: string;
  /** Optional scheduled off-week ranges — weeks where no doses are generated for any peptide. */
  breaks?: ProtocolBreak[];
}

export const PROTOCOL_TEMPLATES: ProtocolTemplate[] = [
  {
    id: 'wolverine-healing',
    name: 'Wolverine Healing',
    description: 'BPC-157 + TB-500 for accelerated injury recovery. The gold-standard healing stack.',
    peptides: [
      { peptideId: 'bpc-157', doseOverride: 500, unitOverride: 'mcg' },
      { peptideId: 'tb-500', doseOverride: 2.5, unitOverride: 'mg' },
    ],
    durationWeeks: 6,
    category: 'Healing',
  },
  {
    id: 'gh-boost',
    name: 'GH Boost',
    description: 'CJC-1295 (no DAC) + Ipamorelin pre-bed for optimized growth hormone pulses.',
    peptides: [
      { peptideId: 'cjc-1295-no-dac', doseOverride: 100, unitOverride: 'mcg' },
      { peptideId: 'ipamorelin', doseOverride: 200, unitOverride: 'mcg' },
    ],
    durationWeeks: 12,
    category: 'Performance',
  },
  {
    id: 'weight-management-sema',
    name: 'Weight Management (Semaglutide)',
    description: 'Semaglutide titration protocol from 0.25mg to 2.4mg weekly. Auto-escalation schedule.',
    peptides: [
      { peptideId: 'semaglutide' },
    ],
    durationWeeks: 52,
    category: 'Weight Loss',
  },
  {
    id: 'weight-management-tirz',
    name: 'Weight Management (Tirzepatide)',
    description: 'Tirzepatide titration from 2.5mg to 15mg weekly. Dual GIP/GLP-1 agonist protocol.',
    peptides: [
      { peptideId: 'tirzepatide' },
    ],
    durationWeeks: 52,
    category: 'Weight Loss',
  },
  {
    id: 'weight-management-reta',
    name: 'Weight Management (Retatrutide)',
    description: 'Retatrutide titration from 2mg to 12mg weekly using the Phase 3 TRIUMPH-1 ladder. Triple agonist (GIP + GLP-1 + glucagon) for maximum weight-loss efficacy.',
    peptides: [
      { peptideId: 'retatrutide', variantId: 'clinical-trial' },
    ],
    durationWeeks: 80,
    category: 'Weight Loss',
  },
  {
    id: 'retatrutide-community-cycle',
    name: 'Retatrutide Community Cycle (8-on/8-off)',
    description: 'Self-reported community protocol: slower titration starting at 0.25-1mg, 8 weeks on at a lower peak (1.5-4mg), then 8 weeks off. Includes a 4-week taper to soften appetite rebound.',
    peptides: [
      { peptideId: 'retatrutide', variantId: 'community-cycle' },
    ],
    durationWeeks: 16,
    category: 'Weight Loss',
    breaks: [
      { weekStart: 9, weekEnd: 16, reason: 'Off-cycle (8 weeks off, community standard for receptor recovery)' },
    ],
  },
  {
    id: 'retatrutide-glow',
    name: 'Retatrutide + GLOW (Weight Loss + Skin)',
    description: 'Retatrutide weekly titration (Phase 3 ladder 2→4→6→9→12mg) for weight loss, paired with a phased GLOW blend cycle for skin support during rapid fat loss. GLOW defaults to the Standard 5-on/2-off cadence (pick a different variant in setup); retatrutide continues the full 24 weeks.',
    peptides: [
      { peptideId: 'retatrutide' },
      { peptideId: 'glow-blend', doseOverride: 2.33, unitOverride: 'mg' },
    ],
    durationWeeks: 24,
    category: 'Weight Loss',
    breaks: [
      { weekStart: 9, weekEnd: 24, reason: 'GLOW off-cycle (copper safety: 4-8 weeks off after initial cycle)' },
    ],
  },
  {
    id: 'nad-plus-ramp',
    name: 'NAD+ Ramp-Up (4 weeks)',
    description: 'Tolerance-building protocol: 25mg week 1, ramp to 50mg week 2, then 100mg weeks 3-4. Inject slowly — the flush/nausea is rate-dependent. Then 1-2 weeks off before re-assessing.',
    peptides: [
      { peptideId: 'nad-plus', variantId: 'ramp-up' },
    ],
    durationWeeks: 4,
    category: 'Longevity',
    breaks: [
      { weekStart: 5, weekEnd: 6, reason: 'Off-cycle (1-2 weeks rest, community default for subQ NAD+)' },
    ],
  },
  {
    id: 'nad-plus-steady',
    name: 'NAD+ Steady 100mg (4 weeks)',
    description: '100mg weekly (or split 2x/week) for 4 weeks, then 1-2 weeks off. For users with established tolerance who want consistent dosing without the ramp.',
    peptides: [
      { peptideId: 'nad-plus', variantId: 'steady-100' },
    ],
    durationWeeks: 6,
    category: 'Longevity',
    breaks: [
      { weekStart: 5, weekEnd: 6, reason: 'Off-cycle (no established maintenance; err conservative)' },
    ],
  },
  {
    id: 'melanotan-loading',
    name: 'Melanotan II Loading (2 weeks)',
    description: '250mcg daily pre-bed for 2 weeks to establish pigmentation. Then step down to 1-2x/week maintenance. Requires a baseline mole check. Includes a 4-week break after loading.',
    peptides: [
      { peptideId: 'melanotan-2', variantId: 'loading-standard' },
    ],
    durationWeeks: 6,
    category: 'Cosmetic',
    breaks: [
      { weekStart: 3, weekEnd: 6, reason: 'Off-cycle (minimum 4 weeks off between courses for melanocortin reset)' },
    ],
  },
  {
    id: 'ghk-cu-daily',
    name: 'GHK-Cu Daily Skin Protocol (4 weeks)',
    description: '2mg daily subcutaneous for 4 weeks, then 4 weeks off. Take zinc 15-25mg/day to counterbalance copper. Human data is topical only; injectable use is anecdotal.',
    peptides: [
      { peptideId: 'ghk-cu', variantId: 'daily-30d' },
    ],
    durationWeeks: 8,
    category: 'Cosmetic',
    breaks: [
      { weekStart: 5, weekEnd: 8, reason: 'Off-cycle (copper safety: 4 weeks off after daily GHK-Cu loading)' },
    ],
  },
  {
    id: 'ghk-cu-eod',
    name: 'GHK-Cu Every-Other-Day (Extended)',
    description: '2mg every other day for 6 weeks, then 4 weeks off. Lower copper load than daily while maintaining near-daily receptor activation. Zinc co-supplementation recommended.',
    peptides: [
      { peptideId: 'ghk-cu', variantId: 'eod-4wk' },
    ],
    durationWeeks: 10,
    category: 'Cosmetic',
    breaks: [
      { weekStart: 7, weekEnd: 10, reason: 'Off-cycle (copper safety: 4 weeks off after extended GHK-Cu run)' },
    ],
  },
  {
    id: 'ghk-cu-glow',
    name: 'GHK-Cu + BPC-157 + TB-500 (GLOW Blend)',
    description: '70mg blend vial: 50mg GHK-Cu + 10mg BPC-157 + 10mg TB-500. Standard 5-on/2-off for 8 weeks, then 4 weeks off. The canonical skin + recovery stack.',
    peptides: [
      { peptideId: 'glow-blend', variantId: 'glow-weekdays' },
    ],
    durationWeeks: 12,
    category: 'Cosmetic',
    breaks: [
      { weekStart: 9, weekEnd: 12, reason: 'Off-cycle (copper safety + collagen remodeling break)' },
    ],
  },
  {
    id: 'anti-aging-stack',
    name: 'Anti-Aging Stack',
    description: 'GHK-Cu daily + Epithalon 10-day course. Collagen regeneration + telomerase activation.',
    peptides: [
      { peptideId: 'ghk-cu', doseOverride: 2, unitOverride: 'mg' },
      { peptideId: 'epithalon', doseOverride: 10, unitOverride: 'mg' },
    ],
    durationWeeks: 8,
    category: 'Anti-Aging',
  },
  {
    id: 'recovery-stack',
    name: 'Recovery Stack',
    description: 'BPC-157 + TB-500 + KPV for comprehensive tissue repair with anti-inflammatory support.',
    peptides: [
      { peptideId: 'bpc-157', doseOverride: 500, unitOverride: 'mcg' },
      { peptideId: 'tb-500', doseOverride: 2.5, unitOverride: 'mg' },
      { peptideId: 'kpv', doseOverride: 500, unitOverride: 'mcg' },
    ],
    durationWeeks: 4,
    category: 'Healing',
  },
  {
    id: 'fat-loss-basic',
    name: 'Fat Loss (AOD-9604)',
    description: 'AOD-9604 morning fasting protocol. Targets stubborn fat without GH side effects.',
    peptides: [
      { peptideId: 'aod-9604', doseOverride: 300, unitOverride: 'mcg' },
    ],
    durationWeeks: 12,
    category: 'Fat Loss',
  },
  {
    id: 'mitochondrial-support',
    name: 'Mitochondrial Support (MOTS-c)',
    description: 'MOTS-c 5mg twice weekly as an exercise-mimetic AMPK activator. Report-only territory: there is no human efficacy data yet, a Phase 2a trial is still recruiting, and MOTS-c is WADA-prohibited at all times — do not run this if you are a tested athlete.',
    peptides: [
      { peptideId: 'mots-c', doseOverride: 5, unitOverride: 'mg' },
    ],
    durationWeeks: 6,
    category: 'Longevity',
  },
  {
    id: 'mots-c-cycle',
    name: 'MOTS-c 6-on / 6-off',
    description: '5mg twice weekly (EOD) for 6 weeks, then 6 weeks off — the most-cited community pattern. No human efficacy data; Phase 2a recruiting. WADA-prohibited.',
    peptides: [
      { peptideId: 'mots-c', variantId: 'standard-6on-6off' },
    ],
    durationWeeks: 12,
    category: 'Longevity',
    breaks: [
      { weekStart: 7, weekEnd: 12, reason: 'Off-cycle (6-on/6-off community convention)' },
    ],
  },
  {
    id: 'weight-management-oral',
    name: 'Weight Management (oral GLP-1)',
    description: 'Orforglipron daily, escalating 0.8 → 17.2mg with at least 30 days per step. The oral route with no fasting or water restriction — the practical advantage over oral semaglutide. FDA-approved April 2026; 5.5mg and 9mg are legitimate stopping points if response is adequate.',
    peptides: [
      { peptideId: 'orforglipron' },
    ],
    durationWeeks: 52,
    category: 'Weight Loss',
  },
  {
    id: 'gh-pulse-ghrp2',
    name: 'GH Pulse (Mod GRF + GHRP-2)',
    description: 'Mod GRF 1-29 with GHRP-2 pre-bed — a GHRH analog plus a ghrelin-receptor agonist amplify the GH pulse synergistically. Both dose at their saturation point (100mcg); going higher adds cortisol and prolactin rather than growth hormone. Inject fasted and wait 20-30 minutes before eating.',
    peptides: [
      { peptideId: 'cjc-1295-no-dac', doseOverride: 100, unitOverride: 'mcg' },
      { peptideId: 'ghrp-2', doseOverride: 100, unitOverride: 'mcg' },
    ],
    durationWeeks: 8,
    category: 'Performance',
  },
  {
    id: 'immune-support-ta1',
    name: 'Immune Support (Thymosin Alpha-1)',
    description: 'Thymosin alpha-1 1.6mg twice weekly — the dose used in the hepatitis B registration trials, and the best-evidenced protocol in this library. Effects are immunological and silent, so judge over 8-12 weeks rather than days. Vials ship at 1.6mg, not the usual 5mg.',
    peptides: [
      { peptideId: 'thymosin-alpha-1', doseOverride: 1.6, unitOverride: 'mg' },
    ],
    durationWeeks: 12,
    category: 'Healing',
  },
  {
    id: 'cognitive-stack',
    name: 'Cognitive Enhancement',
    description: 'Semax + Selank intranasal stack for focus, memory, and anxiety reduction.',
    peptides: [
      { peptideId: 'semax', doseOverride: 600, unitOverride: 'mcg' },
      { peptideId: 'selank', doseOverride: 500, unitOverride: 'mcg' },
    ],
    durationWeeks: 4,
    category: 'Nootropic',
  },
];
