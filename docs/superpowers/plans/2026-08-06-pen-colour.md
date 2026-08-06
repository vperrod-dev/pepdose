# Pen Colour Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a protocol record which physical pen (by colour) goes with each peptide, so the injection screens can remind the user which pen to grab.

**Architecture:** Add an optional `penColor?: string` field to the existing per-peptide dose-config object (`UserProtocol['doses'][number]`, alongside `recon`). A new small `PenColorField` component (native `<input list>` + `<datalist>`) lets the user pick a common colour or type a custom one. Wire it into the same 5 places that already carry `recon` through the app: the two config/edit screens (write path) and DoseActionSheet/Dashboard/Calendar (read/display path).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, idb (IndexedDB) — no new dependencies.

## Global Constraints

- No IndexedDB schema/version bump — `doses` is a plain inline object type; adding an optional field is additive, same as when `recon` was added.
- No enum/validation on the colour value — free text is the point (per spec: "select or type").
- No per-template default colours — `ProtocolTemplate` (`src/data/protocols.ts`) is untouched.
- No new `.test.ts` files — this is a pass-through display field, not scheduling/business logic (no test precedent for `recon` either). Verification is `npm run build` (type-check) after each task plus one end-to-end manual/browser pass at the end.
- Follow existing code style exactly: Tailwind utility classes matching sibling fields (`text-xs text-text-muted`, `bg-bg-raised border border-border rounded-lg`, etc.) — copy from the anchors named in each task, don't invent new styling.

---

### Task 1: Schema field + `PenColorField` component

**Files:**
- Modify: `src/db/schema.ts:19`
- Create: `src/components/PenColorField.tsx`

**Interfaces:**
- Produces: `PEN_COLOR_OPTIONS: string[]` (exported constant), `PenColorField({ value, onChange }: { value?: string; onChange: (value: string) => void })` (exported component). Later tasks import both from `'../components/PenColorField'`.

- [ ] **Step 1: Add `penColor` to the schema**

In `src/db/schema.ts`, line 19 currently reads:

```ts
  doses: { peptideId: string; dose: number; unit: 'mcg' | 'mg' | 'IU'; frequency: string; timesPerDay?: number; timeOfDay: string; durationWeeks?: number; customFrequencyDays?: number; schedulePhases?: SchedulePhase[]; variantId?: string; recon?: ReconMix }[];
```

Change it to:

```ts
  doses: { peptideId: string; dose: number; unit: 'mcg' | 'mg' | 'IU'; frequency: string; timesPerDay?: number; timeOfDay: string; durationWeeks?: number; customFrequencyDays?: number; schedulePhases?: SchedulePhase[]; variantId?: string; recon?: ReconMix; penColor?: string }[];
```

- [ ] **Step 2: Create the `PenColorField` component**

Create `src/components/PenColorField.tsx`:

```tsx
import { useId } from 'react';

export const PEN_COLOR_OPTIONS = ['Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Red', 'Gray', 'Clear'];

interface PenColorFieldProps {
  value?: string;
  onChange: (value: string) => void;
}

export function PenColorField({ value, onChange }: PenColorFieldProps) {
  const listId = useId();
  return (
    <div className="mt-3">
      <label className="text-xs text-text-muted block mb-1">Pen Colour</label>
      <input
        type="text"
        list={listId}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. Blue"
        className="w-full bg-bg-raised border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <datalist id={listId}>
        {PEN_COLOR_OPTIONS.map(c => <option key={c} value={c} />)}
      </datalist>
    </div>
  );
}
```

