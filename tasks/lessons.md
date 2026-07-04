# pepdose — lessons

> After ANY correction from the user: record the pattern here so the mistake isn't repeated.
> Review at session start.

- **Numeric inputs must be string-backed.** A controlled `type="number"` bound to
  numeric state with `parseFloat(e.target.value) || 0` snaps decimals and clears to
  `0` mid-typing — and if a Save button is disabled on `value <= 0`, edits silently
  fail. This was the user's original "changing the dose doesn't save" bug. Use
  `src/components/DecimalInput.tsx` (parses at save time) for any decimal field.
