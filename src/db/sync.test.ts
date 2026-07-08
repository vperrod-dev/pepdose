import { describe, it, expect } from 'vitest';
import { planMerge, rowTs, type RemoteRow, type Timestamped } from './sync';

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
});
