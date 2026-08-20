import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Bar, Pill, Section, Stat } from '../components/ui'
import { formatNumber, formatShortMoney } from '../lib/format'

export const Route = createFileRoute('/transparency')({
  head: () => ({
    meta: [
      { title: 'Transparency — Goodness Society' },
      {
        name: 'description',
        content:
          'The yearly summary: money in, money out, people supported, and how much of it has been checked.',
      },
    ],
  }),
  component: Transparency,
})

function Transparency() {
  const { os } = useOS()
  if (!os) return <LoadingState />
  const { finance, currency } = os

  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="The year, in one page"
        lede="A summary you can read in two minutes, with a link on every figure to the record it came from. Nothing here is a rounded-up headline."
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatShortMoney(finance.received, currency)}
            label="Received"
          />
          <Stat
            gradient
            value={formatShortMoney(finance.spent, currency)}
            label="Spent and approved"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.peopleSupported)}
            label="People supported"
            note="Published records only"
          />
          <Stat
            gradient
            value={`${finance.documentedPct}%`}
            label="Expense documents checked"
          />
        </div>
      </Section>

      <Section>
        <h2 style={{ marginBottom: 18 }}>Where the money went</h2>
        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Fund</th>
                <th>Programme</th>
                <th className="gs-table__num">Allocated</th>
                <th className="gs-table__num">Spent</th>
                <th className="gs-table__num">Pending</th>
                <th className="gs-table__num">Documents checked</th>
              </tr>
            </thead>
            <tbody>
              {finance.funds.map((fund) => (
                <tr key={fund.id}>
                  <td>
                    <Link to="/trust" hash={fund.id}>
                      {fund.projectLabel}
                    </Link>
                  </td>
                  <td>{fund.program?.shortName ?? fund.programSlug}</td>
                  <td className="gs-table__num">
                    {formatShortMoney(fund.allocated, currency)}
                  </td>
                  <td className="gs-table__num">
                    {formatShortMoney(fund.spent, currency)}
                  </td>
                  <td className="gs-table__num">
                    {fund.pending
                      ? formatShortMoney(fund.pending, currency)
                      : '—'}
                  </td>
                  <td className="gs-table__num">
                    {fund.documentsChecked}/{fund.documents}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="gs-small gs-muted" style={{ marginTop: 12 }}>
          Programme spend {finance.programSharePct}% · operations{' '}
          {finance.overheadPct}%. Pending expenses are incurred but not yet
          approved into the ledger, so they are shown separately.
        </p>
      </Section>

      <Section variant="mist">
        <h2 style={{ marginBottom: 18 }}>What we can evidence</h2>
        <div className="gs-grid gs-grid--2">
          {os.publishedImpact.map((record) => (
            <div key={record.id} className="gs-card gs-card--flat gs-stack">
              <div className="gs-row" style={{ gap: 6 }}>
                <Pill tone="green">{record.program?.shortName}</Pill>
                <Pill>{record.dateLabel}</Pill>
              </div>
              <h3 style={{ fontSize: 18 }}>{record.title}</h3>
              <div className="gs-row gs-row--between">
                <span className="gs-small gs-muted">
                  {formatNumber(record.primaryValue)} {record.unitLabel}
                </span>
                <span className="gs-small">
                  {record.evidenceVerified}/{record.evidenceTotal} evidence
                  checked
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
        <Link
          to="/impact"
          className="gs-btn gs-btn--ghost gs-btn--sm"
          style={{ marginTop: 20 }}
        >
          Read the full impact page
        </Link>
      </Section>

      <Section>
        <div className="gs-card gs-card--wash">
          <p className="gs-eyebrow">How to read this page</p>
          <ul
            className="gs-small"
            style={{
              color: 'var(--gs-ink-70)',
              marginTop: 12,
              paddingLeft: 20,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>Received</strong> is cash in. <strong>Allocated</strong>{' '}
              is money formally assigned to a fund. <strong>Spent</strong> is
              expenses approved into the ledger. They are different numbers and
              we never blur them.
            </li>
            <li>
              A published impact record can still have evidence pending. We show
              that ratio rather than waiting for a perfect story.
            </li>
            <li>
              Where funding supported work alongside other funders, we say
              “supported by this fund” — not “caused by this fund”.
            </li>
          </ul>
        </div>
      </Section>
    </>
  )
}
