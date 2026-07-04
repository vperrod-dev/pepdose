import { useState, useEffect } from 'react';

interface DecimalInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  step?: number | string;
  min?: number;
  placeholder?: string;
  'aria-label'?: string;
}

/**
 * A number input that keeps its own string state so intermediate edits
 * ("", "0.", "2.5") survive typing instead of being coerced to a number on
 * every keystroke. The parent still receives a parsed number via onChange.
 *
 * This fixes the class of bug where a controlled `type="number"` bound to a
 * numeric state snaps the field (dropping trailing dots, forcing 0 on clear),
 * which made decimal doses impossible to type and could trap save buttons.
 */
export function DecimalInput({ value, onChange, step = 'any', min, ...rest }: DecimalInputProps) {
  const [text, setText] = useState(() => formatNum(value));

  // Re-sync from the outside only when the parent value diverges from what the
  // current text represents (e.g. a programmatic reset), never mid-typing.
  useEffect(() => {
    if (parseFloat(text) !== value && !(text === '' && Number.isNaN(value))) {
      setText(formatNum(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      value={text}
      onChange={e => {
        const raw = e.target.value;
        setText(raw);
        const n = parseFloat(raw);
        if (Number.isFinite(n)) onChange(n);
      }}
      onBlur={() => {
        // Normalize a left-over partial value ("", "2.") on blur.
        const n = parseFloat(text);
        setText(Number.isFinite(n) ? formatNum(n) : '');
      }}
      {...rest}
    />
  );
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '';
  return String(parseFloat(n.toPrecision(10)));
}
