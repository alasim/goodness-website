/**
 * GOODNESS OS — Supabase driver.
 *
 * Reads go through the public views wherever the underlying table is privacy-protected, so an
 * anonymous visitor sees exactly what the product promises them and nothing more:
 *   profiles     -> public_volunteers   (no phone, email, address, ID reference or notes)
 *   credentials  -> public_credentials
 *   donations    -> public_donations
 *   partners     -> public_partners     (amounts only where the partner agreed to disclose)
 *   assignments  -> public_assignments  (capacity counts without the people behind them)
 * A signed-in member additionally reads their own rows from the base tables, and those are
 * merged over the anonymous ones.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Dataset, Profile } from '../lib/types'
import { emptyDataset } from './empty'

type Row = Record<string, unknown>

const camel = (key: string) =>
  key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
const camelize = (rows: Array<Row> | null): Array<Row> =>
  (rows ?? []).map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [camel(k), v])),
  )

async function table(
  client: SupabaseClient,
  name: string,
): Promise<Array<Row>> {
  const { data, error } = await client.from(name).select('*')
  if (error) {
    // A blocked table is a policy decision, not a crash: the surface degrades to empty.
    if (error.code === '42501' || error.code === 'PGRST301') return []
    throw new Error(`${name}: ${error.message}`)
  }
  return camelize(data as Array<Row>)
}

export async function loadSupabaseDataset(
  client: SupabaseClient,
): Promise<Dataset> {
  const names = [
    'organisations',
    'countries',
    'programs',
    'projects',
    'chapters',
    'chapter_goals',
    'chapter_team',
    'public_volunteers',
    'member_roles',
    'public_credentials',
    'missions',
    'mission_roles',
    'public_assignments',
    'assignments',
    'impact_records',
    'impact_outputs',
    'impact_outcomes',
    'impact_evidence',
    'funds',
    'public_donations',
    'expenses',
    'expense_evidence',
    'public_partners',
    'partner_programs',
    'partner_inkind',
    'partner_commitments',
    'partner_timeline',
    'opportunities',
    'commitments',
    'commitment_contributions',
    'applications',
    'chapter_requests',
    'chapter_proposals',
    'announcements',
    'audit_events',
  ]
  const results = await Promise.all(names.map((n) => table(client, n)))
  const byName = new Map(names.map((n, i) => [n, results[i] ?? []]))
  const get = (n: string) => byName.get(n) ?? []

  // The public passport reports totals; the app model keeps a baseline so live verified work
  // always adds on top of migrated history rather than replacing it.
  const profiles = get('public_volunteers').map((row) => {
    const r = row as Record<string, number | string | boolean | null>
    const totalHours = Number(r.totalHours ?? 0)
    const verifiedHours = Number(r.verifiedHours ?? 0)
    const totalMissions = Number(r.totalMissions ?? 0)
    const verifiedMissions = Number(r.verifiedMissions ?? 0)
    return {
      ...(row as Partial<Profile>),
      userId: null,
      baselineHours: Math.max(0, totalHours - verifiedHours),
      baselineMissions: Math.max(0, totalMissions - verifiedMissions),
      baselinePeople: Number(r.peopleSupported ?? 0),
      baselinePrograms: Number(r.programsCount ?? 1),
      status: 'active',
    } as Profile
  })

  // Anonymous capacity rows first, own rows (which carry the profile) merged over them by id.
  const assignmentsById = new Map<string, Row>()
  for (const row of get('public_assignments'))
    assignmentsById.set(String(row.id), { ...row, profileId: '' })
  for (const row of get('assignments')) assignmentsById.set(String(row.id), row)

  return {
    ...emptyDataset(),
    organisations: get('organisations') as never,
    countries: get('countries') as never,
    programs: get('programs') as never,
    projects: get('projects') as never,
    chapters: get('chapters') as never,
    chapterGoals: get('chapter_goals') as never,
    chapterTeam: get('chapter_team') as never,
    profiles,
    memberRoles: get('member_roles') as never,
    credentials: get('public_credentials') as never,
    missions: get('missions') as never,
    missionRoles: get('mission_roles') as never,
    assignments: [...assignmentsById.values()] as never,
    impactRecords: get('impact_records') as never,
    impactOutputs: get('impact_outputs') as never,
    impactOutcomes: get('impact_outcomes') as never,
    impactEvidence: get('impact_evidence') as never,
    funds: get('funds') as never,
    donations: get('public_donations') as never,
    expenses: get('expenses') as never,
    expenseEvidence: get('expense_evidence') as never,
    partners: get('public_partners') as never,
    partnerPrograms: get('partner_programs') as never,
    partnerInkind: get('partner_inkind') as never,
    partnerCommitments: get('partner_commitments') as never,
    partnerTimeline: get('partner_timeline') as never,
    opportunities: get('opportunities') as never,
    commitments: get('commitments') as never,
    commitmentContributions: get('commitment_contributions') as never,
    applications: get('applications') as never,
    chapterRequests: get('chapter_requests') as never,
    chapterProposals: get('chapter_proposals') as never,
    announcements: get('announcements') as never,
    auditEvents: get('audit_events') as never,
  }
}
