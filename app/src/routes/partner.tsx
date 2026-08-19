import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Banner, Bar, Pill, Section, Stat } from '../components/ui'
import { formatNumber, formatShortMoney } from '../lib/format'

export const Route = createFileRoute('/partner')({
  head: () => ({
    meta: [
      { title: 'Partner with us — Goodness Society' },
      {
        name: 'description',
        content:
          'Turn funding from a transaction into participation: named work, named people, measured results.',
      },
    ],
  }),
  component: Partner,
})

const GOALS = [
  { id: 'employability', label: 'Get young people into work' },
  { id: 'digital', label: 'Build digital and AI skills' },
  { id: 'community', label: 'Strengthen a community we operate in' },
  {
    id: 'employees',
    label: 'Give our employees somewhere meaningful to volunteer',
  },
]

function Partner() {
  const { os } = useOS()
  const [goal, setGoal] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  if (!os) return <LoadingState />

  const matched = os.opportunities
    .filter((o) => !o.funded)
    .filter((o) => {
      if (!goal) return true
      if (goal === 'employability')
        return o.programSlug === 'education-career-readiness'
      if (goal === 'digital') return o.programSlug === 'ai-digital-skills'
      if (goal === 'community') return o.programSlug === 'community-development'
      return o.seeking.some((s) => s.toLowerCase().includes('volunteer'))
    })

  const employeeHours = os.partners.reduce((n, p) => n + p.employeesHours, 0)

  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Turn funding into participation"
        lede="Partners here are not logos on a page. You see the missions your funding runs, the people delivering them, the evidence behind the results, and what is still unfunded."
        actions={
          <>
            <Link to="/fund" className="gs-btn gs-btn--primary">
              See what needs funding
            </Link>
            <Link to="/partner-room" className="gs-btn gs-btn--ghost">
              Open Partner Room
            </Link>
          </>
        }
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={String(os.stats.partners)}
            label="Active partners"
          />
          <Stat
            gradient
            value={formatNumber(employeeHours)}
            label="Employee volunteer hours"
          />
          <Stat
            gradient
            value={formatShortMoney(os.finance.spent, os.currency)}
            label="Deployed with evidence"
          />
          <Stat
            gradient
            value={`${os.finance.documentedPct}%`}
            label="Expense documents checked"
          />
        </div>
      </Section>

      <Section>
        <p className="gs-eyebrow">Partnership builder</p>
        <h2 style={{ marginBottom: 16 }}>Start from what you want to change</h2>
        <div className="gs-row" style={{ gap: 8, marginBottom: 22 }}>
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className="gs-chip"
              aria-pressed={goal === g.id}
              onClick={() => setGoal(goal === g.id ? null : g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="gs-grid gs-grid--2">
          {matched.map((opportunity) => (
            <div
              key={opportunity.id}
              className="gs-card gs-card--flat gs-stack"
            >
              <div className="gs-row" style={{ gap: 6 }}>
                {opportunity.urgent ? <Pill tone="amber">Urgent</Pill> : null}
                <Pill tone="blue">{opportunity.program?.shortName}</Pill>
              </div>
              <h3 style={{ fontSize: 19 }}>{opportunity.title}</h3>
              <Bar pct={opportunity.securedPct} label={opportunity.title} />
              <span className="gs-small gs-muted">
                {formatShortMoney(opportunity.gap, os.currency)} still needed ·{' '}
                {opportunity.whereLabel}
              </span>
              <div className="gs-stack" style={{ gap: 4 }}>
                {opportunity.seeking.slice(0, 3).map((item) => (
                  <span key={item} className="gs-small">
                    · {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="mist">
        <h2 style={{ marginBottom: 18 }}>Partners already in</h2>
        <div className="gs-grid gs-grid--3">
          {os.activePartners.map((partner) => (
            <Link
              key={partner.id}
              to="/partners/$partnerId"
              params={{ partnerId: partner.id }}
              className="gs-card gs-card--flat gs-card--link gs-stack"
            >
              <div className="gs-row" style={{ gap: 6 }}>
                <Pill tone="green">{partner.tier ?? partner.kind}</Pill>
                <Pill>Since {partner.sinceLabel}</Pill>
              </div>
              <h3 style={{ fontSize: 18 }}>{partner.name}</h3>
              <p className="gs-small gs-muted">{partner.story}</p>
              <span className="gs-small">
                {partner.programs.map((p) => p.shortName).join(' · ')}
              </span>
            </Link>
          ))}
        </div>
        <p className="gs-small gs-muted" style={{ marginTop: 14 }}>
          Recognition here reflects the shape of the partnership — tenure,
          employee participation, evidence discipline — not the size of the
          cheque.
        </p>
      </Section>

      <Section>
        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 28,
          }}
        >
          <div className="gs-stack" style={{ gap: 14 }}>
            <h2>What you get</h2>
            <ul
              className="gs-small"
              style={{
                color: 'var(--gs-ink-70)',
                paddingLeft: 20,
                lineHeight: 1.9,
              }}
            >
              <li>
                A Partner Room showing committed, received, deployed and
                available funds
              </li>
              <li>The missions your funding is running, live, as they fill</li>
              <li>
                The people delivering the work, with verified service records
              </li>
              <li>
                Impact records with evidence, including what is still being
                measured
              </li>
              <li>
                A quarterly brief you can hand to your board without editing
              </li>
              <li>
                Employee volunteering that shows up in the same system as
                everything else
              </li>
            </ul>
          </div>

          <div className="gs-card gs-card--flat gs-stack">
            <p className="gs-eyebrow">Start a conversation</p>
            {sent ? (
              <Banner>
                Thank you — the partnerships team will reply within two working
                days.
              </Banner>
            ) : (
              <form
                className="gs-stack"
                style={{ gap: 12 }}
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <input
                  name="organisation"
                  required
                  placeholder="Organisation"
                  aria-label="Organisation"
                />
                <input
                  name="contact"
                  required
                  placeholder="Your name"
                  aria-label="Your name"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Work email"
                  aria-label="Work email"
                />
                <textarea
                  name="note"
                  rows={3}
                  placeholder="What would you like to change?"
                  aria-label="What would you like to change?"
                />
                <button
                  type="submit"
                  className="gs-btn gs-btn--primary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Send enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
