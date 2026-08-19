-- GOODNESS OS — Goodness Commitment, chapter belonging and the HQ request queues.
-- A commitment is a voluntary sustaining contribution. It is never a fee, never a membership
-- gate, and pausing it carries no penalty — history is preserved, recognition never downgrades.

create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  amount numeric not null check (amount > 0),
  currency text not null default 'BDT',
  rhythm public.commitment_rhythm not null default 'Monthly',
  custom_days integer,
  destination public.commitment_destination not null default 'unrestricted',
  destination_chapter_id text references public.chapters (id) on delete set null,
  destination_program_slug text references public.programs (slug) on delete set null,
  status public.commitment_status not null default 'active',
  badge_opt_in boolean not null default false,
  started_on date not null default current_date,
  paused_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger commitments_touch before update on public.commitments
  for each row execute function public.touch_updated_at();

create table public.commitment_contributions (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid not null references public.commitments (id) on delete cascade,
  donation_id text references public.donations (id) on delete set null,
  amount numeric not null check (amount > 0),
  contributed_at timestamptz not null default now()
);
create index commitment_contributions_commitment_idx
  on public.commitment_contributions (commitment_id, contributed_at desc);

-- Normalised rhythm, used for "expected in the next 30 days" without inventing income.
create or replace function public.rhythm_per_30(r public.commitment_rhythm)
returns numeric language sql immutable as $$
  select case r
    when 'Daily' then 30
    when 'Weekly' then 4.3
    when 'Bi-weekly' then 2.15
    else 1
  end;
$$;

-- Chapters ask HQ before doing the sensitive things (budgets, publishing impact, credentials).
create table public.chapter_proposals (
  id uuid primary key default gen_random_uuid(),
  chapter_id text not null references public.chapters (id) on delete cascade,
  title text not null,
  kind text not null default 'mission',
  detail text,
  amount numeric,
  stage public.proposal_stage not null default 'pending',
  note text,
  submitted_by uuid references public.profiles (id) on delete set null,
  decided_by uuid references public.profiles (id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index chapter_proposals_stage_idx on public.chapter_proposals (stage, created_at desc);

-- Anyone can ask to start a chapter; HQ decides. Approval creates a `forming` chapter.
create table public.chapter_requests (
  id uuid primary key default gen_random_uuid(),
  country_id text not null references public.countries (id) on delete cascade,
  city text not null,
  division text,
  requester_name text not null,
  requester_email citext,
  requester_phone text,
  why text,
  people_ready integer,
  stage public.chapter_request_stage not null default 'proposed',
  note text,
  decided_by uuid references public.profiles (id) on delete set null,
  decided_at timestamptz,
  created_chapter_id text references public.chapters (id) on delete set null,
  created_at timestamptz not null default now()
);
create index chapter_requests_stage_idx on public.chapter_requests (stage, created_at desc);

-- HQ speaks to the network here; chapter leads read it in Chapter Control.
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'network' check (audience in ('network', 'chapter', 'volunteers')),
  chapter_id text references public.chapters (id) on delete cascade,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null
);
