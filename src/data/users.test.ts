import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLastOwner, setLastOwner } from './users';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
}

describe('last owner preference', () => {
  beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()));

  it('defaults to Victor when unset', () => {
    expect(getLastOwner()).toBe('Victor');
  });

  it('round-trips a set owner', () => {
    setLastOwner('Nadia');
    expect(getLastOwner()).toBe('Nadia');
  });
});
