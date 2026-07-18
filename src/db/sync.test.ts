import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { planMerge, resetSyncCursor, rowTs, syncNow, type RemoteRow, type Timestamped } from './sync';
import { getDB } from './schema';
import { clearAllData } from './operations';

// In-memory Supabase double so syncNow's push/tombstone/error paths are testable.
interface Envelope { kind: string; id: string; deleted: boolean }
const cloud = vi.hoisted(() => ({
  remote: [] as { kind: string; id: string; data: { id: string; updatedAt?: string; _ledger?: number }; updated_at: string; deleted: boolean }[],
  upserted: [] as { kind: string; id: string; deleted: boolean }[],
  failKinds: new Set<string>(),
  queriedSince: [] as (string | null)[], // the .gt('updated_at', …) cursor of each select, null = full scan
}));

vi.mock('./supabase', () => ({
  cloudEnabled: true,
  supabase: {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }) },
    from: () => ({
      select: () => ({
        eq: (_col: string, kind: string) => {
          const run = (since: string | null) => {
            cloud.queriedSince.push(since);
            return cloud.failKinds.has(kind)
              ? { data: null, error: new Error(`${kind} boom`) }
              : { data: cloud.remote.filter((r) => r.kind === kind && (!since || r.updated_at > since)), error: null };
          };
          return {
            gt: async (_c: string, since: string) => run(since),
            then: (resolve: (v: unknown) => unknown) => resolve(run(null)),
          };
        },
      }),
      upsert: async (rows: Envelope[]) => {
        cloud.upserted.push(...rows);
        return { error: null };
      },
    }),
  },
}));

const remote = (id: string, ts: string, deleted = false): RemoteRow => ({
  id,
  // deleted=true here means a LEGACY tombstone (no _ledger marker).
  data: { id, updatedAt: ts },
  updated_at: ts,
  deleted,
});

const ledgerTombstone = (id: string, ts: string): RemoteRow => ({
  id,
  data: { id, _ledger: 1 },
  updated_at: ts,
  deleted: true,
});

describe('rowTs', () => {
  it('prefers updatedAt over createdAt', () => {
    expect(rowTs({ id: 'a', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2021-01-01T00:00:00Z' }))
      .toBe(Date.parse('2021-01-01T00:00:00Z'));
  });
});

describe('planMerge', () => {
  it('pushes a local-only row to the cloud', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }];
    const { push, localPut } = planMerge(local, []);
    expect(push.map((r) => r.id)).toEqual(['a']);
    expect(localPut).toEqual([]);
  });

  it('pulls a cloud-only row down to the device', () => {
    const { push, localPut } = planMerge([], [remote('a', '2024-01-01T00:00:00Z')]);
    expect(push).toEqual([]);
    expect(localPut.map((r) => r.id)).toEqual(['a']);
  });

  it('never wipes the device when the cloud is empty', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }];
    const { localPut } = planMerge(local, []);
    expect(localPut).toEqual([]); // nothing deletes local 'a'
  });

  it('keeps the newer side on conflict (local newer)', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-06-01T00:00:00Z' }];
    const { push, localPut } = planMerge(local, [remote('a', '2024-01-01T00:00:00Z')]);
    expect(push.map((r) => r.id)).toEqual(['a']);
    expect(localPut).toEqual([]);
  });

  it('keeps the newer side on conflict (remote newer)', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }];
    const { push, localPut } = planMerge(local, [remote('a', '2024-06-01T00:00:00Z')]);
    expect(push).toEqual([]);
    expect(localPut.map((r) => r.id)).toEqual(['a']);
  });

  it('respects a cloud tombstone (no resurrection to local)', () => {
    const { localPut } = planMerge([], [remote('a', '2024-01-01T00:00:00Z', true)]);
    expect(localPut).toEqual([]);
  });

  it('a newer ledger tombstone deletes the local row (remote delete propagates)', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }];
    const { push, localPut, localDelete } = planMerge(local, [ledgerTombstone('a', '2024-06-01T00:00:00Z')]);
    expect(push).toEqual([]);
    expect(localPut).toEqual([]);
    expect(localDelete).toEqual(['a']);
  });

  it('a local re-edit newer than the ledger tombstone resurrects the row', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-06-01T00:00:00Z' }];
    const { push, localDelete } = planMerge(local, [ledgerTombstone('a', '2024-01-01T00:00:00Z')]);
    expect(push.map((r) => r.id)).toEqual(['a']);
    expect(localDelete).toEqual([]);
  });

  it('a legacy (unmarked) tombstone never deletes local data — the row is pushed back', () => {
    // The old absence heuristic wrote these with a fresh timestamp; trusting it
    // would wipe every device. Conservative: keep local, repair the cloud.
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-01-01T00:00:00Z' }];
    const { push, localDelete } = planMerge(local, [remote('a', '2024-06-01T00:00:00Z', true)]);
    expect(push.map((r) => r.id)).toEqual(['a']);
    expect(localDelete).toEqual([]);
  });

  it('a local deletion-ledger entry becomes a pushed tombstone', () => {
    const { pushTombstone, localPut } = planMerge(
      [],
      [remote('a', '2024-01-01T00:00:00Z')],
      [{ id: 'a', kind: 'protocols', deletedAt: '2024-06-01T00:00:00Z' }],
    );
    expect(pushTombstone.map((d) => d.id)).toEqual(['a']);
    expect(localPut).toEqual([]);
  });

  it('a remote re-edit newer than the local delete wins and resolves the ledger entry', () => {
    const { pushTombstone, localPut, ledgerResolved } = planMerge(
      [],
      [remote('a', '2024-06-01T00:00:00Z')],
      [{ id: 'a', kind: 'protocols', deletedAt: '2024-01-01T00:00:00Z' }],
    );
    expect(pushTombstone).toEqual([]);
    expect(localPut.map((r) => r.id)).toEqual(['a']);
    expect(ledgerResolved).toEqual(['a']);
  });

  it('a fresh empty device pulls the cloud without tombstoning anything', () => {
    const rows = [remote('a', '2024-01-01T00:00:00Z'), remote('b', '2024-01-02T00:00:00Z')];
    const { localPut, pushTombstone, localDelete } = planMerge([], rows, []);
    expect(localPut.map((r) => r.id).sort()).toEqual(['a', 'b']);
    expect(pushTombstone).toEqual([]);
    expect(localDelete).toEqual([]);
  });
});

