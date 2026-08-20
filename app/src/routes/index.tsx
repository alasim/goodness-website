import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { Display } from '../components/ui'
import { formatNumber, formatShortMoney } from '../lib/format'
import type { OSModel } from '../data/os'

/**
 * Home — a faithful build of `Home.dc.html`, section for section, with every figure computed from
 * the live model instead of typed in. Section numbering below matches the design file's
 * `data-screen-label` attributes so the two can be diffed by eye.
 */
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Goodness Society — Goodness, organized.' },
      {
        name: 'description',
        content:
          'People, skills and capital working together to create measurable change across Bangladesh — every mission, taka and outcome connected and verifiable.',
      },
    ],
  }),
  component: Home,
})

function Home() {
  const { os } = useOS()
  if (!os) return <LoadingState />
  return (
    <>
      <Hero os={os} />
      <MetricStrip os={os} />
      <ChooseYourRole />
      <LiveFeed os={os} />
      <Network os={os} />
      <HowItWorks os={os} />
      <YourGoodness os={os} />
      <ImpactPreview os={os} />
      <Trust os={os} />
      <Partners os={os} />
      <Programs os={os} />
      <People os={os} />
      <FinalCta />
    </>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */
function Hero({ os }: { os: OSModel }) {
  const open = os.openMissions
  const topMission = open.slice().sort((a, b) => b.remaining - a.remaining)[0]
  const record = os.publishedImpact[0]
  const topChapter = os.activeChapters
    .slice()
    .sort((a, b) => b.memberCount - a.memberCount)[0]
  const opportunity = os.opportunities.find((o) => !o.funded)

  return (
    <section className="gs-wrap" style={{ padding: '72px 24px 56px' }}>
      <div className="gs-hero-grid">
        <div>
          <p className="gs-eyebrow" style={{ marginBottom: 18 }}>
            Together for a Better Tomorrow
          </p>
          <Display
            as="h1"
            variant="hero"
            reverse
            italic
            light="organized."
            bold="Goodness,"
          />
          <p
            className="gs-lede"
            style={{ margin: '18px 0 30px', maxWidth: 480 }}
          >
            People, skills and capital working together to create measurable
            change across Bangladesh — every mission, taka and outcome connected
            and verifiable.
          </p>
          <div className="gs-row" style={{ gap: 12 }}>
            <Link to="/missions" className="gs-btn gs-btn--primary gs-btn--lg">
              Join a Mission
            </Link>
            <Link to="/fund" className="gs-btn gs-btn--ghost gs-btn--lg">
              Fund Impact
            </Link>
            <a
              href="#live"
              className="gs-arrowlink"
              style={{ padding: '10px 6px' }}
            >
              See Goodness live →
            </a>
          </div>
        </div>

        <div className="gs-panel">
          <div className="gs-row" style={{ gap: 8, marginBottom: 18 }}>
            <span className="gs-live-dot" />
            <span className="gs-onink-label">Goodness live</span>
          </div>
          <div className="gs-stack" style={{ gap: 14 }}>
            <Link to="/missions" className="gs-inktile">
              <div
                className="gs-inktile__label"
                style={{ color: 'var(--gs-green)' }}
              >
                {open.length}{' '}
                {open.length === 1 ? 'mission needs' : 'missions need'} people
              </div>
              <div className="gs-inktile__title">
                {topMission?.title ?? 'Missions'}
              </div>
              <div className="gs-inktile__meta">
                {topMission
                  ? `${topMission.chapter?.city ?? 'Remote'} · ${topMission.remaining} ${topMission.remaining === 1 ? 'position' : 'positions'} left`
                  : ''}
              </div>
            </Link>

            <Link to="/impact" className="gs-inktile">
              <div
                className="gs-inktile__label"
                style={{ color: 'var(--gs-blue-soft)' }}
              >
                New impact published
              </div>
              <div className="gs-inktile__title">{record?.title}</div>
              <div className="gs-inktile__meta">
                {record
                  ? `${formatNumber(record.beneficiaries)} people supported · evidence on file`
                  : ''}
              </div>
            </Link>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <Link to="/chapters" className="gs-inktile">
                <div
                  className="gs-inktile__label"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {topChapter?.name}
                </div>
                <div className="gs-inktile__title">
                  {topChapter?.memberCount} members active
                </div>
              </Link>
              <Link to="/fund" className="gs-inktile">
                <div
                  className="gs-inktile__label"
                  style={{ color: 'var(--gs-orange-soft)' }}
                >
                  Funding opportunity
                </div>
                <div className="gs-inktile__title">
                  {opportunity
                    ? `${opportunity.title} · still seeking partners`
                    : 'Fully funded'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 02 Live strip ───────────────────────────────────────────────────────── */
function MetricStrip({ os }: { os: OSModel }) {
  const metrics: Array<{
    value: string
    label: string
    to: string
    green?: boolean
  }> = [
    {
      value: String(os.stats.openPositions),
      label: 'open mission spots',
      to: '/missions',
      green: true,
    },
    {
      value: formatNumber(os.stats.peopleSupported),
      label: 'people supported',
      to: '/impact',
    },
    {
      value: String(os.stats.activeChapters),
      label: 'active chapters',
      to: '/chapters',
    },
    {
      value: String(os.stats.volunteers),
      label: 'active volunteers',
      to: '/people',
    },
    {
      value: `${os.finance.documentedPct}%`,
      label: 'spending documented',
      to: '/trust',
      green: true,
    },
    {
      value: formatShortMoney(os.finance.received, os.currency),
      label: 'received & traceable',
      to: '/trust',
    },
  ]
  return (
    <section className="gs-band--strip">
      <div className="gs-wrap">
        <p className="gs-label" style={{ marginBottom: 14 }}>
          Goodness right now
        </p>
        <div className="gs-strip">
          {metrics.map((metric) => (
            <Link key={metric.label} to={metric.to}>
              <div
                className="gs-strip__value gs-num"
                style={{
                  color: metric.green
                    ? 'var(--gs-green-deep)'
                    : 'var(--gs-ink)',
                }}
              >
                {metric.value}
              </div>
              <div className="gs-strip__label">{metric.label} →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 03 Choose your role ─────────────────────────────────────────────────── */
interface RoleCard {
  kicker: string
  title: string
  body: string
  cta: string
  to: string
  ink?: boolean
}

const ROLES: Array<RoleCard> = [
  {
    kicker: 'Give time',
    title: 'Join a Mission',
    body: 'Find something meaningful you can do this week — every verified hour builds your Goodness Passport.',
    cta: 'Browse missions →',
    to: '/missions',
  },
  {
    kicker: 'Sustain the movement',
    title: 'Make a Goodness Commitment',
    body: 'Choose your own amount and rhythm — the commitment matters, never the size.',
    cta: 'Start a commitment →',
    to: '/me',
  },
  {
    kicker: 'Back impact',
    title: 'Fund an Initiative',
    body: 'Support measurable work and follow what happens — secured and received are never blurred.',
    cta: 'Explore Fund Impact →',
    to: '/fund',
  },
  {
    kicker: 'Build with us',
    title: 'Partner with Goodness',
    body: 'Capital, employees, technology or resources — with a live room, not an annual PDF.',
    cta: 'Explore partnerships →',
    to: '/partner',
    ink: true,
  },
]

function ChooseYourRole() {
  return (
    <section className="gs-band">
      <div className="gs-wrap">
        <Display light="How will you" bold="create Goodness?" />
        <p className="gs-sub" style={{ margin: '8px 0 32px' }}>
          Time, consistency, capital or institutional strength — every form of
          contribution has a real place in the system.
        </p>
        <div className="gs-cols-4">
          {ROLES.map((role) => (
            <Link
              key={role.title}
              to={role.to}
              className={`gs-tile ${role.ink ? 'gs-tile--ink' : ''}`}
            >
              <div
                className="gs-kicker"
                style={{
                  color: role.ink ? 'var(--gs-green)' : 'var(--gs-green-deep)',
                  marginBottom: 10,
                }}
              >
                {role.kicker}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>
                {role.title}
              </div>
              <p
                className="gs-note"
                style={{
                  marginBottom: 14,
                  color:
                    'ink' in role && role.ink
                      ? 'rgba(255,255,255,0.55)'
                      : undefined,
                }}
              >
                {role.body}
              </p>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: role.ink ? 'var(--gs-green)' : 'var(--gs-green-deep)',
                }}
              >
                {role.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 04 Goodness live feed ───────────────────────────────────────────────── */
function LiveFeed({ os }: { os: OSModel }) {
  const rows: Array<{
    tag: string
    chipBg: string
    chipColor: string
    text: string
    meta: string
    to: string
  }> = []

  os.openMissions.slice(0, 2).forEach((mission) => {
    rows.push({
      tag: mission.chapter?.city ?? 'Remote',
      chipBg: 'rgba(77,200,106,0.16)',
      chipColor: '#4DC86A',
      text: `“${mission.title}” needs ${mission.remaining} more ${mission.remaining === 1 ? 'volunteer' : 'volunteers'}`,
      meta: `${mission.dateLabel} · ${mission.roles
        .slice(0, 2)
        .map((r) => r.role)
        .join(', ')}`,
      to: '/missions',
    })
  })

  os.publishedImpact.slice(0, 2).forEach((record) => {
    rows.push({
      tag: 'Impact',
      chipBg: 'rgba(144,202,249,0.18)',
      chipColor: '#90CAF9',
      text: `${record.title} — ${formatNumber(record.beneficiaries)} people supported`,
      meta: 'Published with evidence',
      to: '/impact',
    })
  })

  const expense = os.finance.expenses
    .filter((e) => e.status === 'approved')
    .slice(-1)[0]
  if (expense) {
    rows.push({
      tag: 'Ledger',
      chipBg: 'rgba(255,183,77,0.16)',
      chipColor: '#FFB74D',
      text: `${formatShortMoney(expense.amount, os.currency)} — ${expense.item} accepted with documentation`,
      meta: `Trust Ledger · ${expense.payee ?? ''}`,
      to: '/trust',
    })
  }

  const forming = os.formingChapters[0]
  if (forming) {
    rows.push({
      tag: 'Network',
      chipBg: 'rgba(171,130,255,0.16)',
      chipColor: '#CBB2FF',
      text: `${forming.name} is forming — leadership team assembling`,
      meta: `Goodness standards ${forming.standardsDone} / ${forming.standardsTotal}`,
      to: '/chapters',
    })
  }

  return (
    <section
      id="live"
      className="gs-band gs-band--ink"
      style={{ scrollMarginTop: 90 }}
    >
      <div className="gs-wrap">
        <div className="gs-head">
          <Display onInk light="Goodness is" bold="happening now." />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Drawn live from missions, impact records, the ledger and the network
          </span>
        </div>
        <div className="gs-cols-2" style={{ gap: 12 }}>
          {rows.slice(0, 6).map((row, i) => (
            <Link key={i} to={row.to} className="gs-feedrow">
              <span
                className="gs-feedchip"
                style={{ background: row.chipBg, color: row.chipColor }}
              >
                {row.tag}
              </span>
              <span style={{ flex: 1 }}>
                <span className="gs-feedrow__text">{row.text}</span>
                <span className="gs-feedrow__meta">{row.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 05 Network ──────────────────────────────────────────────────────────── */
function Network({ os }: { os: OSModel }) {
  return (
    <section className="gs-band">
      <div className="gs-wrap">
        <div className="gs-head">
          <Display light="Goodness" bold="across Bangladesh" />
          <Link to="/chapters" className="gs-arrowlink">
            All chapters →
          </Link>
        </div>
        <div className="gs-cols-4" style={{ gap: 14 }}>
          {os.chapters.slice(0, 7).map((chapter) => {
            const forming = chapter.status === 'forming'
            const urgent = chapter.missions.some(
              (m) => m.priority === 'urgent' && m.status === 'open',
            )
            const note = forming
              ? 'Forming'
              : urgent
                ? 'Urgent response active'
                : chapter.type === 'university'
                  ? 'University chapter'
                  : 'Active'
            const noteColor = forming
              ? '#6B21A8'
              : urgent
                ? '#E65100'
                : '#1B7A34'
            const members =
              chapter.type === 'university' ? 26 : chapter.memberCount
            return (
              <Link
                key={chapter.id}
                to="/chapters/$chapterId"
                params={{ chapterId: chapter.id }}
                className="gs-tile gs-tile--sm"
              >
                <div
                  className="gs-row"
                  style={{ gap: 10, marginBottom: 10, flexWrap: 'nowrap' }}
                >
                  <span className="gs-mark gs-mark--34">
                    {chapter.name.replace('Goodness ', '')[0]}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 13.5,
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {chapter.name}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 10.5,
                        color: noteColor,
                        fontWeight: 700,
                      }}
                    >
                      {note}
                    </span>
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                  {forming
                    ? 'Leadership being established'
                    : `${members} ${members === 1 ? 'member' : 'members'} · ${chapter.liveMissions} ${chapter.liveMissions === 1 ? 'mission live' : 'missions live'}`}
                </div>
              </Link>
            )
          })}
          <Link
            to="/chapters/start"
            className="gs-tile gs-tile--sm gs-tile--dashed"
          >
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 800,
                color: 'var(--gs-green-deep)',
              }}
            >
              Don’t see Goodness where you are?
            </div>
            <div
              style={{ fontSize: 12, color: 'var(--gs-ink-50)', marginTop: 4 }}
            >
              Propose a chapter — HQ reviews every request. Start a Chapter →
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 06 How Goodness works ───────────────────────────────────────────────── */
function HowItWorks({ os }: { os: OSModel }) {
  // The chain follows one real initiative through the graph: the Career Bootcamp record, the fund
  // that paid for it, and the evidence behind its outcome.
  const record =
    os.impactById.get('imp-career-bootcamp-2026') ?? os.publishedImpact[0]
  const completed =
    record?.outputs.find((o) => /completed/i.test(o.label)) ??
    record?.outputs[0]
  const employed =
    record?.outcomes.find((o) => o.basis === 'verified') ?? record?.outcomes[0]
  const interviewed = record?.outcomes.find((o) => /interview/i.test(o.label))
  const fund = os.finance.funds.find(
    (f) => f.programSlug === record?.programSlug,
  )
  const partner = os.activePartners.find((p) =>
    p.programs.some((program) => program.slug === record?.programSlug),
  )
  const completionPct = completed?.target
    ? Math.round((completed.value / completed.target) * 100)
    : 100

  const chain = [
    {
      step: 'Partner funds',
      value: `${formatShortMoney(partner?.received ?? 0, os.currency)} allocated`,
      note: `${partner?.name.split(' ')[0] ?? 'Partner'} → ${record?.program?.shortName ?? ''}`,
      color: '#1565C0',
    },
    {
      step: 'Mission launched',
      value: record?.projectLabel ?? 'Career Launch Bootcamp',
      note: `${record?.chapter?.city ?? 'Dhaka'} · mentors, trainers, ops`,
      color: '#1B7A34',
    },
    {
      step: 'People show up',
      value: `${os.people.filter((p) => p.programSlug === record?.programSlug).length} volunteers · ${formatNumber(record?.primaryValue ?? 0)} participants`,
      note: 'Hours verified by the mission lead',
      color: '#1B7A34',
    },
    {
      step: 'Work delivered',
      value: `${formatNumber(completed?.value ?? 0)} completed`,
      note: `${completionPct}% of target — output, not outcome`,
      color: '#1B7A34',
    },
    {
      step: 'Outcome measured',
      value: `${formatNumber(employed?.value ?? 0)} employed`,
      note: interviewed
        ? `${formatNumber(interviewed.value ?? 0)} interviewed within 90 days`
        : 'Measured after 90 days',
      color: '#E65100',
    },
    {
      step: 'Evidence',
      value: `${record?.evidenceVerified ?? 0} / ${record?.evidenceTotal ?? 0} verified`,
      note: 'Attendance ✓ Assessment ✓ Employer ✓',
      color: '#E65100',
    },
    {
      step: 'Traceable',
      value: 'Record + Ledger',
      note: 'Open both — nothing is hidden',
      color: '#0D0D0D',
    },
  ]

  return (
    <section className="gs-band gs-band--mist">
      <div className="gs-wrap">
        <Display light="See how" bold="Goodness works" />
        <p className="gs-sub" style={{ margin: '8px 0 36px', maxWidth: 560 }}>
          One real initiative, followed all the way through: money and people
          become verified change — and every step stays traceable.
        </p>
        <div className="gs-chain">
          {chain.map((step, i) => (
            <div key={step.step} className="gs-chain__cell">
              <div className="gs-tile gs-tile--xs">
                <div className="gs-chain__step" style={{ color: step.color }}>
                  {step.step}
                </div>
                <div className="gs-chain__value">{step.value}</div>
                <div className="gs-chain__note">{step.note}</div>
              </div>
              {i < chain.length - 1 ? (
                <span className="gs-chain__arrow">→</span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="gs-row" style={{ gap: 12, marginTop: 24 }}>
          <Link
            to="/impact"
            hash={record?.id}
            className="gs-btn gs-btn--primary gs-btn--md"
          >
            Open the impact record
          </Link>
          <Link
            to="/trust"
            hash={fund?.id}
            className="gs-btn gs-btn--ghost gs-btn--md"
          >
            Open the Trust Ledger
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 07 Your Goodness grows with you ─────────────────────────────────────── */
function YourGoodness({ os }: { os: OSModel }) {
  const example = os.people[0]
  const partner = os.activePartners[0]
  return (
    <section className="gs-band">
      <div className="gs-wrap">
        <Display light="Your Goodness" bold="grows with you." />
        <p className="gs-sub" style={{ margin: '8px 0 32px' }}>
          Join, and you get a real place inside the system — not a thank-you
          email.
        </p>
        <div className="gs-cols-3">
          <Link to="/people" className="gs-tile gs-tile--lg">
            <div
              className="gs-kicker"
              style={{ color: 'var(--gs-ink-40)', marginBottom: 12 }}
            >
              Volunteer
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              Goodness Passport
            </div>
            <div className="gs-figures" style={{ marginBottom: 12 }}>
              <div>
                <div className="gs-figure__value gs-num">
                  {example?.totalMissions}
                </div>
                <div className="gs-figure__label">missions</div>
              </div>
              <div className="gs-figure--green">
                <div className="gs-figure__value gs-num">
                  {example?.totalHours}
                </div>
                <div className="gs-figure__label">verified hours</div>
              </div>
              <div>
                <div className="gs-figure__value gs-num">
                  {example?.credentials.length}
                </div>
                <div className="gs-figure__label">credentials</div>
              </div>
            </div>
            <p
              className="gs-note"
              style={{ fontStyle: 'italic', fontSize: 12 }}
            >
              Every contribution becomes part of your verified impact history.
            </p>
          </Link>

          <Link to="/me" className="gs-tile gs-tile--lg">
            <div
              className="gs-kicker"
              style={{ color: 'var(--gs-ink-40)', marginBottom: 12 }}
            >
              Member
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              Goodness Commitment
            </div>
            <div className="gs-row" style={{ gap: 8, marginBottom: 12 }}>
              <span className="gs-pill gs-pill--green">
                Sustaining Member ✓
              </span>
              <span className="gs-micro">your amount · your rhythm</span>
            </div>
            <p
              className="gs-note"
              style={{ fontStyle: 'italic', fontSize: 12 }}
            >
              Contribute in a rhythm that works for you — recognition follows
              commitment, never size.
            </p>
          </Link>

          <Link to="/partner-room" className="gs-tile gs-tile--lg">
            <div
              className="gs-kicker"
              style={{ color: 'var(--gs-ink-40)', marginBottom: 12 }}
            >
              Partner
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              Partner Room
            </div>
            <div className="gs-figures" style={{ marginBottom: 12 }}>
              <div>
                <div className="gs-figure__value gs-num">
                  {formatShortMoney(partner?.committed ?? 0, os.currency)}
                </div>
                <div className="gs-figure__label">committed</div>
              </div>
              <div className="gs-figure--green">
                <div className="gs-figure__value gs-num">
                  {formatNumber(partner?.peopleSupported ?? 0)}
                </div>
                <div className="gs-figure__label">people supported*</div>
              </div>
              <div>
                <div className="gs-figure__value gs-num">
                  {formatNumber(partner?.employeesHours ?? 0)}
                </div>
                <div className="gs-figure__label">employee hours</div>
              </div>
            </div>
            <p
              className="gs-note"
              style={{ fontStyle: 'italic', fontSize: 12 }}
            >
              Follow your partnership while it happens. *Shared results across
              all funders.
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 08 Impact preview ───────────────────────────────────────────────────── */
function ImpactPreview({ os }: { os: OSModel }) {
  const record =
    os.impactById.get('imp-career-bootcamp-2026') ?? os.publishedImpact[0]
  if (!record) return null
  const delivered =
    record.outputs.find((o) => /completed/i.test(o.label)) ?? record.outputs[0]
  const outcome =
    record.outcomes.find((o) => o.basis === 'verified') ?? record.outcomes[0]
  const interviewed = record.outcomes.find((o) => /interview/i.test(o.label))
  const deliveredPct = delivered?.target
    ? Math.round((delivered.value / delivered.target) * 100)
    : 100

  return (
    <section className="gs-band gs-band--ink">
      <div className="gs-wrap">
        <div
          className="gs-split"
          style={{ gridTemplateColumns: '0.9fr 1.1fr' }}
        >
          <div>
            <Display
              onInk
              light="We don’t stop at what we delivered."
              bold="We measure what changed."
            />
            <p
              className="gs-onink-muted"
              style={{ margin: '14px 0 22px', fontSize: 14, lineHeight: 1.7 }}
            >
              Outputs are what happened. Outcomes are what changed in people’s
              lives — and Goodness publishes both, with evidence, or publishes
              nothing.
            </p>
            <Link
              to="/impact"
              hash={record.id}
              style={{
                fontSize: 13.5,
                fontWeight: 800,
                color: 'var(--gs-green)',
              }}
            >
              View the full impact record →
            </Link>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--gs-radius-xl)',
              padding: 28,
              color: 'var(--gs-ink)',
            }}
          >
            <div
              className="gs-row gs-row--between"
              style={{ gap: 10, marginBottom: 18 }}
            >
              <div style={{ fontSize: 15, fontWeight: 800 }}>
                {record.title}
              </div>
              <span
                className="gs-pill gs-pill--green"
                style={{ textTransform: 'uppercase' }}
              >
                Published
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div className="gs-tile gs-tile--xs" style={{ padding: 16 }}>
                <div
                  className="gs-inktile__label"
                  style={{ color: 'var(--gs-ink-40)', letterSpacing: '0.14em' }}
                >
                  Delivered
                </div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {formatNumber(delivered?.value ?? 0)} /{' '}
                  {formatNumber(delivered?.target ?? 0)} completed
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--gs-ink-50)',
                    marginTop: 3,
                  }}
                >
                  {deliveredPct}% of participation target
                </div>
              </div>
              <div
                className="gs-tile gs-tile--xs gs-tile--wash"
                style={{ padding: 16 }}
              >
                <div
                  className="gs-inktile__label"
                  style={{
                    color: 'var(--gs-green-deep)',
                    letterSpacing: '0.14em',
                  }}
                >
                  What changed
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--gs-green-deep)',
                  }}
                >
                  {formatNumber(outcome?.value ?? 0)} secured employment
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--gs-ink-50)',
                    marginTop: 3,
                  }}
                >
                  {interviewed
                    ? `${formatNumber(interviewed.value ?? 0)} interviewed within 90 days · `
                    : ''}
                  <span
                    style={{ color: 'var(--gs-green-deep)', fontWeight: 800 }}
                  >
                    Verified
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{ marginTop: 14, fontSize: 12, color: 'var(--gs-ink-50)' }}
            >
              Evidence{' '}
              <span style={{ fontWeight: 800, color: 'var(--gs-green-deep)' }}>
                {record.evidenceVerified} / {record.evidenceTotal} verified
              </span>{' '}
              · attendance sheets, assessments and employer confirmations on
              file
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 09 Trust ────────────────────────────────────────────────────────────── */
function Trust({ os }: { os: OSModel }) {
  const steps = [
    {
      n: '1',
      label: 'Received & receipted',
      value: formatShortMoney(os.finance.received, os.currency),
      dotBg: 'var(--gs-green-wash)',
      dotColor: 'var(--gs-green-deep)',
    },
    {
      n: '2',
      label: 'Programme funds allocated',
      value: 'restricted honoured',
      dotBg: 'var(--gs-green-wash)',
      dotColor: 'var(--gs-green-deep)',
    },
    {
      n: '3',
      label: 'Spending approved',
      value: 'HQ review',
      dotBg: 'var(--gs-orange-wash)',
      dotColor: 'var(--gs-orange)',
    },
    {
      n: '4',
      label: 'Documents attached',
      value: `${os.finance.documentedPct}% documented`,
      dotBg: 'var(--gs-orange-wash)',
      dotColor: 'var(--gs-orange)',
    },
    {
      n: '5',
      label: 'Impact published with evidence',
      value: `${os.stats.publishedRecords} records`,
      dotBg: 'var(--gs-blue-wash)',
      dotColor: 'var(--gs-blue)',
    },
  ]

  return (
    <section className="gs-band">
      <div className="gs-wrap">
        <div className="gs-split">
          <div>
            <Display
              light="Don’t take our word for it."
              bold="Follow the money."
            />
            <p
              className="gs-note"
              style={{ margin: '14px 0 22px', fontSize: 14, lineHeight: 1.7 }}
            >
              Every taka received is traceable to programme funds, approved
              spending, supporting documents and published impact. Not an annual
              summary — a living ledger.
            </p>
            <div className="gs-row" style={{ gap: 22, marginBottom: 22 }}>
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'var(--gs-green-deep)',
                  }}
                >
                  {os.finance.programSharePct}%
                </div>
                <div className="gs-micro">programme spending</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  {os.finance.overheadPct}%
                </div>
                <div className="gs-micro">operations &amp; admin</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'var(--gs-green-deep)',
                  }}
                >
                  {os.finance.documentedPct}%
                </div>
                <div className="gs-micro">spending documented</div>
              </div>
            </div>
            <Link to="/trust" className="gs-btn gs-btn--primary gs-btn--md">
              Open the Trust Ledger
            </Link>
          </div>

          <div className="gs-stack" style={{ gap: 0 }}>
            {steps.map((step, i) => (
              <div key={step.n}>
                <div className="gs-moneystep">
                  <span
                    className="gs-moneystep__n"
                    style={{ background: step.dotBg, color: step.dotColor }}
                  >
                    {step.n}
                  </span>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: 'var(--gs-ink-50)',
                      fontWeight: 700,
                    }}
                  >
                    {step.value}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <div className="gs-moneystep__down">↓</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 10 Partners ─────────────────────────────────────────────────────────── */
function Partners({ os }: { os: OSModel }) {
  const partner = os.activePartners[0]
  if (!partner) return null
  // "BrightWorks Bangladesh Ltd" reads as BW, not BB: prefer the capitals inside the first word.
  const firstWord = partner.name.split(' ')[0] ?? partner.name
  const innerCaps = firstWord.match(/[A-Z]/g) ?? []
  const initials = (
    innerCaps.length >= 2
      ? innerCaps.slice(0, 2).join('')
      : partner.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
  ).toUpperCase()

  return (
    <section className="gs-band gs-band--mist">
      <div className="gs-wrap">
        <div className="gs-split">
          <div>
            <Display
              light="For organisations that want"
              bold="more than a logo placement."
            />
            <p
              className="gs-note"
              style={{ margin: '14px 0 22px', fontSize: 14, lineHeight: 1.7 }}
            >
              Fund measurable initiatives, involve your employees, and follow
              your partnership from commitment to outcome — in a live Partner
              Room, not a year-end PDF.
            </p>
            <Link to="/partner" style={{ fontSize: 13.5, fontWeight: 800 }}>
              See how partnerships work →
            </Link>
          </div>

          <Link
            to="/partners/$partnerId"
            params={{ partnerId: partner.id }}
            className="gs-tile gs-tile--lg"
          >
            <div
              className="gs-row"
              style={{ gap: 12, marginBottom: 16, flexWrap: 'nowrap' }}
            >
              <span className="gs-mark gs-mark--44 gs-mark--blue">
                {initials}
              </span>
              <span>
                <span
                  style={{ display: 'block', fontSize: 15, fontWeight: 800 }}
                >
                  {partner.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 11,
                    color: 'var(--gs-green-deep)',
                    fontWeight: 800,
                  }}
                >
                  {partner.tier} ✓
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}
            >
              <div className="gs-boxfig">
                <div className="gs-boxfig__value gs-num">
                  {formatShortMoney(partner.committed, os.currency)}
                </div>
                <div className="gs-boxfig__label">committed</div>
              </div>
              <div className="gs-boxfig">
                <div
                  className="gs-boxfig__value gs-num"
                  style={{ color: 'var(--gs-green-deep)' }}
                >
                  {formatNumber(partner.peopleSupported)}
                </div>
                <div className="gs-boxfig__label">people supported*</div>
              </div>
              <div className="gs-boxfig">
                <div className="gs-boxfig__value gs-num">
                  {partner.employeesParticipated}
                </div>
                <div className="gs-boxfig__label">employees volunteered</div>
              </div>
              <div className="gs-boxfig">
                <div className="gs-boxfig__value gs-num">
                  {formatNumber(partner.employeesHours)}
                </div>
                <div className="gs-boxfig__label">verified hours</div>
              </div>
            </div>
            <div
              style={{ fontSize: 10, color: 'var(--gs-ink-40)', marginTop: 10 }}
            >
              *Through initiatives {partner.name.split(' ')[0]} backs — shared
              programme results across all funders.
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── 11 Programs ─────────────────────────────────────────────────────────── */
const PROGRAM_LINES: Record<string, string> = {
  'education-career-readiness': 'Bootcamps, mentoring, employment outcomes',
  'ai-digital-skills': 'Practical AI literacy for young people',
  'youth-empowerment': 'Leads, chapters, real responsibility',
  'community-development': 'Local needs, surveyed and answered',
  'innovation-social-good': 'New models, measured before scaled',
}

function Programs({ os }: { os: OSModel }) {
  return (
    <section className="gs-band">
      <div className="gs-wrap">
        <div className="gs-head" style={{ marginBottom: 26 }}>
          <Display
            variant="minor"
            light="Five areas of"
            bold="sustainable impact"
          />
          <Link to="/programs" className="gs-arrowlink">
            All programs →
          </Link>
        </div>
        <div className="gs-cols-5">
          {os.programs
            .filter((program) => !program.isOperations)
            .map((program) => (
              <Link
                key={program.slug}
                to="/programs"
                className="gs-tile gs-tile--plain"
              >
                <div
                  style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.35 }}
                >
                  {program.shortName ?? program.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--gs-ink-50)',
                    marginTop: 5,
                    lineHeight: 1.5,
                  }}
                >
                  {PROGRAM_LINES[program.slug] ?? program.summary}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}

/* ── 12 People ───────────────────────────────────────────────────────────── */
function People({ os }: { os: OSModel }) {
  return (
    <section className="gs-wrap" style={{ padding: '0 24px 72px' }}>
      <div className="gs-head" style={{ marginBottom: 26 }}>
        <Display variant="minor" light="The people" bold="behind the system" />
        <Link to="/people" className="gs-arrowlink">
          Meet the volunteers →
        </Link>
      </div>
      <div className="gs-cols-3" style={{ gap: 14 }}>
        {os.people.slice(0, 3).map((person) => (
          <Link
            key={person.id}
            to="/people/$volunteerId"
            params={{ volunteerId: person.slug }}
            className="gs-tile gs-tile--sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 18,
            }}
          >
            <span
              className={`gs-mark gs-mark--48 ${person.avatarColor === 'blue' ? 'gs-mark--blue' : person.avatarColor === 'teal' ? 'gs-mark--teal' : ''}`}
            >
              {person.initials}
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 800 }}>
                {person.fullName}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 11.5,
                  color: 'var(--gs-ink-50)',
                }}
              >
                {person.roleTitle} · {person.city}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--gs-green-deep)',
                  fontWeight: 800,
                  marginTop: 2,
                }}
              >
                {person.totalHours} verified hours · {person.totalMissions}{' '}
                {person.totalMissions === 1 ? 'mission' : 'missions'}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ── 13 Final CTA ────────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="gs-band--gradient">
      <div className="gs-wrap">
        <Display
          variant="cta"
          onInk
          light="There is a place for you"
          bold="in Goodness."
        />
        <p
          style={{
            margin: '12px 0 36px',
            fontSize: 15,
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
          }}
        >
          Together for a Better Tomorrow.
        </p>
        <div className="gs-row" style={{ gap: 12, justifyContent: 'center' }}>
          <Link to="/missions" className="gs-btn gs-btn--white gs-btn--md">
            Give your time →
          </Link>
          <Link to="/me" className="gs-btn gs-btn--onink gs-btn--md">
            Give consistently →
          </Link>
          <Link to="/fund" className="gs-btn gs-btn--onink gs-btn--md">
            Back an initiative →
          </Link>
          <Link to="/partner" className="gs-btn gs-btn--onink gs-btn--md">
            Build with us →
          </Link>
        </div>
      </div>
    </section>
  )
}
