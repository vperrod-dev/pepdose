import { describe, it, expect } from 'vitest';
import { generateSchedule } from './scheduleEngine';

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