Note: `useId()` gives each rendered instance its own `<datalist>` id — required because both config screens render one `PenColorField` per peptide in a loop, and duplicate DOM ids would make the browser match the wrong datalist.

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/db/schema.ts src/components/PenColorField.tsx
git commit -m "feat: add penColor field to dose config schema and input component"
```

---

### Task 2: Wire into New Protocol screen

**Files:**
- Modify: `src/pages/NewProtocol.tsx`

**Interfaces:**
- Consumes: `PenColorField` and `PEN_COLOR_OPTIONS` from Task 1 (only `PenColorField` is needed here).

- [ ] **Step 1: Add `penColor` to the local `PeptideConfig` interface**

In `src/pages/NewProtocol.tsx`, the interface at line 50 ends with:

```ts
  // How the vial was mixed — drives the "clicks per dose" hint.
  recon?: ReconMix;
}
```

Add a field after `recon`:

```ts
  // How the vial was mixed — drives the "clicks per dose" hint.
  recon?: ReconMix;
  penColor?: string;
}
```

- [ ] **Step 2: Import the component**

Add to the import block near the top (alongside the `ReconMixFields` import at line 15):

```ts
import { PenColorField } from '../components/PenColorField';
```

- [ ] **Step 3: Render the field in the config card**

In the per-peptide config card, `ReconMixFields` is rendered at the end of the card (around line 554-559):

```tsx
                <ReconMixFields
                  value={config.recon}
                  dose={config.dose}
                  unit={config.unit}
                  onChange={mix => updateConfig(idx, { recon: mix })}
                />
```

Add `PenColorField` directly after it:

```tsx
                <ReconMixFields
                  value={config.recon}
                  dose={config.dose}
                  unit={config.unit}
                  onChange={mix => updateConfig(idx, { recon: mix })}
                />

                <PenColorField
                  value={config.penColor}
                  onChange={color => updateConfig(idx, { penColor: color })}
                />
```

(`updateConfig` already exists at line 164 and merges partial updates into `peptideConfigs[idx]` — no change needed there.)

- [ ] **Step 4: Thread `penColor` into `saveProtocol`**

In `createProtocol()`, the `doses` array passed to `saveProtocol` (around line 189-201) currently reads:

```ts
      doses: peptideConfigs.map(c => ({
        peptideId: c.peptideId,
        dose: c.dose,
        unit: c.unit,
        frequency: c.frequency,
        customFrequencyDays: c.customFrequencyDays,
        timesPerDay: c.timesPerDay,
        timeOfDay: c.timeOfDay,
        durationWeeks: c.durationWeeks ?? durationWeeks,
        schedulePhases: c.schedulePhases,
        variantId: c.variantId,
        recon: c.recon,
      })),
```

Add `penColor: c.penColor,` after `recon: c.recon,`:

```ts
      doses: peptideConfigs.map(c => ({
        peptideId: c.peptideId,
        dose: c.dose,
        unit: c.unit,
        frequency: c.frequency,
        customFrequencyDays: c.customFrequencyDays,
        timesPerDay: c.timesPerDay,
        timeOfDay: c.timeOfDay,
        durationWeeks: c.durationWeeks ?? durationWeeks,
        schedulePhases: c.schedulePhases,
        variantId: c.variantId,
        recon: c.recon,
        penColor: c.penColor,
      })),
```

- [ ] **Step 5: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/NewProtocol.tsx
git commit -m "feat: capture pen colour when creating a protocol"
```

---

### Task 3: Wire into Protocol edit screen

**Files:**
- Modify: `src/pages/Protocols.tsx`

**Interfaces:**
- Consumes: `PenColorField` from Task 1. `editDoses` is already typed as `UserProtocol['doses']` (line 78), so it already carries `penColor?: string` after Task 1 — no type changes needed in this file.

- [ ] **Step 1: Import the component**

Add to the import block near the top (alongside the `ReconMixFields` import at line 17):

```ts
import { PenColorField } from '../components/PenColorField';
```

- [ ] **Step 2: Render the field in the dose-edit loop**

`ReconMixFields` is rendered per-dose around line 914-919:

```tsx
                        <ReconMixFields
                          value={dose.recon}
                          dose={dose.dose}
                          unit={dose.unit}
                          onChange={mix => updateEditDose(idx, { recon: mix })}
                        />
```

Add `PenColorField` directly after it:

```tsx
                        <ReconMixFields
                          value={dose.recon}
                          dose={dose.dose}
                          unit={dose.unit}
                          onChange={mix => updateEditDose(idx, { recon: mix })}
                        />

                        <PenColorField
                          value={dose.penColor}
                          onChange={color => updateEditDose(idx, { penColor: color })}
                        />
```

