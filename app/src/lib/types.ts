/**
 * GOODNESS OS — domain types.
 *
 * These mirror `supabase/migrations` one-for-one (camelCased). Both data drivers — Supabase and
 * the offline seed — produce exactly this shape, so every screen is written against one model.
 */

export type ChapterType = 'district' | 'university' | 'community'
export type ChapterStatus = 'proposed' | 'forming' | 'active' | 'paused'
export type JourneyLevel =
  'Volunteer' | 'Senior Volunteer' | 'Team Lead' | 'Chapter Lead'
export type MissionStatus = 'open' | 'full' | 'completed' | 'cancelled'
export type MissionPriority = 'normal' | 'urgent'
export type ParticipationMode = 'onsite' | 'remote'
export type MissionScope = 'chapter' | 'national'
export type AssignmentState =
  'joined' | 'checked_in' | 'submitted' | 'verified' | 'withdrawn'
export type OutcomeBasis = 'verified' | 'self-reported' | 'observed' | 'pending'
export type EvidenceKind = 'document' | 'photo' | 'report' | 'video' | 'dataset'
export type ExpenseStatus = 'pending' | 'approved' | 'reversed'
export type CredentialStatus = 'valid' | 'revoked' | 'expired'
export type PartnerStage =
  'prospect' | 'conversation' | 'proposal' | 'active' | 'renewal' | 'dormant'
export type CommitmentStatus = 'active' | 'paused' | 'ended'
export type CommitmentRhythm =
  'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Custom'
export type CommitmentDestination = 'unrestricted' | 'chapter' | 'program'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'
export type ProposalStage = 'pending' | 'approved' | 'returned'
export type ChapterRequestStage = 'proposed' | 'forming' | 'returned'
export type PartnerEnquiryStage = 'new' | 'contacted' | 'converted' | 'closed'
export type AppRole =
  | 'volunteer'
  | 'team_lead'
  | 'chapter_lead'
  | 'program_lead'
  | 'finance_lead'
  | 'partnerships_lead'
  | 'hq_admin'
  | 'super_admin'

export interface Organisation {
  id: string
  name: string
  slug: string
  tagline: string | null
  registrationRef: string | null
}

export interface Country {
  id: string
  organisationId: string
  name: string
  iso2: string
  currencyCode: string
  currencySymbol: string
  locale: string
  isDefault: boolean
}

export interface Program {
  slug: string
  name: string
  shortName: string | null
  summary: string | null
  color: string
  bgColor: string
  lightColor: string
  sortOrder: number
  isOperations: boolean
}

export interface Project {
  id: string
  programSlug: string
  chapterId: string | null
  name: string
  year: number | null
  summary: string | null
}

export interface Chapter {
  id: string
  countryId: string
  parentId: string | null
  name: string
  slug: string
  type: ChapterType
  status: ChapterStatus
  city: string
  division: string | null
  sinceLabel: string | null
  coverage: Array<string>
  story: string | null
  campusNote: string | null
  standardsDone: number
  standardsTotal: number
}

export interface ChapterGoal {
  id: string
  chapterId: string
  label: string
  metric: 'people' | 'hours' | 'missions' | 'partners'
  target: number
  periodLabel: string | null
}

export interface ChapterTeamMember {
  id: string
  chapterId: string
  profileId: string | null
  personName: string | null
  role: string
  sinceLabel: string | null
  untilLabel: string | null
}

export interface Profile {
  id: string
  userId: string | null
  slug: string
  fullName: string
  initials: string
  avatarColor: string
  roleTitle: string | null
  programSlug: string | null
  city: string | null
  chapterId: string | null
  joinedMonth: string | null
  quote: string | null
  bio: string | null
  skills: Array<string>
  impactStat: string | null
  impactLabel: string | null
  level: JourneyLevel
  featured: boolean
  status: string
  certificateEnabled: boolean
  goodnessId: string | null
  baselineMissions: number
  baselineHours: number
  baselinePeople: number
  baselinePrograms: number
}

