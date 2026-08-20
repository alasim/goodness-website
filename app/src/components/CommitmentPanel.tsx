import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  contributeNow,
  saveCommitment,
  setCommitmentStatus,
} from '../data/actions'
import { formatMoney } from '../lib/format'
import type { OSModel, VolunteerView } from '../data/os'
import type {
  Commitment,
  CommitmentDestination,
  CommitmentRhythm,
} from '../lib/types'

const AMOUNTS = [10, 20, 50, 100, 500]
const RHYTHMS: Array<CommitmentRhythm> = [
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Monthly',
]

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const PANEL_LABEL: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'var(--gs-ink-40)',
  fontWeight: 800,
}

/** What the commitment supports, in the words the design uses. */
function destinationLabel(
  commitment: Commitment,
  os: OSModel,
  person: VolunteerView,
): string {
  if (commitment.destination === 'chapter')
    return (
      (commitment.destinationChapterId
        ? os.chapterById.get(commitment.destinationChapterId)?.name
        : person.chapter?.name) ?? 'My Chapter'
    )
  if (commitment.destination === 'program')
    return (
      os.programs.find((p) => p.slug === commitment.destinationProgramSlug)
        ?.name ?? 'A programme'
    )
  return 'Wherever Goodness needs it most'
}

/**
 * The Goodness Commitment — built from the commitment section of `My Goodness.dc.html`.
 * Voluntary, never a fee, never a gate. Pausing preserves history and never downgrades
 * recognition, and the amount is never public.
 */
export function CommitmentPanel({
  os,
  person,
}: {
  os: OSModel
  person: VolunteerView
}) {
  const commitment = os.data.commitments.find(
    (c) => c.profileId === person.id && c.status !== 'ended',
  )
  const contributions = commitment
    ? os.data.commitmentContributions.filter(
        (c) => c.commitmentId === commitment.id,
      )
    : []

  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState<number | null>(commitment?.amount ?? 50)
  const [custom, setCustom] = useState('')
  const [rhythm, setRhythm] = useState<CommitmentRhythm>(
    commitment?.rhythm ?? 'Monthly',
  )
  const [destination, setDestination] = useState<CommitmentDestination>(
    commitment?.destination ?? 'unrestricted',
  )
  const [busy, setBusy] = useState(false)

  const activeCount = os.data.commitments.filter(
    (c) => c.status === 'active',
  ).length
  const total = contributions.reduce((n, c) => n + c.amount, 0)

  const submit = () => {
    const value = Number(custom.replace(/[^0-9]/g, '')) || amount || 0
    if (!value) return
    setBusy(true)
    void saveCommitment({
      profileId: person.id,
      amount: value,
      rhythm,
      destination,
      destinationChapterId: destination === 'chapter' ? person.chapterId : null,
      destinationProgramSlug:
        destination === 'program' ? person.programSlug : null,
      badgeOptIn: commitment?.badgeOptIn ?? true,
    })
      .then(() => setEditing(false))
      .finally(() => setBusy(false))
  }

  const showForm = !commitment || editing

  return (
    <section className="gs-panelcard">
      <h2 style={PANEL_LABEL}>Goodness Commitment</h2>
      <p
        style={{
          margin: '4px 0 16px',
          fontSize: 12,
          color: 'var(--gs-ink-40)',
        }}
      >
        Contribute what you can, when you can — Goodness appreciates the
        commitment, not the size.
      </p>

      {showForm ? (
        <div className="gs-stack" style={{ gap: 12 }}>
          <div>
            <div className="gs-fieldlabel">Amount</div>
            <div className="gs-row" style={{ gap: 6 }}>
              {AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="gs-amountchip"
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
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value)
                  setAmount(null)
                }}
                placeholder={`Custom ${os.currency}`}
                aria-label="Custom amount"
                className="gs-customamount"
              />
            </div>
          </div>

          <div className="gs-cols-2" style={{ gap: 10 }}>
            <div>
              <div className="gs-fieldlabel">Rhythm</div>
              <select
                value={rhythm}
                onChange={(e) => setRhythm(e.target.value as CommitmentRhythm)}
                aria-label="Rhythm"
              >
                {RHYTHMS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="gs-fieldlabel">Goes to</div>
              <select
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value as CommitmentDestination)
                }
                aria-label="Goes to"
              >
                <option value="unrestricted">
                  Wherever Goodness needs it most
                </option>
                {person.chapterId ? (
                  <option value="chapter">My Chapter</option>
                ) : null}
                {person.programSlug ? (
                  <option value="program">
                    {person.program?.name ?? 'My programme'}
                  </option>
                ) : null}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="gs-btn gs-btn--primary gs-btn--block"
            style={{ padding: '12px 0', fontSize: 13 }}
            disabled={busy}
            onClick={submit}
          >
            Start my commitment
          </button>
          <p className="gs-finenote">
            Entirely voluntary — never a membership fee. Time, skills, and
            leadership count just as much.
          </p>
        </div>
      ) : (
        <ActiveCommitment
          os={os}
          person={person}
          commitment={commitment}
          contributions={contributions}
          total={total}
          activeCount={activeCount}
          busy={busy}
          setBusy={setBusy}
          onChange={() => {
            setAmount(commitment.amount)
            setRhythm(commitment.rhythm)
            setDestination(commitment.destination)
            setCustom('')
            setEditing(true)
          }}
        />
      )}
    </section>
  )
}

