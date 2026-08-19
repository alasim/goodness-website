-- GOODNESS OS — row level security, public views and the public API.
-- Reading order: (1) everything is locked, (2) public surfaces are re-opened deliberately,
-- (3) private columns are never re-opened — they are only reachable through the views below.

alter table public.organisations            enable row level security;
alter table public.countries                enable row level security;
alter table public.chapters                 enable row level security;
alter table public.chapter_goals            enable row level security;
alter table public.chapter_team             enable row level security;
alter table public.profiles                 enable row level security;
alter table public.member_roles             enable row level security;
alter table public.applications             enable row level security;
alter table public.credentials              enable row level security;
alter table public.programs                 enable row level security;
alter table public.projects                 enable row level security;
alter table public.missions                 enable row level security;
alter table public.mission_roles            enable row level security;
alter table public.assignments              enable row level security;
alter table public.impact_records           enable row level security;
alter table public.impact_outputs           enable row level security;
alter table public.impact_outcomes          enable row level security;
alter table public.impact_evidence          enable row level security;
alter table public.funds                    enable row level security;
alter table public.donations                enable row level security;
alter table public.expenses                 enable row level security;
alter table public.expense_evidence         enable row level security;
alter table public.partners                 enable row level security;
alter table public.partner_programs         enable row level security;
alter table public.partner_inkind           enable row level security;
alter table public.partner_commitments      enable row level security;
alter table public.partner_timeline         enable row level security;
alter table public.partner_employee_sessions enable row level security;
alter table public.opportunities            enable row level security;
alter table public.commitments              enable row level security;
alter table public.commitment_contributions enable row level security;
alter table public.chapter_proposals        enable row level security;
alter table public.chapter_requests         enable row level security;
alter table public.announcements            enable row level security;
alter table public.audit_events             enable row level security;

-- ── 1. Openly public reference data ──────────────────────────────────────────
create policy "public read" on public.organisations for select using (true);
create policy "public read" on public.countries     for select using (true);
create policy "public read" on public.programs      for select using (true);
create policy "public read" on public.projects      for select using (true);
create policy "public read" on public.funds         for select using (true);

-- Chapters are public once they exist beyond a bare proposal.
create policy "public read" on public.chapters for select using (status <> 'proposed' or public.is_admin());
create policy "public read" on public.chapter_goals for select using (true);
create policy "public read" on public.chapter_team for select using (true);

-- Missions: published missions are public; drafts belong to their chapter and HQ.
create policy "public read" on public.missions
  for select using (published or public.is_program_staff() or public.leads_chapter(chapter_id));
create policy "public read" on public.mission_roles for select using (true);

-- Impact: publication is the public gate; drafts are internal only.
create policy "public read" on public.impact_records
  for select using (published or public.is_program_staff());
create policy "public read" on public.impact_outputs for select using (
  exists (select 1 from public.impact_records r where r.id = record_id and (r.published or public.is_program_staff())));
create policy "public read" on public.impact_outcomes for select using (
  exists (select 1 from public.impact_records r where r.id = record_id and (r.published or public.is_program_staff())));
create policy "public read" on public.impact_evidence for select using (
  exists (select 1 from public.impact_records r where r.id = record_id and (r.published or public.is_program_staff())));

-- Money: the ledger is public by design, down to the individual expense and its documents.
create policy "public read" on public.expenses          for select using (true);
create policy "public read" on public.expense_evidence  for select using (true);
create policy "public read" on public.opportunities     for select using (open or public.is_partnerships());
create policy "public read" on public.announcements
  for select using (audience = 'network' or public.leads_chapter(chapter_id) or public.is_admin());

-- ── 2. People: private columns never leave through the table ─────────────────
-- Public passports are served by public_volunteers below; direct table access is for the
-- person themselves, their chapter lead, and HQ.
create policy "self or staff read" on public.profiles for select using (
  user_id = auth.uid() or public.is_admin() or public.is_program_staff() or public.leads_chapter(chapter_id)
);
create policy "self update" on public.profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admin write" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "self read roles" on public.member_roles for select using (
  profile_id = public.current_profile_id() or public.is_admin()
);
create policy "admin write roles" on public.member_roles for all using (public.is_admin()) with check (public.is_admin());

