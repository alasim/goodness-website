-- GOODNESS OS — impact records.
-- Two independent axes, never blurred:
--   publication  (draft | published)  -> is this record public yet?
--   verification (evidence items)     -> has our team checked the evidence behind it?
-- Outcomes carry a basis so a reader always knows how strongly a claim is supported.

create table public.impact_records (
  id text primary key,
  mission_id text references public.missions (id) on delete set null,
  program_slug text not null references public.programs (slug) on delete restrict,
  project_id text references public.projects (id) on delete set null,
  chapter_id text references public.chapters (id) on delete set null,
  title text not null,
  project_label text,
  date_label text,
  published boolean not null default false,
  published_at timestamptz,
  published_by uuid references public.profiles (id) on delete set null,
  unit text not null default 'people',
  unit_label text not null default 'people supported',
  primary_value numeric not null default 0,
  beneficiaries integer not null default 0,
  measurement_due_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index impact_records_published_idx on public.impact_records (published, program_slug);
create index impact_records_chapter_idx on public.impact_records (chapter_id);
create trigger impact_records_touch before update on public.impact_records
  for each row execute function public.touch_updated_at();

-- Outputs: what we delivered, against what we said we would deliver.
create table public.impact_outputs (
  id uuid primary key default gen_random_uuid(),
  record_id text not null references public.impact_records (id) on delete cascade,
  label text not null,
  value numeric not null default 0,
  target numeric,
  sort_order integer not null default 0
);
create index impact_outputs_record_idx on public.impact_outputs (record_id);

-- Outcomes: what changed. `basis` is the honesty control.
create table public.impact_outcomes (
  id uuid primary key default gen_random_uuid(),
  record_id text not null references public.impact_records (id) on delete cascade,
  label text not null,
  value numeric,
  basis public.outcome_basis not null default 'pending',
  note text,
  evidence_label text,
  due_label text,
  sort_order integer not null default 0
);
create index impact_outcomes_record_idx on public.impact_outcomes (record_id);

-- Evidence: attached is not the same as checked. `verified` means our team checked it.
create table public.impact_evidence (
  id uuid primary key default gen_random_uuid(),
  record_id text not null references public.impact_records (id) on delete cascade,
  label text not null,
  kind public.evidence_kind not null default 'document',
  verified boolean not null default false,
  verified_at timestamptz,
  verified_by uuid references public.profiles (id) on delete set null,
  storage_path text,
  sort_order integer not null default 0
);
create index impact_evidence_record_idx on public.impact_evidence (record_id);
