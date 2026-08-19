import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Pill, Section, Stat } from '../components/ui'
import { formatNumber, formatShortMoney } from '../lib/format'

export const Route = createFileRoute('/programs')({
  head: () => ({
    meta: [
      { title: 'Programs — Goodness Society' },
      {
        name: 'description',
        content:
          'Five areas of work, each with projects, missions, measured outcomes and a fund you can follow.',
      },
    ],
  }),
  component: Programs,
})

function Programs() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  return (
    <>
      <PageHero
        eyebrow="Programme architecture"
        title="Programme → project → mission → outcome"
        lede="Work is organised so that a Saturday morning can be traced upward to a measured outcome, and a published outcome can be traced back to the people and money behind it."
      />

      <Section>
        <div className="gs-stack" style={{ gap: 22 }}>
          {os.programs
            .filter((program) => !program.isOperations)
            .map((program) => {
              const missions = os.missions.filter(
                (m) => m.programSlug === program.slug,
              )
              const records = os.publishedImpact.filter(
                (r) => r.programSlug === program.slug,
              )
              const fund = os.finance.funds.find(
                (f) => f.programSlug === program.slug,
              )
              const people = records.reduce((n, r) => n + r.beneficiaries, 0)
              const volunteers = os.people.filter(
                (p) => p.programSlug === program.slug,
              )
              return (
                <div
                  key={program.slug}
                  className="gs-card gs-card--flat"
                  style={{ borderLeft: `5px solid ${program.color}` }}
                >
                  <div
                    className="gs-row gs-row--between"
                    style={{ alignItems: 'flex-start' }}
                  >
                    <div className="gs-stack" style={{ gap: 8, maxWidth: 640 }}>
                      <p
                        className="gs-eyebrow"
                        style={{ color: program.color }}
                      >
                        {program.shortName}
                      </p>
                      <h2 style={{ fontSize: 26 }}>{program.name}</h2>
                      {program.summary ? (
                        <p className="gs-small gs-muted">{program.summary}</p>
                      ) : null}
                      <div className="gs-row" style={{ gap: 6 }}>
                        {os.data.projects
                          .filter(
                            (project) => project.programSlug === program.slug,
                          )
                          .map((project) => (
                            <Pill key={project.id}>{project.name}</Pill>
                          ))}
                      </div>
                    </div>
                    <div className="gs-row" style={{ gap: 8 }}>
                      <Link
                        to="/missions"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                      >
                        Missions
                      </Link>
                      <Link
                        to="/impact"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                      >
                        Impact
                      </Link>
                    </div>
                  </div>

                  <div className="gs-grid gs-grid--4" style={{ marginTop: 22 }}>
                    <Stat
                      value={formatNumber(people)}
                      label="People supported"
                      note="Published records"
                    />
                    <Stat
                      value={formatNumber(volunteers.length)}
                      label="Volunteers in this programme"
                    />
                    <Stat
                      value={formatNumber(missions.length)}
                      label="Missions on the board"
                    />
                    <Stat
                      value={
                        fund ? formatShortMoney(fund.spent, os.currency) : '—'
                      }
                      label="Spent and approved"
                      note={
                        fund && fund.fundingGap > 0
                          ? `${formatShortMoney(fund.fundingGap, os.currency)} funding gap`
                          : undefined
                      }
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </Section>

      <Section variant="mist" tight>
        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Operations</p>
          <h3 style={{ marginTop: 8 }}>
            Running the organisation is a line in the ledger, not a secret
          </h3>
          <p
            className="gs-small gs-muted"
            style={{ marginTop: 10, maxWidth: 720 }}
          >
            {os.finance.overheadPct}% of everything we spent went on operations
            and administration; {os.finance.programSharePct}% went directly into
            programmes. Both figures come from the same expense records you can
            open in the Trust Ledger.
          </p>
          <Link
            to="/trust"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            style={{ marginTop: 16 }}
          >
            Open the ledger
          </Link>
        </div>
      </Section>
    </>
  )
}
