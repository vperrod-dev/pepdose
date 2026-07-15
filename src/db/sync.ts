import { getDB } from './schema';
import { supabase, cloudEnabled } from './supabase';

// Cloud sync: bidirectional union-merge between local IndexedDB and Supabase.
//
// Safety invariant (Victor's #1 requirement): sync NEVER destructively wipes a
// side. A row present on only one side is copied to the other — never deleted.
// When both sides have a row, the newer `updatedAt`/`createdAt` wins (LWW).
// So logging in on an empty device can never erase the device that has the data.
//
// Deletes DO propagate: local deletions are pushed as `deleted: true` tombstones
// (see syncNow), and planMerge drops remote-deleted rows on pull. Resurrection of
// a row newer than a tombstone still wins (LWW), so a genuine re-edit survives.

const KINDS = ['protocols', 'scheduledDoses', 'doseLogs', 'vials', 'healthMarkers', 'editHistory'] as const;

export interface Timestamped {
  id: string;
  updatedAt?: string;
  createdAt?: string;
  date?: string;
}

export interface RemoteRow {
  id: string;
  data: Timestamped;
  updated_at: string;
  deleted: boolean;
}

export function rowTs(row: Timestamped): number {
  const raw = row.updatedAt ?? row.createdAt ?? row.date;
  const n = raw ? Date.parse(raw) : 0;
  return Number.isNaN(n) ? 0 : n;
}

/** Pure union-merge decision for one record kind. Never drops a row from either
 *  side. `push` = local rows the cloud should take; `localPut` = cloud rows the
 *  device should take. Newer timestamp wins ties are left untouched. */
export function planMerge(
  localRows: Timestamped[],
  remoteRows: RemoteRow[],
): { push: Timestamped[]; localPut: Timestamped[] } {
  const local = new Map(localRows.map((r) => [r.id, r]));
  const remote = new Map(remoteRows.map((r) => [r.id, r]));
  const ids = new Set<string>([...local.keys(), ...remote.keys()]);

  const push: Timestamped[] = [];
  const localPut: Timestamped[] = [];

  for (const id of ids) {
    const l = local.get(id);
    const r = remote.get(id);
    const lts = l ? rowTs(l) : -1;
    const rts = r ? Date.parse(r.updated_at) : -1;

    if (l && !r) {
      push.push(l);
    } else if (r && !l) {
      if (!r.deleted) localPut.push(r.data);
    } else if (l && r) {
      if (r.deleted) continue;
      if (lts > rts) push.push(l);
      else if (rts > lts) localPut.push(r.data);
    }
  }

  return { push, localPut };
}

let running = false;

/** Merge local <-> cloud. Returns counts (plus per-kind errors, if any), or
 *  null if cloud disabled / not signed in. */
export async function syncNow(): Promise<{ pushed: number; pulled: number; errors: string[] } | null> {
  if (!cloudEnabled || !supabase || running) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return null;

  running = true;
  try {
    const userId = session.user.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (await getDB()) as any;
    let pushed = 0;
    let pulled = 0;
    const errors: string[] = [];

    for (const kind of KINDS) {
      try {
      const localRows: Timestamped[] = await db.getAll(kind);
      const { data: remoteRows, error } = await supabase
        .from('records')
        .select('id,data,updated_at,deleted')
        .eq('kind', kind);
      if (error) throw error;

      const { push, localPut } = planMerge(localRows, (remoteRows ?? []) as RemoteRow[]);

      if (push.length) {
        const envelopes = push.map((row) => ({
          user_id: userId,
          kind,
          id: row.id,
          data: row,
          updated_at: new Date(rowTs(row) || Date.now()).toISOString(),
          deleted: false,
        }));
        const { error: upErr } = await supabase.from('records').upsert(envelopes);
        if (upErr) throw upErr;
        pushed += push.length;
      }
      // Propagate local deletes: any remote row absent locally becomes a tombstone.
      // planMerge already applies remote->local deletes; this closes the loop so a
      // protocol/dose deleted on one device is removed on the other.
      const localIds = new Set(localRows.map((r) => r.id));
      const deletes = (remoteRows ?? []).filter((r) => !localIds.has(r.id) && !r.deleted);
      if (deletes.length) {
        const tombstones = deletes.map((r) => ({
          user_id: userId,
          kind,
          id: r.id,
          data: r.data,
          updated_at: new Date().toISOString(),
          deleted: true,
        }));
        const { error: delErr } = await supabase.from('records').upsert(tombstones);
        if (delErr) throw delErr;
        pushed += deletes.length;
      }
      if (localPut.length) {
        const tx = db.transaction(kind, 'readwrite');
        for (const row of localPut) await tx.store.put(row);
        await tx.done;
        pulled += localPut.length;
      }
      } catch (e) {
        // One kind failing (e.g. a bad row rejected by Supabase) must not abort
        // the remaining kinds — collect and surface instead.
        const msg = `${kind}: ${e instanceof Error ? e.message : String(e)}`;
        console.error('[sync] ' + msg);
        errors.push(msg);
      }
    }

    return { pushed, pulled, errors };
  } finally {
    running = false;
  }
}