export interface MemberRole {
  id: string
  profileId: string
  role: AppRole
  chapterId: string | null
}

export interface Credential {
  id: string
  profileId: string
  ref: string
  title: string
  programSlug: string | null
  serviceSummary: string | null
  issuedLabel: string | null
  status: CredentialStatus
  downloadEnabled: boolean
  revokedReason: string | null
}

export interface Mission {
  id: string
  title: string
  programSlug: string
  projectId: string | null
  chapterId: string | null
  scope: MissionScope
  venue: string | null
  dateLabel: string | null
  timeLabel: string | null
  startsAt: string | null
  hours: number
  impactTarget: string | null
  summary: string | null
  status: MissionStatus
  priority: MissionPriority
  participation: ParticipationMode
  leadProfileId: string | null
  leadName: string | null
  seedFilled: number
  published: boolean
}

export interface MissionRole {
  id: string
  missionId: string
  role: string
  need: number
  skills: Array<string>
  sortOrder: number
}

export interface Assignment {
  id: string
  missionId: string
  missionRoleId: string | null
  profileId: string
  state: AssignmentState
  joinedAt: string
  checkedInAt: string | null
  submittedAt: string | null
  verifiedAt: string | null
  verifiedBy: string | null
  hoursCredited: number | null
  note: string | null
}

export interface ImpactRecord {
  id: string
  missionId: string | null
  programSlug: string
  projectId: string | null
  chapterId: string | null
  title: string
  projectLabel: string | null
  dateLabel: string | null
  published: boolean
  unit: string
  unitLabel: string
  primaryValue: number
  beneficiaries: number
  measurementDueLabel: string | null
}

export interface ImpactOutput {
  id: string
  recordId: string
  label: string
  value: number
  target: number | null
  sortOrder: number
}

export interface ImpactOutcome {
  id: string
  recordId: string
  label: string
  value: number | null
  basis: OutcomeBasis
  note: string | null
  evidenceLabel: string | null
  dueLabel: string | null
  sortOrder: number
}

export interface ImpactEvidence {
  id: string
  recordId: string
  label: string
  kind: EvidenceKind
  verified: boolean
  sortOrder: number
}

export interface Fund {
  id: string
  programSlug: string
  chapterId: string | null
  projectLabel: string | null
  budget: number
  allocated: number
  currency: string
}

export interface Donation {
  id: string
  donorName: string
  donorProfileId: string | null
  partnerId: string | null
  kind: string
  amount: number
  currency: string
  dateLabel: string | null
  method: string | null
  restrictedProgramSlug: string | null
  restrictedChapterId: string | null
  receiptRef: string | null
  acknowledged: boolean
}

export interface Expense {
  id: string
  fundId: string
  item: string
  amount: number
  dateLabel: string | null
  payee: string | null
  status: ExpenseStatus
  approvedByLabel: string | null
  missionId: string | null
  impactRecordId: string | null
}

export interface ExpenseEvidence {
  id: string
  expenseId: string
  label: string
  checked: boolean
}

export interface Partner {
  id: string
  slug: string
  name: string
  kind: string
  tier: string | null
  stage: PartnerStage
  sinceLabel: string | null
  renewalLabel: string | null
  contact: string | null
  story: string | null
  goalLabel: string | null
  goalTarget: number | null
  committed: number
  currency: string
  districts: Array<string>
  discloseFunding: boolean
  employeesParticipated: number
  employeesHours: number
  employeesSessions: number
  logoPath: string | null
}

export interface PartnerProgram {
  partnerId: string
  programSlug: string
}

export interface PartnerInKind {
  id: string
  partnerId: string
  label: string
  estValue: number
}

export interface PartnerCommitment {
  id: string
  partnerId: string
  side: 'goodness' | 'partner'
  label: string
  done: number | null
  total: number | null
  unit: string | null
  note: string | null
  sortOrder: number
}

