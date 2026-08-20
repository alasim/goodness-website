-- GOODNESS OS — foundation: extensions, enums, governance helpers, audit trail.
-- Governance rule from GOODNESS-OS.md: nobody silently rewrites history. Every governed
-- change writes an audit event with old value -> new value -> who -> when -> why.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ── Enums ────────────────────────────────────────────────────────────────────
create type public.app_role as enum (
  'volunteer', 'team_lead', 'chapter_lead', 'program_lead',
  'finance_lead', 'partnerships_lead', 'hq_admin', 'super_admin'
);

create type public.chapter_type as enum ('district', 'university', 'community');
create type public.chapter_status as enum ('proposed', 'forming', 'active', 'paused');
create type public.journey_level as enum ('Volunteer', 'Senior Volunteer', 'Team Lead', 'Chapter Lead');
create type public.application_status as enum ('pending', 'approved', 'rejected');
create type public.mission_status as enum ('open', 'full', 'completed', 'cancelled');
create type public.mission_priority as enum ('normal', 'urgent');
create type public.participation_mode as enum ('onsite', 'remote');
create type public.mission_scope as enum ('chapter', 'national');
-- Consistent state language: Joined -> Checked in -> Contribution submitted -> Hours verified.
create type public.assignment_state as enum ('joined', 'checked_in', 'submitted', 'verified', 'withdrawn');
create type public.outcome_basis as enum ('verified', 'self-reported', 'observed', 'pending');
create type public.evidence_kind as enum ('document', 'photo', 'report', 'video', 'dataset');
create type public.expense_status as enum ('pending', 'approved', 'reversed');
create type public.credential_status as enum ('valid', 'revoked', 'expired');
create type public.partner_stage as enum ('prospect', 'conversation', 'proposal', 'active', 'renewal', 'dormant');
create type public.commitment_status as enum ('active', 'paused', 'ended');
create type public.commitment_rhythm as enum ('Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Custom');
create type public.commitment_destination as enum ('unrestricted', 'chapter', 'program');
create type public.proposal_stage as enum ('pending', 'approved', 'returned');
create type public.chapter_request_stage as enum ('proposed', 'forming', 'returned');

-- ── Audit trail ──────────────────────────────────────────────────────────────
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  actor_label text,
  action text not null,
  entity text,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);
create index audit_events_created_idx on public.audit_events (created_at desc);
create index audit_events_entity_idx on public.audit_events (entity, entity_id);

-- ── Timestamp helper ─────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
