import { Link, createFileRoute } from '@tanstack/react-router'
import { useClaimedPartnerId, useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { claimPartner } from '../data/actions'
import { formatNumber, formatShortMoney } from '../lib/format'
import type { ReactNode } from 'react'
import type { OSModel, PartnerView } from '../data/os'

/** Partner Room — a faithful build of `Partner Room.dc.html`. */
export const Route = createFileRoute('/partner-room')({
  head: () => ({
    meta: [
      { title: 'Partner Room — Goodness Society' },
      {
        name: 'description',
        content:
          'A live window into your partnership — not a quarterly PDF: funding deployed, missions underway, the people delivering the work, and the evidence behind every claim.',
      },
    ],
  }),
  component: PartnerRoom,
})

const PANEL_LABEL: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'var(--gs-ink-40)',
  fontWeight: 800,
}

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function PartnerRoom() {
  const { os } = useOS()
  const claimed = useClaimedPartnerId()
  if (!os) return <LoadingState />

  const partner = claimed ? os.partnerById.get(claimed) : undefined
  if (!partner || partner.stage === 'proposal') return <SignIn os={os} />
  return <Room os={os} partner={partner} />
}

/** The signed-out half: choose the organisation whose room to enter. */
function SignIn({ os }: { os: OSModel }) {
  const options = os.partners.filter((p) => p.stage !== 'proposal')
  return (
    <div className="gs-narrow" style={{ maxWidth: 1120 }}>
      <section className="gs-signin">
        <span
          className="gs-mark"
          style={{ width: 52, height: 52, fontSize: 22 }}
        >
          G
        </span>
        <h1 className="gs-signin__title">
          <span style={{ fontWeight: 300 }}>Partner</span>{' '}
          <span style={{ fontWeight: 800 }}>Room</span>
        </h1>
        <p className="gs-signin__lede" style={{ maxWidth: 480 }}>
          A live window into your partnership — not a quarterly PDF. Choose your
          organisation to enter.
        </p>
        <div className="gs-signin-card" style={{ maxWidth: 560 }}>
          <div className="gs-signin-card__label" style={{ marginBottom: 6 }}>
            Sign in as
          </div>
          <div className="gs-signin-card__list">
            {options.map((partner) => (
              <button
                key={partner.id}
                type="button"
                className="gs-signin-option"
                onClick={() => claimPartner(partner.id)}
              >
                <span
                  className="gs-mark gs-mark--blue"
                  style={{ width: 38, height: 38, fontSize: 13 }}
                >
                  {initialsOf(partner.name)}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{ display: 'block', fontSize: 14, fontWeight: 700 }}
                  >
                    {partner.name}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      color: 'var(--gs-ink-40)',
                    }}
                  >
                    {partner.tier} · since {partner.sinceLabel}
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
        </div>
      </section>
    </div>
  )
}

