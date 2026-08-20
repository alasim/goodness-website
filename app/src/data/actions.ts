/**
 * GOODNESS OS — write path.
 *
 * Every mutation is expressed once and implemented for both drivers. On Supabase the database
 * decides what is allowed (row level security); on the local driver the same intent is recorded
 * in the overlay, together with an audit entry, so governance is visible even in the prototype.
 */
import { getSupabase } from '../lib/supabase'
import { hasSupabase } from '../lib/env'
import { patchOverlay, recordAudit } from './local'
import type {
  Application,
  Assignment,
  Chapter,
  ChapterRequest,
  Commitment,
  CommitmentDestination,
  CommitmentRhythm,
  Donation,
  ExpenseStatus,
  Mission,
  MissionRole,
  Profile,
} from '../lib/types'

const now = () => new Date().toISOString()
const id = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const snake = (key: string) =>
  key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
const toRow = (obj: object) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [snake(k), v]))

async function sb() {
  const client = getSupabase()
  if (!client) throw new Error('Supabase driver is not configured')
  return client
}

// ── Sign-in-lite (local driver only; Supabase uses real auth) ───────────────
export function claimProfile(slug: string | null) {
  patchOverlay((o) => {
    o.me = slug
    if (slug) recordAudit(o, 'session.claim', 'profile', slug)
  })
}

export function claimPartner(partnerId: string | null) {
  patchOverlay((o) => {
    o.partner = partnerId
  })
}

export function claimChapterLead(chapterId: string | null) {
  patchOverlay((o) => {
    o.chapterLead = chapterId
  })
}

// ── Missions ────────────────────────────────────────────────────────────────
export async function joinMission(input: {
  missionId: string
  missionRoleId: string
  profileId: string
}) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('assignments')
      .insert(toRow({ ...input, state: 'joined' }))
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const existing = o.assignments.find(
      (a) => a.missionId === input.missionId && a.profileId === input.profileId,
    )
    if (existing && existing.state !== 'withdrawn') return
    if (existing) {
      existing.state = 'joined'
      existing.missionRoleId = input.missionRoleId
      existing.joinedAt = now()
    } else {
      o.assignments.push({
        id: id('asg'),
        missionId: input.missionId,
        missionRoleId: input.missionRoleId,
        profileId: input.profileId,
        state: 'joined',
        joinedAt: now(),
        checkedInAt: null,
        submittedAt: null,
        verifiedAt: null,
        verifiedBy: null,
        hoursCredited: null,
        note: null,
      })
    }
    recordAudit(o, 'mission.join', 'mission', input.missionId, {
      newValue: { state: 'joined' },
    })
  })
}

/** One primary role per volunteer: changing role moves capacity rather than adding to it. */
export async function changeMissionRole(
  assignmentId: string,
  missionRoleId: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('assignments')
      .update({ mission_role_id: missionRoleId })
      .eq('id', assignmentId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const assignment = o.assignments.find((a) => a.id === assignmentId)
    if (!assignment) return
    recordAudit(o, 'mission.change_role', 'assignment', assignmentId, {
      oldValue: { missionRoleId: assignment.missionRoleId },
      newValue: { missionRoleId },
    })
    assignment.missionRoleId = missionRoleId
  })
}

export async function advanceAssignment(
  assignmentId: string,
  state: Assignment['state'],
) {
  if (hasSupabase) {
    const client = await sb()
    const stamp =
      state === 'checked_in'
        ? { checked_in_at: now() }
        : state === 'submitted'
          ? { submitted_at: now() }
          : {}
    const { error } = await client
      .from('assignments')
      .update({ state, ...stamp })
      .eq('id', assignmentId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const assignment = o.assignments.find((a) => a.id === assignmentId)
    if (!assignment) return
    const previous = assignment.state
    assignment.state = state
    if (state === 'checked_in') assignment.checkedInAt = now()
    if (state === 'submitted') assignment.submittedAt = now()
    recordAudit(o, `mission.${state}`, 'assignment', assignmentId, {
      oldValue: { state: previous },
      newValue: { state },
    })
  })
}

export async function withdrawFromMission(assignmentId: string) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('assignments')
      .delete()
      .eq('id', assignmentId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const assignment = o.assignments.find((a) => a.id === assignmentId)
    if (!assignment) return
    assignment.state = 'withdrawn'
    recordAudit(o, 'mission.withdraw', 'assignment', assignmentId)
  })
}

