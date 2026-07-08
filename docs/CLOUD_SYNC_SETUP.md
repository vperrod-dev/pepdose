# Cloud sync setup (Supabase)

pepdose now syncs protocols, doses, vials, and health markers across devices via a
free Supabase project. Without the two env vars below, the app stays 100% local
(no login) — exactly as before. Nothing breaks if you never do this.

**Your existing phone data is never at risk.** Sync is a *union-merge*: it only
ever copies rows between devices, never wipes a side. The first time you sign in
on your phone (which has the data), that data is pushed up; the empty desktop then
pulls it down. Belt-and-suspenders: hit **More → Export/Import → Export Backup** on
your phone first.

## One-time setup (~10 min, needs your account)

### 1. Create the project
- Go to https://supabase.com → New project (free tier). Pick a region near you.
- Wait for it to provision.

### 2. Create the table
- Left sidebar → **SQL Editor** → New query.
- Paste the entire contents of `supabase/migrations/0001_init.sql` and **Run**.
- This creates the `records` table with Row-Level Security (each account sees only
  its own rows).

### 3. Grab your two keys
- Left sidebar → **Project Settings → API**.
- Copy **Project URL** and the **anon / public** key.

### 4. Local dev
Create `.env.local` in the repo root (gitignored):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Run `npm run dev` — you'll now get a login screen.

### 5. Live site (GitHub Pages)
- Repo → **Settings → Secrets and variables → Actions → New repository secret**.
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values.
- The deploy workflow already reads them. Next push to `main` builds with sync on.

### 6. Create the shared login
- On the live site or dev, click **Create account**, use one email + password that
  you and Nadia both use (one shared account holds both of your data — the in-app
  Victor/Nadia filter still separates it).
- If email confirmation is on (Supabase default), click the link in the email, then
  sign in. To skip confirmation: Supabase → **Authentication → Providers → Email** →
  turn off "Confirm email".
- Sign in on your phone first (seeds the cloud from your real data), then on desktop.

## How sync behaves
- Merges on login, on window focus, every 30s while open, and on close.
- Newer edit wins on conflict (each record stamps `updatedAt`).
- **Deletes do not yet propagate** across devices (a row deleted on one device can
  reappear from another). This is the deliberately-safe direction. Add tombstones
  later if it becomes annoying (the `deleted` column already exists).
- Manual **Sync now** + **Sign out** live on the Export/Import page.
