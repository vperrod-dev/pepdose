import { USER_COLORS, type UserName } from '../data/users';

export function UserBadge({ owner, className = '' }: { owner: UserName; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-bg ${className}`}
      style={{ backgroundColor: USER_COLORS[owner] }}
    >
      {owner}
    </span>
  );
}
