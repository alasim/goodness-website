import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Banner, Bar, Pill, Section, Stat } from '../components/ui'
import { addDonation } from '../data/actions'
import { formatShortMoney } from '../lib/format'
import type { OpportunityView } from '../data/os'

export const Route = createFileRoute('/fund')({
  head: () => ({
    meta: [
      { title: 'Fund Impact — Goodness Society' },
      {
        name: 'description',
        content:
          'Fund an initiative, not a donation shop. Contributions join a pool, and results are reported collectively with evidence.',
      },
    ],
  }),
  component: FundImpact,
})

function FundImpact() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const open = os.opportunities.filter((o) => !o.funded)
  const funded = os.opportunities.filter((o) => o.funded)
  const totalGap = open.reduce((n, o) => n + o.gap, 0)

  return (
    <>
      <PageHero
        eyebrow="Impact marketplace"
        title="Fund an initiative, not a transaction"
        lede="Each initiative below names what it will do, what it still needs, and what will be measured afterwards. Contributions join a pool, and the results are reported collectively — we never claim a specific amount bought a specific outcome."
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={String(open.length)}
            label="Initiatives seeking support"
          />
          <Stat
            gradient
            value={formatShortMoney(totalGap, os.currency)}
            label="Still needed across all of them"
          />
          <Stat
            gradient
            value={String(os.stats.partners)}
            label="Partners already in"
          />
          <Stat
            gradient
            value={`${os.finance.programSharePct}%`}
            label="Of spend goes to programmes"
          />
        </div>
      </Section>

      <Section>
        <div className="gs-stack" style={{ gap: 20 }}>
          {open.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>

        {funded.length ? (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ marginBottom: 14 }}>Fully funded</h2>
            <div className="gs-grid gs-grid--2">
              {funded.map((opportunity) => (
                <div key={opportunity.id} className="gs-card gs-card--wash">
                  <Pill tone="green">Funded</Pill>
                  <h3 style={{ marginTop: 10, fontSize: 18 }}>
                    {opportunity.title}
                  </h3>
                  <p className="gs-small gs-muted" style={{ marginTop: 6 }}>
                    {opportunity.whereLabel} · now in delivery. Results will
                    appear as published impact records.
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Section>
    </>
  )
}

function OpportunityCard({ opportunity }: { opportunity: OpportunityView }) {
  const { os } = useOS()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!os) return null

  const support = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    try {
      await addDonation({
        donorName: String(form.get('donor') ?? 'Anonymous donor'),
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
        method: 'Pledged through Fund Impact',
        restrictedProgramSlug: opportunity.programSlug,
        restrictedChapterId: null,
        receiptRef: `GS-RCP-${new Date().getFullYear()}-F${String(Date.now()).slice(-4)}`,
        acknowledged: false,
      })
      setDone(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="gs-card gs-card--flat">
      <div
        className="gs-row gs-row--between"
        style={{ alignItems: 'flex-start', gap: 18 }}
      >
        <div className="gs-stack" style={{ gap: 10, flex: 1, minWidth: 260 }}>
          <div className="gs-row" style={{ gap: 6 }}>
            {opportunity.urgent ? <Pill tone="amber">Urgent</Pill> : null}
            <Pill tone="blue">{opportunity.program?.shortName}</Pill>
            <Pill>{opportunity.whereLabel}</Pill>
          </div>
          <h3 style={{ fontSize: 23 }}>{opportunity.title}</h3>
          <p className="gs-small gs-muted">{opportunity.note}</p>
        </div>
        <div className="gs-stack" style={{ gap: 6, minWidth: 200 }}>
          <Stat
            value={formatShortMoney(opportunity.gap, os.currency)}
            label="Still needed"
          />
          <Bar
            pct={opportunity.securedPct}
            tone={opportunity.urgent ? 'amber' : 'green'}
            label={opportunity.title}
          />
          <span className="gs-small gs-muted">
            {formatShortMoney(opportunity.secured, os.currency)} of{' '}
            {formatShortMoney(opportunity.target, os.currency)} secured (
            {opportunity.securedPct}%)
          </span>
        </div>
      </div>

      <div className="gs-grid gs-grid--2" style={{ marginTop: 22 }}>
        <div className="gs-stack" style={{ gap: 8 }}>
          <p className="gs-eyebrow">What we are seeking</p>
          {opportunity.seeking.map((item) => (
            <span key={item} className="gs-small">
              · {item}
            </span>
          ))}
        </div>
        <div className="gs-stack" style={{ gap: 8 }}>
          <p className="gs-eyebrow">What will be measured</p>
          {opportunity.expected.map((item) => (
            <span key={item} className="gs-small">
              · {item}
            </span>
          ))}
        </div>
      </div>

      <div className="gs-row" style={{ gap: 10, marginTop: 20 }}>
        <button
          type="button"
          className="gs-btn gs-btn--primary gs-btn--sm"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Support this initiative'}
        </button>
        <Link to="/partner" className="gs-btn gs-btn--ghost gs-btn--sm">
          Talk to the partnerships team
        </Link>
        <Link to="/trust" className="gs-btn gs-btn--ghost gs-btn--sm">
          See how funds are spent
        </Link>
      </div>

      {open ? (
        done ? (
          <Banner>
            Recorded. Your contribution appears in the Trust Ledger with its
            receipt reference, restricted to {opportunity.program?.name}.
          </Banner>
        ) : (
          <form
            className="gs-stack"
            style={{ gap: 12, marginTop: 18, maxWidth: 520 }}
            onSubmit={(e) => void support(e)}
          >
            <div className="gs-grid gs-grid--2">
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  Name to record
                </span>
                <input
                  name="donor"
                  required
                  placeholder="Person or organisation"
                />
              </label>
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  Amount ({os.currency})
                </span>
                <input
                  name="amount"
                  type="number"
                  min={1}
                  required
                  defaultValue={5000}
                />
              </label>
            </div>
            <label className="gs-stack" style={{ gap: 6 }}>
              <span className="gs-small" style={{ fontWeight: 600 }}>
                Type
              </span>
              <select name="kind" defaultValue="Individual">
                <option>Individual</option>
                <option>Corporate</option>
                <option>Foundation</option>
                <option>In-kind (estimated)</option>
              </select>
            </label>
            <Banner variant="info">
              This records a pledge against the initiative and restricts it to{' '}
              {opportunity.program?.name}. Restricted money can only be spent
              there — the ledger enforces it.
            </Banner>
            <button
              type="submit"
              className="gs-btn gs-btn--primary"
              disabled={busy}
              style={{ alignSelf: 'flex-start' }}
            >
              {busy ? 'Recording…' : 'Record this pledge'}
            </button>
          </form>
        )
      ) : null}
    </article>
  )
}
