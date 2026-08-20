#!/bin/sh
# GOODNESS OS — apply the repository's migrations and seed to the local stack.
#
# Runs once on first boot and is safe to re-run: if the schema is already present it stops early,
# and the generated seed uses conflict-tolerant inserts.
set -eu

echo "waiting for postgres…"
until pg_isready -q; do sleep 1; done

already=$(psql -tAc "select to_regclass('public.profiles') is not null")
if [ "$already" = "t" ]; then
  echo "schema already present — nothing to apply"
  exit 0
fi

echo "applying migrations"
for file in /supabase/migrations/*.sql; do
  echo "  -> $(basename "$file")"
  psql -v ON_ERROR_STOP=1 -q -f "$file"
done

if [ "${APPLY_SEED:-true}" = "true" ] && [ -f /supabase/seed.sql ]; then
  echo "applying seed"
  psql -v ON_ERROR_STOP=1 -q -f /supabase/seed.sql
else
  echo "skipping seed (APPLY_SEED=${APPLY_SEED:-true})"
fi

echo "done: $(psql -tAc 'select count(*) from public.public_volunteers') volunteers, $(psql -tAc 'select count(*) from public.missions') missions"
