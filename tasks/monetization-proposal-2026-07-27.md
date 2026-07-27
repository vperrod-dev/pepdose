# PepDose Monetization — Audit & Proposal (2026-07-27)

> **STATUS: PARKED — Victor, 2026-07-27: "too risky and too costly." Do not re-propose.**
> Audit findings remain valid reference. The Phase 0 hygiene items (false privacy claim,
> missing disclaimers, imperative dose wording) concern the *current* app regardless of
> monetization and were logged to the OS backlog as ordinary findings.

Four-track audit (multi-tenant readiness, competitive landscape, compliance/liability, product gaps) synthesized into a phased plan. Verdict up front, detail after. Nothing here is legal advice; the compliance track is an engineering-side risk map.

---

## Verdict

**Worth doing — with two non-negotiable pre-conditions.** The market is hot and pricing is proven ($4.99/mo cluster, category leader Shotsy at 100k downloads/8 months). PepDose's feature depth already beats most of the ~15 clone apps, and web-first + local-first are genuine structural advantages (no Apple gatekeeper, minimal GDPR surface). But:

1. **The app must be de-fanged before it takes money.** Several features are app-originated dose recommendations (MDR medical-device territory + product-liability exposure under the new PLD 2024/2853). Framing changes fix most of it; one feature (proportional ladder auto-rescaling) should be cut.
2. **The account model must be rebuilt.** Today the DB literally rejects every signup after the first (`0002_reject_extra_signups.sql`) and the UI offers "Victor/Nadia" to strangers. No customers are possible until this is replaced.

Total effort: **~18–22 dev-days** of code + external legal spend (solicitor for ToS/privacy + optionally an MDR borderline determination). Revenue realism: niche — 100 subscribers ≈ €4–5k/yr, 1,000 ≈ €40–50k/yr; near-zero running cost, so small numbers are still profit.

---

## 1. Market & pricing (research track)

### Competitive landscape (July 2026)

| App | Platform | Price | Traction |
|---|---|---|---|
| **Shotsy** (GLP-1) | iOS+Android | Free + $49.99/yr | 100k+ downloads/8mo, 4.8★, $2.25M seed — category leader |
| **Regimen** | iOS+Android | Free (1 compound) + $4.99/mo / $39.99/yr | 4.9★ iOS / 4.8★ Play |
| **OptiPin** | iOS | $4.99/mo / $39.99/yr | bloodwork-calibrated modeling |
| **Dose Track** | iOS+Android | $6.99/mo / $69.99/yr | niche price ceiling; 600+ compound PK engine |
| **PeptIQ** | iOS+Android+web | freemium | clinic dashboard (B2B angle) |
| **PepTrack / PepCalc / web tools** | iOS / web | free | acquisition-surface calculators |

Plus ~15 near-identical solo-dev clones launched 2025–26. Crowded but young; nobody owns web-first.

### Key market facts

- **Pricing clusters at $4.99/mo / $39.99/yr.** Health-app median $9.70/mo; 68% of health-subscription revenue is annual (RevenueCat 2025). Shotsy's hike to $49.99/yr triggered visible backlash + "alternatives" SEO farms.
- **Apple Guideline 1.4.2** technically prohibits indie dose calculators (must come from manufacturer/hospital/pharmacy/approved entity). **Not enforced today** — dozens of peptide apps live — but it's a latent category-wipe risk that validates web-first as the moat, not just a workaround.
- **Payments: fine.** Stripe/PayPal/Square ban peptide *sellers* (documented shutdowns, fund freezes) but **no case found of a tracker/SaaS losing processing**. A tracker sells software, not compounds. Residual risk: underwriting misclassification from "peptide" branding — describe the product as "health tracking software" in the Stripe profile.
- **Distribution channels that work in this niche:** app-store keyword search (closed to us — good and bad), Reddit GLP-1/peptide communities (GLP-1 Plotter was built out of them), comparison-page SEO ("X vs Y", "Shotsy alternatives"), and **free reconstitution-calculator SEO** — so contested that even riteaid.com hosts one, which proxies real search volume.

### Pricing recommendation

- **Free**: local-only core — protocols, logging, scheduling, recon calculator (calculator must stay free; it's the acquisition surface and every competitor's is free).
- **Pro — €4.99/mo or €39.99/yr**: cloud sync + cross-device, insights suite (active levels, symptom trends, health markers, injection map analytics), unlimited protocols, reminders+.
- Launch lever: founding-member annual price (€29.99/yr first cohort).

