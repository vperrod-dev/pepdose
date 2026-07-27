export type StackRelation = 'synergy' | 'neutral' | 'caution' | 'contraindicated';

export interface StackRule {
  peptideA: string;
  peptideB: string;
  relation: StackRelation;
  note: string;
}

/**
 * Every compound here activates the GLP-1 receptor, so any two of them stack GLP-1
 * signalling: additive GI toxicity, hypoglycemia and pancreatitis risk for no added
 * benefit. Listed rather than derived from `category` because category is about how
 * users think of a compound, not its receptor targets.
 */
const GLP1_RECEPTOR_ACTIVE = [
  'semaglutide',
  'oral-semaglutide',
  'tirzepatide',
  'retatrutide',
  'orforglipron',
  'survodutide',
  'mazdutide',
  'cagrisema',
];

const EXPLICIT_RULES: StackRule[] = [
  { peptideA: 'bpc-157', peptideB: 'tb-500', relation: 'synergy', note: '"Wolverine Stack" — BPC-157 targets local tissue repair while TB-500 promotes systemic cell migration. Well-documented synergistic healing.' },
  { peptideA: 'bpc-157', peptideB: 'kpv', relation: 'synergy', note: 'BPC-157 repairs tissue while KPV reduces inflammation. Excellent combo for gut healing and injury recovery.' },
  { peptideA: 'bpc-157', peptideB: 'ghk-cu', relation: 'synergy', note: 'BPC-157 heals deep tissue, GHK-Cu promotes collagen/skin. Complementary repair mechanisms.' },
  { peptideA: 'cjc-1295-no-dac', peptideB: 'ipamorelin', relation: 'synergy', note: 'Gold-standard GH stack. CJC (GHRH) + Ipamorelin (GHRP) amplify GH pulse synergistically. Best taken together pre-bed.' },
  { peptideA: 'cjc-1295-no-dac', peptideB: 'sermorelin', relation: 'caution', note: 'Both are GHRH analogs competing for same receptor. Redundant — pick one, not both.' },
  { peptideA: 'cjc-1295-no-dac', peptideB: 'cjc-1295-dac', relation: 'contraindicated', note: 'Same compound with different half-lives. Never run both. Choose one based on protocol needs.' },
  { peptideA: 'cjc-1295-dac', peptideB: 'ipamorelin', relation: 'caution', note: 'CJC-DAC provides sustained (not pulsatile) GH. Less synergistic with Ipamorelin than the no-DAC version.' },
  { peptideA: 'semaglutide', peptideB: 'tirzepatide', relation: 'contraindicated', note: 'Both are GLP-1 agonists. Running both risks severe GI side effects, hypoglycemia, and pancreatitis. Never combine.' },
  { peptideA: 'semaglutide', peptideB: 'retatrutide', relation: 'contraindicated', note: 'Retatrutide already has GLP-1 activity. Stacking with semaglutide doubles GLP-1 stimulation. Dangerous.' },
  { peptideA: 'tirzepatide', peptideB: 'retatrutide', relation: 'contraindicated', note: 'Both have GLP-1 activity. Never combine GLP-1 agonists.' },
  { peptideA: 'mk-677', peptideB: 'cjc-1295-no-dac', relation: 'caution', note: 'Both elevate GH. Combined may push IGF-1 too high. Monitor bloodwork closely if stacking. Most choose one or the other.' },
  { peptideA: 'mk-677', peptideB: 'ipamorelin', relation: 'caution', note: 'Both stimulate GH via ghrelin pathway. Redundant receptor activation. Pick one.' },
  { peptideA: 'mk-677', peptideB: 'semaglutide', relation: 'caution', note: 'MK-677 increases appetite significantly. Semaglutide decreases it. Counterproductive pairing.' },
  { peptideA: 'aod-9604', peptideB: 'semaglutide', relation: 'neutral', note: 'Different mechanisms. AOD-9604 targets lipolysis, semaglutide targets appetite/metabolism. Can be combined.' },
  { peptideA: 'pt-141', peptideB: 'bpc-157', relation: 'neutral', note: 'No known interaction. Different pathways and use patterns (BPC daily, PT-141 as-needed).' },
  { peptideA: 'semax', peptideB: 'selank', relation: 'synergy', note: 'Complementary nootropics. Semax enhances BDNF/focus, Selank reduces anxiety via GABA. Popular cognitive stack.' },
  { peptideA: 'bpc-157', peptideB: 'semaglutide', relation: 'neutral', note: 'BPC-157 may help with GI side effects of semaglutide (gut healing properties). Some practitioners recommend this.' },
  { peptideA: 'tb-500', peptideB: 'ghk-cu', relation: 'synergy', note: 'TB-500 handles deep tissue repair, GHK-Cu supports surface/collagen healing. Good post-surgery stack.' },

  // Amylin analogues are a different receptor family, which is why the approved
  // combination product exists — but the GI burden is still additive.
  { peptideA: 'cagrilintide', peptideB: 'semaglutide', relation: 'caution', note: 'This is the CagriSema combination, and it works — but at full doses of both the GI burden is additive. The approved product titrates the two together over 16 weeks. Do not bolt full-dose cagrilintide onto full-dose semaglutide.' },
  { peptideA: 'cagrilintide', peptideB: 'cagrisema', relation: 'contraindicated', note: 'CagriSema already contains cagrilintide. Running both doubles the amylin dose.' },
  { peptideA: 'semaglutide', peptideB: 'cagrisema', relation: 'contraindicated', note: 'CagriSema already contains semaglutide. Running both doubles the GLP-1 dose.' },

  { peptideA: 'mots-c', peptideB: 'semaglutide', relation: 'caution', note: 'Both push glucose down by different routes — MOTS-c via AMPK activation, semaglutide via insulin secretion and appetite. Monitor blood glucose, especially if also on metformin or insulin.' },
  { peptideA: 'mots-c', peptideB: '5-amino-1mq', relation: 'caution', note: 'Both act on NAD+/AMPK metabolic signalling. Overlapping mechanisms with no data on the combination.' },
  { peptideA: 'igf-1-lr3', peptideB: 'mk-677', relation: 'caution', note: 'MK-677 already raises IGF-1. Adding exogenous IGF-1 LR3 compounds both the hypoglycemia risk and cumulative growth-factor exposure. Monitor glucose closely.' },
  { peptideA: 'igf-1-lr3', peptideB: 'cjc-1295-dac', relation: 'caution', note: 'Sustained GH elevation plus exogenous IGF-1 stacks growth-factor exposure. Both carry tumour-growth concerns; neither should be run with any cancer history.' },
  { peptideA: 'ghrp-6', peptideB: 'semaglutide', relation: 'caution', note: 'GHRP-6 causes intense hunger; semaglutide suppresses appetite. Directly counterproductive.' },
  { peptideA: 'ghrp-2', peptideB: 'ghrp-6', relation: 'contraindicated', note: 'Same receptor (GHS-R1a). Running both just raises cortisol and prolactin without extra GH.' },
  { peptideA: 'ghrp-2', peptideB: 'hexarelin', relation: 'contraindicated', note: 'Same receptor (GHS-R1a). Redundant, and hexarelin desensitizes the receptor for both.' },
  { peptideA: 'ghrp-6', peptideB: 'hexarelin', relation: 'contraindicated', note: 'Same receptor (GHS-R1a). Redundant, and the combined cortisol/prolactin load is the worst of any GHRP pairing.' },
  { peptideA: 'ghrp-2', peptideB: 'ipamorelin', relation: 'caution', note: 'Both are GHRP-class ghrelin receptor agonists. Redundant — pick one. Ipamorelin is the cleaner choice on cortisol and prolactin.' },
  { peptideA: 'ghrp-6', peptideB: 'ipamorelin', relation: 'caution', note: 'Both are GHRP-class ghrelin receptor agonists. Redundant — pick one.' },
  { peptideA: 'hexarelin', peptideB: 'ipamorelin', relation: 'caution', note: 'Both are GHRP-class ghrelin receptor agonists. Redundant — pick one.' },
  { peptideA: 'ghrp-2', peptideB: 'cjc-1295-no-dac', relation: 'synergy', note: 'GHRH analog plus GHRP amplify the GH pulse synergistically — the same logic as the classic CJC/Ipamorelin pairing. Take together, fasted.' },
  { peptideA: 'hexarelin', peptideB: 'cjc-1295-no-dac', relation: 'synergy', note: 'GHRH analog plus GHRP amplify the GH pulse. Note hexarelin desensitizes quickly, so this pairing cannot run continuously.' },
  { peptideA: 'tesofensine', peptideB: 'semaglutide', relation: 'caution', note: 'Different mechanisms (monoamine reuptake inhibition vs GLP-1), so not redundant — but appetite suppression and the cardiovascular load both stack. Tesofensine already raises heart rate and blood pressure.' },
  { peptideA: 'tesofensine', peptideB: '5-amino-1mq', relation: 'contraindicated', note: 'Tesofensine inhibits serotonin reuptake and 5-Amino-1MQ showed substantial MAO-A inhibition in preclinical work. That combination risks serotonin syndrome and hypertensive crisis.' },
  { peptideA: 'melanotan-2', peptideB: 'pt-141', relation: 'contraindicated', note: 'PT-141 (bremelanotide) is a metabolite of Melanotan II and both are melanocortin agonists. Combining them stacks MC4R activation — nausea, blood pressure rise, and priapism risk.' },
  { peptideA: 'll-37', peptideB: 'thymosin-alpha-1', relation: 'caution', note: 'Both modulate immune function through different routes. No data on the combination, and dual immune stimulation is not obviously additive.' },
  { peptideA: 'ss-31', peptideB: 'mots-c', relation: 'neutral', note: 'Both target mitochondrial function by different mechanisms (cardiolipin binding vs AMPK activation). No known interaction, no combination data either.' },
  { peptideA: 'humanin', peptideB: 'mots-c', relation: 'neutral', note: 'Both are mitochondrial-derived peptides with distinct receptors. No known interaction; neither has human efficacy data.' },
];

