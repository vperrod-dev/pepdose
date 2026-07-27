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
    peptideId: 'mots-c',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'No human efficacy data exists. A Phase 2a trial began recruiting in Feb 2026 with results pending, and the only completed human trial used CB4211 — a modified analog, not MOTS-c. Every dose figure in circulation is community consensus.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Starting Low — Nothing Dramatic Expected',
        description: 'MOTS-c is a mitochondrial-derived peptide that activates AMPK, the same energy-sensing pathway exercise and metformin work through. It is best understood as an exercise mimetic. Most people feel nothing specific in the first fortnight; some report a mild dip in training output as metabolism adjusts. There is no loading phase worth doing.',
        tips: ['Start at 5mg per week total before adding a second or third injection', 'Morning or pre-training fits the exercise-mimetic mechanism', 'No fasting required', 'If you take metformin, insulin or a GLP-1, check glucose more often this fortnight'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Settling Into the Weekly Total',
        description: 'The weekly total (5-10mg) matters far more than how you split it. Reported effects at this stage are subtle: steadier energy, better training recovery, sometimes improved fasting glucose. None of this is trial-verified, so treat your own tracking as the only evidence you have.',
        tips: ['Split 2-3 times weekly rather than daily — daily burns vial with no evidence of benefit', 'Log energy and training output so you can judge effect against placebo', 'Swirl, never shake; discard if the solution is cloudy or has particles'],
      },
      {
        weekStart: 5, weekEnd: 6,
        title: 'Honest Assessment Before the Off-Cycle',
        description: 'By week 6 you should decide whether this is doing anything worth the cost. There is no tolerance data in humans, so the 6-on/6-off pattern is convention rather than pharmacology. Nothing supports escalating past 10mg per week.',
        tips: ['If nothing has changed by now, it probably will not', 'Do not push past 10mg/week chasing an effect', 'Competitive athletes: this is banned in and out of competition'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site redness or swelling', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: '24-48h', notes: 'The most-reported effect. Rotate sites.' },
      { name: 'Flushing / warmth', severity: 'normal', likelihood: 'uncommon', onset: '15-60 min', duration: 'Under 2h', notes: '' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'First 1-2 weeks', duration: 'Transient', notes: 'Often hydration-related.' },
      { name: 'Mild fatigue / reduced training output', severity: 'normal', likelihood: 'uncommon', onset: 'Weeks 1-2', duration: '1-2 weeks', notes: 'Reported as an adaptation phase.' },
      { name: 'Hypoglycemia-like symptoms', severity: 'monitor', likelihood: 'uncommon', onset: 'Any time', duration: 'Acute', notes: 'Mechanistically plausible via AMPK. Higher risk on metformin, insulin or GLP-1 agonists.' },
    ],
    redFlags: [
      'Symptomatic low blood sugar — sweating, confusion, tremor — especially if you also take metformin, insulin or a GLP-1',
      'Heart palpitations or a sustained fast heartbeat',
      'Widespread hives, facial or throat swelling, or wheezing',
      'Spreading redness, heat or pus at an injection site, or fever',
    ],
    postCycleNotes: 'No hormonal suppression and no PCT needed. Effects, if any, are not expected to persist after the off-cycle. Remember this is WADA-prohibited at all times (S4.4.1, AMPK activators) — a real consequence for any tested athlete.',
    dosing: {
      protocol: [
        'Weekly TOTAL is the number that matters: 5-10mg, split 2-3 times',
        'Start at 5mg/week for two weeks before adding injections',
        'Morning or pre-exercise; fasting not required',
        'Diabetics or anyone on metformin/insulin/GLP-1 should monitor glucose',
      ],
      reconstitution: [
        '10mg vial + 2mL BAC water = 5mg/mL, so 5mg = 100 units on a U-100 syringe',
        'A 10mg vial + 1mL is also common (10mg/mL, 5mg = 50 units)',
        'Refrigerate, do not freeze; more heat-sensitive than most peptides — use within ~3 weeks',
      ],
    },
    commonMistakes: [
      'Dosing daily — consensus is 2-3x weekly and daily has no evidence behind it',
      'Trusting the "16-hour half-life" some calculators publish; it is unsourced, as are all the others',
      'Shaking the vial or injecting cloudy solution',
    ],
  },
  {
    peptideId: 'ss-31',
    evidenceLevel: 'mixed',
    evidenceNote: 'Genuinely approved (FDA, Sept 2025) for Barth syndrome on a 12-patient trial, with approval conditional on confirmatory studies. But the larger Phase 3 trials in mitochondrial myopathy and heart failure FAILED. No trial supports the community dose range or any anti-aging use.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Injection-Site Reactions Are Near-Universal',
        description: 'SS-31 concentrates in the inner mitochondrial membrane and binds cardiolipin, improving electron transfer with less oxidative stress. The dominant early experience is local: on the approved label, injection-site redness occurred in 100% of patients, pain in 75% and hardening in 67%. Site rotation is mandatory from day one, not something to start once problems appear.',
        tips: ['Map a rotation across abdomen, thighs and flanks before you start', 'Same time every day', 'Refrigerate and protect from light', 'Do not use if you have significant kidney disease without medical supervision'],
      },
      {
        weekStart: 3, weekEnd: 6,
        title: 'Watching for Effect — and for Induration',
        description: 'Any mitochondrial benefit is slow and subtle. Meanwhile hardened lumps at injection sites accumulate if rotation is poor. Note the dose question: the approved regimen is 40mg daily, whereas community protocols run 5-20mg with no data behind them.',
        tips: ['Check old sites for hardening before reusing them', 'Judge over weeks, not days', 'Hypersensitivity can appear months in, not just on first dose'],
      },
      {
        weekStart: 7, weekEnd: 12,
        title: 'Continuation Decision',
        description: 'The approved product is dosed continuously and indefinitely — there is no pharmacological reason to cycle. If you are cycling, that is cost and convention, not biology.',
        tips: ['Do not extrapolate Barth-syndrome approval to aging or performance benefit', 'Cost per month at approved doses is substantial — decide deliberately'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site redness', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: '24-72h', notes: 'Occurred in 100% of patients on the approved label.' },
      { name: 'Injection-site pain', severity: 'normal', likelihood: 'common', onset: 'Immediate', duration: 'Hours to days', notes: '75% on label.' },
      { name: 'Injection-site hardening (induration)', severity: 'monitor', likelihood: 'common', onset: 'Days', duration: 'Days to weeks', notes: '67% on label. Compounds without rotation.' },
      { name: 'Injection-site itching', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: 'Days', notes: '' },
      { name: 'Raised eosinophils', severity: 'monitor', likelihood: 'uncommon', onset: '~90 days', duration: 'Normalises on continued use', notes: 'A labelled lab finding.' },
      { name: 'Hypersensitivity reaction', severity: 'stop', likelihood: 'rare', onset: 'Minutes to months after starting', duration: 'Variable', notes: 'Labelled warning. Rash plus respiratory symptoms.' },
    ],
    redFlags: [
      'Rash with any wheezing, breathlessness, or facial/throat swelling — hypersensitivity can begin months into treatment',
      'Spreading injection-site redness with heat or fever, which may mean infection in hardened tissue',
      'New severe fatigue with reduced urine output — elimination is almost entirely renal',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. The approved product is taken continuously; stopping simply ends the effect. Dose must be halved in significant renal impairment, and the approved formulation contains benzyl alcohol so it is not for neonates.',
    dosing: {
      protocol: [
        'Approved regimen: 40mg subcutaneously once daily, same time each day',
        'Community protocols run 5-20mg daily — 2-8x lower, with nothing in the literature supporting them',
        'Halve the dose in renal impairment (eGFR under 30, not on dialysis)',
        'Rotate sites every single injection — this is the main tolerability lever',
      ],
      reconstitution: [
        'Grey-market vials run 10-50mg; 50mg + 2mL = 25mg/mL',
        'Refrigerate, do not freeze, protect from light',
        'The approved ready-made solution is discarded 8 days after first opening — a much shorter window than the usual 28-day peptide default',
      ],
    },
    commonMistakes: [
      'Assuming approval for Barth syndrome validates use for aging, fatigue or performance — the broader trials failed',
      'Poor site rotation, then blaming the resulting lumps on product quality',
      'Splitting into multiple daily doses because the plasma half-life is 4h — mitochondrial retention means once daily is correct',
    ],
  },
  {
    peptideId: 'igf-1-lr3',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'No human pharmacokinetic or safety trial of IGF-1 LR3 exists. The closest human data is mecasermin (recombinant IGF-1), where hypoglycemia occurred in 42% of 71 paediatric patients. LR3 has a larger free fraction, so that risk is plausibly greater.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Hypoglycemia Safety Setup — Read Before First Injection',
        description: 'IGF-1 LR3 cross-activates the insulin receptor and drives glucose into muscle. Low blood sugar is the immediate, potentially fatal risk, and it is entirely manageable if you set up for it. Before the first injection, decide where your fast carbohydrate lives and never inject without it in reach. Start at 20mg for the first few days to see how your own glucose responds.',
        tips: ['Eat 30-50g of fast carbohydrate within 30 minutes of EVERY injection — this is the controlling safety measure', 'Keep glucose tablets or juice within arm\'s reach at every injection', 'Never inject fasted, alone, or before sleep', 'Start at 20mcg for 3-5 days before considering 40mcg'],
      },
      {
        weekStart: 2, weekEnd: 4,
        title: 'Working Dose and Ongoing Vigilance',
        description: 'At 40mcg most users report localised fullness and better pumps. Watch for water retention, joint aching and hand numbness. The hypoglycemia risk does not diminish with familiarity — the accidents happen when people get relaxed about the carbohydrate rule.',
        tips: ['Recognise the early warning signs: shaking, sweating, sudden hunger, anxiety, fast heartbeat', 'Treat immediately with fast carbohydrate — do not wait to see if it passes', 'Cap the cycle at about 4 weeks', 'Do not use at all with any personal or family cancer history'],
      },
    ],
    sideEffects: [
      { name: 'Hypoglycemia (low blood sugar)', severity: 'stop', likelihood: 'common', onset: '20-60 min after injection', duration: '1-4h', notes: 'The dominant acute risk and it can be severe. Eat carbohydrate with every dose.' },
      { name: 'Injection-site reaction or localised tissue growth', severity: 'monitor', likelihood: 'common', onset: 'Minutes to weeks', duration: 'Variable', notes: 'Rotate sites; repeated use of one site causes lumps.' },
      { name: 'Headache', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: 'Hours', notes: '' },
      { name: 'Water retention / puffiness', severity: 'normal', likelihood: 'common', onset: 'Days', duration: 'Weeks', notes: '' },
      { name: 'Numbness or tingling in the hands', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks', duration: 'Weeks', notes: 'Carpal-tunnel type. Reduce dose or stop.' },
      { name: 'Tonsil or lymphoid swelling', severity: 'monitor', likelihood: 'uncommon', onset: 'Months', duration: 'Variable', notes: '15% in the mecasermin paediatric cohort.' },
      { name: 'Raised pressure around the brain', severity: 'stop', likelihood: 'rare', onset: 'Weeks', duration: 'Variable', notes: 'Documented with mecasermin. Headache with visual change and vomiting.' },
    ],
    redFlags: [
      'Confusion, slurred speech, poor coordination, seizure or loss of consciousness — a hypoglycemic emergency. Give fast carbohydrate immediately and call emergency services',
      'Persistent headache with visual changes or vomiting, which can indicate raised pressure around the brain',
      'Any new lump or mass, or unexplained weight loss',
      'New snoring or sleep-apnea symptoms',
      'Persistent hand numbness or night pain',
    ],
    postCycleNotes: 'No hormonal suppression in the testosterone sense, but IGF-1 receptor signalling downregulates with sustained exposure. The more important reason to keep cycles at about 4 weeks is cumulative growth-factor exposure: IGF-1 receptor activation is a well-established driver of tumour cell proliferation, which is why the approved analogue restricts use in anyone with suspected cancer.',
    dosing: {
      protocol: [
        '20mcg to start, 40mcg typical, 80mcg is the practical ceiling',
        'Once daily, in the morning, WITH food',
        'Eat 30-50g fast carbohydrate within 30 minutes of injecting — mandatory',
        'Cap cycles at ~4 weeks; longer runs add exposure without evidence of benefit',
      ],
      reconstitution: [
        '1mg vial + 1mL = 1000mcg/mL, so 40mcg = 4 units on a U-100 syringe',
        'Less stable than most peptides in plain bacteriostatic water — assume ~14 days refrigerated, not 28',
        '0.6% acetic acid is often used instead for longer stability',
      ],
    },
    commonMistakes: [
      'Injecting fasted or before bed — this is how hypoglycemia becomes an emergency rather than an inconvenience',
      'Escalating past 80-100mcg on forum advice; risk scales steeply and the anabolic ceiling does not',
      'Using the standard 28-day reconstituted shelf life',
      'Assuming the 20-30h half-life is measured — it is not, in humans, and it means a dosing error persists all day',
    ],
  },
  {
    peptideId: 'melanotan-2',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'Never completed clinical development. The human record consists largely of adverse-event case reports — melanoma in situ, eruptive moles, priapism, PRES, rhabdomyolysis — rather than efficacy or safety trials.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 1,
        title: 'Before You Start: The Mole Check',
        description: 'Melanotan II activates melanocortin receptors, driving melanin production but also appetite suppression, nausea and erectile effects. The single most important step happens before the first injection: a full-body dermatological mole check. Case reports document mole darkening, new moles and melanoma in situ during use. Causation is not proven, but without a baseline any later change is uninterpretable. Week one is dominated by nausea and flushing, which is why people dose before bed.',
        tips: ['Get a full-body mole check BEFORE starting, and at least annually after', 'Start at 250mcg pre-bed so the nausea happens during sleep', 'Expect flushing, yawning and stretching — the classic melanocortin cluster', 'Do not start at all with a personal or family melanoma history, many atypical moles, or immunosuppression'],
      },
      {
        weekStart: 2, weekEnd: 2,
        title: 'Pigmentation Builds — So Does Risk Exposure',
        description: 'Nausea typically attenuates. Pigmentation develops gradually, along with darkening of existing moles and freckles — expected pharmacology, and exactly why surveillance matters. Spontaneous erections are common in men; the threshold that matters is four hours.',
        tips: ['An erection past 4 hours is an emergency — go to A&E, do not wait it out', 'Keep using sun protection; this does not replace it', 'Photograph any moles you are unsure about so change is detectable'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Maintenance, Not Continued Loading',
        description: 'Once you reach the pigmentation you wanted, maintenance is typically one or two injections per week rather than daily. Continuing daily just accumulates melanocortin exposure for no additional benefit.',
        tips: ['Switch to 1-2x weekly maintenance', 'Assume the label mass is wrong — assayed grey-market vials ran 43-88% of stated content', 'Any new or changing pigmented lesion means stop and see a dermatologist'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: '15-60 min', duration: '1-3h', notes: 'Usually attenuates over the first week. The reason for pre-bed dosing.' },
      { name: 'Facial flushing', severity: 'normal', likelihood: 'common', onset: '15-30 min', duration: '30-60 min', notes: '' },
      { name: 'Spontaneous erections', severity: 'monitor', likelihood: 'common', onset: '1-4h', duration: 'Hours', notes: 'Distinct from priapism but on the same continuum. Four hours is the emergency threshold.' },
      { name: 'Darkening of moles and freckles', severity: 'monitor', likelihood: 'common', onset: 'Weeks', duration: 'Persistent', notes: 'Expected pharmacology and the reason surveillance is required.' },
      { name: 'Appetite suppression', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: 'Hours', notes: '' },
      { name: 'Lethargy, yawning, stretching', severity: 'normal', likelihood: 'common', onset: '30-60 min', duration: '1h', notes: 'Classic melanocortin cluster.' },
      { name: 'New (eruptive) moles', severity: 'stop', likelihood: 'uncommon', onset: 'Weeks to months', duration: 'Persistent', notes: 'Documented in case reports.' },
      { name: 'Priapism (erection over 4 hours)', severity: 'stop', likelihood: 'rare', onset: 'Hours', duration: 'Emergency', notes: 'Urological emergency. Delay risks permanent erectile dysfunction.' },
    ],
    redFlags: [
      'An erection lasting more than 4 hours — go to an emergency department immediately, do not wait',
      'Any mole that grows, changes shape or colour, becomes asymmetric, itches or bleeds',
      'Any new pigmented lesion, especially one that appears quickly',
      'Severe headache with visual disturbance, confusion or seizure',
      'Dark or tea-coloured urine with severe muscle pain',
      'Chest pain or a sustained rise in blood pressure',
    ],
    postCycleNotes: 'Pigmentation fades over weeks to months as melanocytes turn over. Mole surveillance should continue after stopping — the dermatological case reports are not limited to the dosing period. No hormonal suppression or PCT.',
    dosing: {
      protocol: [
        '250mcg pre-bed to start; 500mcg is the practical upper end',
        'Daily until desired pigmentation, then 1-2x weekly maintenance',
        'Loading at 1mg/day scales nausea and adverse events, not results',
        'Sun protection still required',
      ],
      reconstitution: [
        '10mg vial + 2mL BAC water = 5mg/mL, so 250mcg = 5 units on a U-100 syringe',
        'Refrigerate after reconstitution',
        'Assayed grey-market vials contained 4.3-8.8mg against a 10mg label — dose maths from label mass is unreliable',
      ],
    },
    commonMistakes: [
      'Skipping the baseline dermatology check, which makes any later mole change impossible to interpret',
      'Using the widely quoted 33-hour half-life — it is a corruption of 33 minutes and overstates clearance time roughly 30-fold',
      'Treating spontaneous erections as a quirk and not knowing the 4-hour emergency threshold',
      'Tanning more because of it, which compounds the exact risk in question',
    ],
  },
  {
    peptideId: 'orforglipron',
    evidenceLevel: 'clinical',
    evidenceNote: 'FDA-approved 1 April 2026 on Phase 3 ATTAIN-1 (3,127 patients, 72 weeks, up to 12.4% mean weight loss). This is a fully approved prescription medicine with a published label.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Starting Dose — The Convenience Is Real',
        description: 'Orforglipron is a small molecule rather than a peptide, which is why it is 77% orally bioavailable with no absorption enhancer. Practically that means no fasting, no water restriction and no 30-minute wait — the genuine differentiator against oral semaglutide. Nausea during the first week after each step-up is the main cost.',
        tips: ['Any time of day, with or without food or water', 'Swallow whole — do not crush or chew', 'Each step needs at least 30 days, so full escalation takes about 5 months', 'Tell your prescriber about any strong CYP3A4 inhibitors — they cap the dose at 9mg'],
      },
      {
        weekStart: 5, weekEnd: 12,
        title: 'Climbing the Ladder',
        description: 'Each escalation brings a fresh wave of nausea that settles over days to weeks. Nausea reached 35% at the top dose in trials versus 10% on placebo, so an oral route does not mean a gentler GI experience.',
        tips: ['Hold a step longer rather than pushing through significant nausea', 'Stay hydrated — vomiting plus dehydration is what causes kidney problems on this class', 'Smaller, lower-fat meals help'],
      },
      {
        weekStart: 13, weekEnd: 999,
        title: 'Maintenance — You Do Not Have to Reach the Top',
        description: 'Stopping at 5.5 or 9mg is a legitimate maintenance endpoint if your response is adequate. The maximum is 17.2mg daily. This is continuous therapy — weight regain follows discontinuation.',
        tips: ['Do not chase 17.2mg if 9mg is working', 'Continuous therapy; there is no cycling', 'Tell any surgeon or anesthetist you are on a GLP-1 before a procedure'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'After each step-up', duration: 'Days to weeks', notes: '35% at top dose vs 10% placebo. Worst in the first week after each increase.' },
      { name: 'Diarrhea', severity: 'normal', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '25% vs 11% placebo.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '24% vs 4% placebo. Watch hydration.' },
      { name: 'Constipation', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-8', duration: 'Can persist', notes: '' },
      { name: 'Severe GI reaction', severity: 'stop', likelihood: 'uncommon', onset: 'Any time', duration: 'Variable', notes: '~3% vs 1% placebo; the leading cause of stopping treatment.' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back, with or without vomiting — possible pancreatitis',
      'Persistent vomiting with reduced urination or dizziness on standing',
      'A lump or swelling in the neck, hoarseness, or trouble swallowing',
      'Severe upper-right abdominal pain, possibly gallbladder-related',
      'New or worsening depression or thoughts of self-harm',
    ],
    postCycleNotes: 'Not cycled — this is continuous chronic therapy and weight regain follows discontinuation. Carries a boxed warning for thyroid C-cell tumours and is contraindicated with a personal or family history of medullary thyroid carcinoma or MEN 2. Note that orforglipron is not pharmacologically active in rodents and produced no rodent tumours; the boxed warning is class-precautionary.',
    dosing: {
      protocol: [
        'Tablet ladder: 0.8 → 2.5 → 5.5 → 9 → 14.5 → 17.2mg, at least 30 days per step',
        'Once daily, any time, with or without food or water',
        'Maximum 17.2mg/day; 9mg maximum with strong CYP3A4 inhibitors',
        '5.5mg and 9mg are legitimate maintenance doses',
      ],
    },
    commonMistakes: [
      'Entering 36mg as a dose — that was the trial CAPSULE; the approved tablet maximum is 17.2mg',
      'Escalating on a 4-week calendar rather than the label minimum of 30 days, then blaming the drug for GI intolerance',
      'Assuming an oral GLP-1 means fewer GI effects — the nausea rate matches injectables',
    ],
  },
  {
    peptideId: 'tesofensine',
    evidenceLevel: 'mixed',
    evidenceNote: 'Solid Phase 2 data (24 weeks: 11.2% weight loss at 0.5mg) and a completed Phase 3 programme, but no approved label anywhere and no peer-reviewed Phase 3 publication. Vendor claims of Mexican approval are contradicted by the developer\'s own regulatory disclosures.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Start Low — And Understand the 9-Day Half-Life',
        description: 'Tesofensine is a triple monoamine reuptake inhibitor, not an incretin and not a peptide. It blocks dopamine, noradrenaline and serotonin reuptake. The critical practical fact is the ~9-day half-life: steady state takes 5-7 weeks, so what you feel in week one is a fraction of what the same dose will do by week six. Dry mouth and insomnia arrive early.',
        tips: ['Morning dosing only — insomnia is the dose-limiting side effect', 'Take baseline blood pressure and resting heart rate before starting', '0.25mg for at least 4 weeks before considering 0.5mg', 'Check your full medication list for SSRIs, SNRIs, MAOIs or triptans first'],
      },
      {
        weekStart: 5, weekEnd: 12,
        title: 'Steady State and Cardiovascular Monitoring',
        description: 'Effects and side effects keep accumulating for weeks after a dose change. Heart rate rises by around 8 bpm on average and blood pressure by a few mmHg — this is the reason US development stalled and why the combination product adds a beta-blocker.',
        tips: ['Monitor blood pressure and resting heart rate regularly, not once', 'Stop and reassess if heart rate or blood pressure climbs meaningfully', '0.5mg is the ceiling — 1mg gave marginally more weight loss with materially worse side effects'],
      },
    ],
    sideEffects: [
      { name: 'Dry mouth', severity: 'normal', likelihood: 'common', onset: 'Days 1-7', duration: 'Persistent', notes: 'The most common effect, dose-dependent.' },
      { name: 'Insomnia', severity: 'monitor', likelihood: 'common', onset: 'Week 1', duration: 'Persistent unless timing corrected', notes: 'Dose in the morning.' },
      { name: 'Raised heart rate', severity: 'monitor', likelihood: 'common', onset: 'Weeks 1-4', duration: 'Persistent', notes: 'Average +7-8 bpm at 0.5mg. The core safety issue.' },
      { name: 'Raised blood pressure', severity: 'monitor', likelihood: 'common', onset: 'Weeks 1-4', duration: 'Persistent', notes: '+1-3 mmHg, worse at higher doses.' },
      { name: 'Headache', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-2', duration: 'Transient', notes: '' },
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-2', duration: 'Transient', notes: '' },
      { name: 'Mood change, irritability, anxiety', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks 1+', duration: 'Variable', notes: 'Monoaminergic effect.' },
    ],
    redFlags: [
      'Agitation, tremor, fever or confusion — a serotonin-syndrome picture, especially if taking any serotonergic medication',
      'Chest pain or sustained palpitations',
      'Severe or persistent headache with high blood pressure',
      'Any significant mood deterioration or thoughts of self-harm',
    ],
    postCycleNotes: 'With a ~9-day half-life, the compound persists for weeks after the last dose. Any washout before starting a serotonergic medication must be measured in weeks, not days. Dopamine reuptake inhibition carries abuse and dependence liability. There is no established cycling protocol and short cycles make no pharmacological sense at this half-life.',
    dosing: {
      protocol: [
        '0.25mg daily for at least 4 weeks, then 0.5mg if tolerated',
        'Morning only',
        '0.5mg is the ceiling; 1mg was poorly tolerated and not carried forward',
        'Baseline and ongoing blood pressure and heart rate monitoring is mandatory',
      ],
    },
    commonMistakes: [
      'Filing it mentally with the GLP-1s — completely different drug class, different monitoring, different interactions',
      'Skipping doses or cycling weekly, which does nothing at a 9-day half-life',
      'Believing vendor claims that it is approved in Mexico',
    ],
  },
  {
    peptideId: 'll-37',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'No published human trial has tested subcutaneous LL-37 at any dose. Human data exists only for topical (leg ulcer) and intratumoral routes. Every injectable dose figure in circulation is vendor-invented.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'An Honest Framing',
        description: 'LL-37 is the body\'s own antimicrobial peptide, disrupting bacterial membranes and modulating innate immunity. The difficulty is that its antimicrobial concentrations sit close to its cell-damaging ones, and nobody has mapped that window in humans by injection. Local injection-site reactions are the dominant reported experience.',
        tips: ['Reconstitute cold and swirl — never shake', 'Rotate sites aggressively; local reactions dominate', 'Do not mix in a syringe with other peptides — it aggregates', 'Topical or wound use has the only supporting human data'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site pain and redness', severity: 'normal', likelihood: 'common', onset: 'Minutes', duration: 'Hours', notes: 'Mechanistically expected from a cationic peptide.' },
      { name: 'Histamine-type flushing or itch', severity: 'monitor', likelihood: 'uncommon', onset: '5-30 min', duration: '1-2h', notes: 'LL-37 degranulates mast cells.' },
      { name: 'Red blood cell damage (hemolysis)', severity: 'stop', likelihood: 'rare', onset: 'Unknown', duration: 'Unknown', notes: 'The core hazard. Hemolytic activity occurs near antimicrobial concentrations.' },
      { name: 'Inflammatory flare', severity: 'stop', likelihood: 'uncommon', onset: 'Days', duration: 'Variable', notes: 'LL-37 is implicated in psoriasis, rosacea, ulcerative colitis and lupus.' },
    ],
    redFlags: [
      'Dark or cola-coloured urine, which can indicate red blood cell breakdown',
      'A spreading rash or new psoriasis-like plaques',
      'Fever with malaise',
      'Any tissue breakdown or necrosis at an injection site',
    ],
    postCycleNotes: 'No hormonal effects or PCT. Anyone with psoriasis, rosacea, lupus or inflammatory bowel disease should treat this as contraindicated rather than merely cautioned — LL-37 is directly implicated in those conditions and is an autoantigen in psoriasis.',
    commonMistakes: [
      'Treating vendor dose charts as clinically derived — none of them are',
      'Mixing with other injectables in one syringe',
      'Assuming "it is a human peptide so it is safe" — endogenous LL-37 is tightly compartmentalised and systemic exposure is not physiological',
    ],
  },
  {
    peptideId: 'thymosin-alpha-1',
    evidenceLevel: 'clinical',
    evidenceNote: 'The strongest evidence base in this set: 1.6mg twice weekly comes directly from Phase III chronic hepatitis B registration trials, and the compound is approved in 35+ countries as thymalfasin.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Silent Immune Modulation',
        description: 'Thymosin alpha-1 matures dendritic cells and shifts T-cell balance. You are unlikely to feel anything — that is expected, not a sign it is not working. Injection-site discomfort was the most frequent adverse event across large hepatitis trials, which were otherwise notably well tolerated.',
        tips: ['1.6mg twice weekly is the evidence-backed dose; higher is not better-supported', 'Reconstitute the 1.6mg vial with 1mL so 1mL equals a full dose', 'Judge over 8-12 weeks — this works silently', 'Do not use alongside immunosuppressive therapy without your doctor'],
      },
      {
        weekStart: 5, weekEnd: 12,
        title: 'Continuation',
        description: 'Registration trials ran 26-52 weeks continuously, so there is no pharmacological need to cycle. Any off-cycle is a cost and monitoring decision.',
        tips: ['Continuous use is what the trials did', 'Watch for any autoimmune-type symptoms', 'Approval abroad does not mean legal supply locally'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site redness or discomfort', severity: 'normal', likelihood: 'common', onset: 'Minutes', duration: 'Hours', notes: 'The most frequent adverse event in trials; mild and self-limiting.' },
      { name: 'Transient fatigue or malaise', severity: 'normal', likelihood: 'uncommon', onset: 'Hours', duration: '1 day', notes: 'Consistent with immune activation.' },
      { name: 'Rash', severity: 'monitor', likelihood: 'rare', onset: 'Days', duration: 'Days', notes: '' },
    ],
    redFlags: [
      'Jaundice or dark urine',
      'Any autoimmune flare — new joint pain with rash, or thyroid symptoms',
      'Signs of a severe allergic reaction',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. Anyone on immunosuppression or post-transplant should not use this without their physician: stimulating T-cell function works directly against that therapy.',
    dosing: {
      protocol: [
        '1.6mg subcutaneously twice weekly — the registration-trial regimen',
        'Vials ship at 1.6mg, not the 5mg typical of other peptides',
        'Effects are immunological and slow; judge over 8-12 weeks',
      ],
      reconstitution: [
        '1.6mg vial + 1mL bacteriostatic water = the full dose in 1mL',
        'Do NOT apply the standard 5mg/2mL maths — that underdoses by about 3x',
      ],
    },
    commonMistakes: [
      'Reconstituting a 1.6mg vial as if it were 5mg and underdosing threefold',
      'Expecting to feel something — this modulates immunity silently',
      'Assuming approval abroad means legal supply locally',
    ],
  },
  {
    peptideId: 'ghrp-2',
    evidenceLevel: 'mixed',
    evidenceNote: 'Acute GH pharmacology is clinically established — Japan approved it in 2004 as a diagnostic agent. But no trial has evaluated repeated self-administered dosing for body composition or anti-aging.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Finding the Saturation Dose',
        description: 'GHRP-2 triggers GH release through the ghrelin receptor. The important practical fact is that the GH response saturates near 100mcg — beyond that you mostly add cortisol and prolactin rather than growth hormone. Expect mild hunger, flushing and drowsiness within half an hour.',
        tips: ['100mcg is the saturation dose — resist escalating', 'Dose fasted; carbohydrate and fat blunt the pulse', 'Wait 20-30 minutes after injecting before eating', 'Pre-bed matches natural GH pulsatility'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Assessing With Bloodwork, Not Feel',
        description: 'Water retention and improved recovery are commonly reported. GH itself is pulsatile so a spot measurement tells you nothing — IGF-1 is the meaningful marker.',
        tips: ['Track IGF-1, not GH', 'Watch fasting glucose — GH reduces insulin sensitivity', 'Report any hand numbness or night pain'],
      },
    ],
    sideEffects: [
      { name: 'Increased appetite', severity: 'normal', likelihood: 'common', onset: '20-30 min', duration: '1-2h', notes: 'Milder than GHRP-6 but present.' },
      { name: 'Flushing / transient warmth', severity: 'normal', likelihood: 'common', onset: '5-15 min', duration: '15-30 min', notes: '' },
      { name: 'Transient drowsiness', severity: 'normal', likelihood: 'common', onset: '15-30 min', duration: '1h', notes: 'The reason for pre-bed dosing.' },
      { name: 'Water retention', severity: 'normal', likelihood: 'common', onset: 'Days', duration: 'Weeks', notes: '' },
      { name: 'Cortisol and prolactin rise', severity: 'monitor', likelihood: 'uncommon', onset: 'Acute', duration: 'Hours', notes: 'Minimal at 100mcg, common above it.' },
      { name: 'Reduced insulin sensitivity', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks', duration: 'Weeks', notes: 'GH-mediated. Monitor fasting glucose.' },
      { name: 'Tingling or numbness in hands', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks', duration: 'Weeks', notes: 'Carpal-tunnel type.' },
    ],
    redFlags: [
      'Persistent hand numbness or night pain',
      'Visual field changes or a new persistent headache',
      'Fasting glucose entering the diabetic range',
      'Breast tissue changes or nipple discharge, or menstrual disruption',
      'Any new or growing lump',
    ],
    postCycleNotes: 'GH and IGF-1 return to baseline over 1-2 weeks. No PCT needed. Japan\'s approval covers a single diagnostic IV bolus and is not evidence for the safety of long-term daily self-dosing.',
    commonMistakes: [
      'Dosing 300mcg or more expecting proportional GH — the receptor saturates near 100mcg',
      'Injecting after a meal and losing most of the effect',
      'Reading the Japanese diagnostic approval as validation of therapeutic use',
    ],
  },
  {
    peptideId: 'ghrp-6',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'Acute GH and appetite pharmacology are documented in animal and small human studies, but no human trial of repeated dosing for physique or recovery outcomes exists, and the cortisol/prolactin liability is real.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'The Hunger Is the Headline',
        description: 'GHRP-6 releases GH but also activates the hypothalamic appetite circuit directly, producing intense hunger 20-30 minutes after injection. This is genuinely useful if you are trying to eat more and actively counterproductive in a deficit. Above roughly 1mcg/kg it also raises ACTH, cortisol and prolactin — and at 100mcg a 70-100kg adult is already near that threshold.',
        tips: ['Keep each injection at or below about 1mcg/kg', 'Pre-bed dosing puts the hunger spike where you can sleep through it', 'Do not use this for fat loss — the hunger defeats the purpose', 'GHRP-2 or ipamorelin give similar GH with less hunger and less cortisol'],
      },
      {
        weekStart: 5, weekEnd: 8,
        title: 'Watching Prolactin',
        description: 'Chronic prolactin elevation is the effect that distinguishes GHRP-6 from cleaner options. Breast tenderness, libido changes or menstrual disruption warrant stopping and testing rather than dose-reducing.',
        tips: ['If prolactin symptoms appear, stop and check serum prolactin', 'Track IGF-1 rather than GH', 'Monitor fasting glucose'],
      },
    ],
    sideEffects: [
      { name: 'Intense hunger', severity: 'normal', likelihood: 'common', onset: '20-30 min', duration: '1-2h', notes: 'Near-universal and often overwhelming. The signature effect.' },
      { name: 'Flushing, warmth, head rush', severity: 'normal', likelihood: 'common', onset: '5-15 min', duration: '15-30 min', notes: '' },
      { name: 'Water retention', severity: 'normal', likelihood: 'common', onset: 'Days', duration: 'Weeks', notes: '' },
      { name: 'Cortisol and ACTH elevation', severity: 'monitor', likelihood: 'common', onset: 'Acute', duration: 'Hours', notes: 'Dose-dependent, notable above ~1mcg/kg. The key difference from GHRP-2.' },
      { name: 'Prolactin elevation', severity: 'monitor', likelihood: 'uncommon', onset: 'Acute to weeks', duration: 'Variable', notes: 'Can cause breast tissue growth, libido loss and cycle disruption.' },
      { name: 'Transient drowsiness', severity: 'normal', likelihood: 'common', onset: '15-30 min', duration: '1h', notes: '' },
      { name: 'Tingling or numbness in hands', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks', duration: 'Weeks', notes: '' },
    ],
    redFlags: [
      'Breast tissue growth or nipple tenderness',
      'Nipple discharge',
      'Menstrual irregularity',
      'Persistent central weight gain with easy bruising and mood change, which can indicate chronic cortisol excess',
      'Persistent hand numbness, or fasting glucose entering the diabetic range',
    ],
    postCycleNotes: 'GH, cortisol and prolactin normalise over 1-2 weeks after stopping. No PCT needed, but if prolactin symptoms appeared they should be confirmed resolved by testing.',
    commonMistakes: [
      'Choosing GHRP-6 for a cutting phase',
      'Escalating past 100-200mcg, which is exactly where the cortisol and prolactin liability begins',
      'Never checking prolactin on long runs and blaming breast tissue changes on something else',
    ],
  },
  {
    peptideId: 'hexarelin',
    evidenceLevel: 'mixed',
    evidenceNote: 'Human GH-response and cardiac pharmacology are well characterised in short academic studies, but hexarelin was never developed to approval and there is no long-term human safety or body-composition data.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'The Strongest Pulse — Briefly',
        description: 'Hexarelin produces the largest GH pulse of any GHRP. The catch defines the compound: the response measurably declines by week 4 of continuous use and is markedly blunted by week 16. The 4-on/4-off cycle is not padding, it is the central limitation.',
        tips: ['100mcg is at or near saturation — 200mcg mostly buys cortisol and prolactin', 'Dose fasted; food within 2h blunts the pulse', 'Pre-bed aligns with natural pulsatility', 'Take a baseline fasting glucose or HbA1c'],
      },
      {
        weekStart: 3, weekEnd: 4,
        title: 'Response Already Fading',
        description: 'By the end of week 4 many users notice reduced effect. The correct response is the washout, not a higher dose — escalating accelerates desensitization and adds cortisol.',
        tips: ['Do not chase fading response with more dose', 'Take the full 4-week washout', 'Repeat fasting glucose at the end of the cycle'],
      },
    ],
    sideEffects: [
      { name: 'Loss of GH response (tachyphylaxis)', severity: 'monitor', likelihood: 'common', onset: '2-4 weeks', duration: 'Until washout', notes: 'The main reason to cycle. Faster than any other GHRP.' },
      { name: 'Increased appetite', severity: 'normal', likelihood: 'common', onset: '20-30 min', duration: '1-2h', notes: 'Less than GHRP-6, more than ipamorelin.' },
      { name: 'Water retention, joint puffiness', severity: 'normal', likelihood: 'common', onset: 'Days', duration: 'Weeks', notes: '' },
      { name: 'Cortisol and prolactin elevation', severity: 'monitor', likelihood: 'common', onset: 'Acute', duration: 'Hours', notes: 'Greater than GHRP-2 at equivalent GH output.' },
      { name: 'Transient flushing / head rush', severity: 'normal', likelihood: 'common', onset: '5-15 min', duration: 'Minutes', notes: '' },
      { name: 'Numbness or tingling in hands', severity: 'monitor', likelihood: 'uncommon', onset: 'Weeks', duration: 'Weeks', notes: 'A carpal-tunnel signal.' },
    ],
    redFlags: [
      'Persistent hand numbness or night pain',
      'New or worsening headaches with visual change',
      'Fasting glucose drifting into the diabetic range',
      'Any new or growing lump — GH secretagogues are contraindicated with active malignancy',
    ],
    postCycleNotes: 'Receptor sensitivity recovers over the 4-week washout. GH and IGF-1 return to baseline within 1-2 weeks. No PCT needed.',
    commonMistakes: [
      'Running it continuously "because it is the strongest" and losing all response by week 6',
      'Escalating dose once response fades instead of taking the washout',
      'Ignoring the cortisol profile — hexarelin is the least clean GHRP after GHRP-6',
    ],
  },
  {
    peptideId: 'dsip',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'The human literature is a handful of small studies from 1983-1987 with genuinely mixed results — one controlled study concluded the sleep improvement was of little clinical significance. Nothing has replicated it in the modern era, and DSIP\'s receptor has never been identified.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'Low Expectations, Short Half-Life',
        description: 'DSIP is associated with delta-wave sleep, though nobody has identified its receptor. Individual response to timing varies more than to dose. The effects clear fast, so a bad night resolves by morning.',
        tips: ['Inject 30 minutes to 3 hours before bed', 'Start at 100mcg and hold a week before considering more', 'Higher doses associate with morning grogginess, not better sleep', 'Fix sleep hygiene, light exposure and caffeine timing first — the effect here is small at best'],
      },
    ],
    sideEffects: [
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'Hours', duration: 'Hours', notes: 'The most consistently reported effect across the old trials.' },
      { name: 'Nausea', severity: 'normal', likelihood: 'uncommon', onset: '30-60 min', duration: '1-2h', notes: '' },
      { name: 'Dizziness', severity: 'normal', likelihood: 'uncommon', onset: '30-60 min', duration: '1-2h', notes: '' },
      { name: 'Morning grogginess', severity: 'normal', likelihood: 'uncommon', onset: 'Next morning', duration: 'Hours', notes: 'More likely with higher doses or late injection.' },
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Minutes', duration: 'Hours', notes: '' },
    ],
    redFlags: [
      'Severe or persistent headache with visual change',
      'Fainting',
      'Any allergic reaction',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. Long-term effects are genuinely unstudied beyond a few weeks, which is the only reason to keep courses short.',
    commonMistakes: [
      'Escalating to 500mcg or more chasing an effect the literature never demonstrated',
      'Trusting vendor mechanism claims about specific receptors or GABA/melatonin pathways — none have a basis',
      'Combining with alcohol or sedatives, which is untested and unnecessary',
    ],
  },
  {
    peptideId: 'humanin',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'A vendor-neutral scientific review records zero clinical trials and states that therapeutic dosing has not been established. All human data is observational — humanin levels decline with age — which is correlation, not evidence that injecting it helps.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 8,
        title: 'No Established Dose — Proceed Accordingly',
        description: 'Humanin is a mitochondrial-derived peptide that activates survival signalling and blocks apoptosis by sequestering pro-apoptotic proteins. There is no correct dose to give: sources disagree by roughly 15x on weekly exposure, and preclinical animal doses do not translate to the human figures in circulation by any standard method.',
        tips: ['If used at all, start at the bottom of the range and stay there', 'Nothing supports escalation', 'Refrigerate, do not freeze, 28-day limit', 'Absolute contraindication with active, recent or high-risk-for cancer'],
      },
    ],
    sideEffects: [
      { name: 'Injection-site irritation', severity: 'normal', likelihood: 'common', onset: 'Minutes to hours', duration: '24-48h', notes: 'The only consistently reported effect.' },
      { name: 'Mild fatigue', severity: 'normal', likelihood: 'uncommon', onset: 'First week', duration: 'Days', notes: '' },
      { name: 'Allergic reaction', severity: 'stop', likelihood: 'rare', onset: 'Minutes to hours', duration: 'Variable', notes: 'Generic peptide risk.' },
      { name: 'Theoretical pro-survival signalling in pre-malignant cells', severity: 'stop', likelihood: 'rare', onset: 'Unknown', duration: 'Unknown', notes: 'The mechanism IS apoptosis inhibition — cells that should die may not. The principal concern with this compound.' },
    ],
    redFlags: [
      'Any new or enlarging lump, unexplained weight loss, night sweats or persistent swollen glands — given the anti-apoptotic mechanism, do not wait',
      'Rash with breathing difficulty or facial swelling',
      'Spreading injection-site infection',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. The absence of reported side effects reflects the absence of studies, not established safety.',
    commonMistakes: [
      'Confusing humanin with HNG — HNG is a substituted analog roughly 1000x more potent, and it is what most animal studies actually used',
      'Reading "humanin declines with age" as evidence that supplementing it reverses aging',
      'Ignoring the cancer caution because the side-effect list looks short',
    ],
  },
  {
    peptideId: '5-amino-1mq',
    evidenceLevel: 'anecdotal',
    evidenceNote: 'Zero human trials. No registration, no published human pharmacokinetics or safety data. All dosing is community extrapolation from obese-mouse studies, and vendor pages claiming human trial data are unsupported.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 2,
        title: 'Tolerance Ramp',
        description: 'This is a small molecule, not a peptide — an oral capsule that inhibits NNMT, preserving NAD+ and SAM pools in fat tissue. A mild stimulant feeling and slightly raised resting heart rate are the most-reported early effects. Take it in the morning: evening dosing reliably causes insomnia.',
        tips: ['50mg daily for the first 1-2 weeks before considering 100mg', 'Morning only', 'Take with food — GI upset is worse on an empty stomach', 'Check your medication list for SSRIs, SNRIs or MAOIs first'],
      },
      {
        weekStart: 3, weekEnd: 8,
        title: 'Working Dose',
        description: '100mg daily is the common working dose with 150mg the usual ceiling. Beyond that, reports describe more side effects rather than more benefit.',
        tips: ['Cap at 150mg/day', 'Watch resting heart rate', 'If you feel nothing by week 6, it probably is not working'],
      },
    ],
    sideEffects: [
      { name: 'Mild stimulant feeling, raised resting heart rate', severity: 'monitor', likelihood: 'common', onset: 'Weeks 1-2', duration: '1-2 weeks', notes: 'The most-reported effect.' },
      { name: 'Insomnia', severity: 'monitor', likelihood: 'common', onset: 'Week 1', duration: 'Until timing corrected', notes: 'Take before noon.' },
      { name: 'GI upset / nausea', severity: 'normal', likelihood: 'common', onset: 'First week', duration: 'Days', notes: 'Take with food.' },
      { name: 'Headache', severity: 'normal', likelihood: 'uncommon', onset: 'First week', duration: 'Transient', notes: '' },
      { name: 'Reduced exercise tolerance', severity: 'normal', likelihood: 'uncommon', onset: 'Weeks 1-3', duration: 'Transient', notes: '' },
      { name: 'MAO-A inhibition (drug interaction risk)', severity: 'stop', likelihood: 'rare', onset: 'Unknown', duration: 'Unknown', notes: 'The mouse study measured 67% MAO-A inhibition. Theoretical serotonin-syndrome and hypertensive-crisis risk with SSRIs, SNRIs, MAOIs, triptans and tyramine-rich foods. Vendor sites do not mention this.' },
    ],
    redFlags: [
      'Agitation, tremor, fever or confusion — a serotonin-syndrome picture, especially on any serotonergic medication',
      'Severe or persistent headache with high blood pressure',
      'Chest pain or sustained palpitations',
      'Jaundice or right-upper-abdominal pain',
    ],
    postCycleNotes: 'No hormonal suppression or PCT. Cycling is theoretical — there is no tolerance or washout data in any species.',
    commonMistakes: [
      'Treating it as a peptide and trying to reconstitute or inject it — the standard product is an oral capsule',
      'Evening dosing',
      'Believing the "human trial" claims on vendor pages — there are none',
    ],
  },
  {
    peptideId: 'cagrilintide',
    evidenceLevel: 'clinical',
    evidenceNote: 'Robust Phase 1/2 pharmacokinetic and efficacy data (about 10.8% weight loss at 4.5mg over 26 weeks), but no approved label. Any specific self-dosing protocol in circulation is extrapolated from trials rather than validated.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 8,
        title: 'A Different Receptor Family',
        description: 'Cagrilintide is a long-acting amylin analogue, not a GLP-1 agonist. It promotes satiety through hindbrain signalling and slows gastric emptying. Nausea is milder than GLP-1 agonists at comparable weight loss, but injection-site reactions are notably more frequent — the signature of the amylin class.',
        tips: ['Weekly, on a fixed day', 'Rotate injection sites — local reactions are the class signature', 'Steady state takes 5-6 weeks, so judge tolerance over a full month', 'A missed dose can be taken within a few days without restarting titration'],
      },
      {
        weekStart: 9, weekEnd: 999,
        title: 'Climbing to Maintenance',
        description: '2.4mg is the dose carried forward into the combination product. The 4-week steps exist for tolerability.',
        tips: ['Do not escalate faster than 4 weeks per step even if early doses feel easy', 'The ~8-day half-life means you are still accumulating', 'Any side effect persists for weeks — there is no rapid washout'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'First 1-2 weeks after each step', duration: 'Transient', notes: 'Dose-dependent; milder than GLP-1 agonists at equal weight loss.' },
      { name: 'Injection-site reactions', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: '1-3 days', notes: 'Notably more frequent than with GLP-1 agonists.' },
      { name: 'Vomiting / decreased appetite', severity: 'normal', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '' },
      { name: 'Constipation', severity: 'normal', likelihood: 'common', onset: 'Week 2 onward', duration: 'Can persist', notes: '' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back',
      'Persistent vomiting with signs of dehydration',
      'Any severe allergic reaction',
    ],
    postCycleNotes: 'Continuous weekly therapy rather than a cycled compound. The ~8-day half-life means effects and side effects persist for weeks after stopping. Material sold as cagrilintide outside a trial is unregulated and of unverified identity.',
    commonMistakes: [
      'Treating it as another GLP-1 — different receptor family and different side-effect profile',
      'Escalating faster than 4 weeks per step because early doses feel easy',
      'Stacking full-dose cagrilintide onto full-dose semaglutide instead of titrating together',
    ],
  },
  {
    peptideId: 'cagrisema',
    evidenceLevel: 'clinical',
    evidenceNote: 'Phase 3 REDEFINE 1 (about 3,400 patients, 68 weeks) showed 20.4% weight loss on the real-world estimand, beating both monotherapies. Application filed with the FDA in Dec 2025 but not yet approved.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 16,
        title: 'Two Mechanisms, One Slow Ladder',
        description: 'CagriSema combines an amylin analogue with semaglutide at matched doses, hitting two separate satiety pathways. Both components escalate together over 16 weeks — the two-mechanism GI burden is exactly why the ladder is that slow. Prior semaglutide experience does not let you skip it, because the amylin component is still new to your body.',
        tips: ['Both components rise together — they cannot be titrated separately', 'Weekly on a fixed day', 'Rotate sites; the amylin component causes local reactions', 'Do not skip the ladder even if experienced with semaglutide'],
      },
      {
        weekStart: 17, weekEnd: 999,
        title: 'Maintenance at 2.4/2.4mg',
        description: 'There is no higher studied dose. Discontinuation for side effects ran 8.4% in the diabetes trial versus 3.0% on placebo, concentrated in the escalation phase.',
        tips: ['2.4/2.4mg is the maximum studied dose', 'Tell any surgeon or anesthetist you are on a GLP-1 before a procedure', 'Continuous therapy — weight regain follows stopping'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Each escalation step', duration: 'Transient', notes: 'Additive from both components.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: 'Watch hydration.' },
      { name: 'Diarrhea or constipation', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-16', duration: 'Variable', notes: '' },
      { name: 'Injection-site reactions', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: '1-3 days', notes: 'From the amylin component.' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back — possible pancreatitis',
      'Persistent vomiting with reduced urination',
      'A lump in the neck, hoarseness or trouble swallowing',
      'Severe upper-right abdominal pain',
    ],
    postCycleNotes: 'Continuous therapy, not cycled. Expect the class GLP-1 boxed warning for thyroid C-cell tumours via the semaglutide component, and the same contraindications: medullary thyroid carcinoma or MEN 2 history. Not for use in pregnancy.',
    commonMistakes: [
      'Recording it as "semaglutide plus something" — the amylin component carries its own side effects and titration needs',
      'Quoting 22.7% as the expected result; that is the ideal-adherence figure, 20.4% is real-world',
      'Skipping the ladder based on prior semaglutide experience',
    ],
  },
  {
    peptideId: 'survodutide',
    evidenceLevel: 'clinical',
    evidenceNote: 'Phase 3 SYNCHRONIZE-1 (725 patients, 76 weeks) reported 16.6% weight loss at 6mg on the efficacy estimand. Not approved anywhere; filings expected 2026 with approval unlikely before 2027.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 16,
        title: 'The Slowest Ladder in the Class',
        description: 'Survodutide is a dual glucagon and GLP-1 receptor agonist. The glucagon arm raises energy expenditure and reduces liver fat — a genuinely different mechanism from semaglutide or tirzepatide — but combined with GLP-1 activity it produces the heaviest escalation-phase GI burden of the injectables here. Nearly all trial discontinuations happened during escalation.',
        tips: ['Hold a step longer rather than stopping if nausea is significant', 'Weekly on a fixed day', 'The hepatic fat effect is disproportionate to weight loss — relevant if you have fatty liver disease', 'Do not copy tirzepatide\'s ladder onto this'],
      },
      {
        weekStart: 17, weekEnd: 999,
        title: 'Maintenance at 3.6 or 6mg',
        description: 'Both 3.6mg and 6mg are Phase 3 maintenance targets. Note that 4.8mg was the Phase 2 ceiling and is not the Phase 3 maintenance dose.',
        tips: ['Watch resting heart rate — glucagon agonism raises it', 'Cardiovascular safety is still under study'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Predominantly during escalation', duration: 'Transient', notes: 'Discontinuations cluster in the escalation phase.' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '' },
      { name: 'Diarrhea or constipation', severity: 'normal', likelihood: 'common', onset: 'Escalation', duration: 'Variable', notes: '' },
      { name: 'Increased heart rate', severity: 'monitor', likelihood: 'common', onset: 'Escalation onward', duration: 'Persistent', notes: 'A glucagon-agonist class effect. Monitor.' },
      { name: 'Injection-site reactions', severity: 'normal', likelihood: 'uncommon', onset: 'Hours', duration: 'Days', notes: '' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back',
      'Persistent vomiting with reduced urination',
      'Chest pain or sustained palpitations',
      'A lump in the neck, hoarseness or trouble swallowing',
    ],
    postCycleNotes: 'Continuous therapy, not cycled. Cardiovascular safety is the subject of an ongoing outcomes trial and is not yet fully established. Investigational — there is no licensed supply.',
    commonMistakes: [
      'Assuming 4.8mg is the maintenance dose — that was the Phase 2 ceiling; Phase 3 targets are 3.6 and 6mg',
      'Copying tirzepatide\'s escalation, which is a different receptor pair and a faster ladder',
      'Stopping during escalation instead of holding a step longer',
    ],
  },
  {
    peptideId: 'mazdutide',
    evidenceLevel: 'clinical',
    evidenceNote: 'Approved in China (June 2025 for weight management, September 2025 for type 2 diabetes) on Phase 3 GLORY-1 (610 Chinese adults, 48 weeks, 14.8% weight loss at 6mg). Data comes overwhelmingly from Chinese populations.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 8,
        title: 'Dual GLP-1 and Glucagon',
        description: 'Mazdutide is the first approved GLP-1/glucagon dual agonist. GLP-1 activity suppresses appetite while glucagon activity raises energy expenditure and reduces liver fat. The label ladder is 2mg for four weeks, then 4mg for four weeks, then 6mg maintenance.',
        tips: ['Weekly on a fixed day', 'Steady state takes 4-5 weeks per level — assess tolerance over a month', 'Watch resting heart rate', 'Approved in China only; supply elsewhere is unlicensed'],
      },
      {
        weekStart: 9, weekEnd: 999,
        title: 'Maintenance — And Permission to Step Down',
        description: '6mg is the maximum approved dose. The label explicitly allows stepping back down to 4mg if 6mg is not tolerated, which is a sanctioned move rather than a failure.',
        tips: ['6mg is the maximum approved dose — the 9mg trial dose is not prescribable', 'Stepping down to 4mg is explicitly permitted', 'Do not blend the label ladder with the GLORY-1 trial ladder'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Each escalation step', duration: 'Transient', notes: '' },
      { name: 'Diarrhea', severity: 'normal', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '' },
      { name: 'Decreased appetite', severity: 'normal', likelihood: 'common', onset: 'Week 1 onward', duration: 'Persistent (intended)', notes: '' },
      { name: 'Increased heart rate', severity: 'monitor', likelihood: 'common', onset: 'Escalation onward', duration: 'Persistent', notes: 'Glucagon-receptor class effect.' },
      { name: 'Injection-site reaction', severity: 'normal', likelihood: 'common', onset: 'Hours', duration: '1-3 days', notes: '' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back',
      'Persistent vomiting with reduced urination',
      'Chest pain or sustained palpitations',
      'A lump in the neck, hoarseness or trouble swallowing',
    ],
    postCycleNotes: 'Continuous therapy, not cycled. Efficacy and safety data are overwhelmingly from Chinese populations and generalisability to Western BMI ranges is not established.',
    commonMistakes: [
      'Presenting it as globally available — it is approved in China only',
      'Mixing the GLORY-1 trial ladder (1.5/3/4.5/6mg) with the label ladder (2/4/6mg)',
      'Treating 9mg as prescribable — it is under review, not approved',
    ],
  },
  {
    peptideId: 'oral-semaglutide',
    evidenceLevel: 'clinical',
    evidenceNote: 'FDA-approved 22 December 2025 as the first oral GLP-1 for chronic weight management, on OASIS-4 (16.6% mean weight loss). A fully approved prescription medicine.',
    weeklyGuide: [
      {
        weekStart: 1, weekEnd: 4,
        title: 'The Fasting Rule Is the Whole Game',
        description: 'This is the same molecule as injectable semaglutide, made absorbable by the enhancer SNAC. That absorption is fragile: take it on an empty stomach with no more than 120mL of plain water, then wait 30 minutes before any food, drink or other medication. Skipping this materially reduces how much drug you absorb — the single most common reason people conclude "it is not working".',
        tips: ['Empty stomach, plain water only, no more than 4oz/120mL', 'Wait a full 30 minutes before anything else including coffee and other pills', 'First thing on waking is the easiest way to comply', 'Do not confuse this with orforglipron, which has no fasting requirement'],
      },
      {
        weekStart: 5, weekEnd: 12,
        title: 'Climbing the Ladder',
        description: 'Steps are 3 → 7 → 14 → 25mg with 30 days minimum at each. Nausea follows each increase and settles over days to weeks.',
        tips: ['Hold a step longer rather than pushing through significant nausea', 'Smaller, lower-fat meals help', 'Stay hydrated'],
      },
      {
        weekStart: 13, weekEnd: 999,
        title: 'Maintenance at 25mg',
        description: '25mg daily is the weight-management maintenance dose. Rybelsus, the earlier diabetes product, tops out at 14mg — they are different products and should not be mixed up.',
        tips: ['Continuous therapy; weight regain follows stopping', 'Tell any surgeon or anesthetist you are on a GLP-1 before a procedure'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'After each step-up', duration: 'Days to weeks', notes: '' },
      { name: 'Diarrhea', severity: 'normal', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: '' },
      { name: 'Vomiting', severity: 'monitor', likelihood: 'common', onset: 'Escalation', duration: 'Transient', notes: 'Watch hydration.' },
      { name: 'Constipation', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-8', duration: 'Can persist', notes: '' },
      { name: 'Reduced absorption from incorrect dosing', severity: 'monitor', likelihood: 'common', onset: 'Any time', duration: 'Ongoing', notes: 'Not a side effect as such, but the main reason the drug underperforms. Follow the fasting rule exactly.' },
    ],
    redFlags: [
      'Severe abdominal pain radiating to the back — possible pancreatitis',
      'Persistent vomiting with reduced urination or dizziness on standing',
      'A lump in the neck, hoarseness or trouble swallowing',
      'Severe upper-right abdominal pain',
      'New or worsening depression or thoughts of self-harm',
      'Sudden vision changes',
    ],
    postCycleNotes: 'Continuous therapy, not cycled. Carries the class boxed warning for thyroid C-cell tumours; contraindicated with a personal or family history of medullary thyroid carcinoma or MEN 2.',
    dosing: {
      protocol: [
        'Ladder: 3 → 7 → 14 → 25mg, 30 days minimum per step',
        'Empty stomach, at most 120mL plain water, wait 30 minutes before anything else',
        '25mg is the weight-management maintenance dose; Rybelsus (diabetes) stops at 14mg',
      ],
    },
    commonMistakes: [
      'Taking it with food or coffee, which sharply reduces absorption',
      'Confusing it with orforglipron, which has no fasting requirement',
      'Converting a dose between the oral tablet and the weekly injection — they are not interchangeable',
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