(`updateEditDose` already exists at line 254, typed `Partial<UserProtocol['doses'][0]>` — accepts `penColor` with no change. `handleSaveEdit` already saves the whole `editDoses` array via `updateProtocol(activeProto.id, { ..., doses: editDoses })` at line 242-247 — no change needed there.)

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Protocols.tsx
git commit -m "feat: edit pen colour on an existing protocol"
```

---

### Task 4: Show pen colour in the Dose Action Sheet

**Files:**
- Modify: `src/components/DoseActionSheet.tsx`

**Interfaces:**
- Consumes: nothing new exported — reads `penColor` off the same protocol-dose object `recon` already comes from.

- [ ] **Step 1: Add `penColor` state and resolve it alongside `recon`**

The existing effect (lines 51-58) reads:

```tsx
  const [recon, setRecon] = useState<ReconMix | undefined>();
  useEffect(() => {
    let live = true;
    void getProtocol(dose.protocolId).then(p => {
      if (live) setRecon(p?.doses.find(d => d.peptideId === dose.peptideId)?.recon);
    });
    return () => { live = false; };
  }, [dose.protocolId, dose.peptideId]);
```

Change to also capture `penColor`:

```tsx
  const [recon, setRecon] = useState<ReconMix | undefined>();
  const [penColor, setPenColor] = useState<string | undefined>();
  useEffect(() => {
    let live = true;
    void getProtocol(dose.protocolId).then(p => {
      const doseConfig = p?.doses.find(d => d.peptideId === dose.peptideId);
      if (live) {
        setRecon(doseConfig?.recon);
        setPenColor(doseConfig?.penColor);
      }
    });
    return () => { live = false; };
  }, [dose.protocolId, dose.peptideId]);
```

- [ ] **Step 2: Render it next to the clicks line**

The header block (lines 178-184) reads:

```tsx
              <div>
                <p className="font-semibold text-sm">{dose.peptideName}</p>
                <p className="text-xs text-text-muted">
                  {(log?.dose ?? dose.dose)} {dose.unit} · {log?.date ?? dose.date} · {log?.time ?? dose.time}
                </p>
                {clicks && <p className="text-xs text-primary font-mono">{clicks}</p>}
              </div>
```

Add the pen colour line after `clicks`:

```tsx
              <div>
                <p className="font-semibold text-sm">{dose.peptideName}</p>
                <p className="text-xs text-text-muted">
                  {(log?.dose ?? dose.dose)} {dose.unit} · {log?.date ?? dose.date} · {log?.time ?? dose.time}
                </p>
                {clicks && <p className="text-xs text-primary font-mono">{clicks}</p>}
                {penColor && <p className="text-xs text-text-muted">Pen: {penColor}</p>}
              </div>
```

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/DoseActionSheet.tsx
git commit -m "feat: show pen colour in the dose action sheet"
```

---

### Task 5: Show pen colour on the Dashboard

**Files:**
- Modify: `src/pages/Dashboard.tsx`

**Interfaces:**
- Consumes: nothing new — extends the existing `DashboardDose` shape.

- [ ] **Step 1: Add `penColor` to the `DashboardDose` interface**

Lines 18-22 read:

```ts
interface DashboardDose extends ScheduledDose {
  peptideName: string;
  categoryColor: string;
  recon?: ReconMix;
}
```

Add `penColor?: string;` after `recon`:

```ts
interface DashboardDose extends ScheduledDose {
  peptideName: string;
  categoryColor: string;
  recon?: ReconMix;
  penColor?: string;
}
```

- [ ] **Step 2: Populate it in the enrichment map**

Line 60-68 reads:

```tsx
      const enriched: DashboardDose[] = withoutInactiveUpcoming(doses, activeIds).map(d => {
        const pep = getPeptideById(d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          categoryColor: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
          recon: protos.find(p => p.id === d.protocolId)?.doses.find(x => x.peptideId === d.peptideId)?.recon,
        };
      }).sort((a, b) => a.time.localeCompare(b.time));
```

Change the last line inside the object to resolve the dose-config once and pull both fields from it:

```tsx
      const enriched: DashboardDose[] = withoutInactiveUpcoming(doses, activeIds).map(d => {
        const pep = getPeptideById(d.peptideId);
        const doseConfig = protos.find(p => p.id === d.protocolId)?.doses.find(x => x.peptideId === d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          categoryColor: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
          recon: doseConfig?.recon,
          penColor: doseConfig?.penColor,
        };
      }).sort((a, b) => a.time.localeCompare(b.time));
```

- [ ] **Step 3: Render it next to the clicks line**

Lines 282-285 read:

