import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { MissionCard } from '../components/MissionCard'
import { LoadingState } from '../components/LoadingState'
import { Bar, Pill, Section, Stat } from '../components/ui'
import { formatNumber, formatShortMoney } from '../lib/format'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Goodness Society — Goodness, organized.' },
      {
        name: 'description',
        content:
          'Verified volunteers, real missions, measured impact and a public trust ledger. This is what goodness looks like when we organize it.',
      },
    ],
  }),
  component: Home,
})

function Home() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const { stats, currency } = os
  const liveMissions = os.openMissions
    .slice()
    .sort(
      (a, b) =>
        (a.priority === 'urgent' ? -1 : 0) - (b.priority === 'urgent' ? -1 : 0),
    )
    .slice(0, 3)
  const latestImpact = os.publishedImpact.slice(0, 2)
  const urgentOpportunity = os.opportunities.find((o) => o.urgent && !o.funded)

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap gs-stack" style={{ gap: 22 }}>
          <p className="gs-eyebrow">Society for Initiatives of Goodness</p>
          <h1 style={{ maxWidth: 900 }}>
            Goodness,{' '}
            <span
              style={{
                background: 'var(--gs-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              organized.
            </span>
          </h1>
          <p className="gs-lede" style={{ maxWidth: 660 }}>
            Not a website about good intentions — the operating system behind
            them. Every volunteer is verified, every mission is real, every taka
            is traceable, and every claim on this site is computed from the
            record below it.
          </p>
          <div className="gs-row">
            <Link to="/missions" className="gs-btn gs-btn--primary">
              Find a mission
            </Link>
            <Link to="/fund" className="gs-btn gs-btn--ghost">
              Fund an initiative
            </Link>
            <Link to="/trust" className="gs-btn gs-btn--ghost">
              Follow the money
            </Link>
          </div>
        </div>
      </section>

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(stats.volunteers)}
            label="Verified volunteers"
          />
          <Stat
            gradient
            value={formatNumber(stats.verifiedHours)}
            label="Service hours on the record"
          />
          <Stat
            gradient
            value={formatNumber(stats.peopleSupported)}
            label="People supported"
            note="From published impact records only"
          />
          <Stat
            gradient
            value={formatShortMoney(stats.fundsDeployed, currency)}
            label="Funds deployed"
            note={`${os.finance.documentedPct}% of documents checked`}
          />
        </div>
      </Section>

      <Section>
        <div className="gs-row gs-row--between" style={{ marginBottom: 22 }}>
          <div>
            <p className="gs-eyebrow">Live now</p>
            <h2>{stats.openPositions} places waiting to be filled</h2>
          </div>
          <Link to="/missions" className="gs-btn gs-btn--ghost gs-btn--sm">
            All missions
          </Link>
        </div>
        <div className="gs-grid gs-grid--3">
          {liveMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </Section>

      <Section variant="mist">
        <p className="gs-eyebrow">Four ways in</p>
        <h2 style={{ marginBottom: 8 }}>
          Give time, skills, resources — or build with us
        </h2>
        <p className="gs-lede" style={{ maxWidth: 640, marginBottom: 26 }}>
          Members sustain the movement, partners accelerate it, volunteers bring
          it to life.
        </p>
        <div className="gs-grid gs-grid--4">
          {[
            {
              title: 'Give time',
              body: 'One meaningful Saturday. Join a mission near you and leave with verified hours.',
              to: '/missions',
              cta: 'See missions',
            },
            {
              title: 'Give skills',
              body: 'Trainers, coaches, photographers, designers. Roles are matched to what you can actually do.',
              to: '/join',
              cta: 'Join as a volunteer',
            },
            {
              title: 'Give resources',
              body: 'Fund an initiative, not a donation shop. Contributions pool; results are reported collectively.',
              to: '/fund',
              cta: 'Fund impact',
            },
            {
              title: 'Build with us',
              body: 'Corporate partners, foundations and universities who want participation, not a logo.',
              to: '/partner',
              cta: 'Partner with us',
            },
          ].map((card) => (
            <div key={card.title} className="gs-card gs-card--flat gs-stack">
              <h3 style={{ fontSize: 19 }}>{card.title}</h3>
              <p className="gs-small" style={{ color: 'var(--gs-ink-70)' }}>
                {card.body}
              </p>
              <Link
                to={card.to}
                className="gs-small"
                style={{ fontWeight: 700 }}
              >
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="gs-row gs-row--between" style={{ marginBottom: 20 }}>
          <div>
            <p className="gs-eyebrow">Impact</p>
            <h2>We don’t stop at what we delivered.</h2>
            <p className="gs-lede" style={{ marginTop: 8 }}>
              We measure what changed.
            </p>
          </div>
          <Link to="/impact" className="gs-btn gs-btn--ghost gs-btn--sm">
            All impact records
          </Link>
        </div>
        <div className="gs-grid gs-grid--2">
          {latestImpact.map((record) => (
            <Link
              key={record.id}
              to="/impact"
              hash={record.id}
              className="gs-card gs-card--flat gs-card--link"
            >
              <div className="gs-row" style={{ gap: 6 }}>
                <Pill tone="green">{record.program?.shortName}</Pill>
                <Pill>{record.dateLabel}</Pill>
                {record.fullyVerified ? (
                  <Pill tone="blue">Evidence verified</Pill>
                ) : (
                  <Pill tone="amber">
                    {record.evidenceVerified}/{record.evidenceTotal} evidence
                    checked
                  </Pill>
                )}
              </div>
              <h3 style={{ marginTop: 12, fontSize: 19 }}>{record.title}</h3>
              <div className="gs-row" style={{ gap: 22, marginTop: 14 }}>
                <Stat
                  value={formatNumber(record.primaryValue)}
                  label={record.unitLabel}
                />
                <Stat
                  value={`${record.targetsMet}/${record.targetsTotal}`}
                  label="Targets met"
                />
              </div>
              {record.outcomes[0] ? (
                <p
                  className="gs-small"
                  style={{ marginTop: 14, color: 'var(--gs-ink-70)' }}
                >
                  <strong>What changed: </strong>
                  {record.outcomes[0].label}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </Section>

      <Section variant="ink">
        <p className="gs-eyebrow" style={{ color: 'var(--gs-green)' }}>
          Trust ledger
        </p>
        <h2 style={{ marginBottom: 10 }}>Received → allocated → spent</h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 620,
            marginBottom: 28,
          }}
        >
          Follow any taka from the receipt that brought it in to the invoice
          that spent it, and to the impact record it supported.
        </p>
        <div className="gs-grid gs-grid--4">
          <Stat
            value={formatShortMoney(os.finance.received, currency)}
            label="Received"
          />
          <Stat
            value={formatShortMoney(os.finance.allocated, currency)}
            label="Allocated to funds"
          />
          <Stat
            value={formatShortMoney(os.finance.spent, currency)}
            label="Spent and approved"
          />
          <Stat
            value={`${os.finance.programSharePct}%`}
            label="Programme share of spend"
            note={`${os.finance.overheadPct}% operations`}
          />
        </div>
        <div style={{ marginTop: 26, maxWidth: 620 }}>
          <Bar
            pct={(os.finance.spent / Math.max(1, os.finance.received)) * 100}
            tall
            label="Share of received funds spent"
          />
        </div>
        <div className="gs-row" style={{ marginTop: 26 }}>
          <Link to="/trust" className="gs-btn gs-btn--primary">
            Open the trust ledger
          </Link>
          <Link
            to="/transparency"
            className="gs-btn gs-btn--ghost"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Yearly summary
          </Link>
        </div>
      </Section>

      <Section>
        <div className="gs-row gs-row--between" style={{ marginBottom: 18 }}>
          <div>
            <p className="gs-eyebrow">The network</p>
            <h2>
              {stats.activeChapters} active chapters,{' '}
              {os.formingChapters.length} forming
            </h2>
          </div>
          <Link to="/chapters" className="gs-btn gs-btn--ghost gs-btn--sm">
            Explore the network
          </Link>
        </div>
        <div className="gs-row" style={{ gap: 8 }}>
          {os.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              to="/chapters/$chapterId"
              params={{ chapterId: chapter.id }}
              className="gs-chip"
            >
              {chapter.name} · {chapter.memberCount} members
            </Link>
          ))}
          <Link
            to="/chapters/start"
            className="gs-chip"
            style={{ fontWeight: 700 }}
          >
            + Start a chapter
          </Link>
        </div>
      </Section>

      {urgentOpportunity ? (
        <Section variant="mist" tight>
          <div
            className="gs-card gs-card--flat gs-row gs-row--between"
            style={{ gap: 20 }}
          >
            <div
              className="gs-stack"
              style={{ gap: 8, flex: 1, minWidth: 260 }}
            >
              <Pill tone="amber">Urgent · funding gap</Pill>
              <h3>{urgentOpportunity.title}</h3>
              <p className="gs-small gs-muted">{urgentOpportunity.note}</p>
              <Bar
                pct={urgentOpportunity.securedPct}
                tone="amber"
                label={urgentOpportunity.title}
              />
              <span className="gs-small">
                {formatShortMoney(urgentOpportunity.secured, currency)} secured
                of {formatShortMoney(urgentOpportunity.target, currency)} —{' '}
                <strong>
                  {formatShortMoney(urgentOpportunity.gap, currency)} still
                  needed
                </strong>
              </span>
            </div>
            <Link to="/fund" className="gs-btn gs-btn--primary">
              Close the gap
            </Link>
          </div>
        </Section>
      ) : null}

      <Section variant="ink" tight>
        <div className="gs-row gs-row--between" style={{ gap: 20 }}>
          <h2 style={{ maxWidth: 560 }}>
            This is what goodness looks like when we organize it.
          </h2>
          <Link to="/join" className="gs-btn gs-btn--primary">
            Join in 30 seconds
          </Link>
        </div>
      </Section>
    </>
  )
}
