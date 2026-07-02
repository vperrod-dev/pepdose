import { USERS, USER_COLORS } from '../data/users';
import { useViewFilter } from '../context/ViewFilterContext';
import type { ViewFilter } from '../context/ownerFilter';

const OPTIONS: { value: ViewFilter; label: string }[] = [
  { value: 'all', label: 'Both' },
  ...USERS.map((u) => ({ value: u as ViewFilter, label: u })),
];

export function UserFilterChip() {
  const { filter, setFilter } = useViewFilter();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-bg-raised border border-border p-0.5" role="group" aria-label="Filter by user">
      {OPTIONS.map((opt) => {
        const active = filter === opt.value;
        const color = opt.value === 'all' ? undefined : USER_COLORS[opt.value as (typeof USERS)[number]];
        return (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            aria-pressed={active}
            className={`tap-target px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              active ? 'text-bg' : 'text-text-muted'
            }`}
            style={active ? { backgroundColor: color ?? 'var(--color-primary)' } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
