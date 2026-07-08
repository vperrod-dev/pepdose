-- pepdose cloud sync store.
-- One generic table holds every record kind as jsonb, so evolving the TS
-- interfaces never requires a DB migration. Sync is union-merge (LWW): the
-- client compares updated_at and keeps the newer row. `deleted` is a tombstone.

create table if not exists records (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  kind       text        not null,   -- protocols | scheduledDoses | doseLogs | vials | healthMarkers | editHistory
  id         text        not null,   -- the record's own uuid
  data       jsonb       not null,
  updated_at timestamptz not null,
  deleted    boolean     not null default false,
  primary key (user_id, kind, id)
);

create index if not exists records_user_kind_idx on records (user_id, kind);

-- Row-level security: an account can only ever see/write its own rows.
alter table records enable row level security;

create policy "own rows: select" on records
  for select using (auth.uid() = user_id);

create policy "own rows: insert" on records
  for insert with check (auth.uid() = user_id);

create policy "own rows: update" on records
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows: delete" on records
  for delete using (auth.uid() = user_id);
