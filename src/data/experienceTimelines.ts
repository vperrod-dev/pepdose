export type Severity = 'normal' | 'monitor' | 'stop';

export interface WeekGuide {
  weekStart: number;
  weekEnd: number;
  title: string;
  description: string;
  tips: string[];
}

export interface SideEffect {
  name: string;
  severity: Severity;
  likelihood: 'common' | 'uncommon' | 'rare';
  onset: string;
  duration: string;
  notes: string;
}

export type EvidenceLevel = 'clinical' | 'mixed' | 'anecdotal';

export interface DosingGuide {
  /** Practical dosing / titration bullets. */
  protocol: string[];
  /** Reconstitution + syringe-unit mapping bullets. */
  reconstitution?: string[];
}

export interface PeptideExperience {
  peptideId: string;
  weeklyGuide: WeekGuide[];
  sideEffects: SideEffect[];
  redFlags: string[];
  postCycleNotes: string;
  /** Evidence tier for the compound (clinical / mixed / anecdotal). Optional. */
  evidenceLevel?: EvidenceLevel;
  /** One-line honesty note about the strength of evidence. Optional. */
  evidenceNote?: string;
  /** Deep dosing + reconstitution guidance surfaced in the guide. Optional. */
  dosing?: DosingGuide;
  /** Community tips & tricks from Reddit/forums. Optional. */
  communityTips?: string[];
  /** Common mistakes to avoid. Optional. */
  commonMistakes?: string[];
  /** Stacking / synergy notes. Optional. */
  stacking?: string[];
}

