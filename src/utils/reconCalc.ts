// Pure reconstitution math for the calculator (ReconCalculator.tsx).
// Extracted verbatim so the forward/reverse-BAC solve, unit conversion and
// blend breakdown are unit-testable; all inputs may be NaN (empty fields).

export type ReconMode = 'forward' | 'reverse';

export interface ReconInput {
  mode: ReconMode;
  vialMg: number;
  doseMg: number;
  /** forward mode: BAC water actually added (ml) */
  bacWaterMl: number;
  /** reverse mode: syringe unit mark to land the dose on */
  targetUnits: number;
  /** U-100 = 100 units/ml, U-40 = 40 */
  unitsPerMl: number;
}

export interface ReconResult {
  valid: boolean;
  /** reverse solve: water (ml) that puts the dose exactly on targetUnits */
  solvedWater: number;
  /** mg/ml */
  concentration: number;
  /** ml to draw per dose */
  volumeMl: number;
  /** syringe units to draw per dose */
  units: number;
  dosesPerVial: number;
}

export function doseToMg(dose: number, unit: 'mcg' | 'mg'): number {
  return dose > 0 ? (unit === 'mcg' ? dose / 1000 : dose) : 0;
}

/** Back-solve BAC water so the dose lands exactly on the target unit mark:
 *  water = targetUnits * vial / (unitsPerMl * doseMg). */
export function solveWater(vialMg: number, doseMg: number, targetUnits: number, unitsPerMl: number): number {
  return vialMg > 0 && doseMg > 0 && targetUnits > 0
    ? (targetUnits * vialMg) / (unitsPerMl * doseMg)
    : 0;
}

export function computeRecon(i: ReconInput): ReconResult {
  const solvedWater = solveWater(i.vialMg, i.doseMg, i.targetUnits, i.unitsPerMl);
  const water = i.mode === 'forward' ? i.bacWaterMl : solvedWater;
  const valid = i.mode === 'forward'
    ? i.vialMg > 0 && water > 0 && i.doseMg > 0
    : i.vialMg > 0 && i.doseMg > 0 && i.targetUnits > 0;
  const concentration = valid && water > 0 ? i.vialMg / water : 0;
  const volumeMl = valid && concentration > 0 ? i.doseMg / concentration : 0;
  const units = volumeMl * i.unitsPerMl;
  const dosesPerVial = valid && i.doseMg > 0 ? Math.floor(i.vialMg / i.doseMg) : 0;
  return { valid, solvedWater, concentration, volumeMl, units, dosesPerVial };
}

/** Per-component mg of one dose for a blend (ratio fixed regardless of vial size). */
export function blendBreakdown(
  components: { name: string; mg: number }[],
  doseMg: number,
): { name: string; mg: number }[] {
  const total = components.reduce((s, c) => s + c.mg, 0);
  return total > 0 ? components.map((c) => ({ name: c.name, mg: (c.mg / total) * doseMg })) : [];
}
