/**
 * GOODNESS OS — local driver.
 *
 * The app must be demonstrable before a backend exists, so the generated seed is treated as a
 * read-only base record and every change made in the browser is kept as an overlay in
 * localStorage. The overlay is applied on top of the base to produce exactly the same `Dataset`
 * the Supabase driver returns — same shape, same derivations, same screens.
 */
import seed from './seed.json'
import type {
  Announcement,
  Application,
  Assignment,
  AuditEvent,
  Chapter,
  ChapterProposal,
  ChapterRequest,
  PartnerEnquiry,
  Commitment,
  CommitmentContribution,
  Dataset,
  Donation,
  Expense,
  ImpactRecord,
  Mission,
  MissionRole,
  Profile,
} from '../lib/types'

const KEY = 'gs-os-overlay'

export interface Overlay {
  me: string | null
  partner: string | null
  chapterLead: string | null
  profilePatches: Record<string, Partial<Profile>>
  assignments: Array<Assignment>
  applications: Array<Application>
  donations: Array<Donation>
  missions: Array<Mission>
  missionRoles: Array<MissionRole>
  missionPatches: Record<string, Partial<Mission>>
  expensePatches: Record<string, Partial<Expense>>
  expenseEvidencePatches: Record<string, { checked: boolean }>
  impactPatches: Record<string, Partial<ImpactRecord>>
  evidencePatches: Record<string, { verified: boolean }>
  chapters: Array<Chapter>
  chapterPatches: Record<string, Partial<Chapter>>
  chapterRequests: Array<ChapterRequest>
  partnerEnquiries: Array<PartnerEnquiry>
  chapterProposals: Array<ChapterProposal>
  announcements: Array<Announcement>
  memberChapter: Record<string, string>
  commitments: Array<Commitment>
  commitmentContributions: Array<CommitmentContribution>
  audit: Array<AuditEvent>
}

export const emptyOverlay = (): Overlay => ({
  me: null,
  partner: null,
  chapterLead: null,
  profilePatches: {},
  assignments: [],
  applications: [],
  donations: [],
  missions: [],
  missionRoles: [],
  missionPatches: {},
  expensePatches: {},
  expenseEvidencePatches: {},
  impactPatches: {},
  evidencePatches: {},
  chapters: [],
  chapterPatches: {},
  chapterRequests: [],
  partnerEnquiries: [],
  chapterProposals: [],
  announcements: [],
  memberChapter: {},
  commitments: [],
  commitmentContributions: [],
  audit: [],
})

export function readOverlay(): Overlay {
  if (typeof window === 'undefined') return emptyOverlay()
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw
      ? { ...emptyOverlay(), ...(JSON.parse(raw) as Overlay) }
      : emptyOverlay()
  } catch {
    return emptyOverlay()
  }
}

export function writeOverlay(overlay: Overlay): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(overlay))
  } catch {
    /* storage full or blocked — the session simply stops persisting */
  }
  window.dispatchEvent(new CustomEvent('gs-os-overlay-changed'))
}

export function patchOverlay(fn: (overlay: Overlay) => void): Overlay {
  const overlay = readOverlay()
  fn(overlay)
  writeOverlay(overlay)
  return overlay
}

export function recordAudit(
  overlay: Overlay,
  action: string,
  entity: string,
  entityId: string,
  detail?: {
    oldValue?: unknown
    newValue?: unknown
    reason?: string
    actorLabel?: string
  },
): void {
  overlay.audit.unshift({
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    actorLabel: detail?.actorLabel ?? 'You (prototype session)',
    action,
    entity,
    entityId,
    oldValue: detail?.oldValue ?? null,
    newValue: detail?.newValue ?? null,
    reason: detail?.reason ?? null,
    createdAt: new Date().toISOString(),
  })
  overlay.audit = overlay.audit.slice(0, 200)
}

/** The generated seed, untouched. */
export function baseDataset(): Dataset {
  return seed as unknown as Dataset
}

export function applyOverlay(base: Dataset, overlay: Overlay): Dataset {
  const patch = <T extends { id: string }>(
    rows: Array<T>,
    patches: Record<string, Partial<T>>,
  ) =>
    rows.map((row) => (patches[row.id] ? { ...row, ...patches[row.id] } : row))

  return {
    ...base,
    profiles: patch(base.profiles, overlay.profilePatches).map((p) => {
      const chosenChapter = overlay.memberChapter[p.id]
      return chosenChapter ? { ...p, chapterId: chosenChapter } : p
    }),
    missions: patch(
      base.missions.concat(overlay.missions),
      overlay.missionPatches,
    ),
    missionRoles: base.missionRoles.concat(overlay.missionRoles),
    assignments: overlay.assignments,
    applications: overlay.applications,
    donations: overlay.donations.concat(base.donations),
    expenses: patch(base.expenses, overlay.expensePatches),
    expenseEvidence: base.expenseEvidence.map((e) =>
      overlay.expenseEvidencePatches[e.id]
        ? { ...e, ...overlay.expenseEvidencePatches[e.id] }
        : e,
    ),
    impactRecords: patch(base.impactRecords, overlay.impactPatches),
    impactEvidence: base.impactEvidence.map((e) =>
      overlay.evidencePatches[e.id]
        ? { ...e, ...overlay.evidencePatches[e.id] }
        : e,
    ),
    chapters: patch(
      base.chapters.concat(overlay.chapters),
      overlay.chapterPatches,
    ),
    chapterRequests: overlay.chapterRequests,
    partnerEnquiries: overlay.partnerEnquiries,
    chapterProposals: overlay.chapterProposals,
    announcements: base.announcements.concat(overlay.announcements),
    commitments: overlay.commitments,
    commitmentContributions: overlay.commitmentContributions,
    auditEvents: overlay.audit,
  }
}

export function localDataset(): Dataset {
  return applyOverlay(baseDataset(), readOverlay())
}
