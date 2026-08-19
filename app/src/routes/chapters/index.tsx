import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { PageHero } from '../../components/PageHero'
import { Bar, Pill, Section, Stat } from '../../components/ui'
import { formatNumber, formatShortMoney } from '../../lib/format'

export const Route = createFileRoute('/chapters/')({
  head: () => ({
    meta: [
      { title: 'Chapters — Goodness Society' },
      {
        name: 'description',
        content:
          'Decentralised execution, central governance: district, university and community chapters with live figures.',
      },
    ],
  }),
  component: Chapters,
})

function Chapters() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const roots = os.activeChapters.filter((c) => !c.parentId)

  return (
    <>
      <PageHero
        eyebrow="The network"
        title="Decentralised execution, central governance"
        lede="Chapters run their own missions inside clear guardrails. Every figure on this page is computed from the same records as the national ones — a chapter total and a national total can never disagree."
        actions={
          <Link to="/chapters/start" className="gs-btn gs-btn--primary">
            Start a chapter in your city
          </Link>
        }
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={String(os.stats.activeChapters)}
            label="Active chapters"
          />
          <Stat
            gradient
            value={String(os.formingChapters.length)}
            label="Forming"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.volunteers)}
            label="Members across the network"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.peopleSupported)}
            label="People supported"
          />
        </div>
      </Section>

      <Section>
        <div className="gs-stack" style={{ gap: 20 }}>
          {roots.map((chapter) => {
            const children = os.chapters.filter(
              (c) => c.parentId === chapter.id,
            )
            return (
              <div key={chapter.id} className="gs-card gs-card--flat">
                <div
                  className="gs-row gs-row--between"
                  style={{ alignItems: 'flex-start', gap: 18 }}
                >
                  <div
                    className="gs-stack"
                    style={{ gap: 8, flex: 1, minWidth: 260 }}
                  >
                    <div className="gs-row" style={{ gap: 6 }}>
                      <Pill tone="green">{chapter.type}</Pill>
                      <Pill>Since {chapter.sinceLabel}</Pill>
                      <Pill
                        tone={
                          chapter.standardsDone === chapter.standardsTotal
                            ? 'green'
                            : 'amber'
                        }
                      >
                        Standards {chapter.standardsDone}/
                        {chapter.standardsTotal}
                      </Pill>
                    </div>
                    <Link
                      to="/chapters/$chapterId"
                      params={{ chapterId: chapter.id }}
                    >
                      <h3 style={{ fontSize: 22 }}>{chapter.name}</h3>
                    </Link>
                    <p className="gs-small gs-muted" style={{ maxWidth: 560 }}>
                      {chapter.story}
                    </p>
                    <span className="gs-small gs-muted">
                      Covers {chapter.coverage.join(', ')}
                    </span>
                  </div>
                  <div
                    className="gs-grid gs-grid--4"
                    style={{ minWidth: 320, flex: 1 }}
                  >
                    <Stat value={String(chapter.memberCount)} label="Members" />
                    <Stat
                      value={String(chapter.liveMissions)}
                      label="Live missions"
                    />
                    <Stat
                      value={formatNumber(chapter.peopleSupported)}
                      label="People supported"
                    />
                    <Stat
                      value={formatShortMoney(chapter.deployed, os.currency)}
                      label="Deployed locally"
                    />
                  </div>
                </div>

                {chapter.goals.length ? (
                  <div className="gs-grid gs-grid--2" style={{ marginTop: 18 }}>
                    {chapter.goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="gs-stack"
                        style={{ gap: 4 }}
                      >
                        <div className="gs-row gs-row--between">
                          <span className="gs-small">{goal.label}</span>
                          <span className="gs-small gs-num">
                            {formatNumber(goal.current)} /{' '}
                            {formatNumber(goal.target)}
                          </span>
                        </div>
                        <Bar pct={goal.pct} label={goal.label} />
                      </div>
                    ))}
                  </div>
                ) : null}

                {children.length ? (
                  <div className="gs-row" style={{ gap: 8, marginTop: 18 }}>
                    <span className="gs-small gs-muted">
                      Within this chapter:
                    </span>
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        to="/chapters/$chapterId"
                        params={{ chapterId: child.id }}
                        className="gs-chip"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </Section>

      {os.formingChapters.length ? (
        <Section variant="mist">
          <h2 style={{ marginBottom: 14 }}>Forming</h2>
          <div className="gs-grid gs-grid--3">
            {os.formingChapters.map((chapter) => (
              <Link
                key={chapter.id}
                to="/chapters/$chapterId"
                params={{ chapterId: chapter.id }}
                className="gs-card gs-card--flat gs-card--link"
              >
                <Pill tone="amber">Forming</Pill>
                <h3 style={{ marginTop: 10, fontSize: 18 }}>{chapter.name}</h3>
                <p className="gs-small gs-muted" style={{ marginTop: 6 }}>
                  {chapter.story}
                </p>
                <span
                  className="gs-small"
                  style={{
                    fontWeight: 700,
                    display: 'inline-block',
                    marginTop: 10,
                  }}
                >
                  Be a founding volunteer →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section variant="ink" tight>
        <div className="gs-row gs-row--between" style={{ gap: 18 }}>
          <div className="gs-stack" style={{ gap: 8, maxWidth: 560 }}>
            <h2>No chapter where you are?</h2>
            <p style={{ color: 'rgba(255,255,255,0.72)' }}>
              Chapters start with people, not paperwork. Tell us who is ready
              and HQ will work through the lifecycle with you: proposed →
              forming → active.
            </p>
          </div>
          <Link to="/chapters/start" className="gs-btn gs-btn--primary">
            Start a chapter
          </Link>
        </div>
      </Section>
    </>
  )
}
