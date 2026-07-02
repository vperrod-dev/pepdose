# Progress Tracking — Design Spec

**Date:** 2026-07-02
**Status:** Awaiting user review

## Goal

Let the user record body measurements (waist, chest, arms, etc.) over time to track
progress. Weight and body-fat are already tracked in HealthMarkers and are NOT
re-implemented. Progress photos are **out of scope** (user dropped them).

## Context

`HealthMarkers.tsx` already logs `weight`, `bodyFatPct`, and other metrics into
date-keyed `healthMarkers` IndexedDB records, and renders recharts trend lines.
Static, no-server PWA — all data on-device.

## Design — extend HealthMarkers only

- Add optional field to `HealthMarker` (schema.ts):
  `measurements?: Record<string, number>`
- Measurement keys (fixed set, cm): `waist`, `chest`, `hips`, `shoulders`, `neck`,
  `armL`, `armR`, `thighL`, `thighR`, `calfL`, `calfR`.
- UI: collapsible "Body measurements" section in the existing HealthMarkers form.
  Empty inputs are pruned from the saved `measurements` object.
- Trends: add measurement keys as selectable lines in the existing `CHART_LINES`
  chart, reading `marker.measurements[key]`.
- No new page, no new store, no DB version bump (new optional field on existing record).
- Export/import: `measurements` rides inside healthMarker records — no changes needed.

## Testing

- Unit test a pure `pruneMeasurements` helper (drops empty/NaN fields, keeps numbers).
- Manual: enter measurements -> save -> reload shows values -> trend line renders ->
  export/import round-trips.

## Decisions

- Measurement unit: **cm only**, no cm/in toggle (YAGNI).
- Fixed measurement key set (no user-defined custom measurements).

## Out of scope

- Progress photos (dropped by user).
- Cloud sync / server upload.
- Weight migration (stays in HealthMarkers).
