import { useId } from 'react';

export const PEN_COLOR_OPTIONS = ['Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Red', 'Gray', 'Clear', 'Silver', 'Gold', 'Pink'];

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
