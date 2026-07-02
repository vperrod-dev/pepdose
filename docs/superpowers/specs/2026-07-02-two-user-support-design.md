# Two-User Support (Victor / Nadia) — Design Spec

**Date:** 2026-07-02
**Status:** Approved (pending spec review)

## Goal

pepdose is used by two people on a shared device. Every tracked record must
belong to a named user. All existing data is assigned to **Victor**. New
protocols, dose logs, health markers, and vials are tagged with the user who
created them, chosen from **Victor** or **Nadia**. Every viewing screen shows
**both** users' data at once, each item labeled with its owner, with an optional
filter to narrow to one person.

## Decisions (locked)

- **Storage:** single IndexedDB database, `owner` field on each record (not
  separate DBs).
- **Existing data:** migrated to `owner: 'Victor'`.
- **Views:** unified — both users shown together, badged. A shared
  All / Victor / Nadia filter chip (default **All**) lets you narrow.
- **Charts** (health/weight trends, insights, injection stats): respect the
  filter. Under **All** they combine as they do today; to read one person's
  trend, select that person. No per-user series splitting in this change.
- **Onboarding & settings:** stay **shared/global** (unchanged).
- **No new dependencies.**

## Users are fixed

Exactly two users, hardcoded. No add/remove/rename UI.

```ts
// src/data/users.ts
export type UserName = 'Victor' | 'Nadia';
export const USERS: UserName[] = ['Victor', 'Nadia'];
export const USER_COLORS: Record<UserName, string> = {
  Victor: '#3b82f6', // blue
  Nadia:  '#ec4899', // pink
};
export function getLastOwner(): UserName;   // localStorage 'pepdose-last-owner', default 'Victor'
export function setLastOwner(u: UserName): void;
```

## Data model changes (`src/db/schema.ts`)

Add `owner: UserName` to these interfaces:

- `UserProtocol`
- `ScheduledDose`
- `DoseLog`
- `Vial`
- `HealthMarker`

`EditHistory` is left unchanged (internal audit, derivable via protocol).

No new indexes — data volume is tiny (personal app); owner filtering is done
in memory. Reads continue to return all records.

### Migration: DB version 1 → 2

Bump `openDB<PepDoseDB>('pepdose', 2, { upgrade(db, oldVersion, _new, tx) })`.

- Keep the existing v1 store/index creation (guarded so it only runs when
  `oldVersion < 1`).
- When `oldVersion < 2`: iterate every record in `protocols`, `scheduledDoses`,
  `doseLogs`, `vials`, `healthMarkers` using the upgrade transaction's cursor,
  and set `owner = 'Victor'` on any record missing it. This backfills all of
  Victor's existing data. Idempotent (only sets when missing).

## Write path (`src/db/operations.ts`)

- `saveProtocol(protocol)` — `protocol` now carries `owner` (from picker).
- `saveScheduledDoses(doses, owner)` — new second arg; stamps `owner` on every
  dose before writing. Doses always inherit their protocol's owner.
- `logDose(log)` — `log` carries `owner`. Both current callers log from a
  scheduled dose, so they pass `owner: dose.owner` (inherited, no picker).
- `saveVial(vial)` — carries `owner` (from picker).
- `saveHealthMarker(marker)` — carries `owner` (from picker).
- `exportAllData` / `importData` — unchanged; `owner` rides along in the JSON.

`generateSchedule` (scheduleEngine) is **not** modified — owner is stamped at
the `saveScheduledDoses` boundary, keeping the schedule engine pure.

## Shared UI components

- **`src/components/UserPicker.tsx`** — segmented Victor/Nadia toggle for
  creation forms. Color-coded to `USER_COLORS`. `value` / `onChange` props.
- **`src/components/UserBadge.tsx`** — small colored pill showing an owner's
  name/initial; used on list items.
- **`src/context/ViewFilterContext.tsx`** — React context holding
  `filter: 'all' | UserName` and `setFilter`, persisted to localStorage
  (`pepdose-view-filter`, default `'all'`). Provider wraps the in-app routes.
- **`src/components/UserFilterChip.tsx`** — All / Victor / Nadia chip bound to
  the context. Rendered once in a slim shared header inside the router (not on
  Onboarding). Provides a `useOwnerFilter()` helper:
  `(items) => filter === 'all' ? items : items.filter(i => i.owner === filter)`.

## Creation forms — add `UserPicker`

Each defaults to `getLastOwner()` and calls `setLastOwner()` on submit.

- **NewProtocol.tsx** — picker; `saveProtocol({ ..., owner })`;
  `saveScheduledDoses(allDoses, owner)`.
- **VialInventory.tsx** — picker in add form; `saveVial({ ..., owner })`.
- **HealthMarkers.tsx** — picker in entry form; `saveHealthMarker({ ..., owner })`.
- **QuickLog.tsx / DoseActionSheet.tsx** — no picker; `logDose` inherits
  `owner: dose.owner`. (If a truly free-form manual-log entry exists, it gets a
  picker — verify during implementation.)
- **Protocols.tsx** — schedule regen uses `saveScheduledDoses(regen, protocol.owner)`.

## Display screens — badge + honor filter

Apply `<UserBadge>` to each item and pass lists through `useOwnerFilter()`:

- Dashboard (dose cards)
- Calendar (dose entries)
- Protocols (protocol list)
- DoseHistory (log rows)
- VialInventory (vial rows)
- HealthMarkers (entry list; chart uses the selected filter)
- Insights (respects filter)
- InjectionMap (per-person injection stats respect filter)

## Testing

- `users.ts`: `getLastOwner` default + round-trip through localStorage.
- `useOwnerFilter` filter helper: 'all' returns all; a user returns only that
  user's items (pure function, unit tested directly).
- Migration is exercised manually (idb upgrade) — verify existing records gain
  `owner: 'Victor'` and no data is lost after loading the app on an existing DB.

## Out of scope

- Adding/removing/renaming users.
- Per-user onboarding or settings.
- Per-user data export.
- Split multi-series charts.
- Any auth / password protection (shared trusted device).

## Risk & rollback

- Migration is additive and idempotent; existing data is never deleted.
- If the migration misbehaves, users can restore via the existing
  Export/Import JSON. Version bump is the only schema change.
