import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { planMerge, rowTs, syncNow, type RemoteRow, type Timestamped } from './sync';
import { getDB } from './schema';
import { clearAllData } from './operations';

// In-memory Supabase double so syncNow's push/tombstone/error paths are testable.
interface Envelope { kind: string; id: string; deleted: boolean }
const cloud = vi.hoisted(() => ({
  remote: [] as { kind: string; id: string; data: { id: string }; updated_at: string; deleted: boolean }[],
  upserted: [] as { kind: string; id: string; deleted: boolean }[],
  failKinds: new Set<string>(),
}));

vi.mock('./supabase', () => ({
  cloudEnabled: true,
  supabase: {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }) },
    from: () => ({
      select: () => ({
        eq: async (_col: string, kind: string) =>
          cloud.failKinds.has(kind)
            ? { data: null, error: new Error(`${kind} boom`) }
            : { data: cloud.remote.filter((r) => r.kind === kind), error: null },
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
  data: { id, updatedAt: ts },
  updated_at: ts,
  deleted,
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

  it('a tombstone on a row both sides have keeps the local copy but pushes nothing', () => {
    const local: Timestamped[] = [{ id: 'a', updatedAt: '2024-06-01T00:00:00Z' }];
    const { push, localPut } = planMerge(local, [remote('a', '2024-01-01T00:00:00Z', true)]);
    expect(push).toEqual([]);
    expect(localPut).toEqual([]);
  });
});

describe('syncNow', () => {
  beforeEach(async () => {
    await clearAllData();
    cloud.remote = [];
    cloud.upserted = [];
    cloud.failKinds = new Set();
  });

  it('pushes tombstones for remote rows that are gone locally (delete propagation)', async () => {
    cloud.remote = [{
      kind: 'protocols',
      id: 'gone',
      data: { id: 'gone' },
      updated_at: '2024-01-01T00:00:00.000Z',
      deleted: false,
    }];
    await syncNow();
    const tombstone = cloud.upserted.find((r) => r.id === 'gone');
    expect(tombstone).toMatchObject({ kind: 'protocols', deleted: true });
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
});
