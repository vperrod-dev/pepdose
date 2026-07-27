-- pepdose runs on a single shared account provisioned by the owner
-- (see src/components/AuthGate.tsx). The login form only signs in, but a
-- client-only gate can be bypassed by calling the auth API directly with the
-- anon key. Enforce it server-side: allow the first account (provisioning),
-- reject every signup after that — independent of the dashboard's
-- "Allow new users to sign up" toggle.
--
-- Rollback:
--   drop trigger if exists reject_extra_signups on auth.users;
--   drop function if exists public.reject_extra_signups();

create or replace function public.reject_extra_signups()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Before-insert view of auth.users: empty only for the very first account.
  if exists (select 1 from auth.users) then
    raise exception 'Signups are disabled: pepdose uses a single shared account.';
  end if;
  return new;
end;
$$;

drop trigger if exists reject_extra_signups on auth.users;
create trigger reject_extra_signups
  before insert on auth.users
  for each row
  execute function public.reject_extra_signups();
