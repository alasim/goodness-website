import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import { formatShortMoney } from '../lib/format'
import type { OpportunityView } from '../data/os'

/** Fund Impact — a faithful build of `Fund Impact.dc.html`. */
export const Route = createFileRoute('/fund')({
  head: () => ({
    meta: [
      { title: 'Fund Impact — Goodness Society' },
      {
        name: 'description',
        content:
          "Don't just donate. Back measurable impact: every opportunity has a funding target, expected outcomes, and a public trail.",
      },
    ],
  }),
  component: Fund,
})

function Fund() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const open = os.opportunities.filter((o) => o.open)
  const totalGap = open.reduce((n, o) => n + o.gap, 0)
  const money = (value: number) => formatShortMoney(value, os.currency)

  return (
    <>
      {/* ── 01 Hero ── */}
      <section className="gs-inksection" style={{ padding: '64px 0 52px' }}>
        <GWatermark
          width={560}
          height={380}
          style={{ top: -30, right: -20, opacity: 0.07 }}
        />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span
            className="gs-livepill"
            style={{ fontSize: 12, letterSpacing: '0.06em', marginBottom: 24 }}
          >
            Fund Impact
          </span>
          <div className="gs-hero-grid">
            <Display
              as="h1"
              onInk
              stacked
              light="Don't just donate."
              bold="Back measurable impact."
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4.4vw, 56px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            />
            <div>
              <p
                style={{
                  margin: '0 0 18px',
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                }}
              >
                Every opportunity below has a funding target, expected outcomes,
                and a public trail — your contribution joins its funding pool,
                the work is delivered by verified volunteers, and the results
                land on the Impact page and Trust Ledger with evidence.
              </p>
              <div className="gs-row" style={{ gap: 10 }}>
                <Link to="/trust" className="gs-btn gs-btn--white gs-btn--md">
                  See where money goes →
                </Link>
                <Link
                  to="/partner-room"
                  className="gs-btn gs-btn--onink-soft gs-btn--md"
                >
                  Partner Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Open initiatives ── */}
      <section
        style={{
          padding: '56px 0 80px',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-wrap">
          <div className="gs-head" style={{ marginBottom: 28 }}>
            <div>
              <p className="gs-sectionlabel">Open now</p>
              <Display
                light={`${open.length} initiatives`}
                bold="seeking funding"
                style={{
                  margin: 0,
                  fontSize: 'clamp(26px, 3.2vw, 40px)',
                  lineHeight: 1.15,
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: 'var(--gs-ink-50)' }}>
              {money(totalGap)} still needed across all open initiatives
            </div>
          </div>

          <div className="gs-oppgrid">
            {open.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                money={money}
              />
            ))}
          </div>

          <p
            style={{
              margin: '26px auto 0',
              fontSize: 12,
              color: 'var(--gs-ink-40)',
              lineHeight: 1.65,
              maxWidth: 760,
              textAlign: 'center',
            }}
          >
            Your contribution joins the funding pool supporting an initiative —
            we never claim a fixed {os.currency}-per-life conversion. What the
            initiative collectively achieves is reported on the Impact page with
            outputs, outcomes, and evidence, and every taka is traceable on the
            Trust Ledger. “Secured” means signed commitments; cash actually
            received is what the Trust Ledger reports — the two are never
            blurred.
          </p>
        </div>
      </section>

      {/* ── 03 Already a partner ── */}
      <section
        style={{
          padding: '64px 0',
          background: '#fff',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <Display
            light="Already a partner?"
            bold="Your Partner Room is live."
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(24px, 3vw, 34px)',
              lineHeight: 1.25,
            }}
          />
          <p
            style={{
              margin: '0 auto 26px',
              fontSize: 15,
              color: 'var(--gs-ink-50)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            A live window into your partnership — funding deployed, missions
            underway, the people delivering the work, and the evidence behind
            every claim.
          </p>
          <Link
            to="/partner-room"
            className="gs-btn gs-btn--primary gs-btn--lg"
          >
            Open Partner Room →
          </Link>
        </div>
      </section>
    </>
  )
}

/** One funding opportunity: accent rail, funding bar, expected outcomes, what it seeks. */
function OpportunityCard({
  opportunity,
  money,
}: {
  opportunity: OpportunityView
  money: (value: number) => string
}) {
  const color = opportunity.program?.color ?? '#1B7A34'
  const bg = opportunity.program?.bgColor ?? '#f0faf3'
  const light = opportunity.program?.lightColor ?? '#4DC86A'
  const accent = opportunity.urgent ? '#E65100' : light

  return (
    <article className="gs-oppcard" style={{ borderTopColor: accent }}>
      <div className="gs-row" style={{ gap: 8 }}>
        {opportunity.urgent ? (
          <span
            className="gs-tag"
            style={{ background: '#E65100', color: '#fff' }}
          >
            Urgent
          </span>
        ) : null}
        <span
          className="gs-tag gs-tag--program"
          style={{ background: bg, color }}
        >
          <span className="gs-tag__dot" style={{ background: light }} />
          {opportunity.program?.shortName ?? opportunity.programSlug}
        </span>
        <span style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
          {opportunity.whereLabel}
        </span>
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: 21,
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}
      >
        {opportunity.title}
      </h3>

      <div>
        <div
          className="gs-row gs-row--between"
          style={{ gap: 10, marginBottom: 6, alignItems: 'baseline' }}
        >
          <span className="gs-num" style={{ fontSize: 13, fontWeight: 700 }}>
            {money(opportunity.secured)} secured of {money(opportunity.target)}
          </span>
          <span
            className="gs-num"
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: opportunity.urgent ? '#E65100' : '#1B7A34',
            }}
          >
            {money(opportunity.gap)} still seeking partners
          </span>
        </div>
        <div className="gs-capbar" style={{ height: 10 }}>
          <div
            className="gs-capbar__fill"
            style={{
              width: `${opportunity.securedPct}%`,
              background: `linear-gradient(90deg, ${light}, ${color})`,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: 'var(--gs-ink-40)', marginTop: 5 }}>
          {opportunity.securedPct}% funded
        </div>
      </div>

      <div>
        <div className="gs-nearlabel" style={{ marginBottom: 8 }}>
          Expected outcomes · measured &amp; published
        </div>
        <ul className="gs-outcomes">
          {opportunity.expected.map((line) => (
            <li key={line}>
              <span style={{ color: '#1B7A34', fontWeight: 800 }}>›</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="gs-row" style={{ gap: 6 }}>
        {opportunity.seeking.map((item) => (
          <span key={item} className="gs-seekchip">
            {item}
          </span>
        ))}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 11.5,
          color: 'var(--gs-ink-40)',
          lineHeight: 1.55,
        }}
      >
        {opportunity.note}
      </p>

      <div
        className="gs-row"
        style={{ gap: 10, marginTop: 'auto', paddingTop: 6 }}
      >
        <Link
          to="/partner"
          hash="build"
          className="gs-btn"
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '12px 0',
            fontSize: 13,
            fontWeight: 800,
            color: '#fff',
            background: `linear-gradient(135deg, ${light} 0%, ${color} 100%)`,
          }}
        >
          Fund this initiative
        </Link>
        <Link to="/impact" className="gs-btn gs-btn--ghost">
          Past results
        </Link>
      </div>
    </article>
  )
}
