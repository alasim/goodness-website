import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { Bar, Empty, Pill, Section, Stat } from '../../components/ui'
import { formatNumber, formatShortMoney } from '../../lib/format'

export const Route = createFileRoute('/partners/$partnerId')({
  component: PartnerProfile,
})

function PartnerProfile() {
  const { partnerId } = Route.useParams()
  const { os } = useOS()
  if (!os) return <LoadingState />

  const partner = os.partnerById.get(partnerId)
  if (!partner) {
    return (
      <Section>
        <Empty>
          No public profile for that partner.{' '}
          <Link to="/partner">See our partners</Link>.
        </Empty>
      </Section>
    )
  }

  const records = os.publishedImpact.filter((r) =>
    partner.programs.some((p) => p.slug === r.programSlug),
  )

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap gs-stack" style={{ gap: 16 }}>
          <p className="gs-eyebrow">Partner profile</p>
          <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}>
            {partner.name}
          </h1>
          <p className="gs-lede" style={{ maxWidth: 660 }}>
            {partner.story}
          </p>
          <div className="gs-row" style={{ gap: 6 }}>
            <Pill tone="green">{partner.tier ?? partner.kind}</Pill>
            <Pill>Partner since {partner.sinceLabel}</Pill>
            {partner.districts.map((d) => (
              <Pill key={d}>{d}</Pill>
            ))}
          </div>
        </div>
      </section>

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(partner.peopleSupported)}
            label="People supported in these programmes"
            note="Published records"
          />
          <Stat
            gradient
            value={String(partner.employeesParticipated)}
            label="Employee volunteers"
          />
          <Stat
            gradient
            value={formatNumber(partner.employeesHours)}
            label="Employee hours"
          />
          <Stat
            gradient
            value={
              partner.discloseFunding
                ? formatShortMoney(partner.received, os.currency)
                : '—'
            }
            label={
              partner.discloseFunding
                ? 'Funding received'
                : 'Funding not disclosed'
            }
            note={
              partner.discloseFunding ? undefined : 'At the partner’s request'
            }
          />
        </div>
      </Section>

      <Section>
        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 28,
          }}
        >
          <div className="gs-stack" style={{ gap: 22 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Work this partnership supported</p>
              <div className="gs-stack" style={{ gap: 14, marginTop: 14 }}>
                {records.map((record) => (
                  <div key={record.id} className="gs-stack" style={{ gap: 4 }}>
                    <div className="gs-row gs-row--between">
                      <Link
                        to="/impact"
                        hash={record.id}
                        className="gs-small"
                        style={{ fontWeight: 700 }}
                      >
                        {record.title}
                      </Link>
                      <span className="gs-small gs-muted">
                        {formatNumber(record.primaryValue)} {record.unitLabel}
                      </span>
                    </div>
                    <Bar
                      pct={record.evidencePct}
                      tone={record.fullyVerified ? 'green' : 'amber'}
                      label={record.title}
                    />
                  </div>
                ))}
              </div>
              <p className="gs-small gs-muted" style={{ marginTop: 14 }}>
                This partnership supported the work above alongside other
                funders and volunteer time. We report it collectively rather
                than attributing outcomes to a single contributor.
              </p>
            </div>

            {partner.goalLabel ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">Shared goal</p>
                <h3 style={{ marginTop: 8, fontSize: 20 }}>
                  {partner.goalLabel}
                </h3>
                <div style={{ marginTop: 12 }}>
                  <Bar pct={partner.goalPct} tall label={partner.goalLabel} />
                  <span className="gs-small gs-muted">
                    {formatNumber(partner.peopleSupported)} of{' '}
                    {formatNumber(partner.goalTarget ?? 0)} so far
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Programmes</p>
              <div className="gs-row" style={{ gap: 6, marginTop: 10 }}>
                {partner.programs.map((program) => (
                  <Pill key={program.slug} tone="blue">
                    {program.name}
                  </Pill>
                ))}
              </div>
            </div>

            {partner.inKind.length ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">In-kind support</p>
                <div className="gs-stack" style={{ gap: 8, marginTop: 10 }}>
                  {partner.inKind.map((item) => (
                    <div key={item.id} className="gs-row gs-row--between">
                      <span className="gs-small">{item.label}</span>
                      <span className="gs-small gs-muted">
                        est. {formatShortMoney(item.estValue, os.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="gs-small gs-muted" style={{ marginTop: 8 }}>
                  In-kind values are estimates provided for transparency, not
                  cash received.
                </p>
              </div>
            ) : null}

            <div className="gs-card gs-card--wash">
              <p className="gs-eyebrow">Work with us too</p>
              <p
                className="gs-small"
                style={{ marginTop: 8, color: 'var(--gs-ink-70)' }}
              >
                Partnerships here start from a goal, not a budget line.
              </p>
              <Link
                to="/partner"
                className="gs-btn gs-btn--primary gs-btn--sm"
                style={{ marginTop: 12 }}
              >
                Explore partnership
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
