import { describe, it, expect } from 'vitest';
import {
  computeRecon,
  solveWater,
  doseToMg,
  blendBreakdown,
  formatComponentDose,
  isOverfilledSyringe,
  isImpracticalWater,
  type ReconInput,
  type ReconMode,
} from './reconMath';

const forward = (over: Partial<ReconInput> = {}): ReconInput => ({
  mode: 'forward',
  vialMg: 5,
  doseMg: 0.25,
  bacWaterMl: 2,
  targetUnits: NaN,
  unitsPerMl: 100,
  ...over,
});

const reverse = (over: Partial<ReconInput> = {}): ReconInput => ({
  mode: 'reverse',
  vialMg: 5,
  doseMg: 0.25,
  bacWaterMl: NaN,
  targetUnits: 10,
  unitsPerMl: 100,
  ...over,
});

describe('doseToMg', () => {
  it('converts mcg to mg', () => {
    expect(doseToMg(250, 'mcg')).toBe(0.25);
  });

  it('passes mg through unchanged', () => {
    expect(doseToMg(2.5, 'mg')).toBe(2.5);
  });

  it('returns 0 for zero, negative or NaN doses', () => {
    expect(doseToMg(0, 'mcg')).toBe(0);
    expect(doseToMg(-5, 'mg')).toBe(0);
    expect(doseToMg(NaN, 'mcg')).toBe(0);
  });

  it('normalizes very large mcg values accurately', () => {
    expect(doseToMg(1_500_000, 'mcg')).toBe(1500);
  });

  it('normalizes very small mcg values accurately', () => {
    expect(doseToMg(1, 'mcg')).toBe(0.001);
  });
});

describe('unit conversion inconsistencies / constraints', () => {
  it('maps invalid dose inputs to 0 instead of preserving NaN', () => {
    expect(doseToMg(NaN, 'mg')).toBe(0);
    expect(doseToMg(NaN, 'mcg')).toBe(0);
    expect(doseToMg(Number.EPSILON, 'mcg')).toBeCloseTo(0, 10);
  });
});

describe('solveWater', () => {
  it('solves BAC water for standard reverse inputs', () => {
    // targetUnits * vialMg / (unitsPerMl * doseMg)
    expect(solveWater(5, 0.25, 10, 100)).toBe(2);
  });

  it('returns 0 when any input is non-positive, except unitsPerMl=0 produces Infinity due to reciprocal divide', () => {
    expect(solveWater(0, 0.25, 10, 100)).toBe(0);
    expect(solveWater(5, 0, 10, 100)).toBe(0);
    expect(solveWater(5, 0.25, -1, 100)).toBe(0);
    // NOTE: ambiguity in original inline/recon calc code: unitsPerMl=0 is not guarded,
    // causing division-by-zero => Infinity instead of 0.
    expect(solveWater(5, 0.25, 10, 0)).toBe(Infinity);
    expect(solveWater(5, 0.25, NaN, 100)).toBe(0);
  });

  it('scales correctly for U-40 syringes', () => {
    expect(solveWater(5, 0.25, 10, 40)).toBe(5);
  });
});

describe('computeRecon forward', () => {
  it('computes concentration, draw volume, units and doses/vial for basic values', () => {
    const r = computeRecon(forward());
    expect(r.valid).toBe(true);
    expect(r.concentration).toBeCloseTo(2.5, 10);
    expect(r.volumeMl).toBeCloseTo(0.1, 10);
    expect(r.units).toBeCloseTo(10, 10);
    expect(r.dosesPerVial).toBe(20);
  });

  it('is invalid when any required input is missing or non-positive', () => {
    expect(computeRecon(forward({ vialMg: NaN })).valid).toBe(false);
    expect(computeRecon(forward({ bacWaterMl: 0 })).valid).toBe(false);
    expect(computeRecon(forward({ doseMg: 0 })).valid).toBe(false);
  });

  it('returns all-zero derived values when invalid', () => {
    const r = computeRecon(forward({ vialMg: NaN }));
    expect(r).toMatchObject({
      solvedWater: 0,
      concentration: 0,
      volumeMl: 0,
      units: 0,
      dosesPerVial: 0,
    });
  });

  it('handles non-terminating concentration without floating drift', () => {
    const r = computeRecon(forward({ vialMg: 10, bacWaterMl: 3, doseMg: 1 }));
    expect(r.volumeMl).toBeCloseTo(0.3, 10);
    expect(r.units).toBeCloseTo(30, 10);
  });

  it('floors dosesPerVial when the dose does not divide the vial evenly', () => {
    expect(computeRecon(forward({ doseMg: 0.3 })).dosesPerVial).toBe(16);
  });
});