function ActiveCommitment({
  os,
  person,
  commitment,
  contributions,
  total,
  activeCount,
  busy,
  setBusy,
  onChange,
}: {
  os: OSModel
  person: VolunteerView
  commitment: Commitment
  contributions: Array<{ id: string; amount: number; contributedAt: string }>
  total: number
  activeCount: number
  busy: boolean
  setBusy: (value: boolean) => void
  onChange: () => void
}) {
  const paused = commitment.status === 'paused'

  // The last three months of contributions, most recent first — one dot per contribution.
  const groups = new Map<string, { n: number; sum: number }>()
  contributions.forEach((c) => {
    const key = MONTHS[new Date(c.contributedAt).getMonth()] ?? '—'
    const group = groups.get(key) ?? { n: 0, sum: 0 }
    group.n += 1
    group.sum += c.amount
    groups.set(key, group)
  })
  const months = [...groups.entries()].slice(-3).reverse()

  return (
    <div className="gs-stack" style={{ gap: 12 }}>
      <div className="gs-commitstatus">
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: 'var(--gs-green-deep)',
            }}
          >
            {paused ? 'Commitment paused' : 'You’re sustaining Goodness'}
          </div>
          <div style={{ fontSize: 12, color: '#374151', marginTop: 2 }}>
            {formatMoney(commitment.amount, os.currency)} · {commitment.rhythm}{' '}
            · {paused ? 'paused' : 'active'}
          </div>
          <div
            style={{ fontSize: 11, color: 'var(--gs-ink-50)', marginTop: 2 }}
          >
            Supporting: {destinationLabel(commitment, os, person)} · sustaining
            since {person.sustainingSince ?? commitment.startedOn}
          </div>
        </div>
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
      </div>

      <div
        className="gs-row"
        style={{ gap: 14, fontSize: 12.5, color: '#374151' }}
      >
        <span>
          <strong>
            {contributions.length}{' '}
            {contributions.length === 1 ? 'contribution' : 'contributions'}
          </strong>
        </span>
        <span>
          <strong>{formatMoney(total, os.currency)}</strong> contributed
        </span>
        <span style={{ color: 'var(--gs-green-deep)', fontWeight: 700 }}>
          Thank you for helping keep Goodness moving.
        </span>
      </div>

      {months.length ? (
        <div className="gs-stack" style={{ gap: 5 }}>
          {months.map(([label, group]) => (
            <div
              key={label}
              className="gs-row"
              style={{ gap: 10, fontSize: 12 }}
            >
              <span
                style={{
                  width: 64,
                  color: 'var(--gs-ink-40)',
                  fontWeight: 700,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  color: 'var(--gs-green-deep)',
                  letterSpacing: '2px',
                }}
              >
                {group.n <= 8 ? '● '.repeat(group.n).trim() : ''}
              </span>
              <span style={{ color: 'var(--gs-ink-50)' }}>
                {group.n} {group.n === 1 ? 'contribution' : 'contributions'} ·{' '}
                {formatMoney(group.sum, os.currency)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {paused ? (
        <div className="gs-pausednote">
          Commitment paused — everything you’ve contributed remains part of your
          Goodness history. Resume whenever you’re ready.
        </div>
      ) : null}

      <div className="gs-row" style={{ gap: 8 }}>
        <button
          type="button"
          className="gs-quietbtn"
          disabled={busy}
          onClick={() =>
            void setCommitmentStatus(
              commitment.id,
              paused ? 'active' : 'paused',
            )
          }
        >
          {paused ? 'Resume commitment' : 'Pause commitment'}
        </button>
        <button type="button" className="gs-quietbtn" onClick={onChange}>
          Change amount or rhythm
        </button>
        <label
          className="gs-row"
          style={{
            gap: 6,
            fontSize: 11,
            color: 'var(--gs-ink-50)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={commitment.badgeOptIn}
            style={{ width: 16, accentColor: '#1B7A34' }}
            onChange={(e) =>
              void saveCommitment({
                profileId: person.id,
                amount: commitment.amount,
                rhythm: commitment.rhythm,
                destination: commitment.destination,
                destinationChapterId: commitment.destinationChapterId,
                destinationProgramSlug: commitment.destinationProgramSlug,
                badgeOptIn: e.target.checked,
              })
            }
          />
          Show Sustaining Member on my Passport
        </label>
      </div>

      <div className="gs-row" style={{ gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'var(--gs-ink-40)',
          }}
        >
          SHARE THIS MOMENT:
        </span>
        {[
          { card: 'sustaining', label: 'Sustaining Member' },
          { card: 'commitmentmilestone', label: 'Commitment milestone' },
          { card: 'backedimpact', label: 'Impact I backed' },
          { card: 'yearme', label: 'My Year' },
        ].map((quick) => (
          <Link
            key={quick.card}
            to="/studio"
            search={{ card: quick.card, person: person.slug }}
            className="gs-quickcard"
          >
            {quick.label}
          </Link>
        ))}
      </div>

      <p className="gs-finenote">
        Change or pause any time — your recognition never downgrades. Every
        contribution enters the Trust Ledger with a receipt.{' '}
        <Link to="/trust" style={{ fontWeight: 700 }}>
          Trace my contributions →
        </Link>
      </p>

      <div className="gs-collectiveline">
        {activeCount
          ? `${activeCount} ${activeCount === 1 ? 'member is' : 'members are'} sustaining Goodness with active commitments.`
          : 'Be among the first members to sustain Goodness continuously.'}{' '}
        <span style={{ fontWeight: 800, color: 'var(--gs-green-deep)' }}>
          Small commitments. One strong movement.
        </span>
      </div>
    </div>
  )
}
