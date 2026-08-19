import { useState } from 'react'
import type { OSModel } from '../../data/os'
import { Pill, Stat } from '../ui'
import { formatMoney, formatShortMoney } from '../../lib/format'
import {
  addDonation,
  setExpenseEvidenceChecked,
  setExpenseStatus,
} from '../../data/actions'
import { rhythmPer30 } from '../../data/os'

export function AdminMoney({ os }: { os: OSModel }) {
  const [recording, setRecording] = useState(false)
  const expenses = os.finance.expenses
    .slice()
    .sort(
      (a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'),
    )
  const commitments = os.data.commitments
  const expectedNext30 = commitments
    .filter((c) => c.status === 'active')
    .reduce((n, c) => n + c.amount * rhythmPer30(c.rhythm), 0)

  return (
    <div className="gs-stack" style={{ gap: 24 }}>
      <div className="gs-grid gs-grid--4">
        <Stat
          gradient
          value={formatShortMoney(os.finance.received, os.currency)}
          label="Received"
        />
        <Stat
          gradient
          value={formatShortMoney(os.finance.allocated, os.currency)}
          label="Allocated"
        />
        <Stat
          gradient
          value={formatShortMoney(os.finance.spent, os.currency)}
          label="Spent"
        />
        <Stat
          gradient
          value={formatShortMoney(os.finance.pending, os.currency)}
          label="Pending approval"
        />
      </div>

      <div className="gs-card gs-card--flat">
        <p className="gs-eyebrow">Commitments</p>
        <div className="gs-row" style={{ gap: 26, marginTop: 12 }}>
          <Stat
            value={String(
              commitments.filter((c) => c.status === 'active').length,
            )}
            label="Active"
          />
          <Stat
            value={String(
              commitments.filter((c) => c.status === 'paused').length,
            )}
            label="Paused"
          />
          <Stat
            value={formatShortMoney(expectedNext30, os.currency)}
            label="Expected in the next 30 days"
            note="Rhythm-normalised, not a promise"
          />
        </div>
      </div>

      <div>
        <div className="gs-row gs-row--between" style={{ marginBottom: 12 }}>
          <p className="gs-eyebrow">Expenses — pending first</p>
          <span className="gs-small gs-muted">
            {os.finance.documentedPct}% of documents checked
          </span>
        </div>
        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Fund</th>
                <th>Documents</th>
                <th className="gs-table__num">Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const fund = os.finance.funds.find(
                  (f) => f.id === expense.fundId,
                )
                return (
                  <tr key={expense.id}>
                    <td>
                      <div className="gs-stack" style={{ gap: 2 }}>
                        <strong className="gs-small">{expense.item}</strong>
                        <span className="gs-small gs-muted">
                          {expense.payee} · {expense.dateLabel}
                        </span>
                      </div>
                    </td>
                    <td className="gs-small">{fund?.projectLabel}</td>
                    <td>
                      {expense.evidence.length ? (
                        <div className="gs-row" style={{ gap: 4 }}>
                          {expense.evidence.map((doc) => (
                            <button
                              key={doc.id}
                              type="button"
                              className="gs-chip"
                              aria-pressed={doc.checked}
                              onClick={() =>
                                void setExpenseEvidenceChecked(
                                  doc.id,
                                  !doc.checked,
                                )
                              }
                            >
                              {doc.checked ? '✓ ' : '○ '}
                              {doc.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <Pill tone="amber">No document attached</Pill>
                      )}
                    </td>
                    <td className="gs-table__num">
                      {formatMoney(expense.amount, os.currency)}
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
                    <td>
                      {expense.status === 'approved' ? (
                        <button
                          type="button"
                          className="gs-btn gs-btn--ghost gs-btn--sm"
                          onClick={() =>
                            void setExpenseStatus(
                              expense.id,
                              'reversed',
                              'Reversed by finance review',
                            )
                          }
                        >
                          Reverse
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="gs-btn gs-btn--primary gs-btn--sm"
                          onClick={() =>
                            void setExpenseStatus(
                              expense.id,
                              'approved',
                              'Documents checked',
                            )
                          }
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="gs-row gs-row--between" style={{ marginBottom: 12 }}>
          <p className="gs-eyebrow">Donations</p>
          <button
            type="button"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            onClick={() => setRecording((v) => !v)}
          >
            {recording ? 'Cancel' : 'Record a donation'}
          </button>
        </div>

        {recording ? (
          <form
            className="gs-card gs-card--flat gs-stack"
            style={{ gap: 12, marginBottom: 16 }}
            onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              void addDonation({
                donorName: String(form.get('donor') ?? ''),
                donorProfileId: null,
                partnerId: null,
                kind: String(form.get('kind') ?? 'Individual'),
                amount: Number(form.get('amount') ?? 0),
                currency: 'BDT',
                dateLabel: new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                method: String(form.get('method') ?? 'Bank transfer'),
                restrictedProgramSlug:
                  String(form.get('restricted') ?? '') || null,
                restrictedChapterId: null,
                receiptRef: `GS-RCP-${new Date().getFullYear()}-M${String(Date.now()).slice(-4)}`,
                acknowledged: false,
              }).then(() => setRecording(false))
            }}
          >
            <div className="gs-grid gs-grid--2">
              <input
                name="donor"
                required
                placeholder="Donor"
                aria-label="Donor"
              />
              <input
                name="amount"
                type="number"
                min={1}
                required
                placeholder="Amount"
                aria-label="Amount"
              />
              <select name="kind" aria-label="Type">
                <option>Individual</option>
                <option>Corporate</option>
                <option>Foundation</option>
                <option>Member commitment</option>
              </select>
              <select name="method" aria-label="Method">
                <option>Bank transfer</option>
                <option>bKash</option>
                <option>Card</option>
                <option>Cheque</option>
              </select>
              <select name="restricted" aria-label="Restricted to">
                <option value="">Unrestricted</option>
                {os.programs
                  .filter((p) => !p.isOperations)
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              className="gs-btn gs-btn--primary"
              style={{ alignSelf: 'flex-start' }}
            >
              Record and issue receipt
            </button>
          </form>
        ) : null}

        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Type</th>
                <th>Restricted to</th>
                <th>Receipt</th>
                <th className="gs-table__num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {os.finance.donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="gs-small">{donation.donorName}</td>
                  <td className="gs-small">{donation.kind}</td>
                  <td className="gs-small">
                    {donation.restrictedProgramSlug
                      ? os.programBySlug.get(donation.restrictedProgramSlug)
                          ?.shortName
                      : 'Unrestricted'}
                  </td>
                  <td className="gs-small gs-muted">{donation.receiptRef}</td>
                  <td className="gs-table__num">
                    {formatMoney(donation.amount, os.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
