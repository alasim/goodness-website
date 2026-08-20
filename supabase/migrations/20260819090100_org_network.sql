-- GOODNESS OS — organisation and network.
-- Never hardcode one country: Organisation -> Country -> Chapter (self-parenting hierarchy).

create table public.organisations (
  id text primary key,
  name text not null,
  slug text unique not null,
  tagline text,
  registration_ref text,
  created_at timestamptz not null default now()
);

create table public.countries (
  id text primary key,
  organisation_id text not null references public.organisations (id) on delete cascade,
  name text not null,
  iso2 char(2) not null,
  currency_code text not null,
  currency_symbol text not null,
  locale text not null default 'en',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (organisation_id, iso2)
);

create table public.chapters (
  id text primary key,
  country_id text not null references public.countries (id) on delete cascade,
  parent_id text references public.chapters (id) on delete set null,
  name text not null,
  slug text unique not null,
  type public.chapter_type not null default 'district',
  status public.chapter_status not null default 'active',
  city text not null,
  division text,
  since_label text,
  coverage text[] not null default '{}',
  story text,
  campus_note text,
  standards_done integer not null default 0,
  standards_total integer not null default 6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chapters_not_own_parent check (parent_id is null or parent_id <> id)
);
create index chapters_country_idx on public.chapters (country_id);
create index chapters_parent_idx on public.chapters (parent_id);
create trigger chapters_touch before update on public.chapters
  for each row execute function public.touch_updated_at();

-- Chapter goals are targets, never stored results — results are computed from the graph.
create table public.chapter_goals (
  id uuid primary key default gen_random_uuid(),
  chapter_id text not null references public.chapters (id) on delete cascade,
  label text not null,
  metric text not null check (metric in ('people', 'hours', 'missions', 'partners')),
  target numeric not null check (target > 0),
  period_label text
);
create index chapter_goals_chapter_idx on public.chapter_goals (chapter_id);
