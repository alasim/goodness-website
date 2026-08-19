-- GOODNESS OS — partners and capital.
-- "Turn funding from a transaction into participation." Recognition is by partnership
-- characteristics (tenure, employee participation, evidence discipline), never by spend.

create table public.partners (
  id text primary key,
  slug text unique not null,
  name text not null,
  kind text not null default 'Corporate sponsorship',
  tier text,
  stage public.partner_stage not null default 'prospect',
  since_label text,
  renewal_label text,
  contact text,
  story text,
  goal_label text,
  goal_target numeric,
  committed numeric not null default 0 check (committed >= 0),
  currency text not null default 'BDT',
  districts text[] not null default '{}',
  disclose_funding boolean not null default false,
  employees_participated integer not null default 0,
  employees_hours numeric not null default 0,
  employees_sessions integer not null default 0,
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger partners_touch before update on public.partners
  for each row execute function public.touch_updated_at();

alter table public.donations
  add constraint donations_partner_fk foreign key (partner_id)
  references public.partners (id) on delete set null;

create table public.partner_programs (
  partner_id text not null references public.partners (id) on delete cascade,
  program_slug text not null references public.programs (slug) on delete cascade,
  primary key (partner_id, program_slug)
);

create table public.partner_inkind (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references public.partners (id) on delete cascade,
  label text not null,
  est_value numeric not null default 0
);

-- Both sides of the partnership are held to their commitments, and both are shown.
create table public.partner_commitments (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references public.partners (id) on delete cascade,
  side text not null check (side in ('goodness', 'partner')),
  label text not null,
  done numeric,
  total numeric,
  unit text,
  note text,
  sort_order integer not null default 0
);
create index partner_commitments_partner_idx on public.partner_commitments (partner_id, side);

create table public.partner_timeline (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references public.partners (id) on delete cascade,
  date_label text not null,
  happened_on date,
  kind text not null default 'note',
  text text not null
);
create index partner_timeline_partner_idx on public.partner_timeline (partner_id);

-- Impact Marketplace: fund an initiative, not a donation shop. Contributions are pooled and
-- results are reported collectively — never "this amount bought this outcome".
create table public.opportunities (
  id text primary key,
  title text not null,
  program_slug text not null references public.programs (slug) on delete restrict,
  chapter_id text references public.chapters (id) on delete set null,
  where_label text,
  urgent boolean not null default false,
  target numeric not null check (target > 0),
  secured numeric not null default 0 check (secured >= 0),
  seeking text[] not null default '{}',
  expected text[] not null default '{}',
  note text,
  open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger opportunities_touch before update on public.opportunities
  for each row execute function public.touch_updated_at();

-- Employee volunteering: partner employees appear in the OS as people doing the work.
create table public.partner_employee_sessions (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references public.partners (id) on delete cascade,
  mission_id text references public.missions (id) on delete set null,
  people integer not null default 0,
  hours numeric not null default 0,
  date_label text
);
