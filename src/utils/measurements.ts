// Body measurement keys tracked alongside health markers. Fixed set, all in cm.

export const MEASUREMENT_KEYS = [
  'waist', 'chest', 'hips', 'shoulders', 'neck',
  'armL', 'armR', 'thighL', 'thighR', 'calfL', 'calfR',
] as const;

export type MeasurementKey = typeof MEASUREMENT_KEYS[number];

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  waist: 'Waist',
  chest: 'Chest',
  hips: 'Hips',
  shoulders: 'Shoulders',
  neck: 'Neck',
  armL: 'Arm (L)',
  armR: 'Arm (R)',
  thighL: 'Thigh (L)',
  thighR: 'Thigh (R)',
  calfL: 'Calf (L)',
  calfR: 'Calf (R)',
};

// Turn a form's raw string inputs into a clean measurements object, dropping
// blanks and non-numeric values. Returns undefined when nothing was entered so
// the field is omitted from the stored record entirely.
export function pruneMeasurements(
  raw: Record<string, string>,
): Record<string, number> | undefined {
  const out: Record<string, number> = {};
  for (const key of MEASUREMENT_KEYS) {
    const n = parseFloat(raw[key]);
    if (!Number.isNaN(n)) out[key] = n;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
