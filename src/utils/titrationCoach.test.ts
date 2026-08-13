import { describe, it, expect } from 'vitest';
import { nextTitrationStep } from './titrationCoach';
import type { ScheduledDose } from '../db/schema';

// Titration alerts are opt-in per protocol (UserProtocol.titrationAlerts): the
// dashboard filters the doses it hands to nextTitrationStep down to protocols
// that asked for them. These cases lock the coach's own contract, which the
// filtering relies on — a step-up only surfaces when it is upcoming and dated.
const dose = (over: Partial<ScheduledDose>): ScheduledDose => ({
  id: 'd1',
  owner: 'victor' as ScheduledDose['owner'],
  protocolId: 'p1',
  peptideId: 'reta',
  date: '2026-09-01',
  time: '08:00',
  dose: 4,
  unit: 'mg',
  route: 'subq',
  status: 'upcoming',
  weekNumber: 3,
  ...over,
});

describe('nextTitrationStep', () => {
  const today = new Date('2026-08-13T00:00:00Z');

  it('returns nothing when no dose is flagged as a step-up', () => {
    expect(nextTitrationStep([dose({ isTitrationStepUp: false })], today)).toBeNull();
  });

  it('returns nothing when the caller passes no doses at all', () => {
    // The opt-out path: the dashboard hands over an empty list when no protocol
    // has titrationAlerts on.
    expect(nextTitrationStep([], today)).toBeNull();
  });

  it('surfaces an upcoming step-up', () => {
    const step = nextTitrationStep([dose({ isTitrationStepUp: true })], today);
    expect(step?.dose).toBe(4);
  });

  it('ignores a step-up that has already been logged', () => {
    expect(
      nextTitrationStep([dose({ isTitrationStepUp: true, status: 'logged' })], today),
    ).toBeNull();
  });

  it('ignores a step-up dated in the past', () => {
    expect(
      nextTitrationStep([dose({ isTitrationStepUp: true, date: '2026-08-01' })], today),
    ).toBeNull();
  });

  it('picks the earliest upcoming step-up when several are pending', () => {
    const step = nextTitrationStep(
      [
        dose({ id: 'later', isTitrationStepUp: true, date: '2026-10-01', dose: 6 }),
        dose({ id: 'sooner', isTitrationStepUp: true, date: '2026-09-01', dose: 4 }),
      ],
      today,
    );
    expect(step?.dose).toBe(4);
  });
});
