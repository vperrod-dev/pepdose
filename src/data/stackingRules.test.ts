import { describe, it, expect } from 'vitest';
import { getStackingInfo, getStackWarnings } from './stackingRules';

describe('getStackingInfo', () => {
  it('contraindicates two injectable GLP-1 agonists', () => {
    expect(getStackingInfo('semaglutide', 'tirzepatide')?.relation).toBe('contraindicated');
  });

  it('contraindicates an oral GLP-1 stacked with an injectable one', () => {
    expect(getStackingInfo('orforglipron', 'semaglutide')?.relation).toBe('contraindicated');
  });

  it('contraindicates the same drug taken by two routes', () => {
    expect(getStackingInfo('oral-semaglutide', 'semaglutide')?.relation).toBe('contraindicated');
  });

  it('matches a pair regardless of argument order', () => {
    expect(getStackingInfo('tirzepatide', 'orforglipron')?.relation).toBe('contraindicated');
  });

  it('prefers the specific note over the generic GLP-1 one', () => {
    expect(getStackingInfo('cagrisema', 'semaglutide')?.note).toContain('already contains semaglutide');
  });

  it('leaves an amylin analogue and a GLP-1 agonist as caution, not contraindicated', () => {
    expect(getStackingInfo('cagrilintide', 'semaglutide')?.relation).toBe('caution');
  });
});

describe('getStackWarnings', () => {
  it('reports the contraindicated pair in a three-peptide protocol', () => {
    const warnings = getStackWarnings(['bpc-157', 'retatrutide', 'mazdutide']);
    expect(warnings.map(w => w.relation)).toEqual(['contraindicated']);
  });

  it('returns nothing for a stack with no cautions', () => {
    expect(getStackWarnings(['bpc-157', 'tb-500'])).toEqual([]);
  });
});
