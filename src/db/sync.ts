import { getDB, type DeletionRecord } from './schema';
import { supabase, cloudEnabled } from './supabase';

// Cloud sync: bidirectional union-merge between local IndexedDB and Supabase.
//
// Safety invariant (Victor's #1 requirement): sync NEVER destructively wipes a
// side. A row present on only one side is copied to the other — never deleted.
// When both sides have a row, the newer `updatedAt`/`createdAt` wins (LWW).
// So logging in on an empty device can never erase the device that has the data.
//
// Deletes are explicit, never inferred from absence: every local delete writes a
// `deletions` ledger entry (db/schema.ts DeletionRecord), which syncNow pushes as
// a `deleted: true` tombstone and then prunes. Remote tombstones written by
// ledger-aware clients (marked `data._ledger`) delete the local row when newer
// (a later local re-edit still wins, LWW). Legacy tombstones — created by the old
// absence heuristic, which wrongly tombstoned the whole cloud on a fresh device's
// first pull — carry no marker and are never allowed to delete local data;
// instead the surviving local row is pushed back, repairing the cloud.

const KINDS = ['protocols', 'scheduledDoses', 'doseLogs', 'vials', 'healthMarkers', 'editHistory'] as const;

export interface Timestamped {
  id: string;
  updatedAt?: string;
  createdAt?: string;
  date?: string;
}

export interface RemoteRow {
  id: string;
  data: Timestamped & { _ledger?: number };
  updated_at: string;
  deleted: boolean;
}

export function rowTs(row: Timestamped): number {
  const raw = row.updatedAt ?? row.createdAt ?? row.date;
  const n = raw ? Date.parse(raw) : 0;
  return Number.isNaN(n) ? 0 : n;
}

/** Pure union-merge decision for one record kind. Never drops a live row from
 *  either side on its own authority — local deletes only happen for a remote
 *  tombstone written by a ledger-aware client (`data._ledger`) that is newer
 *  than the local row. `push` = local rows the cloud should take; `localPut` =
 *  cloud rows the device should take; `localDelete` = local ids a newer remote
 *  tombstone removes; `pushTombstone` = ledger entries to publish as tombstones;
 *  `ledgerResolved` = ledger ids settled without a push (remote re-edit won or
 *  tombstone already in cloud). */
export function planMerge(
  localRows: Timestamped[],
  remoteRows: RemoteRow[],
  localDeletions: DeletionRecord[] = [],
): {
  push: Timestamped[];
  localPut: Timestamped[];
  localDelete: string[];
  pushTombstone: DeletionRecord[];
  ledgerResolved: string[];
} {
  const local = new Map(localRows.map((r) => [r.id, r]));
  const remote = new Map(remoteRows.map((r) => [r.id, r]));
  const ledger = new Map(localDeletions.map((d) => [d.id, d]));
  const ids = new Set<string>([...local.keys(), ...remote.keys(), ...ledger.keys()]);

  const push: Timestamped[] = [];
  const localPut: Timestamped[] = [];
  const localDelete: string[] = [];
  const pushTombstone: DeletionRecord[] = [];
  const ledgerResolved: string[] = [];

  for (const id of ids) {
    const l = local.get(id);
    const r = remote.get(id);
    const d = ledger.get(id);
    const lts = l ? rowTs(l) : -1;
    const rts = r ? Date.parse(r.updated_at) : -1;

    if (l && d) {
      // Row re-created locally after a delete — it's alive; drop the stale entry.
      ledgerResolved.push(id);
    }

    if (l && !r) {
      push.push(l);
    } else if (r && !l) {
      if (r.deleted) {
        if (d) ledgerResolved.push(id); // tombstone already in the cloud
      } else if (d) {
        if (Date.parse(d.deletedAt) > rts) pushTombstone.push(d);
        else { localPut.push(r.data); ledgerResolved.push(id); } // remote re-edit wins
      } else {
        localPut.push(r.data);
      }
    } else if (l && r) {
      if (r.deleted) {
        if (!r.data?._ledger) push.push(l); // legacy tombstone: never delete local — repair cloud
        else if (rts > lts) localDelete.push(id);
        else push.push(l); // local re-edit newer than the delete: resurrect
      } else if (lts > rts) {
        push.push(l);
      } else if (rts > lts) {
        localPut.push(r.data);
      }
    } else if (d) {
      // Deleted here, cloud never saw the row — publish the intent anyway.
      pushTombstone.push(d);
    }
  }

  return { push, localPut, localDelete, pushTombstone, ledgerResolved };
}

