import { describe, it, expect } from 'vitest';
import { planDoseDedupe } from './dedupeDoses';
import type { ScheduledDose, UserProtocol } from '../db/schema';

const dose = (id: string, amount: number, status: ScheduledDose['status'] = 'upcoming'): ScheduledDose => ({
  id, owner: 'Victor', protocolId: 'p1', peptideId: 'mots-c',
  date: '2026-08-20', time: '08:00', dose: amount, unit: 'mg',
  route: 'subq', status, weekNumber: 1,
});

const protocol = (amount: number): UserProtocol => ({
  id: 'p1', owner: 'Victor', name: 'MOTS-c', peptideIds: ['mots-c'],
  doses: [{ peptideId: 'mots-c', dose: amount, unit: 'mg', frequency: 'eod', timeOfDay: 'morning' }],
  startDate: '2026-07-01', durationWeeks: 12, status: 'active',
  createdAt: '2026-07-01', updatedAt: '2026-07-01',
});

describe('planDoseDedupe', () => {
  it('leaves a single dose alone', () => {
    expect(planDoseDedupe([dose('a', 5)], [protocol(5)])).toEqual([]);
  });

  it('keeps the copy matching the protocol dose and drops the stale ones', () => {
    const doses = [dose('old1', 2.5), dose('old2', 2.5), dose('current', 5)];
    expect(planDoseDedupe(doses, [protocol(5)]).sort()).toEqual(['old1', 'old2']);
  });

  it('never drops a dose that was already logged', () => {
    const doses = [dose('logged', 2.5, 'logged'), dose('spare', 5)];
    expect(planDoseDedupe(doses, [protocol(5)])).toEqual(['spare']);
  });

  it('never drops a missed dose', () => {
    const doses = [dose('missed', 2.5, 'missed'), dose('missed2', 2.5, 'missed')];
    expect(planDoseDedupe(doses, [protocol(5)])).toEqual([]);
  });

  it('keeps one copy when none matches the current protocol dose', () => {
    const doses = [dose('a', 2.5), dose('b', 2.5)];
    expect(planDoseDedupe(doses, [protocol(5)])).toEqual(['a']);
  });

  it('treats a second daily injection as its own dose, not a duplicate', () => {
    const evening = { ...dose('evening', 5), time: '22:00' };
    expect(planDoseDedupe([dose('morning', 5), evening], [protocol(5)])).toEqual([]);
  });

  it('keeps doses of different protocols on the same day apart', () => {
    const other = { ...dose('other', 5), protocolId: 'p2' };
    expect(planDoseDedupe([dose('mine', 5), other], [protocol(5)])).toEqual([]);
  });
});