```tsx
                    <p className="text-xs text-text-muted font-mono">
                      {shownDose} {dose.unit}
                    </p>
                    {clicks && <p className="text-[11px] text-primary font-mono">{clicks}</p>}
```

Add the pen colour line after `clicks`:

```tsx
                    <p className="text-xs text-text-muted font-mono">
                      {shownDose} {dose.unit}
                    </p>
                    {clicks && <p className="text-[11px] text-primary font-mono">{clicks}</p>}
                    {dose.penColor && <p className="text-[11px] text-text-muted">Pen: {dose.penColor}</p>}
```

- [ ] **Step 4: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: show pen colour on dashboard dose rows"
```

---

### Task 6: Show pen colour on the Calendar

**Files:**
- Modify: `src/pages/Calendar.tsx`

**Interfaces:**
- Consumes: nothing new — extends the existing `selectedDoses` shape (inferred from the `.map` return, no named interface to edit).

- [ ] **Step 1: Populate `penColor` in `selectedDoses`**

Lines 146-160 read:

```tsx
  const selectedDoses = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return (dosesByDate.get(key) || [])
      .map(d => {
        const pep = getPeptideById(d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          protocolName: protocolsById.get(d.protocolId)?.name ?? '',
          recon: protocolsById.get(d.protocolId)?.doses.find(x => x.peptideId === d.peptideId)?.recon,
          color: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, dosesByDate, protocolsById]);
```

Change to resolve the dose-config once and add `penColor`:

```tsx
  const selectedDoses = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return (dosesByDate.get(key) || [])
      .map(d => {
        const pep = getPeptideById(d.peptideId);
        const doseConfig = protocolsById.get(d.protocolId)?.doses.find(x => x.peptideId === d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          protocolName: protocolsById.get(d.protocolId)?.name ?? '',
          recon: doseConfig?.recon,
          penColor: doseConfig?.penColor,
          color: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, dosesByDate, protocolsById]);
```

- [ ] **Step 2: Render it next to the clicks line**

Lines 346-349 read:

```tsx
                    <p className="text-xs text-text-muted font-mono">
                      {doseLog?.dose ?? dose.dose} {dose.unit} · {dose.route === 'subq' ? 'SubQ' : dose.route}
                    </p>
                    {clicks && <p className="text-[11px] text-primary font-mono">{clicks}</p>}
```

Add the pen colour line after `clicks`:

```tsx
                    <p className="text-xs text-text-muted font-mono">
                      {doseLog?.dose ?? dose.dose} {dose.unit} · {dose.route === 'subq' ? 'SubQ' : dose.route}
                    </p>
                    {clicks && <p className="text-[11px] text-primary font-mono">{clicks}</p>}
                    {dose.penColor && <p className="text-[11px] text-text-muted">Pen: {dose.penColor}</p>}
```

- [ ] **Step 3: Type-check**

Run: `npm run build`
Expected: succeeds with no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Calendar.tsx
git commit -m "feat: show pen colour on calendar dose rows"
```

---

### Task 7: Full verification and deploy

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all existing tests pass (no test changes in this plan).

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: succeeds with no TypeScript errors.

- [ ] **Step 3: Manual browser verification**

Use the `projects/pepdose:verify` skill to drive the app headlessly, or `npm run dev` and check by hand:
1. New Protocol → pick a peptide → set "Pen Colour" to a preset (e.g. "Blue") and to a typed custom value (e.g. "Teal Stripe") on a 2-peptide protocol → create it.
2. Confirm both colours show correctly on the Dashboard row and the Calendar day-list row for today's doses.
3. Open a dose from Dashboard → confirm "Pen: <colour>" shows in the action sheet.
4. Protocols → open the protocol → edit → confirm the colours are pre-filled → change one → save → confirm it updates everywhere from step 2-3.

- [ ] **Step 4: Deploy**

Run: `scripts/deploy.sh`
Expected: builds and rsyncs `dist/` to `/srv/pepdose`. Confirm the live app at
https://claude-dev-vperrod.westeurope.cloudapp.azure.com/pepdose/ reflects the change (repeat a quick version of step 3 against the live URL).

- [ ] **Step 5: Final commit (if anything was left uncommitted)**

```bash
git status
```

If clean, nothing to do — every task above already committed its own change.
