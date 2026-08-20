# GOODNESS OS — backend as code

Everything the product needs from Postgres lives here. Nothing is configured by hand in the
Supabase dashboard: schema, security and content are all files in this folder.

## Layout
| Path | What it holds |
|------|---------------|
| `config.toml` | Local Supabase stack configuration (API, auth, studio ports) |
| `migrations/` | Ordered schema migrations — the whole domain graph |
| `seed.sql` | **Generated.** Prototype content, normalised into the schema |

## Migrations, in reading order
1. `foundation` — extensions, every enum in the domain, the audit trail, timestamp trigger.
2. `org_network` — Organisation → Country → Chapter (self-parenting), chapter goals. Country is a
   first-class entity so no feature is ever hardcoded to one country.
3. `people` — profiles (public and private columns in one table, split by policy and view),
   member roles, chapter leadership with tenure, applications, credentials, and the governance
   helper functions (`is_admin()`, `is_finance()`, `leads_chapter()`, `log_audit()`).
4. `programs_missions` — Program → Project → Mission → Mission role → Assignment, plus
   `verified_hours()`. Assignment state follows the product's language exactly:
   `joined → checked_in → submitted → verified`.
5. `impact` — impact records with **publication and verification as separate axes**, outputs
   (delivered vs target), outcomes (with a basis: verified / self-reported / observed / pending)
   and evidence items that carry their own verified flag.
6. `finance` — funds, donations, expenses and expense evidence, keeping *received*, *allocated*,
   *budget* and *spent* as four distinct concepts. `set_expense_status()` is the only way to
   approve or reverse an expense, and it always writes an audit event.
7. `partners` — partners, both sides' commitments, timeline, in-kind, employee volunteering and
   the Impact Marketplace opportunities.
8. `membership` — Goodness Commitment (voluntary sustaining contributions, pause without penalty),
   chapter proposals to HQ, public chapter requests, HQ announcements.
9. `rls` — row level security for every table, the public views that are the *only* window onto
   private tables, and the public `verify_credential()` API.

## Security model in one paragraph
Every table has RLS enabled. Public reference data (programs, chapters, missions, the ledger) is
re-opened with explicit `public read` policies. Personal data is never re-opened: the passport that
the world sees is the `public_volunteers` view, whose column list is the privacy boundary — phone,
email, address, ID references and admin notes are simply not in it. Money and partner writes require
the `finance_lead` / `partnerships_lead` / admin roles; hours can never be self-verified, because the
volunteer's own update policy forbids the `verified` state.

## Runbook
```bash
# 1a. local stack via this repository's compose file — see docker/README.md
npm run stack:keys && npm run stack:up   # applies these migrations + seed.sql on first boot

# 1b. or the Supabase CLI, for the full official topology
npx supabase start
npx supabase db reset          # applies migrations + seed.sql

# 2. against a hosted project
npx supabase link --project-ref <your-project-ref>
npx supabase db push           # migrations
psql "$DATABASE_URL" -f supabase/seed.sql   # content (optional; demo data)

# 3. regenerate seed.sql after changing the prototype data modules
npm run gen:seed

# 4. check the schema without any Docker or network access
npm run db:verify              # applies everything to in-process Postgres and asserts the promises
```

## Types for the app
```bash
cd app && npm run gen:types    # writes src/lib/database.types.ts from the local stack
```
