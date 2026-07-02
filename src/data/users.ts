export type UserName = 'Victor' | 'Nadia';

export const USERS: UserName[] = ['Victor', 'Nadia'];

export const USER_COLORS: Record<UserName, string> = {
  Victor: '#3b82f6', // blue
  Nadia: '#ec4899', // pink
};

const LAST_OWNER_KEY = 'pepdose-last-owner';

export function getLastOwner(): UserName {
  const raw = localStorage.getItem(LAST_OWNER_KEY);
  return raw === 'Nadia' ? 'Nadia' : 'Victor';
}

export function setLastOwner(owner: UserName): void {
  localStorage.setItem(LAST_OWNER_KEY, owner);
}
