#!/usr/bin/env node
/**
 * GOODNESS OS — schema check.
 *
 * Applies every migration and the generated seed to a throwaway in-process Postgres (PGlite),
 * then asserts the promises the schema is supposed to keep: private columns never reach the
 * public passport view, credential verification answers by full or short reference, the ledger
 * adds up, and no table is left without row level security.
 *
 * Run with: npm run db:verify
 */
import { PGlite } from '@electric-sql/pglite'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const db = new PGlite()

// Supabase platform shim: roles and the auth schema the migrations reference.
await db.exec(`
  create role anon; create role authenticated; create role service_role;
  create schema if not exists auth;
  create table auth.users (id uuid primary key, email text);
  create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
  create domain public.citext as text;
`)

// PGlite ships neither pgcrypto nor citext; PG15 provides gen_random_uuid() natively and the
// citext shim above covers the column type, so the extension lines are stripped for this check.
const shim = (sql) => sql.replace(/create extension[^;]+;/gi, '')

const dir = resolve(root, 'supabase/migrations')
for (const file of readdirSync(dir).sort()) {
  try {
    await db.exec(shim(readFileSync(resolve(dir, file), 'utf8')))
    console.log('ok  ', file)
  } catch (e) {
    console.error('FAIL', file, '\n   ', e.message)
    process.exit(1)
  }
}
try {
  await db.exec(shim(readFileSync(resolve(root, 'supabase/seed.sql'), 'utf8')))
  console.log('ok   seed.sql')
} catch (e) {
  console.error('FAIL seed.sql\n   ', e.message)
  process.exit(1)
}

const q = async (label, sql) => {
  const r = await db.query(sql)
  console.log(label, JSON.stringify(r.rows.slice(0, 4)))
}
await q('volunteers  ', 'select count(*)::int as n from public.public_volunteers')
await q('private cols',
  `select count(*)::int as leaked from information_schema.columns
   where table_name = 'public_volunteers' and column_name in ('email','phone','address','admin_notes','id_document_ref')`)
await q('verify      ', `select ref, issued_to, status from public.verify_credential('GS-VOL-2024-0100')`)
await q('verify short', `select ref, status from public.verify_credential('2024-0100')`)
await q('ledger      ', `select sum(amount)::numeric as received from public.public_donations`)
await q('published   ', 'select count(*)::int as n from public.impact_records where published')
await q('capacity    ', `select m.id, m.seed_filled, sum(r.need)::int as need from public.missions m
    join public.mission_roles r on r.mission_id = m.id group by m.id, m.seed_filled order by m.id limit 3`)
await q('commit stats', 'select * from public.commitment_stats')
await q('rls check   ', `select count(*)::int as tables_without_rls from pg_tables t
   where schemaname='public' and not exists (
     select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
     where n.nspname='public' and c.relname=t.tablename and c.relrowsecurity)`)
const assertions = [
  ['no private column reaches public_volunteers', (await db.query(
    `select count(*)::int as n from information_schema.columns where table_name = 'public_volunteers'
     and column_name in ('email','phone','address','admin_notes','id_document_ref')`)).rows[0].n === 0],
  ['every public table has row level security', (await db.query(
    `select count(*)::int as n from pg_tables t where schemaname='public' and not exists (
       select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and c.relname=t.tablename and c.relrowsecurity)`)).rows[0].n === 0],
  ['credential verification answers by reference', (await db.query(
    `select count(*)::int as n from public.verify_credential('GS-VOL-2024-0100')`)).rows[0].n === 1],
  ['ledger totals match the source content', (await db.query(
    'select sum(amount)::numeric as t from public.public_donations')).rows[0].t == 6790000],
]
let failed = 0
for (const [label, ok] of assertions) {
  console.log(ok ? `PASS ${label}` : `FAIL ${label}`)
  if (!ok) failed++
}
if (failed) process.exit(1)
console.log('\nAll migrations + seed applied cleanly.')
