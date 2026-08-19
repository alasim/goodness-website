import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Bar, Pill, Section, Stat } from '../components/ui'
import { formatMoney, formatShortMoney } from '../lib/format'
import type { FundView } from '../data/os'

export const Route = createFileRoute('/trust')({
  head: () => ({
    meta: [
      { title: 'Trust Ledger — Goodness Society' },
      {
        name: 'description',
        content:
          'Follow the money: what came in, what was allocated, what was spent, on what, with what documents, and what it supported.',
      },
    ],
  }),
  component: Trust,
})

function Trust() {
  const { os } = useOS()
  const [openFund, setOpenFund] = useState<string | null>(null)
  if (!os) return <LoadingState />
  const { finance, currency } = os

  return (
    <>
      <PageHero
        eyebrow="Trust Ledger"
        title="Follow the money"
        lede="Received, allocated, spent — three different numbers, never blurred into one. Open any fund to see every expense, every document, and the published work it supported."
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatShortMoney(finance.received, currency)}
            label="Received"
            note="Cash in from donations"
          />
          <Stat
            gradient
            value={formatShortMoney(finance.allocated, currency)}
            label="Allocated to funds"
            note={
              finance.unallocated
                ? `${formatShortMoney(finance.unallocated, currency)} not yet allocated`
                : 'Fully allocated'
            }
          />
          <Stat
            gradient
            value={formatShortMoney(finance.spent, currency)}
            label="Spent and approved"
          />
          <Stat
            gradient
            value={formatShortMoney(finance.pending, currency)}
            label="Pending approval"
            note="Incurred, not yet in the ledger"
          />
        </div>
      </Section>

      <Section>
        <div className="gs-card gs-card--flat" style={{ marginBottom: 24 }}>
          <div className="gs-row gs-row--between" style={{ marginBottom: 12 }}>
            <p className="gs-eyebrow">The chain</p>
            <span className="gs-small gs-muted">
              {finance.programSharePct}% programmes · {finance.overheadPct}%
              operations · {finance.documentedPct}% of documents checked
            </span>
          </div>
          <Bar
            pct={(finance.allocated / Math.max(1, finance.received)) * 100}
            tall
            label="Allocated share of received"
          />
          <div className="gs-row gs-row--between" style={{ marginTop: 8 }}>
            <span className="gs-small gs-muted">Allocated of received</span>
            <span className="gs-small gs-num">
              {formatMoney(finance.allocated, currency)} of{' '}
              {formatMoney(finance.received, currency)}
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Bar
              pct={(finance.spent / Math.max(1, finance.allocated)) * 100}
              tall
              tone="blue"
              label="Spent share of allocated"
            />
            <div className="gs-row gs-row--between" style={{ marginTop: 8 }}>
              <span className="gs-small gs-muted">Spent of allocated</span>
              <span className="gs-small gs-num">
                {formatMoney(finance.spent, currency)} of{' '}
                {formatMoney(finance.allocated, currency)}
              </span>
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: 16 }}>Funds</h2>
        <div className="gs-stack" style={{ gap: 14 }}>
          {finance.funds.map((fund) => (
            <FundRow
              key={fund.id}
              fund={fund}
              open={openFund === fund.id}
              onToggle={() =>
                setOpenFund(openFund === fund.id ? null : fund.id)
              }
            />
          ))}
        </div>
      </Section>

      <Section variant="mist">
        <h2 style={{ marginBottom: 6 }}>Every donation on the record</h2>
        <p className="gs-small gs-muted" style={{ marginBottom: 18 }}>
          Restricted gifts can only be spent in the programme they name.
          Unrestricted gifts are what let us respond when something urgent
          happens.
        </p>
        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Type</th>
                <th>Date</th>
                <th>Restricted to</th>
                <th>Receipt</th>
                <th className="gs-table__num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {finance.donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.donorName}</td>
                  <td>{donation.kind}</td>
                  <td>{donation.dateLabel}</td>
                  <td>
                    {donation.restrictedProgramSlug ? (
                      <Pill tone="blue">
                        {
                          os.programBySlug.get(donation.restrictedProgramSlug)
                            ?.shortName
                        }
                      </Pill>
                    ) : (
                      <Pill>Unrestricted</Pill>
                    )}
                  </td>
                  <td className="gs-small gs-muted">
                    {donation.receiptRef ?? '—'}
                  </td>
                  <td className="gs-table__num">
                    {formatMoney(donation.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}

function FundRow({
  fund,
  open,
  onToggle,
}: {
  fund: FundView
  open: boolean
  onToggle: () => void
}) {
  const { os } = useOS()
  if (!os) return null
  const currency = os.currency
  const supported = os.publishedImpact.filter((record) =>
    fund.expenses.some((expense) => expense.impactRecordId === record.id),
  )

  return (
    <div className="gs-card gs-card--flat" id={fund.id}>
      <div
        className="gs-row gs-row--between"
        style={{ gap: 16, alignItems: 'flex-start' }}
      >
        <div className="gs-stack" style={{ gap: 6, flex: 1, minWidth: 240 }}>
          <div className="gs-row" style={{ gap: 6 }}>
            <Pill tone={fund.program?.isOperations ? 'neutral' : 'green'}>
              {fund.program?.shortName}
            </Pill>
            {fund.fundingGap > 0 ? (
              <Pill tone="amber">
                {formatShortMoney(fund.fundingGap, currency)} funding gap
              </Pill>
            ) : null}
            {fund.pending > 0 ? (
              <Pill tone="blue">
                {formatShortMoney(fund.pending, currency)} pending
              </Pill>
            ) : null}
          </div>
          <h3 style={{ fontSize: 19 }}>{fund.projectLabel}</h3>
          <div className="gs-row" style={{ gap: 18 }}>
            <span className="gs-small gs-muted">
              Allocated{' '}
              <strong className="gs-num">
                {formatShortMoney(fund.allocated, currency)}
              </strong>
            </span>
            <span className="gs-small gs-muted">
              Spent{' '}
              <strong className="gs-num">
                {formatShortMoney(fund.spent, currency)}
              </strong>
            </span>
            <span className="gs-small gs-muted">
              Documents checked{' '}
              <strong>
                {fund.documentsChecked}/{fund.documents}
              </strong>
            </span>
          </div>
          <Bar pct={fund.spentPct} label={fund.projectLabel ?? fund.id} />
        </div>
        <button
          type="button"
          className="gs-btn gs-btn--ghost gs-btn--sm"
          onClick={onToggle}
          aria-expanded={open}
        >
          {open ? 'Hide expenses' : `Show ${fund.expenses.length} expenses`}
        </button>
      </div>

      {open ? (
        <>
          <div className="gs-table-wrap" style={{ marginTop: 18 }}>
            <table className="gs-table">
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Payee</th>
                  <th>Date</th>
                  <th>Documents</th>
                  <th>Status</th>
                  <th className="gs-table__num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fund.expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.item}</td>
                    <td>{expense.payee}</td>
                    <td>{expense.dateLabel}</td>
                    <td>
                      {expense.evidence.length ? (
                        <div className="gs-row" style={{ gap: 4 }}>
                          {expense.evidence.map((doc) => (
                            <Pill
                              key={doc.id}
                              tone={doc.checked ? 'green' : 'neutral'}
                              title={
                                doc.checked
                                  ? 'Checked by our team'
                                  : 'Attached, not yet checked'
                              }
                            >
                              {doc.checked ? '✓' : '○'} {doc.label}
                            </Pill>
                          ))}
                        </div>
                      ) : (
                        <Pill tone="amber">No document attached</Pill>
                      )}
                    </td>
                    <td>
                      <Pill
                        tone={
                          expense.status === 'approved'
                            ? 'green'
                            : expense.status === 'pending'
                              ? 'amber'
                              : 'red'
                        }
                      >
                        {expense.status}
                      </Pill>
                    </td>
                    <td className="gs-table__num">
                      {formatMoney(expense.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {supported.length ? (
            <div style={{ marginTop: 18 }}>
              <p className="gs-eyebrow">What this fund supported</p>
              <div className="gs-stack" style={{ gap: 8, marginTop: 10 }}>
                {supported.map((record) => (
                  <Link
                    key={record.id}
                    to="/impact"
                    hash={record.id}
                    className="gs-row gs-row--between"
                  >
                    <span className="gs-small">{record.title}</span>
                    <span className="gs-small gs-muted">
                      {record.primaryValue} {record.unitLabel}
                    </span>
                  </Link>
                ))}
              </div>
              <p className="gs-small gs-muted" style={{ marginTop: 10 }}>
                This fund supported the work above alongside volunteer time and,
                in some cases, other funders. It is not the sole cause of the
                outcomes recorded there.
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
