import { parseISO, addDays } from 'date-fns';
import type { UserProtocol, ScheduledDose } from '../db/schema';

export interface WeekSegment {
  /** 1-based week number within the protocol. */
  week: number;
  /** Number of scheduled doses that week (0 = off week). */
  count: number;
  /** Peptide ids with a dose that week (deduped, stable order). */
  peptides: string[];
  /** Representative dose for the week — the dose of a titration step-up if any, else the max dose. */
  dose?: number;
  unit?: 'mcg' | 'mg' | 'IU';
  /** True if any dose that week is flagged as a titration step-up vs the previous on-week. */
  isStepUp: boolean;
  /** True if this week falls within an explicitly scheduled break (off-cycle). */
  isBreak: boolean;
  logged: number;
  missed: number;
  skipped: number;
  upcoming: number;
}

export interface ProtocolTimeline {
  protocol: UserProtocol;
  /** Weeks 1..durationWeeks, index 0 = week 1. */
  weeks: WeekSegment[];
  /** Weeks from the global timeline start to this protocol's start (for shared-axis alignment). */
  startOffset: number;
  /** Peak weekly dose count across the protocol — used to normalise fill intensity. */
  peakPerWeek: number;
}

export interface TimelineModel {
  /** Earliest protocol start date on the shared axis. */
  start: Date;
  /** Latest protocol end date on the shared axis. */
  end: Date;
  /** Total number of week columns across all protocols. */
  totalWeeks: number;
  protocols: ProtocolTimeline[];
  /** Week-column index (0-based from global start) for "today", or -1 if outside range. */
  todayIndex: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Index of the week a dose falls in, relative to the protocol's start date (1-based). */
export function weekIndexOfDose(dose: ScheduledDose, protocolStartISO: string): number {
  const start = parseISO(protocolStartISO);
  const d = parseISO(dose.date);
  const diffDays = Math.floor((d.getTime() - start.getTime()) / MS_PER_DAY);
  return Math.floor(diffDays / 7) + 1;
}

function blankWeek(week: number): WeekSegment {
  return { week, count: 0, peptides: [], isStepUp: false, isBreak: false, logged: 0, missed: 0, skipped: 0, upcoming: 0 };
}

function buildProtocolTimeline(
  protocol: UserProtocol,
  doses: ScheduledDose[],
  globalStart: Date,
): ProtocolTimeline {
  const startOffset = Math.max(0, Math.floor(
    (parseISO(protocol.startDate).getTime() - globalStart.getTime()) / MS_PER_DAY / 7,
  ));

  const weeks: WeekSegment[] = [];
  for (let w = 1; w <= protocol.durationWeeks; w++) weeks.push(blankWeek(w));

  for (const dose of doses) {
    const w = weekIndexOfDose(dose, protocol.startDate);
    if (w < 1 || w > protocol.durationWeeks) continue;
    const seg = weeks[w - 1];
    seg.count += 1;
    if (!seg.peptides.includes(dose.peptideId)) seg.peptides.push(dose.peptideId);
    if (dose.status === 'logged') seg.logged += 1;
    else if (dose.status === 'missed') seg.missed += 1;
    else if (dose.status === 'skipped') seg.skipped += 1;
    else seg.upcoming += 1;
    if (dose.isTitrationStepUp) seg.isStepUp = true;
    // Representative dose: prefer a step-up dose, else the highest seen this week.
    if (seg.dose === undefined || dose.dose > seg.dose) {
      seg.dose = dose.dose;
      seg.unit = dose.unit;
    }
  }

  // Mark explicitly scheduled break weeks.
  if (protocol.breaks) {
    for (const brk of protocol.breaks) {
      for (let w = brk.weekStart; w <= brk.weekEnd; w++) {
        if (w >= 1 && w <= protocol.durationWeeks) weeks[w - 1].isBreak = true;
      }
    }
  }

  // isTitrationStepUp on the scheduled doses already flags step-up weeks directly.

  const peakPerWeek = weeks.reduce((m, s) => Math.max(m, s.count), 0);

  return { protocol, weeks, startOffset, peakPerWeek };
}

/**
 * Build a shared-axis timeline model from active protocols and their scheduled doses.
 * `today` is injectable for pure/testing purposes (defaults to now).
 */
export function buildTimeline(
  protocols: UserProtocol[],
  dosesByProtocol: Map<string, ScheduledDose[]>,
  today: Date = new Date(),
): TimelineModel {
  if (protocols.length === 0) {
    return { start: today, end: today, totalWeeks: 1, protocols: [], todayIndex: 0 };
  }

  let globalStart = parseISO(protocols[0].startDate);
  let globalEnd = globalStart;
  for (const p of protocols) {
    const start = parseISO(p.startDate);
    const end = addDays(start, p.durationWeeks * 7 - 1);
    if (start < globalStart) globalStart = start;
    if (end > globalEnd) globalEnd = end;
  }

  const totalWeeks = Math.floor(
    (globalEnd.getTime() - globalStart.getTime()) / MS_PER_DAY / 7,
  ) + 1;

  const built = protocols.map(p => buildProtocolTimeline(p, dosesByProtocol.get(p.id) ?? [], globalStart));

  const todayIdx = Math.floor(
    (today.getTime() - globalStart.getTime()) / MS_PER_DAY / 7,
  );
  const todayIndex = todayIdx >= 0 && todayIdx < totalWeeks ? todayIdx : -1;

  return { start: globalStart, end: globalEnd, totalWeeks, protocols: built, todayIndex };
}

/** ISO date (yyyy-MM-dd) of the Monday-ish start of week column `index` (0-based from global start). */
export function weekColumnDate(globalStart: Date, index: number): Date {
  return addDays(globalStart, index * 7);
}
