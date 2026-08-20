import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useClaimedChapterId, useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import {
  claimChapterLead,
  createMission,
  submitProposal,
  verifyAssignment,
} from '../data/actions'
import { formatNumber, formatShortMoney } from '../lib/format'
import type { ChapterView, OSModel } from '../data/os'

/** Chapter Control — a faithful build of `Chapter Control.dc.html`. */
export const Route = createFileRoute('/chapter-control')({
  head: () => ({
    meta: [
      { title: 'Chapter Control — Goodness Society' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ChapterControl,
})

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

const PROPOSAL_KINDS = [
  {
    value: 'Funding need',
    label: 'Funding need (goes to Fund Impact if approved)',
  },
  { value: 'Budget request', label: 'Budget request' },
  { value: 'Impact record', label: 'Publish an impact record' },
]

const PANEL_LABEL: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: 'var(--gs-ink-40)',
  fontWeight: 800,
}

function ChapterControl() {
  const { os } = useOS()
  const claimed = useClaimedChapterId()
  if (!os) return <LoadingState />

  const chapter = claimed ? os.chapterById.get(claimed) : undefined

  return (
    <div className="gs-cc">
      <div className="gs-cc__head">
        <div className="gs-row" style={{ gap: 10 }}>
          <span className="gs-mc__mark">G</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Chapter Control</div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--gs-ink-50)',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
              }}
            >
              Goodness OS · local command
            </div>
          </div>
        </div>
        <div className="gs-row" style={{ gap: 8 }}>
          <Link to="/chapters" className="gs-cc__quiet">
            Public network ↗
          </Link>
          <Link
            to="/admin"
            search={{ tab: 'overview' }}
            className="gs-cc__quiet"
          >
            HQ Mission Control ↗
          </Link>
        </div>
      </div>

      {chapter ? <Console os={os} chapter={chapter} /> : <Picker os={os} />}
    </div>
  )
}