-- Anyone may apply. Only people staff may read or decide.
create policy "anyone applies" on public.applications for insert with check (true);
create policy "staff read applications" on public.applications for select using (public.is_program_staff());
create policy "staff decide applications" on public.applications for update using (public.is_program_staff())
  with check (public.is_program_staff());

-- Credentials are read through the passport view or verify_credential(); the table itself is
-- readable by the holder and by staff.
create policy "holder or staff read" on public.credentials for select using (
  profile_id = public.current_profile_id() or public.is_program_staff()
);
create policy "staff write credentials" on public.credentials for all using (public.is_program_staff())
  with check (public.is_program_staff());

-- ── 3. Participation ─────────────────────────────────────────────────────────
create policy "read own or staff" on public.assignments for select using (
  profile_id = public.current_profile_id() or public.is_program_staff()
);
create policy "join missions" on public.assignments for insert with check (
  profile_id = public.current_profile_id()
);
-- A volunteer moves their own assignment forward up to "submitted"; only a team lead or HQ
-- can verify hours, so verification can never be self-granted.
create policy "advance own" on public.assignments for update using (
  profile_id = public.current_profile_id()
) with check (
  profile_id = public.current_profile_id() and state <> 'verified'
);
create policy "staff verify" on public.assignments for update using (public.is_program_staff())
  with check (public.is_program_staff());
create policy "withdraw own" on public.assignments for delete using (profile_id = public.current_profile_id());

-- ── 4. Money and partners: writes are governed roles only ────────────────────
create policy "finance read donations" on public.donations for select using (public.is_finance());
create policy "finance write donations" on public.donations for all using (public.is_finance())
  with check (public.is_finance());
create policy "finance write expenses" on public.expenses for all using (public.is_finance())
  with check (public.is_finance());
create policy "finance write expense evidence" on public.expense_evidence for all using (public.is_finance())
  with check (public.is_finance());
create policy "admin write funds" on public.funds for all using (public.is_finance()) with check (public.is_finance());

create policy "staff read partners" on public.partners for select using (public.is_partnerships());
create policy "staff write partners" on public.partners for all using (public.is_partnerships())
  with check (public.is_partnerships());
create policy "public read partner programs" on public.partner_programs for select using (true);
create policy "public read partner inkind" on public.partner_inkind for select using (public.is_partnerships());
create policy "public read partner commitments" on public.partner_commitments for select using (true);
create policy "public read partner timeline" on public.partner_timeline for select using (true);
create policy "public read partner sessions" on public.partner_employee_sessions for select using (true);
create policy "staff write opportunities" on public.opportunities for all using (public.is_partnerships())
  with check (public.is_partnerships());

-- ── 5. Membership: a commitment is private to the member and to finance ──────
create policy "own commitment" on public.commitments for all using (
  profile_id = public.current_profile_id()
) with check (profile_id = public.current_profile_id());
create policy "finance read commitments" on public.commitments for select using (public.is_finance());
create policy "own contributions" on public.commitment_contributions for select using (
  exists (select 1 from public.commitments c where c.id = commitment_id and c.profile_id = public.current_profile_id())
  or public.is_finance()
);
create policy "own contributions insert" on public.commitment_contributions for insert with check (
  exists (select 1 from public.commitments c where c.id = commitment_id and c.profile_id = public.current_profile_id())
);

-- ── 6. Network governance ────────────────────────────────────────────────────
create policy "chapter reads own proposals" on public.chapter_proposals for select using (
  public.leads_chapter(chapter_id) or public.is_admin()
);
create policy "chapter submits proposals" on public.chapter_proposals for insert with check (
  public.leads_chapter(chapter_id)
);
create policy "hq decides proposals" on public.chapter_proposals for update using (public.is_admin())
  with check (public.is_admin());

create policy "anyone requests a chapter" on public.chapter_requests for insert with check (true);
create policy "hq reads chapter requests" on public.chapter_requests for select using (public.is_admin());
create policy "hq decides chapter requests" on public.chapter_requests for update using (public.is_admin())
  with check (public.is_admin());

create policy "hq writes announcements" on public.announcements for all using (public.is_admin())
  with check (public.is_admin());

-- Audit trail is append-only in practice: readable by HQ, written through log_audit().
create policy "hq reads audit" on public.audit_events for select using (public.is_admin());