describe('computeRecon reverse', () => {
  it('solves the water that puts the dose exactly on the target unit mark', () => {
    expect(computeRecon(reverse()).solvedWater).toBe(2);
  });

  it('returns matching units when round-tripping solved water back in', () => {
    const r = computeRecon(reverse());
    const forwardMode = computeRecon({
      mode: 'forward',
      vialMg: r.solvedWater * 2.5,
      doseMg: 0.25,
      bacWaterMl: r.solvedWater,
      targetUnits: NaN,
      unitsPerMl: 100,
    });
    expect(forwardMode.units).toBeCloseTo(10, 10);
  });

  it('solves for U-40 syringes', () => {
    expect(computeRecon(reverse({ unitsPerMl: 40 })).solvedWater).toBe(5);
  });

  it('round-trips arbitrary decimal values cleanly', () => {
    const r = computeRecon(reverse({ vialMg: 7.3, doseMg: 0.417, targetUnits: 13 }));
    expect(r.units).toBeCloseTo(13, 10);
  });

  it('is invalid when target unit mark is non-positive', () => {
    expect(computeRecon(reverse({ targetUnits: 0 })).valid).toBe(false);
    expect(computeRecon(reverse({ targetUnits: NaN })).valid).toBe(false);
  });

  it('returns zeroed derived values when invalid', () => {
    const r = computeRecon(reverse({ targetUnits: 0 }));
    expect(r).toMatchObject({
      solvedWater: 0,
      concentration: 0,
      volumeMl: 0,
      units: 0,
      dosesPerVial: 0,
    });
  });
});

describe('formatComponentDose', () => {
  it('formats mg amounts in mg with two decimals', () => {
    expect(formatComponentDose(1.5)).toBe('1.50 mg');
  });

  it('formats sub-mg amounts in mcg as whole numbers', () => {
    expect(formatComponentDose(0.25)).toBe('250 mcg');
  });
});

describe('isOverfilledSyringe', () => {
  it('detects overflow above unitsPerMl', () => {
    expect(isOverfilledSyringe(101, 100)).toBe(true);
  });

  it('allows draws within syringe capacity', () => {
    expect(isOverfilledSyringe(100, 100)).toBe(false);
  });
});

describe('isImpracticalWater', () => {
  it('flags reverse draws with impractically small or large water volumes', () => {
    expect(isImpracticalWater(true, 'reverse', 0.1)).toBe(true);
    expect(isImpracticalWater(true, 'reverse', 10)).toBe(true);
    expect(isImpracticalWater(true, 'reverse', 0.5)).toBe(false);
    expect(isImpracticalWater(true, 'forward', 0.1)).toBe(false);
  });

  it('does not flag invalid calculations', () => {
    expect(isImpracticalWater(false, 'reverse', 0.1)).toBe(false);
  });
});

describe('blendBreakdown', () => {
  it('splits dose proportionally by fixed component ratio', () => {
    expect(blendBreakdown([{ name: 'A', mg: 30 }, { name: 'B', mg: 10 }], 4)).toEqual([
      { name: 'A', mg: 3 },
      { name: 'B', mg: 1 },
    ]);
  });

  it('returns empty array when component total is 0', () => {
    expect(blendBreakdown([{ name: 'A', mg: 0 }], 4)).toEqual([]);
  });
});

describe('Math edge boundaries and rounding notes', () => {
  const modes: ReconMode[] = ['forward', 'reverse'];

  modes.forEach((mode) => {
    it(`handles zero vialMg in ${mode} as invalid with all-zero outputs`, () => {
      const base = mode === 'forward' ? forward({ vialMg: 0 }) : reverse({ vialMg: 0 });
      const r = computeRecon(base);
      expect(r.valid).toBe(false);
      expect(r).toMatchObject({
        solvedWater: 0,
        concentration: 0,
        volumeMl: 0,
        units: 0,
        dosesPerVial: 0,
      });
    });

    it(`handles zero doseMg in ${mode} as invalid with all-zero outputs`, () => {
      const base = mode === 'forward' ? forward({ doseMg: 0 }) : reverse({ doseMg: 0 });
      const r = computeRecon(base);
      expect(r.valid).toBe(false);
      expect(r).toMatchObject({
        solvedWater: 0,
        concentration: 0,
        volumeMl: 0,
        units: 0,
        dosesPerVial: 0,
      });
    });
  });

  it('does not enforce an explicit upper bounding cap on values', () => {
    const r = computeRecon(forward({ vialMg: 1_000_000, bacWaterMl: 1, doseMg: 1_000_000 }));
    expect(r.valid).toBe(true);
    expect(r.concentration).toBeCloseTo(1_000_000, 10);
    expect(r.volumeMl).toBeCloseTo(1, 10);
  });

  it('exposes solvedWater even in forward mode without changing behavior', () => {
    const r = computeRecon(forward());
    expect(typeof r.solvedWater).toBe('number');
  });
});
