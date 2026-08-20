# Goodness Society — GOODNESS OS

The operating system for organized goodness: verified volunteers, real missions, measured impact,
and a public trust ledger. This repository holds four layers.

| Layer | Path | What it is |
|-------|------|------------|
| Design source | `*.dc.html`, `*-data.js`, `gs-os.js` | The confirmed prototype — the visual and product source of truth |
| Application | [`app/`](app/README.md) | TanStack Start (React + TypeScript, SSR) product |
| Backend | [`supabase/`](supabase/README.md) | Postgres schema, row level security, seed — as code |
| Local stack | [`docker/`](docker/README.md) | Docker Compose: Postgres, auth, REST, Studio and a mail catcher, seeded from the migrations |

Start with [`GOODNESS-OS.md`](GOODNESS-OS.md) for the product vision and wave roadmap, and
[`BUILD-PLAN.md`](BUILD-PLAN.md) for how the prototype was turned into this product, phase by phase.

## Quick start

```bash
# the product, with no backend required
cd app && npm install && npm run dev         # http://localhost:3000

# a real local Supabase (Postgres, auth, REST, Studio, mail catcher)
npm run stack:keys && npm run stack:up       # then put the printed keys in app/.env

# check the database schema without Docker or a network
npm install && npm run db:verify

# regenerate the seed after editing the prototype data modules
npm run gen:seed
```

## Two drivers, one model
The app runs identically on a seeded local record and on a live Supabase project. `buildOS()` turns
either into the same model, so capacity, verified hours, fund positions, chapter rollups and partner
figures are computed the same way in both. That is what keeps a chapter number and a national number
from ever disagreeing.

## What is enforced, not just displayed
- Personal contact details, addresses, identity references and administrative notes are absent from
  the public passport view — the public surface cannot read them.
- A volunteer can move their own participation forward to *contribution submitted*, never to
  *hours verified*; only a team lead or HQ can do that.
- Approving or reversing an expense goes through an audited database function.
- Impact records separate publication from evidence verification, and say which is which.

## Repository scripts
| Command | What it does |
|---------|--------------|
| `npm run stack:keys` | Generate local stack credentials into `docker/.env` |
| `npm run stack:up` / `stack:down` / `stack:reset` / `stack:logs` | Run the local Supabase stack |
| `npm run db:verify` | Apply every migration and the seed to in-process Postgres and assert the promises they keep |
| `npm run gen:seed` | Regenerate `supabase/seed.sql` and `app/src/data/seed.json` from the prototype data modules |
| `npm run app:dev` / `app:build` / `app:test` | Proxy to the app's own scripts |
