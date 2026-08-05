# Performance audit — pepdose — 2026-07-27

Local-first PWA (IndexedDB, no server) — classic "N+1 SQL query" doesn't apply.
DB layer already batches correctly (`saveScheduledDoses`, `updateFutureScheduledDoses`,
`deleteUpcomingDosesFrom` all use one `idb` transaction with per-item `tx.store.put`/`delete`
inside it, not separate round trips). No fix needed there.

Four real findings, ranked by actual impact.

## 1. `getPeptideById` — O(n) linear scan, called from render (low severity, easy fix)

`src/data/peptides.ts:1619`:

```ts
export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDES.find(p => p.id === id);
}
```

Called 17 places, several inline in JSX render (`Dashboard.tsx:225,292,314`, plus loops in
`useEffect` at `Dashboard.tsx:57`). With 39 peptides this costs nanoseconds — not a real
bottleneck today — but it re-scans on every render and every array-of-doses `.map`, and cost
grows linearly as the compound list grows (already at 39, was smaller). Cheap to fix once:

```ts
const PEPTIDE_INDEX = new Map(PEPTIDES.map(p => [p.id, p]));

export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDE_INDEX.get(id);
}
```

Zero API change, every call site unaffected.

## 2. Dashboard renders re-derive per-log peptide lookups without memoization (medium)

`src/pages/Dashboard.tsx` — the `useEffect` at line 48-57 loops over dose logs and calls
`getPeptideById` per log on every dependency change, and the JSX at 292/314 does it again per
render for the same data. Wrap the derived list in `useMemo` keyed on the actual log array:

```ts
const logsWithPeptide = useMemo(
  () => doseLogs.map(d => ({ ...d, peptide: getPeptideById(d.peptideId) })),
  [doseLogs],
);
```

Then render from `logsWithPeptide` instead of calling `getPeptideById` inline in JSX. Avoids
recomputing on every parent re-render (e.g. a sibling state update unrelated to the log list).

## 3. `AuthGate.tsx` sync interval/listeners re-arm on every `session` object change (medium — real leak risk)

`src/components/AuthGate.tsx:30-56`. The effect depends on `[session]`, but
`supabase.auth.onAuthStateChange` fires with a **new session object** on token refresh
(roughly hourly) even when the user hasn't changed. Each refresh tears down and rebuilds:
1 `setInterval`, 3 `addEventListener`s. Churn, not a leak (cleanup does run) — but needless
work and a hazard if a future edit adds an early return before the `return () => {...}` cleanup.

Fix: key the effect on the stable user id, not the session object:

```ts
const userId = session?.user.id ?? null;
useEffect(() => {
  if (!userId) return;
  // ...unchanged body...
}, [userId]);
```

Interval/listeners now survive token refresh, only re-arm on actual login/logout.

## 4. No caching layer for repeated `activeLevels`/`symptomTrends` recomputation across chart re-renders (low)

`utils/activeLevels.ts` `sampleLevels` walks every dose event for every sample point
(`points` × `events.length`). Pure and already unit-tested — fine as is for realistic data
volumes (few hundred logs). Flag only if a user's history grows into the thousands: memoize
`sampleLevels` result in `HalfLife.tsx` on `[seriesList, start, end, points]` via `useMemo`
rather than recomputing on unrelated parent re-renders. Not urgent today.

## Not real findings (checked and ruled out)

- **N+1 DB queries**: none — `idb` transactions batch writes correctly.
- **Memory leaks in event listeners/timers**: all paired with cleanup (`AuthGate.tsx`,
  service worker). Churn (#3) is the only issue, not an actual leak.
- **Sync full-scan**: already has a delta cursor (`db/sync.ts`), falls back to full scan only
  when needed. No action.
