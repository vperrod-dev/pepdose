# pepdose perf audit — 2026-07-27

Scope: N+1 patterns, unneeded re-renders, caching, memory leaks, redundant compute.
Verified against current source (not just memory of an earlier pass).

## 1. Sync does full local table scan every 30s (highest impact)

`src/db/sync.ts:157,166` — `syncNow()` runs `db.getAll(kind)` for every one of the 6
stores (protocols, scheduledDoses, doseLogs, vials, healthMarkers, editHistory) on
**every** pass. Remote side already has a delta cursor (`query.gt('updated_at', ...)`
line 171), but local reads ignore it entirely. `AuthGate.tsx:45` fires this on a
30s interval plus focus/beforeunload/visibilitychange listeners — so a full local
scan of all 6 stores happens at least every 30s while the tab is open.

No `by-updatedAt` index exists on any store (`src/db/schema.ts` — only
`by-status`/`by-date`/`by-protocol`/`by-peptide` indexes present).

Fix: add a `by-updatedAt` index to each store in the schema upgrade block, then in
`sync.ts` use `db.getAllFromIndex(kind, 'by-updatedAt', IDBKeyRange.lowerBound(delta))`
when `delta !== null`, matching the remote-side delta already in place.

```ts
// schema.ts upgrade, per store:
doseStore.createIndex('by-updatedAt', 'updatedAt');

// sync.ts:166
const allLocal: Timestamped[] = delta !== null
  ? await db.getAllFromIndex(kind, 'by-updatedAt', IDBKeyRange.lowerBound(new Date(delta).toISOString()))
  : await db.getAll(kind);
```

## 2. `getPeptideById` — O(n) linear scan, called unmemoized in render

`src/data/peptides.ts:752` — `PEPTIDES.find(p => p.id === id)`, ~40+ entries.
Called inline in `Dashboard.tsx` at lines 57 (map over doses), 225, 292, 314 — the
JSX-inline calls (225/292/314) re-run the linear scan on every render, not just
on data change. Same pattern in `Calendar.tsx` and `HalfLife.tsx`.

Fix: build a `Map` once (module-level, `PEPTIDES` is static) and swap the linear
find for a lookup:

```ts
// data/peptides.ts
const PEPTIDE_BY_ID = new Map(PEPTIDES.map(p => [p.id, p]));
export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDE_BY_ID.get(id);
}
```
O(1) lookup, zero call-site changes needed — fixes all render-loop call sites at once.

## 3. Derived data recomputed every render, no `useMemo`

`Dashboard.tsx:56` enrichment `.map()`, `InjectionMap.tsx` zoneStats/daysSinceByLabel,
`Symptoms.tsx` topNames — none wrapped in `useMemo`, so they recompute on every
parent re-render (including sibling modal open/close, unrelated state changes).
Calendar.tsx already does this correctly for `dosesByDate`/`adhocByDate` (useMemo) —
same pattern just needs applying to the other pages.

```ts
// Dashboard.tsx — wrap the enrichment
const enrichedDoses = useMemo(
  () => doses.map(d => ({ ...d, peptide: getPeptideById(d.peptideId) })),
  [doses]
);
```

## 4. No shared cache across pages — same queries refetched on every mount

Dashboard, Calendar, HalfLife each independently query active protocols +
scheduled doses + dose logs on mount, with overlapping ranges. Switching
Dashboard → Calendar → HalfLife re-runs queries for data already fetched.
Lower urgency than #1/#2 (IndexedDB reads are local, not network) but wasteful
on every navigation. Not fixing now — flag for a future shared-data context if
it becomes visibly slow.

## Checked, not found

- **N+1 DB queries**: none — `operations.ts` uses single indexed queries
  throughout (`by-date`, `by-protocol`, `by-peptide-date`). No loop-triggered
  per-row fetches.
- **Memory leaks**: interval/listener cleanup in `AuthGate.tsx` and
  `notifications.ts` is correct (proper teardown in effect cleanup). Rapid
  auth-state flicker could theoretically double-arm before cleanup runs, but
  this is a latent risk, not an observed leak — not worth fixing preemptively.
- **Redundant computation elsewhere** (Calendar `dayPeptides` IIFE,
  `getStackingInfo` O(n·m)): negligible at ~27-peptide catalog scale.

## Priority order

1. Sync full-read → indexed delta read (biggest win, hits every 30s)
2. `getPeptideById` → Map lookup (one change, fixes every render-loop call site)
3. `useMemo` on Dashboard/InjectionMap/Symptoms derived data
4. Shared query cache — defer until it's an actual complaint