/** Signed out: choose the chapter you lead. */
function Picker({ os }: { os: OSModel }) {
  const seats = os.chapters.flatMap((chapter) =>
    chapter.team
      .filter((seat) => seat.volunteer && !seat.untilLabel)
      .filter((seat) => /lead/i.test(seat.role))
      .map((seat) => ({ chapter, seat })),
  )

  return (
    <section className="gs-cc__picker">
      <h1
        style={{
          margin: '0 0 10px',
          fontSize: 'clamp(26px, 3.6vw, 38px)',
          lineHeight: 1.15,
        }}
      >
        <span style={{ fontWeight: 300 }}>Run your chapter</span>{' '}
        <span style={{ fontWeight: 800 }}>from one place.</span>
      </h1>
      <p
        style={{
          margin: '0 0 26px',
          fontSize: 14,
          color: 'var(--gs-ink-50)',
          maxWidth: 460,
          lineHeight: 1.65,
        }}
      >
        Sign in as a chapter lead. You operate locally; HQ approves the
        sensitive parts — autonomy within guardrails.
      </p>
      <div className="gs-cc__options">
        {seats.map(({ chapter, seat }) => (
          <button
            key={`${chapter.id}-${seat.volunteer!.id}`}
            type="button"
            className="gs-signin-option"
            onClick={() => claimChapterLead(chapter.id)}
          >
            <span
              className="gs-mark"
              style={{
                width: 36,
                height: 36,
                fontSize: 12,
                background:
                  AVATAR_GRADIENTS[seat.volunteer!.avatarColor] ??
                  AVATAR_GRADIENTS.green!,
              }}
            >
              {seat.volunteer!.initials}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{ display: 'block', fontSize: 13.5, fontWeight: 700 }}
              >
                {seat.volunteer!.fullName}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--gs-ink-40)',
                }}
              >
                {seat.role} · {chapter.name}
              </span>
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--gs-green-deep)',
              }}
            >
              Enter →
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Console({ os, chapter }: { os: OSModel; chapter: ChapterView }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [roles, setRoles] = useState('')
  const [missionError, setMissionError] = useState(false)
  const [published, setPublished] = useState(false)

  const [kind, setKind] = useState(PROPOSAL_KINDS[0]!.value)
  const [proposalTitle, setProposalTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [proposalError, setProposalError] = useState(false)

  const lead = chapter.team.find(
    (seat) => seat.volunteer && !seat.untilLabel && /lead/i.test(seat.role),
  )
  const shortName = chapter.name.replace('Goodness ', '')
  const money = (value: number) => formatShortMoney(value, os.currency)

  const announcements = os.data.announcements.filter(
    (a) => !a.chapterId || a.chapterId === chapter.id,
  )
  const proposals = os.data.chapterProposals.filter(
    (p) => p.chapterId === chapter.id,
  )

  // Only this chapter's own missions come here to verify — a lead never sees another city's work.
  const missionIds = new Set(chapter.missions.map((m) => m.id))
  const awaiting = os.data.assignments
    .filter((a) => a.state === 'submitted' && missionIds.has(a.missionId))
    .map((a) => ({
      assignment: a,
      person: os.personById.get(a.profileId),
      mission: os.missionById.get(a.missionId),
    }))

  const standards = [
    { label: 'Chapter lead appointed', done: Boolean(lead) },
    { label: 'Team roles filled', done: chapter.team.length >= 3 },
    { label: 'First mission run', done: chapter.missions.length > 0 },
    { label: 'Impact record published', done: chapter.impact.length > 0 },
    { label: 'Local partner secured', done: chapter.partners.length > 0 },
    {
      label: 'Verified hours recorded',
      done: chapter.hours > 0,
    },
  ]
  const met = standards.filter((s) => s.done).length

  const publish = () => {
    if (!title || !date) {
      setMissionError(true)
      return
    }
    const id = `msn-${chapter.id}-${Date.now()}`
    void createMission(
      {
        id,
        title,
        programSlug: os.programs[0]?.slug ?? 'education-career-readiness',
        projectId: null,
        chapterId: chapter.id,
        scope: 'chapter',
        venue: chapter.city,
        dateLabel: date,
        timeLabel: null,
        startsAt: null,
        hours: 4,
        impactTarget: null,
        summary: null,
        status: 'open',
        priority: 'normal',
        participation: 'onsite',
        leadProfileId: lead?.volunteer?.id ?? null,
        leadName: lead?.volunteer?.fullName ?? null,
        seedFilled: 0,
      },
      parseRoles(roles),
    )
    setPublished(true)
    setMissionError(false)
    setTitle('')
    setDate('')
    setRoles('')
  }

  const send = () => {
    if (!proposalTitle) {
      setProposalError(true)
      return
    }
    void submitProposal({
      chapterId: chapter.id,
      title: proposalTitle,
      kind,
      amount: Number(amount.replace(/[^0-9]/g, '')) || undefined,
    })
    setProposalError(false)
    setProposalTitle('')
    setAmount('')
  }

  return (
    <section className="gs-stack" style={{ gap: 18 }}>
      <div className="gs-cc__banner">
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            {lead?.volunteer?.fullName ?? 'Chapter lead'} ·{' '}
            {lead?.role ?? 'Chapter Lead'}
          </div>
          <h1
            style={{
              margin: '4px 0 0',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {chapter.name}
          </h1>
        </div>
        <div className="gs-row" style={{ gap: 18 }}>
          <CcFigure value={String(chapter.memberCount)} label="Members" />
          <CcFigure
            value={String(chapter.liveMissions)}
            label="Missions live"
            green
          />
          <CcFigure
            value={formatNumber(chapter.peopleSupported)}
            label="People supported"
          />
          <CcFigure value={money(chapter.deployed)} label="Deployed locally" />
        </div>
        <button
          type="button"
          className="gs-btn gs-btn--onink gs-btn--sm"
          onClick={() => claimChapterLead(null)}
        >
          Sign out
        </button>
      </div>

      <div className="gs-cc__hq">
        <div className="gs-cc__hqlabel">From HQ</div>
        <div className="gs-stack" style={{ gap: 6 }}>
          {announcements.length === 0 ? (
            <div style={{ fontSize: 12.5, color: '#374151' }}>
              • Nothing new from HQ this week.
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} style={{ fontSize: 12.5, color: '#374151' }}>
                • {a.title} — {a.body}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="gs-cc__grid">
        <div className="gs-stack" style={{ gap: 18 }}>
          <section className="gs-cc__card">
            <div className="gs-row gs-row--between" style={{ marginBottom: 4 }}>
              <h2 style={PANEL_LABEL}>Within your authority</h2>
              <span className="gs-cc__flag gs-cc__flag--ok">
                No HQ approval needed
              </span>
            </div>
            <p className="gs-cc__note">
              Low-risk local missions publish straight to the public board.
            </p>
            <div className="gs-stack" style={{ gap: 10 }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mission title, e.g. Weekend CV clinic"
                aria-label="Mission title"
              />
              <div className="gs-cols-2" style={{ gap: 10 }}>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date, e.g. Sat 19 Sep 2026"
                  aria-label="Mission date"
                />
                <input
                  value={roles}
                  onChange={(e) => setRoles(e.target.value)}
                  placeholder="Roles: Mentor x4, Desk x2"
                  aria-label="Mission roles"
                />
              </div>
              <div className="gs-row" style={{ gap: 10 }}>
                <button
                  type="button"
                  className="gs-btn gs-btn--primary gs-btn--sm"
                  onClick={publish}
                >
                  Publish local mission
                </button>
                {missionError ? (
                  <span
                    style={{
                      fontSize: 11.5,
                      color: '#d4183d',
                      fontWeight: 600,
                    }}
                  >
                    Title and date required.
                  </span>
                ) : null}
                {published ? (
                  <span
                    style={{
                      fontSize: 11.5,
                      color: 'var(--gs-green-deep)',
                      fontWeight: 700,
                    }}
                  >
                    Published — it's live on the mission board.
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="gs-cc__card">
            <div className="gs-row gs-row--between" style={{ marginBottom: 4 }}>
              <h2 style={PANEL_LABEL}>Needs HQ approval</h2>
              <span className="gs-cc__flag gs-cc__flag--warn">Guardrail</span>
            </div>
            <p className="gs-cc__note">
              Budgets, funding opportunities, and public impact records go to HQ
              first.
            </p>
            <div className="gs-stack" style={{ gap: 10 }}>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                aria-label="Proposal kind"
              >
                {PROPOSAL_KINDS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder={`Title, e.g. AI Bootcamp — close ${os.currency}3.2L gap`}
                aria-label="Proposal title"
              />
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount if money, e.g. 320000"
                aria-label="Proposal amount"
              />
              <div className="gs-row" style={{ gap: 10 }}>
                <button type="button" className="gs-cc__hqbtn" onClick={send}>
                  Send to HQ for approval
                </button>
                {proposalError ? (
                  <span
                    style={{
                      fontSize: 11.5,
                      color: '#d4183d',
                      fontWeight: 600,
                    }}
                  >
                    Title required.
                  </span>
                ) : null}
              </div>
            </div>
            {proposals.length ? (
              <div className="gs-stack" style={{ gap: 8, marginTop: 14 }}>
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="gs-cc__proposal">
                    <span style={{ flex: 1, fontWeight: 600 }}>
                      {proposal.title}
                    </span>
                    <span style={{ color: 'var(--gs-ink-40)' }}>
                      {proposal.kind}
                    </span>
                    <span
                      className="gs-cc__stage"
                      style={
                        proposal.stage === 'approved'
                          ? { background: '#f0faf3', color: '#1B7A34' }
                          : proposal.stage === 'returned'
                            ? { background: '#fdecec', color: '#d4183d' }
                            : { background: '#fff3e0', color: '#E65100' }
                      }
                    >
                      {proposal.stage}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="gs-stack" style={{ gap: 18 }}>
          <section className="gs-cc__card">
            <h2 style={{ ...PANEL_LABEL, marginBottom: 12 }}>
              Attendance to verify · your missions
            </h2>
            {awaiting.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--gs-ink-40)' }}>
                Nothing awaiting verification in {shortName}.
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 8 }}>
                {awaiting.map((row) => (
                  <div key={row.assignment.id} className="gs-cc__verifyrow">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                        {row.person?.fullName ?? 'A volunteer'}
                      </div>
                      <div
                        style={{ fontSize: 10.5, color: 'var(--gs-ink-40)' }}
                      >
                        {roleName(os, row.assignment.missionRoleId)} ·{' '}
                        {row.mission?.title}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="gs-btn gs-btn--primary gs-btn--sm"
                      onClick={() =>
                        void verifyAssignment(
                          row.assignment.id,
                          row.mission?.hours ?? 0,
                        )
                      }
                    >
                      Verify {row.mission?.hours ?? 0}h
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="gs-cc__card">
            <h2 style={{ ...PANEL_LABEL, marginBottom: 12 }}>
              Goodness standards
            </h2>
            <div className="gs-row" style={{ gap: 12, marginBottom: 10 }}>
              <div className="gs-capbar" style={{ flex: 1, height: 10 }}>
                <div
                  className="gs-capbar__fill"
                  style={{
                    width: `${Math.round((met / standards.length) * 100)}%`,
                    background: 'linear-gradient(90deg, #4DC86A, #1B7A34)',
                  }}
                />
              </div>
              <span
                className="gs-num"
                style={{ fontSize: 12, fontWeight: 800 }}
              >
                {met}/{standards.length}
              </span>
            </div>
            <div className="gs-stack" style={{ gap: 6 }}>
              {standards.map((standard) => (
                <div
                  key={standard.label}
                  className="gs-row"
                  style={{ gap: 8, fontSize: 12 }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      color: standard.done ? '#1B7A34' : 'var(--gs-ink-40)',
                    }}
                  >
                    {standard.done ? '✓' : '○'}
                  </span>
                  <span style={{ color: '#374151' }}>{standard.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="gs-cc__card">
            <h2 style={{ ...PANEL_LABEL, marginBottom: 12 }}>
              Your team &amp; members
            </h2>
            <div className="gs-stack" style={{ gap: 8 }}>
              {chapter.team
                .filter((seat) => !seat.untilLabel)
                .map((seat) => (
                  <div
                    key={`${seat.role}-${seat.personName ?? seat.volunteer?.id}`}
                    className="gs-row"
                    style={{ gap: 10, fontSize: 12.5 }}
                  >
                    <span
                      className="gs-mark"
                      style={{
                        width: 28,
                        height: 28,
                        fontSize: 10,
                        background:
                          AVATAR_GRADIENTS[
                            seat.volunteer?.avatarColor ?? 'green'
                          ] ?? AVATAR_GRADIENTS.green!,
                      }}
                    >
                      {seat.volunteer?.initials ?? 'GS'}
                    </span>
                    <span style={{ flex: 1, fontWeight: 700 }}>
                      {seat.volunteer?.fullName ?? seat.personName}
                    </span>
                    <span style={{ color: 'var(--gs-ink-40)' }}>
                      {seat.role}
                    </span>
                  </div>
                ))}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--gs-ink-50)',
                marginTop: 10,
              }}
            >
              {chapter.memberCount}{' '}
              {chapter.memberCount === 1 ? 'member' : 'members'} in {shortName}{' '}
              · {formatNumber(chapter.hours)} verified hours between them.
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

function CcFigure({
  value,
  label,
  green,
}: {
  value: string
  label: string
  green?: boolean
}) {
  return (
    <div>
      <div
        className="gs-num"
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: green ? '#4DC86A' : '#fff',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </div>
    </div>
  )
}

/** "Mentor x4, Desk x2" — the shorthand a lead actually types. */
function parseRoles(input: string) {
  return input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = /^(.*?)\s*[x×]\s*(\d+)$/i.exec(part)
      return {
        role: (match?.[1] ?? part).trim(),
        need: Number(match?.[2] ?? 1),
        skills: [],
        note: null,
        sortOrder: 0,
      }
    })
}

function roleName(os: OSModel, missionRoleId: string | null) {
  if (!missionRoleId) return 'Volunteer'
  return (
    os.data.missionRoles.find((r) => r.id === missionRoleId)?.role ??
    'Volunteer'
  )
}
