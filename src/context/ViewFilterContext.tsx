import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserName } from '../data/users';
import { filterByOwner, type ViewFilter } from './ownerFilter';

const STORAGE_KEY = 'pepdose-view-filter';

interface ViewFilterValue {
  filter: ViewFilter;
  setFilter: (f: ViewFilter) => void;
}

const ViewFilterCtx = createContext<ViewFilterValue | null>(null);

function readInitial(): ViewFilter {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === 'Victor' || raw === 'Nadia' ? raw : 'all';
}

export function ViewFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<ViewFilter>(readInitial);

  const setFilter = useCallback((f: ViewFilter) => {
    localStorage.setItem(STORAGE_KEY, f);
    setFilterState(f);
  }, []);

  const value = useMemo(() => ({ filter, setFilter }), [filter, setFilter]);
  return <ViewFilterCtx.Provider value={value}>{children}</ViewFilterCtx.Provider>;
}

export function useViewFilter(): ViewFilterValue {
  const ctx = useContext(ViewFilterCtx);
  if (!ctx) throw new Error('useViewFilter must be used within ViewFilterProvider');
  return ctx;
}

/** Returns a function that filters any owned list by the active view filter. */
export function useOwnerFilter(): <T extends { owner: UserName }>(items: T[]) => T[] {
  const { filter } = useViewFilter();
  return useCallback((items) => filterByOwner(items, filter), [filter]);
}
