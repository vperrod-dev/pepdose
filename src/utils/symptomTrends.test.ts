import { describe, it, expect } from 'vitest';
import { symptomTrends } from './symptomTrends';
import type { DoseLog } from '../db/schema';

const log = (date: string, symptoms: { name: string; severity: number }[]): DoseLog => ({
  id: date + Math.random(), owner: 'Victor', protocolId: 'p', peptideId: 'retatrutide',
  date, time: '20:00', dose: 8, unit: 'mg', route: 'subq', symptoms, createdAt: '',
});

describe('symptomTrends', () => {
  it('aggregates count, average and max per symptom', () => {
    const t = symptomTrends([
      log('2026-01-01', [{ name: 'Nausea', severity: 6 }, { name: 'Fatigue', severity: 3 }]),
      log('2026-01-08', [{ name: 'Nausea', severity: 8 }]),
    ]);
    const nausea = t.find(x => x.name === 'Nausea')!;
    expect(nausea.count).toBe(2);
    expect(nausea.avgSeverity).toBe(7);
    expect(nausea.maxSeverity).toBe(8);
    expect(nausea.points).toHaveLength(2);
  });

  it('keeps the worst severity per day', () => {
    const t = symptomTrends([
      log('2026-01-01', [{ name: 'Nausea', severity: 4 }]),
      log('2026-01-01', [{ name: 'Nausea', severity: 9 }]),
    ]);
    const nausea = t.find(x => x.name === 'Nausea')!;
    expect(nausea.points).toHaveLength(1);
    expect(nausea.points[0].severity).toBe(9);
  });

  it('sorts by frequency then severity, and ignores empty/zero entries', () => {
    const t = symptomTrends([
      log('2026-01-01', [{ name: 'Nausea', severity: 5 }, { name: 'Headache', severity: 2 }]),
      log('2026-01-02', [{ name: 'Nausea', severity: 5 }, { name: '', severity: 5 }]),
      log('2026-01-03', [{ name: 'Fatigue', severity: 0 }]),
    ]);
    expect(t[0].name).toBe('Nausea'); // most frequent
    expect(t.find(x => x.name === '')).toBeUndefined();
    expect(t.find(x => x.name === 'Fatigue')).toBeUndefined(); // zero severity dropped
  });

  it('returns empty for logs with no symptoms', () => {
    expect(symptomTrends([log('2026-01-01', [])])).toEqual([]);
  });
});
