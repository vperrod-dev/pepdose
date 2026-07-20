import { describe, it, expect } from 'vitest';
import { blendBreakdown, computeRecon, doseToMg, solveWater, type ReconInput } from './reconCalc';

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
});

describe('computeRecon forward (know water → find units)', () => {
  it('computes concentration, draw volume, units and doses/vial', () => {
    const r = computeRecon(forward()); // 5mg in 2ml, 0.25mg dose, U-100
    expect(r).toMatchObject({ valid: true, concentration: 2.5, volumeMl: 0.1, dosesPerVial: 20 });
    expect(r.units).toBeCloseTo(10, 10);
  });

  it('scales units to the syringe (U-40)', () => {
    expect(computeRecon(forward({ unitsPerMl: 40 })).units).toBeCloseTo(4, 10);
  });

  it('floors doses/vial for a dose that does not divide the vial evenly', () => {
    expect(computeRecon(forward({ doseMg: 0.3 })).dosesPerVial).toBe(16); // 5/0.3 = 16.67
  });

  it('handles a non-terminating concentration without drift', () => {
    const r = computeRecon(forward({ vialMg: 10, bacWaterMl: 3, doseMg: 1 })); // 3.333... mg/ml
    expect(r.volumeMl).toBeCloseTo(0.3, 10);
    expect(r.units).toBeCloseTo(30, 10);
  });

  it('is invalid when any input is missing (NaN) or non-positive', () => {
    expect(computeRecon(forward({ vialMg: NaN })).valid).toBe(false);
    expect(computeRecon(forward({ bacWaterMl: 0 })).valid).toBe(false);
    expect(computeRecon(forward({ doseMg: 0 })).valid).toBe(false);
  });

  it('returns all-zero results when invalid', () => {
    expect(computeRecon(forward({ vialMg: NaN }))).toMatchObject({
      concentration: 0, volumeMl: 0, units: 0, dosesPerVial: 0,
    });
  });
});

describe('computeRecon reverse (clean draw → find water)', () => {
  it('solves the water that puts the dose on the target unit mark', () => {
    expect(computeRecon(reverse()).solvedWater).toBe(2); // 10u * 5mg / (100 * 0.25mg)
  });

  it('solves for U-40 syringes', () => {
    expect(computeRecon(reverse({ unitsPerMl: 40 })).solvedWater).toBe(5);
  });

  it('round-trips: drawing the dose with the solved water lands exactly on the target mark', () => {
    const r = computeRecon(reverse({ vialMg: 7.3, doseMg: 0.417, targetUnits: 13 }));
    expect(r.units).toBeCloseTo(13, 10);
  });

  it('is invalid without a positive target unit mark', () => {
    expect(computeRecon(reverse({ targetUnits: 0 })).valid).toBe(false);
    expect(computeRecon(reverse({ targetUnits: NaN })).valid).toBe(false);
  });
});

describe('solveWater', () => {
  it('returns 0 when any input is non-positive', () => {
    expect(solveWater(0, 0.25, 10, 100)).toBe(0);
    expect(solveWater(5, 0, 10, 100)).toBe(0);
    expect(solveWater(5, 0.25, -1, 100)).toBe(0);
  });
});

describe('blendBreakdown', () => {
  it('splits the dose by the fixed component ratio', () => {
    const parts = blendBreakdown([{ name: 'A', mg: 30 }, { name: 'B', mg: 10 }], 4);
    expect(parts).toEqual([{ name: 'A', mg: 3 }, { name: 'B', mg: 1 }]);
  });

  it('returns no breakdown when the component total is 0', () => {
    expect(blendBreakdown([{ name: 'A', mg: 0 }], 4)).toEqual([]);
  });
});
