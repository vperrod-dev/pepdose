import { describe, it, expect } from 'vitest';
import { withoutInactiveUpcoming } from './doseVisibility';
import type { ScheduledDose } from '../db/schema';

const dose = (protocolId: string, status: ScheduledDose['status']) => ({ protocolId, status });

describe('withoutInactiveUpcoming', () => {
  it('keeps an upcoming dose whose protocol is active', () => {
    expect(withoutInactiveUpcoming([dose('a', 'upcoming')], new Set(['a']))).toHaveLength(1);
  });

  it('drops an upcoming dose from a paused or finished protocol', () => {
    expect(withoutInactiveUpcoming([dose('old', 'upcoming')], new Set(['a']))).toEqual([]);
  });

  it('keeps a logged dose after its protocol is finished', () => {
    expect(withoutInactiveUpcoming([dose('old', 'logged')], new Set(['a']))).toHaveLength(1);
  });

  it('keeps a missed dose after its protocol is finished', () => {
    expect(withoutInactiveUpcoming([dose('old', 'missed')], new Set(['a']))).toHaveLength(1);
  });

  it('shows one row per day when the same peptide was restarted three times', () => {
    const doses = [dose('run1', 'upcoming'), dose('run2', 'upcoming'), dose('run3', 'upcoming')];
    expect(withoutInactiveUpcoming(doses, new Set(['run3']))).toEqual([dose('run3', 'upcoming')]);
  });
});
