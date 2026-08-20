import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS, useClaimedPartnerId } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Bar, Pill, Section, Stat } from '../components/ui'
import { claimPartner } from '../data/actions'
import { formatMoney, formatNumber, formatShortMoney } from '../lib/format'

export const Route = createFileRoute('/partner-room')({
  head: () => ({ meta: [{ title: 'Partner Room — Goodness Society' }] }),
  component: PartnerRoom,
})

function PartnerRoom() {
  const { os } = useOS()
  const partnerId = useClaimedPartnerId()
  if (!os) return <LoadingState />

  const partner = partnerId ? os.partnerById.get(partnerId) : null

  if (!partner) {
    return (
      <>
        <PageHero
          eyebrow="Partner Room"
          title="Your partnership, in the open"
          lede="Committed, received, deployed and available — plus the missions, people and evidence behind them. Choose your organisation to open its room."
        />
        <Section tight>
          <div className="gs-grid gs-grid--3">
            {os.activePartners.map((p) => (
              <button
                key={p.id}
                type="button"
                className="gs-card gs-card--flat gs-card--link"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => claimPartner(p.id)}
              >
                <Pill tone="green">{p.tier ?? p.kind}</Pill>
                <h3 style={{ marginTop: 10, fontSize: 18 }}>{p.name}</h3>
                <p className="gs-small gs-muted" style={{ marginTop: 6 }}>
                  Partner since {p.sinceLabel}
                </p>
              </button>
            ))}
          </div>
        </Section>
      </>
    )
  }

  const available = Math.max(0, partner.received - partner.deployed)
  const liveMissions = os.openMissions.filter((m) =>
    partner.programs.some((p) => p.slug === m.programSlug),
  )
  const supportedRecords = os.publishedImpact.filter((r) =>
    partner.programs.some((p) => p.slug === r.programSlug),
  )
  const peopleDelivering = os.people
    .filter((person) =>
      partner.programs.some((p) => p.slug === person.programSlug),
    )
    .slice(0, 6)

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap">
          <div
            className="gs-row gs-row--between"
            style={{ gap: 18, alignItems: 'flex-start' }}
          >
            <div className="gs-stack" style={{ gap: 10 }}>
              <p className="gs-eyebrow">Partner Room</p>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {partner.name}
              </h1>
              <div className="gs-row" style={{ gap: 6 }}>
                <Pill tone="green">{partner.tier ?? partner.kind}</Pill>
                <Pill>Since {partner.sinceLabel}</Pill>
                {partner.renewalLabel ? (
                  <Pill tone="blue">Next chapter {partner.renewalLabel}</Pill>
                ) : null}
                <Pill>{partner.tenureMonths} months together</Pill>
              </div>
            </div>
            <div className="gs-row" style={{ gap: 8 }}>
              <Link
                to="/partners/$partnerId"
                params={{ partnerId: partner.id }}
                className="gs-btn gs-btn--ghost gs-btn--sm"
              >
                Public profile
              </Link>
              <button
                type="button"
                className="gs-btn gs-btn--ghost gs-btn--sm"
                onClick={() => claimPartner(null)}
              >
                Switch organisation
              </button>
            </div>
          </div>
        </div>
      </section>

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatShortMoney(partner.committed, os.currency)}
            label="Committed"
          />
          <Stat
            gradient
            value={formatShortMoney(partner.received, os.currency)}
            label="Received"
          />
          <Stat
            gradient
            value={formatShortMoney(partner.deployed, os.currency)}
            label="Deployed in your programmes"
          />
          <Stat
            gradient
            value={formatShortMoney(available, os.currency)}
            label="Available to deploy"
          />
        </div>
        <div style={{ marginTop: 18, maxWidth: 560 }}>
          <Bar
            pct={(partner.received / Math.max(1, partner.committed)) * 100}
            tall
            label="Received against commitment"
          />
          <p className="gs-small gs-muted" style={{ marginTop: 8 }}>
            Deployment figures cover the programmes you fund. Those programmes
            are also supported by other funders and by volunteer time — this is
            the pool your contribution joined.
          </p>
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
          <div className="gs-stack" style={{ gap: 24 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Live now</p>
              <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                {liveMissions.length ? (
                  liveMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="gs-row gs-row--between"
                      style={{ gap: 12 }}
                    >
                      <Link
                        to="/missions/$missionId"
                        params={{ missionId: mission.id }}
                        className="gs-small"
                        style={{ fontWeight: 700 }}
                      >
                        {mission.title}
                      </Link>
                      <span className="gs-small gs-muted">
                        {mission.filled}/{mission.need} filled ·{' '}
                        {mission.dateLabel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="gs-small gs-muted">
                    No open missions in your programmes this week.
                  </p>
                )}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Trace the contribution</p>
              <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                {partner.donations.map((donation) => (
                  <div key={donation.id} className="gs-row gs-row--between">
                    <div className="gs-stack" style={{ gap: 2 }}>
                      <span className="gs-small" style={{ fontWeight: 600 }}>
                        {donation.dateLabel} · {donation.method}
                      </span>
                      <span className="gs-small gs-muted">
                        Receipt {donation.receiptRef}
                      </span>
                    </div>
                    <strong className="gs-small gs-num">
                      {formatMoney(donation.amount, os.currency)}
                    </strong>
                  </div>
                ))}
              </div>
              <Link
                to="/trust"
                className="gs-small"
                style={{
                  fontWeight: 700,
                  display: 'inline-block',
                  marginTop: 12,
                }}
              >
                Follow it through the ledger →
              </Link>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">What your funding supported</p>
              <div className="gs-stack" style={{ gap: 14, marginTop: 12 }}>
                {supportedRecords.map((record) => (
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
                    <span className="gs-small gs-muted">
                      {record.evidenceVerified}/{record.evidenceTotal} evidence
                      items checked by our team
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Timeline</p>
              <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
                {partner.timeline.map((entry) => (
                  <div
                    key={entry.id}
                    className="gs-row"
                    style={{ gap: 12, alignItems: 'flex-start' }}
                  >
                    <span
                      className="gs-small gs-muted"
                      style={{ minWidth: 96 }}
                    >
                      {entry.dateLabel}
                    </span>
                    <span className="gs-small">{entry.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Commitments — both sides</p>
              <div className="gs-stack" style={{ gap: 14, marginTop: 12 }}>
                <span className="gs-small" style={{ fontWeight: 700 }}>
                  What Goodness Society owes you
                </span>
                {partner.commitments.goodness.map((c) => (
                  <CommitmentRow
                    key={c.id}
                    label={c.label}
                    done={c.done}
                    total={c.total}
                    note={c.note}
                  />
                ))}
                <span
                  className="gs-small"
                  style={{ fontWeight: 700, marginTop: 8 }}
                >
                  What you committed
                </span>
                {partner.commitments.partner.map((c) => (
                  <CommitmentRow
                    key={c.id}
                    label={c.label}
                    done={c.done}
                    total={c.total}
                    note={c.note}
                    unit={c.unit}
                  />
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Employee volunteering</p>
              <div className="gs-row" style={{ gap: 20, marginTop: 12 }}>
                <Stat
                  value={String(partner.employeesParticipated)}
                  label="Employees"
                />
                <Stat value={String(partner.employeesHours)} label="Hours" />
                <Stat
                  value={String(partner.employeesSessions)}
                  label="Sessions"
                />
              </div>
              <Link
                to="/missions"
                className="gs-btn gs-btn--ghost gs-btn--sm"
                style={{ marginTop: 14 }}
              >
                Book the next session
              </Link>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">People delivering the work</p>
              <div className="gs-stack" style={{ gap: 8, marginTop: 12 }}>
                {peopleDelivering.map((person) => (
                  <Link
                    key={person.id}
                    to="/people/$volunteerId"
                    params={{ volunteerId: person.slug }}
                    className="gs-row gs-row--between"
                  >
                    <span className="gs-small">{person.fullName}</span>
                    <span className="gs-small gs-muted">
                      {person.totalHours} hrs
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--wash">
              <p className="gs-eyebrow">Reports and sharing</p>
              <div className="gs-stack" style={{ gap: 8, marginTop: 10 }}>
                <Link
                  to="/studio"
                  search={{ partner: partner.id }}
                  className="gs-small"
                  style={{ fontWeight: 700 }}
                >
                  Partner announcement card →
                </Link>
                <Link
                  to="/studio"
                  search={{ partner: partner.id, card: 'partnermile' }}
                  className="gs-small"
                  style={{ fontWeight: 700 }}
                >
                  Impact milestone card →
                </Link>
                <Link
                  to="/studio"
                  search={{ partner: partner.id, card: 'partneryear' }}
                  className="gs-small"
                  style={{ fontWeight: 700 }}
                >
                  Year in partnership →
                </Link>
                <Link
                  to="/impact"
                  className="gs-small"
                  style={{ fontWeight: 700 }}
                >
                  Quarterly brief source records →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

function CommitmentRow({
  label,
  done,
  total,
  note,
  unit,
}: {
  label: string
  done: number | null
  total: number | null
  note: string | null
  unit?: string | null
}) {
  const pct = total ? Math.min(100, Math.round(((done ?? 0) / total) * 100)) : 0
  return (
    <div className="gs-stack" style={{ gap: 4 }}>
      <div className="gs-row gs-row--between">
        <span className="gs-small">{label}</span>
        {total != null ? (
          <span className="gs-small gs-num" style={{ fontWeight: 700 }}>
            {done ?? 0}
            {unit ?? ''} / {total}
            {unit ?? ''}
          </span>
        ) : null}
      </div>
      {total != null ? <Bar pct={pct} label={label} /> : null}
      {note ? <span className="gs-small gs-muted">{note}</span> : null}
    </div>
  )
}
