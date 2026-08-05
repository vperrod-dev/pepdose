# Test coverage gap analysis — 2026-07-27

Scope: `src/`. Method: diffed every source file against its `.test.ts(x)` sibling,
then read the untested files to find real (non-trivial) logic.

**Updated same day:** `stackingRules.test.ts`, `users.test.ts`, `context/ownerFilter.test.ts`
(pure filter extracted from `ViewFilterContext.tsx`), and `data/dataIntegrity.test.ts`
(cross-file peptide/protocol/stacking-rule reference checks) landed after the first pass
of this report and close part of gap #1 below. Everything else in this report is still open.

## Summary

Pure-logic `utils/*.ts` are fully covered (24/24 have tests, good edge-case
depth — half-life decay, tombstone LWW, adherence bridging, etc). Gaps cluster
in three places:

1. **Untested pure logic** — `symptoms.ts` (small), `ViewFilterContext.tsx`
   provider/hooks (the extracted `filterByOwner` pure fn now has its own test,
   but the context itself — localStorage persistence, "used outside provider"
   throw — doesn't).
2. **`db/operations.ts`** — 33 exported functions, only 9 have direct test coverage.
3. **Component/page layer** — 3 of ~11 components tested, 3 of ~19 pages tested.
   `DoseActionSheet.tsx` (443 lines, dose-logging + reschedule + delete-with-restore)
   has zero tests despite being the primary write path for the app.

---

## 1. Untested pure functions / context (highest value, lowest effort)

### `src/data/symptoms.ts` — `symptomsForCategory`

```ts
// src/data/symptoms.test.ts
import { describe, it, expect } from 'vitest';
import { symptomsForCategory, SYMPTOMS } from './symptoms';

describe('symptomsForCategory', () => {
  it('returns all symptoms unmodified when no category given', () => {
    expect(symptomsForCategory()).toEqual(SYMPTOMS);
  });

  it('orders category-relevant symptoms first, preserves total count', () => {
    const ordered = symptomsForCategory('glp1');
    expect(ordered).toHaveLength(SYMPTOMS.length);
    expect(ordered[0].categories).toContain('glp1');
  });

  it('falls back to full list order when nothing matches the category', () => {
    // no symptom in the fixture tags 'cosmetic' with no others -> just verify no throw / same length
    expect(symptomsForCategory('sexual_health').length).toBe(SYMPTOMS.length);
  });
});
```

### `src/context/ViewFilterContext.tsx`

localStorage round-trip, invalid stored value fallback, and the "used outside
provider" throw are untested.

```tsx
// src/context/ViewFilterContext.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, renderHook } from '@testing-library/react';
import { ViewFilterProvider, useViewFilter, useOwnerFilter } from './ViewFilterContext';

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

beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()));
afterEach(cleanup);

describe('useViewFilter', () => {
  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useViewFilter())).toThrow(/within ViewFilterProvider/);
  });

  it('defaults to "all" when localStorage has an invalid value', () => {
    localStorage.setItem('pepdose-view-filter', 'garbage');
    const { result } = renderHook(() => useViewFilter(), { wrapper: ViewFilterProvider });
    expect(result.current.filter).toBe('all');
  });

  it('persists a changed filter to localStorage', () => {
    const { result } = renderHook(() => useViewFilter(), { wrapper: ViewFilterProvider });
    result.current.setFilter('Nadia');
    expect(localStorage.getItem('pepdose-view-filter')).toBe('Nadia');
  });
});

describe('useOwnerFilter', () => {
  it('filters a list according to the active filter', () => {
    localStorage.setItem('pepdose-view-filter', 'Victor');
    const { result } = renderHook(() => useOwnerFilter(), { wrapper: ViewFilterProvider });
    const filtered = result.current([{ owner: 'Victor', id: 1 }, { owner: 'Nadia', id: 2 }]);
    expect(filtered).toEqual([{ owner: 'Victor', id: 1 }]);
  });
});
```

---

## 2. `src/db/operations.ts` — 24 of 33 exports have no direct test

Tested today: `decrementVialDose`, `incrementVialDose`, `logDose`/`deleteDoseLog`,
`getScheduledDosesInRange`, `getDoseLogsInRange`, `deleteProtocol`, `validateImport`,
`importData`.

**Untested:** `saveProtocol`, `updateProtocol`, `getProtocols`, `getProtocol`,
`getScheduledDosesForDate`, `updateScheduledDose`, `updateFutureScheduledDoses`,
`deleteUpcomingDosesFrom`, `deleteScheduledDosesForProtocol`, `getDoseLogsForDate`,
`getDoseLogsForPeptide`, `getDoseLogsForProtocol`, `updateDoseLog`, `saveVial`,
`getVials`, `updateVial`, `saveHealthMarker`, `getHealthMarkers`, `getEditHistory`,
`exportAllData`, `clearAllData`, `getAllDoseLogs`, `saveScheduledDoses`,
`getScheduledDosesForProtocol`.

(`saveVial`, `getVials`, `getAllDoseLogs`, `saveScheduledDoses`, `getScheduledDosesForProtocol`
are exercised as setup/assertion helpers in other tests but have no describe block
asserting their own contract — e.g. `saveVial` defaulting/validation, `getVials`
filtering by peptide, `saveScheduledDoses` overwrite-vs-insert semantics.)

Priority picks — the ones with branchy/edit-history logic, not straight CRUD passthroughs:

```ts
// additions to src/db/operations.test.ts

describe('updateProtocol', () => {
  it('is a no-op when the protocol does not exist', async () => {
    await updateProtocol('missing-id', { name: 'x' });
    expect(await getProtocol('missing-id')).toBeUndefined();
  });

  it('merges updates and bumps updatedAt', async () => {
    const p = await saveProtocol({ owner: 'Victor', name: 'A', peptideIds: ['bpc-157'], doses: [], startDate: '2026-01-01', durationWeeks: 4, status: 'active' });
    const before = p.updatedAt;
    await updateProtocol(p.id, { name: 'B' });
    const after = await getProtocol(p.id);
    expect(after?.name).toBe('B');
    expect(after?.updatedAt).not.toBe(before);
  });
});

describe('updateFutureScheduledDoses', () => {
  it('only rewrites upcoming doses on/after fromDate, leaves logged/past alone', async () => {
    await saveScheduledDoses([
      { id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-14', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'logged', weekNumber: 1 },
      { id: 'd2', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-16', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    const count = await updateFutureScheduledDoses('p1', '2026-07-15', { dose: 500, unit: 'mcg' }, 'dose', '250', '500');

    expect(count).toBe(1);
    const doses = await getScheduledDosesForProtocol('p1');
    expect(doses.find(d => d.id === 'd1')?.dose).toBe(250); // logged untouched
    expect(doses.find(d => d.id === 'd2')?.dose).toBe(500); // upcoming rewritten
  });

  it('records an editHistory entry with the affected count', async () => {
    await saveScheduledDoses([
      { id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-16', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');
    await updateFutureScheduledDoses('p1', '2026-07-15', { dose: 500, unit: 'mcg' }, 'dose', '250', '500');
    const history = await getEditHistory('p1');
    expect(history[0]).toMatchObject({ field: 'dose', oldValue: '250', newValue: '500', affectedDoses: 1 });
  });
});

describe('deleteUpcomingDosesFrom', () => {
  it('deletes only upcoming doses from the given date forward and ledgers them', async () => {
    await saveScheduledDoses([
      { id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-14', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
      { id: 'd2', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-16', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'logged', weekNumber: 1 },
      { id: 'd3', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-17', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    await deleteUpcomingDosesFrom('p1', '2026-07-15');

    const remaining = (await getScheduledDosesForProtocol('p1')).map(d => d.id);
    expect(remaining.sort()).toEqual(['d1', 'd2']); // d1 before cutoff, d2 logged (not upcoming) survive
  });
});

describe('updateDoseLog', () => {
  it('is a no-op when the log does not exist', async () => {
    await updateDoseLog('missing', { dose: 999 });
    // no throw = pass; nothing to assert on since nothing was created
  });

  it('updates the log in place without touching vial inventory', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await updateDoseLog(log.id, { dose: 300, notes: 'edited' });
    const [updated] = await getDoseLogsForPeptide('bpc-157');
    expect(updated).toMatchObject({ dose: 300, notes: 'edited' });
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(2); // unchanged by the edit
  });
});

describe('deleteScheduledDosesForProtocol', () => {
  it('removes every scheduled dose for the protocol and ledgers each one', async () => {
    await saveScheduledDoses([
      { id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-14', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
      { id: 'd2', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-15', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'logged', weekNumber: 1 },
    ], 'Victor');
    await saveScheduledDoses([
      { id: 'd3', protocolId: 'p2', peptideId: 'tb-500', date: '2026-07-14', time: '08:00', dose: 2500, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    await deleteScheduledDosesForProtocol('p1');

    expect(await getScheduledDosesForProtocol('p1')).toEqual([]);
    expect((await getScheduledDosesForProtocol('p2')).map(d => d.id)).toEqual(['d3']); // other protocol untouched
  });
});

describe('exportAllData / clearAllData', () => {
  it('export reflects every store, clearAllData empties all of them', async () => {
    await saveVial(baseVial);
    await logDose(baseLog);
    const exported = JSON.parse(await exportAllData());
    expect(exported.vials).toHaveLength(1);
    expect(exported.doseLogs).toHaveLength(1);

    await clearAllData();
    expect(await getAllDoseLogs()).toEqual([]);
    expect(await getVials('bpc-157')).toEqual([]);
  });
});
```

**Missing error-handling case:** no test in this file forces an IndexedDB write
to reject (e.g. `fake-indexeddb` transaction abort) and asserts the caller sees
the rejection rather than a silently swallowed failure. Every one of these
functions currently assumes the happy path. Since `DoseActionSheet.runSave` and
`QuickLog`'s save flow are the actual consumers of thrown errors, at minimum
one operations-layer test should confirm a `db.put` rejection propagates:

```ts
it('propagates an IndexedDB write failure to the caller', async () => {
  const db = await getDB();
  vi.spyOn(db, 'put').mockRejectedValueOnce(new Error('QuotaExceededError'));
  await expect(saveVial(baseVial)).rejects.toThrow('QuotaExceededError');
});
```

---

## 3. `src/components/DoseActionSheet.tsx` — zero tests, primary write path

443 lines, no `.test.tsx`. This is the sheet used from Calendar/Dashboard to log,
reschedule, skip, and delete doses — the same `runSave` error-swallow pattern
QuickLog already has a regression test for (`src/pages/QuickLog.test.tsx:38`),
but here it's unverified. Follow that file's mocking pattern (`vi.mock('../db/operations', …)`).

```tsx
// src/components/DoseActionSheet.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import { DoseActionSheet } from './DoseActionSheet';

const ops = vi.hoisted(() => ({
  logDose: vi.fn(async () => ({})),
  updateScheduledDose: vi.fn(async () => {}),
  updateDoseLog: vi.fn(async () => {}),
  deleteDoseLog: vi.fn(async () => {}),
  getAllDoseLogs: vi.fn(async () => []),
}));
vi.mock('../db/operations', () => ops);

const baseDose = {
  id: 'd1', owner: 'Victor' as const, protocolId: 'p1', peptideId: 'bpc-157',
  date: '2026-07-27', time: '08:00', dose: 500, unit: 'mcg' as const, route: 'subq',
  status: 'upcoming' as const, weekNumber: 1, peptideName: 'BPC-157', color: '#000',
};

afterEach(cleanup);

describe('logging a pending dose', () => {
  it('disables the log button while dose input is invalid (empty/zero)', async () => {
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    fireEvent.click(screen.getByText('Log Dose'));
    const doseInput = screen.getByDisplayValue('500');
    fireEvent.change(doseInput, { target: { value: '0' } });
    expect(screen.getByRole('button', { name: 'Log Dose' })).toBeDisabled();
  });

  it('calls logDose with the entered values and closes on success', async () => {
    const onUpdated = vi.fn(), onClose = vi.fn();
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={onClose} onUpdated={onUpdated} />); });
    fireEvent.click(screen.getByText('Log Dose'));
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Log Dose' })); });
    expect(ops.logDose).toHaveBeenCalledWith(expect.objectContaining({ peptideId: 'bpc-157', dose: 500 }));
    expect(onUpdated).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('a failed save surfaces the error and keeps the sheet open, not stuck on "Saving…"', async () => {
    ops.logDose.mockImplementationOnce(() => { throw new Error('quota exceeded'); });
    const onClose = vi.fn();
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={onClose} onUpdated={vi.fn()} />); });
    fireEvent.click(screen.getByText('Log Dose'));
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Log Dose' })); });
    expect(screen.getByRole('alert').textContent).toContain('quota exceeded');
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('editing an already-logged dose', () => {
  const log = { id: 'l1', owner: 'Victor' as const, scheduledDoseId: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: '2026-07-27', time: '08:00', dose: 500, unit: 'mcg' as const, route: 'subq', createdAt: '2026-07-27T08:00:00Z' };
  const loggedDose = { ...baseDose, status: 'logged' as const };

  it('opens directly into the log view (skips the actions menu)', async () => {
    await act(async () => { render(<DoseActionSheet dose={loggedDose} log={log} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    expect(screen.getByText('Save Changes')).toBeTruthy();
  });

  it('deleting requires a confirmation step before calling deleteDoseLog', async () => {
    await act(async () => { render(<DoseActionSheet dose={loggedDose} log={log} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    fireEvent.click(screen.getByText('Delete log'));
    expect(ops.deleteDoseLog).not.toHaveBeenCalled();
    await act(async () => { fireEvent.click(screen.getByText(/Yes, delete/)); });
    expect(ops.deleteDoseLog).toHaveBeenCalledWith('l1');
  });
});

describe('rescheduling', () => {
  it('disables the reschedule button until date or time actually changes', async () => {
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    fireEvent.click(screen.getByText('Reschedule'));
    expect(screen.getByRole('button', { name: 'Reschedule' })).toBeDisabled();
  });

  it('submits the new date/time with an editNote referencing the original slot', async () => {
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    fireEvent.click(screen.getByText('Reschedule'));
    fireEvent.change(screen.getByDisplayValue('2026-07-27'), { target: { value: '2026-07-28' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Reschedule' })); });
    expect(ops.updateScheduledDose).toHaveBeenCalledWith('d1', expect.objectContaining({ date: '2026-07-28', editNote: expect.stringContaining('2026-07-27') }));
  });
});

describe('skipping', () => {
  it('marks the dose skipped without opening the log form', async () => {
    await act(async () => { render(<DoseActionSheet dose={baseDose} onClose={vi.fn()} onUpdated={vi.fn()} />); });
    await act(async () => { fireEvent.click(screen.getByText('Skip Dose')); });
    expect(ops.updateScheduledDose).toHaveBeenCalledWith('d1', { status: 'skipped' });
  });
});
```

---

## 4. Other components/pages with zero tests (inventory, not exhaustively skeletoned)

Follow the `QuickLog.test.tsx` / `AdhocLogSheet.test.tsx` mocking pattern
(`vi.mock('../db/operations', …)` + `vi.mock('../context/ViewFilterContext', …)`)
for any of these:

| File | Why it matters |
|---|---|
| `pages/NewProtocol.tsx` (29.5K) | Protocol creation, titration ladder scaling, variant picker — feeds `scheduleEngine`. No test exercises the full "create protocol → schedule generated" path end to end. |
| `pages/Protocols.tsx` (43.6K) | Largest page in the app; protocol list/edit/pause/archive actions untested. |
| `pages/HealthMarkers.tsx` (22.7K) | Form + chart page, untested. |
| `pages/ReconCalculator.tsx`, `pages/Calendar.tsx`, `pages/Dashboard.tsx`, `pages/VialInventory.tsx` | Each wraps a tested pure util (`reconCalc`, `protocolTimeline`, `adherence`, `vialForecast`) but the component wiring (props → util → render) itself is unverified. |
| `components/BodyMapSVG.tsx`, `components/AbdomenClockDial.tsx` | Site-selection UI used inside `DoseActionSheet`; no direct interaction test. |
| `components/BottomNav.tsx`, `UserBadge.tsx`, `UserFilterChip.tsx`, `UserPicker.tsx` | Small, likely low-risk, but currently 0% covered. |
| `components/ProtocolTimeline.tsx` | The pure `utils/protocolTimeline.ts` is well tested; the component that renders its output (Gantt bars, legend) is not. |

---

## 5. Integration test gaps

- **Protocol → schedule → log → vial draw-down**, end to end. Today `scheduleEngine.test.ts`
  tests generation in isolation and `operations.test.ts` tests `logDose`/`decrementVialDose`
  in isolation, but nothing exercises `saveProtocol` → `scheduleEngine.generate(...)` →
  `saveScheduledDoses` → `DoseActionSheet` log → vial decrement as one flow. This is the
  app's core user journey and the seam between "protocol edited" and "schedule regenerated"
  is exactly where the CLAUDE.md conventions warn regressions happen ("Schedule-engine
  edits must preserve already-logged history").
- **`db/schema.ts` upgrade path** — the `openDB` `upgrade(db, oldVersion, ...)` migration
  from v1→v2→v3 (deletions ledger addition) has no test opening a v1/v2-shaped fake-indexeddb
  database and asserting the v3 upgrade runs cleanly without data loss.
- **Cloud sync auth edge case** — `syncNow()` returns `null` early when
  `supabase.auth.getSession()` has no session (`src/db/sync.ts:149`); not covered by
  `sync.test.ts`'s otherwise-thorough suite. Quick add:

```ts
it('returns null when there is no active session', async () => {
  vi.mocked(supabase!.auth.getSession).mockResolvedValueOnce({ data: { session: null } } as never);
  expect(await syncNow()).toBeNull();
});
```

---

## Priority order (recommend tackling in this sequence)

1. `symptoms.test.ts` — 10 min, zero risk, pure function. (`stackingRules.test.ts` done.)
2. `ViewFilterContext.test.tsx` — used by nearly every page filter; cheap to test.
   (The extracted `ownerFilter.test.ts` covers the filtering logic itself, not the
   provider/localStorage/hook-outside-provider paths.)
3. `db/operations.test.ts` additions — `updateFutureScheduledDoses`/`deleteUpcomingDosesFrom`
   are the two with the most branch complexity and the highest "silently wrong" blast radius
   (they touch every future dose in a protocol); `deleteScheduledDosesForProtocol` is new
   and equally untested.
4. `DoseActionSheet.test.tsx` — highest user-facing risk of anything untested in the repo.
5. Integration test for protocol-edit → schedule regeneration → log preservation.
