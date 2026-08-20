import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import { formatMoney, formatShortMoney } from '../lib/format'
import type { FundView, OSModel } from '../data/os'

/** Trust Ledger — a faithful build of `Trust Ledger.dc.html`. */
export const Route = createFileRoute('/trust')({
  head: () => ({
    meta: [
      { title: 'Trust Ledger — Goodness Society' },
      {
        name: 'description',
        content:
          'Follow every taka from the donation to the outcome — allocation, spending, documents and the impact it supported.',
      },
    ],
  }),
  component: Trust,
})

function Trust() {
  const { os } = useOS()
  const [pick, setPick] = useState<string | null>(null)
  if (!os) return <LoadingState />

  const { finance, currency } = os
  const money = (n: number) => formatMoney(n, currency)
  const short = (n: number) => formatShortMoney(n, currency)
  const selected = pick
    ? (finance.funds.find((f) => f.id === pick) ?? null)
    : null

  return (
    <>
      {/* Hero */}
      <section className="gs-inksection">
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
            Trust Ledger · 2026 year to date
          </span>
          <Display
            as="h1"
            onInk
            light="Follow every taka"
            bold="from the donation to the outcome."
          />

          <div className="gs-cols-4" style={{ gap: 18, marginTop: 30 }}>
            <div className="gs-inkcard">
              <div className="gs-inkcard__label">Received</div>
              <div className="gs-inkcard__value gs-num">
                {short(finance.received)}
              </div>
              <div className="gs-inkcard__note">
                {finance.donations.length} recorded donations
              </div>
            </div>
            <div className="gs-inkcard">
              <div className="gs-inkcard__label">Allocated to funds</div>
              <div className="gs-inkcard__value gs-num">
                {short(finance.allocated)}
              </div>
              <div className="gs-inkcard__note">
                {short(finance.unallocated)} not yet allocated ·{' '}
                {short(finance.budgeted)} budgeted
              </div>
            </div>
            <div className="gs-inkcard">
              <div className="gs-inkcard__label">Accepted into the ledger</div>
              <div
                className="gs-inkcard__value gs-num"
                style={{ color: 'var(--gs-green)' }}
              >
                {short(finance.spent)}
              </div>
              <div className="gs-inkcard__note">
                {short(finance.pending)} recorded, awaiting review
              </div>
            </div>
            <div className="gs-inkcard">
              <div className="gs-inkcard__label">Programme spending</div>
              <div className="gs-inkcard__value gs-num">
                {finance.programSharePct}%
              </div>
              <div className="gs-inkcard__note">
                Operations &amp; administration {finance.overheadPct}% of
                accepted spending
              </div>
            </div>
          </div>

          <div
            className="gs-row"
            style={{
              gap: 10,
              marginTop: 26,
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            <span className="gs-row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--gs-green)',
                }}
              />
              {finance.documentedPct}% of accepted spending has a document
              attached · {finance.checkedPct}% fully checked by our team
            </span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span>
              Figures cover 1 Jan – 31 Aug 2026. Received is cash in; allocated
              is money formally assigned to a fund; budget is what a programme
              plans to spend; accepted spending (shown as “accepted” on every
              fund and expense) is money already incurred and signed off. These
              are our own books, reviewed internally and audited annually.
            </span>
          </div>
        </div>
      </section>

      {/* Step 1 — allocation */}
      <section style={{ padding: '56px 0 24px', background: '#fff' }}>
        <div className="gs-wrap">
          <p className="gs-sectionlabel" style={{ marginBottom: 10 }}>
            Step 1 · Allocation
          </p>
          <Display
            variant="minor"
            light="Where the money"
            bold="is committed"
          />
          <p className="gs-sub" style={{ margin: '8px 0 26px', maxWidth: 640 }}>
            Click a fund to see its budget, every expense against it, the
            documents behind each one, and the impact record it supported.
          </p>

          <div className="gs-stack" style={{ gap: 10 }}>
            {finance.funds.map((fund) => {
              const color = fund.program?.isOperations
                ? '#6B7280'
                : (fund.program?.color ?? '#1B7A34')
              const on = pick === fund.id
              return (
                <button
                  key={fund.id}
                  type="button"
                  className="gs-progrow"
                  aria-pressed={on}
                  onClick={() => setPick(on ? null : fund.id)}
                >
                  <div
                    className="gs-progrow__rail"
                    style={{ background: color, height: 38 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>
                      {fund.program?.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        marginTop: 2,
                      }}
                    >
                      {fund.projectLabel} · {fund.expenses.length}{' '}
                      {fund.expenses.length === 1 ? 'expense' : 'expenses'} ·{' '}
                      {fund.withDocs} with documents
                      {fund.missingDocs ? `, ${fund.missingDocs} missing` : ''}
                      {fund.fundingGap
                        ? ` · funding gap ${short(fund.fundingGap)}`
                        : ''}
                    </div>
                  </div>
                  <div style={{ width: 230, flexShrink: 0 }}>
                    <div
                      className="gs-row gs-row--between"
                      style={{
                        fontSize: 11.5,
                        color: 'var(--gs-ink-50)',
                        marginBottom: 5,
                      }}
                    >
                      <span>{short(fund.spent)} accepted</span>
                      <span>{fund.spentPct}%</span>
                    </div>
                    <div
                      className="gs-progrow__bar"
                      style={{ width: '100%', height: 9 }}
                    >
                      <div
                        className="gs-progrow__fill"
                        style={{
                          width: `${fund.spentPct}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{ width: 118, textAlign: 'right', flexShrink: 0 }}
                  >
                    <div
                      style={{ fontSize: 16, fontWeight: 800 }}
                      className="gs-num"
                    >
                      {short(fund.budget)}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--gs-ink-40)' }}>
                      budget
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {on ? '✓' : '→'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Steps 2 and 3 — spending and what it supported */}
      <section style={{ padding: '24px 0 72px', background: '#fff' }}>
        <div className="gs-wrap">
          {selected ? (
            <FundDrill fund={selected} os={os} onClose={() => setPick(null)} />
          ) : (
            <div className="gs-hint">
              Pick a fund above to follow the money through to the work it paid
              for.
            </div>
          )}
        </div>
      </section>

      {/* Money in */}
      <section
        style={{
          padding: '56px 0 72px',
          background: 'var(--gs-mist)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="gs-wrap">
          <p className="gs-sectionlabel" style={{ marginBottom: 10 }}>
            Money in
          </p>
          <Display
            variant="minor"
            light="Every donation"
            bold="we have recorded"
          />
          <div className="gs-donationtable" style={{ marginTop: 24 }}>
            <div className="gs-donationhead">
              <div>Donor</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Restricted to</div>
              <div>Receipt issued</div>
            </div>
            {finance.donations.map((donation) => (
              <div key={donation.id} className="gs-donationrow">
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {donation.donorName}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                    {donation.kind} · {donation.method}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                  }}
                  className="gs-num"
                >
                  {money(donation.amount)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                  {donation.dateLabel}
                </div>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  {donation.restrictedProgramSlug
                    ? (os.programBySlug.get(donation.restrictedProgramSlug)
                        ?.name ?? donation.restrictedProgramSlug)
                    : 'Unrestricted'}
                </div>
                <div
                  style={{ fontSize: 11.5, color: 'var(--gs-ink-50)' }}
                  className="gs-num"
                >
                  {donation.receiptRef ?? '—'}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              margin: '16px 0 0',
              fontSize: 11.5,
              color: 'var(--gs-ink-40)',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Individual donors are listed by the name they gave us; anyone may
            ask to appear as an anonymous donor and we never publish personal
            contact details. Every gift carries the receipt reference issued for
            it. Restricted gifts can only be spent on the programme named.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section
        style={{
          padding: '64px 0',
          background: '#fff',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="gs-centreband__inner">
          <Display
            variant="minor"
            light="Fund a mission and"
            bold="watch it move through this page."
          />
          <p
            style={{
              margin: '14px auto 26px',
              fontSize: 15,
              color: 'var(--gs-ink-50)',
              maxWidth: 500,
              lineHeight: 1.7,
            }}
          >
            Your gift is recorded here, allocated to a fund, spent against
            documented invoices, and tied to the impact record it supported.
          </p>
          <div className="gs-row" style={{ gap: 12, justifyContent: 'center' }}>
            <Link to="/partner" className="gs-btn gs-btn--primary gs-btn--md">
              Fund this work
            </Link>
            <Link to="/impact" className="gs-btn gs-btn--soft gs-btn--md">
              See the impact
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function FundDrill({
  fund,
  os,
  onClose,
}: {
  fund: FundView
  os: OSModel
  onClose: () => void
}) {
  const money = (n: number) => formatMoney(n, os.currency)
  const supported = os.publishedImpact.filter(
    (r) => r.programSlug === fund.programSlug,
  )

  return (
    <div className="gs-drill" id={fund.id}>
      <div className="gs-drill__head">
        <div style={{ flex: 1, minWidth: 240 }}>
          <p
            className="gs-minilabel"
            style={{ margin: '0 0 6px', letterSpacing: '0.16em' }}
          >
            Step 2 · Spending
          </p>
          <h3 style={{ margin: '0 0 3px', fontSize: 21, fontWeight: 800 }}>
            {fund.program?.name}
          </h3>
          <div style={{ fontSize: 12.5, color: 'var(--gs-ink-50)' }}>
            {fund.projectLabel} ·{' '}
            {fund.restricted
              ? `${money(fund.restricted)} received as restricted gifts · ${money(fund.restrictedRemaining)} restricted balance remaining`
              : 'Funded from unrestricted giving'}
          </div>
          {fund.fundingGap ? (
            <div
              style={{
                fontSize: 12,
                color: '#E65100',
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              Budget exceeds allocated funds by {money(fund.fundingGap)} — this
              programme is still seeking funding.
            </div>
          ) : null}
        </div>

        <div className="gs-row" style={{ gap: 26 }}>
          <div>
            <div className="gs-drill__figlabel">Budget</div>
            <div className="gs-drill__figure gs-num">{money(fund.budget)}</div>
          </div>
          <div>
            <div className="gs-drill__figlabel">Allocated</div>
            <div className="gs-drill__figure gs-num">
              {money(fund.allocated)}
            </div>
          </div>
          <div>
            <div className="gs-drill__figlabel">Accepted spending</div>
            <div
              className="gs-drill__figure gs-num"
              style={{ color: 'var(--gs-green-deep)' }}
            >
              {money(fund.spent)}
            </div>
          </div>
          <div>
            <div className="gs-drill__figlabel">Unspent allocation</div>
            <div className="gs-drill__figure gs-num">
              {money(fund.remaining)}
            </div>
          </div>
          {fund.fundingGap ? (
            <div>
              <div className="gs-drill__figlabel" style={{ color: '#E65100' }}>
                Funding gap
              </div>
              <div
                className="gs-drill__figure gs-num"
                style={{ color: '#E65100' }}
              >
                {money(fund.fundingGap)}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="gs-filter"
          style={{ padding: '8px 16px' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div style={{ padding: '0 26px 8px' }}>
        <div className="gs-ledgerhead">
          <div>Expense</div>
          <div>Amount</div>
          <div>Payee &amp; date</div>
          <div>Documents</div>
          <div>Ledger status</div>
        </div>
        {fund.expenses.map((expense) => {
          const record = expense.impactRecordId
            ? os.impactById.get(expense.impactRecordId)
            : undefined
          const published = record?.published ? record : undefined
          return (
            <div key={expense.id} className="gs-ledgerrow">
              <div style={{ minWidth: 0 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}
                >
                  {expense.item}
                </div>
                {published ? (
                  <Link
                    to="/impact"
                    hash={published.id}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      marginTop: 3,
                      display: 'inline-block',
                    }}
                  >
                    Supported: {published.title} →
                  </Link>
                ) : null}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
                className="gs-num"
              >
                {money(expense.amount)}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--gs-ink-50)',
                  minWidth: 0,
                }}
              >
                {expense.payee}
                <br />
                {expense.dateLabel}
              </div>
              <div className="gs-row" style={{ gap: 5 }}>
                {expense.evidence.map((doc) => (
                  <span
                    key={doc.id}
                    className={`gs-docchip ${doc.checked ? 'gs-docchip--checked' : ''}`}
                  >
                    <span
                      style={{
                        color: doc.checked ? '#1B7A34' : '#6B7280',
                        fontWeight: 800,
                      }}
                    >
                      {doc.checked ? '✓' : '○'}
                    </span>
                    {doc.label}
                    <span
                      style={{
                        color: doc.checked ? '#1B7A34' : '#6B7280',
                        fontSize: 9,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {doc.checked ? 'checked' : 'attached'}
                    </span>
                  </span>
                ))}
                {expense.evidence.length === 0 ? (
                  <span
                    style={{ fontSize: 11, color: '#E65100', fontWeight: 600 }}
                  >
                    No document yet
                  </span>
                ) : null}
              </div>
              <div>
                <span
                  className="gs-tag"
                  style={{
                    letterSpacing: '0.06em',
                    background:
                      expense.status === 'approved' ? '#f0faf3' : '#fff3e0',
                    color:
                      expense.status === 'approved' ? '#1B7A34' : '#E65100',
                  }}
                >
                  {expense.status === 'approved'
                    ? 'Accepted'
                    : 'Awaiting review'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {supported.length ? (
        <div className="gs-supported">
          <p
            className="gs-minilabel gs-minilabel--green"
            style={{ margin: '0 0 6px', letterSpacing: '0.16em' }}
          >
            Step 3 · This spending supported
          </p>
          <div className="gs-stack" style={{ gap: 12 }}>
            {supported.map((record) => {
              const best =
                record.outcomes.find((o) => o.basis === 'verified') ??
                record.outcomes[0]
              return (
                <div
                  key={record.id}
                  className="gs-row"
                  style={{ gap: 14, alignItems: 'flex-start' }}
                >
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {record.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        marginTop: 2,
                      }}
                    >
                      {record.primaryValue} {record.unitLabel} ·{' '}
                      {record.evidenceVerified}/{record.evidenceTotal} documents
                      verified
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#374151',
                      flex: 1.2,
                      minWidth: 240,
                      lineHeight: 1.55,
                    }}
                  >
                    {best
                      ? best.value == null
                        ? `${best.label} — awaiting measurement`
                        : `${best.value} · ${best.label} (${best.basis})`
                      : 'Outcomes not yet recorded'}
                  </div>
                  <Link
                    to="/impact"
                    hash={record.id}
                    style={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                  >
                    Full record →
                  </Link>
                </div>
              )
            })}
          </div>
          <p
            style={{
              margin: '14px 0 0',
              fontSize: 11,
              color: 'var(--gs-ink-50)',
              lineHeight: 1.55,
            }}
          >
            This fund supported the work above; the recorded impact is not a
            conversion of taka into outcomes. Volunteers, partners, and
            participants’ own effort all contributed.
          </p>
        </div>
      ) : null}
    </div>
  )
}
