# Pen Colour Field — Design

## Problem

A stacked protocol has one pen per peptide. Nothing on the injection screens says
which physical pen (by colour) goes with which peptide, so at log time it's a
guess.

## Data Model

Add `penColor?: string` to the dose-config object in `UserProtocol['doses'][number]`
(`src/db/schema.ts`), alongside the existing `recon?: ReconMix` field. Free-form
string (not an enum) so it can be typed or picked. No IndexedDB version bump
needed — `doses` is a plain inline object type and `recon` was added the same way.

## Input

New `src/components/PenColorField.tsx`, sibling to `ReconMixFields.tsx`:
a labeled `<input list="pen-colors">` bound to a shared `<datalist>` of common
pen-cap colours (Blue, Green, Yellow, Orange, Purple, Red, Gray, Clear). A native
datalist input gives both dropdown-select and free-type in one element — no
custom picker component required. The colour option list is exported as a
constant so both config screens use the same suggestions.

## Wiring

Follows the existing `recon` wiring exactly, in the same 5 files:

1. **`src/pages/NewProtocol.tsx`** — `PenColorField` rendered next to
   `ReconMixFields` in the per-peptide config card. `penColor` added to the local
   `PeptideConfig` interface and threaded into `saveProtocol`'s `doses` array.
2. **`src/pages/Protocols.tsx`** (edit sheet) — `PenColorField` next to the
   existing `ReconMixFields` in the dose-edit loop. Flows through
   `updateEditDose` → `handleSaveEdit` → `updateProtocol` with no extra plumbing,
   since `editDoses` is already `UserProtocol['doses']`.
3. **`src/components/DoseActionSheet.tsx`** — the existing
   `getProtocol(dose.protocolId).then(...)` effect that resolves `recon` also
   resolves `penColor` from the same `.find()`. Rendered as a small badge next
   to the `clicks` text.
4. **`src/pages/Dashboard.tsx`** — the existing per-row `.find(...).recon`
   lookup gets `.penColor` alongside it; badge next to the clicks text on each
   upcoming-dose row.
5. **`src/pages/Calendar.tsx`** — identical treatment on the day-list rows.

## Out of Scope

- No enum/validation on colour — free text is the point.
- No per-template default colours (`ProtocolTemplate` unchanged) — the user
  assigns the physical pen's colour once, after picking it, per protocol.
- No new tests — this is a pass-through display field, not scheduling/business
  logic. (No `.test.ts` precedent for `recon` either.)

## Testing / Verification

Manual: create a protocol with 2+ peptides, set different pen colours, confirm
they persist through edit, and show correctly on Dashboard/Calendar rows and in
the DoseActionSheet log screen. `npm run build` + `npm test` must stay green
(no scheduling-engine or data-integrity code touched).
