import { describe, it, expect } from 'vitest';
import { filterByOwner } from './ownerFilter';

const items = [
  { owner: 'Victor' as const, id: 1 },
  { owner: 'Nadia' as const, id: 2 },
  { owner: 'Victor' as const, id: 3 },
];

describe('filterByOwner', () => {
  it('returns all items when filter is all', () => {
    expect(filterByOwner(items, 'all')).toHaveLength(3);
  });

  it('returns only the selected user items', () => {
    expect(filterByOwner(items, 'Nadia').map((i) => i.id)).toEqual([2]);
  });
});
