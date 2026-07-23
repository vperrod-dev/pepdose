import { describe, it, expect } from 'vitest';
import { generateSchedule, extendSchedule, updateFutureDoses } from './scheduleEngine';
import type { ScheduledDose } from '../db/schema';

// Retatrutide ladder: wk1-4 = 2mg, wk5-8 = 4mg, ... (see data/peptides.ts)
const RETA = {
  peptideId: 'retatrutide',
  unit: 'mg' as const,
  frequency: 'weekly',
  timeOfDay: 'morning',
  startDate: '2026-01-05', // Monday
  durationWeeks: 8,
  protocolId: 'p1',
};

describe('titration dose scaling', () => {
  it('leaves the stock ladder unchanged when the start dose equals the first step', () => {
    const doses = generateSchedule({ ...RETA, dose: 2 });
    expect(doses[0].dose).toBe(2); // week 1
    expect(doses[4].dose).toBe(4); // week 5
  });

  it('scales the whole ladder to a gentler chosen start dose', () => {
    const doses = generateSchedule({ ...RETA, dose: 0.5 }); // quarter of the 2mg step
    expect(doses[0].dose).toBe(0.5); // week 1: 2 * 0.25
    expect(doses[4].dose).toBe(1); //   week 5: 4 * 0.25
  });
});

// Unknown peptide id -> no titration ladder, so frequency math is isolated.
const PLAIN = {
  peptideId: 'no-such-peptide',
  dose: 250,
  unit: 'mcg' as const,
  timeOfDay: 'morning',
  startDate: '2026-01-05', // Monday
  durationWeeks: 1,
  protocolId: 'p1',
};

describe('generateSchedule frequency branches', () => {
  it('daily emits one dose per day', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'daily' });
    expect(doses.map(d => d.date)).toEqual([
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11',
    ]);
  });

  it('daily with timesPerDay=2 emits morning and pre-bed doses', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'daily', timesPerDay: 2 });
    expect(doses.slice(0, 2).map(d => d.time)).toEqual(['08:00', '22:00']);
  });

  it('eod emits every other day', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'eod' });
    expect(doses.map(d => d.date)).toEqual(['2026-01-05', '2026-01-07', '2026-01-09', '2026-01-11']);
  });

  it('weekly emits one dose per week', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'weekly', durationWeeks: 3 });
    expect(doses.map(d => d.date)).toEqual(['2026-01-05', '2026-01-12', '2026-01-19']);
  });

  it('biweekly emits one dose every 14 days', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'biweekly', durationWeeks: 4 });
    expect(doses.map(d => d.date)).toEqual(['2026-01-05', '2026-01-19']);
  });

  it('custom emits on the chosen day interval', () => {
    const doses = generateSchedule({ ...PLAIN, frequency: 'custom', customFrequencyDays: 3 });
    expect(doses.map(d => d.date)).toEqual(['2026-01-05', '2026-01-08', '2026-01-11']);
  });

  it('custom without a day interval emits nothing', () => {
    expect(generateSchedule({ ...PLAIN, frequency: 'custom' })).toEqual([]);
  });

  it('non-positive durationWeeks emits nothing instead of throwing', () => {
    expect(generateSchedule({ ...PLAIN, frequency: 'daily', durationWeeks: 0 })).toEqual([]);
    expect(generateSchedule({ ...PLAIN, frequency: 'daily', durationWeeks: -2 })).toEqual([]);
  });

  it('custom with a negative day interval emits nothing instead of looping forever', () => {
    expect(generateSchedule({ ...PLAIN, frequency: 'custom', customFrequencyDays: -1 })).toEqual([]);
  });

  it('phased schedules follow each phase cadence and skip off weeks', () => {
    const doses = generateSchedule({
      ...PLAIN,
      frequency: 'daily',
      schedulePhases: [
        { weekStart: 1, weekEnd: 1, frequency: 'daily' },
        { weekStart: 3, weekEnd: 3, frequency: 'weekly' }, // week 2 is off
      ],
    });
    expect(doses.map(d => d.date)).toEqual([
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11',
      '2026-01-19',
    ]);
  });

  it('phased 5x_week skips weekends', () => {
    const doses = generateSchedule({
      ...PLAIN,
      frequency: 'daily',
      schedulePhases: [{ weekStart: 1, weekEnd: 1, frequency: '5x_week' }],
    });
    expect(doses.map(d => d.date)).toEqual([
      '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09',
    ]);
  });
});

const scheduled = (id: string, date: string, status: ScheduledDose['status'] = 'upcoming'): ScheduledDose => ({
  id,
  owner: 'Victor',
  protocolId: 'p1',
  peptideId: 'no-such-peptide',
  date,
  time: '08:00',
  dose: 250,
  unit: 'mcg',
  route: 'subq',
  status,
  weekNumber: 1,
});

describe('updateFutureDoses', () => {
  it('updates only upcoming doses on/after the pivot date', () => {
    const result = updateFutureDoses(
      [scheduled('a', '2026-01-05', 'logged'), scheduled('b', '2026-01-06'), scheduled('c', '2026-01-07')],
      '2026-01-06',
      { dose: 500 },
    );
    expect(result.map(d => d.dose)).toEqual([250, 500, 500]);
  });

  it('leaves past upcoming doses untouched', () => {
    const result = updateFutureDoses([scheduled('a', '2026-01-05')], '2026-01-06', { dose: 500 });
    expect(result[0].dose).toBe(250);
  });
});

describe('extendSchedule', () => {
  it('continues the day after the last existing dose', () => {
    const extra = extendSchedule(
      [scheduled('a', '2026-01-05'), scheduled('b', '2026-01-11')],
      1,
      { ...PLAIN, frequency: 'daily' },
    );
    expect(extra[0].date).toBe('2026-01-12');
  });

  it('adds the requested number of weeks', () => {
    const extra = extendSchedule([scheduled('a', '2026-01-11')], 1, { ...PLAIN, frequency: 'daily' });
    expect(extra).toHaveLength(7);
  });

  it('returns nothing when the peptide has no existing doses', () => {
    expect(extendSchedule([], 1, { ...PLAIN, frequency: 'daily' })).toEqual([]);
  });
});
