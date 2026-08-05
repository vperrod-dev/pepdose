import type { ScheduledDose, UserProtocol } from '../db/schema';

/**
 * Which scheduled doses to drop when the same injection exists more than once.
 *
 * Sync used to resurrect deleted doses (it timed a dose by its injection date,
 * so any future dose outranked the delete that removed it). Regenerating a
 * protocol therefore left the previous generation behind, and the calendar grew
 * one row per past edit — same peptide, same day, the old dose beside the new.
 *
 * Only *upcoming* rows are ever dropped: a dose that was logged, skipped or
 * missed is history and stays. Within a duplicate group the keeper is the one
 * matching the protocol's current dose, so what survives is the schedule the
 * protocol actually describes.
 */
export function planDoseDedupe(doses: ScheduledDose[], protocols: UserProtocol[]): string[] {
  const currentDose = new Map<string, number>();
  for (const proto of protocols) {
    for (const d of proto.doses) currentDose.set(`${proto.id}|${d.peptideId}`, d.dose);
  }

  const groups = new Map<string, ScheduledDose[]>();
  for (const dose of doses) {
    const key = `${dose.protocolId}|${dose.peptideId}|${dose.date}|${dose.time}`;
    groups.set(key, [...(groups.get(key) ?? []), dose]);
  }

  const remove: string[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const upcoming = group.filter(d => d.status === 'upcoming');
    if (upcoming.length === group.length) {
      const expected = currentDose.get(`${group[0].protocolId}|${group[0].peptideId}`);
      const keeper = upcoming.find(d => d.dose === expected) ?? upcoming[upcoming.length - 1];
      remove.push(...upcoming.filter(d => d.id !== keeper.id).map(d => d.id));
    } else {
      // Something in this group already happened — every untouched copy is spare.
      remove.push(...upcoming.map(d => d.id));
    }
  }
  return remove;
}
