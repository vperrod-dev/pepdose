# Decision Document: Custom Domains vs `*.pages.dev` for pepdose PWA origin

## Scope
This document evaluates two hosting-origin options for pepdose as part of migrating off GitHub Pages/Actions while the account is blocked (GitHub ticket 4583559). The chosen option will become the app's permanent production origin.

Current production serving: Vite build exported from `dist/`, rsynced by `scripts/deploy.sh` to `/srv/pepdose`, served by Caddy as `https://claude-dev-vperrod.westeurope.cloudapp.azure.com/pepdose/`.

---

## 1. Option summaries

### Option A — Keep subpath on current Azure hostname
- **Origin:** `https://claude-dev-vperrod.westeurope.cloudapp.azure.com`
- **App base path:** `/pepdose/`
- **Mechanism:** Caddy `handle_path /pepdose*` serving static `dist/` from `/srv/pepdose`.
- **HTTPS:** Provided by existing wildcard Azure cloudapp cert; already live and renewing.

### Option B — New custom domain
- **Origin:** Something like `https://pepdose.example.com`
- **App base path:** `/` or retained `/pepdose/`
- **Mechanism:** Add a new DNS `A`/`CNAME` record to the VM, add an external TLS cert or use Caddy's automatic HTTPS for that hostname, and route with a new `claude-dev`-domain or separate block in `/etc/caddy/Caddyfile`.
- **HTTPS:** Caddy automatic HTTPS from Let's Encrypt, or leverage an existing Azure cert if the hostname sits under the same cloudapp domain.

### Option C — Switch to a `*.pages.dev` origin
- **Origin:** `https://<repo-name>.pages.dev`
- **Mechanism:** Serve from Cloudflare Pages (or similar) on the Pages dev subdomain; use a `/base` path and route there.
- **HTTPS:** Cloudflare-managed on the `pages.dev` domain.
- **Platform dependency:** Lock-in to Cloudflare's Pages platform and its URL policy for the project's lifetime.

---

## 2. Evaluation against PWA-specific requirements

| Requirement | Azure hostname (current) | Custom domain | `*.pages.dev` |
| --- | --- | --- | --- |
| HTTPS by default | ✅ | ✅ | ✅ |
| Stable origin for SW scope | ✅ | ✅ | ⚠️ |
| Manifest scope integrity | ✅ | ✅ | ⚠️ |
| Installability (add to home screen) | ✅ | ✅ | ⚠️ |

Notes:
- Spotify and other Chromium-based installors require a stable origin when applying manifest scope. Origin = scheme + host + port.
- Both options A and B provide a fully stable HTTPS origin.
- Option C's `*.pages.dev` origin is "subdomain-stable" but depends on the Pages platform keeping the repo name mapping consistent. Cloudflare has rotated some pages.dev subdomains under account linking changes; it's acceptable but weaker than a domain you own.

---

## 3. URL permanence risks

### Azure hostname
- Owned by the Azure subscription.
- Risk is infra-lifecycle (VM deletion, subscription cancellation).
- If the VM moves to a new subscription/region, the DNS label should be recreated.
- Extremely stable as long as the VM stays; zero extra cost.

### Custom domain
- Owned by you wherever registered.
- You can point it anywhere later; it outlives the hosting platform.
- Recurring registrar fee.
- Moving platforms later just requires DNS + Caddy/V Host update; app base path stays.

### `*.pages.dev`
- Do not own the domain itself.
- Platform-controlled: repo rename or host/product change can invalidate origin.
- Platform terms/policy can change (scheme deprecation, project limits, domain reuse rules).
- URL has lower perceived permanence when cached in service workers/manifests installed long-term.

Verdict: Custom domain wins for true permanence. Current Azure hostname is very close second. `pages.dev` is weakest.

---

## 4. Migration effort, maintenance, and cost