describe('syncNow', () => {
  beforeEach(async () => {
    await clearAllData();
    resetSyncCursor();
    cloud.remote = [];
    cloud.upserted = [];
    cloud.failKinds = new Set();
    cloud.queriedSince = [];
  });

  it('a fresh device first pull copies cloud rows locally and tombstones nothing', async () => {
    cloud.remote = [{
      kind: 'protocols',
      id: 'p1',
      data: { id: 'p1', updatedAt: '2024-01-01T00:00:00.000Z' },
      updated_at: '2024-01-01T00:00:00.000Z',
      deleted: false,
    }];
    const result = await syncNow();
    expect(cloud.upserted).toEqual([]); // the old absence heuristic tombstoned everything here
    expect(result?.pulled).toBe(1);
    const db = await getDB();
    expect(await db.get('protocols', 'p1')).toBeTruthy();
  });

  it('a local delete pushes a ledger tombstone and prunes the ledger', async () => {
    const db = await getDB();
    await db.put('deletions', { id: 'gone', kind: 'protocols', deletedAt: '2026-07-17T00:00:00.000Z' });
    cloud.remote = [{
      kind: 'protocols',
      id: 'gone',
      data: { id: 'gone' },
      updated_at: '2024-01-01T00:00:00.000Z',
      deleted: false,
    }];

    await syncNow();

    expect(cloud.upserted.find((r) => r.id === 'gone')).toMatchObject({ kind: 'protocols', deleted: true });
    expect(await db.get('deletions', 'gone')).toBeUndefined(); // pruned once the cloud has it
  });

  it('a remote ledger tombstone removes the row from a device that still holds it', async () => {
    const db = await getDB();
    await db.put('protocols', {
      id: 'p1', owner: 'Victor', name: 'T', peptideIds: [], doses: [],
      startDate: '2026-01-01', durationWeeks: 4, status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    });
    cloud.remote = [{
      kind: 'protocols',
      id: 'p1',
      data: { id: 'p1', _ledger: 1 },
      updated_at: '2026-07-17T00:00:00.000Z',
      deleted: true,
    }];

    const result = await syncNow();

    expect(await db.get('protocols', 'p1')).toBeUndefined();
    expect(result?.pulled).toBe(1);
  });

  it('one failing kind does not stop the others from syncing', async () => {
    cloud.failKinds = new Set(['protocols']);
    const db = await getDB();
    await db.put('doseLogs', {
      id: 'log1', owner: 'Victor', protocolId: 'p1', peptideId: 'bpc-157',
      date: '2026-07-15', time: '08:00', dose: 250, unit: 'mcg', route: 'subq',
      createdAt: '2026-07-15T08:00:00.000Z',
    });

    const result = await syncNow();

    expect(result?.errors).toEqual(['protocols: protocols boom']);
    expect(cloud.upserted.map((r) => r.id)).toEqual(['log1']); // doseLogs still pushed
  });

  it('the second sync asks the cloud only for rows changed since the first', async () => {
    await syncNow();
    await syncNow();
    const [firstPass, secondPass] = [cloud.queriedSince.slice(0, 6), cloud.queriedSince.slice(6)];
    expect(firstPass.every((s) => s === null) && secondPass.every((s) => s !== null)).toBe(true);
  });

  it('an already-synced local row is not re-pushed on the next tick', async () => {
    const db = await getDB();
    await db.put('protocols', {
      id: 'p1', owner: 'Victor', name: 'T', peptideIds: [], doses: [],
      startDate: '2026-01-01', durationWeeks: 4, status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    });
    await syncNow();
    cloud.upserted = [];

    await syncNow();

    expect(cloud.upserted).toEqual([]);
  });

  it('a remote tombstone arriving in a delta still deletes the untouched local row', async () => {
    const db = await getDB();
    await db.put('protocols', {
      id: 'p1', owner: 'Victor', name: 'T', peptideIds: [], doses: [],
      startDate: '2026-01-01', durationWeeks: 4, status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
    });
    await syncNow(); // establishes the cursor; local p1 is older than it
    cloud.remote = [{
      kind: 'protocols',
      id: 'p1',
      data: { id: 'p1', _ledger: 1 },
      updated_at: new Date().toISOString(),
      deleted: true,
    }];

    await syncNow();

    expect(await db.get('protocols', 'p1')).toBeUndefined();
  });

  it('a failed sync does not advance the cursor (next pass is full again)', async () => {
    cloud.failKinds = new Set(['protocols']);
    await syncNow();
    await syncNow();
    expect(cloud.queriedSince.slice(6).every((s) => s === null)).toBe(true);
  });
});
