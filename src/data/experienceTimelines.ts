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

export interface PeptideExperience {
  peptideId: string;
  weeklyGuide: WeekGuide[];
  sideEffects: SideEffect[];
  redFlags: string[];
  postCycleNotes: string;
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
        description: 'The ceiling. Users at 12mg report the strongest appetite suppression and fastest loss (15-25% at 6-12 months), but side effects are at their most intense. Community advice: if you\'re losing well at a lower dose, stay there — faster titration correlates with worse side effects, and most people never need the full 12mg.',
        tips: ['Not everyone needs this — many plateau happily at 6–8mg', 'Side-effect management becomes essential at this dose', 'Watch for gallbladder symptoms during rapid loss — a real risk per community reports', 'Plan your exit strategy — appetite returns after stopping, so build habits now'],
      },
    ],
    sideEffects: [
      { name: 'Nausea', severity: 'normal', likelihood: 'common', onset: 'Each dose step-up', duration: '3-7 days', notes: 'The #1 Reddit complaint. Milder than sema for most users. Worse with fast food and fatty meals.' },
      { name: '"Sulfur burps"', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Variable', notes: 'Community hallmark of all GLP-1 drugs. Egg-like burps. Worse with greasy food. Some users find ginger helps.' },
      { name: 'Appetite gone / food aversion', severity: 'normal', likelihood: 'common', onset: 'Week 1+', duration: 'Ongoing', notes: 'Desired effect but can become problematic. Reddit users warn: force yourself to eat protein even when not hungry.' },
      { name: 'Fatigue', severity: 'normal', likelihood: 'common', onset: 'Weeks 1-4', duration: 'Usually transient', notes: 'Very commonly discussed. Usually resolves as body adapts. May be caloric deficit related.' },
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
    postCycleNotes: 'Not FDA-approved (TRIUMPH Phase 3 ongoing). Reddit consensus: appetite and weight return after stopping, similar to other GLP-1s. Community advice: build exercise habits and protein-focused diet during treatment so you keep those after. Some users cycle on/off. Discuss long-term plan with provider.',
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
      'Persistent metallic taste that won\'t go away (copper toxicity — stop immediately)',
      'Injection site abscess or spreading infection (not just redness — actual heat/pus)',
      'Severe nausea or abdominal pain',
      'Yellow skin or eyes (liver — get bloodwork)',
    ],
    postCycleNotes: 'Collagen remodeling is structural — benefits persist well after stopping. Community protocol: 4-8 weeks off, then 2-3x/week maintenance. Monitor copper levels with bloodwork if running multiple cycles back-to-back. Users report skin quality holds for months post-cycle.',
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
];

export function getExperienceForPeptide(peptideId: string): PeptideExperience | undefined {
  return EXPERIENCE_DATA.find(e => e.peptideId === peptideId);
}

export function getCurrentWeekGuide(peptideId: string, currentWeek: number): WeekGuide | undefined {
  const exp = getExperienceForPeptide(peptideId);
  if (!exp) return undefined;
  return exp.weeklyGuide.find(g => currentWeek >= g.weekStart && currentWeek <= g.weekEnd);
}
