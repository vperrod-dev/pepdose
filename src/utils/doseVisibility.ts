import type { ScheduledDose } from '../db/schema';

/**
 * Day views (dashboard, calendar, quick log) show a dose only while its protocol
 * is still active. Pausing or finishing a protocol left its future injections on
 * the calendar, so restarting a peptide showed one entry per past attempt —
 * three MOTS-c rows on the same day for three runs of the same protocol.
 *
 * Only *upcoming* doses are hidden: anything already logged, skipped or missed
 * is history and stays visible whatever its protocol is doing now. Resuming a
 * paused protocol brings its upcoming doses straight back, no regeneration.
 */
export function withoutInactiveUpcoming<T extends Pick<ScheduledDose, 'protocolId' | 'status'>>(
  doses: T[],
  activeProtocolIds: Set<string>,
): T[] {
  return doses.filter(d => d.status !== 'upcoming' || activeProtocolIds.has(d.protocolId));
}
