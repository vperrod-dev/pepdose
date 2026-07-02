# Two-User Support (Victor / Nadia) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Tag every tracked record with an owner (Victor or Nadia), backfill existing data to Victor, add creation pickers, and show both users' data everywhere with badges and an optional filter.

**Architecture:** Single IndexedDB with an `owner` field per record. DB v1→v2 migration backfills existing → Victor. A React context holds the All/Victor/Nadia view filter; screens pass lists through a filter helper and badge each item. Schedule engine stays pure — owner stamped at the save boundary.

**Tech Stack:** React 19, TypeScript, Vite, `idb`, react-router, Tailwind, Vitest.

## Global Constraints

- Exactly two hardcoded users: `Victor`, `Nadia`. No add/remove/rename UI.
- Existing data → `owner: 'Victor'`.
- No new dependencies.
- Onboarding and settings stay shared/global.
- Reads keep returning all records; filtering is in-memory.
- Default view filter = `all`.

---

### Task 1: Users module

**Files:**
- Create: `src/data/users.ts`
- Test: `src/data/users.test.ts`

**Produces:** `type UserName = 'Victor' | 'Nadia'`; `USERS`; `USER_COLORS`; `getLastOwner(): UserName`; `setLastOwner(u: UserName): void`.

- [ ] Write `users.test.ts`: `getLastOwner()` returns `'Victor'` when localStorage empty; after `setLastOwner('Nadia')`, `getLastOwner()` returns `'Nadia'`.
- [ ] Implement `src/data/users.ts` (types, USERS, USER_COLORS blue/pink, get/set backed by `localStorage 'pepdose-last-owner'`).
- [ ] Run `npx vitest run src/data/users.test.ts` — PASS.
- [ ] Commit `feat: users module (Victor/Nadia)`.

### Task 2: Schema owner fields + v2 migration

**Files:**
- Modify: `src/db/schema.ts`

**Consumes:** `UserName` from Task 1.
**Produces:** `owner: UserName` on `UserProtocol`, `ScheduledDose`, `DoseLog`, `Vial`, `HealthMarker`.

- [ ] Import `UserName`; add `owner: UserName` to the five interfaces.
- [ ] Bump `openDB('pepdose', 2, ...)`. Guard store/index creation with `if (oldVersion < 1)`. Add `if (oldVersion < 2)` block: for each of `protocols, scheduledDoses, doseLogs, vials, healthMarkers`, cursor-iterate via the upgrade `tx` and `cursor.update({ ...value, owner: value.owner ?? 'Victor' })`.
- [ ] `npx tsc --noEmit` — expect errors only in write call sites (fixed in later tasks); schema file itself clean.
- [ ] Commit `feat: owner field + v2 backfill migration`.

### Task 3: Write ops stamp owner

**Files:**
- Modify: `src/db/operations.ts`

- [ ] `saveScheduledDoses(doses, owner: UserName)` — map each dose to `{ ...dose, owner }` before put.
- [ ] Confirm `saveProtocol`, `logDose`, `saveVial`, `saveHealthMarker` accept `owner` via their `Omit<...>` params (owner is part of the interface, so callers must supply it — no signature change needed).
- [ ] Commit `feat: stamp owner on scheduled-dose writes`.

### Task 4: View filter context + helper + chip

