import { useId } from 'react';

export const PEN_COLOR_OPTIONS = ['Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Red', 'Gray', 'Clear', 'Silver', 'Gold', 'Pink'];

const PEN_COLOR_HEX: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  red: '#ef4444',
  gray: '#94a3b8',
  clear: '#cbd5e1',
  silver: '#cbd5e1',
  gold: '#eab308',
  pink: '#ec4899',
};
const DEFAULT_PEN_COLOR_HEX = '#94a3b8';

/** Resolves a (possibly custom, free-typed) pen colour to a CSS colour for dots/strips.
 *  Falls back to a neutral gray for anything outside the preset list. */
export function penColorHex(color?: string): string {
  if (!color) return DEFAULT_PEN_COLOR_HEX;
  return PEN_COLOR_HEX[color.trim().toLowerCase()] ?? DEFAULT_PEN_COLOR_HEX;
}

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
