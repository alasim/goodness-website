#!/usr/bin/env node
/**
 * GOODNESS OS — seed generator.
 *
 * One source of truth for content: the prototype's *-data.js files. This script normalises them
 * into the relational shape defined by supabase/migrations and emits BOTH outputs:
 *
 *   supabase/seed.sql        loaded by `supabase db reset` / `supabase db seed`
 *   app/src/data/seed.json   used by the app's local driver, so the UI runs with no backend
 *
 * Because both come from the same normalisation pass, the seeded database and the offline
 * driver can never drift apart.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const load = (file) => import(pathToFileURL(resolve(root, file)).href)

const LEVELS = ['Volunteer', 'Senior Volunteer', 'Team Lead', 'Chapter Lead']
const pad = (n, len) => String(n).padStart(len, '0')
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Deterministic uuid v5-ish from a namespace + name, so re-running the seed is stable. */
import { createHash } from 'node:crypto'
const uuidFor = (kind, key) => {
  const h = createHash('sha1').update(`goodness-os:${kind}:${key}`).digest('hex')
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    '5' + h.slice(13, 16),
    ((parseInt(h.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + h.slice(17, 20),
    h.slice(20, 32),
  ].join('-')
}

const [volunteersData, missionsData, impactData, financeData, partnersData, chaptersData] =
  await Promise.all([
    load('volunteers-data.js'),
    load('missions-data.js'),
    load('impact-data.js'),
    load('finance-data.js'),
    load('partners-data.js'),
    load('chapters-data.js'),
  ])

const db = {
  organisations: [],
  countries: [],
  programs: [],
  projects: [],
  chapters: [],
  chapter_goals: [],
  profiles: [],
  member_roles: [],
  credentials: [],
  chapter_team: [],
  missions: [],
  mission_roles: [],
  impact_records: [],
  impact_outputs: [],
  impact_outcomes: [],
  impact_evidence: [],
  partners: [],
  partner_programs: [],
  partner_inkind: [],
  partner_commitments: [],
  partner_timeline: [],
  partner_employee_sessions: [],
  opportunities: [],
  funds: [],
  donations: [],
  expenses: [],
  expense_evidence: [],
  announcements: [],
}

// ── Organisation and country ────────────────────────────────────────────────
db.organisations.push({
  id: 'org-goodness-society',
  name: 'Goodness Society',
  slug: 'goodness-society',
  tagline: 'Together for a Better Tomorrow',
  registration_ref: 'Government-registered non-profit',
})
db.countries.push({
  id: 'ctry-bd',
  organisation_id: 'org-goodness-society',
  name: 'Bangladesh',
  iso2: 'BD',
  currency_code: 'BDT',
  currency_symbol: '৳',
  locale: 'en-BD',
  is_default: true,
})

// ── Programs ────────────────────────────────────────────────────────────────
const programNames = new Map()
volunteersData.volunteers.forEach((v) => programNames.set(v.programSlug, v.program))
missionsData.missions.forEach((m) => programNames.set(m.programSlug, m.program))
financeData.funds.forEach((f) => programNames.set(f.programSlug, f.program))
impactData.impactRecords.forEach((r) => programNames.set(r.programSlug, r.program))

volunteersData.programFilters
  .filter((p) => p.slug !== 'all')
  .forEach((p, i) => {
    const colors = volunteersData.programColors[p.slug] || {}
    db.programs.push({
      slug: p.slug,
      name: programNames.get(p.slug) || p.label,
      short_name: p.label,
      summary: null,
      color: colors.color || '#1B7A34',
      bg_color: colors.bg || '#f0faf3',
      light_color: colors.light || '#4DC86A',
      sort_order: i,
      is_operations: false,
    })
  })
db.programs.push({
  slug: 'operations',
  name: programNames.get('operations') || 'Operations & Administration',
  short_name: 'Operations',
  summary: 'Running the organisation — the overhead every honest ledger shows.',
  color: '#4B5563',
  bg_color: '#f7f9f8',
  light_color: '#9CA3AF',
  sort_order: 90,
  is_operations: true,
})

// ── Chapters ────────────────────────────────────────────────────────────────
const cityToChapter = new Map()
chaptersData.chapters.forEach((c) => {
  db.chapters.push({
    id: c.id,
    country_id: 'ctry-bd',
    parent_id: c.parentId ?? null,
    name: c.name,
    slug: slugify(c.name),
    type: c.type,
    status: c.status,
    city: c.city,
    division: c.division ?? null,
    since_label: c.since ?? null,
    coverage: c.coverage || [],
    story: c.story ?? null,
    campus_note: c.campusNote ?? null,
    standards_done: c.standards?.done ?? 0,
    standards_total: c.standards?.total ?? 6,
  })
  if (c.status === 'active') (c.coverage || []).forEach((city) => cityToChapter.set(city, c.id))
  ;(c.goals || []).forEach((g) =>
    db.chapter_goals.push({
      id: uuidFor('chapter_goal', `${c.id}:${g.metric}`),
      chapter_id: c.id,
      label: g.label,
      metric: g.metric,
      target: g.target,
      period_label: '2026',
    }),
  )
})

// ── People ──────────────────────────────────────────────────────────────────
// Baselines mirror the prototype's seeded passport figures: service recorded before this
// system existed. Live assignments add on top of them; they never overwrite each other.
const profileIdBySlug = new Map()
volunteersData.volunteers.forEach((v, i) => {
  const id = uuidFor('profile', v.id)
  profileIdBySlug.set(v.id, id)
  const num = parseInt(String(v.impactStat).replace(/[^0-9]/g, ''), 10)
  const people = !Number.isNaN(num) && num >= 30 ? num : 40 + ((i * 37) % 160)
  const missions = Math.min(44, 6 + Math.round(people / 12) + (i % 4))
  const hours = missions * (4 + (i % 3))
  const programsCount = 1 + (i % 3) + (v.featured ? 1 : 0)
  const levelIndex = v.featured ? 2 : i % 5 === 4 ? 2 : i % 3 === 1 ? 1 : 0

  db.profiles.push({
    id,
    user_id: null,
    slug: v.id,
    full_name: v.name,
    initials: v.initials,
    avatar_color: v.avatarColor,
    role_title: v.role,
    program_slug: v.programSlug,
    city: v.city,
    chapter_id: cityToChapter.get(v.city) ?? null,
    joined_month: v.joinedMonth,
    quote: v.quote,
    bio: v.bio,
    skills: v.skills || [],
    impact_stat: v.impactStat,
    impact_label: v.impactLabel,
    level: LEVELS[levelIndex],
    featured: !!v.featured,
    status: 'active',
    certificate_enabled: i % 3 !== 2,
    goodness_id: 'GS-' + pad(1000 + i * 17, 4),
    baseline_missions: missions,
    baseline_hours: hours,
    baseline_people: people,
    baseline_programs: programsCount,
    email: null,
    phone: null,
    address: null,
    emergency_contact: null,
    id_document_ref: null,
    admin_notes: null,
  })

  const certRef = 'GS-VOL-2024-' + pad(100 + i * 3, 4)
  const creds = [
    {
      ref: certRef,
      title: 'Certificate of Volunteer Service',
      issued: v.joinedMonth,
      service: `${hours} verified service hours across ${missions} missions`,
    },
  ]
  if (v.programSlug === 'ai-digital-skills')
    creds.push({
      ref: 'GS-CRD-2024-' + pad(400 + i, 4),
      title: 'AI Literacy Trainer',
      issued: 'Sep 2024',
      service: 'Facilitator credential — AI & Digital Skills Development',
    })
  if (levelIndex >= 2)
    creds.push({
      ref: 'GS-CRD-2024-' + pad(700 + i, 4),
      title: 'Volunteer Leadership',
      issued: 'Nov 2024',
      service: 'Leadership credential — team coordination and mission delivery',
    })
  creds.forEach((c) =>
    db.credentials.push({
      id: 'crd-' + slugify(c.ref),
      profile_id: id,
      ref: c.ref,
      title: c.title,
      program_slug: v.programSlug,
      service_summary: c.service,
      issued_label: c.issued,
      status: 'valid',
      download_enabled: i % 3 !== 2,
      revoked_reason: null,
    }),
  )
})

// Chapter leadership teams reference real volunteers.
chaptersData.chapters.forEach((c) => {
  ;(c.team || []).forEach((t) =>
    db.chapter_team.push({
      id: uuidFor('chapter_team', `${c.id}:${t.volunteerId}:${t.role}`),
      chapter_id: c.id,
      profile_id: profileIdBySlug.get(t.volunteerId) ?? null,
      person_name: null,
      role: t.role,
      since_label: t.since ?? null,
      until_label: null,
    }),
  )
  ;(c.leadershipHistory || []).forEach((t, i) =>
    db.chapter_team.push({
      id: uuidFor('chapter_team_hist', `${c.id}:${i}`),
      chapter_id: c.id,
      profile_id: profileIdBySlug.get(slugify(t.name)) ?? null,
      person_name: t.name,
      role: t.role,
      since_label: t.period ?? null,
      until_label: t.period ?? null,
    }),
  )
})

// Roles: chapter leads come from the chapter teams; HQ roles are named explicitly.
chaptersData.chapters.forEach((c) => {
  ;(c.team || []).forEach((t) => {
    const profileId = profileIdBySlug.get(t.volunteerId)
    if (!profileId) return
    const role = /lead/i.test(t.role)
      ? t.role.toLowerCase().includes('chapter') || t.role.toLowerCase().includes('campus')
        ? 'chapter_lead'
        : 'team_lead'
      : 'volunteer'
    db.member_roles.push({
      id: uuidFor('member_role', `${c.id}:${t.volunteerId}:${role}`),
      profile_id: profileId,
      role,
      chapter_id: c.id,
    })
  })
})

// ── Projects ────────────────────────────────────────────────────────────────
const projectId = (label) => 'prj-' + slugify(label)
const seenProjects = new Set()
const addProject = (label, programSlug, chapterId) => {
  if (!label) return null
  const id = projectId(label)
  if (!seenProjects.has(id)) {
    seenProjects.add(id)
    db.projects.push({
      id,
      program_slug: programSlug,
      chapter_id: chapterId ?? null,
      name: label,
      year: 2026,
      summary: null,
    })
  }
  return id
}
financeData.funds.forEach((f) => addProject(f.project, f.programSlug, null))
impactData.impactRecords.forEach((r) => addProject(r.project, r.programSlug, cityToChapter.get(r.chapter) ?? null))

// ── Missions ────────────────────────────────────────────────────────────────
missionsData.missions.forEach((m) => {
  db.missions.push({
    id: m.id,
    title: m.title,
    program_slug: m.programSlug,
    project_id: null,
    chapter_id: cityToChapter.get(m.chapter) ?? null,
    scope: m.scope === 'national' ? 'national' : 'chapter',
    venue: m.venue ?? null,
    date_label: m.date ?? null,
    time_label: m.time ?? null,
    starts_at: null,
    hours: m.hours ?? 0,
    impact_target: m.impactTarget ?? null,
    summary: m.summary ?? null,
    status: m.status ?? 'open',
    priority: m.priority ?? 'normal',
    participation: m.participation ?? 'onsite',
    lead_profile_id:
      profileIdBySlug.get(
        volunteersData.volunteers.find((v) => v.name === m.lead)?.id ?? '',
      ) ?? null,
    lead_name: m.lead ?? null,
    seed_filled: m.seedFilled ?? 0,
    published: true,
  })
  ;(m.roles || []).forEach((r, i) =>
    db.mission_roles.push({
      id: `${m.id}-role-${i + 1}`,
      mission_id: m.id,
      role: r.role,
      need: r.need,
      skills: r.skills || [],
      sort_order: i,
    }),
  )
})

// ── Impact ──────────────────────────────────────────────────────────────────
impactData.impactRecords.forEach((r) => {
  db.impact_records.push({
    id: r.id,
    mission_id: r.missionId ?? null,
    program_slug: r.programSlug,
    project_id: r.project ? projectId(r.project) : null,
    chapter_id: cityToChapter.get(r.chapter) ?? null,
    title: r.title,
    project_label: r.project ?? null,
    date_label: r.date ?? null,
    published: !!r.published,
    unit: r.unit ?? 'people',
    unit_label: r.unitLabel ?? 'people supported',
    primary_value: r.primaryValue ?? 0,
    beneficiaries: r.beneficiaries ?? 0,
    measurement_due_label: r.measurementDue ?? null,
  })
  ;(r.outputs || []).forEach((o, i) =>
    db.impact_outputs.push({
      id: uuidFor('impact_output', `${r.id}:${i}`),
      record_id: r.id,
      label: o.label,
      value: o.value ?? 0,
      target: o.target ?? null,
      sort_order: i,
    }),
  )
  ;(r.outcomes || []).forEach((o, i) =>
    db.impact_outcomes.push({
      id: uuidFor('impact_outcome', `${r.id}:${i}`),
      record_id: r.id,
      label: o.label,
      value: o.value ?? null,
      basis: o.basis ?? 'pending',
      note: o.note ?? null,
      evidence_label: o.evidence ?? null,
      due_label: o.due ?? null,
      sort_order: i,
    }),
  )
  ;(r.evidence || []).forEach((e, i) =>
    db.impact_evidence.push({
      id: uuidFor('impact_evidence', `${r.id}:${i}`),
      record_id: r.id,
      label: e.label,
      kind: ['document', 'photo', 'report', 'video', 'dataset'].includes(e.type) ? e.type : 'document',
      verified: !!e.verified,
      sort_order: i,
    }),
  )
})

// ── Money ───────────────────────────────────────────────────────────────────
financeData.funds.forEach((f) =>
  db.funds.push({
    id: f.id,
    program_slug: f.programSlug,
    chapter_id: null,
    project_label: f.project ?? null,
    budget: f.budget ?? 0,
    allocated: f.allocated ?? f.budget ?? 0,
    currency: 'BDT',
  }),
)

const partnerIdByDonor = new Map()
partnersData.partners.forEach((p) => partnerIdByDonor.set(p.name, p.id))

financeData.donations.forEach((d) =>
  db.donations.push({
    id: d.id,
    donor_name: d.donor,
    donor_profile_id:
      profileIdBySlug.get(volunteersData.volunteers.find((v) => v.name === d.donor)?.id ?? '') ?? null,
    partner_id: partnerIdByDonor.get(d.donor) ?? null,
    kind: d.type,
    amount: d.amount,
    currency: 'BDT',
    donated_on: null,
    date_label: d.date,
    method: d.method,
    restricted_program_slug: d.restricted ?? null,
    restricted_chapter_id: null,
    receipt_ref: d.receipt ?? null,
    acknowledged: !!d.acknowledged,
  }),
)

financeData.expenses.forEach((e) => {
  db.expenses.push({
    id: e.id,
    fund_id: e.fundId,
    item: e.item,
    amount: e.amount,
    spent_on: null,
    date_label: e.date,
    payee: e.payee ?? null,
    status: e.status,
    approved_by_label: e.approvedBy ?? null,
    approved_by: null,
    approved_at: null,
    mission_id: e.missionId ?? null,
    impact_record_id: e.impactId ?? null,
  })
  ;(e.evidence || []).forEach((x, i) =>
    db.expense_evidence.push({
      id: uuidFor('expense_evidence', `${e.id}:${i}`),
      expense_id: e.id,
      label: x.label,
      checked: !!x.checked,
    }),
  )
})

// ── Partners ────────────────────────────────────────────────────────────────
partnersData.partners.forEach((p) => {
  db.partners.push({
    id: p.id,
    slug: slugify(p.name),
    name: p.name,
    kind: p.kind,
    tier: p.tier ?? null,
    stage: p.stage,
    since_label: p.since ?? null,
    renewal_label: p.renewal ?? null,
    contact: p.contact ?? null,
    story: p.story ?? null,
    goal_label: p.goal?.label ?? null,
    goal_target: p.goal?.target ?? null,
    committed: p.committed ?? 0,
    currency: 'BDT',
    districts: p.districts || [],
    disclose_funding: !!p.discloseFunding,
    employees_participated: p.employees?.participated ?? 0,
    employees_hours: p.employees?.hours ?? 0,
    employees_sessions: p.employees?.sessions ?? 0,
    logo_path: null,
  })
  ;(p.programs || []).forEach((slug) => db.partner_programs.push({ partner_id: p.id, program_slug: slug }))
  ;(p.inKind || []).forEach((k, i) =>
    db.partner_inkind.push({
      id: uuidFor('partner_inkind', `${p.id}:${i}`),
      partner_id: p.id,
      label: k.label,
      est_value: k.estValue ?? 0,
    }),
  )
  ;['goodness', 'partner'].forEach((side) =>
    (p.commitments?.[side] || []).forEach((c, i) =>
      db.partner_commitments.push({
        id: uuidFor('partner_commitment', `${p.id}:${side}:${i}`),
        partner_id: p.id,
        side,
        label: c.label,
        done: c.done ?? null,
        total: c.total ?? null,
        unit: c.unit ?? null,
        note: c.note ?? null,
        sort_order: i,
      }),
    ),
  )
  ;(p.timeline || []).forEach((t, i) =>
    db.partner_timeline.push({
      id: uuidFor('partner_timeline', `${p.id}:${i}`),
      partner_id: p.id,
      date_label: t.date,
      happened_on: null,
      kind: t.type,
      text: t.text,
    }),
  )
  if (p.employees?.sessions)
    db.partner_employee_sessions.push({
      id: uuidFor('partner_session', p.id),
      partner_id: p.id,
      mission_id: null,
      people: p.employees.participated ?? 0,
      hours: p.employees.hours ?? 0,
      date_label: p.since ?? null,
    })
})

partnersData.opportunities.forEach((o) =>
  db.opportunities.push({
    id: o.id,
    title: o.title,
    program_slug: o.programSlug,
    chapter_id: null,
    where_label: o.where ?? null,
    urgent: !!o.urgent,
    target: o.target,
    secured: o.secured ?? 0,
    seeking: o.seeking || [],
    expected: o.expected || [],
    note: o.note ?? null,
    open: (o.secured ?? 0) < o.target,
  }),
)

// ── HQ announcements ────────────────────────────────────────────────────────
db.announcements.push(
  {
    id: uuidFor('announcement', 'standards-q3'),
    title: 'Goodness Standards check-in — Q3',
    body: 'Every chapter reviews its six standards this quarter. Chapter Control shows where you stand; HQ reviews anything below 4/6 with you, not at you.',
    audience: 'network',
    chapter_id: null,
    created_by: null,
  },
  {
    id: uuidFor('announcement', 'evidence-discipline'),
    title: 'Evidence before publication',
    body: 'An impact record can be published while evidence is still being checked — but the record must say so. Publication and verification are separate promises.',
    audience: 'network',
    chapter_id: null,
    created_by: null,
  },
)

// ── Emit SQL ────────────────────────────────────────────────────────────────
const sqlValue = (v) => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'null'
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (Array.isArray(v)) {
    if (!v.length) return `'{}'`
    return `ARRAY[${v.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(', ')}]::text[]`
  }
  return `'${String(v).replace(/'/g, "''")}'`
}

const insertBlock = (table, rows) => {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const lines = rows.map((r) => `  (${cols.map((c) => sqlValue(r[c])).join(', ')})`)
  return `insert into public.${table} (${cols.join(', ')}) values\n${lines.join(',\n')}\non conflict do nothing;\n`
}

const order = Object.keys(db)
const sql = [
  '-- GOODNESS OS — seed data.',
  '-- GENERATED FILE — do not edit by hand. Regenerate with: npm run gen:seed (in app/).',
  '-- Source of truth: the prototype data modules at the repository root.',
  '',
  'begin;',
  '',
  ...order.map((t) => insertBlock(t, db[t])).filter(Boolean),
  '-- Capacity, hours, chapter rollups and ledger totals are all derived at read time.',
  '-- Nothing above stores a computed number.',
  'commit;',
  '',
].join('\n')

writeFileSync(resolve(root, 'supabase/seed.sql'), sql)

// ── Emit JSON for the app's local driver ────────────────────────────────────
const camel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
const camelKeys = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [camel(k), v]))
const json = Object.fromEntries(order.map((t) => [camel(t), db[t].map(camelKeys)]))
json.assignments = []
json.commitments = []
json.commitmentContributions = []
json.applications = []
json.chapterRequests = []
json.chapterProposals = []
json.partnerEnquiries = []
json.auditEvents = []

const jsonPath = resolve(root, 'app/src/data/seed.json')
mkdirSync(dirname(jsonPath), { recursive: true })
writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n')

const counts = order.map((t) => `${t}=${db[t].length}`).join(' ')
console.log('seed generated:', counts)
