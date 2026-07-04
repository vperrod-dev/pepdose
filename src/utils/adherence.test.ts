import { describe, it, expect } from 'vitest';
import { adherenceStats } from './adherence';
import type { ScheduledDose } from '../db/schema';

const base: Omit<ScheduledDose, 'id' | 'date' | 'status'> = {
  owner: 'Victor', protocolId: 'p', peptideId: 'bpc-157', time: '08:00',
  dose: 250, unit: 'mcg', route: 'subq', weekNumber: 1,
};
const d = (date: string, status: ScheduledDose['status']): ScheduledDose =>
  ({ ...base, id: `${date}-${status}`, date, status });

// Fixed "today" so tests are deterministic.
const today = new Date('2026-01-10T12:00:00');

describe('adherenceStats', () => {
  it('counts a clean logged streak up to today', () => {
    const s = adherenceStats([
      d('2026-01-08', 'logged'),
      d('2026-01-09', 'logged'),
      d('2026-01-10', 'logged'),
    ], today);
    expect(s.streak).toBe(3);
    expect(s.logged7).toBe(3);
    expect(s.due7).toBe(3);
  });

  it('breaks the streak on a missed day', () => {
    const s = adherenceStats([
      d('2026-01-08', 'logged'),
      d('2026-01-09', 'missed'),
      d('2026-01-10', 'logged'),
    ], today);
    expect(s.streak).toBe(1); // only today
    expect(s.logged7).toBe(2);
    expect(s.due7).toBe(3);
  });

  it('bridges days with no scheduled doses without breaking', () => {
    const s = adherenceStats([
      d('2026-01-07', 'logged'),
      // 01-08, 01-09 nothing scheduled
      d('2026-01-10', 'logged'),
    ], today);
    expect(s.streak).toBe(2);
  });

  it('ignores skipped doses and today\'s not-yet-due upcoming', () => {
    const s = adherenceStats([
      d('2026-01-09', 'logged'),
      d('2026-01-10', 'upcoming'), // today, not yet due -> bridges
      d('2026-01-08', 'skipped'),  // neutral
    ], today);
    expect(s.streak).toBe(1); // 01-09 logged; 01-10 bridges; 01-08 skipped bridges
    expect(s.due7).toBe(1);
  });

  it('breaks on a past upcoming (never logged) dose', () => {
    const s = adherenceStats([
      d('2026-01-08', 'upcoming'), // past + never logged -> due, unlogged
      d('2026-01-10', 'logged'),
    ], today);
    expect(s.streak).toBe(1);
    expect(s.due7).toBe(2);
    expect(s.logged7).toBe(1);
  });
});
