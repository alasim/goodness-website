# GOODNESS OS — Product Build Plan (prototype → real product)

**Goal (single sentence):** turn the confirmed GOODNESS OS prototype (static `.dc.html` pages + a
localStorage store) into a production-shaped product — a TanStack Start (React + TypeScript, SSR) application backed by a
Supabase (Postgres) instance — where every number on every public page is computed from one governed
database, and where volunteers, members, chapter leads, partners and HQ admins each get the surface
they need.

**Definition of done for this build:**
1. `app/` builds clean (`typecheck` + `lint` + `test` + `build`) and runs with **no backend configured**
   (seeded local driver) *and* with a real Supabase project (`VITE_SUPABASE_URL` + anon key).
2. `supabase/` contains the whole backend as code: migrations for the full domain graph, row-level
   security for every table, role/permission model, audit trail, and a seed that reproduces the
   prototype's content exactly (so screens look identical to the design source).
3. Every wave already confirmed in `GOODNESS-OS.md` has a real screen in the React app.
4. A person with a fresh Supabase project can run three documented commands and have the whole
   product live.

## Non-negotiable product rules carried over from GOODNESS-OS.md
- **One truth.** Chapter/partner/impact/ledger numbers are *derived*, never stored twice.
- **Public/private separation.** Phone, address, ID documents and admin notes never reach a public
  surface — enforced in the database (RLS + public views), not only in the UI.
- **Publication ≠ verification.** An impact record can be published and still have pending evidence.
- **No misleading attribution.** Pooled funding language; no "৳X = N lives".
- **Governance from day one.** RBAC, audit events with old value → new value → who → when.
- **Never hardcode a country.** Organisation → Country entity → Chapter hierarchy in the schema.
- **Brand.** Plus Jakarta Sans; green `#4DC86A → #1B7A34`; blue `#1565C0`; ink `#0D0D0D`;
  rounded-square + G-swash motifs; premium/optimistic/credible; no neon or sci-fi.

## Repository layout after this build
```
/                      prototype design source (.dc.html, *-data.js, gs-os.js) — kept, read-only
/app                   TanStack Start (React + TypeScript) application
/supabase              migrations, seed, config, functions — the backend as code
/scripts               seed generation (prototype JS -> SQL), helper tooling
BUILD-PLAN.md          this file (phase status is updated as work lands)
```

## Phases
Each phase is independently reviewable and lands as its own commit.

| # | Phase | Scope | Status |
|---|-------|-------|--------|
| P0 | Foundations | Goal doc, `app/` scaffold (TanStack Start/React 19/TS), brand design system, app shell, route skeleton | ✅ built |
| P1 | Supabase backend | `supabase/` schema migrations, RBAC + RLS, audit, public views, seed generated from prototype data | ✅ built |
| P2 | Data layer | Typed DB types, dual driver (Supabase ↔ seeded local), TanStack Query hooks, derived metrics ported from `gs-os.js` | ✅ built |
| P3 | Public experience | Home, About, Programs, Volunteers directory, Goodness Passport, Verify, Transparency | ✅ built |
| P4 | Mission engine | Mission board, mission detail, claim role / withdraw / check-in / submit completion | ✅ built |
| P5 | Impact & Trust | Public impact records, Trust Ledger money chain with drill-down | ✅ built |
| P6 | Auth & member | Supabase auth, profile linking, My Goodness, my missions, Goodness Commitment | ✅ built |
| P7 | Partners & capital | Fund Impact marketplace, Partner Room, public Partner Profile | ✅ built |
| P8 | Network | Chapters directory, chapter page, My Chapter, Start a chapter | ✅ built |
| P9 | Mission Control | Admin portal: overview, people, applications, missions, attendance, impact, money, partners, network, audit | ✅ built |
| P10 | Share Studio | Locked-data card engine + PNG export for the core card families | ✅ built |
| P11 | Hardening | Tests, CI, deployment config, runbook | ✅ built |

## Framework decision (owner call, P0)
The app is built on **TanStack Start** rather than a plain Vite SPA: the public surfaces (Home,
Impact, Trust Ledger, chapter pages, partner profiles, credential verification and every Share
Studio deep link) are pages the movement wants indexed and shareable, so server rendering, per-route
`head` metadata and server functions matter more here than SPA simplicity. File-based routing keeps
each of the ~21 surfaces in its own route module.

## Backend shape (P1 summary)
Organisation → Country → Chapter (district/university/community, self-parenting hierarchy) at the top;
People (`profiles`) hold private data and are exposed publicly only through `public_volunteers`;
Programs → Projects → Missions → Mission roles → Assignments → Attendance → Impact records
(outputs / outcomes / evidence) carry the delivery chain; Donations → Funds → Expenses → Receipts
carry the money chain; Partners → Partner commitments → Opportunities carry capital; Credentials +
`verify_credential()` carry trust; `audit_events` records every governed change.

## Running it
```bash
cd app && npm install && npm run dev          # SSR dev server, seeded local driver, no backend needed
npx supabase link --project-ref <ref>         # then, for the real thing
npx supabase db push && npx supabase db seed  # schema + prototype content
```
See `app/README.md` for the full runbook.

## What landed, in one page
- **Backend as code.** Nine migrations covering organisation → country → chapter, people and roles,
  programme → project → mission → assignment, impact records, the four-concept money chain, partners
  and capital, commitments and network governance. Row level security on every table, public views
  as the only window onto private data, an audited path for money decisions, and a public
  `verify_credential()` API.
- **One derivation engine.** `app/src/data/os.ts` computes every number the product shows. Nothing
  computed is ever stored, so a chapter total and a national total cannot disagree.
- **Two drivers.** Supabase when configured, a seeded local record otherwise, producing the same
  `Dataset`. The product is fully demonstrable before a backend exists, and switches without any
  screen changing.
- **Twenty-one surfaces**, from the home page to Mission Control's ten tabs and the Share Studio
  card engine, each server-rendered with its own metadata.
- **Verification you can run.** `npm run db:verify` applies the whole schema and seed to in-process
  Postgres and asserts the privacy, RLS, credential and ledger promises; `npm test` locks the
  derivations; CI runs both plus typecheck, lint and build, and fails if the generated seed drifts.

## Deliberately not built yet
- **Payments.** Fund Impact and the Goodness Commitment record pledges and contributions into the
  ledger; connecting a payment provider (bKash, card, bank reconciliation) is a separate decision
  with its own compliance work.
- **File storage for evidence.** Evidence and expense documents carry a `storage_path` column and
  are modelled end to end, but uploading the files themselves needs a storage bucket policy the
  owner should approve.
- **Goodness Intelligence (Wave 07).** The prototype's UI is intentionally a stub; the owner asked
  for the analysis engine to be wired later.
- **Share Studio breadth.** The card engine covers all seven families; the prototype's full
  catalogue of ~40 variants can be extended card by card in `app/src/lib/cards.ts`.