-- ── 7. Public views: the only public window onto private tables ──────────────
-- These views are owned by the migration role and therefore read past RLS on purpose;
-- they exist so that the column list itself is the privacy boundary.

create view public.public_volunteers as
select
  p.id, p.slug, p.full_name, p.initials, p.avatar_color, p.role_title, p.program_slug,
  p.city, p.chapter_id, p.joined_month, p.quote, p.bio, p.skills, p.impact_stat,
  p.impact_label, p.level, p.featured, p.certificate_enabled, p.goodness_id,
  p.baseline_people as people_supported, p.baseline_programs as programs_count,
  public.verified_hours(p.id) as verified_hours,
  (select count(*) from public.assignments a where a.profile_id = p.id and a.state = 'verified') as verified_missions,
  p.baseline_hours + public.verified_hours(p.id) as total_hours,
  p.baseline_missions
    + (select count(*) from public.assignments a where a.profile_id = p.id and a.state = 'verified')
    as total_missions,
  (select count(*) from public.credentials c where c.profile_id = p.id and c.status = 'valid') as credential_count,
  exists (
    select 1 from public.commitments c
    where c.profile_id = p.id and c.status = 'active' and c.badge_opt_in
  ) as sustaining_member
from public.profiles p
where p.status = 'active';

comment on view public.public_volunteers is
  'Public passport surface. Phone, email, address, ID references and admin notes are absent by design.';

create view public.public_credentials as
select c.id, c.ref, c.title, c.program_slug, c.service_summary, c.issued_label, c.status,
       c.download_enabled, p.full_name as issued_to, p.slug as volunteer_slug
from public.credentials c
join public.profiles p on p.id = c.profile_id;

create view public.public_donations as
select d.id, d.donor_name, d.kind, d.amount, d.currency, d.date_label, d.donated_on,
       d.restricted_program_slug, d.receipt_ref, d.acknowledged, d.partner_id
from public.donations d;

comment on view public.public_donations is
  'The Trust Ledger is public: what came in, from whom (as recorded), and what it was restricted to.';

create view public.public_partners as
select p.id, p.slug, p.name, p.kind, p.tier, p.stage, p.since_label, p.renewal_label, p.story,
       p.goal_label, p.goal_target, p.districts, p.disclose_funding, p.logo_path,
       p.employees_participated, p.employees_hours, p.employees_sessions,
       case when p.disclose_funding then p.committed else null end as committed,
       case when p.disclose_funding then
         (select coalesce(sum(d.amount), 0) from public.donations d where d.partner_id = p.id)
       else null end as received
from public.partners p
where p.stage in ('active', 'renewal');

comment on view public.public_partners is
  'Public partner wall. Amounts appear only where the partner agreed to disclose funding.';

create view public.commitment_stats as
select
  count(*) filter (where status = 'active') as active_members,
  count(*) filter (where status = 'paused') as paused_members,
  coalesce(sum(amount * public.rhythm_per_30(rhythm)) filter (where status = 'active'), 0) as expected_next_30
from public.commitments;

comment on view public.commitment_stats is
  'Collective sustaining figures only. Individual amounts and rhythms never surface publicly.';

-- ── 8. Public API functions ──────────────────────────────────────────────────
-- Credential verification is deliberately open: a certificate is worthless if its holder
-- cannot prove it to a stranger.
create or replace function public.verify_credential(ref_input text)
returns table (
  ref text, issued_to text, volunteer_slug text, title text, program_slug text,
  service_summary text, issued_label text, status public.credential_status
) language sql stable security definer set search_path = public as $$
  select c.ref, c.issued_to, c.volunteer_slug, c.title, c.program_slug,
         c.service_summary, c.issued_label, c.status
  from public.public_credentials c
  where upper(c.ref) = upper(btrim(ref_input))
     or upper(replace(c.ref, 'GS-VOL-', '')) = upper(btrim(ref_input));
$$;

grant usage on schema public to anon, authenticated;
grant select on public.public_volunteers, public.public_credentials, public.public_donations,
                public.public_partners, public.commitment_stats to anon, authenticated;
grant execute on function public.verify_credential(text) to anon, authenticated;
grant execute on function public.rhythm_per_30(public.commitment_rhythm) to anon, authenticated;
grant execute on function public.verified_hours(uuid) to anon, authenticated;
