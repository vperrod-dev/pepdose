export type PeptideCategory =
  | 'healing'
  | 'glp1'
  | 'gh_secretagogue'
  | 'fat_loss'
  | 'cosmetic'
  | 'sexual_health'
  | 'nootropic'
  | 'longevity';

export type InjectionRoute = 'subq' | 'im' | 'oral' | 'intranasal' | 'topical';
export type FrequencyType = 'daily' | '5x_week' | 'eod' | 'weekly' | 'biweekly' | 'custom';
export type TimeOfDay = 'morning_fasting' | 'morning' | 'evening' | 'pre_bed' | 'before_activity' | 'any';

export interface TitrationStep {
  weekStart: number;
  weekEnd: number;
  dose: number;
  unit: 'mcg' | 'mg';
}

// A phase of a tapered protocol: a week range run at a given cadence.
export interface SchedulePhase {
  weekStart: number;
  weekEnd: number;
  frequency: FrequencyType;
}

// A named, selectable phased protocol (e.g. the several ways people cycle GLOW).
export interface ProtocolVariant {
  id: string;
  name: string;
  description: string;
  phases: SchedulePhase[];
  doseOverride?: number;
  source?: string;
}

export interface DosingProtocol {
  low: number;
  standard: number;
  high: number;
  unit: 'mcg' | 'mg';
  frequency: FrequencyType;
  customFrequencyDays?: number;
  timesPerDay?: number;
  cycleWeeks: number;
  offCycleWeeks: number;
  titration?: TitrationStep[];
  // Selectable phased protocols. When present, the UI offers a variant picker and
  // the schedule engine generates doses from the chosen variant's phases.
  protocolVariants?: ProtocolVariant[];
  timeOfDay: TimeOfDay;
  withFood: 'fasting' | 'fed' | 'either';
}

export interface Peptide {
  id: string;
  name: string;
  aliases: string[];
  category: PeptideCategory;
  halfLifeHours: number;
  /**
   * Caveat on halfLifeHours. Many compounds here have no human PK study at all —
   * the number is animal-derived, a vendor claim, or a placeholder so the active-levels
   * curve has something to draw. Say so here; the UI shows it wherever the value is used.
   */
  halfLifeNote?: string;
  mechanismShort: string;
  route: InjectionRoute;
  needleGauge: string;
  dosing: DosingProtocol;
  /** Approval / prescription / compounding status, with an as-of date. This moves. */
  regulatoryStatus?: string;
  /** Hard safety facts that belong nowhere else (trial deaths, boxed warnings, contraindications). */
  safetyFlags?: string[];
  reconstitution: {
    typicalVialMg: number;
    bacWaterMl: number;
    shelfLifeDays: number;
    storageTemp: string;
    // For blends (e.g. GLOW/KLOW): the per-component masses in the vial. The
    // reconstitution calculator uses the ratios to break a drawn dose down.
    components?: { name: string; mg: number }[];
  };
  cyclingReason: string;
  isCustom?: boolean;
}

