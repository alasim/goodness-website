# GOODNESS OS — Product Build Plan (prototype → real product)

**Goal (single sentence):** turn the confirmed GOODNESS OS prototype (static `.dc.html` pages + a
localStorage store) into a production-shaped product — a React + TypeScript application backed by a
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
/app                   React + TypeScript + Vite application
/supabase              migrations, seed, config, functions — the backend as code
/scripts               seed generation (prototype JS -> SQL), helper tooling
BUILD-PLAN.md          this file (phase status is updated as work lands)
```

## Phases
Each phase is independently reviewable and lands as its own commit.

| # | Phase | Scope | Status |
|---|-------|-------|--------|
| P0 | Foundations | Goal doc, `app/` scaffold (Vite/React/TS/Router), brand design system, app shell | 🔨 in progress |
| P1 | Supabase backend | `supabase/` schema migrations, RBAC + RLS, audit, public views, seed generated from prototype data | ⏳ planned |
| P2 | Data layer | Typed DB types, dual driver (Supabase ↔ seeded local), TanStack Query hooks, derived metrics ported from `gs-os.js` | ⏳ planned |
| P3 | Public experience | Home, About, Programs, Volunteers directory, Goodness Passport, Verify, Transparency | ⏳ planned |
| P4 | Mission engine | Mission board, mission detail, claim role / withdraw / check-in / submit completion | ⏳ planned |
| P5 | Impact & Trust | Public impact records, Trust Ledger money chain with drill-down | ⏳ planned |
| P6 | Auth & member | Supabase auth, profile linking, My Goodness, my missions, Goodness Commitment | ⏳ planned |
| P7 | Partners & capital | Fund Impact marketplace, Partner Room, public Partner Profile | ⏳ planned |
| P8 | Network | Chapters directory, chapter page, My Chapter, Start a chapter | ⏳ planned |
| P9 | Mission Control | Admin portal: overview, people, applications, missions, attendance, impact, money, partners, network, audit | ⏳ planned |
| P10 | Share Studio | Locked-data card engine + PNG export for the core card families | ⏳ planned |
| P11 | Hardening | Tests, CI, deployment config, runbook | ⏳ planned |

## Backend shape (P1 summary)
Organisation → Country → Chapter (district/university/community, self-parenting hierarchy) at the top;
People (`profiles`) hold private data and are exposed publicly only through `public_volunteers`;
Programs → Projects → Missions → Mission roles → Assignments → Attendance → Impact records
(outputs / outcomes / evidence) carry the delivery chain; Donations → Funds → Expenses → Receipts
carry the money chain; Partners → Partner commitments → Opportunities carry capital; Credentials +
`verify_credential()` carry trust; `audit_events` records every governed change.

## Running it
```bash
cd app && npm install && npm run dev          # runs on seeded local driver with no backend
npx supabase link --project-ref <ref>         # then, for the real thing
npx supabase db push && npx supabase db seed  # schema + prototype content
```
See `app/README.md` for the full runbook.
