---
name: verify
description: Build, launch, and drive pepdose in a headless browser to verify changes at the UI surface.
---

# Verifying pepdose at runtime

Build + serve (local-only mode, no cloud gate — env vars are baked at BUILD time):

```bash
VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npx vite build --outDir /tmp/dist-local
npx vite preview --outDir /tmp/dist-local --port 4189 --strictPort   # app at /pepdose/
```

Plain `npm run build` picks up `.env.local` → cloud login gate appears (safe to
render, do NOT sign in from test scripts — it's Victor's real Supabase).

Drive with Playwright (python3, installed at ~/.local). Gotchas learned 2026-07-17:

- First visit shows an onboarding carousel; skip it with
  `localStorage.setItem('pepdose-onboarded','true')` before loading.
- `indexedDB.deleteDatabase`/versioned `open` HANG while the app's connection is
  open — run IDB seeding from a static page (`/pepdose/manifest.json`), then
  navigate back into the SPA.
- Protocol delete path: tap protocol card → "Manage" → "Delete Protocol" → confirm
  button "Delete Protocol" in the sheet.
- Import: `page.expect_file_chooser()` around clicking "Import Backup" (input is
  created dynamically). Success message auto-reloads the page after 800ms.
- Read app state via `page.evaluate` opening `indexedDB.open('pepdose')` with NO
  version (versioned opens hang, see above).