export const PEPTIDES: Peptide[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    aliases: ['Body Protection Compound 157', 'PL 14736'],
    category: 'healing',
    halfLifeHours: 0.25,
    halfLifeNote: 'Under 30 minutes by every measured route in animals (15 min IV rat, 5 min IV dog, 8-30 min IM). No human PK study exists.',
    mechanismShort: 'Peptide derived from a gastric juice protein. Associated with angiogenesis and tendon/ligament repair via VEGFR2 signalling — but that mechanism is from rodent models only, and no BPC-157 receptor has ever been identified.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 200,
      standard: 500,
      high: 800,
      unit: 'mcg',
      frequency: 'daily',
      timesPerDay: 1,
      cycleWeeks: 6,
      offCycleWeeks: 4,
      timeOfDay: 'any',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 5,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved anywhere. FDA removed it from compounding Category 2 in April 2026 and an advisory committee voted favourably (8-6) in July 2026, but it is not on the 503A list — so it is still not legally compoundable. WADA prohibited (S0).',
    safetyFlags: [
      'No published randomised controlled trial exists for any indication. A 2025 systematic review found 36 studies: 35 preclinical and one small retrospective series.',
    ],
    cyclingReason: 'Cycled by convention. The common claim that this "prevents receptor desensitization" is unfounded — no BPC-157 receptor has been identified. Users report effects persisting 2-4 weeks post-cycle.',
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    aliases: ['Ac-LKKTETQ', 'Thymosin Beta 4 fragment 17-23'],
    category: 'healing',
    halfLifeHours: 1,
    halfLifeNote: 'No human PK exists for the TB-500 heptapeptide at all. Full-length Thymosin β4 given IV in humans ranges 0.5-2.1h and the half-life rises with dose, so a single number is approximate at best.',
    mechanismShort: 'Promotes cell migration, blood vessel formation, and tissue regeneration. Reduces inflammation via actin-binding.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 2,
      standard: 2.5,
      high: 5,
      unit: 'mg',
      frequency: 'custom',
      customFrequencyDays: 3,
      cycleWeeks: 6,
      offCycleWeeks: 4,
      timeOfDay: 'any',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 5,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved anywhere. Removed from FDA compounding Category 2 in April 2026 with a favourable advisory-committee vote (8-6) in July 2026, but not yet on the 503A list — so not legally compoundable. WADA prohibited (S2.3, growth factors — the list names TB-500 explicitly).',
    safetyFlags: [
      'TB-500 is not the same molecule as Thymosin β4. TB-500 is a 7-amino-acid fragment; Tβ4 is a 43-amino-acid protein. Research on one does not automatically apply to the other.',
      'Contraindicated with active or prior malignancy: Thymosin β4 overexpression promotes tumour angiogenesis and metastasis in animal models.',
    ],
    cyclingReason: 'Cycled by convention: a loading period followed by lower-frequency maintenance. Note the every-3-days schedule here does not itself de-escalate — adjust frequency manually if following a load-then-maintain protocol.',
  },
  {
    id: 'kpv',
    name: 'KPV',
    aliases: ['Lys-Pro-Val', 'Alpha-MSH fragment'],
    category: 'healing',
    halfLifeHours: 2,
    halfLifeNote: 'Not established — no human PK study exists. The FDA found no published study of KPV administration in humans. Treat this number as a placeholder.',
    mechanismShort: 'Anti-inflammatory tripeptide derived from alpha-MSH. Inhibits NF-kB pathway. Used for gut inflammation and skin healing.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 200,
      standard: 500,
      high: 1000,
      unit: 'mcg',
      frequency: 'daily',
      cycleWeeks: 4,
      offCycleWeeks: 2,
      timeOfDay: 'morning',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 5,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved anywhere. Removed from FDA compounding Category 2 in April 2026 with a favourable advisory-committee vote (8-6) in July 2026, but not yet on the 503A list.',
    safetyFlags: [
      'No established human dose — nothing bridges the micromolar concentrations used in mouse drinking-water studies to a human microgram injection.',
      'For gut inflammation specifically, the effect in animal models depends on PepT1 uptake by colonic cells (it disappears in PepT1-knockout mice). Subcutaneous injection bypasses that route.',
    ],
    cyclingReason: 'Short cycles by convention — the 4-on/2-off pattern has no supporting data. Anti-inflammatory effects are reported to build over 2-3 weeks.',
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    aliases: ['Ozempic', 'Wegovy'],
    category: 'glp1',
    halfLifeHours: 168,
    mechanismShort: 'GLP-1 receptor agonist. Slows gastric emptying, increases insulin secretion, reduces appetite via hypothalamic signaling.',
    route: 'subq',
    needleGauge: '30-31G insulin',
    dosing: {
      low: 0.25,
      standard: 1,
      high: 2.4,
      unit: 'mg',
      frequency: 'weekly',
      cycleWeeks: 52,
      offCycleWeeks: 0,
      timeOfDay: 'any',
      withFood: 'either',
      titration: [
        { weekStart: 1, weekEnd: 4, dose: 0.25, unit: 'mg' },
        { weekStart: 5, weekEnd: 8, dose: 0.5, unit: 'mg' },
        { weekStart: 9, weekEnd: 12, dose: 1.0, unit: 'mg' },
        { weekStart: 13, weekEnd: 16, dose: 1.7, unit: 'mg' },
        { weekStart: 17, weekEnd: 999, dose: 2.4, unit: 'mg' },
      ],
    },
    reconstitution: {
      typicalVialMg: 5,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Prescription medicine. Ozempic (T2D, max 2mg), Wegovy (weight management, max now 7.2mg after ≥4 weeks tolerating 2.4mg; 2.4mg remains max for cardiovascular, paediatric and MASH indications). Rybelsus and oral Wegovy are separate ORAL daily products — see safety flags.',
    safetyFlags: [
      'Rybelsus (oral, daily, 3→7→14mg) and oral Wegovy (daily, 1.5→4→9→25mg) are ORAL tablets and are NOT the same protocol as this weekly injection. Never apply an oral dose subcutaneously or vice versa.',
      'If two or more consecutive weekly doses are missed, the label says to reinitiate escalation at a lower dose rather than resume at the previous one.',
      'Risk of pulmonary aspiration during general anesthesia or deep sedation — tell any surgeon or anesthetist you are on a GLP-1 before a procedure.',
      'Labeled warnings include acute pancreatitis, gallbladder disease, ileus and acute kidney injury from volume depletion. EMA added NAION (a rare eye condition, roughly 2x risk) to the product information.',
      'Reconstituted-vial shelf life here is 28 days. The 56-day figure belongs to the branded preserved multi-dose pen, not a self-reconstituted vial.',
    ],
    cyclingReason: 'Typically long-term use. Titration critical to minimize GI side effects. Consult provider for discontinuation.',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    aliases: ['Mounjaro', 'Zepbound'],
    category: 'glp1',
    halfLifeHours: 132,
    mechanismShort: 'Dual GIP/GLP-1 receptor agonist. More potent appetite suppression and glucose control than GLP-1 alone.',
    route: 'subq',
    needleGauge: '30-31G insulin',
    dosing: {
      low: 2.5,
      standard: 10,
      high: 15,
      unit: 'mg',
      frequency: 'weekly',
      cycleWeeks: 52,
      offCycleWeeks: 0,
      timeOfDay: 'any',
      withFood: 'either',
      titration: [
        { weekStart: 1, weekEnd: 4, dose: 2.5, unit: 'mg' },
        { weekStart: 5, weekEnd: 8, dose: 5, unit: 'mg' },
        { weekStart: 9, weekEnd: 12, dose: 7.5, unit: 'mg' },
        { weekStart: 13, weekEnd: 16, dose: 10, unit: 'mg' },
        { weekStart: 17, weekEnd: 20, dose: 12.5, unit: 'mg' },
        { weekStart: 21, weekEnd: 999, dose: 15, unit: 'mg' },
      ],
    },
    reconstitution: {
      typicalVialMg: 10,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Prescription medicine. Mounjaro (type 2 diabetes) and Zepbound (weight management, plus obstructive sleep apnea in adults with obesity — OSA maintenance is 10 or 15mg only).',
    safetyFlags: [
      'Missed dose: take it within 4 days (96 hours). If more than 4 days have passed, skip it and resume on schedule. Never take two doses within 72 hours.',
      'Risk of pulmonary aspiration during general anesthesia or deep sedation — tell any surgeon or anesthetist you are on a GLP-1 before a procedure.',
      'Labeled warnings include acute pancreatitis, gallbladder disease, ileus and acute kidney injury from volume depletion.',
      'Reconstituted-vial shelf life here is 28 days. The 56-day figure belongs to the branded preserved pen; Zepbound itself is only 21 days out of the fridge.',
    ],
    cyclingReason: 'Long-term use typical. Strict 4-week minimum per titration step.',
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    aliases: ['LY3437943', 'Reta'],
    category: 'glp1',
    halfLifeHours: 144,
    mechanismShort: 'Triple agonist: GIP + GLP-1 + glucagon receptors. Phase 2 (NEJM 2023) showed up to -24.2% body weight at 48 weeks; Phase 3 TRIUMPH-1 (2026, 80 weeks) reported -28.3% at 12mg / -25.9% at 9mg — the largest Phase 3 obesity weight loss to date. The glucagon component adds energy expenditure and hepatic fat reduction beyond pure GLP-1 agonists (and drives its signature heart-rate rise and dysesthesia). Investigational, not FDA-approved.',
    route: 'subq',
    needleGauge: '30-31G insulin',
    dosing: {
      low: 4,
      standard: 9,
      high: 12,
      unit: 'mg',
      frequency: 'weekly',
      cycleWeeks: 80,
      offCycleWeeks: 0,
      timeOfDay: 'any',
      withFood: 'either',
      titration: [
        { weekStart: 1, weekEnd: 4, dose: 2, unit: 'mg' },
        { weekStart: 5, weekEnd: 8, dose: 4, unit: 'mg' },
        { weekStart: 9, weekEnd: 12, dose: 6, unit: 'mg' },
        { weekStart: 13, weekEnd: 16, dose: 9, unit: 'mg' },
        { weekStart: 17, weekEnd: 999, dose: 12, unit: 'mg' },
      ],
    },
    reconstitution: {
      typicalVialMg: 10,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Investigational — not approved anywhere. Lilly announced (July 2026) it will file for approval in Q1 2027. Any material available now is unregulated.',
    safetyFlags: [
      'Dysesthesia (abnormal skin sensation) was dose-dependent in TRIUMPH-1: 5.1% / 12.3% / 12.5% at 4 / 9 / 12mg versus 0.9% on placebo.',
      'Dose-dependent resting heart rate rise of roughly 5-10 bpm, peaking around week 24 — a glucagon-receptor effect that semaglutide and tirzepatide do not share.',
      'Discontinuation for side effects reached 11.3% at 12mg in Phase 3.',
      'Reconstitution figures here describe grey-market compounded product. No approved label exists to validate them.',
    ],
    cyclingReason: 'Continuous therapy, not cycled — TRIUMPH-1 ran 80 weeks plus a 24-week extension without interruption. Uses the Phase 3 escalation (2→4→6→9→12mg, 4-week steps). Nausea rose 28.6% → 38.4% → 42.4% across 4/9/12mg and vomiting roughly doubled from 4mg to 9mg (10.6% → 22.8%), so slower titration is common. Monitor liver enzymes and lipids.',
  },
  {
    id: 'cjc-1295-no-dac',
    name: 'Mod GRF 1-29',
    aliases: ['CJC-1295 (no DAC)', 'Modified GRF 1-29', 'Mod GRF'],
    category: 'gh_secretagogue',
    halfLifeHours: 0.5,
    halfLifeNote: 'Vendor consensus spans 30 minutes to 2 hours. No primary human PK study exists for this compound.',
    mechanismShort: 'GHRH analog that stimulates pulsatile GH release from pituitary. Best combined with a GHRP like Ipamorelin. Despite the common name, this is NOT CJC-1295 — CJC-1295 is by definition the DAC-conjugated version.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 100,
      standard: 100,
      high: 300,
      unit: 'mcg',
      frequency: 'daily',
      timesPerDay: 2,
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'pre_bed',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 2,
      bacWaterMl: 2,
      shelfLifeDays: 21,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved. Removed from FDA compounding Category 2 in Sept 2024 because the nomination was withdrawn — that is not a safety clearance. WADA prohibited (S2).',
    safetyFlags: [
      'The "1 mcg/kg saturation dose" rationale often quoted for this compound is borrowed from the GHRP class and does not apply to a GHRH analog — trial data showed GH response still rising across a 30-fold dose range.',
      'Two doses per day cannot both be pre-bed. Set the second slot explicitly (commonly post-workout or on waking).',
    ],
    cyclingReason: 'GH pulsatility may blunt with continuous use. 12 weeks on, 4 weeks off preserves response.',
  },
  {
    id: 'cjc-1295-dac',
    name: 'CJC-1295 (with DAC)',
    aliases: ['CJC-1295 DAC', 'DAC:GRF', 'Drug Affinity Complex'],
    category: 'gh_secretagogue',
    halfLifeHours: 167,
    halfLifeNote: 'Measured range 5.8-8.1 days (139-194h) in the original trial; 167h is the midpoint. The IGF-1 elevation tails for up to 28 days.',
    mechanismShort: 'Long-acting GHRH analog with DAC for albumin binding. Provides sustained GH elevation (not pulsatile).',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 1,
      standard: 2,
      high: 2,
      unit: 'mg',
      frequency: 'weekly',
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'any',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 2,
      bacWaterMl: 2,
      shelfLifeDays: 21,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Never approved. Development was discontinued after the Phase II halt (see safety flags). Removed from FDA compounding Category 2 in Sept 2024 because the nomination was withdrawn — that is not a safety clearance.',
    safetyFlags: [
      'The ConjuChem Phase II trial was halted in July 2006 after a participant died of a heart attack hours after their 11th dose. The programme was discontinued and the compound was never approved.',
    ],
    cyclingReason: 'Sustained GH elevation can cause water retention and insulin resistance. Cycling mitigates side effects. Time of day is irrelevant with a ~7-day half-life — pick any consistent slot.',
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aliases: ['Ipam'],
    category: 'gh_secretagogue',
    halfLifeHours: 2,
    mechanismShort: 'Selective ghrelin receptor agonist (GHRP). Stimulates GH release without significant cortisol or prolactin increase.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 100,
      standard: 200,
      high: 300,
      unit: 'mcg',
      frequency: 'daily',
      timesPerDay: 2,
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'pre_bed',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 2,
      bacWaterMl: 2,
      shelfLifeDays: 21,
      storageTemp: '2-8°C refrigerated',
    },
    cyclingReason: 'Best paired with CJC-1295 (no DAC) for synergistic GH pulse. Cycle to maintain receptor sensitivity.',
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    aliases: ['GRF 1-29', 'Geref'],
    category: 'gh_secretagogue',
    halfLifeHours: 0.2,
    mechanismShort: 'Natural GHRH fragment (first 29 amino acids). Stimulates physiological GH release. Mildest GH secretagogue.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 100,
      standard: 300,
      high: 500,
      unit: 'mcg',
      frequency: 'daily',
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'pre_bed',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 2,
      bacWaterMl: 2,
      shelfLifeDays: 21,
      storageTemp: '2-8°C refrigerated',
    },
    cyclingReason: 'Very short half-life, mimics natural GHRH pulse. Cycle to prevent pituitary desensitization.',
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    aliases: ['Egrifta SV', 'Egrifta WR', 'Tesamorelin F8'],
    category: 'gh_secretagogue',
    halfLifeHours: 0.43,
    halfLifeNote: 'Formulation-dependent: 26 min (healthy) / 38 min (HIV+) on the original Egrifta label, ~11 min on the current Egrifta WR label.',
    mechanismShort: 'GHRH analog approved for reducing excess visceral abdominal fat in HIV-associated lipodystrophy. Strong GH stimulation.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 1.28,
      standard: 1.4,
      high: 1.4,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'pre_bed',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 2,
      bacWaterMl: 0.5,
      shelfLifeDays: 0,
      storageTemp: '20-25°C room temperature — Egrifta WR label says do not freeze or refrigerate',
    },
    regulatoryStatus: 'Prescription medicine. Egrifta SV (2mg vial, 1.4mg dose) and Egrifta WR (11.6mg vial, 1.28mg dose, approved Mar 2025) are the current products; original Egrifta discontinued.',
    safetyFlags: [
      'The 2mg figure often quoted as a dose is the VIAL STRENGTH, not the dose. Labeled doses are 1.4mg (SV) and 1.28mg (WR).',
      'Egrifta SV: reconstitute with 0.5mL sterile water and inject 0.35mL immediately — discard the remainder, do not store. Egrifta WR: 1.3mL, use within 7 days.',
      'Label therapy is continuous, not cycled — visceral fat rebounds on discontinuation.',
    ],
    cyclingReason: 'No label-supported cycling: therapy is continuous and visceral fat returns when stopped. Any off-cycle here is user convention, not label guidance.',
  },
  {
    id: 'mk-677',
    name: 'MK-677',
    aliases: ['Ibutamoren', 'Nutrobal'],
    category: 'gh_secretagogue',
    halfLifeHours: 5,
    halfLifeNote: 'Elimination half-life is roughly 4-6h (animal-derived). The widely quoted "24 hours" is the duration of the IGF-1 effect, not the half-life — the two get conflated constantly. Once-daily dosing is justified by that effect duration, not by clearance.',
    mechanismShort: 'Oral ghrelin mimetic. Long-acting GH secretagogue. Increases appetite, GH, and IGF-1 without injection.',
    route: 'oral',
    needleGauge: 'N/A (oral)',
    dosing: {
      low: 10,
      standard: 25,
      high: 25,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'pre_bed',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 0,
      bacWaterMl: 0,
      shelfLifeDays: 365,
      storageTemp: 'Room temperature, away from light',
    },
    regulatoryStatus: 'Unapproved new drug. Not lawful as a supplement ingredient; FDA issued warning letters as recently as Dec 2025. WADA prohibited (S2) and on the US Department of Defense prohibited list.',
    safetyFlags: [
      'A Phase IIb hip-fracture trial was terminated early for a congestive heart failure signal. The authors concluded the compound had an unfavourable safety profile and Merck discontinued development.',
      'A 2-year randomised trial found fasting glucose rose, insulin sensitivity decreased, and cortisol increased. Monitor blood glucose if using.',
    ],
    cyclingReason: 'Can cause insulin resistance and water retention with prolonged use. Monitor blood glucose.',
  },
  {
    id: 'aod-9604',
    name: 'AOD-9604',
    aliases: ['Anti-Obesity Drug 9604', 'hGH fragment 176-191'],
    category: 'fat_loss',
    halfLifeHours: 0.05,
    halfLifeNote: 'About 3 minutes (IV, pig). Vendor claims of 30-60 minutes subcutaneously are unsourced.',
    mechanismShort: 'Modified fragment of hGH (amino acids 176-191). The claimed lipolytic effect is a rodent/in-vitro finding — in the human trial the lipolysis marker did not move. The "no glucose impact" half of the claim IS supported.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 250,
      standard: 300,
      high: 500,
      unit: 'mcg',
      frequency: 'daily',
      cycleWeeks: 12,
      offCycleWeeks: 4,
      timeOfDay: 'morning_fasting',
      withFood: 'fasting',
    },
    reconstitution: {
      typicalVialMg: 5,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved. An FDA advisory committee voted against adding it to the compounding list (Dec 2024). WADA prohibited (S2.2.3).',
    safetyFlags: [
      'The pivotal obesity trial (502 adults, 24 weeks) FAILED to beat placebo, and the obesity programme was discontinued in 2007.',
      'No human trial has ever used the subcutaneous route — all six trials were intravenous or oral.',
    ],
    cyclingReason: 'Cycled by convention. The common claim of a "12-week plateau" and an off-cycle "lipase reset" appears in no publication — trials ran 24 weeks continuously with no plateau analysis.',
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu',
    aliases: ['Copper peptide', 'GHK-Copper'],
    category: 'cosmetic',
    halfLifeHours: 1,
    halfLifeNote: 'Not established — no human PK. Rodent subcutaneous data suggests peak around 30 minutes and a 2-4h half-life.',
    mechanismShort: 'Copper-binding tripeptide. Stimulates collagen synthesis, wound healing, and has anti-aging properties. Remodels tissue.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 1,
      standard: 2,
      high: 3,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 8,
      offCycleWeeks: 4,
      timeOfDay: 'any',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 50,
      bacWaterMl: 2.5,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated, protected from light (copper-peptide complexes are light and redox sensitive)',
    },
    regulatoryStatus: 'Non-injectable GHK-Cu is on the FDA compounding Category 1 list, but that listing explicitly EXCLUDES injectable routes.',
    safetyFlags: [
      'Every human efficacy study used topical GHK-Cu. There are no human trials of the injectable route.',
      'Contraindicated in Wilson\'s disease and cholestasis — subcutaneous injection bypasses the intestinal copper regulation that normally protects against copper overload.',
      'Injectable dosing in circulation spans a 10-60x range (1-2mg daily vs 0.5-1mg weekly vs 2-3mg monthly) with no trial anchor. The range shown here sits at the top of that spread.',
    ],
    cyclingReason: 'Cycled as a precaution. Note the copper load itself is modest — a 2mg dose carries about 314mcg of elemental copper, roughly one dietary RDA. The real concern is that injection bypasses normal copper regulation, not accumulation per se.',
  },
  {
    id: 'epithalon',
    name: 'Epithalon',
    aliases: ['Epitalon', 'Epithalone', 'AEDG peptide'],
    category: 'longevity',
    halfLifeHours: 2,
    halfLifeNote: 'Not established — no pharmacokinetic study exists in humans or animals. Treat this number as a placeholder.',
    mechanismShort: 'Reported to activate telomerase and regulate melatonin production. The telomerase and telomere findings come from in-vitro human fibroblast work by a single research group; no human telomere-lengthening evidence exists and no independent Western trial has replicated it.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 5,
      standard: 10,
      high: 10,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 2,
      offCycleWeeks: 26,
      timeOfDay: 'morning',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 10,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Not approved anywhere. Removed from FDA compounding Category 2 in April 2026 with a favourable advisory-committee vote (7-4) in July 2026, but not yet on the 503A list.',
    cyclingReason: 'Short intense cycles: 10-20 days on, repeated every 4-6 months. This is the protocol used in the original Russian literature, not a finding about how long any effect persists.',
  },
  {
    id: 'pt-141',
    name: 'PT-141',
    aliases: ['Bremelanotide', 'Vyleesi'],
    category: 'sexual_health',
    halfLifeHours: 2.7,
    mechanismShort: 'Melanocortin-4 receptor agonist. Acts centrally (brain) to increase sexual desire. FDA-approved for female HSDD.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 1.75,
      standard: 1.75,
      high: 1.75,
      unit: 'mg',
      frequency: 'custom',
      customFrequencyDays: 7,
      cycleWeeks: 0,
      offCycleWeeks: 0,
      timeOfDay: 'before_activity',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 10,
      bacWaterMl: 2,
      shelfLifeDays: 28,
      storageTemp: 'Label: at or below 25°C, do not freeze, protect from light. Refrigeration is fine for a reconstituted vial.',
    },
    regulatoryStatus: 'Prescription medicine (Vyleesi), FDA-approved for hypoactive sexual desire disorder in premenopausal women.',
    safetyFlags: [
      '1.75mg is both the labeled dose and the highest studied dose — there is no 2mg dose. Above 1.75mg means more nausea (already ~40%), vomiting and transient blood pressure rise.',
      'Contraindicated in uncontrolled hypertension and known cardiovascular disease.',
      'Label limit is one dose per 24 hours and no more than 8 doses per month.',
      'Can cause hyperpigmentation (~1% at up to 8 doses/month; more likely with darker skin and more frequent dosing, and not always reversible).',
    ],
    cyclingReason: 'As-needed use only. Max 8 doses/month, minimum 24h between doses. NOT for daily use — causes nausea and blood pressure changes.',
  },
  {
    id: 'semax',
    name: 'Semax',
    aliases: ['MEHFPGP'],
    category: 'nootropic',
    halfLifeHours: 0.5,
    halfLifeNote: 'No published plasma half-life. Plasma degradation is minutes-scale, but intranasal Semax reaches the brain largely intact and CNS effects last ~20-24h — plasma level and effect duration are not the same thing here.',
    mechanismShort: 'Synthetic ACTH(4-10) analog. Enhances BDNF, improves focus, memory, and neuroprotection. Intranasal delivery.',
    route: 'intranasal',
    needleGauge: 'N/A (intranasal)',
    dosing: {
      low: 200,
      standard: 600,
      high: 1000,
      unit: 'mcg',
      frequency: 'daily',
      timesPerDay: 2,
      cycleWeeks: 4,
      offCycleWeeks: 4,
      timeOfDay: 'morning',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 3,
      bacWaterMl: 3,
      shelfLifeDays: 30,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Registered medicine in Russia; not approved in the US or EU.',
    safetyFlags: [
      'Dosing spans a ~100x range by indication in the Russian label (anti-fatigue 400-900mcg/day, cognitive 800-8000mcg/day, stroke 6-20mg/day). The range shown here is the low end.',
    ],
    cyclingReason: 'Prevents BDNF pathway desensitization. Equal on/off cycles maintain cognitive benefits.',
  },
  {
    id: 'selank',
    name: 'Selank',
    aliases: ['TP-7'],
    category: 'nootropic',
    halfLifeHours: 0.09,
    halfLifeNote: 'Russian MoH label: 92.8% intranasal bioavailability, detectable in plasma within 30 seconds, declining over 5-5.5 minutes.',
    mechanismShort: 'Synthetic tuftsin analog. Anxiolytic and nootropic. Acts mainly by inhibiting enkephalin-degrading enzymes; reported GABA-A effects are gene-expression changes in animal models, not benzodiazepine-like receptor action.',
    route: 'intranasal',
    needleGauge: 'N/A (intranasal)',
    dosing: {
      low: 900,
      standard: 900,
      high: 2700,
      unit: 'mcg',
      frequency: 'daily',
      timesPerDay: 3,
      cycleWeeks: 2,
      offCycleWeeks: 4,
      timeOfDay: 'morning',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 3,
      bacWaterMl: 2,
      shelfLifeDays: 30,
      storageTemp: '2-8°C refrigerated',
    },
    regulatoryStatus: 'Registered medicine in Russia; not approved in the US or EU.',
    cyclingReason: 'Labelled as 14-day courses. The label states Selank does not cause dependence or habituation and a 14-day study found no tolerance — the cycle exists because long-term continuous-use data is absent, not because tolerance develops.',
  },
  {
    id: 'glow-blend',
    name: 'GLOW (GHK-Cu + TB-500 + BPC-157)',
    aliases: ['GLOW', 'GLOW blend', 'Skin Tightening Blend', 'GHK-Cu/TB-500/BPC-157'],
    category: 'cosmetic',
    halfLifeHours: 4,
    halfLifeNote: 'Not meaningful for a blend — the three components clear at different rates (BPC-157 under 30 min, TB-500 around 1h, GHK-Cu 2-4h). This single value is not modelled per component.',
    mechanismShort: 'Pre-mixed 70mg vial: GHK-Cu (50mg) + TB-500 (10mg) + BPC-157 (10mg) at fixed 50/10/10 ratio. Anchored on GHK-Cu for collagen synthesis. TB-500 moves repair cells into position. BPC-157 restores blood flow to repair area. Blue-green tint when reconstituted (copper). Designed for skin laxity during weight loss and post-surgical recovery.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 1.4,
      standard: 2.33,
      high: 3.5,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 8,
      offCycleWeeks: 4,
      protocolVariants: [
        {
          id: 'glow-weekdays',
          name: 'Standard (5-on/2-off, 8wk)',
          description: 'The canonical GLOW protocol: 2.33mg (10 units) 5×/week, weekends off, for 8 weeks — then 2–4 weeks off. This is what most vendor charts call the "standard" cadence. Copper-conscious: the 2 weekly off-days cut cumulative GHK-Cu load while keeping near-daily exposure.',
          phases: [
            { weekStart: 1, weekEnd: 8, frequency: '5x_week' },
          ],
          source: 'https://www.peptidedeck.com/glow-dosage-chart',
        },
        {
          id: 'glow-daily-4wk',
          name: 'Daily (4 weeks)',
          description: 'Simplest cycle: daily for 4 weeks, then 2–4 weeks off. Entry-level for general skin / anti-aging.',
          phases: [
            { weekStart: 1, weekEnd: 4, frequency: 'daily' },
          ],
          source: 'https://peptidedosages.com/peptide-blend-dosages/glow-peptide-blend-70-mg-vial-dosage-protocol/',
        },
        {
          id: 'glow-short-taper',
          name: 'Short Taper (2wk daily → 2wk 5×/wk)',
          description: 'Daily for 2 weeks, then 5×/week (weekdays) for 2 weeks, then 2–4 weeks off. A compact 4-week front-loaded cycle. Derived from the loading-then-taper pattern — no single source documents this exact split.',
          phases: [
            { weekStart: 1, weekEnd: 2, frequency: 'daily' },
            { weekStart: 3, weekEnd: 4, frequency: '5x_week' },
          ],
        },
        {
          id: 'glow-loading-taper',
          name: 'Loading + Taper (2wk daily → 6wk 5×/wk)',
          description: 'Front-load daily for 2 weeks for faster onset, then settle into 5-on/2-off for 6 weeks, then 4–8 weeks off. Good for acute recovery / post-surgery.',
          phases: [
            { weekStart: 1, weekEnd: 2, frequency: 'daily' },
            { weekStart: 3, weekEnd: 8, frequency: '5x_week' },
          ],
          source: 'https://www.peptidedeck.com/glow-dosage-chart',
        },
        {
          id: 'glow-full-taper',
          name: 'Full Taper (4wk daily → 4wk 5×/wk → maintenance)',
          description: 'Activation (daily, wk1-4) → remodeling (5×/week, wk5-8) → maintenance (every other day, wk9-12), then 4–8 weeks off. Sustained signal without blunting response.',
          phases: [
            { weekStart: 1, weekEnd: 4, frequency: 'daily' },
            { weekStart: 5, weekEnd: 8, frequency: '5x_week' },
            { weekStart: 9, weekEnd: 12, frequency: 'eod' },
          ],
          source: 'https://peptidefox.com/tools/glow-dosage-calculator',
        },
        {
          id: 'glow-maintenance',
          name: 'Maintenance (every other day, 8wk)',
          description: 'Low-intensity upkeep: every other day (≈3–4×/week) for 8 weeks. The lightest standalone cadence — vendor charts describe post-cycle maintenance as 2–3×/week; EOD is the closest schedulable option. Lowest copper load, so the off-cycle can be shorter (~2 weeks).',
          phases: [
            { weekStart: 1, weekEnd: 8, frequency: 'eod' },
          ],
          source: 'https://peptidefox.com/tools/glow-dosage-calculator',
        },
        {
          id: 'glow-aggressive',
          name: 'Aggressive (high-dose 5×/wk, 6wk)',
          description: 'Higher dose (≈3.5mg) 5×/week for 6 weeks for experienced users wanting rapid remodeling, then 4–8 weeks off. Highest copper exposure — get bloodwork (copper, ceruloplasmin) and consider zinc 15–25mg to counterbalance.',
          phases: [
            { weekStart: 1, weekEnd: 6, frequency: '5x_week' },
          ],
          doseOverride: 3.5,
          source: 'https://www.peptidedeck.com/glow-dosage-chart',
        },
      ],
      timeOfDay: 'morning',
      withFood: 'either',
    },
    reconstitution: {
      typicalVialMg: 70,
      bacWaterMl: 3,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated',
      components: [
        { name: 'GHK-Cu', mg: 50 },
        { name: 'TB-500', mg: 10 },
        { name: 'BPC-157', mg: 10 },
      ],
    },
    cyclingReason: 'Reconstitute 70mg in 3mL BAC water (23.3mg/mL): a 2.33mg dose = 10 units on a U-100 syringe — the "10 units = 2.33mg" math only holds at 3mL, so lock the mix volume. Cycle: daily weeks 1-4, 5x/week weeks 5-8, then off (or step down to 2-3x/week maintenance). Breaks let newly built collagen organize. Off-cycle length is debated: 2-4 weeks is the community norm after a 4-8 week run, scaling to 4-8 weeks (roughly off ≈ on) after longer 8-12 week cycles. Consider zinc 15-25mg/day during/after to counterbalance copper. Stop early on metallic taste or GI issues.',
  },
  {
    id: 'nad-plus',
    name: 'NAD+',
    aliases: ['Nicotinamide Adenine Dinucleotide', 'NAD', 'NAD injection'],
    category: 'longevity',
    halfLifeHours: 4,
    halfLifeNote: 'Not established. The one human IV study reported no half-life at all — plasma NAD+ did not rise until after 2 hours. The "4 hours" figure matches intracellular NAD+ turnover, which is a different quantity entirely.',
    mechanismShort: 'Central redox coenzyme for mitochondrial ATP production, sirtuin (SIRT1-7) activation, and PARP-driven DNA repair; cellular NAD+ falls with age. Users inject it subcutaneously for energy, mental clarity, and "cellular repair." Evidence is largely anecdotal for subQ — most human data is on IV NAD+ or oral precursors (NMN/NR), and how much injected NAD+ reaches cells intact is genuinely unsettled. The half-life shown is a rough placeholder; exogenous NAD+ pharmacokinetics are poorly characterized. Not FDA-approved for these uses.',
    route: 'subq',
    needleGauge: '29-31G insulin',
    dosing: {
      low: 25,
      standard: 50,
      high: 100,
      unit: 'mg',
      frequency: 'daily',
      cycleWeeks: 4,
      offCycleWeeks: 2,
      timeOfDay: 'morning',
      withFood: 'either',
      // Ramp exists to build tolerance to the flush/nausea/pressure reaction, which is
      // dose- AND injection-rate-dependent — not to chase a therapeutic ceiling.
      titration: [
        { weekStart: 1, weekEnd: 1, dose: 25, unit: 'mg' },
        { weekStart: 2, weekEnd: 2, dose: 50, unit: 'mg' },
        { weekStart: 3, weekEnd: 999, dose: 100, unit: 'mg' },
      ],
    },
    reconstitution: {
      typicalVialMg: 500,
      bacWaterMl: 5,
      shelfLifeDays: 28,
      storageTemp: '2-8°C refrigerated, protected from light — about 7% degrades over 28 days at fridge temperature but roughly 50% at room temperature. Discard if it yellows.',
    },
    regulatoryStatus: 'NAD+ is on the FDA compounding Category 1 list (it was never Category 2). Not approved for the uses described here.',
    safetyFlags: [
      'The infusion reaction is rate-dependent, not just dose-dependent: in one clinic series all 6 clients had moderate-to-severe cramping, nausea, vomiting, tachycardia and chest pressure at fast IV rates, and none at a slow rate. Inject slowly.',
      'Sourcing is the dominant risk. The FDA issued an alert (Oct 2024) about food-grade NAD+ and endotoxin contamination in compounded products, and there was a Class I recall in Oct 2025.',
      'There is no published human trial, PK study or bioavailability data for SUBCUTANEOUS NAD+ at any dose. The daily protocol here is clinic and community practice only.',
    ],
    cyclingReason: 'Reconstitute 500mg in 5mL BAC water (100mg/mL): a 50mg dose = 50 units on a U-100 syringe. Start at 25mg (25 units) and inject SLOWLY — the flushing, nausea, and chest/abdominal pressure are driven by how fast it goes in, not just the amount. Ramp over 2-3 weeks as tolerance builds. Run 4-week blocks with 1-2 weeks off; there is no established maintenance schedule, so err toward conservative cycling.',
  },
];

export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDES.find(p => p.id === id);
}

export function getPeptidesByCategory(category: PeptideCategory): Peptide[] {
  return PEPTIDES.filter(p => p.category === category);
}

export const CATEGORY_LABELS: Record<PeptideCategory, string> = {
  healing: 'Healing & Recovery',
  glp1: 'GLP-1 Agonists',
  gh_secretagogue: 'GH Secretagogues',
  fat_loss: 'Fat Loss',
  cosmetic: 'Cosmetic / Anti-Aging',
  sexual_health: 'Sexual Health',
  nootropic: 'Nootropic',
  longevity: 'Longevity & Mitochondrial',
};