export const EXPERIENCE_DATA: PeptideExperience[] = [
  {
    peptideId: 'bpc-157',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Adaptation Phase',
        description: 'Body adjusting to peptide. Injection site warmth/redness is normal. No noticeable healing effects yet.',
        tips: ['Focus on consistent injection timing', 'Rotate injection sites from day 1', 'Inject close to injury site if possible'],
      },
      {
        weekStart: 2, weekEnd: 2,
        title: 'Early Response',
        description: 'Some users report reduced pain and inflammation at injury site. Sleep quality may improve slightly.',
        tips: ['Track pain levels daily to notice gradual changes', 'Injection technique should be comfortable by now', 'Stay hydrated'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Peak Healing Window',
        description: 'Most tissue repair effects reported in this window. Energy and recovery noticeably improved in many users.',
        tips: ['Continue consistent dosing — don\'t skip', 'Light exercise/rehab work pairs well', 'Monitor injury progress with photos'],
      },
      {
        weekStart: 5, weekEnd: 6,
        title: 'Consolidation',
        description: 'Effects plateau. Healing benefits continue but at diminishing rate. Plan off-cycle to prevent tolerance.',
        tips: ['Start planning off-cycle', 'Note your overall recovery for future reference', 'Taper is not required — can stop directly'],
      },
    ],
    sideEffects: [
      { name: 'Injection site redness', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: '15-30 minutes', notes: 'Mild warmth and redness. Subsides quickly.' },
      { name: 'Mild headache', severity: 'normal', likelihood: 'uncommon', onset: 'First few days', duration: '1-2 hours', notes: 'Usually resolves with hydration.' },
      { name: 'Dizziness', severity: 'monitor', likelihood: 'rare', onset: 'Variable', duration: 'Brief', notes: 'If persistent, reduce dose by 50%.' },
      { name: 'Nausea', severity: 'monitor', likelihood: 'rare', onset: 'First week', duration: 'Transient', notes: 'More common with oral/sublingual route.' },
    ],
    redFlags: [
      'Severe allergic reaction (hives, swelling, difficulty breathing)',
      'Persistent pain or lump at injection site lasting >48 hours',
      'Unusual swelling unrelated to injury site',
    ],
    postCycleNotes: 'Effects often persist 2-4 weeks after stopping. Monitor if healing progress continues. Safe to restart after 4-week off-cycle.',
  },
  {
    peptideId: 'tb-500',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Loading Phase',
        description: 'Higher frequency dosing (2x/week) to build tissue levels. Some report mild fatigue as body mobilizes repair processes.',
        tips: ['Stick to loading dose schedule', 'Adequate sleep enhances repair', 'Mild fatigue is normal and temporary'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Active Healing',
        description: 'Cell migration and angiogenesis effects peak. Injury site should show improvement. Flexibility may increase.',
        tips: ['Gentle mobility work encouraged', 'Document progress', 'Continue loading if prescribed'],
      },
      {
        weekStart: 5, weekEnd: 6,
        title: 'Maintenance Phase',
        description: 'Transition to weekly dosing. Effects maintained with lower frequency. Healing continues at steady pace.',
        tips: ['Can reduce to once weekly', 'Systemic inflammation should be noticeably reduced', 'Good time to reassess if cycle extension needed'],
      },
    ],
    sideEffects: [
      { name: 'Mild fatigue', severity: 'normal', likelihood: 'common', onset: 'Week 1-2', duration: '3-5 days', notes: 'Body diverting resources to repair. Normal.' },
      { name: 'Injection site irritation', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Brief', notes: 'Rotate sites.' },
      { name: 'Head rush on standing', severity: 'monitor', likelihood: 'uncommon', onset: 'Variable', duration: 'Seconds', notes: 'TB-500 can lower blood pressure slightly. Rise slowly.' },
    ],
    redFlags: [
      'Persistent lethargy beyond week 2',
      'Unusual bruising or bleeding',
      'Signs of infection at injection site (increasing redness, heat, pus)',
    ],
    postCycleNotes: 'Tissue remodeling continues weeks after last dose. 4-week off-cycle recommended before restarting.',
  },
  {
    peptideId: 'semaglutide',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'GI Adjustment (0.25mg)',
        description: 'Body adapting to GLP-1 activation. Nausea is common (60-70% of users), usually mild. Appetite noticeably reduced. This is the adaptation dose — not for weight loss.',
        tips: ['Eat slowly and smaller portions', 'Avoid fatty/greasy foods', 'Stay very well hydrated', 'Ginger tea can help nausea', 'Don\'t force yourself to eat full meals'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Early Weight Loss (0.5mg)',
        description: 'Nausea typically subsides. Weight loss begins — average 2-4 lbs/month. Food noise significantly reduced. Energy may dip temporarily.',
        tips: ['Prioritize protein intake (risk of muscle loss)', 'Light resistance training recommended', 'Track weight weekly, not daily', 'Some constipation possible — increase fiber'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Therapeutic Range (1.0mg)',
        description: 'Significant appetite suppression. Weight loss accelerates. Most GI side effects have resolved. Body composition improving.',
        tips: ['Minimum 60-80g protein daily', 'Strength training important to preserve muscle', 'Monitor blood sugar if diabetic', 'Watch for constipation — fiber and water'],
      },
      {
        weekStart: 13, weekEnd: 16,
        title: 'Full Dose Titration (1.7mg)',
        description: 'Approaching maximum therapeutic dose. Appetite suppression strong. Weight loss continues. May experience brief GI symptoms with each dose increase.',
        tips: ['Each step-up may bring brief nausea — subsides in days', 'Track measurements, not just scale', 'Ensure adequate nutrition despite reduced appetite'],
      },
      {
        weekStart: 17, weekEnd: 999,
        title: 'Maintenance Dose (2.4mg)',
        description: 'Maximum approved dose. Weight loss continues to 12-18 months then stabilizes. Side effects should be stable and manageable.',
        tips: ['Continue indefinitely or discuss taper with provider', 'Monitor gallbladder symptoms at higher doses', 'Stopping abruptly may cause rebound weight gain', 'Regular bloodwork recommended every 3-6 months'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-4', duration: 'Subsides by week 4-6', notes: 'Most common side effect. Eat bland, small meals. Usually self-resolving.' },
      { name: 'Constipation', severity: 'normal', likelihood: 'common', onset: 'Weeks 2+', duration: 'Ongoing', notes: 'Increase fiber, water, and consider stool softener.' },
      { name: 'Diarrhea', severity: 'normal', likelihood: 'common', onset: 'First weeks', duration: 'Transient', notes: 'Less common than nausea. Usually resolves.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-3', duration: '1-2 weeks', notes: 'Related to reduced caloric intake. Ensure adequate nutrition.' },
      { name: 'Acid reflux/GERD', severity: 'monitor', likelihood: 'uncommon', onset: 'Variable', duration: 'Ongoing', notes: 'Avoid lying down after eating. May need OTC antacid.' },
      { name: 'Hair thinning', severity: 'monitor', likelihood: 'uncommon', onset: 'Months 3+', duration: 'Variable', notes: 'Related to rapid weight loss, not the drug directly. Ensure protein intake.' },
      { name: 'Gallbladder issues', severity: 'stop', likelihood: 'rare', onset: 'Any time', duration: 'N/A', notes: 'Severe right-side abdominal pain after fatty meals. Seek medical attention.' },
      { name: 'Pancreatitis', severity: 'stop', likelihood: 'rare', onset: 'Any time', duration: 'N/A', notes: 'Severe persistent abdominal pain radiating to back. Emergency — seek immediate care.' },
    ],
    redFlags: [
      'Severe abdominal pain that won\'t go away (pancreatitis risk)',
      'Persistent vomiting unable to keep fluids down',
      'Signs of allergic reaction (face/throat swelling)',
      'Changes in vision',
      'Severe right-side abdominal pain (gallstones)',
      'Signs of hypoglycemia if diabetic (shakiness, sweating, confusion)',
    ],
    postCycleNotes: 'Stopping semaglutide typically results in appetite return within 1-2 weeks and weight regain over 6-12 months. Discuss long-term plan with provider.',
  },
  {
    peptideId: 'tirzepatide',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Introduction (2.5mg)',
        description: 'Dual GIP/GLP-1 activation beginning. GI side effects common but often milder than pure GLP-1 agonists. Appetite reduction starts.',
        tips: ['Same diet modifications as semaglutide', 'Nausea may be less intense than with semaglutide', 'Hydrate well'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'First Step-Up (5mg)',
        description: 'Weight loss begins in earnest. Appetite significantly reduced. GI symptoms may briefly return then settle.',
        tips: ['Prioritize protein (60-100g daily)', 'Begin or continue strength training', 'Track measurements and progress photos'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Accelerating (7.5mg)',
        description: 'Robust weight loss phase. Body composition changing. Many users report improved energy and metabolic markers.',
        tips: ['Monitor blood glucose if applicable', 'Ensure vitamin/mineral supplementation', 'Keep consistent injection day'],
      },
      {
        weekStart: 13, weekEnd: 20,
        title: 'Therapeutic Range (10-12.5mg)',
        description: 'Strong metabolic effects. Average weight loss 15-22% of body weight by this point in clinical trials.',
        tips: ['Regular bloodwork recommended', 'Watch for injection site reactions at higher concentrations', 'Maintain nutrition despite low appetite'],
      },
      {
        weekStart: 21, weekEnd: 999,
        title: 'Maximum Dose (15mg)',
        description: 'Highest approved dose. Significant metabolic improvements. Weight loss plateaus around 12-18 months.',
        tips: ['Not everyone needs to reach 15mg — stay at dose that works', 'Long-term use — routine monitoring important', 'Discuss maintenance strategy with provider'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Each dose step-up', duration: '3-7 days', notes: 'Tends to be milder than with semaglutide. Eat small meals.' },
      { name: 'Decreased appetite', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Ongoing (desired)', notes: 'Expected therapeutic effect. Ensure minimum nutrition.' },
      { name: 'Injection site reaction', severity: 'normal', likelihood: 'uncommon', onset: 'Variable', duration: 'Hours', notes: 'Redness, itching at injection site. Rotate sites.' },
      { name: 'Pancreatitis', severity: 'stop', likelihood: 'rare', onset: 'Any time', duration: 'N/A', notes: 'Severe abdominal pain. Seek emergency care immediately.' },
    ],
    redFlags: [
      'Severe persistent abdominal pain (pancreatitis)',
      'Persistent vomiting, unable to eat or drink',
      'Thyroid lumps or neck swelling',
      'Severe allergic reaction',
    ],
    postCycleNotes: 'Similar to semaglutide — weight regain expected after discontinuation. Plan maintenance strategy.',
  },
  {
    peptideId: 'cjc-1295-no-dac',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'GH Pulse Activation',
        description: 'Body beginning to respond with enhanced GH pulses. Sleep quality often improves first. May feel slightly more rested.',
        tips: ['Inject on empty stomach (2+ hours no food)', 'Pre-bed timing maximizes natural GH pulse', 'Best combined with Ipamorelin'],
      },
      {
        weekStart: 3, weekEnd: 6,
        title: 'Early Benefits',
        description: 'Improved sleep deepening. Skin quality may improve. Recovery from workouts faster. Fat loss subtle but beginning.',
        tips: ['Don\'t eat within 30 min after injection (blunts GH)', 'Track sleep quality', 'Body composition changes are gradual'],
      },
      {
        weekStart: 7, weekEnd: 12,
        title: 'Full Effects',
        description: 'Peak GH/IGF-1 elevation. Noticeable improvements in recovery, body composition, skin, hair, and energy. Fat loss and lean mass gains.',
        tips: ['Consider bloodwork at week 8 to check IGF-1 levels', 'Maintain consistent timing', 'Effects compound over time'],
      },
    ],
    sideEffects: [
      { name: 'Tingling/numbness in hands', severity: 'normal', likelihood: 'common', onset: 'Weeks 2-4', duration: 'Transient', notes: 'Sign of elevated GH. Usually mild and resolves. Reduce dose if bothersome.' },
      { name: 'Water retention', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-3', duration: 'Variable', notes: 'Mild bloating. GH-related. Reduces with time or lower dose.' },
      { name: 'Increased hunger', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Ongoing', notes: 'GH increases appetite. Channel into protein-rich meals.' },
      { name: 'Joint pain', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks 4+', duration: 'Variable', notes: 'May indicate IGF-1 too high. Get bloodwork. Reduce dose.' },
    ],
    redFlags: [
      'Persistent severe headaches',
      'Vision changes',
      'Significant joint swelling (IGF-1 too high)',
      'Carpal tunnel symptoms that don\'t resolve',
    ],
    postCycleNotes: 'GH levels return to baseline within 1-2 weeks of stopping. 4-week off-cycle maintains receptor sensitivity for next cycle.',
  },
  {
    peptideId: 'ipamorelin',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Initial Response',
        description: 'Selective GH release begins. Fewer side effects than other GHRPs (minimal cortisol/prolactin impact). Sleep improves.',
        tips: ['Fasting required before injection', 'Pre-bed dosing optimal', 'Pair with CJC-1295 (no DAC) for best results'],
      },
      {
        weekStart: 3, weekEnd: 8,
        title: 'Building Effects',
        description: 'Progressive improvements in sleep, recovery, skin quality. Fat oxidation increasing. Lean mass slowly improving.',
        tips: ['Results are gradual — trust the process', 'Consistent timing matters', 'Track body measurements weekly'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Peak Benefits',
        description: 'Full GH optimization. Best results in conjunction with proper training and nutrition. Noticeable body recomposition.',
        tips: ['Bloodwork recommended to check IGF-1', 'Plan off-cycle timing', 'Document results for future cycles'],
      },
    ],
    sideEffects: [
      { name: 'Mild hunger increase', severity: 'normal', likelihood: 'common', onset: 'Post-injection', duration: '30-60 minutes', notes: 'Ghrelin receptor activation. Brief and mild compared to other GHRPs.' },
      { name: 'Head rush', severity: 'normal', likelihood: 'uncommon', onset: 'Post-injection', duration: 'Seconds', notes: 'Brief lightheadedness. Sit during injection.' },
      { name: 'Water retention', severity: 'normal', likelihood: 'uncommon', onset: 'Weeks 2+', duration: 'Variable', notes: 'Milder than with CJC-1295 alone.' },
    ],
    redFlags: [
      'Persistent carpal tunnel symptoms',
      'Joint pain with swelling',
      'Glucose/insulin issues (get bloodwork)',
    ],
    postCycleNotes: 'One of the safest GH peptides. Receptor sensitivity returns within 4 weeks off.',
  },
  {
    peptideId: 'mk-677',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Appetite Surge',
        description: 'Oral ghrelin mimetic kicks in fast. Hunger significantly increased. Water retention begins. Sleep deepens noticeably.',
        tips: ['Take before bed to sleep through hunger spike', 'Water retention is normal — not fat gain', 'Start at 10mg if concerned about sides'],
      },
      {
        weekStart: 3, weekEnd: 6,
        title: 'GH/IGF-1 Rising',
        description: 'IGF-1 levels climbing. Recovery improving. Skin and hair quality better. Appetite normalizes somewhat.',
        tips: ['Monitor fasting blood glucose', 'Appetite usually stabilizes by week 4', 'Strength gains may begin'],
      },
      {
        weekStart: 7, weekEnd: 12,
        title: 'Full Activation',
        description: 'Peak GH benefits. Body composition improving. Sleep very deep. Some users report vivid dreams.',
        tips: ['Check IGF-1 and fasting glucose at week 8', 'If glucose elevated, consider lower dose or cycle off', 'Lean mass gains most noticeable in this window'],
      },
    ],
    sideEffects: [
      { name: 'Intense hunger', severity: 'normal', likelihood: 'common', onset: 'Day 1', duration: 'Weeks 1-3 peak', notes: 'Strongest side effect. Bedtime dosing helps. Subsides partially.' },
      { name: 'Water retention/bloating', severity: 'normal', likelihood: 'common', onset: 'Week 1', duration: 'Ongoing', notes: '3-5 lbs water weight common. Resolves when stopped.' },
      { name: 'Lethargy', severity: 'normal', likelihood: 'common', onset: 'Post-dose', duration: '1-2 hours', notes: 'Take before bed. Actually enhances sleep quality.' },
      { name: 'Elevated blood glucose', severity: 'monitor', likelihood: 'common', onset: 'Weeks 4+', duration: 'While on compound', notes: 'GH causes insulin resistance. Monitor fasting glucose. Critical for pre-diabetics.' },
      { name: 'Numbness/tingling', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks 4+', duration: 'Variable', notes: 'GH-related. If persistent, reduce dose.' },
    ],
    redFlags: [
      'Fasting blood glucose consistently above 100 mg/dL',
      'Signs of diabetes (excessive thirst, frequent urination)',
      'Severe edema (significant swelling beyond mild bloating)',
      'Persistent joint pain',
    ],
    postCycleNotes: 'GH levels drop within days of stopping. Water weight drops in 1-2 weeks. IGF-1 normalizes in 2-3 weeks.',
  },
  {
    peptideId: 'aod-9604',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 3,
        title: 'Fat Mobilization Begins',
        description: 'Lipolysis stimulation starting. No visible changes yet — fat metabolism takes time. No GH-like side effects.',
        tips: ['Inject fasting for best absorption', 'Morning SubQ near abdomen preferred', 'Don\'t expect rapid results — fat loss is gradual'],
      },
      {
        weekStart: 4, weekEnd: 8,
        title: 'Visible Progress',
        description: 'Fat loss becoming noticeable, especially stubborn areas. No impact on blood glucose or insulin (key advantage over GH).',
        tips: ['Combine with exercise for best results', 'Track waist measurements, not just weight', 'Body recomposition may mean scale doesn\'t move much'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Continued Fat Loss',
        description: 'Sustained lipolysis. Results continue but rate may slow. Most users see meaningful reduction in stubborn fat deposits.',
        tips: ['Plan next cycle or off-period', 'Take progress photos for comparison', 'Maintain caloric deficit for maximum effect'],
      },
    ],
    sideEffects: [
      { name: 'Injection site redness', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Minutes', notes: 'Very mild. Normal.' },
      { name: 'Mild headache', severity: 'normal', likelihood: 'uncommon', onset: 'First days', duration: 'Hours', notes: 'Usually hydration-related.' },
    ],
    redFlags: [
      'Unusual joint pain (shouldn\'t occur — AOD-9604 lacks GH activity)',
      'Severe allergic reaction',
    ],
    postCycleNotes: 'Fat loss results are retained if diet/exercise maintained. Off-cycle resets lipase sensitivity for next round.',
  },
  {
    peptideId: 'pt-141',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'As-Needed Use',
        description: 'PT-141 is not cycled daily — used 45 minutes before activity. First use establishes your response level.',
        tips: ['Start with 0.5-1mg to assess tolerance', 'Effects begin 30-60 min after injection', 'Nausea is common on first use — subsides with experience', 'Max 8 doses per month'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: '15-30 minutes', duration: '1-2 hours', notes: 'Most common side effect. Starts mild, subsides. Lower dose if severe.' },
      { name: 'Facial flushing', severity: 'normal', likelihood: 'common', onset: '30-60 minutes', duration: '2-4 hours', notes: 'Melanocortin receptor activation. Normal and expected.' },
      { name: 'Mild headache', severity: 'normal', likelihood: 'uncommon', onset: '1-2 hours', duration: 'Hours', notes: 'Usually mild. Stay hydrated.' },
      { name: 'Blood pressure increase', severity: 'monitor', likelihood: 'uncommon', onset: '30-60 minutes', duration: 'Hours', notes: 'Transient BP rise. Avoid if you have uncontrolled hypertension.' },
    ],
    redFlags: [
      'Severe or prolonged nausea/vomiting',
      'Chest pain or severe headache',
      'Priapism (erection lasting >4 hours — seek emergency care)',
      'Significant blood pressure spike',
    ],
    postCycleNotes: 'No cycling needed — as-needed use only. Do not exceed 8 doses per month. Effects don\'t diminish with proper spacing.',
  },
  {
    peptideId: 'ghk-cu',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Collagen Stimulation Begins',
        description: 'Copper peptide signaling initiating collagen remodeling. No visible changes yet. Working at cellular level.',
        tips: ['Can inject SubQ or use topically', 'Pairs well with BPC-157 for tissue repair', 'Results take time — collagen builds slowly'],
      },
      {
        weekStart: 3, weekEnd: 5,
        title: 'Early Skin/Tissue Changes',
        description: 'Skin elasticity beginning to improve. Wound healing accelerated. Hair growth may improve.',
        tips: ['Consistency is key', 'Topical application to face for skin benefits', 'Track skin quality with photos'],
      },
      {
        weekStart: 6, weekEnd: 8,
        title: 'Visible Improvements',
        description: 'Noticeable skin quality improvement. Fine lines may soften. Overall tissue quality enhanced.',
        tips: ['Plan off-cycle to prevent copper accumulation', 'Results persist after stopping', 'Document results for future reference'],
      },
    ],
    sideEffects: [
      { name: 'Injection site staining', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Days', notes: 'Blue-green discoloration from copper. Fades in 2-3 days.' },
      { name: 'Mild nausea', severity: 'normal', likelihood: 'uncommon', onset: 'Post-injection', duration: 'Brief', notes: 'More common at higher doses.' },
    ],
    redFlags: [
      'Signs of copper toxicity (metallic taste, severe nausea, abdominal pain)',
      'Liver discomfort',
    ],
    postCycleNotes: 'Collagen benefits persist well after stopping. 4-week minimum off-cycle prevents copper accumulation.',
  },
  {
    peptideId: 'epithalon',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Telomerase Activation',
        description: 'Short intense protocol: 10mg daily for 10-20 days. Telomerase activation begins. Sleep often improves via melatonin regulation.',
        tips: ['This is a short cycle — consistency each day matters', 'Best done 1-2x per year', 'Morning injection preferred'],
      },
    ],
    sideEffects: [
      { name: 'Improved sleep', severity: 'normal', likelihood: 'common', onset: 'Days 3-5', duration: 'Weeks after', notes: 'Positive side effect — melatonin regulation. Welcome benefit.' },
      { name: 'Injection site discomfort', severity: 'normal', likelihood: 'uncommon', onset: 'Immediate', duration: 'Minutes', notes: 'Mild and brief.' },
    ],
    redFlags: [
      'Allergic reaction',
      'Persistent injection site issues',
    ],
    postCycleNotes: 'Telomerase activation effects are thought to persist for months. Repeat cycle every 4-6 months. One of the safest peptides documented.',
  },
  {
    peptideId: 'retatrutide',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'The Adjustment (2mg)',
        description: 'Standard start is 2mg weekly for 4 weeks. Appetite suppression kicks in fast — many report noticeably less hunger within 48 hours. Nausea is common but users say it\'s milder than sema at similar weight-loss levels. Expect increased urination (glucagon effect) and early water weight loss. Some users start at 0.5–1mg to test tolerance before joining the ladder.',
        tips: ['Eat small meals before hunger vanishes completely — "food noise" disappears fast', 'Hydrate aggressively — the extra urination is real', '"Sulfur burps" are a common Reddit complaint, especially with fatty food', 'First weeks\' water loss can be dramatic — don\'t get excited, real fat loss comes later'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Finding Your Dose (4mg)',
        description: 'Community consensus: 4mg is where real weight loss starts. Reddit users report 5-10% loss in the first 8-12 weeks. GI side effects from the step-up usually settle in 3-5 days. Energy levels are a mixed bag — some feel great, others report fatigue. The triple receptor hit (GIP + GLP-1 + glucagon) feels different from pure GLP-1 drugs. Many people are happy to hold at 4–6mg long term.',
        tips: ['Protein first — 80-100g daily minimum. Reddit users who skip this lose muscle', 'Start or maintain strength training — community strongly recommends this', 'If nausea is rough, some users split their weekly dose into two shots', 'Track measurements AND photos, not just scale — body recomposition is real'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Smoother Step (6mg)',
        description: 'The Phase 3 ladder steps to 6mg here instead of jumping straight to 8mg. Lilly added this intermediate step because the old 4→8mg doubling roughly doubled GI side effects. Fat loss continues steadily. Plenty of users settle in the 4–6mg band and never go higher — only climb if appetite control is fading and side effects are manageable.',
        tips: ['Get bloodwork — liver enzymes and lipids. Reddit consensus: every 3 months', 'No rush to climb — hold a dose as long as it\'s still working', 'If you plateau, hold steady — most break through within 2-3 weeks', 'Smaller steps = fewer sides. Don\'t copy aggressive Reddit titrations'],
      },
      {
        weekStart: 13, weekEnd: 16,
        title: 'Pushing Higher (9mg)',
        description: 'Next Phase 3 step for those who need more. Appetite suppression strengthens and loss can re-accelerate, but nausea, fatigue and GI issues become more likely with each increase. Community advice: only step up if you\'ve stalled at 6mg — many people simply don\'t need this dose.',
        tips: ['Step up only if 6mg has stopped delivering — not on a fixed schedule', 'Side-effect management matters more now: smaller meals, more water, anti-nausea on hand', 'Watch for gallbladder symptoms during rapid loss — a real risk per community reports', 'Keep protein and resistance training up to protect muscle'],
      },
      {
        weekStart: 17, weekEnd: 999,
        title: 'Maximum Dose (12mg)',
        description: 'The ceiling, reached around week 13-16 on the Phase 3 ladder. Phase 3 TRIUMPH-1 (2026, 80 weeks) posted the largest weight loss ever in a Phase 3 obesity trial: -19.0% (4mg), -25.9% (9mg), -28.3% (12mg) — with ~30% mean loss at 104 weeks in higher-BMI users and no clear plateau. But 12mg also carries the most side effects and the highest dropout (~11% vs ~7% at 9mg). The 9mg vs 12mg gap is small on loss but large on dysesthesia — many stop at 8-9mg.',
        tips: ['Not everyone needs this — 9mg gives most of the benefit with fewer sensory side effects', 'Side-effect management becomes essential at this dose', 'Watch for gallbladder symptoms during rapid loss — a real risk per community reports', 'Plan your exit strategy — appetite returns 1-3 weeks after stopping, so build habits now'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Each dose step-up', duration: '3-7 days', notes: 'The #1 Reddit complaint. Milder than sema for most users. Worse with fast food and fatty meals.' },
      { name: '"Sulfur burps"', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Variable', notes: 'Community hallmark of all GLP-1 drugs. Egg-like burps. Worse with greasy food. Some users find ginger helps.' },
      { name: 'Appetite gone / food aversion', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Ongoing', notes: 'Desired effect but can become problematic. Reddit users warn: force yourself to eat protein even when not hungry.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-4', duration: 'Usually transient', notes: 'Very commonly discussed and a top Reddit complaint. Glucagon pushes energy expenditure up while intake drops — a caloric-deficit fatigue. Eases as dose/weight stabilize; protein, calories, electrolytes and sleep help.' },
      { name: 'Increased heart rate', severity: 'monitor', likelihood: 'common', onset: 'Ramps during escalation', duration: 'Peaks ~week 24, then partially declines', notes: 'Reta-specific (glucagon arm): ~+6-11 bpm dose-dependent. Partial adaptation on-drug but not back to baseline. Track resting HR; hydrate + electrolytes (taurine/magnesium/potassium are community favorites); a sustained resting HR >100 is a red flag.' },
      { name: 'Dysesthesia (altered skin sensation)', severity: 'monitor', likelihood: 'uncommon', onset: 'Later, higher doses (8-12mg)', duration: 'Usually reversible', notes: 'Reta-specific tingling/burning/pins-and-needles or heat/cold/pressure sensitivity. ~12.5% at 12mg (up to ~21% in TRIUMPH-4), ~8.8% at 9mg, vs <1% placebo — a key reason many hold at 8-9mg. Dose reduction usually helps.' },
      { name: 'Insomnia / "wired"', severity: 'normal', likelihood: 'uncommon', onset: 'Early / escalation', duration: 'Variable', notes: 'Glucagon-driven for some (others get fatigue instead). Try shifting the dose to morning and tightening sleep hygiene.' },
      { name: 'Hair loss / muscle loss', severity: 'monitor', likelihood: 'uncommon', onset: 'Months 3-6', duration: 'Hair usually regrows', notes: 'Tied to rapid weight loss, not the drug itself. Protein ~1.6-2.2 g/kg + resistance training + adequate calories protect muscle; iron/vitamin D and slower loss help hair.' },
      { name: 'Constipation', severity: 'normal', likelihood: 'common', onset: 'Weeks 2+', duration: 'Variable', notes: 'GLP-1 slows gastric emptying. Community fix: fiber supplement, magnesium, hydration.' },
      { name: 'Increased urination', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Ongoing', notes: 'Glucagon receptor effect unique to reta. Stay hydrated. Not diabetes.' },
      { name: 'Heartburn / reflux', severity: 'monitor', likelihood: 'common', onset: 'Weeks 2+', duration: 'While on drug', notes: 'Delayed gastric emptying. Sleep elevated if bad. Some users take OTC antacids.' },
      { name: 'Injection site reactions', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Hours', notes: 'Welts, redness, itching at site. Usually mild. Rotate sites.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'uncommon', onset: 'After dose increases', duration: '1-3 days', notes: 'More common with fast titration. Reddit advice: slow down your step-ups if this happens.' },
      { name: 'Pancreatitis', severity: 'stop', likelihood: 'rare', onset: 'Any time', duration: 'N/A', notes: 'Some Reddit users report ER visits for severe abdominal pain. Seek emergency care for pain radiating to back.' },
      { name: 'Gallbladder events', severity: 'stop', likelihood: 'rare', onset: 'With rapid weight loss', duration: 'N/A', notes: 'Community reports of gallbladder removal during rapid loss. Right-side pain after fatty meals = get checked.' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to back (pancreatitis — ER immediately)',
      'Can\'t keep any fluids down for 24+ hours (dehydration/kidney risk)',
      'Right-side pain after eating (gallbladder — Reddit reports surgical cases)',
      'Injection site abscess or spreading infection (contamination risk with research-grade)',
      '"Stomach paralysis" feeling that persists after stopping (gastroparesis)',
      'Severe fatigue with yellow skin/eyes (liver — get bloodwork)',
    ],
    postCycleNotes: 'Not FDA-approved (TRIUMPH Phase 3 ongoing; topline readouts 2025-26 showed up to ~28% loss at 68 weeks). There is NO long-term human maintenance/discontinuation data — expectations are extrapolated from semaglutide/tirzepatide, where stopping regains roughly two-thirds of lost weight within a year. Community approach: taper to a maintenance dose (~40-60% of peak, often 4-6mg; Phase 3 formally tests a 4mg maintenance arm) rather than stopping cold, and lock in protein + training + sleep habits during treatment. Discuss any long-term plan with a provider.',
    evidenceLevel: 'mixed',
    evidenceNote: 'Strong Phase 2 (NEJM 2023) and Phase 3 TRIUMPH efficacy/adverse-event data exist, but retatrutide is investigational and NOT approved. Every practical detail — real-world dosing, reconstitution, titration, microdosing, maintenance — is gray-market community knowledge, and vial purity/sterility is unverifiable per-vial.',
    dosing: {
      protocol: [
        'Once-weekly subcutaneous injection. Trial ladder: 2mg (wk1-4) → 4 → 6 → 9 → 12mg, stepping every 4 weeks (Lilly\'s smoother Phase 3 ladder; the earlier 4→8mg doubling roughly doubled GI side effects).',
        'Community titrates slower: start 0.5-2mg, hold each step 6-8 weeks (not 4), and many settle at 4-8mg indefinitely rather than pushing to 12mg — "8 is enough" is the common refrain.',
        'Max studied dose is 12mg/week. Phase 3 also tests 9mg and a 4mg maintenance dose.',
        'Evening dosing is favored on Reddit so peak nausea lands during sleep.',
        'Microdosing (sub-2mg) is used by some as a gentler entry or for maintenance — but efficacy is dose-dependent and unproven below trial doses.',
      ],
      reconstitution: [
        'Sold as lyophilized powder (5/10/15/20/30mg vials). Reconstitute with bacteriostatic water (0.9% benzyl alcohol) — not plain sterile water. Swirl gently, never shake.',
        'Flagship setup: 10mg vial + 2mL BAC = 5mg/mL. On a U-100 syringe: 0.5mg = 10u · 1mg = 20u · 2mg = 40u · 4mg = 80u. Formula: units = (dose mg ÷ mg-per-mL) × 100.',
        'Higher maintenance doses won\'t fit a 1mL syringe at 5mg/mL — use a more concentrated mix. At 10mg/mL (10mg+1mL): 8mg = 80u. At 20mg/mL (20mg+1mL, or 30mg+1.5mL): 9mg = 45u, 12mg = 60u.',
        'Store reconstituted vial refrigerated (2-8°C); use within ~28 days. Double-check the mg/mL math with a calculator — a 10× unit/concentration mix-up is the single most dangerous and most common error.',
      ],
    },
    communityTips: [
      '"Start low, go slow" — emphasized more than for tirzepatide because of the potency and the glucagon component. Start 0.5-2mg and hold steps 6-8 weeks.',
      'Dose in the evening to sleep through the worst of the nausea.',
      'Hydrate aggressively and use electrolytes — helps GI effects and the extra urination (glucagon effect).',
      'Track resting heart rate (many use a smartwatch). If it climbs, HOLD the dose instead of escalating.',
      'Some use taurine + magnesium to try to blunt the glucagon-driven heart-rate rise (anecdotal, no trial evidence).',
      'Protein (1.2-1.6 g/kg) and resistance training from day one to preserve lean mass — matters more than the exact dose.',
      'Settle at the lowest effective dose (often 4-8mg) rather than chasing 12mg.',
    ],
    commonMistakes: [
      'Reconstitution math errors — confusing mg with syringe units or the wrong mg/mL → accidental overdose.',
      'Titrating too fast or too high (e.g. a 0.5→4mg jump) → severe nausea, vomiting, dehydration.',
      'Trusting a vendor COA as proof of YOUR vial\'s purity/sterility — batches have failed independent sterility testing despite clean COAs.',
      'Ignoring a rising heart rate and pushing the dose anyway.',
      'Under-eating protein → excess muscle loss during rapid weight loss.',
      'Chasing 12mg for faster loss and getting crushed by fatigue and heart-rate effects when 6-8mg would have worked.',
    ],
    stacking: [
      'Not combined with other incretins (semaglutide/tirzepatide) — redundant, and pure gray-market experimentation with no clinical data.',
      'Protein + resistance training is the only evidence-supported "stack" for preserving lean mass.',
      'Taurine / magnesium / electrolytes are used anecdotally for heart rate and GI comfort — no trial evidence.',
      'Some co-use BPC-157 (gut) or TB-500 (tissue) — no efficacy or safety data with reta; stacking just multiplies dosing-error and side-effect risk.',
    ],
  },
  {
    peptideId: 'glow-blend',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Priming Phase — Nothing Visible Yet',
        description: 'Daily SubQ injections. GHK-Cu activates 300+ tissue repair genes and triggers fibroblast growth. BPC-157 builds new capillary networks (angiogenesis). TB-500 mobilizes repair cells via actin regulation. Users report no visible changes — this is cellular-level work. Plastic surgeons who prescribe GLOW post-op say this phase is critical foundation.',
        tips: ['Blue-green tint in syringe is normal — that\'s the copper peptide', 'Rotate injection sites (abdomen or thigh) to avoid bruising buildup', 'Take close-up progress photos in consistent lighting — you\'ll want them later', 'If pairing with weight loss (reta/sema), this is when skin protection starts'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'First Signs — Healing & Texture',
        description: 'Still daily. Users report cuts and scrapes healing noticeably faster. Skin starts feeling slightly firmer or "plumper." Hair and nail growth improvement mentioned in community posts. Post-surgical patients report incision scars healing flatter and lighter. The BPC-157 + TB-500 synergy is doing the heavy lifting — BPC builds blood supply, TB-500 sends repair cells to use it.',
        tips: ['Consistency is everything — don\'t skip days in this window', 'Vitamin C supplementation supports collagen synthesis', 'Stay hydrated — collagen building requires water', 'Some users report deeper sleep during this phase'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Visible Results — Skin Quality',
        description: 'Step down to 5x/week. This is when community members start seeing real results — improved elasticity, finer texture, reduced fine lines, "glow" that others notice. Users on GLP-1 weight loss say skin tightening keeps pace with fat loss instead of going saggy. One plastic surgeon (Dr. Agullo) doses patients daily for 3-4 weeks post-op then adjusts — you can follow similar tapering.',
        tips: ['5 on / 2 off lets collagen organize during rest days', 'Compare your week 1 photos — changes are gradual so you might miss them', 'Reddit users doing reta + GLOW say this combo prevents the "Ozempic face"', 'Plan your off-cycle: 4-8 weeks break, then 2-3x/week maintenance if continuing'],
      },
    ],
    sideEffects: [
      { name: 'Blue-green injection site staining', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: '2-3 days', notes: 'Copper from GHK-Cu. Purely cosmetic — fades on its own. Rotate sites to spread it out.' },
      { name: 'Injection site welts/redness', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: '15-60 minutes', notes: 'Normal SubQ reaction. Brief warmth and redness. Goes away quickly.' },
      { name: 'Mild nausea', severity: 'normal', likelihood: 'uncommon', onset: 'Post-injection', duration: 'Brief', notes: 'More common at higher doses or if injected on empty stomach.' },
      { name: 'Metallic taste', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks 4+', duration: 'Variable', notes: 'Community red flag for copper accumulation. Reduce dose or start off-cycle early.' },
      { name: 'GI discomfort', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks 4+', duration: 'Variable', notes: 'Another copper saturation signal. Take a break if this appears.' },
    ],
    redFlags: [
      'Wilson\'s disease (copper-metabolism disorder) is an ABSOLUTE contraindication — even small exogenous copper worsens accumulation. Screen with ceruloplasmin + 24h urine copper first if there is any suspicion.',
      'Persistent metallic taste that won\'t go away (copper toxicity — stop immediately)',
      'Copper-overload cluster: ongoing nausea/vomiting/abdominal pain, unusual fatigue/weakness, mood or neurological changes (tremor, coordination)',
      'Injection site abscess or spreading infection (not just redness — actual heat/pus)',
      'Yellow skin or eyes, or right-upper-quadrant pain (liver — stop and get bloodwork)',
      'Suggested labs on longer/repeat cycles: serum copper, ceruloplasmin, CBC, CMP (liver enzymes), hs-CRP — baseline and every few weeks',
    ],
    postCycleNotes: 'Collagen remodeling is structural — benefits persist well after stopping. Community protocol: 2-4 weeks off after a short (4-8wk) run, 4-8 weeks (roughly off ≈ on) after a long 8-12wk cycle, then optional 2-3x/week maintenance. Off-cycle length is genuinely contested — one mechanistic argument says copper-transporter (CTR1) recovery takes only ~10-14 days, while the community norm is 2-4+ weeks; err longer if running back-to-back. Zinc 15-25mg/day during/after helps counterbalance copper. Monitor copper levels with bloodwork (serum copper, ceruloplasmin) if cycling repeatedly. Copper accumulation is the reason it is cycled, not run continuously.',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'GHK-Cu has solid human data — for TOPICAL cosmetic use. The injectable GLOW blend and its 50/10/10 ratio are entirely anecdotal (no human trials of the blend), and BPC-157/TB-500 human efficacy data is essentially zero. Treat all dosing as community-derived.',
    dosing: {
      protocol: [
        'Standard vial is 70mg: GHK-Cu 50mg + TB-500 10mg + BPC-157 10mg at a fixed 50/10/10 ratio.',
        'Typical dose ~2.33mg of blend/day ≈ 1.67mg GHK-Cu + 0.33mg TB-500 + 0.33mg BPC-157. Range roughly 1.4-3.5mg.',
        'Common cycle: daily loading weeks 1-4 → 5-on/2-off weeks 5-8 → optional every-other-day maintenance. Then 4-8 weeks off.',
        'Copper load is the limiting factor — never run continuously. The weekend off-days on a 5-on/2-off schedule cut cumulative GHK-Cu exposure.',
        'Best fits: skin laxity during GLP-1 weight loss (to blunt "Ozempic face"), post-surgical recovery, general anti-aging, and injury recovery.',
        'Pick the water volume that lands your target dose on a clean 10-unit mark: 70mg + 3mL → 2.33mg = 10 units (vial ≈ 30 doses); 70mg + 2mL → 3.5mg = 10 units (vial ≈ 20 doses).',
      ],
      reconstitution: [
        '70mg + 3mL BAC water = 23.3mg/mL. On a U-100 syringe: 2.33mg = 0.1mL = 10 units; 1.4mg ≈ 6 units. Or 70mg + 2mL = 35mg/mL → 3.5mg = 10 units, 2.8mg = 8 units.',
        'Vials vary — 70mg (50/10/10) is standard, but 60mg (50/5/5) and 90mg exist, and one vendor assay is 41.97/14.03/14mg. Enter your vial\'s actual per-component mg rather than assuming the ratio.',
        'Copper is the rate-limiter: GHK-Cu is ~15% elemental copper, so ~2.5mg GHK-Cu/day delivers ~0.4-0.75mg copper subq (bypassing gut regulation). That is why it is cycled, not run forever.',
        'A blue-green tint when mixed is normal — that is the copper. Add BAC water slowly down the vial wall, let it sit, then swirl gently; never shake.',
        'Use bacteriostatic (not sterile) water. Refrigerate 2-8°C, protect from light, use within ~28 days. Do NOT freeze — the copper-peptide chelate is the most fragile component.',
      ],
    },
    communityTips: [
      'Rotate injection sites (abdomen/thigh) — daily same-site dosing builds nodules within weeks.',
      'Take close-up progress photos in consistent lighting from week 1 — changes are gradual and easy to miss day to day.',
      'Pair with a GLP-1 (retatrutide/semaglutide/tirzepatide) so skin tightening keeps pace with fat loss — the main reason people run GLOW during a weight-loss phase.',
      'Vitamin C supports collagen, but NEVER layer topical GHK-Cu with L-ascorbic acid — the low pH breaks the copper bond. Separate them (copper AM, vitamin C PM).',
      'Inject slowly (5-10s), let the alcohol swab dry, and bring the vial to room temperature to reduce the copper sting.',
      'Deeper sleep is commonly reported during a cycle.',
      'Consider zinc 15-25mg/day during and after a cycle — copper and zinc compete, and prolonged GHK-Cu can tip the ratio.',
    ],
    commonMistakes: [
      'Running it continuously without a break → copper accumulation (metallic taste, GI upset, toxicity).',
      'Shaking the vial instead of a gentle swirl — degrades the peptides.',
      'Adding other separate-vial peptides into the GLOW syringe — it is already a pre-blend; use a separate syringe for anything else.',
      'Expecting overnight results — this is cellular work; visible skin changes cluster around weeks 5-8.',
      'Skipping copper / ceruloplasmin bloodwork on aggressive (3.5mg 5x/week) or back-to-back cycles.',
    ],
    stacking: [
      'GLOW + GLP-1 (reta/sema/tirz) — the flagship pairing; skin tightening tracks fat loss and helps prevent "Ozempic face".',
      'KLOW = GLOW + KPV — adds the anti-inflammatory KPV tripeptide for a stronger gut/skin/healing stack.',
      'Topical GHK-Cu serum as a targeted adjunct for skin/hair (kept separate from vitamin C).',
      'If adding any other injectable, use a separate syringe — do not co-mix into the GLOW vial (differing pH/stability, and copper is fragile).',
    ],
  },
  {
    peptideId: 'kpv',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Settling In — Anti-Inflammatory Priming',
        description: 'KPV is the C-terminal tripeptide of α-MSH and works by calming NF-κB inflammation and stabilizing mast cells. Evidence is preclinical (animal colitis models) plus heavy gut/histamine-community anecdote — no human trials. Most users report little in the first days; some notice reduced bloating or calmer histamine/allergy symptoms early.',
        tips: ['For gut issues use oral/enteric-coated — the PepT1 transporter delivers it to inflamed intestinal tissue', 'Take oral doses on an empty stomach to limit enzyme breakdown', 'Keep a food + symptom diary from day one', 'SubQ (200–500 mcg/day) is the route for systemic or skin inflammation'],
      },
      {
        weekStart: 3, weekEnd: 6,
        title: 'Peak Anti-Inflammatory Window',
        description: 'This is where most users report the clearest benefit: reduced gut inflammation and food reactivity, calmer skin (eczema, acne, urticaria), and lower mast-cell/histamine reactivity. KPV is notably clean — it is often kept on hand to calm injection-site or histamine flares from other peptides like BPC-157/TB-500.',
        tips: ['Pair with diet changes — KPV supports, it doesn\'t override a triggering diet', 'Topical 0.1–1% works well for localized skin flares', 'Commonly stacked with BPC-157 as a gut/skin duo', 'If symptoms return fast on a 2-day break, look for an underlying driver'],
      },
      {
        weekStart: 7, weekEnd: 8,
        title: 'Consolidation / Reassess',
        description: 'Effects plateau. Users either taper off to reassess baseline or continue through an active flare. Because KPV is not strongly angiogenic, cycling pressure is lower than for BPC/TB, but breaks are still used to test whether the underlying issue has resolved.',
        tips: ['Cycle off to see what holds without it', 'Note which symptoms rebound — that tells you what it was actually doing', 'Reconstituted vials last ~28 days refrigerated; never freeze'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site irritation', severity: 'normal', likelihood: 'uncommon', onset: 'Immediate', duration: '1-2 days', notes: 'Mild; rotate sites and use a fresh needle.' },
      { name: 'Mild nausea', severity: 'normal', likelihood: 'rare', onset: 'Early', duration: 'Brief', notes: 'Uncommon; take oral with a tiny bit of food if it bothers you (non-gut targeting).' },
      { name: 'Headache', severity: 'normal', likelihood: 'rare', onset: 'Early', duration: 'Hours', notes: 'Hydrate; lower dose if persistent.' },
    ],
    redFlags: [
      'Allergic reaction — hives, swelling, difficulty breathing (it is an MSH fragment)',
      'Worsening rather than improving GI symptoms',
      'Fever or signs of injection-site infection',
    ],
    postCycleNotes: 'No hormonal suppression, so no PCT. Users simply stop and reassess, then re-run during flares. Evidence is entirely preclinical/anecdotal — treat dosing as provisional and verify independently.',
  },
  {
    peptideId: 'cjc-1295-dac',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Loading Toward Steady State',
        description: 'The DAC (Drug Affinity Complex) binds albumin and stretches the half-life to ~6–8 days, so CJC-1295 with DAC creates a sustained GH/IGF-1 "bleed" rather than the sharp pulses of the no-DAC version. Dosed in MILLIGRAMS 1–2×/week (not daily). Onset is gradual — expect improved sleep and well-being to build over the first couple of weeks as levels accumulate. Human data at community doses is limited/anecdotal.',
        tips: ['Dose 1–2 mg once weekly, or split 1 mg twice weekly for steadier levels', 'Do NOT dose daily like no-DAC — that just stacks side effects', 'Steady state takes ~3–4 weeks; don\'t over-dose while waiting', 'Get a baseline IGF-1 before starting'],
      },
      {
        weekStart: 3, weekEnd: 8,
        title: 'Sustained Elevation',
        description: 'IGF-1 climbs to a plateau (the Teichman 2006 study showed IGF-1 elevated for days after a single dose, accumulating with weekly dosing). Users report better recovery, skin, and gradual body-comp changes. Because GH is elevated continuously, water retention, tingling, and lethargy tend to be more pronounced and longer-lasting than with the pulsatile no-DAC version.',
        tips: ['Split the weekly dose into 2× to smooth the "bleed" and reduce side-effect spikes', 'Watch for carpal-tunnel-like tingling — reduce dose 30–50% if it appears', 'Track fasting glucose — sustained GH can nudge insulin resistance', 'Many practitioners prefer no-DAC + Ipamorelin for a more physiologic profile'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'Peak & Plan Off-Cycle',
        description: 'Body-composition and recovery benefits accumulate. Of the GH-releasing options, DAC carries the highest receptor-desensitization risk from constant stimulation, so cycling off matters more here. Plan a break of at least 4 weeks (arguably longer than no-DAC).',
        tips: ['Cycle 8–12 weeks on, then 4+ weeks off', 'Don\'t stack with exogenous HGH — compounds downregulation', 'Recheck IGF-1 before re-cycling', 'Refrigerate reconstituted vials; use bacteriostatic water'],
      },
    ],
    sideEffects: [
      { name: 'Sustained water retention / bloating', severity: 'normal', likelihood: 'common', onset: 'First weeks', duration: 'Can persist through cycle', notes: 'More than no-DAC. Lower to 1 mg/week, hydrate, reduce sodium.' },
      { name: 'Lethargy / fatigue', severity: 'monitor', likelihood: 'common', onset: 'After injection, ongoing', duration: 'Sustained', notes: 'Notably associated with the DAC version. Dose reduction helps.' },
      { name: 'Flushing / head rush', severity: 'normal', likelihood: 'common', onset: 'Minutes post-injection', duration: '5-30 minutes', notes: 'Vasodilation. Lower dose if bothersome.' },
      { name: 'Tingling / numbness (carpal tunnel-like)', severity: 'monitor', likelihood: 'uncommon', onset: 'First weeks', duration: 'Can persist', notes: 'Constant fluid retention. Cut dose 30–50%; wrist splints at night; reversible.' },
      { name: 'Elevated fasting glucose', severity: 'monitor', likelihood: 'uncommon', onset: 'Over weeks', duration: 'While dosing', notes: 'Sustained GH is the bigger metabolic risk vs pulsatile. Check labs.' },
    ],
    redFlags: [
      'Persistent numbness/tingling that doesn\'t resolve on dose reduction',
      'Signs of high blood sugar (excess thirst, frequent urination)',
      'Severe or worsening headache or vision changes',
      'Acromegaly signs with long/high use — enlarging hands, feet, facial features, joint pain',
      'Avoid entirely with active cancer (GH/IGF-1 axis)',
    ],
    postCycleNotes: 'No HPG suppression, so no traditional PCT. But the sustained stimulation means the GH axis and receptors need recovery — take at least 4 weeks off (longer than no-DAC). Long DAC runs carry the highest desensitization risk of the GH-releasing peptides; cycling on/off is more important here.',
  },
  {
    peptideId: 'sermorelin',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Onset — Sleep First',
        description: 'Sermorelin is the original GHRH(1-29) analog with the shortest half-life (~10–20 min), producing a brief, physiologic GH pulse. It has more clinical history than most peptides here (formerly FDA-approved as Geref). Gradual by design — the first and most consistent report is deeper, more restorative sleep. Not a fast or dramatic compound.',
        tips: ['Dose 200–300 mcg nightly, before bed, on an empty stomach', 'Avoid carbs/fat for ~2 hr before and ~30 min after — insulin blunts the GH pulse', '5 nights on / 2 off is common to keep the pituitary responsive', 'Overweight/insulin-resistant users start lower (100–150 mcg) to limit water retention'],
      },
      {
        weekStart: 5, weekEnd: 12,
        title: 'Building — Recovery & Body Comp',
        description: 'IGF-1 rises (check baseline and again at 6–8 weeks; expect a 50–100% rise, dosing to mid-normal). Users report better recovery, energy, firmer skin, and gradual fat loss — especially visceral — once the axis is up-regulated. It is not a weight-loss drug: fat loss shows up alongside a caloric deficit and training.',
        tips: ['Dose to your IGF-1 target, not to max', 'Recheck IGF-1 at 4–8 weeks and adjust 50–100 mcg', 'Pair with Ipamorelin (GHRH + GHRP) for a bigger, cleaner pulse', 'Store refrigerated — heat above 8°C irreversibly denatures it'],
      },
      {
        weekStart: 13, weekEnd: 24,
        title: 'Cumulative Effects',
        description: 'The most significant physique and anti-aging effects appear over months (3–6+) as the GH axis is fully engaged. Many clinics run sermorelin long-term with monitoring rather than strict cycling — there is genuine debate over whether cycling is needed since it just augments natural physiology.',
        tips: ['Long-game compound — judge it over months, not weeks', 'Weekly rest days largely handle receptor desensitization', 'Periodic IGF-1 and fasting-glucose labs if running long-term'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Self-resolves', notes: 'Redness/swelling/itch — the most common effect. Rotate sites.' },
      { name: 'Facial/neck flushing', severity: 'normal', likelihood: 'common', onset: 'Immediately post-injection', duration: 'Minutes', notes: 'Harmless vasodilation.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'First 1-2 weeks', duration: 'Transient', notes: 'Hydrate; lower dose if needed.' },
      { name: 'Mild water retention', severity: 'normal', likelihood: 'common', onset: 'First ~2 weeks', duration: 'Self-limiting', notes: 'GH-driven. Lower start dose in at-risk users.' },
      { name: 'Trouble sleeping if dosed too early', severity: 'monitor', likelihood: 'uncommon', onset: 'Same night', duration: 'Hours', notes: 'Dose right before bed.' },
    ],
    redFlags: [
      'Severe allergic reaction (facial swelling, difficulty breathing, severe rash) — seek care immediately',
      'Chest pain',
      'Worsening or severe headaches or vision changes',
      'Persistent edema or numbness',
      'Avoid with active cancer (GH/IGF-1 axis)',
    ],
    postCycleNotes: 'No HPG suppression, no PCT. GHRH-receptor desensitization is the only concern with continuous daily use, and weekly rest days (5-on/2-off) largely address it. The short half-life means the natural axis recovers quickly. Lowest systemic burden of the GH-releasing options.',
  },
  {
    peptideId: 'tesamorelin',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Biochemical Phase — Nothing in the Mirror Yet',
        description: 'Tesamorelin is an FDA-approved GHRH analog (Egrifta) with the strongest evidence base here — approved for reducing visceral abdominal fat. IGF-1 rises but visible changes lag. This early window is where water retention/peripheral edema and mild carpal-tunnel-like tingling are most common (GH raises muscle glycogen, ~3 kg water per 1 kg glycogen).',
        tips: ['Studied dose is 2 mg/day SubQ; many titrate from 1 mg the first week to ease edema', 'Inject in the evening, fasted — carbs/fat blunt the GH pulse', 'Rotate abdominal sites (≥2 in / 5 cm from navel) to avoid lipohypertrophy', 'Track baseline waist circumference and IGF-1, not just the scale'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Stabilizing',
        description: 'Edema and tingling usually settle as the dose stabilizes. Users report better sleep and recovery. Visceral fat has not visibly moved yet — the effect is biochemical first.',
        tips: ['If tingling/edema persists, hold at a lower dose', 'Reduce carbs near the injection to preserve GH release', 'Monitor fasting glucose/HbA1c — tesamorelin raised diabetes incidence in trials (5% vs 1%)'],
      },
      {
        weekStart: 9, weekEnd: 12,
        title: 'First Visible Waistline Changes',
        description: 'Community and clinical reports converge around week 8+ for the first visible visceral/waistline changes. Judge progress by waist measurement, not weight — this is a visceral-fat tool, not general weight loss.',
        tips: ['Measure waist monthly', 'Pair with diet and training for meaningful change', 'Keep IGF-1 in the upper-normal range, not supraphysiologic'],
      },
      {
        weekStart: 13, weekEnd: 26,
        title: 'Peak Visceral Fat Loss',
        description: 'Clinical data shows visceral adipose tissue reduced ~15–18% by 26 weeks, with IGF-1 plateauing around week 26 and holding through 52. Also reduces liver fat. Trials showed no tachyphylaxis over 52 weeks of continuous daily use, so on/off cycling is a cost/community choice rather than an efficacy one.',
        tips: ['Watch for joint pain (arthralgia) — common and GH-mediated; usually eases with time or a dose drop', 'Continue waist + IGF-1 + glucose monitoring', 'Visceral fat re-accumulates after stopping — benefit is maintenance-dependent'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site reactions', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Transient', notes: '~24.5% in trials (erythema, pruritus, pain). Rotate sites; room-temp the solution; let alcohol dry.' },
      { name: 'Arthralgia (joint pain)', severity: 'monitor', likelihood: 'common', onset: 'First weeks', duration: 'Often eases with time', notes: 'GH-mediated. Usually mild; dose reduction helps.' },
      { name: 'Peripheral edema / swelling', severity: 'monitor', likelihood: 'common', onset: 'First 4-6 weeks', duration: 'Usually stabilizes', notes: 'Part of the GH-effect cluster (25.6% vs 13.7% placebo). Hold at lower dose if pronounced.' },
      { name: 'Carpal-tunnel-like numbness/tingling', severity: 'monitor', likelihood: 'uncommon', onset: 'First weeks', duration: 'Reversible', notes: 'Fluid pressing on nerves. Dose-adjust.' },
      { name: 'Raised fasting glucose / new diabetes risk', severity: 'monitor', likelihood: 'uncommon', onset: 'Over months', duration: 'While dosing', notes: 'Diabetes incidence 5% vs 1% in trials (HR 3.3). Monitor HbA1c.' },
    ],
    redFlags: [
      'Persistent or worsening swelling, especially with shortness of breath',
      'Persistent numbness/tingling or carpal tunnel symptoms',
      'Rising fasting glucose / HbA1c ≥6.5% or new diabetes symptoms',
      'Hypersensitivity — widespread rash, hives, swelling',
      'Contraindicated with active malignancy, pregnancy, or pituitary tumor',
    ],
    postCycleNotes: 'No HPTA suppression, so no PCT needed. The key clinical finding: visceral fat re-accumulates after dosing stops and IGF-1 returns toward baseline — the benefit is maintenance-dependent. Build diet and training habits during treatment so results hold.',
  },
  {
    peptideId: 'semax',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Acute Effects — Same-Day Focus',
        description: 'Semax is a synthetic ACTH(4–7) analog registered as a drug in Russia (stroke, TBI, cognition) but not FDA-approved; Western use is anecdotal. It upregulates BDNF/NGF and boosts dopaminergic tone. The draw is acute: within 15–30 minutes users report calm focus, reduced mental fog, verbal fluency, and motivation, lasting ~4–8 hours.',
        tips: ['Dose in the morning — it is stimulating and late dosing wrecks sleep', 'Start low (one spray of 0.1% ≈ 100 mcg) to gauge response', 'Proper nasal technique: head slightly forward, spray toward the outer nasal wall, don\'t sniff hard down the throat', 'Distinguish plain Semax from the far more potent N-Acetyl Semax Amidate — dose accordingly'],
      },
      {
        weekStart: 2, weekEnd: 4,
        title: 'Peak Subjective Effects',
        description: 'Effects are cumulative more than acute — meaningful cognitive gains (memory recall, sustained attention, mental energy) typically emerge in weeks 2–3. BDNF changes underpin this. This is where most users judge whether it works for them.',
        tips: ['Give it 2–3 weeks before judging — treat it as cumulative, not a one-off stimulant', 'Take weekends off to limit tolerance', 'Pair with Selank to offset any overstimulation (the "Russian stack")', 'Reduce dose if you feel jittery, irritable, or flat'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Diminishing Returns — Cycle Off',
        description: 'Beyond ~8 weeks of continuous use, effects tend to diminish (receptor adaptation). Standard courses run 10–30 days with a 2–4 week washout between them.',
        tips: ['Cycle 10–30 days on, 2–4 weeks off', 'No dependence or withdrawal is reported', 'Some neuroplastic benefit persists after stopping, then fades', 'Refrigerate; degradation from heat/light is a common mistake'],
      },
    ],
    sideEffects: [
      { name: 'Nasal irritation / burning', severity: 'normal', likelihood: 'common', onset: 'On administration', duration: 'Brief', notes: 'Alternate nostrils; proper technique; dilute if needed.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Same day', duration: 'Hours', notes: 'Hydrate; lower dose.' },
      { name: 'Overstimulation (restlessness, insomnia)', severity: 'monitor', likelihood: 'uncommon', onset: 'Same day', duration: 'Hours', notes: 'Dose-dependent. Reduce dose; dose earlier in the day.' },
      { name: 'Irritability / mental flattening', severity: 'monitor', likelihood: 'rare', onset: 'During cycle', duration: 'While dosing', notes: 'Lower dose or shorten the cycle.' },
    ],
    redFlags: [
      'Persistent insomnia',
      'Marked irritability or agitation',
      'Persistent headache or significant blood-pressure elevation',
      'Allergic reaction',
    ],
    postCycleNotes: 'No hormonal suppression; used in short courses or situationally. Cycle (10–30 days on, 2–4 weeks off) to keep receptors responsive. Not FDA-approved — Western evidence is anecdotal on top of older Russian clinical data.',
  },
  {
    peptideId: 'selank',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Acute Calm — Without Sedation',
        description: 'Selank is a synthetic analog of the immune peptide tuftsin, approved in Russia for generalized anxiety but not FDA-approved. It enhances GABA function (not at the benzodiazepine site, so no sedation or dependence), stabilizes enkephalins, and modulates serotonin/BDNF. Within 15–60 minutes users report reduced anxiety and mental tension with a clear head — "calm clarity," each dose lasting ~12–24 hours.',
        tips: ['Start low (250–300 mcg) to establish your baseline', 'Non-sedating, so it is daytime-friendly and timing is flexible', 'Use before anxiety-provoking situations', 'Good nasal technique matters — poor technique wastes the peptide'],
      },
      {
        weekStart: 2, weekEnd: 4,
        title: 'Clearer Anxiolytic & Cognitive Effects',
        description: 'The anxiolytic effect becomes clearer, especially in normally stressful situations, and cognitive benefits (focus, verbal fluency) emerge more fully. Russian trials rate its anxiolytic efficacy comparable to medazepam/phenazepam but without sedation, cognitive dulling, or addiction. Community advice: commit to a full 4-week trial before judging.',
        tips: ['Give it the full 4 weeks — it is subtle and cumulative, not a benzo-like knockout', 'Pair with Semax for "calm focus" — run Selank alone 5–7 days first, then add Semax', 'Don\'t over-dose expecting sedation; that is not its mechanism', 'It is not a substitute for treating a genuine anxiety disorder'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Maintenance or Cycle Off',
        description: 'Used situationally or in blocks. No tolerance, dependence, or withdrawal was seen in Russian studies, so cycling (classic 10 days on / 5 off, or longer blocks) is precautionary to preserve receptor sensitivity.',
        tips: ['Cycle 10 on / 5 off, or in 8-week blocks', 'Effects taper after stopping; some BDNF-linked benefit lingers', 'Refrigerate; heat/light degrade it'],
      },
    ],
    sideEffects: [
      { name: 'Nasal irritation', severity: 'normal', likelihood: 'common', onset: 'On administration', duration: 'Brief', notes: 'Alternate nostrils; proper technique.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Same day', duration: 'Hours', notes: 'Hydrate; lower dose.' },
      { name: 'Mild drowsiness / fatigue', severity: 'normal', likelihood: 'uncommon', onset: 'Same day', duration: 'Hours', notes: 'Uncommon; adjust timing or lower dose.' },
      { name: 'Paradoxical anxiety / restlessness', severity: 'monitor', likelihood: 'rare', onset: 'Same day', duration: 'Hours', notes: 'Reduce dose.' },
    ],
    redFlags: [
      'Persistent paradoxical anxiety or restlessness',
      'Relying on it in place of treating a genuine anxiety disorder',
      'Allergic reaction',
    ],
    postCycleNotes: 'No dependence, withdrawal, or PCT. Effects taper after stopping. Cycling is precautionary. Not FDA-approved — Western evidence is anecdotal on top of older Russian clinical data.',
  },
  {
    peptideId: 'nad-plus',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'Injectable/subQ NAD+ benefits are anecdotal. Human clinical work centers on IV NAD+ and oral precursors (NMN/NR); how much subQ NAD+ reaches cells intact is unproven. Treat energy/anti-aging claims as unverified.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Tolerance-Building — Go Low and Slow',
        description: 'NAD+ is the body\'s central redox coenzyme (mitochondrial energy, sirtuin activation, DNA repair). The dominant week-1 experience is not benefit but the injection reaction: flushing, nausea, and a chest/abdominal "pressure" or cramping that tracks how FAST you push the plunger, not just the dose. Starting at 25mg and injecting over 30–60+ seconds is how people make it tolerable.',
        tips: ['Start at 25mg (25 units of a 100mg/mL mix) — do not open at 100mg', 'Inject SLOWLY: push over 30–60 seconds, pause if pressure builds', 'Dose in the morning — it can be stimulating and disrupt sleep', 'Have water and a chair; the reaction passes within minutes'],
      },
      {
        weekStart: 2, weekEnd: 2,
        title: 'Ramping the Dose',
        description: 'As tolerance to the flush builds, the ladder steps to 50mg. Some users report cleaner energy, sharper focus, or better mood; many notice little beyond the injection reaction. Both are normal — subQ NAD+ is highly individual and the benefit signal is not reliable.',
        tips: ['Only step up if 25mg was tolerable — otherwise hold', 'Still inject slowly; the reaction returns at each dose increase', 'Track energy/sleep/mood so you can judge real effect vs. placebo', 'Warm the vial to room temp before injecting'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Full Dose & Honest Assessment',
        description: 'At 100mg, decide whether NAD+ is doing anything for you worth the cost and the injection burden. There is no established maintenance protocol, so keep blocks short (4 weeks) and take 1–2 weeks off rather than running it continuously.',
        tips: ['If you feel nothing by now, it may not be worth continuing', 'Do not exceed 100mg subQ chasing an effect', 'Plan an off-week — cycling is the conservative default here', 'Bloodwork isn\'t validated for subQ NAD+, but note any BP or heart-rate changes'],
      },
    ],
    sideEffects: [
      { name: 'Flushing / warmth', severity: 'normal', likelihood: 'common', onset: 'On injection', duration: 'Minutes', notes: 'Rate-dependent. Inject slower.' },
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'On injection', duration: 'Minutes', notes: 'Slow the push; lower the dose.' },
      { name: 'Chest / abdominal pressure or cramping', severity: 'monitor', likelihood: 'common', onset: 'On injection', duration: 'Minutes', notes: 'Classic fast-injection reaction. Pause and inject more slowly.' },
      { name: 'Injection-site pain / redness', severity: 'normal', likelihood: 'common', onset: 'On injection', duration: 'Hours', notes: 'Rotate sites.' },
      { name: 'Lightheadedness / blood-pressure change', severity: 'monitor', likelihood: 'uncommon', onset: 'On injection', duration: 'Minutes', notes: 'Sit down; hydrate. Stop if it persists.' },
      { name: 'Insomnia / overstimulation', severity: 'monitor', likelihood: 'uncommon', onset: 'Same day', duration: 'Hours', notes: 'Dose earlier in the day.' },
    ],
    redFlags: [
      'Severe or persistent chest pressure, or pain that does not resolve within minutes',
      'Fainting, severe lightheadedness, or a large blood-pressure swing',
      'Signs of an allergic reaction (hives, swelling, difficulty breathing)',
      'Palpitations or an irregular heartbeat',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. There is no validated maintenance schedule for subQ NAD+ — run short 4-week blocks with 1–2 weeks off rather than continuous use. Not FDA-approved for these uses; benefits beyond the injection experience are anecdotal.',
    dosing: {
      protocol: [
        'Start 25mg/day, ramp 25 → 50 → 100mg over ~3 weeks as tolerance builds',
        'Injection RATE controls side effects more than dose — push over 30–60+ seconds',
        'Morning dosing; it can be stimulating',
        'Cap subQ dosing around 100mg; higher amounts mostly amplify the reaction',
      ],
      reconstitution: [
        '500mg vial + 5mL BAC water = 100mg/mL',
        '25mg = 25 units · 50mg = 50 units · 100mg = 100 units (full 1mL U-100 syringe)',
        'Refrigerate; use within ~28 days',
      ],
    },
    communityTips: [
      'Slower is the whole game — people who "can\'t tolerate NAD+" are usually injecting too fast',
      'Room-temperature solution injects more comfortably than cold from the fridge',
      'Split into two smaller injections if one 100mg push is too intense',
    ],
    commonMistakes: [
      'Pushing the plunger fast — the #1 cause of the nausea/pressure reaction',
      'Starting at 100mg instead of ramping from 25mg',
      'Dosing late in the day and wrecking sleep',
      'Expecting IV-level effects from subQ — absorption and cellular uptake are unproven',
    ],
    stacking: [
      'Often paired with GLP-1 or GH-axis protocols for "energy/recovery," but there is no synergy data — treat as additive experiments',
      'Oral NMN/NR are the better-studied way to raise NAD+; some prefer those over injections',
    ],
  },
  {
    peptideId: 'cagrilintide',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 2, title: 'Priming — 0.6 mg', description: 'Long-acting amylin analog phase-in. At 0.6 mg the goal is tolerance, not appetite suppression — you may feel very little. Its ~1-week half-life means levels are still climbing toward steady state, so effects build across the whole two weeks rather than peaking day one.', tips: ['Pick a fixed weekly injection day and anchor it to something you never skip (Sunday coffee, etc.).', 'Eat smaller, protein-forward meals from day one; it trains the habit before appetite drops.', 'Rotate injection sites (abdomen, thigh, upper arm) week to week — same weekday, different spot.'] },
      { weekStart: 3, weekEnd: 4, title: 'First real signal — 1.2 mg', description: 'Most people first notice genuine appetite suppression and earlier fullness here. Amylin slows gastric emptying, so meals sit longer — this is where mild nausea and constipation typically show up if they will.', tips: ['Hydrate deliberately (2–3 L/day). Amylin-driven constipation is dehydration-sensitive.', 'Stop eating at the first "comfortable", not "full" — the fullness signal now arrives late.', 'Do not escalate early even if it feels easy; the half-life means you have not seen the full 1.2 mg effect yet.'] },
      { weekStart: 5, weekEnd: 6, title: 'Standard dose — 2.4 mg', description: 'The common maintenance dose for people not stacking or chasing maximal effect. Appetite suppression is now clearly present and steady. Many users stay here indefinitely rather than pushing to 4.5 mg.', tips: ['Weigh weekly, same conditions — trend matters more than any single day.', 'If side effects are absent and appetite control is good, 2.4 mg is a legitimate stopping point.', 'Add a fiber source or magnesium at night if constipation persists.'] },
      { weekStart: 7, weekEnd: 16, title: 'Optional max — 4.5 mg & continuous use', description: 'Escalate to 4.5 mg only if 2.4 mg has plateaued and is well tolerated. Cagrilintide is designed for continuous weekly use with no built-in off-cycle — the amylin pathway does not require washout the way some peptides do.', tips: ['At 4.5 mg on a 3.33 mg/mL fill you exceed a U-100 syringe (~135 units) — either split into two draws or use a lower fill volume for a higher concentration.', 'Reassess every 4–6 weeks: if weight and appetite are stable, hold rather than climb.', 'There is no mandatory stop, but periodic dose holidays confirm the dose is still doing something.'] },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'monitor', likelihood: 'common', onset: 'First 24–72h after dose, worst after each escalation', duration: 'Days, fading over 1–2 weeks at a stable dose', notes: 'Dose-dependent and titration-driven. Slower escalation is the single biggest lever.' },
      { name: 'Constipation', severity: 'monitor', likelihood: 'common', onset: 'Week 2 onward', duration: 'Persistent while dosing if not managed', notes: 'Amylin slows gut motility. Water, fiber, magnesium, and movement address it.' },
      { name: 'Appetite loss / early satiety', severity: 'normal', likelihood: 'common', onset: 'Within 1–2 weeks', duration: 'Throughout use (the intended effect)', notes: 'Guard protein and micronutrient intake so weight loss is fat, not muscle.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'uncommon', onset: 'After dose, usually post-escalation', duration: 'Hours', notes: 'If it happens more than once per cycle, hold the dose and do not escalate.' },
      { name: 'Diarrhea', severity: 'monitor', likelihood: 'uncommon', onset: 'Variable', duration: 'Transient', notes: 'Alternates with constipation in some users as gut motility recalibrates.' },
      { name: 'Sulfur ("egg") burps', severity: 'normal', likelihood: 'uncommon', onset: 'Days after dose', duration: 'Transient', notes: 'Slowed gastric emptying byproduct; smaller lower-fat meals reduce it.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'uncommon', onset: 'First weeks / after escalation', duration: 'Transient', notes: 'Often secondary to sharply reduced calorie intake rather than the peptide itself.' },
      { name: 'Injection-site redness', severity: 'normal', likelihood: 'uncommon', onset: 'Minutes to hours', duration: '1–2 days', notes: 'Rotate sites; persistent hard lumps mean you are injecting too shallow or reusing sites.' },
      { name: 'Dizziness / lightheadedness', severity: 'monitor', likelihood: 'rare', onset: 'Variable', duration: 'Transient', notes: 'Usually dehydration or under-eating; sit down, hydrate, eat.' },
    ],
    redFlags: [
      'Persistent severe abdominal pain radiating to the back (possible pancreatitis) — stop and seek care.',
      'Vomiting so frequent you cannot keep fluids down (dehydration risk).',
      'Signs of gallbladder trouble: right upper-abdomen pain, fever, jaundice.',
      'Rapid heartbeat, swelling, or trouble breathing after a dose (allergic reaction).',
      'Weight dropping faster than ~1% of bodyweight per week — dose is too aggressive.',
    ],
    postCycleNotes: 'Cagrilintide is intended for continuous use, so there is no forced off-cycle. If you stop, appetite typically returns over 1–3 weeks as levels wash out (~1-week half-life), and some weight regain is normal without maintained habits. If you taper down rather than quit cold, drop one titration step at a time. Lock in the eating patterns you built during the cycle — they, not the peptide, are what hold the result.',
    evidenceLevel: 'mixed',
    evidenceNote: 'Cagrilintide has real Phase 2 trial data (as monotherapy and in the CagriSema program), but standalone research-grade/gray-market use sits outside approved indications and supply is unregulated.',
    dosing: {
      protocol: [
        'Once-weekly subcutaneous injection, same day each week, sites rotated.',
        'Titration: 0.6 mg (wk 1–2) → 1.2 mg (wk 3–4) → 2.4 mg (wk 5–6, standard) → optional 4.5 mg (wk 7+).',
        'Standard maintenance is 2.4 mg; only push to 4.5 mg if 2.4 mg plateaus and is well tolerated.',
        'Continuous protocol — no mandatory off-cycle. Reassess dose every 4–6 weeks.',
      ],
      reconstitution: [
        '10 mg vial + 3.0 mL bacteriostatic water = 3.33 mg/mL.',
        'Aim BAC water at the glass wall, not the powder; swirl gently, never shake; wait until clear.',
        'U-100 units = (dose mg ÷ 3.33) × 100. So 0.6 mg ≈ 18u, 1.2 mg ≈ 36u, 2.4 mg ≈ 72u, 4.5 mg ≈ 135u.',
        'Doses ≤72u fit a U-100 insulin syringe; 4.5 mg (~135u) needs two draws or a 3 mL syringe.',
        'Refrigerate at 2–8 °C after mixing, keep upright and out of light, use within ~30 days, never freeze.',
      ],
    },
    communityTips: [
      'Dose in the evening so the worst of any nausea passes while you sleep.',
      'Many users find 2.4 mg is the sweet spot and never bother with 4.5 mg.',
      'A "hold week" (repeat the current dose instead of escalating) is the standard fix for lingering nausea.',
    ],
    commonMistakes: [
      'Escalating on a calendar instead of on tolerance — the half-life means last week\'s dose has not fully expressed yet.',
      'Under-eating protein and losing muscle alongside fat.',
      'Chasing 4.5 mg for its own sake when 2.4 mg already controls appetite.',
      'Shaking the vial (denatures/foams the peptide) instead of swirling.',
    ],
    stacking: [
      'Commonly paired with a GLP-1 (semaglutide/tirzepatide) — amylin satiety plus incretin appetite control is complementary; CagriSema is that stack productized.',
      'Stacking compounds GI side effects; titrate one agent at a time, never both simultaneously.',
    ],
  },
  {
    peptideId: 'mazdutide',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 4, title: 'Onboarding — 2.5 mg', description: 'GLP-1/glucagon dual agonist. The GLP-1 arm suppresses appetite; the glucagon arm raises energy expenditure and mobilizes fat, which is what differentiates mazdutide from pure GLP-1 drugs. Start low: the dual mechanism means GI effects can hit harder than a GLP-1 alone.', tips: ['Fixed weekly day; inject subq into rotated abdominal/thigh/arm sites.', 'Expect appetite suppression within the first week or two; eat to a schedule so you do not undereat badly.', 'Glucagon activity can nudge heart rate and glucose — note how you feel, especially if you are diabetic.'] },
      { weekStart: 5, weekEnd: 8, title: 'Standard dose — 5 mg', description: 'The common maintenance dose. Appetite control is solid and the glucagon-driven metabolic bump is meaningful. Most users get the bulk of their result here without going higher.', tips: ['Hold at 5 mg for at least a few weeks before deciding whether you even need more.', 'Track resting heart rate; the glucagon component can raise it modestly.', 'Prioritize protein and resistance training to protect lean mass during the fat loss.'] },
      { weekStart: 9, weekEnd: 12, title: 'Escalation — 7.5 mg', description: 'Step up only if 5 mg has plateaued and side effects are quiet. The added glucagon signaling increases both fat mobilization and the demand on appetite/GI tolerance.', tips: ['Do not jump 5 → 9 mg; the 7.5 mg step exists to keep GI effects manageable.', 'Re-check GI tolerance for a full week before considering the top dose.', 'If nausea returns hard, drop back to 5 mg rather than pushing through.'] },
      { weekStart: 13, weekEnd: 20, title: 'Max dose — 9 mg', description: 'The ceiling of the common titration, for people who tolerate 7.5 mg and have plateaued. Diminishing returns are real — the jump from 7.5 to 9 mg buys less than earlier steps for more side-effect risk.', tips: ['Reassess every 4 weeks; if the scale and appetite are stable, hold instead of assuming you must be at max.', 'Mazdutide is weekly and continuous — no forced off-cycle, but planned dose holidays are reasonable.', 'Keep watching heart rate and hydration at the top dose.'] },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'monitor', likelihood: 'common', onset: 'First 24–72h post-dose, worst after each step up', duration: 'Days; eases at a stable dose over 1–2 weeks', notes: 'Dual GLP-1/glucagon action can make this stronger than a GLP-1 alone. Slow titration is the main control.' },
      { name: 'Diarrhea', severity: 'monitor', likelihood: 'common', onset: 'Early weeks', duration: 'Transient', notes: 'Reported frequently in mazdutide trials; usually settles as the dose stabilizes.' },
      { name: 'Decreased appetite', severity: 'normal', likelihood: 'common', onset: 'Within 1–2 weeks', duration: 'Throughout use (intended)', notes: 'Guard protein intake and total calories so loss is fat, not muscle.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'uncommon', onset: 'Post-dose, usually after escalation', duration: 'Hours', notes: 'Repeated vomiting means hold the dose; do not escalate on schedule.' },
      { name: 'Constipation', severity: 'monitor', likelihood: 'uncommon', onset: 'Variable', duration: 'Persistent if unmanaged', notes: 'GLP-1 slows gastric emptying; water, fiber, magnesium help.' },
      { name: 'Elevated resting heart rate', severity: 'monitor', likelihood: 'uncommon', onset: 'Within days at higher doses', duration: 'While dosing at that level', notes: 'The glucagon component can raise HR — a mazdutide-specific watch item vs pure GLP-1s.' },
      { name: 'Sulfur ("egg") burps', severity: 'normal', likelihood: 'uncommon', onset: 'Days after dose', duration: 'Transient', notes: 'Delayed gastric emptying; smaller low-fat meals reduce it.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'uncommon', onset: 'Early weeks / after escalation', duration: 'Transient', notes: 'Often driven by the sharp calorie drop rather than the peptide directly.' },
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'uncommon', onset: 'Minutes to hours', duration: '1–2 days', notes: 'Rotate sites; persistent lumps suggest too-shallow injection or site reuse.' },
      { name: 'Transient blood-glucose changes', severity: 'monitor', likelihood: 'rare', onset: 'Variable', duration: 'Transient', notes: 'Glucagon raises glucose while GLP-1 lowers it; diabetics should monitor closely and coordinate meds.' },
    ],
    redFlags: [
      'Severe persistent abdominal pain radiating to the back (possible pancreatitis) — stop and seek care.',
      'Sustained rapid or irregular heartbeat, chest tightness, or shortness of breath.',
      'Gallbladder signs: right upper-abdomen pain, fever, jaundice.',
      'Signs of severe dehydration from vomiting/diarrhea (dizziness, dark urine, no urination).',
      'Neck lump, hoarseness, or trouble swallowing (thyroid caution shared by the GLP-1 class).',
    ],
    postCycleNotes: 'Mazdutide is weekly and continuous with no mandatory off-cycle. If you stop, appetite and any glucagon-driven metabolic lift fade over 1–3 weeks and weight regain is common without maintained diet and training. Taper by stepping down one dose level rather than quitting from the top. Because the glucagon arm can affect heart rate and glucose, do not stack another cardiometabolic compound in the same window you are coming off.',
    evidenceLevel: 'mixed',
    evidenceNote: 'Mazdutide (IBI362) has Phase 2/3 trial data and is approved in China, but outside China it is unapproved and gray-market research-grade supply is unregulated and unverified for purity.',
    dosing: {
      protocol: [
        'Once-weekly subcutaneous injection, same day each week, sites rotated.',
        'Titration: 2.5 mg (wk 1–4) → 5 mg (wk 5–8, standard) → 7.5 mg (wk 9–12) → optional 9 mg (wk 13+).',
        'Standard maintenance is 5 mg; escalate only on a genuine plateau with quiet side effects.',
        'Continuous protocol — reassess every 4 weeks and hold rather than climb if stable.',
      ],
      reconstitution: [
        '10 mg vial + 1.0 mL bacteriostatic water = 10 mg/mL (keeps even high doses inside a U-100 syringe).',
        'Aim BAC water at the vial wall, swirl gently, never shake; wait until fully clear.',
        'U-100 units = (dose mg ÷ 10) × 100. So 2.5 mg = 25u, 5 mg = 50u, 7.5 mg = 75u, 9 mg = 90u.',
        'Prefer a higher-concentration fill here so the 9 mg dose stays under 100 units.',
        'Refrigerate at 2–8 °C, keep upright and out of light, use within ~30 days, never freeze.',
      ],
    },
    communityTips: [
      'Evening dosing lets the peak-nausea window pass during sleep.',
      'Watch resting heart rate as your escalation gate — if it climbs uncomfortably, hold the dose.',
      'Most users find 5 mg does most of the work; 7.5–9 mg is for stubborn plateaus only.',
    ],
    commonMistakes: [
      'Treating mazdutide like a pure GLP-1 and ignoring the glucagon-driven heart-rate/glucose effects.',
      'Jumping straight from 5 mg to 9 mg and getting hammered by GI side effects.',
      'Escalating on the calendar instead of on tolerance and plateau.',
      'Diluting with too much BAC water so a 9 mg dose overflows a U-100 syringe.',
    ],
    stacking: [
      'Redundant to stack with another GLP-1 (semaglutide/tirzepatide) — mazdutide already covers the incretin axis; doubling up multiplies GI risk.',
      'Cagrilintide (amylin) is a more complementary add-on than a second incretin, but titrate them separately.',
      'Avoid stacking stimulants or other heart-rate-raising compounds given the glucagon component.',
    ],
  },
  {
    peptideId: 'cagrilintide-semaglutide',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 4, title: 'Gentle start — 0.5 mg total', description: 'CagriSema is a fixed 1:1 blend — every dose delivers equal parts cagrilintide (amylin) and semaglutide (GLP-1). Two appetite pathways at once means the titration is deliberately slower than either component alone. At 0.5 mg total you are mostly building tolerance.', tips: ['Fixed weekly day; the blend is co-formulated so you cannot titrate the two halves independently.', 'Because two mechanisms stack, respect the slow ramp even if 0.5 mg feels like nothing.', 'Front-load the hydration and protein habits now — the appetite drop is coming.'] },
      { weekStart: 5, weekEnd: 8, title: 'Building — 1 mg then 2 mg total', description: 'Appetite suppression becomes clearly noticeable as both arms ramp. The amylin side slows gastric emptying while the GLP-1 side blunts hunger centrally — GI side effects, if any, usually surface in this window.', tips: ['Hold each step a full two weeks minimum; do not compress the schedule.', 'Constipation from the amylin arm plus nausea from the GLP-1 arm can overlap — manage both proactively.', 'Stop eating at "comfortable" — fullness now arrives late from delayed emptying.'] },
      { weekStart: 9, weekEnd: 12, title: 'Near-target — 3.4 mg total', description: 'The penultimate step. Appetite control is strong and steady. Many users find this dose sufficient and never reach the ceiling. This is the point to decide whether you actually need to go higher.', tips: ['If appetite and weight trend are good here, holding at 3.4 mg is a legitimate endpoint.', 'Reassess side-effect load before the final step; two mechanisms means less headroom.', 'Weigh weekly under identical conditions and read the trend, not the day.'] },
      { weekStart: 13, weekEnd: 20, title: 'Max — 4.8 mg total & continuous use', description: 'The top of the common titration (roughly 2.4 mg cagrilintide + 2.4 mg semaglutide). Reserve it for tolerant users who have plateaued. CagriSema is designed for ongoing weekly use with no forced washout.', tips: ['At 4.8 mg on a 5 mg/mL fill that is ~96 units — still inside a U-100 syringe but near the top.', 'Reassess monthly; diminishing returns are real at the ceiling.', 'No mandatory off-cycle, but a periodic dose hold confirms the dose is still earning its side effects.'] },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'monitor', likelihood: 'common', onset: 'First 24–72h post-dose, worst after each step up', duration: 'Days; eases at a stable dose', notes: 'Two appetite mechanisms mean nausea can be more persistent than either alone. Slow titration is essential.' },
      { name: 'Constipation', severity: 'monitor', likelihood: 'common', onset: 'Week 2 onward', duration: 'Persistent if unmanaged', notes: 'The amylin (cagrilintide) arm slows gut motility; water, fiber, magnesium, and movement address it.' },
      { name: 'Decreased appetite / early satiety', severity: 'normal', likelihood: 'common', onset: 'Within 1–2 weeks', duration: 'Throughout use (intended)', notes: 'Strong because both arms suppress appetite; guard protein and micronutrients to avoid muscle loss.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'uncommon', onset: 'Post-dose, usually after escalation', duration: 'Hours', notes: 'Hold the dose if it recurs; the blend cannot be split, so the whole dose comes down.' },
      { name: 'Diarrhea', severity: 'monitor', likelihood: 'uncommon', onset: 'Variable', duration: 'Transient', notes: 'Can alternate with constipation as gut motility recalibrates to the combined signal.' },
      { name: 'Sulfur ("egg") burps', severity: 'normal', likelihood: 'uncommon', onset: 'Days after dose', duration: 'Transient', notes: 'Delayed gastric emptying from both arms; smaller low-fat meals reduce it.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'uncommon', onset: 'Early weeks / after escalation', duration: 'Transient', notes: 'Usually driven by the pronounced calorie reduction rather than the peptides directly.' },
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'uncommon', onset: 'Minutes to hours', duration: '1–2 days', notes: 'Rotate sites; persistent lumps mean too-shallow injection or reused sites.' },
      { name: 'Dizziness / lightheadedness', severity: 'monitor', likelihood: 'rare', onset: 'Variable', duration: 'Transient', notes: 'Typically dehydration or under-eating from strong appetite suppression; hydrate and eat.' },
      { name: 'Gallbladder / biliary discomfort', severity: 'monitor', likelihood: 'rare', onset: 'Weeks into rapid loss', duration: 'Variable', notes: 'Fast weight loss raises gallstone risk; right-upper-abdomen pain warrants evaluation.' },
    ],
    redFlags: [
      'Severe persistent abdominal pain radiating to the back (possible pancreatitis) — stop and seek care.',
      'Gallbladder attack: severe right-upper-abdomen pain, fever, jaundice.',
      'Vomiting or diarrhea so severe you cannot stay hydrated.',
      'Rapid heartbeat, facial/throat swelling, or breathing difficulty after a dose (allergic reaction).',
      'Neck lump, hoarseness, or trouble swallowing (thyroid caution from the semaglutide arm).',
      'Weight loss faster than ~1% of bodyweight per week — the combined dose is too aggressive.',
    ],
    postCycleNotes: 'CagriSema is a continuous weekly therapy with no built-in off-cycle. Because it is a fixed blend you cannot wean one component before the other — tapering means stepping the whole dose down one titration level at a time. On stopping, appetite returns over 1–3 weeks (both peptides have ~week-scale half-lives) and regain is common without maintained habits. The eating and training patterns built during the cycle are what carry the result, not the injection.',
    evidenceLevel: 'mixed',
    evidenceNote: 'CagriSema has strong Phase 3 (REDEFINE) trial data, but it is not yet an approved product in most markets and gray-market blends are unregulated — actual cagrilintide:semaglutide ratio and purity are unverifiable.',
    dosing: {
      protocol: [
        'Once-weekly subcutaneous injection of the fixed 1:1 cagrilintide + semaglutide blend, same day weekly, sites rotated.',
        'Slow titration by TOTAL peptide: 0.5 mg → 1 mg → 2 mg → 3.4 mg → 4.8 mg (each step ~2–4 weeks).',
        'Components cannot be dosed independently — you escalate the whole blend together.',
        'Continuous protocol, no forced off-cycle; many users hold at 3.4 mg total rather than reaching 4.8 mg.',
      ],
      reconstitution: [
        '10 mg blend vial (5 mg cagrilintide + 5 mg semaglutide) + 2.0 mL bacteriostatic water = 5 mg/mL total.',
        'Aim BAC water at the glass wall, swirl gently, never shake; wait until clear.',
        'U-100 units = (total dose mg ÷ 5) × 100. So 0.5 mg = 10u, 1 mg = 20u, 2 mg = 40u, 3.4 mg = 68u, 4.8 mg = 96u.',
        'All titration steps fit inside a single U-100 syringe at this fill — no splitting needed.',
        'Refrigerate at 2–8 °C, keep upright and out of light, use within ~30 days, never freeze.',
      ],
    },
    communityTips: [
      'Dose in the evening so peak nausea passes overnight.',
      'Manage constipation (amylin arm) and nausea (GLP-1 arm) at the same time — do not wait for one to appear.',
      'A "hold week" at the current step is the standard fix when side effects stack up during titration.',
    ],
    commonMistakes: [
      'Rushing the titration because each individual component "felt fine" — the two mechanisms compound.',
      'Trying to dose the cagrilintide and semaglutide halves separately; the co-formulation does not allow it.',
      'Adding a separate GLP-1 or amylin on top of CagriSema, doubling an axis that is already covered.',
      'Under-eating protein during strong appetite suppression and losing muscle.',
    ],
    stacking: [
      'CagriSema is itself the amylin + GLP-1 stack productized — adding another GLP-1 or another amylin is redundant and multiplies GI risk.',
      'Any additional metabolic compound should be introduced separately and only after CagriSema is at a stable, tolerated dose.',
    ],
  },
  {
    peptideId: 'mots-c',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 2, title: 'Priming — 200 mcg daily', description: 'MOTS-c is a mitochondrial-derived peptide theorized to act as an exercise mimetic via AMPK activation. Unlike the weekly GLP-1/amylin agents, this is a DAILY subcutaneous injection. Start low — human tolerability is genuinely unknown, so this phase is about confirming you react to it at all before climbing.', tips: ['Inject at a consistent time daily; many pair it with pre-workout on training days.', 'Because there is no human dosing standard, keep a simple log of energy, sleep, and any sensations.', 'Rotate injection sites daily — daily dosing makes site rotation more important than with weekly peptides.'] },
      { weekStart: 3, weekEnd: 6, title: 'Ramp — 400 to 600 mcg daily', description: 'Titrating upward through the mid-range. Reported (anecdotal) effects cluster around perceived endurance, recovery, and metabolic "cleanness" — none of this is established in humans. Treat any benefit as a hypothesis, not a known effect.', tips: ['Step up only if the previous dose was uneventful; there is no benefit to rushing an unproven compound.', 'Its exercise-mimetic theory suggests it works best alongside actual training, not as a replacement.', 'Note anything unusual and be willing to stop — you are ahead of the clinical evidence here.'] },
      { weekStart: 7, weekEnd: 8, title: 'Approaching target — 800 mcg daily', description: 'The upper-mid dose. This is where most anecdotal protocols say effects are most apparent, if present. Still no human safety data at any dose — the absence of reported problems is not the same as proven safety.', tips: ['Hold here a full two weeks and assess before reaching for the top dose.', 'Keep hydration and training consistent so you can actually attribute any change.', 'If nothing is happening by now, more dose is not guaranteed to change that.'] },
      { weekStart: 9, weekEnd: 10, title: 'Target — 1000 mcg daily, then cycle off', description: 'The standard maintenance ceiling. MOTS-c is run as a 10-week cycle followed by ~4 weeks off — this off-period is built into the protocol, unlike the continuous metabolic peptides. The washout is precautionary given how little is known.', tips: ['Complete the ~10-week cycle then take the ~4-week break before any repeat.', 'Use the off-weeks to see whether any perceived benefit persists or fades.', 'Do not extend indefinitely to chase effects; the cycle structure is the whole harm-reduction strategy here.'] },
    ],
    sideEffects: [
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: '1–2 days', notes: 'The most consistently reported effect, driven by DAILY injections. Rotate sites diligently.' },
      { name: 'Fatigue or lethargy', severity: 'normal', likelihood: 'uncommon', onset: 'Variable', duration: 'Transient', notes: 'Anecdotal and paradoxical for an "energy" peptide; no mechanism established in humans.' },
      { name: 'Flushing / warmth after injection', severity: 'normal', likelihood: 'uncommon', onset: 'Minutes', duration: 'Short-lived', notes: 'Reported anecdotally; not characterized in any controlled human study.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Variable', duration: 'Transient', notes: 'Commonly attributed but unverified; rule out dehydration and training load first.' },
      { name: 'Lightheadedness', severity: 'monitor', likelihood: 'rare', onset: 'Post-injection', duration: 'Transient', notes: 'Anecdotal; sit down and hydrate. No dose-response data exists.' },
      { name: 'Nausea', severity: 'normal', likelihood: 'rare', onset: 'Variable', duration: 'Transient', notes: 'Occasionally reported; not a characteristic MOTS-c effect the way it is for GLP-1s.' },
      { name: 'Changes in blood glucose', severity: 'monitor', likelihood: 'rare', onset: 'Unknown', duration: 'Unknown', notes: 'Its AMPK/metabolic mechanism could plausibly affect glucose; diabetics should monitor. Purely theoretical in humans.' },
      { name: 'Unknown / uncharacterized effects', severity: 'monitor', likelihood: 'uncommon', onset: 'Unknown', duration: 'Unknown', notes: 'The honest entry: with no completed human trials, the real side-effect profile is simply not established.' },
    ],
    redFlags: [
      'Any allergic-type reaction — rash, swelling, difficulty breathing after injection — stop immediately and seek care.',
      'Spreading redness, warmth, pus, or fever at an injection site (infection from daily injections).',
      'Unexplained persistent symptoms of any kind — with no human safety data, treat the unexpected as a reason to stop, not push through.',
      'Symptomatic blood-sugar swings if you are diabetic or on glucose-lowering medication.',
    ],
    postCycleNotes: 'MOTS-c is run in cycles — roughly 10 weeks on, ~4 weeks off — and that off-period is the core harm-reduction step, not optional. Because it is daily and preclinical, the break lets you assess whether any perceived benefit was real and persists, and limits open-ended exposure to a compound with no human safety data. There is no rebound mechanism to taper; you simply stop at cycle end. Do not run back-to-back cycles without the washout.',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'MOTS-c has NO completed human trials — all benefit claims come from mouse and cell studies. Human dosing, safety, and efficacy are unestablished; a modified analog (CB4211) reached early human testing but MOTS-c itself has not. Everything here is anecdotal, not clinical.',
    dosing: {
      protocol: [
        'Daily subcutaneous injection (not weekly), site rotated each day.',
        'Titration: 200 mcg (wk 1–2) → 400 mcg (wk 3–4) → 600 mcg (wk 5–6) → 800 mcg (wk 7–8) → 1000 mcg (wk 9–10).',
        'Standard target is ~700–1000 mcg; run a ~10-week cycle then take ~4 weeks off.',
        'No human dosing standard exists — these numbers are community protocol, not clinical guidance.',
      ],
      reconstitution: [
        '10 mg vial + 3.0 mL bacteriostatic water = 3.33 mg/mL (≈ 33.3 mcg per U-100 unit).',
        'Aim BAC water at the vial wall, swirl gently, never shake; wait until fully clear.',
        'U-100 units = (dose mcg ÷ 33.3). So 200 mcg = 6u, 400 mcg = 12u, 600 mcg = 18u, 800 mcg = 24u, 1000 mcg = 30u.',
        'Small doses in units — draw at eye level, reading the top edge of the plunger stopper.',
        'Refrigerate at 2–8 °C, keep upright and out of light, use within ~30 days, never freeze.',
      ],
    },
    communityTips: [
      'Most protocols time the daily dose around training since the theorized action is exercise-mimetic.',
      'Keep a log — with no clinical baseline, your own before/after is the only signal you have.',
      'Treat it as experimental: modest expectations, willingness to stop, strict site rotation for daily jabs.',
    ],
    commonMistakes: [
      'Expecting a GLP-1-style dramatic effect — MOTS-c is metabolic/exercise-adjacent, not an appetite drug.',
      'Running continuous back-to-back cycles instead of honoring the ~4-week off period.',
      'Using it as a substitute for training rather than an adjunct to it.',
      'Assuming "no reported side effects in animals" means proven safe in humans — it does not.',
    ],
    stacking: [
      'Anecdotally stacked with fat-loss or fitness protocols (GLP-1s, BPC-157, etc.), but no interaction data exists in humans.',
      'Because safety is unestablished, introduce MOTS-c alone first so any effect (good or bad) is attributable before adding anything else.',
    ],
  },
  {
    peptideId: 'klow',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 1, title: 'Tolerance & Baseline', description: 'First week is about confirming you tolerate a four-way blend, not chasing results. GHK-Cu can sting slightly and the solution carries a faint blue-green copper tint that is normal. Start at the low 2mg draw even if you plan to titrate up.', tips: ['Photograph the injury/target area and note baseline pain on a 0-10 scale so week-by-week change is measurable.', 'Rotate sites (lower abdomen, love handles, thigh) and stay near the target area when practical.', 'Expect the copper tint; discoloration is the GHK-Cu, not spoilage. Cloudy, cotton-like particulate is not — discard if you see it.'] },
      { weekStart: 2, weekEnd: 4, title: 'Titration & Early Signal', description: 'Move toward the 4mg draw if week 1 was uneventful. This is where connective-tissue and gut/skin users tend to report the first changes: reduced flare-ups, calmer digestion, faster-settling minor irritations. GHK-Cu tends to show on skin quality early.', tips: ['Only raise one variable at a time — increase dose OR add a new site, never both in the same week.', 'A brief warm flush or light-headedness shortly after injecting is usually the BPC-157 fraction; sit for a minute before standing.', 'Keep the vial cold and out of light; potency of the peptide fractions drops with heat and UV exposure.'] },
      { weekStart: 5, weekEnd: 8, title: 'Peak & Consolidation', description: 'The back half of the cycle is the consolidation window where soft-tissue and skin remodeling reported by users tends to be most noticeable. Hold whichever draw (2/4/6mg) gave a clean response — bigger is not automatically better with a copper-containing blend.', tips: ['If you reached the 6mg draw, watch for cumulative lethargy (the TB-500 fraction) and dial back rather than push through it.', 'Do not extend past 8 weeks — GHK-Cu carries a copper load and the blend is built around an 8-on/4-off rhythm for a reason.', 'Log which specific complaint improved; it tells you which of the four components you actually needed for the next cycle.'] },
      { weekStart: 9, weekEnd: 12, title: 'Washout (4 Weeks Off)', description: 'Four weeks fully off. This clears accumulated copper, lets you judge whether gains hold without support, and re-sensitizes you for the next block. Most users find results largely persist through the break if the underlying tissue actually healed.', tips: ['Track the target area unmedicated — anything that fully regresses within days was symptom masking, not repair.', 'Use the break to address the mechanical cause (load, form, ergonomics); peptides do not fix a re-injuring habit.', 'If you felt run-down late in the cycle, consider a lower peak draw next block rather than a longer one.'] },
    ],
    sideEffects: [
      { name: 'Injection-site redness / itch / lump', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: 'Hours to ~2 days', notes: 'GHK-Cu is the usual culprit and can sting more than single peptides. Rotate sites and inject slowly. Warm compress helps a lingering lump.' },
      { name: 'Head-rush / warm flush after injecting', severity: 'normal', likelihood: 'common', onset: 'Within minutes', duration: '1-5 minutes', notes: 'Attributed to the BPC-157 fraction (vasoactive). Sit down for the injection; passes quickly. Recurrent strong dizziness warrants a dose cut.' },
      { name: 'Lethargy / drowsiness', severity: 'monitor', likelihood: 'common', onset: 'Days into use, dose-dependent', duration: 'Resolves over days off or at lower dose', notes: 'Commonly pinned on the TB-500 fraction, more likely at the 6mg draw. If it interferes with daily function, reduce the draw.' },
      { name: 'Metallic taste / transient nausea', severity: 'normal', likelihood: 'uncommon', onset: 'Shortly after dosing', duration: 'Minutes to an hour', notes: 'Associated with the copper in GHK-Cu. Usually mild; persistent nausea suggests the total copper load is too high for you.' },
      { name: 'Skin dryness / peeling over the cycle', severity: 'normal', likelihood: 'uncommon', onset: 'Weeks 2-6', duration: 'Cycle-length; reverses off-cycle', notes: 'GHK-Cu drives skin turnover; some users notice flaking or increased sensitivity. Moisturize; not harmful.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Hours after dosing', duration: 'Hours', notes: 'Often hydration/vasodilation related. Water and a lower draw usually resolve it.' },
      { name: 'Fatigue from copper accumulation', severity: 'monitor', likelihood: 'uncommon', onset: 'Later weeks of an 8-week block', duration: 'Clears during the 4-week washout', notes: 'Chronic high GHK-Cu can burden copper handling. The mandatory 4-week off period exists to clear this — do not skip it.' },
      { name: 'Sterile abscess / infection at site', severity: 'stop', likelihood: 'rare', onset: '1-4 days post-injection', duration: 'Until treated', notes: 'Spreading redness, heat, throbbing pain, pus or fever is not a normal reaction. Stop and seek medical care.' },
      { name: 'Allergic / hypersensitivity reaction', severity: 'stop', likelihood: 'rare', onset: 'Minutes to hours', duration: 'Until treated', notes: 'Hives, facial/throat swelling, wheezing or widespread rash — a four-peptide blend is four chances to react. Stop immediately.' },
    ],
    redFlags: [
      'Spreading redness, warmth, pus, or fever at an injection site (infection/abscess).',
      'Hives, swelling of face/lips/throat, or difficulty breathing (anaphylaxis) — call emergency services.',
      'Persistent metallic taste, nausea, and deep fatigue together — possible copper overload; stop and reassess.',
      'Fainting or severe dizziness after dosing rather than a brief head-rush.',
      'Any target-area pain that sharply worsens rather than improves — do not mask a real injury.',
    ],
    postCycleNotes: 'Run 8 weeks on, then a full 4 weeks off — the washout clears accumulated copper from the GHK-Cu fraction and lets you judge whether repair actually held. Genuine tissue/skin/gut improvements tend to persist through the break; anything that regresses within days was symptom relief, not healing. Use the time off to fix the mechanical cause of the original problem. Re-baseline (photos, pain score) before starting the next block, and consider a lower peak draw if you felt run-down late in the cycle.',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'A community "kitchen-sink" healing blend. Individual components have preclinical/animal data (GHK-Cu skin work is the strongest); controlled human trials of the combination do not exist. Reports are experiential. Not medical advice — none of these peptides is an approved drug for these uses.',
    dosing: {
      protocol: [
        '80mg four-way blend: GHK-Cu 50 / TB-500 10 / BPC-157 10 / KPV 10 (mg per vial).',
        'Daily subcutaneous injection; standard cadence is 8 weeks on, 4 weeks off.',
        'Total draw options: 2mg (starter), 4mg (standard), or 6mg (high) — start low and titrate.',
        'The drawn dose splits proportionally across all four peptides (the 50/10/10/10 ratio).',
        'Rotate injection sites; many users inject subq near the target tissue when practical.',
      ],
      reconstitution: [
        'Reconstitute the 80mg vial with 4mL bacteriostatic water → 20mg/mL. Aim the water at the glass wall, not the powder.',
        'Swirl gently (roll the vial between your fingers) until clear — never shake; shaking foams and degrades peptide.',
        'A faint blue-green copper tint is normal and expected from the GHK-Cu; cloudiness or particulate is not.',
        'U-100 math: units = (dose mg ÷ mg-per-mL) × 100. At 20mg/mL → 2mg = 10 units, 4mg = 20 units, 6mg = 30 units.',
        'Refrigerate at 2-8°C, keep upright and out of light, discard after ~30 days. Never freeze.',
      ],
    },
    communityTips: [
      'The copper tint throws people off on first mix — it is the GHK-Cu, not contamination.',
      'Injecting subq near the target area is a common preference, though systemic distribution means it is not strictly required.',
      'Most users say the 4mg draw is the sweet spot; 6mg mainly adds TB-500 lethargy without proportional benefit.',
    ],
    commonMistakes: [
      'Shaking the vial — foams the solution and can degrade the peptide fractions. Swirl only.',
      'Skipping the 4-week washout because things feel good; the break exists to clear the copper load.',
      'Jumping straight to 6mg — you cannot tell which component you needed and you invite lethargy.',
      'Treating it as a fix for a re-injuring habit instead of correcting load/form.',
    ],
    stacking: [
      'Already a stack in one vial (GHK-Cu + TB-500 + BPC-157 + KPV) — adding more healing peptides is redundant and muddies attribution.',
      'Commonly paired with sensible rehab (progressive loading, sleep, protein) rather than other peptides.',
      'Avoid running alongside a second copper-containing product to limit cumulative copper.',
    ],
  },
  {
    peptideId: 'bpc-157-tb-500',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 2, title: 'Loading & Tolerance', description: 'The "Wolverine stack" pairs BPC-157 (localized soft-tissue and gut) with TB-500 (systemic migration/recovery). The opening two weeks establish tolerance and load TB-500, which acts slowly and cumulatively. Start near the 0.6mg total draw.', tips: ['Baseline the injury: photo, range-of-motion, and a 0-10 pain score so you can judge progress objectively.', 'BPC users often inject subq near the affected tendon/ligament; TB-500 works systemically so its site matters less.', 'A brief warm head-rush after injecting is a known BPC-157 effect — sit down to dose.'] },
      { weekStart: 3, weekEnd: 5, title: 'Early Response', description: 'TB-500 has loaded and BPC-157 is doing daily local work. This is where users most often report reduced tendon/ligament pain, calmer gut, and better tolerance of rehab loading. Titrate toward the 1.0mg draw only if 0.6mg was well tolerated.', tips: ['Add rehab load progressively — the peptides are reported to help tissue tolerate work, not replace the work.', 'Watch for mild lethargy creeping in; it is usually the TB-500 fraction and eases at a slightly lower draw.', 'Keep the vial cold and dark between doses to preserve potency.'] },
      { weekStart: 6, weekEnd: 8, title: 'Consolidation', description: 'Final stretch of the 8-week block. TB-500 tissue effects and BPC-157 local repair reported by users tend to peak here. Hold a steady draw rather than pushing higher into the taper toward the break.', tips: ['Do not extend past 8 weeks reflexively — the 4-week break lets you test whether gains hold.', 'If lethargy is significant, drop back to the 0.6mg draw for the final weeks.', 'Note which complaint actually resolved — it tells you whether you needed the stack or just BPC alone next time.'] },
      { weekStart: 9, weekEnd: 12, title: 'Washout (4 Weeks Off)', description: 'Four weeks off. TB-500 has a long tail, so recovery benefits often linger into the break — a good sign the tissue actually adapted. Use the window to confirm the fix held and to address the mechanical cause.', tips: ['Anything that fully regresses within days was symptom masking, not repair.', 'Fix load, form, and volume progression so you are not re-injuring on the next block.', 'Re-baseline before restarting; consider BPC-157 alone if the gut/local benefit was what mattered.'] },
    ],
    sideEffects: [
      { name: 'Head-rush / warm flush after injecting', severity: 'normal', likelihood: 'common', onset: 'Within minutes', duration: '1-5 minutes', notes: 'Classic BPC-157 vasoactive effect. Sit to inject; passes fast. Strong recurrent dizziness means cut the dose.' },
      { name: 'Injection-site redness / itch / small lump', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: 'Hours to ~2 days', notes: 'Rotate sites, inject slowly, warm compress for a lingering lump. Usually trivial.' },
      { name: 'Lethargy / drowsiness', severity: 'monitor', likelihood: 'common', onset: 'Days into use, dose-dependent', duration: 'Eases at lower dose or off-cycle', notes: 'Widely attributed to TB-500. If it interferes with daily function, drop toward the 0.6mg draw.' },
      { name: 'Mild nausea / stomach upset', severity: 'normal', likelihood: 'uncommon', onset: 'After dosing', duration: 'Minutes to an hour', notes: 'Some users note transient GI upset early. Usually settles as the body adjusts.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Hours after dosing', duration: 'Hours', notes: 'Often vasodilation/hydration related (BPC). Water and a lower draw help.' },
      { name: 'Transient blood-pressure / heart-rate change', severity: 'monitor', likelihood: 'uncommon', onset: 'Shortly after injecting', duration: 'Minutes', notes: 'BPC-157 is vasoactive; some report brief flushing with a racing feeling. Persistent palpitations warrant stopping.' },
      { name: 'Fatigue / heaviness at higher draws', severity: 'monitor', likelihood: 'uncommon', onset: 'When titrating to 1.0mg', duration: 'Resolves on dose reduction', notes: 'The TB-500 fraction scales lethargy with dose. Bigger is not better here.' },
      { name: 'Sterile abscess / infection at site', severity: 'stop', likelihood: 'rare', onset: '1-4 days post-injection', duration: 'Until treated', notes: 'Spreading redness, heat, pus, or fever needs medical care — not a normal reaction.' },
      { name: 'Allergic / hypersensitivity reaction', severity: 'stop', likelihood: 'rare', onset: 'Minutes to hours', duration: 'Until treated', notes: 'Hives, facial/throat swelling, or wheezing — stop immediately and seek care.' },
    ],
    redFlags: [
      'Spreading redness, warmth, pus, or fever at an injection site (infection/abscess).',
      'Hives, swelling of face/lips/throat, or trouble breathing — call emergency services.',
      'Persistent palpitations, chest tightness, or fainting after dosing rather than a brief flush.',
      'Target-area pain that sharply worsens instead of improving — stop masking a possible tear.',
      'New unexplained lumps or growths — TB-500 promotes cell migration/angiogenesis; get anything suspicious checked.',
    ],
    postCycleNotes: 'Standard block is 8 weeks on, 4 weeks off. TB-500 has a long half-life, so recovery benefits often persist into the washout — a sign the tissue genuinely adapted rather than being masked. Confirm gains hold unmedicated, and use the break to correct the load/form problem that caused the injury. Re-baseline (photo, ROM, pain score) before the next block. If the benefit you cared about was gut/local, consider running BPC-157 alone next time; if it was systemic recovery, TB-500 was the driver.',
    evidenceLevel: 'mixed',
    evidenceNote: 'BPC-157 and TB-500 both have encouraging animal/preclinical tendon, ligament, and gut data, but robust controlled human trials are thin to absent and neither is an approved drug in most countries. Rank this as anecdotal-leaning-mixed for humans. Not medical advice.',
    dosing: {
      protocol: [
        '10mg blend, split 5mg BPC-157 + 5mg TB-500 per vial.',
        'Daily subcutaneous injection; standard 8 weeks on, 4 weeks off.',
        'Total draw 0.6-1.0mg; start at 0.6mg and titrate only if well tolerated.',
        'A 50/50 blend means the draw splits evenly: a 0.6mg draw delivers ~0.3mg of each; a 1.0mg draw ~0.5mg of each.',
        'BPC-157 is often injected subq near the target tissue; TB-500 acts systemically so its site is less important.',
      ],
      reconstitution: [
        'Reconstitute the 10mg vial with 2mL bacteriostatic water → 5mg/mL. Trickle the water down the glass wall.',
        'Swirl gently until clear — never shake.',
        'U-100 math: units = (dose mg ÷ mg-per-mL) × 100. At 5mg/mL → 0.6mg = 12 units, 0.8mg = 16 units, 1.0mg = 20 units.',
        'Refrigerate at 2-8°C, upright, out of light; discard after ~30 days. Never freeze.',
      ],
    },
    communityTips: [
      'Nicknamed the "Wolverine stack" for tendon, ligament, and gut recovery.',
      'TB-500 loads slowly — do not judge the stack in the first week; give it into weeks 3-5.',
      'Many users inject BPC-157 close to the injury and put TB-500 anywhere convenient.',
    ],
    commonMistakes: [
      'Chasing higher draws for faster results — TB-500 mostly adds lethargy past the standard range.',
      'Shaking the vial instead of swirling.',
      'Quitting at 10 days because "nothing happened" before TB-500 has loaded.',
      'Using it to train through a real tear instead of confirming a diagnosis.',
    ],
    stacking: [
      'Self-contained BPC-157 + TB-500 stack; adding KLOW or standalone BPC is redundant.',
      'Pairs sensibly with structured rehab, sleep, and adequate protein rather than more peptides.',
      'If gut is the main target, BPC-157 alone is a leaner option than the full blend.',
    ],
  },
  {
    peptideId: 'melanotan-2',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 1, title: 'Loading & First-Dose Caution', description: 'Melanotan-2 is a melanocortin agonist that darkens skin by stimulating melanin. Nausea and facial flushing are most intense on the first few doses, so the loading phase deliberately starts tiny (250mcg) and ramps. This is also when you must inventory your moles before any darkening begins.', tips: ['Photograph and map every mole/freckle now — you need a pre-tan baseline to spot changes later.', 'Dose in the evening; first-dose nausea and flushing are easier to sleep through.', 'Do NOT sunbathe hard early — MT-2 makes you tan faster and burn risk is still real; brief, sensible UV only.'] },
      { weekStart: 2, weekEnd: 3, title: 'Ramp to Response', description: 'Work up toward 1000mcg daily as tolerance to nausea builds. Pigmentation starts to show — freckles darken and deepen first, existing moles get darker. Facial flush and, in men, spontaneous erections are common in this window.', tips: ['Increase in ~250mcg steps only after the prior dose was tolerated; nausea tracks the jumps.', 'Track your tan against sun exposure — MT-2 amplifies UV response, so less sun gets you the same color.', 'Note new spots vs. merely darker existing spots; the distinction matters for the red-flag list.'] },
      { weekStart: 4, weekEnd: 6, title: 'Maintenance', description: 'Once you reach your target shade, drop to 1-2 injections per week to hold it. Full daily dosing past this point mostly adds side effects and pigment you did not ask for. Continue mole surveillance — this is the core safety task of the whole cycle.', tips: ['Switch to maintenance as soon as color is where you want it; more is not better.', 'Compare skin to your week-1 mole map monthly, not just by feel.', 'Persistent deep tan on palms, face, and old scars is expected MT-2 behavior — new or changing moles are not.'] },
      { weekStart: 7, weekEnd: 8, title: 'Taper & Stop', description: 'Wind down at the end of the ~8-week cycle. Tan fades gradually over subsequent weeks as skin cells turn over. Do the most important thing here: a careful post-cycle mole comparison against your baseline photos.', tips: ['Stop dosing; let pigmentation fade naturally rather than pushing another block back-to-back.', 'Do a full mole re-check against baseline; anything new, asymmetric, or changed goes to a dermatologist.', 'A dermatologist skin check is genuinely worth booking for anyone using melanocortin agonists.'] },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: '15-60 min post-injection', duration: '30 min to a few hours; fades over cycle', notes: 'Most intense on the first several doses and after dose increases. Evening dosing and slow titration help; usually tolerance builds.' },
      { name: 'Facial flushing / warmth', severity: 'normal', likelihood: 'common', onset: 'Within ~30 min', duration: 'Up to a few hours', notes: 'Melanocortin vasodilation. Harmless but can be intense early; eases with titration.' },
      { name: 'Spontaneous / prolonged erections (men)', severity: 'monitor', likelihood: 'common', onset: '30 min to hours post-dose', duration: 'Minutes to a couple of hours', notes: 'MT-2 is a known erectogenic agent. Usually a benign nuisance — but an erection lasting >4 hours (priapism) is a medical emergency.' },
      { name: 'Darkening of existing moles / freckles', severity: 'monitor', likelihood: 'common', onset: 'Weeks 2 onward', duration: 'Persists through cycle, fades slowly after', notes: 'Expected pigmentary effect, but it also masks and mimics early melanoma changes. Baseline-map moles and watch for shape/border/size change, not just color.' },
      { name: 'New moles / nevi appearing', severity: 'monitor', likelihood: 'uncommon', onset: 'During/after cycle', duration: 'Persistent', notes: 'MT-2 use is associated with new pigmented lesions. Any new mole should be assessed by a dermatologist; do not assume it is benign.' },
      { name: 'Appetite suppression', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: 'Variable', notes: 'Melanocortin pathway reduces appetite. Usually mild; stay hydrated and eat regularly.' },
      { name: 'Darkening of face/lips, scars, and skin folds', severity: 'normal', likelihood: 'common', onset: 'Weeks 2 onward', duration: 'Fades post-cycle', notes: 'Uneven hyperpigmentation is characteristic. Cosmetic, not dangerous in itself.' },
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: 'Hours to ~2 days', notes: 'Redness/itch/small lump. Rotate sites.' },
      { name: 'Dizziness / lethargy / yawning', severity: 'normal', likelihood: 'uncommon', onset: 'Shortly after dosing', duration: 'Under an hour', notes: 'Often bundled with the early nausea/flush response. Sit down; passes.' },
      { name: 'Blood-pressure changes', severity: 'monitor', likelihood: 'rare', onset: 'After dosing', duration: 'Transient', notes: 'Melanocortin agonists can shift cardiovascular tone. Anyone with cardiac or BP conditions should not use this without medical oversight.' },
      { name: 'Priapism (erection >4 hours)', severity: 'stop', likelihood: 'rare', onset: 'Hours post-dose', duration: 'Emergency — until treated', notes: 'A painful erection lasting over 4 hours is a urological emergency that can cause permanent damage. Seek immediate care.' },
      { name: 'Changing mole (asymmetry/border/color/diameter/evolving)', severity: 'stop', likelihood: 'rare', onset: 'Any time', duration: 'Until evaluated', notes: 'The serious risk. MT-2 both darkens moles and is linked to melanoma-relevant changes. Any ABCDE change → stop and see a dermatologist urgently.' },
    ],
    redFlags: [
      'Any mole that changes shape, border, color, or size, or a new pigmented lesion — stop and see a dermatologist urgently (melanoma risk).',
      'Erection lasting more than 4 hours (priapism) — go to the emergency room.',
      'Severe or unrelenting nausea/vomiting that prevents eating or hydrating.',
      'Chest pain, fainting, or a marked change in blood pressure/heart rate after dosing.',
      'Rapidly spreading rash, hives, facial/throat swelling, or trouble breathing (allergic reaction).',
    ],
    postCycleNotes: 'Stop at the end of the ~8-week cycle and let the tan fade naturally over the following weeks as skin turns over; there is no back-to-back running that makes this safer. The single most important post-cycle action is a careful mole re-check against your baseline photos — MT-2 darkens existing moles and is associated with new nevi, which can hide or mimic early melanoma. Book a dermatologist skin check. This is an unapproved compound with genuine safety concerns; the pigmentary/melanoma monitoring is not optional. Not medical advice.',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'Melanotan-2 is not an approved drug and is illegal to sell for human use in many countries. Human evidence is limited and safety concerns (melanoma-relevant mole changes, cardiovascular effects, priapism) are documented in case reports. Treat all guidance as experiential/harm-reduction, not endorsement, and not medical advice.',
    dosing: {
      protocol: [
        'Melanocortin agonist for tanning. Daily subcutaneous loading, ramping from 250mcg toward 1000mcg as nausea tolerance builds.',
        'Once target color is reached, drop to maintenance: 1-2 injections per week.',
        'Typical cycle ~8 weeks, then stop and let pigmentation fade.',
        'Titrate in ~250mcg steps and only after the previous dose was tolerated — nausea and flushing track dose increases.',
        'UV exposure amplifies the effect; use minimal, sensible sun and never chase a burn.',
      ],
      reconstitution: [
        'Reconstitute a 10mg vial with 2mL bacteriostatic water → 5mg/mL (5000mcg/mL). Aim water at the glass wall.',
        'Swirl gently until clear — never shake.',
        'U-100 math: units = (dose mg ÷ mg-per-mL) × 100. At 5mg/mL → 250mcg = 5 units, 500mcg = 10 units, 1000mcg = 20 units.',
        'Watch mcg vs mg carefully here — a 1000-fold error is possible and this compound is dosed in micrograms.',
        'Refrigerate at 2-8°C, upright, out of light; discard after ~30 days. Never freeze.',
      ],
    },
    communityTips: [
      'Dose at night to sleep through first-dose nausea and flushing.',
      'Map your moles with photos before you start — you cannot reconstruct a baseline after the tan sets in.',
      'Less sun goes further on MT-2; people routinely over-expose and burn chasing color they would have gotten anyway.',
    ],
    commonMistakes: [
      'Skipping the mole baseline — the whole safety model depends on before/after comparison.',
      'Confusing mcg and mg during reconstitution — dose in micrograms, not milligrams.',
      'Loading at full dose from day one and getting hammered by nausea and flushing.',
      'Aggressive sunbathing on top of MT-2 and burning.',
      'Running cycles back-to-back and ignoring dermatologist follow-up.',
    ],
    stacking: [
      'Not a "stack" compound — combining with other injectables adds side effects without benefit.',
      'Never combine with unmonitored cardiovascular stimulants given the BP/heart-rate effects.',
      'The only thing worth pairing it with is disciplined mole surveillance and a dermatologist.',
    ],
  },
  {
    peptideId: 'thymosin-alpha-1',
    weeklyGuide: [
      { weekStart: 1, weekEnd: 2, title: 'Onboarding', description: 'Thymosin alpha-1 (marketed abroad as Zadaxin) is an immune modulator used clinically for immune support and as a vaccine/antiviral adjunct in some countries. It is generally well tolerated, so the first fortnight is straightforward: establish the daily ~500mcg routine and confirm you tolerate injections.', tips: ['Note a baseline for whatever you are tracking (frequency of infections, energy, recovery) so change is measurable.', 'Pick a consistent daily injection time; steady dosing suits an immune-modulating peptide.', 'Rotate subcutaneous sites (abdomen, thigh) to keep tissue happy.'] },
      { weekStart: 3, weekEnd: 6, title: 'Immune Modulation', description: 'This is the working window. Ta-1 acts on T-cell and innate immune signaling, so effects are quiet and cumulative rather than dramatic. Users typically report this as the phase where resilience, recovery, or fewer minor infections start to show.', tips: ['Do not expect a "feel it" moment — immune modulation is subtle by design.', 'Keep the rest of your recovery stack (sleep, nutrition) consistent so you can attribute changes.', 'Mild fatigue occasionally reported early usually settles; note it but it rarely requires stopping.'] },
      { weekStart: 7, weekEnd: 10, title: 'Consolidation', description: 'Continue the daily protocol through the middle of an 8-12 week course. Benefits, where present, tend to hold steady here. There is no need to escalate dose — Ta-1 is used at consistent modest doses clinically.', tips: ['Hold the dose steady; more is not the lever with an immune modulator.', 'Reassess your baseline metric — is infection frequency or recovery actually different?', 'If you are using it around a specific challenge (illness season, recovery), keep the course continuous.'] },
      { weekStart: 11, weekEnd: 16, title: 'Course End & Break', description: 'Finish the 8-12 week course and take roughly 4 weeks off. Ta-1 is often run in courses rather than indefinitely. The break lets you judge whether benefits persist and avoids open-ended immune modulation without a goal.', tips: ['Stop at the end of the course rather than drifting into indefinite use.', 'Judge results over the break — did the resilience/recovery gain hold?', 'Anyone with an autoimmune condition or on immunosuppressants should not run repeat courses without medical guidance.'] },
    ],
    sideEffects: [
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: 'Hours to ~2 days', notes: 'Redness, mild swelling, or discomfort at the site is the most frequently reported effect. Rotate sites; usually trivial.' },
      { name: 'Fatigue / tiredness', severity: 'normal', likelihood: 'uncommon', onset: 'Days into use', duration: 'Usually transient', notes: 'Occasionally reported early and typically settles. Rarely a reason to stop.' },
      { name: 'Mild flu-like feeling / malaise', severity: 'normal', likelihood: 'uncommon', onset: 'Early in the course', duration: 'Short-lived', notes: 'Consistent with an immune-modulating agent nudging immune activity. Usually mild and self-limiting.' },
      { name: 'Low-grade joint or muscle aches', severity: 'normal', likelihood: 'rare', onset: 'Early course', duration: 'Transient', notes: 'Occasionally reported alongside the mild flu-like feeling. Monitor; typically resolves.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Hours after dosing', duration: 'Hours', notes: 'Nonspecific and usually mild. Hydration helps.' },
      { name: 'Transient dizziness', severity: 'normal', likelihood: 'rare', onset: 'Shortly after dosing', duration: 'Under an hour', notes: 'Uncommon; sit down until it passes.' },
      { name: 'Nausea', severity: 'normal', likelihood: 'rare', onset: 'After dosing', duration: 'Short-lived', notes: 'Infrequently reported and mild.' },
      { name: 'Autoimmune flare (pre-existing condition)', severity: 'stop', likelihood: 'rare', onset: 'Variable', duration: 'Until evaluated', notes: 'Because Ta-1 upregulates immune activity, it can theoretically worsen autoimmune disease. Anyone with autoimmune conditions should have medical oversight; new flare symptoms mean stop.' },
      { name: 'Allergic / hypersensitivity reaction', severity: 'stop', likelihood: 'rare', onset: 'Minutes to hours', duration: 'Until treated', notes: 'Hives, facial/throat swelling, or wheezing — stop immediately and seek care.' },
    ],
    redFlags: [
      'Signs of an autoimmune flare (new joint swelling, rashes, unexplained systemic symptoms), especially if you have an autoimmune condition — stop and consult a clinician.',
      'Hives, swelling of face/lips/throat, or difficulty breathing (allergic reaction) — call emergency services.',
      'Spreading redness, warmth, pus, or fever at an injection site (infection).',
      'Persistent high fever or a flu-like illness that worsens rather than settles.',
      'Any new symptom while on immunosuppressants — the two interact and need medical review.',
    ],
    postCycleNotes: 'Run courses of roughly 8-12 weeks followed by about 4 weeks off rather than dosing indefinitely — Ta-1 is used clinically in defined courses. Effects are subtle and cumulative, so judge results over the whole course and into the break, using your baseline metric (infection frequency, recovery, energy). Thymosin alpha-1 is genuinely approved and marketed in some countries (Zadaxin), which puts it on firmer ground than most research peptides, but it is still not an approved drug everywhere and this is not medical advice. Anyone with an autoimmune condition, on immunosuppressants, or with a transplant should only use it under medical supervision.',
    evidenceLevel: 'clinical',
    evidenceNote: 'Thymosin alpha-1 has real clinical use: it is approved and marketed abroad as Zadaxin (e.g., for hepatitis and as an immune adjunct) and has been studied in sepsis and other settings. Human evidence is stronger than for most research peptides, though it remains unapproved in some markets and off-label for general "immune support." Not medical advice.',
    dosing: {
      protocol: [
        'Immune-modulating peptide (Zadaxin abroad). Standard research dosing is ~500mcg daily, subcutaneous.',
        'Run in courses of ~8-12 weeks, then about 4 weeks off.',
        'Dose is held steady — there is no benefit to escalating an immune modulator.',
        'Consistent daily timing suits the mechanism; keep the routine regular.',
      ],
      reconstitution: [
        'Reconstitute a 10mg vial with 2mL bacteriostatic water → 5mg/mL. Trickle water down the glass wall.',
        'Swirl gently until clear — never shake.',
        'U-100 math: units = (dose mg ÷ mg-per-mL) × 100. At 5mg/mL → 500mcg = 10 units (0.10mL).',
        'For a 5mg vial in 2mL → 2.5mg/mL, 500mcg = 20 units. Recompute units whenever your vial size or water volume changes.',
        'Refrigerate at 2-8°C, upright, out of light; discard after ~30 days. Never freeze.',
      ],
    },
    communityTips: [
      'Effects are quiet — people expecting a stimulant-like "feel" are usually disappointed; judge it by infection frequency and recovery over weeks.',
      'Often used around illness season or heavy training blocks as a defined course rather than year-round.',
      'One of the better-tolerated peptides; most reports are limited to mild site reactions.',
    ],
    commonMistakes: [
      'Expecting an immediate noticeable effect and quitting early.',
      'Running it indefinitely instead of in defined courses.',
      'Using it despite an autoimmune condition without medical oversight.',
      'Not recomputing syringe units after switching between 5mg and 10mg vials.',
    ],
    stacking: [
      'Pairs logically with recovery/healing peptides (e.g., BPC-157/TB-500 blends) when the goal is overall resilience.',
      'Commonly run alongside sensible immune basics (sleep, vitamin D, training management).',
      'Avoid stacking with anything immunosuppressive, and get medical guidance before combining with immune-active drugs.',
    ],
  },
];

export function getExperienceForPeptide(peptideId: string): PeptideExperience | undefined {
  return EXPERIENCE_DATA.find(e => e.peptideId === peptideId);
}

export function getCurrentWeekGuide(peptideId: string, currentWeek: number): WeekGuide | undefined {
  const exp = getExperienceForPeptide(peptideId);
  if (!exp) return undefined;
  return exp.weeklyGuide.find(g => currentWeek >= g.weekStart && currentWeek <= g.weekEnd);
}
