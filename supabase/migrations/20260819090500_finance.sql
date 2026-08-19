-- GOODNESS OS — the money chain.
-- Four concepts, never blurred:
--   received  = cash in from donations
--   allocated = money formally assigned to a fund (never exceeds received)
--   budget    = what the programme plans to spend (may exceed allocation -> funding gap)
--   spent     = expenses approved into the ledger

create table public.funds (
  id text primary key,
  program_slug text not null references public.programs (slug) on delete restrict,
  chapter_id text references public.chapters (id) on delete set null,
  project_label text,
  budget numeric not null default 0 check (budget >= 0),
  allocated numeric not null default 0 check (allocated >= 0),
  currency text not null default 'BDT',
  created_at timestamptz not null default now()
);

create table public.donations (
  id text primary key,
  donor_name text not null,
  donor_profile_id uuid references public.profiles (id) on delete set null,
  partner_id text,
  kind text not null default 'Individual',
  amount numeric not null check (amount > 0),
  currency text not null default 'BDT',
  donated_on date,
  date_label text,
  method text,
  restricted_program_slug text references public.programs (slug) on delete set null,
  restricted_chapter_id text references public.chapters (id) on delete set null,
  receipt_ref text unique,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);
create index donations_program_idx on public.donations (restricted_program_slug);
create index donations_partner_idx on public.donations (partner_id);

create table public.expenses (
  id text primary key,
  fund_id text not null references public.funds (id) on delete restrict,
  item text not null,
  amount numeric not null check (amount > 0),
  spent_on date,
  date_label text,
  payee text,
  status public.expense_status not null default 'pending',
  approved_by_label text,
  approved_by uuid references public.profiles (id) on delete set null,
  approved_at timestamptz,
  mission_id text references public.missions (id) on delete set null,
  impact_record_id text references public.impact_records (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index expenses_fund_idx on public.expenses (fund_id, status);
create trigger expenses_touch before update on public.expenses
  for each row execute function public.touch_updated_at();

-- `checked` = a human on our team opened the document and confirmed it. Attaching is not checking.
create table public.expense_evidence (
  id uuid primary key default gen_random_uuid(),
  expense_id text not null references public.expenses (id) on delete cascade,
  label text not null,
  checked boolean not null default false,
  checked_at timestamptz,
  checked_by uuid references public.profiles (id) on delete set null,
  storage_path text
);
create index expense_evidence_expense_idx on public.expense_evidence (expense_id);

-- Approving or reversing an expense is a governed act: it always writes an audit event.
create or replace function public.set_expense_status(target text, next_status public.expense_status, reason text default null)
returns public.expenses language plpgsql security definer set search_path = public as $$
declare
  before_row public.expenses;
  after_row public.expenses;
begin
  if not public.is_finance() then
    raise exception 'not authorised to change expense status';
  end if;

  select * into before_row from public.expenses where id = target;
  if before_row.id is null then
    raise exception 'expense % not found', target;
  end if;

  update public.expenses
     set status = next_status,
         approved_by = case when next_status = 'approved' then public.current_profile_id() else null end,
         approved_at = case when next_status = 'approved' then now() else null end
   where id = target
  returning * into after_row;

  perform public.log_audit(
    'expense.' || next_status, 'expense', target,
    jsonb_build_object('status', before_row.status, 'approved_by', before_row.approved_by_label),
    jsonb_build_object('status', after_row.status),
    reason
  );
  return after_row;
end;
$$;