/** Hours are verified by a team lead — never by the volunteer who did the work. */
export async function verifyAssignment(
  assignmentId: string,
  hours: number | null,
  verify = true,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('assignments')
      .update({
        state: verify ? 'verified' : 'submitted',
        verified_at: verify ? now() : null,
        hours_credited: verify ? hours : null,
      })
      .eq('id', assignmentId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const assignment = o.assignments.find((a) => a.id === assignmentId)
    if (!assignment) return
    const previous = assignment.state
    assignment.state = verify ? 'verified' : 'submitted'
    assignment.verifiedAt = verify ? now() : null
    assignment.hoursCredited = verify ? hours : null
    recordAudit(
      o,
      verify ? 'hours.verify' : 'hours.reverse',
      'assignment',
      assignmentId,
      {
        oldValue: { state: previous },
        newValue: { state: assignment.state, hours },
        reason: verify
          ? 'Team lead confirmed attendance'
          : 'Verification reversed',
      },
    )
  })
}

export async function createMission(
  mission: Omit<Mission, 'published'>,
  roles: Array<Omit<MissionRole, 'id' | 'missionId'>>,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('missions')
      .insert(toRow({ ...mission, published: true }))
    if (error) throw new Error(error.message)
    const roleRows = roles.map((r, i) =>
      toRow({
        ...r,
        id: `${mission.id}-role-${i + 1}`,
        missionId: mission.id,
        sortOrder: i,
      }),
    )
    const { error: roleError } = await client
      .from('mission_roles')
      .insert(roleRows)
    if (roleError) throw new Error(roleError.message)
    return
  }
  patchOverlay((o) => {
    o.missions.push({ ...mission, published: true })
    roles.forEach((role, i) =>
      o.missionRoles.push({
        ...role,
        id: `${mission.id}-role-${i + 1}`,
        missionId: mission.id,
        sortOrder: i,
      }),
    )
    recordAudit(o, 'mission.create', 'mission', mission.id, {
      newValue: { title: mission.title },
    })
  })
}

export async function patchMission(missionId: string, patch: Partial<Mission>) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('missions')
      .update(toRow(patch))
      .eq('id', missionId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.missionPatches[missionId] = { ...o.missionPatches[missionId], ...patch }
    recordAudit(o, 'mission.update', 'mission', missionId, { newValue: patch })
  })
}

// ── People ──────────────────────────────────────────────────────────────────
export async function patchProfile(
  profileId: string,
  patch: Partial<Profile>,
  reason?: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('profiles')
      .update(toRow(patch))
      .eq('id', profileId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.profilePatches[profileId] = { ...o.profilePatches[profileId], ...patch }
    recordAudit(o, 'profile.update', 'profile', profileId, {
      newValue: patch,
      reason,
    })
  })
}

export async function submitApplication(
  application: Omit<
    Application,
    'id' | 'status' | 'createdAt' | 'decidedAt' | 'createdProfileId' | 'note'
  >,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('applications')
      .insert(toRow(application))
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.applications.unshift({
      ...application,
      id: id('app'),
      status: 'pending',
      note: null,
      createdAt: now(),
      decidedAt: null,
      createdProfileId: null,
    })
    recordAudit(o, 'application.received', 'application', application.fullName)
  })
}

export async function decideApplication(
  applicationId: string,
  status: 'approved' | 'rejected',
  note?: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('applications')
      .update({ status, note: note ?? null, decided_at: now() })
      .eq('id', applicationId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const application = o.applications.find((a) => a.id === applicationId)
    if (!application) return
    const previous = application.status
    application.status = status
    application.note = note ?? null
    application.decidedAt = now()
    recordAudit(o, `application.${status}`, 'application', applicationId, {
      oldValue: { status: previous },
      newValue: { status },
      reason: note,
    })
  })
}

// ── Money ───────────────────────────────────────────────────────────────────
export async function setExpenseStatus(
  expenseId: string,
  status: ExpenseStatus,
  reason?: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client.rpc('set_expense_status', {
      target: expenseId,
      next_status: status,
      reason: reason ?? null,
    })
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const previous = o.expensePatches[expenseId]?.status
    o.expensePatches[expenseId] = { ...o.expensePatches[expenseId], status }
    recordAudit(o, `expense.${status}`, 'expense', expenseId, {
      oldValue: { status: previous ?? 'pending' },
      newValue: { status },
      reason,
    })
  })
}