---

## 2. Current state — what the audits found

### 2a. Multi-tenant readiness (code track)

**Good news: the cloud schema is already multi-user.** `records(user_id, kind, id, data jsonb)` with per-user RLS (`0001_init.sql:19-31`) needs essentially zero change. The sync merge engine (`planMerge`, tombstone ledger) is pure and user-agnostic — carries over untouched.

**Blockers:**

| # | Blocker | Where |
|---|---|---|
| 1 | DB trigger rejects any signup after the first account | `supabase/migrations/0002_reject_extra_signups.sql:12-31` |
| 2 | Login-only client; no signup, no password reset, no email confirm (project auto-confirms) | `src/components/AuthGate.tsx:87-158` |
| 3 | `AuthGate` makes login *mandatory* when cloud is enabled — free tier needs the inverse (app always renders, login optional) | `AuthGate.tsx:10-11,59` |
| 4 | **Local IndexedDB is single-tenant** (`'pepdose'` constant, `schema.ts:171`). Two accounts on one browser cross-contaminate each other's clouds through sync (`sync.ts:151,188`). Must namespace DB per user id (or wipe-on-switch) **before** signup opens | `src/db/schema.ts`, `src/db/sync.ts` |
| 5 | `owner: UserName = 'Victor' \| 'Nadia'` hardcoded across ~10 files incl. the IndexedDB v2 migration — must become per-account free-form profiles | `src/data/users.ts`, `schema.ts` (5 interfaces + `:201-210`), pickers/badges/filters |
| 6 | Zero billing code anywhere (confirmed). No backend at all — billing = first Edge Functions in the repo | `supabase/` has only migrations |
| 7 | No plan gating; `syncNow` runs for any session. Only server-enforceable gate is cloud sync itself (RLS write-policy checking a subscriptions table) — client gates are honor-system, which is normal for local-first | `sync.ts:138-143`, `AuthGate.tsx:30-56` |

Plan-gate insertion points already mapped: sync (`AuthGate.tsx:30-56`, `sync.ts:138`, `ExportImport.tsx:67,123`), insights (`Insights.tsx` + routes `App.tsx:63-75`), reminders (`Settings.tsx:82-137`, `utils/notifications.ts:194,267`), protocol count (`NewProtocol.tsx` + `operations.ts:17,36`).

### 2b. Compliance & liability (highest-stakes track)

**Every data store is GDPR Art. 9 special-category health data** — dose logs with symptoms/severity, health markers (BP, glucose, resting HR, bloodwork), medication history, plus `Vial.source/batchNumber` = evidence of gray-market purchase. Local-only mode = no processing, no controller role — the strongest card we hold. But sync is live today, so we're already controller, and:

**HIGH risks**

1. **First-run privacy claim is false**: `Onboarding.tsx:29-31` says "No accounts, no cloud, no tracking" while cloud sync is configured and live. Also in `README.md:3-4`. Cheapest fix on the list.
2. **Zero legal surface**: no ToS, privacy notice, trader identity (Irish eCommerce Regs SI 68/2003), withdrawal-right notice, LICENSE.
3. **No consent capture at all**: no age gate, no checkbox, no stored consent record — Art. 7(1) demonstrability fails by construction. Art. 9 needs *explicit* consent (legitimate interest unavailable). DPIA effectively mandatory; Supabase DPA + EU-region confirmation needed.
4. **App-originated dose recommendations** (MDR/MDCG 2019-11 line-crossers, ranked):
   - Titration coach renders "step up to 4mg" imperatives (`titrationCoach.ts:12-19` → `Dashboard.tsx:216-231`).
   - **Ladder auto-rescaling** (`scheduleEngine.ts:66-135,186`): rescales titration ladders proportionally to any typed start dose — synthesizes regimens no trial ever ran. **Recommend cutting outright.**
   - Recon calculator = named device function in the guidance; our own content admits "10× mix-up is the most dangerous common error" (`experienceTimelines.ts:516`).
   - Automated stack verdicts ("contraindicated / Never combine") on the user's own selection (`stackingRules.ts:37-49` → `NewProtocol.tsx:589-605`).
   - Goal picker: pick health goal → prefilled dosing protocol (`GoalPicker.tsx:25-71`) = therapy suggestion.
   - "Estimated amount in your system" overstates what `activeLevels.ts` computes (it's dose-equivalents relative to peak — the code header admits it, the UI doesn't).