**Files:**
- Create: `src/context/ViewFilterContext.tsx` (context, `ViewFilterProvider`, `useViewFilter()`, `useOwnerFilter()` returning `<T extends {owner: UserName}>(items: T[]) => T[]`)
- Create: `src/components/UserFilterChip.tsx`
- Test: `src/context/ownerFilter.test.ts` (pure filter helper extracted so it's testable without React)
- Modify: `src/App.tsx` (wrap routes in provider; render chip in a slim header inside router)

**Consumes:** `UserName`, `USERS`, `USER_COLORS`.

- [ ] Extract pure `filterByOwner(items, filter)` into `src/context/ownerFilter.ts`; test: `filter='all'` returns all; `filter='Nadia'` returns only Nadia items.
- [ ] Implement context (persist `pepdose-view-filter`, default `'all'`) using `filterByOwner`.
- [ ] Implement `UserFilterChip` (All / Victor / Nadia buttons bound to context, active state color-coded).
- [ ] Wrap `<Routes>` tree in `ViewFilterProvider`; add a slim sticky header row containing `<UserFilterChip />` above `<main>`.
- [ ] `npx vitest run src/context/ownerFilter.test.ts` — PASS.
- [ ] Commit `feat: view-filter context, helper, and chip`.

### Task 5: Shared UserPicker + UserBadge

**Files:**
- Create: `src/components/UserPicker.tsx` (`value: UserName; onChange: (u: UserName) => void`, segmented toggle)
- Create: `src/components/UserBadge.tsx` (`owner: UserName`, small colored pill)

- [ ] Implement both, color-coded via `USER_COLORS`. Touch targets ≥44px on picker.
- [ ] `npx tsc --noEmit` on these files — clean.
- [ ] Commit `feat: UserPicker and UserBadge components`.

### Task 6: NewProtocol picker

**Files:**
- Modify: `src/pages/NewProtocol.tsx`

- [ ] Add `owner` state init `getLastOwner()`; render `<UserPicker>` in the form.
- [ ] `saveProtocol({ ..., owner })`; `saveScheduledDoses(allDoses, owner)`; `setLastOwner(owner)` on submit.
- [ ] `npx tsc --noEmit` — NewProtocol clean.
- [ ] Commit `feat: assign owner when creating a protocol`.

### Task 7: VialInventory picker + badge + filter

**Files:**
- Modify: `src/pages/VialInventory.tsx`

- [ ] Add `owner` state (`getLastOwner()`) + `<UserPicker>` in add form; `saveVial({ ..., owner })`; `setLastOwner`.
- [ ] Render `<UserBadge>` on each vial row; pass vial list through `useOwnerFilter()`.
- [ ] `npx tsc --noEmit` — clean.
- [ ] Commit `feat: owner on vials + badge/filter in inventory`.

### Task 8: HealthMarkers picker + badge + filter

**Files:**
- Modify: `src/pages/HealthMarkers.tsx`

- [ ] Add `owner` state + `<UserPicker>` in entry form; `saveHealthMarker({ ..., owner })`; `setLastOwner`.
- [ ] Badge each marker entry; filter the entry list AND the chart data through `useOwnerFilter()`.
- [ ] `npx tsc --noEmit` — clean.
- [ ] Commit `feat: owner on health markers + badge/filter`.

### Task 9: Dose logging inherits owner (Dashboard/QuickLog/DoseActionSheet)

**Files:**
- Modify: `src/components/DoseActionSheet.tsx`, `src/pages/QuickLog.tsx`, `src/pages/Dashboard.tsx`

- [ ] `DoseActionSheet.handleLog` new-log branch: `logDose({ ..., owner: dose.owner })`.
- [ ] `QuickLog.handleLog`: `logDose({ ..., owner: dose.owner })`; badge dose rows; filter today's doses list through `useOwnerFilter()`.
- [ ] `Dashboard`: badge dose cards; filter today's doses through `useOwnerFilter()`. If a free-form/manual log form exists here, give it a `<UserPicker>`; otherwise none needed.
- [ ] `npx tsc --noEmit` — clean.
- [ ] Commit `feat: dose logs inherit owner + badge/filter on dashboard/quicklog`.

### Task 10: Remaining views (Calendar, Protocols, DoseHistory, Insights, InjectionMap)

**Files:**
- Modify: `src/pages/Calendar.tsx`, `src/pages/Protocols.tsx`, `src/pages/DoseHistory.tsx`, `src/pages/Insights.tsx`, `src/pages/InjectionMap.tsx`

- [ ] Calendar: badge dose entries; filter through `useOwnerFilter()`.
- [ ] Protocols: badge each protocol; filter list; schedule regen → `saveScheduledDoses(regen, protocol.owner)`.
- [ ] DoseHistory: badge rows; filter through `useOwnerFilter()`.
- [ ] Insights + InjectionMap: filter their source records through `useOwnerFilter()` before computing stats.
- [ ] `npx tsc --noEmit` — clean.
- [ ] Commit `feat: badges + owner filter across remaining views`.

### Task 11: Docs, build, push

**Files:**
- Modify: `README.md`
- Test/build: full suite + production build

- [ ] Update `README.md`: document the two-user model (Victor/Nadia, owner tagging, filter chip, existing data → Victor).
- [ ] Run `npx vitest run` — all PASS.
- [ ] Run `npm run build` — succeeds (tsc + vite).
- [ ] Commit `docs: document two-user support` and `git push origin main`.

## Self-Review

- **Spec coverage:** data model (T2), migration (T2), writes (T3,T6-T10), pickers (T5,T6,T7,T8), badges+filter (T4,T5,T7-T10), charts respect filter (T8,T10), shared onboarding/settings (untouched), no deps (verified). ✓
- **Placeholders:** none — free-form-log branch explicitly conditional on existence, verified at impl. ✓
- **Type consistency:** `owner: UserName`, `saveScheduledDoses(doses, owner)`, `useOwnerFilter`, `filterByOwner` used consistently across tasks. ✓
