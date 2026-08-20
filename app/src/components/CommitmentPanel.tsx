import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  contributeNow,
  saveCommitment,
  setCommitmentStatus,
} from '../data/actions'
import { formatMoney, formatNumber } from '../lib/format'
import { Banner, Bar, Pill } from './ui'
import type { OSModel, VolunteerView } from '../data/os'
import type { CommitmentDestination, CommitmentRhythm } from '../lib/types'

const AMOUNTS = [10, 25, 50, 100, 250, 500]
const RHYTHMS: Array<CommitmentRhythm> = [
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Monthly',
]

/**
 * The Goodness Commitment: a voluntary sustaining contribution. Never a fee, never a gate.
 * Pausing preserves history and never downgrades recognition, and the amount is never public.
 */
export function CommitmentPanel({
  os,
  person,
}: {
  os: OSModel
  person: VolunteerView
}) {
  const commitment = os.data.commitments.find((c) => c.profileId === person.id)
  const contributions = commitment
    ? os.data.commitmentContributions.filter(
        (c) => c.commitmentId === commitment.id,
      )
    : []
  const [amount, setAmount] = useState(commitment?.amount ?? 50)
  const [custom, setCustom] = useState('')
  const [rhythm, setRhythm] = useState<CommitmentRhythm>(
    commitment?.rhythm ?? 'Monthly',
  )
  const [destination, setDestination] = useState<CommitmentDestination>(
    commitment?.destination ?? 'unrestricted',
  )
  const [badge, setBadge] = useState(commitment?.badgeOptIn ?? false)
  const [busy, setBusy] = useState(false)

  const stats = {
    active: os.data.commitments.filter((c) => c.status === 'active').length,
    total: contributions.reduce((n, c) => n + c.amount, 0),
  }

  const submit = async () => {
    setBusy(true)
    try {
      await saveCommitment({
        profileId: person.id,
        amount: Number(custom || amount),
        rhythm,
        destination,
        destinationChapterId:
          destination === 'chapter' ? person.chapterId : null,
        destinationProgramSlug:
          destination === 'program' ? person.programSlug : null,
        badgeOptIn: badge,
      })
    } finally {
      setBusy(false)
    }
  }

  if (commitment && commitment.status !== 'ended') {
    const paused = commitment.status === 'paused'
    return (
      <div className="gs-card gs-card--flat gs-stack">
        <div className="gs-row gs-row--between">
          <p className="gs-eyebrow">Goodness Commitment</p>
          <Pill tone={paused ? 'neutral' : 'green'}>
            {paused ? 'Paused' : 'You’re sustaining Goodness'}
          </Pill>
        </div>
        <h3 style={{ fontSize: 20 }}>
          {commitment.rhythm} · {formatMoney(commitment.amount, os.currency)}
        </h3>
        <p className="gs-small gs-muted">
          {contributions.length} contributions so far,{' '}
          {formatMoney(stats.total, os.currency)} in total. Every one of them
          appears in the Trust Ledger with its own receipt.
        </p>

        <div className="gs-row" style={{ gap: 4 }}>
          {contributions.slice(-24).map((c) => (
            <span
              key={c.id}
              title={new Date(c.contributedAt).toLocaleDateString()}
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: 'var(--gs-gradient)',
                display: 'inline-block',
              }}
            />
          ))}
          {contributions.length === 0 ? (
            <span className="gs-small gs-muted">
              No contributions recorded yet.
            </span>
          ) : null}
        </div>

        <div className="gs-row" style={{ gap: 8, marginTop: 6 }}>
          {!paused ? (
            <button
              type="button"
              className="gs-btn gs-btn--primary gs-btn--sm"
              disabled={busy}
              onClick={() => {
                setBusy(true)
                void contributeNow(
                  commitment,
                  person.fullName,
                  contributions.length,
                ).finally(() => setBusy(false))
              }}
            >
              Contribute now
            </button>
          ) : null}
          <button
            type="button"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            disabled={busy}
            onClick={() =>
              void setCommitmentStatus(
                commitment.id,
                paused ? 'active' : 'paused',
              )
            }
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            onClick={() => void setCommitmentStatus(commitment.id, 'ended')}
          >
            Change or stop
          </button>
        </div>

        {paused ? (
          <Banner>
            Paused, with your history preserved. Nothing is lost and nothing is
            downgraded — resume whenever it suits you.
          </Banner>
        ) : null}

        <p className="gs-small gs-muted">
          {formatNumber(stats.active)} members sustaining. Small commitments.
          One strong movement.
        </p>
        <Link to="/trust" className="gs-small" style={{ fontWeight: 700 }}>
          See where it goes →
        </Link>
      </div>
    )
  }

  return (
    <div className="gs-card gs-card--flat gs-stack">
      <p className="gs-eyebrow">Goodness Commitment</p>
      <h3 style={{ fontSize: 20 }}>Sustain the movement</h3>
      <p className="gs-small gs-muted">
        A voluntary contribution on a rhythm that suits you. It is never a
        membership fee, it never gates anything, and the amount is never shown
        publicly.
      </p>

      <div className="gs-row" style={{ gap: 6 }}>
        {AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            className="gs-chip"
            aria-pressed={!custom && amount === value}
            onClick={() => {
              setAmount(value)
              setCustom('')
            }}
          >
            {formatMoney(value, os.currency)}
          </button>
        ))}
        <input
          type="number"
          min={1}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom"
          aria-label="Custom amount"
          style={{ width: 110 }}
        />
      </div>

      <div className="gs-row" style={{ gap: 6 }}>
        {RHYTHMS.map((value) => (
          <button
            key={value}
            type="button"
            className="gs-chip"
            aria-pressed={rhythm === value}
            onClick={() => setRhythm(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="gs-row" style={{ gap: 6 }}>
        <button
          type="button"
          className="gs-chip"
          aria-pressed={destination === 'unrestricted'}
          onClick={() => setDestination('unrestricted')}
        >
          Wherever it is needed most
        </button>
        {person.chapterId ? (
          <button
            type="button"
            className="gs-chip"
            aria-pressed={destination === 'chapter'}
            onClick={() => setDestination('chapter')}
          >
            My chapter
          </button>
        ) : null}
        {person.programSlug ? (
          <button
            type="button"
            className="gs-chip"
            aria-pressed={destination === 'program'}
            onClick={() => setDestination('program')}
          >
            {person.program?.shortName ?? 'My programme'}
          </button>
        ) : null}
      </div>

      <label className="gs-row gs-small" style={{ gap: 8 }}>
        <input
          type="checkbox"
          checked={badge}
          onChange={(e) => setBadge(e.target.checked)}
          style={{ width: 16 }}
        />
        Show a “Sustaining Member ✓” badge on my passport (never the amount or
        rhythm)
      </label>

      <button
        type="button"
        className="gs-btn gs-btn--primary"
        disabled={busy}
        onClick={() => void submit()}
      >
        Start my commitment
      </button>

      <div style={{ marginTop: 4 }}>
        <Bar
          pct={Math.min(100, stats.active * 10)}
          label="Members sustaining"
        />
        <p className="gs-small gs-muted" style={{ marginTop: 6 }}>
          {formatNumber(stats.active)} members sustaining right now.
        </p>
      </div>
    </div>
  )
}