| | Azure hostname | Custom domain | `pages.dev` |
| --- | --- | --- | --- |
| Migration effort | Minimal (already running) | Medium: buy registrar entry + update Caddyfile + duplicate cert/issuance | Medium: CI adjust + manifest/code base path cleanup if needed |
| Long-term maintenance | Zero extra | Registrar renewal + DNS edits | Platform updates, possible future router/lock-in issues |
| Cost | $0 | ~$5–15/year | $0 |

Notes:
- Migration to Pages from a subpath app is nontrivial; you have to change Vite `base`, asset paths, and SW `BASE`, plus manifest `start_url`, `scope`, `id`. That is a code change, not just infra.
- Custom domain initially costs money and configuration time, but afterward only needs annual domain renewal and an unchanged build.
- The current Azure path already works, is free, and matches your existing deploy workflow (`scripts/deploy.sh`).

---

## 5. Edge cases and risks specific to pepdose

- Service worker scope/cache: `public/sw.js` uses `const BASE = '/pepdose/'`. Every SW precache URL includes this prefix. Changing base path breaks the cache unless you version the cache name and force-update all clients. This applies to any path/base change, whether Pages or custom domain.
- Manifest `start_url` and `scope`: currently `/pepdose/`. iOS/Android install flows are sensitive to exact start_url matching. Both Azure hostname and custom domain work; Pages would also work but is less durable.
- Offline reminders: `notificationclick` in `sw.js` navigates back to `BASE`. Same-origin policy is satisfied by HTTPS. Either Azure hostname or custom domain is sufficient.
- Backup/restore user trust: a stable origin reduces the chance of obscure "different origin" issues if logins/cloud sync roams between devices later.
- Account safety fallback: if Azure subscription access lapses or the VM is reclaimed, a custom domain can be repointed faster than waiting for Pages/Cloudflare account recovery.

---

## 6. Recommendation

### Primary recommendation: keep the current Azure hostname until a custom domain is ready.

Why:
1. It is already live, tested, and working with no cost.
2. It satisfies all PWA requirements: HTTPS, stable origin, SW scope, manifest `start_url/scope`.
3. The repo's deploy workflow is already wired to it (`scripts/deploy.sh`, `vite.config.ts` base `/pepdose/`).
4. There is no immediate urgency to change, and the account-block situation is temporary in nature.

### Follow-up: buy a custom domain when it's convenient.

Once registered, migration steps are small:
- Add DNS to VM's Azure hostname or point to VM IP.
- Add an extra `pepdose.<your-domain>` route in `/etc/caddy/Caddyfile`.
- Reissue/provision automatic HTTPS for the new hostname via Caddy or Azure DNS cert.
- Optionally switch app base to `/` or keep `/pepdose/`; deploy changes and bump cache name in `public/sw.js`.

### Avoid: moving to `*.pages.dev` as the long-term production origin.

The subdomain ownership risk, platform lock-in, and required base-path rewrite are not justified when the Azure hostname already answers every requirement at zero cost.

---

## 7. Tradeoffs

| Tradeoff | Outcome |
| --- | --- |
| Cost now vs future | Azure hostname = $0 today; custom domain = small recurring cost for stronger permanence. |
| Speed to stable install | Same. Both Azure hostname and custom domain are identical from the browser side. |
| Flexibility | Custom domain best; Azure hostname next; Pages worst. |
| Operational effort | Azure hostname least; Pages medium due to base-path migration; custom domain slightly more than Azure hostname but manageable. |

---

## 8. Follow-up actions

1. Leave current Azure hostname as production origin. No base-path or SW changes required.
2. When a custom domain is registered, plan migration before adding Supabase OAuth with strict origin allowlisting.
3. If future monetization adds user accounts, buy the domain before launch so you control the `redirect_uris` and `origin` surface.
4. Do not rename the repo or switch to GitHub Pages until account block is lifted and this decision is revisited.

---

Document produced on 2026-07-30 for the pepdose project repo.