5. **Content provenance**: dosing data cited to consumer peptide vendors (peptidedeck/peptidedosages/peptidefox, `peptides.ts:638-677`) and Reddit. Monetized vendor/Reddit-sourced dosing for unapproved compounds = worst litigation posture. Plus POM brand aliases (Ozempic/Wegovy/Mounjaro, `peptides.ts:169,204`) inside dosing content — EU prohibition on advertising prescription medicines to the public (Dir. 2001/83/EC Art. 88).
6. Disclaimers today: three 10px footers, skippable, unrecorded; **absent from all 8 guidance screens** (ExperienceGuide, PeptideLibrary, NewProtocol review, ReconCalculator, HalfLife, GoalPicker, Dashboard coach, protocol templates).
7. No account deletion (Art. 17) — export exists (Art. 20 ✓), erasure doesn't. Partner's data (Nadia) processed with no notice/basis for that person.

**The protective reframe (core principle): shift from "app tells you" to "you record what you were told."** Doses user-entered or explicitly user-confirmed, never app-originated. "Step up to X" → "Your plan shows X on {date}". Calculator → unit converter with formula shown + verify-against-syringe prompt. Stacking → static browsable reference (drop automated verdicts). Goal picker → library browse (drop goal→protocol jump). Publish an intended-purpose statement (ToS + About + manifest): *"personal record-keeping and reminder tool… all values entered by the user"* — and make all marketing copy match it (marketing copy overrides disclaimers; "gold-standard healing stack" naming undermines it).

### 2c. Product gaps (stranger-proofing track)

**MUST-fix for launch:**

