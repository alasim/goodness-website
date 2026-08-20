-- GOODNESS OS — the delivery chain: Program -> Project -> Mission -> Roles -> Assignments.
-- Impact Records hang off missions in the next migration.

create table public.programs (
  slug text primary key,
  name text not null,
  short_name text,
  summary text,
  color text not null default '#1B7A34',
  bg_color text not null default '#f0faf3',
  light_color text not null default '#4DC86A',
  sort_order integer not null default 0,
  is_operations boolean not null default false
);

create table public.projects (
  id text primary key,
  program_slug text not null references public.programs (slug) on delete cascade,
  chapter_id text references public.chapters (id) on delete set null,
  name text not null,
  year integer,
  summary text
);
create index projects_program_idx on public.projects (program_slug);

create table public.missions (
  id text primary key,
  title text not null,
  program_slug text not null references public.programs (slug) on delete restrict,
  project_id text references public.projects (id) on delete set null,
  chapter_id text references public.chapters (id) on delete set null,
  scope public.mission_scope not null default 'chapter',
  venue text,
  date_label text,
  time_label text,
  starts_at timestamptz,
  hours numeric not null default 0 check (hours >= 0),
  impact_target text,
  summary text,
  status public.mission_status not null default 'open',
  priority public.mission_priority not null default 'normal',
  participation public.participation_mode not null default 'onsite',
  lead_profile_id uuid references public.profiles (id) on delete set null,
  lead_name text,
  -- historical participants carried over from the prototype seed, so capacity reads true
  -- before any live assignment exists
  seed_filled integer not null default 0 check (seed_filled >= 0),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index missions_status_idx on public.missions (status, priority);
create index missions_chapter_idx on public.missions (chapter_id);
create trigger missions_touch before update on public.missions
  for each row execute function public.touch_updated_at();

create table public.mission_roles (
  id text primary key,
  mission_id text not null references public.missions (id) on delete cascade,
  role text not null,
  need integer not null default 1 check (need > 0),
  skills text[] not null default '{}',
  sort_order integer not null default 0
);
create index mission_roles_mission_idx on public.mission_roles (mission_id);

-- One primary role per volunteer per mission; changing role moves capacity, it does not stack.
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  mission_id text not null references public.missions (id) on delete cascade,
  mission_role_id text references public.mission_roles (id) on delete set null,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  state public.assignment_state not null default 'joined',
  joined_at timestamptz not null default now(),
  checked_in_at timestamptz,
  submitted_at timestamptz,
  verified_at timestamptz,
  verified_by uuid references public.profiles (id) on delete set null,
  hours_credited numeric check (hours_credited >= 0),
  note text,
  unique (mission_id, profile_id)
);
create index assignments_profile_idx on public.assignments (profile_id);
create index assignments_mission_idx on public.assignments (mission_id, state);

-- Verified hours are the only hours that count anywhere in the OS.
create or replace function public.verified_hours(target uuid)
returns numeric language sql stable as $$
  select coalesce(sum(coalesce(a.hours_credited, m.hours)), 0)
  from public.assignments a
  join public.missions m on m.id = a.mission_id
  where a.profile_id = target and a.state = 'verified';
$$;
