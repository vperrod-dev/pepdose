import { describe, it, expect } from 'vitest';
import { parseISO } from 'date-fns';
import { buildTimeline, weekIndexOfDose, type WeekSegment } from './protocolTimeline';
import type { UserProtocol, ScheduledDose } from '../db/schema';

function mkProtocol(overrides: Partial<UserProtocol>): UserProtocol {
  return {
    id: 'p1',
    owner: 'Victor',
    name: 'Test Protocol',
    peptideIds: ['pep-a'],
    doses: [],
    startDate: '2026-01-06',
    durationWeeks: 4,
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mkDose(overrides: Partial<ScheduledDose>): ScheduledDose {
  return {
    id: Math.random().toString(36).slice(2),
    owner: 'Victor',
    protocolId: 'p1',
    peptideId: 'pep-a',
    date: '2026-01-06',
    time: '08:00',
    dose: 1,
    unit: 'mg',
    route: 'subq',
    status: 'upcoming',
    weekNumber: 1,
    ...overrides,
  };
}

describe('weekIndexOfDose', () => {
  it('returns 1 for the start date', () => {
    expect(weekIndexOfDose(mkDose({ date: '2026-01-06' }), '2026-01-06')).toBe(1);
  });
  it('returns 2 for a dose 7 days later', () => {
    expect(weekIndexOfDose(mkDose({ date: '2026-01-13' }), '2026-01-06')).toBe(2);
  });
  it('returns 1 for day 6 (still within week 1)', () => {
    expect(weekIndexOfDose(mkDose({ date: '2026-01-11' }), '2026-01-06')).toBe(1);
  });
});

describe('buildTimeline', () => {
  it('buckets doses per week and counts statuses', () => {
    const proto = mkProtocol({ durationWeeks: 2 });
    const doses: ScheduledDose[] = [
      mkDose({ date: '2026-01-06', status: 'logged' }),
      mkDose({ date: '2026-01-07', status: 'logged' }),
      mkDose({ date: '2026-01-13', status: 'missed' }),
    ];
    const model = buildTimeline([proto], new Map([[proto.id, doses]]), parseISO('2026-01-10'));
    const pt = model.protocols[0];
    expect(pt.weeks[0].count).toBe(2);
    expect(pt.weeks[0].logged).toBe(2);
    expect(pt.weeks[1].count).toBe(1);
    expect(pt.weeks[1].missed).toBe(1);
  });

  it('treats weeks with no doses as off weeks (count 0)', () => {
    const proto = mkProtocol({ durationWeeks: 3 });
    const doses: ScheduledDose[] = [mkDose({ date: '2026-01-06' })];
    const model = buildTimeline([proto], new Map([[proto.id, doses]]));
    const pt = model.protocols[0];
    expect(pt.weeks[0].count).toBe(1);
    expect(pt.weeks[1].count).toBe(0);
    expect(pt.weeks[2].count).toBe(0);
  });

  it('flags titration step-up weeks from the dose flag', () => {
    const proto = mkProtocol({ durationWeeks: 2 });
    const doses: ScheduledDose[] = [
      mkDose({ date: '2026-01-06', isTitrationStepUp: false }),
      mkDose({ date: '2026-01-13', isTitrationStepUp: true, dose: 2 }),
    ];
    const model = buildTimeline([proto], new Map([[proto.id, doses]]));
    const pt = model.protocols[0];
    expect(pt.weeks[0].isStepUp).toBe(false);
    expect(pt.weeks[1].isStepUp).toBe(true);
    expect(pt.weeks[1].dose).toBe(2);
  });

  it('computes a shared axis spanning all protocols and offsets each', () => {
    const a = mkProtocol({ id: 'a', startDate: '2026-01-06', durationWeeks: 2 });
    const b = mkProtocol({ id: 'b', startDate: '2026-02-03', durationWeeks: 2 }); // 4 weeks later
    const model = buildTimeline([a, b], new Map());
    expect(model.totalWeeks).toBeGreaterThanOrEqual(2 + 4);
    const ptB = model.protocols.find(p => p.protocol.id === 'b')!;
    expect(ptB.startOffset).toBe(4);
  });

  it('locates today within the range, else -1', () => {
    const a = mkProtocol({ id: 'a', startDate: '2026-01-06', durationWeeks: 4 });
    const inside = buildTimeline([a], new Map(), parseISO('2026-01-13')); // week 2
    expect(inside.todayIndex).toBe(1);
    const outside = buildTimeline([a], new Map(), parseISO('2030-01-01'));
    expect(outside.todayIndex).toBe(-1);
  });

  it('returns an empty model for no protocols', () => {
    const model = buildTimeline([], new Map());
    expect(model.protocols).toHaveLength(0);
    expect(model.totalWeeks).toBe(1);
  });

  it('dedupes peptides within a week', () => {
    const proto = mkProtocol({ durationWeeks: 1, peptideIds: ['pep-a', 'pep-b'] });
    const doses: ScheduledDose[] = [
      mkDose({ peptideId: 'pep-a', date: '2026-01-06' }),
      mkDose({ peptideId: 'pep-b', date: '2026-01-06' }),
      mkDose({ peptideId: 'pep-a', date: '2026-01-07' }),
    ];
    const model = buildTimeline([proto], new Map([[proto.id, doses]]));
    const seg: WeekSegment = model.protocols[0].weeks[0];
    expect(seg.peptides).toHaveLength(2);
  });
});
