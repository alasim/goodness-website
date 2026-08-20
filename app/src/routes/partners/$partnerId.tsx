import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Empty, Section } from '../../components/ui'
import { formatNumber, formatShortMoney } from '../../lib/format'
import type { ImpactView, PartnerView } from '../../data/os'

/** Partner Profile — a faithful build of `Partner Profile.dc.html`. */
export const Route = createFileRoute('/partners/$partnerId')({
  component: PartnerProfile,
})

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function PartnerProfile() {
  const { partnerId } = Route.useParams()
  const { os } = useOS()
  if (!os) return <LoadingState />

  const partner =
    os.partners.find((p) => p.slug === partnerId) ??
    os.partnerById.get(partnerId)
  if (!partner) {
    return (
      <Section>
        <Empty>
          No partnership with that reference.{' '}
          <Link to="/partner">See our partners</Link>.
        </Empty>
      </Section>
    )
  }

  const money = (value: number) => formatShortMoney(value, os.currency)
  const slugs = new Set(partner.programs.map((p) => p.slug))
  const records = os.impact.filter(
    (r) => r.published && slugs.has(r.programSlug),
  )

  return (
    <>
      {/* ── 01 Hero ── */}
      <section className="gs-inksection" style={{ padding: '64px 0 52px' }}>
        <GWatermark
          width={520}
          height={360}
          style={{ top: -30, right: -20, opacity: 0.07 }}
        />
        <div
          className="gs-narrow"
          style={{ maxWidth: 1080, position: 'relative' }}
        >
          <div className="gs-row" style={{ gap: 18, marginBottom: 22 }}>
            <span
              className="gs-mark gs-mark--blue"
              style={{ width: 64, height: 64, fontSize: 22 }}
            >
              {initialsOf(partner.name)}
            </span>
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {partner.name} × Goodness Society
              </div>
              <span
                className="gs-tiermark"
                style={{ display: 'inline-flex', marginTop: 6 }}
              >
                {partner.tier} ✓ · since {partner.sinceLabel}
              </span>
            </div>
          </div>

          <h1
            style={{
              margin: '0 0 26px',
              fontSize: 'clamp(28px, 4vw, 46px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#fff',
              maxWidth: 720,
              fontWeight: 800,
            }}
          >
            {partner.story ?? 'Partnering for verified impact.'}
          </h1>

          <div
            className="gs-inkbar"
            style={{ borderRadius: 'var(--gs-radius)' }}
          >
            <Figure
              value={fundingLabel(partner, money)}
              label={fundingNote(partner)}
            />
            <Figure
              value={String(records.length)}
              label="Published impact records"
            />
            <Figure
              value={formatNumber(partner.peopleSupported)}
              label="People supported by those programmes"
              green
            />
            <Figure
              value={
                partner.employeesParticipated
                  ? `${partner.employeesParticipated} people · ${partner.employeesHours}h`
                  : '—'
              }
              label="Employee volunteering"
            />
          </div>

          <p
            style={{
              margin: '20px 0 0',
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Every figure on this page is live from Goodness Society's own
            records — the same numbers shown on the public Impact page and Trust
            Ledger. Programme results are collective, supported by this
            partnership alongside other funding and volunteer effort.
          </p>
        </div>
      </section>

      {/* ── 02 Programmes and what they published ── */}
      <section style={{ padding: '52px 0 72px', background: 'var(--gs-mist)' }}>
        <div className="gs-narrow" style={{ maxWidth: 1080 }}>
          <h2 className="gs-blocklabel">Programmes supported</h2>
          <div className="gs-minioppgrid" style={{ marginBottom: 36 }}>
            {partner.programs.map((program) => {
              const forProgram = records.filter(
                (r) => r.programSlug === program.slug,
              )
              const supported = forProgram.reduce(
                (n, r) => n + r.beneficiaries,
                0,
              )
              return (
                <div
                  key={program.slug}
                  className="gs-programcard"
                  style={{ borderTopColor: program.color }}
                >
                  <div
                    style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}
                  >
                    {program.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                    {forProgram.length}{' '}
                    {forProgram.length === 1
                      ? 'published record'
                      : 'published records'}{' '}
                    · {formatNumber(supported)} people supported
                  </div>
                </div>
              )
            })}
          </div>

          <h2 className="gs-blocklabel">
            What those programmes have published
          </h2>
          <div className="gs-stack" style={{ gap: 12, marginBottom: 36 }}>
            {records.map((record) => (
              <Link key={record.id} to="/impact" className="gs-recordrow">
                <span style={{ flex: 1, minWidth: 240 }}>
                  <span
                    style={{ display: 'block', fontSize: 14, fontWeight: 800 }}
                  >
                    {record.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12,
                      color: 'var(--gs-ink-50)',
                      marginTop: 2,
                    }}
                  >
                    {formatNumber(record.primaryValue)} {record.unitLabel} ·{' '}
                    {record.chapter?.city ?? 'Goodness'} · {record.dateLabel}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: '#374151',
                    flex: 1.1,
                    minWidth: 220,
                    lineHeight: 1.5,
                  }}
                >
                  {outcomeLine(record)}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--gs-green-deep)',
                    flexShrink: 0,
                  }}
                >
                  Record →
                </span>
              </Link>
            ))}
          </div>

          <div className="gs-row" style={{ gap: 12, justifyContent: 'center' }}>
            <Link to="/trust" className="gs-btn gs-btn--ghost gs-btn--md">
              Follow the money →
            </Link>
            <Link to="/partner" className="gs-btn gs-btn--primary gs-btn--md">
              Partner with Goodness
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Figure({
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
          fontSize: 22,
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

/** A partner who has not agreed to disclose funding never shows an amount here. */
function fundingLabel(
  partner: PartnerView,
  money: (value: number) => string,
): string {
  if (!partner.discloseFunding) return 'Partner-only'
  return partner.committed ? money(partner.committed) : 'In-kind'
}

function fundingNote(partner: PartnerView): string {
  if (!partner.discloseFunding) return 'Funding details are shared privately'
  return partner.committed ? 'Committed' : 'Non-cash partnership'
}

/** The strongest outcome the record carries — verified first, and never a guess. */
function outcomeLine(record: ImpactView): string {
  const best =
    record.outcomes.find((o) => o.basis === 'verified') ?? record.outcomes[0]
  if (!best) return 'Outcomes not yet recorded'
  if (best.value == null) return `${best.label} — awaiting measurement`
  return `${formatNumber(best.value)} · ${best.label} (${best.basis})`
}
