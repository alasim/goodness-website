import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { formatNumber } from '../lib/format'
import type { OSModel, VolunteerView } from '../data/os'
import type { Credential } from '../lib/types'

/** Credential verification — a faithful build of `Verify.dc.html`. */
export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>): { ref?: string } => ({
    ref: typeof search.ref === 'string' ? search.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Verify a credential — Goodness Society' },
      {
        name: 'description',
        content:
          'Every certificate issued by Goodness Society carries a reference number. Enter it to confirm it is genuine.',
      },
    ],
  }),
  component: Verify,
})

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

/** A reference resolves whether or not the "GS-VOL-" prefix was typed. */
function findCredential(os: OSModel, ref: string) {
  const needle = ref.trim().toUpperCase()
  if (!needle) return undefined
  const credential = os.data.credentials.find(
    (c) =>
      c.ref.toUpperCase() === needle ||
      c.ref.toUpperCase().replace('GS-VOL-', '') === needle,
  )
  if (!credential) return null
  const holder = os.personById.get(credential.profileId)
  return holder ? { credential, holder } : null
}

function Verify() {
  const { ref } = Route.useSearch()
  const navigate = useNavigate({ from: '/verify' })
  const { os } = useOS()
  const [input, setInput] = useState(ref ?? '')

  useEffect(() => {
    setInput(ref ?? '')
  }, [ref])

  if (!os) return <LoadingState />

  // Undefined until something has been asked; null when the reference resolves to nothing.
  const result = ref ? findCredential(os, ref) : undefined
  const samples = os.people
    .filter((p) => p.credentials.length)
    .slice(0, 3)
    .map((p) => p.credentials[0]!.ref)

  const ask = (value: string) =>
    void navigate({ search: { ref: value.trim() || undefined } })

  return (
    <main className="gs-verify">
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span
          className="gs-mark"
          style={{ width: 52, height: 52, margin: '0 auto 20px' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <h1
          style={{
            margin: '0 0 12px',
            fontSize: 'clamp(32px, 4.5vw, 46px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ fontWeight: 300 }}>Credential</span>{' '}
          <span style={{ fontWeight: 800 }}>verification</span>
        </h1>
        <p
          style={{
            margin: '0 auto',
            fontSize: 16,
            color: 'var(--gs-ink-50)',
            lineHeight: 1.6,
            maxWidth: 440,
          }}
        >
          Every certificate issued by Goodness Society carries a reference
          number. Enter it below — or scan the QR code on the document — to
          confirm it is genuine.
        </p>
      </div>

      <form
        className="gs-verifybox"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <input
          className="gs-num"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. GS-VOL-2024-0100"
          aria-label="Credential reference"
        />
        <button type="submit" className="gs-btn gs-btn--primary gs-btn--lg">
          Verify
        </button>
      </form>

      {result ? (
        result.credential.status === 'valid' ? (
          <ValidResult credential={result.credential} holder={result.holder} />
        ) : (
          <RevokedResult
            credential={result.credential}
            holder={result.holder}
          />
        )
      ) : null}

      {result === null ? (
        <div
          className="gs-verifycard"
          style={{ padding: 28, textAlign: 'center' }}
        >
          <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800 }}>
            No credential found
          </p>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--gs-ink-50)' }}>
            We could not find a credential with that reference. Check the number
            on the document and try again.
          </p>
        </div>
      ) : null}

      {result === undefined ? (
        <div className="gs-trybox">
          <div className="gs-signin-card__label" style={{ marginBottom: 0 }}>
            Try a live reference
          </div>
          <div className="gs-row" style={{ gap: 8 }}>
            {samples.map((sample) => (
              <button
                key={sample}
                type="button"
                className="gs-quietbtn gs-num"
                onClick={() => ask(sample)}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}

function ValidResult({
  credential,
  holder,
}: {
  credential: Credential
  holder: VolunteerView
}) {
  const rows = [
    { k: 'Issued to', v: holder.fullName },
    { k: 'Credential', v: credential.title },
    { k: 'Program', v: holder.program?.name ?? '—' },
    {
      k: 'Verified service',
      v: `${formatNumber(holder.totalHours)} hours · ${holder.totalMissions} missions`,
    },
    { k: 'Issued', v: credential.issuedLabel ?? '—' },
    { k: 'Status', v: 'Valid', color: '#1B7A34' },
  ]

  return (
    <div className="gs-verifyresult gs-verifyresult--valid">
      <div className="gs-verifyresult__head">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
          Credential Verified
        </div>
        <div
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Goodness Society
        </div>
      </div>

      <div style={{ padding: 28 }}>
        <div className="gs-row" style={{ gap: 16, marginBottom: 24 }}>
          <span
            className="gs-mark"
            style={{
              width: 56,
              height: 56,
              fontSize: 19,
              background:
                AVATAR_GRADIENTS[holder.avatarColor] ?? AVATAR_GRADIENTS.green!,
            }}
          >
            {holder.initials}
          </span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {holder.fullName}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gs-ink-50)' }}>
              {holder.roleTitle} · {holder.chapter?.name ?? 'National network'}
            </div>
          </div>
        </div>

        <div className="gs-verifygrid">
          {rows.map((row) => (
            <div key={row.k}>
              <div className="gs-verifygrid__key">{row.k}</div>
              <div
                className="gs-verifygrid__value"
                style={row.color ? { color: row.color } : undefined}
              >
                {row.v}
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/people/$volunteerId"
          params={{ volunteerId: holder.slug }}
          style={{
            display: 'inline-flex',
            marginTop: 20,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          View public Goodness Passport →
        </Link>
      </div>
    </div>
  )
}

/**
 * A revoked reference stays checkable on purpose: history is never quietly deleted, so anyone
 * holding the document gets a straight answer instead of silence.
 */
function RevokedResult({
  credential,
  holder,
}: {
  credential: Credential
  holder: VolunteerView
}) {
  return (
    <div className="gs-verifyresult gs-verifyresult--revoked">
      <div className="gs-verifyresult__head" style={{ background: '#d4183d' }}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
          Credential Revoked
        </div>
      </div>
      <div style={{ padding: 28 }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>
          {credential.title} · {credential.ref}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: 'var(--gs-ink-50)',
            lineHeight: 1.6,
          }}
        >
          This reference was issued to {holder.fullName} but has since been
          revoked by Goodness Society and is no longer valid. Contact{' '}
          <a href="mailto:hello@goodnesssociety.org">
            hello@goodnesssociety.org
          </a>{' '}
          if you believe this is an error.
        </p>
      </div>
    </div>
  )
}
