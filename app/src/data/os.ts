/**
 * GOODNESS OS — the derivation engine.
 *
 * One truth: nothing here is stored. Capacity, verified hours, chapter rollups, fund positions
 * and partner figures are all computed from the same governed records the Trust Ledger and the
 * Impact page read. Every screen consumes this model, so two surfaces can never disagree.
 */
import type {
  Assignment,
  Chapter,
  ChapterGoal,
  Credential,
  Dataset,
  Donation,
  Expense,
  ExpenseEvidence,
  Fund,
  ImpactEvidence,
  ImpactOutcome,
  ImpactOutput,
  ImpactRecord,
  Mission,
  MissionRole,
  Opportunity,
  Partner,
  PartnerCommitment,
  PartnerInKind,
  PartnerTimelineEntry,
  Profile,
  Program,
} from '../lib/types'

const ACTIVE_STATES = ['joined', 'checked_in', 'submitted', 'verified'] as const
const pct = (value: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
const sum = <T>(rows: Array<T>, pick: (row: T) => number) =>
  rows.reduce((n, row) => n + (pick(row) || 0), 0)

export interface VolunteerView extends Profile {
  program: Program | null
  chapter: Chapter | null
  credentials: Array<Credential>
  verifiedMissions: number
  verifiedHours: number
  totalMissions: number
  totalHours: number
  peopleSupported: number
  programsCount: number
  sustainingMember: boolean
  /** Month the sustaining commitment started — the badge carries it, as the passport design does. */
  sustainingSince: string | null
}

export interface MissionRoleView extends MissionRole {
  filled: number
  remaining: number
}

export interface MissionView extends Mission {
  program: Program | null
  chapter: Chapter | null
  roles: Array<MissionRoleView>
  need: number
  filled: number
  remaining: number
  fillPct: number
  isFull: boolean
  liveAssignments: Array<Assignment>
}

export interface ImpactView extends ImpactRecord {
  program: Program | null
  chapter: Chapter | null
  outputs: Array<ImpactOutput>
  outcomes: Array<ImpactOutcome>
  evidence: Array<ImpactEvidence>
  evidenceVerified: number
  evidenceTotal: number
  evidencePct: number
  fullyVerified: boolean
  targetsMet: number
  targetsTotal: number
}

export interface FundView extends Fund {
  program: Program | null
  expenses: Array<ExpenseView>
  spent: number
  pending: number
  restricted: number
  restrictedRemaining: number
  remaining: number
  fundingGap: number
  documents: number
  documentsChecked: number
  documentedPct: number
  withDocs: number
  missingDocs: number
  spentPct: number
}

export interface ExpenseView extends Expense {
  evidence: Array<ExpenseEvidence>
  documentsChecked: number
}

export interface FinanceView {
  funds: Array<FundView>
  donations: Array<Donation>
  expenses: Array<ExpenseView>
  received: number
  allocated: number
  budgeted: number
  spent: number
  pending: number
  programSpend: number
  overheadSpend: number
  programSharePct: number
  overheadPct: number
  /** Share of accepted spending, by amount, that has at least one document attached. */
  documentedPct: number
  /** Share of accepted spending, by amount, where every attached document has been checked. */
  checkedPct: number
  unallocated: number
}

export interface PartnerView extends Partner {
  received: number
  donations: Array<Donation>
  programs: Array<Program>
  inKind: Array<PartnerInKind>
  inKindValue: number
  commitments: {
    goodness: Array<PartnerCommitment>
    partner: Array<PartnerCommitment>
  }
  timeline: Array<PartnerTimelineEntry>
  deployed: number
  peopleSupported: number
  goalPct: number
  tenureMonths: number
}

export interface OpportunityView extends Opportunity {
  program: Program | null
  gap: number
  securedPct: number
  funded: boolean
}

export interface ChapterView extends Chapter {
  parent: Chapter | null
  members: Array<VolunteerView>
  memberCount: number
  team: Array<{
    role: string
    sinceLabel: string | null
    untilLabel: string | null
    volunteer: VolunteerView | null
    personName: string | null
  }>
  missions: Array<MissionView>
  liveMissions: number
  impact: Array<ImpactView>
  peopleSupported: number
  hours: number
  partners: Array<PartnerView>
  deployed: number
  goals: Array<ChapterGoal & { current: number; pct: number }>
  standardsPct: number
}

export interface OSModel {
  data: Dataset
  currency: string
  programs: Array<Program>
  programBySlug: Map<string, Program>
  people: Array<VolunteerView>
  personBySlug: Map<string, VolunteerView>
  personById: Map<string, VolunteerView>
  missions: Array<MissionView>
  missionById: Map<string, MissionView>
  openMissions: Array<MissionView>
  impact: Array<ImpactView>
  publishedImpact: Array<ImpactView>
  impactById: Map<string, ImpactView>
  finance: FinanceView
  partners: Array<PartnerView>
  activePartners: Array<PartnerView>
  partnerById: Map<string, PartnerView>
  opportunities: Array<OpportunityView>
  chapters: Array<ChapterView>
  chapterById: Map<string, ChapterView>
  activeChapters: Array<ChapterView>
  formingChapters: Array<ChapterView>
  stats: {
    volunteers: number
    verifiedHours: number
    peopleSupported: number
    liveMissions: number
    openPositions: number
    fundsReceived: number
    fundsDeployed: number
    activeChapters: number
    partners: number
    publishedRecords: number
    evidenceVerifiedPct: number
    sustainingMembers: number
  }
}

export function buildOS(data: Dataset): OSModel {
  const programBySlug = new Map(data.programs.map((p) => [p.slug, p]))
  const chapterRaw = new Map(data.chapters.map((c) => [c.id, c]))
  const currency =
    data.countries.find((c) => c.isDefault)?.currencySymbol ?? '৳'

  // ── People ────────────────────────────────────────────────────────────────
  const credentialsByProfile = groupBy(data.credentials, (c) => c.profileId)
  const assignmentsByProfile = groupBy(data.assignments, (a) => a.profileId)
  const missionHours = new Map(data.missions.map((m) => [m.id, m.hours]))
  const activeCommitments = new Map(
    data.commitments
      .filter((c) => c.status === 'active' && c.badgeOptIn)
      .map((c) => [c.profileId, c.startedOn]),
  )

  const people: Array<VolunteerView> = data.profiles
    .filter((p) => p.status === 'active')
    .map((profile) => {
      const verified = (assignmentsByProfile.get(profile.id) ?? []).filter(
        (a) => a.state === 'verified',
      )
      const verifiedHours = sum(
        verified,
        (a) => a.hoursCredited ?? missionHours.get(a.missionId) ?? 0,
      )
      return {
        ...profile,
        program: profile.programSlug
          ? (programBySlug.get(profile.programSlug) ?? null)
          : null,
        chapter: profile.chapterId
          ? (chapterRaw.get(profile.chapterId) ?? null)
          : null,
        credentials: credentialsByProfile.get(profile.id) ?? [],
        verifiedMissions: verified.length,
        verifiedHours,
        totalMissions: profile.baselineMissions + verified.length,
        totalHours: profile.baselineHours + verifiedHours,
        peopleSupported: profile.baselinePeople,
        programsCount: profile.baselinePrograms,
        sustainingMember: activeCommitments.has(profile.id),
        sustainingSince: monthLabel(activeCommitments.get(profile.id)),
      }
    })

  const personById = new Map(people.map((p) => [p.id, p]))
  const personBySlug = new Map(people.map((p) => [p.slug, p]))

  // ── Missions ──────────────────────────────────────────────────────────────
  // Capacity = historical participants carried over from the migrated record + live claims.
  const rolesByMission = groupBy(data.missionRoles, (r) => r.missionId)
  const assignmentsByMission = groupBy(data.assignments, (a) => a.missionId)

  const missions: Array<MissionView> = data.missions.map((mission) => {
    const live = (assignmentsByMission.get(mission.id) ?? []).filter((a) =>
      (ACTIVE_STATES as readonly string[]).includes(a.state),
    )
    const roles = (rolesByMission.get(mission.id) ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((role) => {
        const filled = live.filter((a) => a.missionRoleId === role.id).length
        return { ...role, filled, remaining: Math.max(0, role.need - filled) }
      })
    const need = sum(roles, (r) => r.need)
    const filled = Math.min(need, mission.seedFilled + live.length)
    return {
      ...mission,
      program: programBySlug.get(mission.programSlug) ?? null,
      chapter: mission.chapterId
        ? (chapterRaw.get(mission.chapterId) ?? null)
        : null,
      roles,
      need,
      filled,
      remaining: Math.max(0, need - filled),
      fillPct: pct(filled, need),
      isFull: need > 0 && filled >= need,
      liveAssignments: live,
    }
  })
  const missionById = new Map(missions.map((m) => [m.id, m]))

  // ── Impact ────────────────────────────────────────────────────────────────
  const outputsByRecord = groupBy(data.impactOutputs, (o) => o.recordId)
  const outcomesByRecord = groupBy(data.impactOutcomes, (o) => o.recordId)
  const evidenceByRecord = groupBy(data.impactEvidence, (e) => e.recordId)

  const impact: Array<ImpactView> = data.impactRecords.map((record) => {
    const outputs = sortBy(
      outputsByRecord.get(record.id) ?? [],
      (o) => o.sortOrder,
    )
    const outcomes = sortBy(
      outcomesByRecord.get(record.id) ?? [],
      (o) => o.sortOrder,
    )
    const evidence = sortBy(
      evidenceByRecord.get(record.id) ?? [],
      (e) => e.sortOrder,
    )
    const verified = evidence.filter((e) => e.verified).length
    const withTargets = outputs.filter((o) => o.target != null)
    return {
      ...record,
      program: programBySlug.get(record.programSlug) ?? null,
      chapter: record.chapterId
        ? (chapterRaw.get(record.chapterId) ?? null)
        : null,
      outputs,
      outcomes,
      evidence,
      evidenceVerified: verified,
      evidenceTotal: evidence.length,
      evidencePct: pct(verified, evidence.length),
      fullyVerified: evidence.length > 0 && verified === evidence.length,
      targetsMet: withTargets.filter((o) => o.value >= (o.target ?? 0)).length,
      targetsTotal: withTargets.length,
    }
  })
  const publishedImpact = impact.filter((r) => r.published)
  const impactById = new Map(impact.map((r) => [r.id, r]))

  // ── Money ─────────────────────────────────────────────────────────────────
  const evidenceByExpense = groupBy(data.expenseEvidence, (e) => e.expenseId)
  const expenses: Array<ExpenseView> = data.expenses.map((expense) => {
    const evidence = evidenceByExpense.get(expense.id) ?? []
    return {
      ...expense,
      evidence,
      documentsChecked: evidence.filter((e) => e.checked).length,
    }
  })
  const expensesByFund = groupBy(expenses, (e) => e.fundId)

  const funds: Array<FundView> = data.funds.map((fund) => {
    const own = expensesByFund.get(fund.id) ?? []
    const spent = sum(
      own.filter((e) => e.status === 'approved'),
      (e) => e.amount,
    )
    const pendingAmount = sum(
      own.filter((e) => e.status === 'pending'),
      (e) => e.amount,
    )
    const restricted = sum(
      data.donations.filter(
        (d) => d.restrictedProgramSlug === fund.programSlug,
      ),
      (d) => d.amount,
    )
    const documents = sum(own, (e) => e.evidence.length)
    const documentsChecked = sum(own, (e) => e.documentsChecked)
    return {
      ...fund,
      program: programBySlug.get(fund.programSlug) ?? null,
      expenses: own,
      spent,
      pending: pendingAmount,
      restricted,
      restrictedRemaining: Math.max(0, restricted - spent),
      remaining: Math.max(0, fund.allocated - spent),
      fundingGap: Math.max(0, fund.budget - fund.allocated),
      documents,
      documentsChecked,
      documentedPct: pct(documentsChecked, documents),
      withDocs: own.filter((e) => e.evidence.length > 0).length,
      missingDocs: own.filter((e) => e.evidence.length === 0).length,
      spentPct: pct(spent, fund.allocated),
    }
  })

  const received = sum(data.donations, (d) => d.amount)
  const allocated = sum(funds, (f) => f.allocated)
  const budgeted = sum(funds, (f) => f.budget)
  const spent = sum(funds, (f) => f.spent)
  const pendingTotal = sum(funds, (f) => f.pending)
  const programSpend = sum(
    funds.filter((f) => !f.program?.isOperations),
    (f) => f.spent,
  )
  const overheadSpend = spent - programSpend
  // Documented and checked are shares of *money*, not of paperwork: the question a reader asks is
  // "how much of what you spent can you show me a document for", and "how much of it did you check".
  const acceptedSpend = expenses.filter((e) => e.status === 'approved')
  const documentedSpend = sum(
    acceptedSpend.filter((e) => e.evidence.length > 0),
    (e) => e.amount,
  )
  const checkedSpend = sum(
    acceptedSpend.filter(
      (e) => e.evidence.length > 0 && e.evidence.every((d) => d.checked),
    ),
    (e) => e.amount,
  )

  const finance: FinanceView = {
    funds,
    donations: data.donations,
    expenses,
    received,
    allocated,
    budgeted,
    spent,
    pending: pendingTotal,
    programSpend,
    overheadSpend,
    programSharePct: pct(programSpend, spent),
    overheadPct: pct(overheadSpend, spent),
    documentedPct: pct(documentedSpend, spent),
    checkedPct: pct(checkedSpend, spent),
    unallocated: Math.max(0, received - allocated),
  }

  // ── Partners ──────────────────────────────────────────────────────────────
  const donationsByPartner = groupBy(data.donations, (d) => d.partnerId ?? '')
  const programsByPartner = groupBy(data.partnerPrograms, (p) => p.partnerId)
  const inKindByPartner = groupBy(data.partnerInkind, (k) => k.partnerId)
  const commitmentsByPartner = groupBy(
    data.partnerCommitments,
    (c) => c.partnerId,
  )
  const timelineByPartner = groupBy(data.partnerTimeline, (t) => t.partnerId)

  const partners: Array<PartnerView> = data.partners.map((partner) => {
    const donations = donationsByPartner.get(partner.id) ?? []
    const partnerReceived = sum(donations, (d) => d.amount)
    const programs = (programsByPartner.get(partner.id) ?? [])
      .map((p) => programBySlug.get(p.programSlug))
      .filter((p): p is Program => !!p)
    const partnerCommitments = commitmentsByPartner.get(partner.id) ?? []
    // What the partner's funding supported: published records in the programmes they fund.
    const supported = publishedImpact.filter((r) =>
      programs.some((p) => p.slug === r.programSlug),
    )
    const deployed = sum(
      expenses.filter(
        (e) =>
          e.status === 'approved' &&
          programs.some(
            (p) => funds.find((f) => f.id === e.fundId)?.programSlug === p.slug,
          ),
      ),
      (e) => e.amount,
    )
    const peopleSupported = sum(supported, (r) => r.beneficiaries)
    return {
      ...partner,
      received: partnerReceived,
      donations,
      programs,
      inKind: inKindByPartner.get(partner.id) ?? [],
      inKindValue: sum(
        inKindByPartner.get(partner.id) ?? [],
        (k) => k.estValue,
      ),
      commitments: {
        goodness: sortBy(
          partnerCommitments.filter((c) => c.side === 'goodness'),
          (c) => c.sortOrder,
        ),
        partner: sortBy(
          partnerCommitments.filter((c) => c.side === 'partner'),
          (c) => c.sortOrder,
        ),
      },
      timeline: timelineByPartner.get(partner.id) ?? [],
      deployed,
      peopleSupported,
      goalPct: partner.goalTarget
        ? pct(peopleSupported, partner.goalTarget)
        : 0,
      tenureMonths: monthsSince(partner.sinceLabel),
    }
  })
  const partnerById = new Map(partners.map((p) => [p.id, p]))

  const opportunities: Array<OpportunityView> = data.opportunities.map((o) => ({
    ...o,
    program: programBySlug.get(o.programSlug) ?? null,
    gap: Math.max(0, o.target - o.secured),
    securedPct: pct(o.secured, o.target),
    funded: o.secured >= o.target,
  }))

  // ── Network ───────────────────────────────────────────────────────────────
  const goalsByChapter = groupBy(data.chapterGoals, (g) => g.chapterId)
  const teamByChapter = groupBy(data.chapterTeam, (t) => t.chapterId)

  const chapters: Array<ChapterView> = data.chapters.map((chapter) => {
    // University chapters are campus-scoped: they never absorb a whole city's work.
    const inGeography = (place: string | null | undefined) =>
      chapter.type === 'university'
        ? false
        : !!place &&
          (place === chapter.city || chapter.coverage.includes(place))

    const members = people.filter((p) => p.chapterId === chapter.id)
    const chapterMissions = missions.filter(
      (m) =>
        m.chapterId === chapter.id ||
        (m.chapterId == null && inGeography(m.chapter?.city)),
    )
    const chapterImpact = publishedImpact.filter(
      (r) =>
        r.chapterId === chapter.id ||
        (r.chapterId == null && inGeography(r.chapter?.city)),
    )
    const chapterPartners = partners.filter(
      (p) =>
        p.stage !== 'proposal' &&
        p.districts.some(
          (d) => d === chapter.city || chapter.coverage.includes(d),
        ),
    )
    const deployed = sum(
      expenses.filter((e) => {
        if (e.status !== 'approved') return false
        const record = e.impactRecordId
          ? impactById.get(e.impactRecordId)
          : null
        const mission = e.missionId ? missionById.get(e.missionId) : null
        return (
          record?.chapterId === chapter.id || mission?.chapterId === chapter.id
        )
      }),
      (e) => e.amount,
    )
    const peopleSupported = sum(chapterImpact, (r) => r.beneficiaries)
    const hours = sum(members, (m) => m.totalHours)
    const metricValue: Record<string, number> = {
      people: peopleSupported,
      hours,
      missions: chapterMissions.length,
      partners: chapterPartners.length,
    }
    return {
      ...chapter,
      parent: chapter.parentId
        ? (chapterRaw.get(chapter.parentId) ?? null)
        : null,
      members,
      memberCount: members.length,
      team: (teamByChapter.get(chapter.id) ?? []).map((t) => ({
        role: t.role,
        sinceLabel: t.sinceLabel,
        untilLabel: t.untilLabel,
        personName: t.personName,
        volunteer: t.profileId ? (personById.get(t.profileId) ?? null) : null,
      })),
      missions: chapterMissions,
      liveMissions: chapterMissions.filter((m) => m.status === 'open').length,
      impact: chapterImpact,
      peopleSupported,
      hours,
      partners: chapterPartners,
      deployed,
      goals: sortBy(goalsByChapter.get(chapter.id) ?? [], (g) => g.label).map(
        (g) => ({
          ...g,
          current: metricValue[g.metric] ?? 0,
          pct: pct(metricValue[g.metric] ?? 0, g.target),
        }),
      ),
      standardsPct: pct(chapter.standardsDone, chapter.standardsTotal),
    }
  })
  const chapterById = new Map(chapters.map((c) => [c.id, c]))

  const evidenceTotal = sum(publishedImpact, (r) => r.evidenceTotal)
  const evidenceVerified = sum(publishedImpact, (r) => r.evidenceVerified)

  return {
    data,
    currency,
    programs: sortBy(data.programs, (p) => p.sortOrder),
    programBySlug,
    people,
    personBySlug,
    personById,
    missions,
    missionById,
    openMissions: missions.filter((m) => m.status === 'open'),
    impact,
    publishedImpact,
    impactById,
    finance,
    partners,
    activePartners: partners.filter(
      (p) => p.stage === 'active' || p.stage === 'renewal',
    ),
    partnerById,
    opportunities,
    chapters,
    chapterById,
    activeChapters: chapters.filter((c) => c.status === 'active'),
    formingChapters: chapters.filter((c) => c.status === 'forming'),
    stats: {
      volunteers: people.length,
      verifiedHours: sum(people, (p) => p.totalHours),
      peopleSupported: sum(publishedImpact, (r) => r.beneficiaries),
      liveMissions: missions.filter((m) => m.status === 'open').length,
      openPositions: sum(
        missions.filter((m) => m.status === 'open'),
        (m) => m.remaining,
      ),
      fundsReceived: finance.received,
      fundsDeployed: finance.spent,
      activeChapters: chapters.filter((c) => c.status === 'active').length,
      partners: partners.filter(
        (p) => p.stage === 'active' || p.stage === 'renewal',
      ).length,
      publishedRecords: publishedImpact.length,
      evidenceVerifiedPct: pct(evidenceVerified, evidenceTotal),
      sustainingMembers: data.commitments.filter((c) => c.status === 'active')
        .length,
    },
  }
}

// ── Small helpers ───────────────────────────────────────────────────────────
function groupBy<T, TKey>(
  rows: Array<T>,
  key: (row: T) => TKey,
): Map<TKey, Array<T>> {
  const out = new Map<TKey, Array<T>>()
  for (const row of rows) {
    const k = key(row)
    const list = out.get(k)
    if (list) list.push(row)
    else out.set(k, [row])
  }
  return out
}

function sortBy<T>(rows: Array<T>, key: (row: T) => number | string): Array<T> {
  return rows
    .slice()
    .sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0))
}

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