export interface PartnerTimelineEntry {
  id: string
  partnerId: string
  dateLabel: string
  kind: string
  text: string
}

export interface Opportunity {
  id: string
  title: string
  programSlug: string
  chapterId: string | null
  whereLabel: string | null
  urgent: boolean
  target: number
  secured: number
  seeking: Array<string>
  expected: Array<string>
  note: string | null
  open: boolean
}

export interface Commitment {
  id: string
  profileId: string
  amount: number
  currency: string
  rhythm: CommitmentRhythm
  destination: CommitmentDestination
  destinationChapterId: string | null
  destinationProgramSlug: string | null
  status: CommitmentStatus
  badgeOptIn: boolean
  startedOn: string
}

export interface CommitmentContribution {
  id: string
  commitmentId: string
  donationId: string | null
  amount: number
  contributedAt: string
}

export interface Application {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  city: string | null
  chapterId: string | null
  programSlug: string | null
  roleTitle: string | null
  skills: string | null
  availability: string | null
  why: string | null
  experience: string | null
  status: ApplicationStatus
  note: string | null
  createdAt: string
  decidedAt: string | null
  createdProfileId: string | null
}

export interface ChapterRequest {
  id: string
  countryId: string
  city: string
  division: string | null
  requesterName: string
  requesterEmail: string | null
  why: string | null
  peopleReady: number | null
  stage: ChapterRequestStage
  note: string | null
  createdChapterId: string | null
  createdAt: string
}

/** An organisation expressing interest through the public Partner page: a lead, never a partner. */
export interface PartnerEnquiry {
  id: string
  organisation: string
  contact: string
  commitmentRange: string | null
  objective: string | null
  causeProgramSlug: string | null
  whereLabel: string | null
  brings: string | null
  opportunityId: string | null
  stage: PartnerEnquiryStage
  note: string | null
  createdAt: string
}

export interface ChapterProposal {
  id: string
  chapterId: string
  title: string
  kind: string
  detail: string | null
  amount: number | null
  stage: ProposalStage
  note: string | null
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  audience: string
  chapterId: string | null
}

export interface AuditEvent {
  id: string
  actorLabel: string | null
  action: string
  entity: string | null
  entityId: string | null
  oldValue: unknown
  newValue: unknown
  reason: string | null
  createdAt: string
}

/** Everything the OS reads, in one bundle. Both drivers return exactly this. */
export interface Dataset {
  organisations: Array<Organisation>
  countries: Array<Country>
  programs: Array<Program>
  projects: Array<Project>
  chapters: Array<Chapter>
  chapterGoals: Array<ChapterGoal>
  chapterTeam: Array<ChapterTeamMember>
  profiles: Array<Profile>
  memberRoles: Array<MemberRole>
  credentials: Array<Credential>
  missions: Array<Mission>
  missionRoles: Array<MissionRole>
  assignments: Array<Assignment>
  impactRecords: Array<ImpactRecord>
  impactOutputs: Array<ImpactOutput>
  impactOutcomes: Array<ImpactOutcome>
  impactEvidence: Array<ImpactEvidence>
  funds: Array<Fund>
  donations: Array<Donation>
  expenses: Array<Expense>
  expenseEvidence: Array<ExpenseEvidence>
  partners: Array<Partner>
  partnerPrograms: Array<PartnerProgram>
  partnerInkind: Array<PartnerInKind>
  partnerCommitments: Array<PartnerCommitment>
  partnerTimeline: Array<PartnerTimelineEntry>
  opportunities: Array<Opportunity>
  commitments: Array<Commitment>
  commitmentContributions: Array<CommitmentContribution>
  applications: Array<Application>
  chapterRequests: Array<ChapterRequest>
  chapterProposals: Array<ChapterProposal>
  partnerEnquiries: Array<PartnerEnquiry>
  announcements: Array<Announcement>
  auditEvents: Array<AuditEvent>
}
