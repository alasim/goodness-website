# GOODNESS OS — application

TanStack Start (React 19 + TypeScript, server-rendered) frontend for Goodness Society, backed by
the Supabase project defined in [`../supabase`](../supabase/README.md).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

With no environment variables the app runs on the **local driver**: the generated seed
(`src/data/seed.json`) is the record, and anything you change in the browser is kept as an overlay
in `localStorage`. Every screen works, including the member area and Mission Control.

## Connect a real backend

Fastest path — the local stack in [`../docker`](../docker/README.md):

```bash
cd .. && npm run stack:keys && npm run stack:up   # prints the two lines below
```

```bash
# app/.env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon key>
```

Or a hosted project:

```bash
cd ..
npx supabase link --project-ref <project-ref>
npx supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql     # optional demo content
```

Restart the dev server. The app switches drivers automatically — same screens, now reading through
the public views and writing under row level security.

## Scripts
| Command | What it does |
|---------|--------------|
| `npm run dev` | SSR dev server |
| `npm run build` / `npm start` | production build (Nitro output) and run it |
| `npm run typecheck` | TypeScript, strict, with `noUncheckedIndexedAccess` |
| `npm run lint` | ESLint (TanStack config, type-aware rules) |
| `npm run test` | Vitest — derivation, overlay and card-catalogue tests |
| `npm run test:e2e` | Playwright walk of the contribution loop against a built server |
| `npm run gen:seed` | regenerate `supabase/seed.sql` **and** `src/data/seed.json` from the prototype data modules |
| `npm run gen:types` | regenerate `src/lib/database.types.ts` from the local Supabase stack |

## How the code is arranged
```
src/routes/           one file per surface (file-based routing, each with its own <head>)
src/components/       shared UI primitives, page furniture and the Mission Control tabs
src/data/os.ts        the derivation engine — every computed number in the product
src/data/local.ts     seeded local driver + browser overlay
src/data/supabase-driver.ts   reads through the public views
src/data/actions.ts   every mutation, implemented once per driver
src/lib/cards.ts      Share Studio catalogue built from the live model
src/lib/card-canvas.ts        canvas renderer: preview and download are the same pixels
src/styles/           brand tokens and the component layer
```

## Rules the code keeps
- **One truth.** Screens never store a computed number; they read `buildOS(dataset)`.
- **Private stays private.** The Supabase driver reads people through `public_volunteers`, which
  has no contact, address, identity or notes columns at all.
- **Hours cannot be self-verified.** The UI hides it and the database policy forbids it.
- **Publication ≠ verification.** Impact records carry both states separately, everywhere.
- **No misleading attribution.** Pooled-funding language on every funding surface and card.

## End-to-end check
`e2e/flow.mjs` walks the contribution loop in a real browser — claim a passport, join a mission,
check in, submit, verify the hours in Mission Control, and confirm they reach the passport, the
audit trail, the Share Studio card and the ledger drill-down.

```bash
npm run build
npm start &                        # serves the built app on :3000
npm run test:e2e                   # add CHROMIUM_PATH=... if Playwright's browser is elsewhere
```
It needs `playwright` available (`npm i -D playwright`); it is kept out of the default install so
the everyday `npm ci` stays small.

## Deployment
The build produces a Nitro server in `.output`. For Vercel, build with `NITRO_PRESET=vercel npm run
build`; for a Node host, run `npm run build && npm start`. Set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` in the host's environment, and add the deployed origin to the Supabase
project's allowed redirect URLs so magic-link sign-in returns to `/me`.
