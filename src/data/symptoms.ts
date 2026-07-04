import type { PeptideCategory } from './peptides';

export interface SymptomDef {
  name: string;
  /** Categories this symptom is most relevant to; used to surface it first. */
  categories?: PeptideCategory[];
}

// Curated list drawn from the experience research. GLP-1 / GH / healing-specific
// ones are tagged so the log form can surface the most relevant first.
export const SYMPTOMS: SymptomDef[] = [
  { name: 'Nausea', categories: ['glp1'] },
  { name: 'Vomiting', categories: ['glp1'] },
  { name: 'Diarrhea', categories: ['glp1'] },
  { name: 'Constipation', categories: ['glp1'] },
  { name: 'Sulfur burps', categories: ['glp1'] },
  { name: 'Appetite loss', categories: ['glp1'] },
  { name: 'Elevated heart rate', categories: ['glp1'] },
  { name: 'Dysesthesia (tingling)', categories: ['glp1', 'gh_secretagogue'] },
  { name: 'Fatigue', categories: ['glp1', 'gh_secretagogue', 'healing'] },
  { name: 'Headache' },
  { name: 'Insomnia', categories: ['glp1', 'nootropic'] },
  { name: 'Dizziness' },
  { name: 'Bloating', categories: ['glp1'] },
  { name: 'Water retention', categories: ['gh_secretagogue'] },
  { name: 'Numbness / carpal tunnel', categories: ['gh_secretagogue'] },
  { name: 'Flushing', categories: ['gh_secretagogue', 'sexual_health'] },
  { name: 'Low mood' },
  { name: 'Injection-site pain', categories: ['healing', 'cosmetic'] },
];

/** Order symptoms so the ones relevant to `category` come first. */
export function symptomsForCategory(category?: PeptideCategory): SymptomDef[] {
  if (!category) return SYMPTOMS;
  const relevant = SYMPTOMS.filter(s => s.categories?.includes(category));
  const rest = SYMPTOMS.filter(s => !s.categories?.includes(category));
  return [...relevant, ...rest];
}
