import { describe, it, expect } from 'vitest';
import { computeProgressSummary } from './progressSummary';
import type { HealthMarker } from '../db/schema';

function marker(date: string, extra: Partial<HealthMarker>): HealthMarker {
  return { id: date, owner: 'Victor', date, createdAt: date, ...extra };
}

const METRICS = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
];

describe('computeProgressSummary', () => {
  it('computes first, last and delta per metric with data', () => {
    const markers = [
      marker('2026-06-01', { weight: 84, measurements: { waist: 92 } }),
      marker('2026-06-15', { weight: 82 }),
      marker('2026-07-01', { weight: 80, measurements: { waist: 86 } }),
    ];
    const result = computeProgressSummary(markers, METRICS, '2026-06-01');
    expect(result).toEqual([
      { key: 'weight', label: 'Weight', unit: 'kg', first: 84, last: 80, delta: -4, count: 3 },
      { key: 'waist', label: 'Waist', unit: 'cm', first: 92, last: 86, delta: -6, count: 2 },
    ]);
  });

  it('excludes markers before the cutoff', () => {
    const markers = [
      marker('2026-05-01', { weight: 90 }),
      marker('2026-07-01', { weight: 80 }),
    ];
    const [entry] = computeProgressSummary(markers, METRICS, '2026-06-01');
    expect(entry).toMatchObject({ first: 80, last: 80, delta: 0, count: 1 });
  });
});
