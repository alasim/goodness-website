-- GOODNESS OS — people, roles, applications and credentials.
-- Public/private separation is structural: private columns live here and are never selected by
-- the public views in the RLS migration. Phone, email, address, ID docs and notes stay private.

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  slug text unique not null,
  full_name text not null,
  initials text not null,
  avatar_color text not null default 'green',
  role_title text,
  program_slug text,
  city text,
  chapter_id text references public.chapters (id) on delete set null,
  joined_month text,
  quote text,
  bio text,
  skills text[] not null default '{}',
  impact_stat text,
  impact_label text,
  level public.journey_level not null default 'Volunteer',
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused', 'suspended')),
  certificate_enabled boolean not null default false,
  goodness_id text unique,
  -- Service recorded before this system went live. Displayed totals are always
  -- baseline + live verified assignments, so migrating history never inflates new work.
  baseline_missions integer not null default 0 check (baseline_missions >= 0),
  baseline_hours numeric not null default 0 check (baseline_hours >= 0),
  baseline_people integer not null default 0 check (baseline_people >= 0),
  baseline_programs integer not null default 1 check (baseline_programs >= 0),
  -- private, never exposed publicly
  email citext,
  phone text,
  address text,
  emergency_contact text,
  id_document_ref text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_chapter_idx on public.profiles (chapter_id);
create index profiles_program_idx on public.profiles (program_slug);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create table public.member_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  chapter_id text references public.chapters (id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles (id) on delete set null,
  unique (profile_id, role, chapter_id)
);
create index member_roles_profile_idx on public.member_roles (profile_id);

-- Leadership team with tenure history: a closed `until_label` is history, open is current.
create table public.chapter_team (
  id uuid primary key default gen_random_uuid(),
  chapter_id text not null references public.chapters (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete set null,
  person_name text,
  role text not null,
  since_label text,
  until_label text,
  created_at timestamptz not null default now(),
  constraint chapter_team_person check (profile_id is not null or person_name is not null)
);
create index chapter_team_chapter_idx on public.chapter_team (chapter_id);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext,
  phone text,
  city text,
  chapter_id text references public.chapters (id) on delete set null,
  program_slug text,
  role_title text,
  skills text,
  availability text,
  why text,
  experience text,
  status public.application_status not null default 'pending',
  note text,
  decided_at timestamptz,
  decided_by uuid references public.profiles (id) on delete set null,
  created_profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index applications_status_idx on public.applications (status, created_at desc);

-- Every credential is verifiable by reference. Revocation is a state, never a delete.
create table public.credentials (
  id text primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  ref text unique not null,
  title text not null,
  program_slug text,
  service_summary text,
  issued_on date not null default current_date,
  issued_label text,
  expires_on date,
  status public.credential_status not null default 'valid',
  download_enabled boolean not null default true,
  revoked_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index credentials_profile_idx on public.credentials (profile_id);
create trigger credentials_touch before update on public.credentials
  for each row execute function public.touch_updated_at();

-- ── Governance helpers (security definer so policies can use them) ────────────
create or replace function public.current_profile_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.profiles where user_id = auth.uid();
$$;

create or replace function public.has_role(target public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.member_roles mr
    join public.profiles p on p.id = mr.profile_id
    where p.user_id = auth.uid() and mr.role = target
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('hq_admin') or public.has_role('super_admin');
$$;

create or replace function public.is_finance()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('finance_lead') or public.is_admin();
$$;

create or replace function public.is_partnerships()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('partnerships_lead') or public.is_admin();
$$;

create or replace function public.is_program_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('program_lead') or public.has_role('team_lead') or public.is_admin();
$$;

-- Chapter autonomy within guardrails: a chapter lead governs their own chapter (and its children).
create or replace function public.leads_chapter(target text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.member_roles mr
    join public.profiles p on p.id = mr.profile_id
    left join public.chapters child on child.id = target
    where p.user_id = auth.uid()
      and mr.role = 'chapter_lead'
      and (mr.chapter_id = target or mr.chapter_id = child.parent_id)
  ) or public.is_admin();
$$;

-- ── Audit helper ─────────────────────────────────────────────────────────────
create or replace function public.log_audit(
  action text, entity text, entity_id text,
  old_value jsonb default null, new_value jsonb default null, reason text default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
  label text;
begin
  select full_name into label from public.profiles where user_id = auth.uid();
  insert into public.audit_events (actor_id, actor_label, action, entity, entity_id, old_value, new_value, reason)
  values (auth.uid(), coalesce(label, 'system'), action, entity, entity_id, old_value, new_value, reason)
  returning id into new_id;
  return new_id;
end;
$$;
