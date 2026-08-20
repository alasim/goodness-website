-- ── Partner enquiries ────────────────────────────────────────────────────────
-- An organisation expressing interest through the public Partner page. It is a lead, not a
-- partnership: nothing here appears in public views, and only HQ can read or decide on it.
create type public.partner_enquiry_stage as enum ('new', 'contacted', 'converted', 'closed');

create table public.partner_enquiries (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  contact text not null,
  commitment_range text,
  objective text,
  cause_program_slug text references public.programs (slug) on delete set null,
  where_label text,
  brings text,
  opportunity_id text references public.opportunities (id) on delete set null,
  stage public.partner_enquiry_stage not null default 'new',
  note text,
  decided_by uuid references public.profiles (id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index partner_enquiries_stage_idx on public.partner_enquiries (stage, created_at desc);

alter table public.partner_enquiries enable row level security;

-- Anyone may express interest; only HQ ever reads or acts on what was written.
create policy "anyone enquires" on public.partner_enquiries for insert with check (true);
create policy "hq reads partner enquiries" on public.partner_enquiries for select using (public.is_admin());
create policy "hq decides partner enquiries" on public.partner_enquiries for update using (public.is_admin())
  with check (public.is_admin());

grant insert on public.partner_enquiries to anon;
