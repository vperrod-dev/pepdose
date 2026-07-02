import type { UserName } from '../data/users';

export type ViewFilter = 'all' | UserName;

export function filterByOwner<T extends { owner: UserName }>(items: T[], filter: ViewFilter): T[] {
  if (filter === 'all') return items;
  return items.filter((item) => item.owner === filter);
}
