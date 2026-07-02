import { describe, it, expect } from 'vitest';
import { pruneMeasurements } from './measurements';

describe('pruneMeasurements', () => {
  it('keeps numeric fields and drops blank/invalid ones', () => {
    const result = pruneMeasurements({ waist: '84', chest: '', armL: 'abc', hips: '95.5' });
    expect(result).toEqual({ waist: 84, hips: 95.5 });
  });

  it('returns undefined when no valid measurements are entered', () => {
    expect(pruneMeasurements({ waist: '', chest: '  ' })).toBeUndefined();
  });
});
