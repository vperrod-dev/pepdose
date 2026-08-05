import type { DoseLog, UserProtocol } from '../db/schema';

export interface DuplicateGroup {
  peptideId: string;
  /** Every protocol scheduling this peptide, the suggested keeper first. */
  protocols: UserProtocol[];
  /** The one with the most recent logged dose — what the user is actually running. */
  keepId: string;
  lastLoggedByProtocol: Record<string, string | undefined>;
}

/**
 * Nothing ever stopped the same peptide being started twice, and each run keeps
 * scheduling its own injections — so a peptide restarted three times shows three
 * rows on every dose day. Groups those runs so the extras can be deleted.
 *
 * The keeper is the protocol with the most recent dose log (the one being
 * injected from); ties and never-logged protocols fall back to the latest start
 * date, so a freshly created protocol isn't proposed for deletion.
 */
export function findDuplicateProtocols(protocols: UserProtocol[], logs: DoseLog[]): DuplicateGroup[] {
  const lastLogged: Record<string, string | undefined> = {};
  for (const log of logs) {
    if (!log.protocolId) continue;
    const seen = lastLogged[log.protocolId];
    if (!seen || log.date > seen) lastLogged[log.protocolId] = log.date;
  }

  const byPeptide = new Map<string, UserProtocol[]>();
  for (const proto of protocols) {
    if (proto.status === 'completed' || proto.status === 'archived') continue;
    for (const peptideId of new Set(proto.peptideIds)) {
      byPeptide.set(peptideId, [...(byPeptide.get(peptideId) ?? []), proto]);
    }
  }

  const groups: DuplicateGroup[] = [];
  for (const [peptideId, group] of byPeptide) {
    if (group.length < 2) continue;
    const ranked = [...group].sort((a, b) =>
      (lastLogged[b.id] ?? '').localeCompare(lastLogged[a.id] ?? '') ||
      b.startDate.localeCompare(a.startDate),
    );
    groups.push({
      peptideId,
      protocols: ranked,
      keepId: ranked[0].id,
      lastLoggedByProtocol: Object.fromEntries(group.map(p => [p.id, lastLogged[p.id]])),
    });
  }
  return groups;
}
