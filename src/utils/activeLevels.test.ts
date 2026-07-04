import { describe, it, expect } from 'vitest';
import { decayAt, levelAt, currentStatus, sampleLevels, type PeptideSeries } from './activeLevels';

const HOUR = 3_600_000;

describe('decayAt', () => {
  it('returns the full dose at t=0', () => {
    expect(decayAt(10, 24, 0)).toBe(10);
  });
  it('halves after one half-life', () => {
    expect(decayAt(10, 24, 24)).toBeCloseTo(5);
  });
  it('is zero for negative elapsed or bad half-life', () => {
    expect(decayAt(10, 24, -5)).toBe(0);
    expect(decayAt(10, 0, 5)).toBe(0);
  });
});

describe('levelAt', () => {
  const series: PeptideSeries = {
    peptideId: 'x',
    halfLifeHours: 24,
    events: [
      { ts: 0, dose: 10, future: false },
      { ts: 24 * HOUR, dose: 10, future: false },
    ],
  };
  it('ignores future events relative to t', () => {
    // at t=0 only the first dose counts
    expect(levelAt(series, 0)).toBeCloseTo(10);
  });
  it('sums overlapping doses', () => {
    // at t=24h: first dose decayed to 5 + second dose full 10 = 15
    expect(levelAt(series, 24 * HOUR)).toBeCloseTo(15);
  });
});

describe('currentStatus', () => {
  const now = 100 * HOUR;
  const series: PeptideSeries = {
    peptideId: 'x',
    halfLifeHours: 24,
    events: [
      { ts: 96 * HOUR, dose: 10, future: false }, // 4h ago
      { ts: 200 * HOUR, dose: 10, future: true },  // upcoming
    ],
  };
  it('reports last/next dose and reads rising within 6h of a shot', () => {
    const peak = 10;
    const s = currentStatus(series, now, peak);
    expect(s.lastDoseTs).toBe(96 * HOUR);
    expect(s.nextDoseTs).toBe(200 * HOUR);
    // dose was 4h ago; 6h ago the level was still 0, so net over the window it rose
    expect(s.rising).toBe(true);
    expect(s.pctOfPeak).toBeGreaterThan(0);
    expect(s.pctOfPeak).toBeLessThanOrEqual(100);
  });

  it('reads falling when coasting between doses', () => {
    const coasting: PeptideSeries = {
      peptideId: 'x',
      halfLifeHours: 24,
      events: [{ ts: 80 * HOUR, dose: 10, future: false }], // 20h ago, well past the 6h window
    };
    const s = currentStatus(coasting, now, 10);
    expect(s.rising).toBe(false);
  });
});

describe('sampleLevels', () => {
  it('produces points+1 rows and captures the peak', () => {
    const series: PeptideSeries[] = [
      { peptideId: 'x', halfLifeHours: 24, events: [{ ts: 0, dose: 10, future: false }] },
    ];
    const { rows, peaks } = sampleLevels(series, 0, 48 * HOUR, 10);
    expect(rows).toHaveLength(11);
    expect(peaks.x).toBeCloseTo(10); // peak is at t=0
  });
});