export async function setExpenseEvidenceChecked(
  evidenceId: string,
  checked: boolean,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('expense_evidence')
      .update({ checked })
      .eq('id', evidenceId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.expenseEvidencePatches[evidenceId] = { checked }
    recordAudit(
      o,
      checked ? 'document.checked' : 'document.unchecked',
      'expense_evidence',
      evidenceId,
    )
  })
}

export async function addDonation(donation: Omit<Donation, 'id'>) {
  const record: Donation = { ...donation, id: id('don') }
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client.from('donations').insert(toRow(record))
    if (error) throw new Error(error.message)
    return record
  }
  patchOverlay((o) => {
    o.donations.unshift(record)
    recordAudit(o, 'donation.recorded', 'donation', record.id, {
      newValue: { donor: record.donorName, amount: record.amount },
    })
  })
  return record
}

// ── Impact ──────────────────────────────────────────────────────────────────
export async function setImpactPublished(recordId: string, published: boolean) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('impact_records')
      .update({ published, published_at: published ? now() : null })
      .eq('id', recordId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.impactPatches[recordId] = { ...o.impactPatches[recordId], published }
    recordAudit(
      o,
      published ? 'impact.publish' : 'impact.unpublish',
      'impact_record',
      recordId,
    )
  })
}

export async function setEvidenceVerified(
  evidenceId: string,
  verified: boolean,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('impact_evidence')
      .update({ verified })
      .eq('id', evidenceId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.evidencePatches[evidenceId] = { verified }
    recordAudit(
      o,
      verified ? 'evidence.verify' : 'evidence.unverify',
      'impact_evidence',
      evidenceId,
    )
  })
}

// ── Goodness Commitment ─────────────────────────────────────────────────────
export interface CommitmentInput {
  profileId: string
  amount: number
  rhythm: CommitmentRhythm
  destination: CommitmentDestination
  destinationChapterId?: string | null
  destinationProgramSlug?: string | null
  badgeOptIn?: boolean
}

export async function saveCommitment(input: CommitmentInput) {
  const record: Commitment = {
    id: id('cmt'),
    profileId: input.profileId,
    amount: input.amount,
    currency: 'BDT',
    rhythm: input.rhythm,
    destination: input.destination,
    destinationChapterId: input.destinationChapterId ?? null,
    destinationProgramSlug: input.destinationProgramSlug ?? null,
    status: 'active',
    badgeOptIn: input.badgeOptIn ?? false,
    startedOn: now().slice(0, 10),
  }
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('commitments')
      .upsert(toRow(record), { onConflict: 'profile_id' })
    if (error) throw new Error(error.message)
    return record
  }
  patchOverlay((o) => {
    const existing = o.commitments.find((c) => c.profileId === input.profileId)
    if (existing) {
      Object.assign(existing, record, {
        id: existing.id,
        startedOn: existing.startedOn,
        status: 'active',
      })
      recordAudit(o, 'commitment.change', 'commitment', existing.id)
    } else {
      o.commitments.push(record)
      recordAudit(o, 'commitment.start', 'commitment', record.id)
    }
  })
  return record
}

/** Pausing is never penalised: history is preserved and recognition never downgrades. */
export async function setCommitmentStatus(
  commitmentId: string,
  status: Commitment['status'],
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('commitments')
      .update({ status })
      .eq('id', commitmentId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const commitment = o.commitments.find((c) => c.id === commitmentId)
    if (!commitment) return
    const previous = commitment.status
    commitment.status = status
    recordAudit(o, `commitment.${status}`, 'commitment', commitmentId, {
      oldValue: { status: previous },
      newValue: { status },
    })
  })
}

