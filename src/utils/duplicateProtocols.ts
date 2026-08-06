import type { DoseLog, UserProtocol } from '../db/schema';
import type { UserName } from '../data/users';

export interface DuplicateGroup {
  peptideId: string;
  /** Both profiles share the doseLogs/protocols stores — a group never spans owners. */
  owner: UserName;
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
 *
 * Grouping is scoped to `owner` — Victor and Nadia share the same IndexedDB
 * stores, so without this a "duplicate" group could pair one profile's real,
 * only protocol for a peptide with the other profile's protocol of the same
 * peptide, and cleanup would delete the other profile's non-duplicate data.
 */
export function findDuplicateProtocols(protocols: UserProtocol[], logs: DoseLog[]): DuplicateGroup[] {
  const lastLogged: Record<string, string | undefined> = {};
  for (const log of logs) {
    if (!log.protocolId) continue;
    const seen = lastLogged[log.protocolId];
    if (!seen || log.date > seen) lastLogged[log.protocolId] = log.date;
  }

  const byOwnerPeptide = new Map<string, { owner: UserName; peptideId: string; protocols: UserProtocol[] }>();
  for (const proto of protocols) {
    if (proto.status === 'completed' || proto.status === 'archived') continue;
    for (const peptideId of new Set(proto.peptideIds)) {
      const key = `${proto.owner}:${peptideId}`;
      const entry = byOwnerPeptide.get(key) ?? { owner: proto.owner, peptideId, protocols: [] };
      entry.protocols.push(proto);
      byOwnerPeptide.set(key, entry);
    }
  }

  const groups: DuplicateGroup[] = [];
  for (const { owner, peptideId, protocols: group } of byOwnerPeptide.values()) {
    if (group.length < 2) continue;
    const ranked = [...group].sort((a, b) =>
      (lastLogged[b.id] ?? '').localeCompare(lastLogged[a.id] ?? '') ||
      b.startDate.localeCompare(a.startDate),
    );
    groups.push({
      peptideId,
      owner,
      protocols: ranked,
      keepId: ranked[0].id,
      lastLoggedByProtocol: Object.fromEntries(group.map(p => [p.id, lastLogged[p.id]])),
    });
  }
  return groups;
}
