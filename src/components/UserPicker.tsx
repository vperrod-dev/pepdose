import { USERS, USER_COLORS, type UserName } from '../data/users';

interface UserPickerProps {
  value: UserName;
  onChange: (owner: UserName) => void;
  label?: string;
}

export function UserPicker({ value, onChange, label = 'For' }: UserPickerProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1.5">{label}</label>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label={label}>
        {USERS.map((user) => {
          const active = value === user;
          return (
            <button
              key={user}
              type="button"
              onClick={() => onChange(user)}
              aria-pressed={active}
              className={`tap-target min-h-11 rounded-xl border text-sm font-semibold transition-colors ${
                active ? 'text-bg border-transparent' : 'text-text-muted border-border bg-bg-raised'
              }`}
              style={active ? { backgroundColor: USER_COLORS[user] } : undefined}
            >
              {user}
            </button>
          );
        })}
      </div>
    </div>
  );
}