function Room({ os, partner }: { os: OSModel; partner: PartnerView }) {
  const hour = new Date().getHours()
  const greeting = `Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'},`
  const money = (value: number) => formatShortMoney(value, os.currency)

  const slugs = new Set(partner.programs.map((p) => p.slug))
  const myFunds = os.finance.funds.filter((f) => slugs.has(f.programSlug))
  const allocated = myFunds.reduce((n, f) => n + f.allocated, 0)
  const acceptedExpenses = myFunds.reduce(
    (n, f) => n + f.expenses.filter((e) => e.status === 'approved').length,
    0,
  )
  const documentsChecked = myFunds.reduce((n, f) => n + f.documentsChecked, 0)
  const myImpact = os.impact.filter(
    (r) => r.published && slugs.has(r.programSlug),
  )

  // Outcomes are counted by how they are known, never merged into one confident number.
  const basis = { verified: 0, 'self-reported': 0, observed: 0, pending: 0 }
  myImpact.forEach((record) =>
    record.outcomes.forEach((outcome) => {
      if (outcome.basis in basis) basis[outcome.basis] += 1
    }),
  )

  const live = os.openMissions
    .filter((m) => slugs.has(m.programSlug))
    .slice(0, 3)
  const people = os.people
    .filter((v) => v.programSlug && slugs.has(v.programSlug))
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 3)

  const trace = [
    {
      icon: os.currency,
      bg: '#e8f0fc',
      color: '#1565C0',
      value: `${money(partner.received)} received`,
      label: `of ${money(partner.committed)} committed · receipts issued`,
    },
    {
      icon: '→',
      bg: '#eef0f3',
      color: '#4B5563',
      value: `${money(allocated)} allocated`,
      label: `to ${myFunds.length} programme fund${myFunds.length === 1 ? '' : 's'} your gift joins`,
    },
    {
      icon: '✓',
      bg: '#f0faf3',
      color: '#1B7A34',
      value: `${acceptedExpenses} accepted expenses`,
      label: `${money(partner.deployed)} deployed · ${documentsChecked} documents checked`,
    },
    {
      icon: '▦',
      bg: '#f5f0ff',
      color: '#6B21A8',
      value: `${myImpact.length} published impact records`,
      label: 'for the programmes you support',
    },
    {
      icon: '♥',
      bg: '#f0faf3',
      color: '#1B7A34',
      value: `${formatNumber(partner.peopleSupported)} people supported`,
      label: 'collectively, across those programmes',
    },
    {
      icon: '≡',
      bg: '#fff3e0',
      color: '#E65100',
      value: `${basis.verified} verified · ${basis['self-reported']} self-reported · ${basis.observed} observed`,
      label: `${basis.pending} awaiting measurement — we publish dates, not guesses`,
    },
  ]

  const goalTarget = partner.goalTarget ?? 0

  return (
    <div className="gs-narrow" style={{ maxWidth: 1120 }}>
      <section className="gs-stack" style={{ gap: 20 }}>
        {/* ── Header ── */}
        <div className="gs-inkhero" style={{ padding: '34px 38px' }}>
          <GWatermark width={380} height={250} style={{ opacity: 0.07 }} />
          <div
            className="gs-row"
            style={{ position: 'relative', gap: 18, alignItems: 'center' }}
          >
            <span
              className="gs-mark gs-mark--blue"
              style={{ width: 60, height: 60, fontSize: 20 }}
            >
              {initialsOf(partner.name)}
            </span>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 3,
                }}
              >
                {greeting}
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.015em',
                }}
              >
                {partner.name}
              </h1>
              <div className="gs-row" style={{ gap: 8, marginTop: 8 }}>
                <span className="gs-tiermark">{partner.tier} ✓</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  Partnership since {partner.sinceLabel} · {partner.kind}
                </span>
              </div>
            </div>
            <div className="gs-row" style={{ gap: 8, flexShrink: 0 }}>
              <Link
                to="/partners/$partnerId"
                params={{ partnerId: partner.slug }}
                className="gs-btn gs-btn--onink gs-btn--sm"
              >
                Public profile ↗
              </Link>
              <button
                type="button"
                className="gs-btn gs-btn--onink gs-btn--sm"
                onClick={() => claimPartner(null)}
              >
                Sign out
              </button>
            </div>
          </div>

          <p
            style={{
              position: 'relative',
              margin: '18px 0 0',
              fontSize: 15,
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            Your partnership is creating measurable progress.
          </p>

          <div className="gs-inkbar" style={{ marginTop: 20 }}>
            <InkFigure value={money(partner.committed)} label="Committed" />
            <InkFigure value={money(partner.received)} label="Received" />
            <InkFigure
              value={money(partner.deployed)}
              label="Programme spending to date (shared across funders)"
              green
            />
            <InkFigure
              value={formatNumber(partner.peopleSupported)}
              label="People supported through initiatives you back (shared)"
            />
          </div>
        </div>

        <div
          className="gs-detailgrid"
          style={{ gridTemplateColumns: '1.15fr 0.85fr' }}
        >
          <div className="gs-detailcol">
            {/* ── Happening now ── */}
            <section className="gs-panelcard">
              <h2 style={PANEL_LABEL}>Happening now</h2>
              <p
                style={{
                  margin: '4px 0 16px',
                  fontSize: 12,
                  color: 'var(--gs-ink-40)',
                }}
              >
                Live missions in the programmes your funding supports.
              </p>
              {live.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                  No missions live this week — the next cohort is being
                  scheduled.
                </div>
              ) : (
                <div className="gs-stack" style={{ gap: 10 }}>
                  {live.map((mission) => (
                    <Link
                      key={mission.id}
                      to="/missions/$missionId"
                      params={{ missionId: mission.id }}
                      className="gs-liverow"
                    >
                      <span className="gs-live-dot" />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 13.5,
                            fontWeight: 700,
                          }}
                        >
                          {mission.title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 11.5,
                            color: 'var(--gs-ink-50)',
                            marginTop: 2,
                          }}
                        >
                          {mission.participation === 'remote'
                            ? 'Remote'
                            : (mission.chapter?.city ?? 'Goodness')}{' '}
                          · {mission.dateLabel} · {mission.filled}/
                          {mission.need} roles filled
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--gs-green-deep)',
                          flexShrink: 0,
                        }}
                      >
                        Your funding supports this →
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* ── Trace our contribution ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>
                Trace our contribution
              </h2>
              <div>
                {trace.map((step, i) => (
                  <div
                    key={step.value}
                    className="gs-row"
                    style={{ gap: 14, alignItems: 'flex-start' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        className="gs-tracedot"
                        style={{ background: step.bg, color: step.color }}
                      >
                        {step.icon}
                      </span>
                      <span
                        style={{
                          width: 2,
                          height: 22,
                          background:
                            i < trace.length - 1 ? '#E5E7EB' : 'transparent',
                        }}
                      />
                    </div>
                    <div style={{ paddingBottom: 8, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>
                        {step.value}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="gs-row" style={{ gap: 8, marginTop: 10 }}>
                <Link to="/trust" style={{ fontSize: 12, fontWeight: 700 }}>
                  Trust Ledger →
                </Link>
                <Link to="/impact" style={{ fontSize: 12, fontWeight: 700 }}>
                  Impact records →
                </Link>
              </div>
            </section>

            {/* ── Partnership timeline ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>
                Partnership timeline
              </h2>
              <div className="gs-stack" style={{ gap: 14 }}>
                {partner.timeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="gs-row"
                    style={{ gap: 12, alignItems: 'flex-start' }}
                  >
                    <span
                      style={{
                        width: 74,
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--gs-ink-40)',
                        paddingTop: 2,
                      }}
                    >
                      {entry.dateLabel}
                    </span>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 5,
                        background: timelineDot(entry.kind),
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: '#374151',
                        lineHeight: 1.5,
                      }}
                    >
                      {entry.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="gs-detailcol">
            {/* ── Our commitments ── */}
            {partner.commitments.goodness.length ||
            partner.commitments.partner.length ? (
              <section className="gs-panelcard">
                <h2 style={PANEL_LABEL}>Our commitments</h2>
                <p
                  style={{
                    margin: '4px 0 14px',
                    fontSize: 12,
                    color: 'var(--gs-ink-40)',
                  }}
                >
                  What we agreed to do together, and where we are.
                </p>
                <div
                  className="gs-sidelabel"
                  style={{ color: 'var(--gs-green-deep)' }}
                >
                  Goodness Society
                </div>
                <div className="gs-stack" style={{ gap: 8, marginBottom: 14 }}>
                  {partner.commitments.goodness.map((c) => (
                    <CommitmentRow key={c.id} commitment={c} />
                  ))}
                </div>
                <div className="gs-sidelabel" style={{ color: '#1565C0' }}>
                  {partner.name}
                </div>
                <div className="gs-stack" style={{ gap: 8 }}>
                  {partner.commitments.partner.map((c) => (
                    <CommitmentRow key={c.id} commitment={c} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* ── Partnership goal ── */}
            {partner.goalLabel ? (
              <section className="gs-panelcard">
                <h2 style={{ ...PANEL_LABEL, marginBottom: 14 }}>
                  Partnership goal
                </h2>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {partner.goalLabel}
                </div>
                <div
                  className="gs-capbar"
                  style={{ height: 10, marginBottom: 7 }}
                >
                  <div
                    className="gs-capbar__fill"
                    style={{
                      width: `${partner.goalPct}%`,
                      background: 'linear-gradient(90deg, #4DC86A, #1B7A34)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                  {formatNumber(partner.peopleSupported)} /{' '}
                  {formatNumber(goalTarget)} ·{' '}
                  {formatNumber(
                    Math.max(0, goalTarget - partner.peopleSupported),
                  )}{' '}
                  to go
                </div>
              </section>
            ) : null}

            {/* ── People delivering the work ── */}
            <section className="gs-panelcard">
              <h2 style={PANEL_LABEL}>People delivering the work</h2>
              <p
                style={{
                  margin: '4px 0 14px',
                  fontSize: 12,
                  color: 'var(--gs-ink-40)',
                }}
              >
                Verified volunteers in your programmes.
              </p>
              <div className="gs-stack" style={{ gap: 10 }}>
                {people.map((person) => (
                  <Link
                    key={person.id}
                    to="/people/$volunteerId"
                    params={{ volunteerId: person.slug }}
                    className="gs-nearrow"
                    style={{ gap: 12, padding: '10px 12px' }}
                  >
                    <span
                      className="gs-mark gs-mark--34"
                      style={{
                        background:
                          AVATAR_GRADIENTS[person.avatarColor] ??
                          AVATAR_GRADIENTS.green!,
                        fontSize: 12,
                      }}
                    >
                      {person.initials}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {person.fullName}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 11,
                          color: 'var(--gs-ink-40)',
                        }}
                      >
                        {person.roleTitle} · {person.totalHours} verified hours
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Employee volunteering ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 14 }}>
                Employee volunteering
              </h2>
              <div className="gs-tilestats" style={{ marginBottom: 12 }}>
                <div>
                  <div
                    className="gs-num"
                    style={{ fontSize: 17, fontWeight: 800 }}
                  >
                    {partner.employeesParticipated}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gs-ink-40)' }}>
                    Employees
                  </div>
                </div>
                <div>
                  <div
                    className="gs-num"
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: 'var(--gs-green-deep)',
                    }}
                  >
                    {partner.employeesHours}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gs-ink-40)' }}>
                    Service hours
                  </div>
                </div>
                <div>
                  <div
                    className="gs-num"
                    style={{ fontSize: 17, fontWeight: 800 }}
                  >
                    {partner.employeesSessions}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gs-ink-40)' }}>
                    Sessions
                  </div>
                </div>
              </div>
              <Link to="/missions" style={{ fontSize: 12, fontWeight: 700 }}>
                Open missions your team can join →
              </Link>
            </section>

            {/* ── In-kind contribution ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 12 }}>
                In-kind contribution
              </h2>
              {partner.inKind.length === 0 ? (
                <div style={{ fontSize: 12.5, color: 'var(--gs-ink-40)' }}>
                  None recorded for this partnership.
                </div>
              ) : (
                <div className="gs-stack" style={{ gap: 8 }}>
                  {partner.inKind.map((item) => (
                    <div
                      key={item.id}
                      className="gs-row gs-row--between"
                      style={{ gap: 10, fontSize: 12.5 }}
                    >
                      <span style={{ color: '#374151' }}>{item.label}</span>
                      <span
                        className="gs-num"
                        style={{
                          fontWeight: 700,
                          color: 'var(--gs-ink-50)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {money(item.estValue)} est.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Reports & sharing ── */}
            <section className="gs-inkpanel">
              <h2
                style={{
                  ...PANEL_LABEL,
                  marginBottom: 10,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Reports &amp; sharing
              </h2>
              <div className="gs-stack" style={{ gap: 8 }}>
                <Link
                  to="/studio"
                  search={{ card: 'partnerbrief', partner: partner.slug }}
                  className="gs-inkaction"
                >
                  Quarterly impact brief · {quarterLabel()} ↓
                </Link>
                <Link
                  to="/partners/$partnerId"
                  params={{ partnerId: partner.slug }}
                  className="gs-inkaction"
                >
                  Shareable live partnership page ↗
                </Link>
                <Link
                  to="/studio"
                  search={{ card: 'partnermile', partner: partner.slug }}
                  className="gs-inkaction gs-inkaction--primary"
                >
                  Create impact milestone card →
                </Link>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: 6,
                  }}
                >
                  SHARE STUDIO — PRE-FILLED FOR THIS PARTNERSHIP
                </div>
                <div className="gs-row" style={{ gap: 6 }}>
                  {[
                    { card: 'partnerannounce', label: 'Announcement' },
                    { card: 'partnermile', label: 'Impact milestone' },
                    { card: 'emphours', label: 'Employee hours' },
                    { card: 'partneranniv', label: 'Anniversary' },
                    { card: 'yearpartner', label: 'Our Year in Goodness' },
                  ].map((quick) => (
                    <Link
                      key={quick.card}
                      to="/studio"
                      search={{ card: quick.card, partner: partner.slug }}
                      className="gs-inkchip"
                    >
                      {quick.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Where we can go next ── */}
            <section className="gs-nextpanel">
              <h2
                style={{
                  ...PANEL_LABEL,
                  marginBottom: 8,
                  color: 'var(--gs-green-deep)',
                }}
              >
                Where we can go next
              </h2>
              <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 4 }}>
                {nextTitle(partner, os)}
              </div>
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: 12.5,
                  color: '#374151',
                  lineHeight: 1.55,
                }}
              >
                Your partnership has watched this grow all year. The natural
                next chapter is already scoped on the Fund Impact board.
              </p>
              <Link to="/fund" style={{ fontSize: 12.5, fontWeight: 800 }}>
                See the opportunity →
              </Link>
            </section>
          </div>
        </div>

        <p
          style={{
            margin: '4px 0 0',
            fontSize: 11,
            color: 'var(--gs-ink-40)',
            lineHeight: 1.6,
          }}
        >
          Programme figures are pooled: your funding joins other gifts
          supporting the same programmes, so “people supported” reflects what
          those programmes achieved collectively — not a private conversion of
          your taka into outcomes.
        </p>
      </section>
    </div>
  )
}

function InkFigure({
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
          fontSize: 21,
          fontWeight: 800,
          color: green ? '#4DC86A' : '#fff',
        }}
      >
        {value}
      </div>
      <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
        {label}
      </div>
    </div>
  )
}

/** A commitment reads as done / in progress, or carries the note that explains the exception. */
function CommitmentRow({
  commitment,
}: {
  commitment: {
    label: string
    done: number | null
    total: number | null
    unit: string | null
    note: string | null
  }
}) {
  const done =
    commitment.total != null && (commitment.done ?? 0) >= commitment.total
  const state = commitment.note
    ? commitment.note
    : commitment.unit === 'L'
      ? `৳${commitment.done}L / ৳${commitment.total}L`
      : `${commitment.done} / ${commitment.total}`
  return (
    <div className="gs-row gs-row--between" style={{ gap: 10, fontSize: 12.5 }}>
      <span style={{ color: '#374151' }}>{commitment.label}</span>
      <span
        style={{
          fontWeight: 800,
          whiteSpace: 'nowrap',
          color: commitment.note
            ? '#E65100'
            : done
              ? '#1B7A34'
              : 'var(--gs-ink)',
        }}
      >
        {state}
      </span>
    </div>
  )
}

/** The brief is stamped with the quarter it is generated in, never a fixed one. */
function quarterLabel(now = new Date()): string {
  return `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`
}

/** Timeline dots carry the same meaning as everywhere else: blue money, green evidence, purple people. */
function timelineDot(kind: string): string {
  return kind === 'money'
    ? '#1565C0'
    : kind === 'evidence'
      ? '#1B7A34'
      : kind === 'people'
        ? '#6B21A8'
        : '#4DC86A'
}

/** What comes next is read from the board, never invented: the open initiative this partner funds. */
function nextTitle(partner: PartnerView, os: OSModel): ReactNode {
  const slugs = new Set(partner.programs.map((p) => p.slug))
  const opportunity = os.opportunities.find(
    (o) => o.open && slugs.has(o.programSlug),
  )
  return opportunity
    ? `Close the ${opportunity.title} funding gap`
    : "Close the next initiative's funding gap"
}
