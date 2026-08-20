import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Section, Stat } from '../components/ui'
import { formatNumber } from '../lib/format'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About — Goodness Society' },
      {
        name: 'description',
        content:
          'A government-registered non-profit building the operating system for organized goodness.',
      },
    ],
  }),
  component: About,
})

const PRINCIPLES = [
  {
    title: 'One truth',
    body: 'Numbers are computed from the record, never typed into a page. If a chapter figure and a national figure disagree, one of them is a bug — not a rounding choice.',
  },
  {
    title: 'Publication is not verification',
    body: 'We publish an impact record when the work is done, and we say plainly how much of its evidence our team has actually checked.',
  },
  {
    title: 'No misleading attribution',
    body: 'Contributions pool. We never claim a specific amount bought a specific outcome, and we never present people as points.',
  },
  {
    title: 'Privacy is structural',
    body: 'Contact details, addresses, identity documents and administrative notes are not merely hidden in the interface — the public surfaces cannot read them at all.',
  },
  {
    title: 'Nobody rewrites history quietly',
    body: 'Approvals, reversals, revocations and role changes are recorded with the old value, the new value, who changed it and why.',
  },
  {
    title: 'Decentralised execution, central governance',
    body: 'Chapters run their own work within clear guardrails; budgets, published impact and credentials go through HQ.',
  },
]

function About() {
  const { os } = useOS()
  if (!os) return <LoadingState />
  const organisation = os.data.organisations[0]
  const country = os.data.countries[0]

  return (
    <>
      <PageHero
        eyebrow="About"
        title="The operating system for organized goodness"
        lede={`${organisation?.name ?? 'Goodness Society'} is a ${organisation?.registrationRef?.toLowerCase() ?? 'registered non-profit'}. We are not trying to be the largest charity — we are trying to be the most trustworthy piece of infrastructure a social movement can run on.`}
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(os.stats.volunteers)}
            label="Verified volunteers"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.activeChapters)}
            label="Active chapters"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.publishedRecords)}
            label="Published impact records"
          />
          <Stat
            gradient
            value={`${os.stats.evidenceVerifiedPct}%`}
            label="Evidence checked by our team"
          />
        </div>
      </Section>

      <Section>
        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 30,
          }}
        >
          <div className="gs-stack" style={{ gap: 16 }}>
            <h2>What we are building</h2>
            <p className="gs-lede">
              People → Missions → Impact → Trust → Community. Each arrow in that
              chain is a piece of software here: a passport that proves service,
              a mission board that fills real roles, an impact record that
              separates what we delivered from what changed, and a ledger that
              shows where every taka went.
            </p>
            <p className="gs-small gs-muted">
              We currently operate in {country?.name ?? 'Bangladesh'}, and the
              system is built as Organisation → Country → Chapter from the first
              migration, so a second country is a configuration, not a rewrite.
            </p>
          </div>
          <div className="gs-card gs-card--wash">
            <p className="gs-eyebrow">North star</p>
            <h3 style={{ marginTop: 10 }}>Verified Goodness Created</h3>
            <p
              className="gs-small"
              style={{ marginTop: 10, color: 'var(--gs-ink-70)' }}
            >
              Not reach, not impressions, not money raised. The measure is
              people, action, impact, trust and growth — and every one of those
              is derived from records that a stranger can inspect.
            </p>
          </div>
        </div>
      </Section>

      <Section variant="mist">
        <h2 style={{ marginBottom: 22 }}>How we hold ourselves to it</h2>
        <div className="gs-grid gs-grid--3">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="gs-card gs-card--flat gs-stack"
            >
              <h3 style={{ fontSize: 18 }}>{principle.title}</h3>
              <p className="gs-small" style={{ color: 'var(--gs-ink-70)' }}>
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="ink" tight>
        <div className="gs-row gs-row--between" style={{ gap: 18 }}>
          <h2 style={{ maxWidth: 540 }}>Together for a Better Tomorrow.</h2>
          <div className="gs-row">
            <Link to="/join" className="gs-btn gs-btn--primary">
              Join as a volunteer
            </Link>
            <Link
              to="/partner"
              className="gs-btn gs-btn--ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Partner with us
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
