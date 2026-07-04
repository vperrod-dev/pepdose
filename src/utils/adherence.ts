import { format, subDays, parseISO } from 'date-fns';
import type { ScheduledDose } from '../db/schema';

export interface AdherenceStats {
  /** Consecutive days (ending today) where every *due* dose was logged. */
  streak: number;
  /** Doses logged in the last 7 days. */
  logged7: number;
  /** Doses that were due (logged or missed or past-upcoming) in the last 7 days. */
  due7: number;
}

type DayRoll = { total: number; logged: number; dueUnlogged: number };

/**
 * Adherence over a set of scheduled doses. A dose is "due" if it's logged,
 * missed, or an upcoming dose whose date is already in the past. Intentionally
 * skipped doses are neutral (excluded from both streak and the ratio).
 */
export function adherenceStats(scheduled: ScheduledDose[], today: Date = new Date()): AdherenceStats {
  const todayStr = format(today, 'yyyy-MM-dd');
  const byDate = new Map<string, DayRoll>();
  let earliest = todayStr;

  for (const d of scheduled) {
    const roll = byDate.get(d.date) ?? { total: 0, logged: 0, dueUnlogged: 0 };
    const isLogged = d.status === 'logged';
    const isPastUpcoming = d.status === 'upcoming' && d.date < todayStr;
    const isDue = isLogged || d.status === 'missed' || isPastUpcoming;
    if (isDue) {
      roll.total += 1;
      if (isLogged) roll.logged += 1;
      else roll.dueUnlogged += 1;
    }
    byDate.set(d.date, roll);
    if (d.date < earliest) earliest = d.date;
  }

  // Weekly ratio: last 7 days including today.
  let logged7 = 0, due7 = 0;
  for (let i = 0; i < 7; i++) {
    const ds = format(subDays(today, i), 'yyyy-MM-dd');
    const roll = byDate.get(ds);
    if (roll) { logged7 += roll.logged; due7 += roll.total; }
  }

  // Streak: walk back from today. A day with due doses passes only if all were
  // logged; a day with no due doses bridges (neither counts nor breaks). Stop on
  // the first failing day or once we pass the earliest scheduled date.
  let streak = 0;
  const earliestTs = parseISO(earliest).getTime();
  for (let i = 0; i < 400; i++) {
    const day = subDays(today, i);
    if (day.getTime() < earliestTs) break;
    const roll = byDate.get(format(day, 'yyyy-MM-dd'));
    if (!roll || roll.total === 0) continue;         // bridge day
    if (roll.dueUnlogged > 0) break;                 // a due dose wasn't logged
    streak += 1;                                     // all due doses logged
  }

  return { streak, logged7, due7 };
}
