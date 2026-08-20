# Local Supabase stack

Everything the product needs from Supabase, running on your machine, with this repository's
migrations and seed applied automatically.

```bash
npm run stack:keys      # once: writes docker/.env with a password, JWT secret and matching keys
npm run stack:up        # start; the first boot applies supabase/migrations then supabase/seed.sql
npm run stack:logs      # watch it come up (db-init prints what it applied)
```

Then point the app at it — the generator prints these two lines for you:

```bash
# app/.env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<the anon key printed by npm run stack:keys>
```

`cd app && npm run dev` now reads and writes through Postgres instead of the seeded local record.
Delete those two lines to go back to the offline driver.

## What runs

| Service | Image | Where | Why it is here |
|---------|-------|-------|----------------|
| `gateway` | `nginx:1.27-alpine` | http://localhost:54321 | One origin exposing `/rest/v1/` and `/auth/v1/`, the paths supabase-js expects |
| `db` | `supabase/postgres:17.6.1.136` | `localhost:54322` | Postgres with the Supabase roles, extensions and `auth` schema already present |
| `db-init` | `postgres:17-alpine` | one-shot | Applies `supabase/migrations/*.sql` in order, then `supabase/seed.sql` |
| `auth` | `supabase/gotrue:v2.189.0` | behind the gateway | Magic-link sign-in for `/me` and Mission Control |
| `rest` | `postgrest/postgrest:v14.12` | behind the gateway | The REST API, with row level security enforced by the database |
| `meta` + `studio` | `supabase/postgres-meta`, `supabase/studio` | http://localhost:54323 | Table editor and SQL editor for inspecting what the app wrote |
| `mail` | `axllent/mailpit:v1.21` | http://localhost:54324 | Catches every magic-link email; nothing leaves your machine |

Ports match the Supabase CLI defaults, so switching between this stack and `supabase start` needs
no configuration change.

## Common tasks

```bash
npm run stack:down                  # stop, keep the data
npm run stack:reset                 # wipe the volume and start again from migrations + seed
npm run stack:keys -- --force       # new credentials (invalidates tokens already issued)

# psql straight into it (password is in docker/.env)
psql "postgres://postgres:$(grep '^POSTGRES_PASSWORD=' docker/.env | cut -d= -f2)@localhost:54322/postgres"
```

Signing in: enter your email at `/me`, open http://localhost:54324, click the link in the message.
To skip the email entirely — useful for automated runs — set `MAILER_AUTOCONFIRM=true` in
`docker/.env` and restart the `auth` service.

An account signs in with no profile attached until you link one. In `psql`:

```sql
update public.profiles set user_id = (select id from auth.users where email = 'you@example.com')
where slug = 'nusrat-j';

-- and to see Mission Control with real role checks rather than prototype mode:
insert into public.member_roles (profile_id, role)
select id, 'hq_admin' from public.profiles where slug = 'nusrat-j';
```

## Scope, honestly

- This is a **lean stack shaped around this product**, not the full Supabase self-hosting topology.
  Realtime, Storage, Edge Functions, image transformation and the connection pooler are not
  included, because the app does not use them yet. When evidence-file uploads land (see
  BUILD-PLAN.md), Storage joins this file — the upstream service definitions in
  [supabase/supabase `docker/`](https://github.com/supabase/supabase/tree/master/docker) drop in
  alongside what is here.
- The gateway is nginx rather than Supabase's Kong/Envoy: PostgREST and GoTrue verify the JWT and
  emit their own CORS headers, so the gateway only routes and answers preflight. That keeps the
  file readable and version-drift-free, at the cost of not mirroring production's gateway exactly.
- `npx supabase start` remains the officially supported local stack, and `npm run db:verify`
  checks the schema with no Docker at all. This compose file is for when you want a real Postgres,
  real auth and Studio in front of the same migrations.
- The credentials in `docker/.env` are generated per machine, bound to localhost, and git-ignored.
  Never reuse them for a hosted project.