/** "2026-03-14" -> "Mar 2026". Commitment start dates are stored as dates but read as months. */
function monthLabel(iso: string | undefined): string | null {
  if (!iso) return null
  const [year, month] = iso.split('-')
  const name = MONTHS[Number(month) - 1]
  if (!year || !name) return null
  return `${name[0]!.toUpperCase()}${name.slice(1)} ${year}`
}

/** "Jun 2026" -> months elapsed. Used for partnership tenure, never for money. */
export function monthsSince(
  label: string | null | undefined,
  now = new Date(),
): number {
  if (!label) return 0
  const match = /([a-z]{3})[a-z]*\s+(\d{4})/i.exec(label)
  if (!match) return 0
  const month = MONTHS.indexOf((match[1] ?? '').toLowerCase())
  const year = Number(match[2] ?? 0)
  if (month < 0 || !year) return 0
  return Math.max(0, (now.getFullYear() - year) * 12 + (now.getMonth() - month))
}

/** Sustaining rhythm normalised to a 30-day window — mirrors public.rhythm_per_30(). */
export function rhythmPer30(rhythm: string): number {
  return rhythm === 'Daily'
    ? 30
    : rhythm === 'Weekly'
      ? 4.3
      : rhythm === 'Bi-weekly'
        ? 2.15
        : 1
}

export { pct }