- **iOS PWA icon broken** — `apple-touch-icon` points at SVG (`index.html:11`), `public/icons/` has only SVGs; iOS needs PNG 180×180 (+192/512 in manifest).
- **`manifest.json start_url: "/"`** while app lives at `/pepdose/` — installed PWA launches at VM root. Missing `scope`, `id`, maskable icons, screenshots.
- **Reminders don't fire on closed iOS PWA** — Notification Triggers API is Chromium-only; iOS 16.4+ needs *server* Web Push (doesn't exist). Ship `.ics` calendar export first (HANDOFF roadmap #1), Web Push later. Can't sell "reminders" to iPhone users without one of these.
- **No ErrorBoundary / crash reporting** — any render error = permanent white screen (`src/main.tsx` bare). Minimum: boundary with "reload + export your data" screen.
- **No support/feedback channel, no transactional email** (no reset flow, no SMTP, no receipts). Minimum: Supabase auth emails w/ custom SMTP; receipts from Stripe.
- **Offline lockout**: no cached session + Supabase down = login wall blocks access to on-device data. Needs "continue locally" escape hatch.
- **No landing page, no SEO** — zero meta description/og tags; with cloud on, everything is behind the login gate. Nothing indexable exists.
- **Domain move touches 3 hardcoded spots**: `vite.config.ts:7` base, `public/sw.js:2` BASE, manifest widget URL; `404.html` GitHub-Pages hack is dead weight.

**Nice/later:** SW precaches shell only (fresh-install offline = blank), no install-prompt UX, onboarding has no demo data, no analytics (when added: self-hosted Plausible/Umami, zero health-data events), version 0.0.0/no changelog, ~12 pre-existing lint errors.

**Solid already:** JSON backup/restore, graceful sync-failure banner with cached session, honest evidence-tier banners and red-flag "seek medical attention" content.

---

## 3. The plan — phases

Order matters: legal/framing before money, local-tenant isolation before open signup.

### Phase 0 — Same-day compliance hygiene (0.5–1d) — *do regardless of go/no-go*
- Fix false privacy claim (`Onboarding.tsx:29-31`, README): "Your data stays on your device unless you turn on cloud sync."
- Persistent disclaimer component on all 8 guidance screens.
- Reword coach imperatives to plan-restating (`Dashboard.tsx:187-191,225`).
- Intended-purpose sentence in About + `manifest.json` description.

### Phase 1 — De-fang + legal floor (3–4d code + external legal)
- Cut ladder auto-rescaling; ladders become step-by-step user-confirmed editable templates.
- Titration coach → "Schedule reminder". Recon calculator → unit-converter framing + verification prompt. Stacking → static reference table. Goal picker → library browse. HalfLife copy: "model estimate relative to your recent peak, not a blood level".
- Add required `evidenceLevel` + new `regulatoryStatus` (`approved-POM | investigational | not-for-human-use`) to `Peptide`, rendered everywhere. Strip POM brand aliases from dosing content. Reframe `low/standard/high` as "doses reported in {citation}".
- External: solicitor for ToS + privacy notice + trader identity + withdrawal terms; DPIA; Supabase DPA + EU-region confirmation. Optional but recommended: written MDR borderline determination (HPRA is the Irish authority).

### Phase 2 — Multi-tenant rebuild (5–6d) — *riskiest engineering*
- `0003` migration: drop signup-rejection trigger; add `profiles` + `subscriptions` tables (RLS read-own; writes service-role only).
- Signup/password-reset/email-confirm flows; invert AuthGate (app renders always, login optional).
- **Per-account IndexedDB namespace** (`pepdose-<uid>`) — before signup opens.
- Victor/Nadia union → per-account profiles (~10 files + v2 migration path; the riskiest refactor).
- Blocking first-run gate: age confirmation + ToS/privacy acceptance + separate explicit Art. 9 consent for sync — versioned, timestamped, stored (new IndexedDB store + synced kind).
- Account deletion flow (Art. 17).

### Phase 3 — Billing (3d)
- Stripe products; 2 Supabase Edge Functions (`checkout`, `stripe-webhook`); `usePlan()` hook + gates (sync, insights, reminders, protocol count); billing card in Settings; RLS write-policy on `records` checking subscription (the one real server-side wall); lapsed sub degrades to local-only, never signs out or deletes.

### Phase 4 — Stranger-proofing (3–4d)
- PNG icons + manifest fix (start_url/scope/id/maskable), ErrorBoundary + export-on-crash, support email link, Supabase SMTP, offline "continue locally" hatch, `.ics` reminder export, onboarding profiles + demo protocol, SW precache of hashed bundles + update prompt.

### Phase 5 — Domain + landing (2–3d)
- Buy domain, untangle base path (vite/sw/manifest, drop 404.html), Caddy vhost (later: Cloudflare Pages via wrangler — flag-proof).
- Public marketing page: features/pricing/screenshots, og/meta, **free recon-calculator page as SEO acquisition surface** ("reconstitution calculator" keyword — contested but high-volume), comparison pages later.

### Phase 6 — Launch + distribution (ongoing)
- Founding-member annual offer; community presence (Reddit GLP-1/peptide subs — soft-touch, tool-first like GLP-1 Plotter); privacy-first analytics; Web Push server when justified.

**Totals: ~18–22 dev-days** + legal spend. Critical path: 0 → 1 → 2 → 3; 4/5 parallelizable with 2/3.

---

## 4. Positioning

**"The private peptide tracker."** Local-first (data on YOUR device, cloud optional + paid), web-first (no app store, works on everything, can't be wiped by an Apple policy change), honest about evidence quality. That triangle is unoccupied: incumbents are all app-store subscription apps with mandatory accounts. Privacy is not marketing fluff here — this audience logs gray-market compound use and demonstrably prefers no-account tools (PepTrack, Peptide Assistant, GLP3 Planner all lead with it).

---

## 5. Costs — the full picture

### Development: €0 cash

All build work is Claude sessions on the existing VM. The "dev-days" in §3 are elapsed effort, not money. No contractors, no Apple dev account (web-first), no CI cost.

### One-off cash costs

| Item | Cost | Needed by | Notes |
|---|---|---|---|
| Domain (pepdose.app or .io) | €15–35/yr | Phase 5 | .app ~€15, .io ~€35; renewal same |
| Solicitor: ToS + privacy notice + trader identity + subscription terms | €500–1,500 | before charging (Phase 3 gate) | Irish solicitor; template-based review at the low end |
| DPIA | €0–500 | before charging | We draft it; optional solicitor review ~€300–500 |
| MDR borderline determination (consultant, written) | €1,000–3,000 | **optional** but recommended before revenue | The "is this a medical device" letter; skippable if Phase 1 de-fang is done aggressively |
| Ltd company formation (if chosen in decision 6) | €50–400 | optional, before charging | CRO DIY ~€50–100; formation agent ~€250–400. Accountant ~€500–1,000/yr ongoing |
| **Total one-off, indie path** | **~€15–35** | | domain only — ToS/privacy/DPIA self-drafted from templates, aggressive de-fang instead of MDR letter, sole trader; paid legal deferred to a trigger (~100 paying users, funded from revenue). Higher personal liability exposure, mitigated by de-fang + labels + local-first. This is what every indie competitor in the niche does. |
| **Total one-off, minimal path** | **~€550–2,000** | | domain + solicitor ToS/privacy + self-DPIA |
| **Total one-off, belt-and-braces** | **~€2,500–5,400** | | + MDR letter + ltd + reviewed DPIA |

### Running costs (monthly)

| Item | Bootstrap | At scale | Notes |
|---|---|---|---|
| Hosting (VM Caddy / Cloudflare Pages) | €0 | €0 | VM already paid by Azure credit; CF Pages free tier |
| Supabase | €0 (free tier) | **$25/mo Pro** | Free tier pauses inactive projects + no daily backups — for strangers' Art. 9 health data, Pro from first paying customer. 500MB free DB is plenty for years (records are small JSON) |
| Transactional email (Resend/Postmark) | €0 (free tier) | ~€10–15/mo | Reset/confirm emails via Supabase SMTP hook; receipts come from Stripe free |
| Analytics (self-hosted Umami on VM) | €0 | €0 | Plausible cloud €9/mo only if we don't self-host |
| Stripe | — | **~1.5% + €0.25/txn (EU cards)** + 0.7% Billing fee | Effective ~4–6% of revenue at €4.99; annual plans cut per-txn overhead |
| **Fixed floor** | **€0/mo** | **~€25–40/mo** | |

### Revenue scenarios (Pro €4.99/mo / €39.99/yr, assume 70% annual — industry norm is 68%)

| Paying users | Gross/yr | Stripe ~5% | Fixed costs/yr (~€420) | **Net/yr** |
|---|---|---|---|---|
| 25 | ~€1,150 | −€58 | −€420 | **~€670** |
| 100 | ~€4,600 | −€230 | −€420 | **~€3,950** |
| 500 | ~€23,000 | −€1,150 | −€420 | **~€21,400** |
| 1,000 | ~€46,000 | −€2,300 | −€420 | **~€43,300** |

(Gross/yr per user ≈ €46 blended: 70% at €39.99 annual + 30% at €4.99×12.)

### Break-even

- **Infrastructure**: ~9 paying users covers the €40/mo fixed floor.
- **Minimal one-off (~€1,200 mid-estimate)**: recouped by ~30 users in year 1.
- **Belt-and-braces (~€4,000)**: recouped by ~90–100 users in year 1.

Realistic first-year bar given zero audience and no app-store channel: **25–100 users** via calculator SEO + community presence. That pays the bills, not more. Upside case needs the free calculator page to rank and community word-of-mouth — the same motion that took GLP3 Planner and SHOTLOG to relevance. Downside is capped: worst case we're out the legal spend and own a de-risked, legally clean app.

### What it costs to do nothing

Not zero. Sync is live today with a false "no cloud" first-run claim and app-originated dose advice — the Phase 0/1 liability exposure exists **now**, monetized or not. Phase 0 is €0 cash and ~1 day.

---

## 6. Open decisions — NEEDS YOU

1. **Go/no-go + scope**: full plan, or Phase 0+1 only (de-risk now, monetize later)?
2. **Feature cuts** (Phase 1): OK to cut ladder auto-rescaling and the goal→protocol jump? Both are liked features; both are the top liability items.
3. **Compound policy**: keep POM (sema/tirze) and not-for-human-use compounds (reta) in the paid product with `regulatoryStatus` labels, or gate/strip them? Strongest-protection option is labels + no brand aliases.
4. **Legal budget**: solicitor ToS/privacy (~€500–1.5k typical) + MDR borderline determination (~€1–3k). Fund which?
5. **Brand/domain**: keep "PepDose" + buy pepdose.app/.io, or rebrand? (Name collision check needed — "Dosed", "PeptideOS+" etc. exist.)
6. **Entity**: operate as sole trader or set up ltd before charging? (Liability posture materially different for a health-adjacent product.)

---

*Sources and full agent reports: competitor research cites glp3planner.com, helloregimen.com, optipin.app, dosetrack.app, RevenueCat State of Subscription Apps 2025, Apple Review Guideline 1.4.2, akord.io/inclusivepay/vectorpayments (processor policy). Compliance track: MDCG 2019-11, GDPR Arts. 7/9/13/17/20/30/33, Dir. 2001/83/EC Art. 88, PLD 2024/2853, SI 68/2003.*
