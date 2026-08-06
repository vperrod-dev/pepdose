const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface WeekdayPickerProps {
  value?: number[];
  onChange: (days: number[]) => void;
}

export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const selected = new Set(value ?? []);
  function toggle(day: number) {
    const next = new Set(selected);
    if (next.has(day)) next.delete(day); else next.add(day);
    onChange([...next].sort((a, b) => a - b));
  }
  return (
    <div className="mt-3">
      <label className="text-xs text-text-muted block mb-1">Days of week</label>
      <div className="flex gap-1.5">
        {WEEKDAY_LABELS.map((label, day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            aria-pressed={selected.has(day)}
            aria-label={WEEKDAY_NAMES[day]}
            className={`flex-1 h-8 rounded-lg text-xs font-medium transition-colors ${
              selected.has(day)
                ? 'bg-primary text-bg'
                : 'bg-bg-raised border border-border text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