let running = false;

// Delta cursor: after a successful pass, later ticks fetch only remote rows with
// updated_at newer than the last sync (minus a clock-skew margin, since
// updated_at is stamped by whichever client pushed the row) and only consider
// local rows edited since then — plus any ids the remote delta mentions, so a
// remote edit/tombstone still meets its local counterpart in planMerge. An
// offline peer can upload rows stamped older than the cursor; a periodic full
// pass (FULL_SYNC_EVERY_MS) bounds how long such rows stay unseen.
const CLOCK_SKEW_MS = 5 * 60_000;
const FULL_SYNC_EVERY_MS = 60 * 60_000;
let cursor: { userId: string; since: number; lastFull: number } | null = null;

/** Force the next syncNow to do a full pass (manual sync button; tests). */
export function resetSyncCursor() {
  cursor = null;
}

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
    const allDeletions: DeletionRecord[] = await db.getAll('deletions');
    const started = Date.now();
    const delta =
      cursor && cursor.userId === userId && started - cursor.lastFull < FULL_SYNC_EVERY_MS
        ? cursor.since - CLOCK_SKEW_MS
        : null;

    for (const kind of KINDS) {
      try {
      const allLocal: Timestamped[] = await db.getAll(kind);
      let query = supabase
        .from('records')
        .select('id,data,updated_at,deleted')
        .eq('kind', kind);
      if (delta !== null) query = query.gt('updated_at', new Date(delta).toISOString());
      const { data: remoteRows, error } = await query;
      if (error) throw error;

      const remote = (remoteRows ?? []) as RemoteRow[];
      const remoteIds = new Set(remote.map((r) => r.id));
      const localRows =
        delta === null
          ? allLocal
          : allLocal.filter((r) => rowTs(r) > delta || remoteIds.has(r.id));
      const deletions = allDeletions.filter((d) => d.kind === kind);
      const { push, localPut, localDelete, pushTombstone, ledgerResolved } =
        planMerge(localRows, remote, deletions);

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
      const ledgerDone = [...ledgerResolved];
      if (pushTombstone.length) {
        const tombstones = pushTombstone.map((d) => ({
          user_id: userId,
          kind,
          id: d.id,
          data: { id: d.id, _ledger: 1 },
          updated_at: d.deletedAt,
          deleted: true,
        }));
        const { error: delErr } = await supabase.from('records').upsert(tombstones);
        if (delErr) throw delErr;
        pushed += pushTombstone.length;
        ledgerDone.push(...pushTombstone.map((d) => d.id)); // prune only after the cloud has it
      }
      if (localPut.length || localDelete.length || ledgerDone.length) {
        const tx = db.transaction([kind, 'deletions'], 'readwrite');
        const store = tx.objectStore(kind);
        for (const row of localPut) await store.put(row);
        for (const id of localDelete) await store.delete(id);
        const ledgerStore = tx.objectStore('deletions');
        for (const id of ledgerDone) await ledgerStore.delete(id);
        await tx.done;
        pulled += localPut.length + localDelete.length;
      }
      } catch (e) {
        // One kind failing (e.g. a bad row rejected by Supabase) must not abort
        // the remaining kinds — collect and surface instead.
        const msg = `${kind}: ${e instanceof Error ? e.message : String(e)}`;
        console.error('[sync] ' + msg);
        errors.push(msg);
      }
    }

    if (!errors.length) {
      cursor = { userId, since: started, lastFull: delta !== null ? cursor!.lastFull : started };
    }
    return { pushed, pulled, errors };
  } finally {
    running = false;
  }
}