/** Every contribution enters the Trust Ledger as a donation with its own receipt reference. */
export async function contributeNow(
  commitment: Commitment,
  donorName: string,
  count: number,
) {
  const receipt = `GS-RCP-${new Date().getFullYear()}-C${String(count + 1).padStart(3, '0')}`
  const donation: Omit<Donation, 'id'> = {
    donorName,
    donorProfileId: commitment.profileId,
    partnerId: null,
    kind: 'Member commitment',
    amount: commitment.amount,
    currency: commitment.currency,
    dateLabel: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    method: `Goodness Commitment · ${commitment.rhythm}`,
    restrictedProgramSlug: commitment.destinationProgramSlug,
    restrictedChapterId: commitment.destinationChapterId,
    receiptRef: receipt,
    acknowledged: true,
  }
  const record = await addDonation(donation)
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('commitment_contributions')
      .insert(
        toRow({
          commitmentId: commitment.id,
          donationId: record.id,
          amount: commitment.amount,
        }),
      )
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.commitmentContributions.push({
      id: id('con'),
      commitmentId: commitment.id,
      donationId: record.id,
      amount: commitment.amount,
      contributedAt: now(),
    })
  })
}

// ── Network ─────────────────────────────────────────────────────────────────
export async function setMyChapter(profileId: string, chapterId: string) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('profiles')
      .update({ chapter_id: chapterId })
      .eq('id', profileId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.memberChapter[profileId] = chapterId
    recordAudit(o, 'chapter.join', 'chapter', chapterId, {
      newValue: { profileId },
    })
  })
}

export async function submitChapterRequest(
  request: Omit<
    ChapterRequest,
    'id' | 'stage' | 'note' | 'createdChapterId' | 'createdAt'
  >,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('chapter_requests')
      .insert(toRow(request))
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.chapterRequests.unshift({
      ...request,
      id: id('chreq'),
      stage: 'proposed',
      note: null,
      createdChapterId: null,
      createdAt: now(),
    })
    recordAudit(o, 'chapter_request.received', 'chapter_request', request.city)
  })
}

/** HQ approval turns a request into a `forming` chapter — the lifecycle never skips a step. */
export async function decideChapterRequest(
  requestId: string,
  approve: boolean,
  note?: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('chapter_requests')
      .update({
        stage: approve ? 'forming' : 'returned',
        note: note ?? null,
        decided_at: now(),
      })
      .eq('id', requestId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const request = o.chapterRequests.find((r) => r.id === requestId)
    if (!request) return
    request.stage = approve ? 'forming' : 'returned'
    request.note = note ?? null
    if (approve) {
      const chapter: Chapter = {
        id: id('chp'),
        countryId: request.countryId,
        parentId: null,
        name: `Goodness ${request.city}`,
        slug: `goodness-${request.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        type: 'district',
        status: 'forming',
        city: request.city,
        division: request.division,
        sinceLabel: new Date().toLocaleString('en-GB', {
          month: 'short',
          year: 'numeric',
        }),
        coverage: [],
        story: `Community interest confirmed — ${request.why?.slice(0, 120) ?? 'leadership team being established'}.`,
        campusNote: null,
        standardsDone: 0,
        standardsTotal: 6,
      }
      o.chapters.push(chapter)
      request.createdChapterId = chapter.id
    }
    recordAudit(
      o,
      approve ? 'chapter_request.approved' : 'chapter_request.returned',
      'chapter_request',
      requestId,
      {
        reason: note,
      },
    )
  })
}

export async function submitProposal(proposal: {
  chapterId: string
  title: string
  kind: string
  detail?: string
  amount?: number
}) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('chapter_proposals')
      .insert(toRow(proposal))
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    o.chapterProposals.unshift({
      id: id('prop'),
      chapterId: proposal.chapterId,
      title: proposal.title,
      kind: proposal.kind,
      detail: proposal.detail ?? null,
      amount: proposal.amount ?? null,
      stage: 'pending',
      note: null,
      createdAt: now(),
    })
    recordAudit(o, 'proposal.submitted', 'chapter_proposal', proposal.title)
  })
}

export async function decideProposal(
  proposalId: string,
  stage: 'approved' | 'returned',
  note?: string,
) {
  if (hasSupabase) {
    const client = await sb()
    const { error } = await client
      .from('chapter_proposals')
      .update({ stage, note: note ?? null, decided_at: now() })
      .eq('id', proposalId)
    if (error) throw new Error(error.message)
    return
  }
  patchOverlay((o) => {
    const proposal = o.chapterProposals.find((p) => p.id === proposalId)
    if (!proposal) return
    proposal.stage = stage
    proposal.note = note ?? null
    recordAudit(o, `proposal.${stage}`, 'chapter_proposal', proposalId, {
      reason: note,
    })
  })
}
