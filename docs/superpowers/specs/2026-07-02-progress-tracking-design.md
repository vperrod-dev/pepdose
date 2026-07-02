# Progress Tracking — Design Spec

**Date:** 2026-07-02
**Status:** Awaiting user review

## Goal

Let the user record body-progress data over time: body measurements (waist, chest,
arms, etc.) and progress photos ("snaps"). Weight and body-fat are already tracked
in the HealthMarkers page and are NOT re-implemented here.

## Context

`HealthMarkers.tsx` already logs `weight`, `bodyFatPct`, and other metrics into
date-keyed `healthMarkers` IndexedDB records, and renders recharts trend lines.
DB schema is at version 1. Export/import (`operations.ts`) serializes all stores to
JSON. This is a static, no-server PWA — all data stays on-device.

## Design

Work is split by the nature of the data:

### 1. Body measurements — extend HealthMarkers (no new page/store)

- Add optional field to `HealthMarker` (schema.ts):
  `measurements?: Record<string, number>`
- Measurement keys (fixed set, cm): `waist`, `chest`, `hips`, `shoulders`, `neck`,
  `armL`, `armR`, `thighL`, `thighR`, `calfL`, `calfR`.
- UI: collapsible "Body measurements" section in the existing HealthMarkers form.
  Empty inputs are omitted from the saved `measurements` object.
- Trends: add measurement keys as selectable lines in the existing `CHART_LINES`
  chart. Reads from `marker.measurements[key]`.
- No DB version bump needed for this (new optional field on existing record).

### 2. Progress photos — new store + new page

- New IndexedDB object store `progressPhotos` (requires DB bump v1 -> v2 with an
  `upgrade` branch that creates the store; existing stores untouched).
  Record shape:
  ```ts
  interface ProgressPhoto {
    id: string;
    date: string;              // yyyy-MM-dd
    blob: Blob;                // image bytes, on-device only
    pose?: 'front' | 'side' | 'back';
    note?: string;
    weightAtCapture?: number;  // optional snapshot for context
    createdAt: string;
  }
  ```
  Index: `by-date`.
- New operations in `operations.ts`:
  `saveProgressPhoto`, `getProgressPhotos(range?)`, `deleteProgressPhoto(id)`.
- New page `ProgressPhotos.tsx` at route `/progress`:
  - Add-photo control: `<input type="file" accept="image/*" capture="environment">`
    so mobile opens the camera; desktop opens file picker. Optional pose + note.
  - Gallery: photos grouped by date, newest first, rendered from object URLs
    (`URL.createObjectURL`, revoked on unmount).
  - Compare: tap two photos to see them side-by-side (before / after). No slider/overlay.
  - Delete photo (with confirm).
- Nav entry added (BottomNav / More menu, matching existing pattern) + route in `App.tsx`.

Photos live in their own page/store so the already-large `HealthMarkers.tsx` does
not take on media handling.

### 3. Export / Import

- `measurements` is inside healthMarker records — exported/imported for free.
- Add `progressPhotos` to `exportAllData`, `importData`, `clearAllData` store lists.
- Blobs are not JSON-serializable: encode each photo's `blob` to a base64 data URL
  on export, decode back to a Blob on import. Bump export `version` to 2; importer
  tolerates v1 files (no `progressPhotos` key).
- Rationale for including photos: on a health-tracking PWA, silent photo loss on a
  device/browser reset is worse than a larger backup file.

## Testing

- Unit test a pure `measurements` serialize/prune helper (drops empty fields).
- Unit test base64 <-> Blob round-trip for photo export/import.
- Manual: log measurements -> appears in trends; add photo on mobile via camera ->
  shows in gallery; compare two; export -> import into a cleared DB restores both.

## Decisions (defaults — flag to change)

- Measurement unit: **cm only**, no cm/in toggle (YAGNI).
- Photos **included** in JSON export as base64.
- Compare = 2-photo side-by-side, no overlay/slider.
- Fixed measurement key set (no user-defined custom measurements).

## Out of scope

- Cloud sync / server upload.
- Photo editing, cropping, auto-alignment.
- PIN/biometric gate on photos.
- Weight migration (weight stays in HealthMarkers).