function hasExplicitRule(a: string, b: string): boolean {
  return EXPLICIT_RULES.some(
    r => (r.peptideA === a && r.peptideB === b) || (r.peptideA === b && r.peptideB === a)
  );
}

/** Contraindicate every GLP-1-active pair that doesn't already have a more specific rule. */
function buildGlp1Contraindications(): StackRule[] {
  const rules: StackRule[] = [];
  for (let i = 0; i < GLP1_RECEPTOR_ACTIVE.length; i++) {
    for (let j = i + 1; j < GLP1_RECEPTOR_ACTIVE.length; j++) {
      const [a, b] = [GLP1_RECEPTOR_ACTIVE[i], GLP1_RECEPTOR_ACTIVE[j]];
      if (hasExplicitRule(a, b)) continue;
      rules.push({
        peptideA: a,
        peptideB: b,
        relation: 'contraindicated',
        note: 'Both activate the GLP-1 receptor. Running them together stacks GLP-1 signalling — severe GI effects, hypoglycemia and pancreatitis risk — with no added benefit. Use one at a time.',
      });
    }
  }
  return rules;
}

export const STACKING_RULES: StackRule[] = [...EXPLICIT_RULES, ...buildGlp1Contraindications()];

export function getStackingInfo(peptideA: string, peptideB: string): StackRule | undefined {
  return STACKING_RULES.find(
    r => (r.peptideA === peptideA && r.peptideB === peptideB) ||
         (r.peptideA === peptideB && r.peptideB === peptideA)
  );
}

export function getStackWarnings(peptideIds: string[]): StackRule[] {
  const warnings: StackRule[] = [];
  for (let i = 0; i < peptideIds.length; i++) {
    for (let j = i + 1; j < peptideIds.length; j++) {
      const rule = getStackingInfo(peptideIds[i], peptideIds[j]);
      if (rule && (rule.relation === 'caution' || rule.relation === 'contraindicated')) {
        warnings.push(rule);
      }
    }
  }
  return warnings;
}
