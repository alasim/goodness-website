import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Pill, Section } from '../components/ui'

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
          'Enter a certificate reference to check whether it is valid, and what service it records.',
      },
    ],
  }),
  component: Verify,
})

function Verify() {
  const { ref } = Route.useSearch()
  const navigate = useNavigate({ from: '/verify' })
  const { os } = useOS()
  const [input, setInput] = useState(ref ?? '')

  useEffect(() => {
    setInput(ref ?? '')
  }, [ref])

  if (!os) return <LoadingState />

  const needle = (ref ?? '').trim().toUpperCase()
  const credential = needle
    ? os.data.credentials.find(
        (c) =>
          c.ref.toUpperCase() === needle ||
          c.ref.toUpperCase().replace('GS-VOL-', '') === needle,
      )
    : undefined
  const holder = credential
    ? os.personById.get(credential.profileId)
    : undefined

  return (
    <>
      <PageHero
        eyebrow="Credential verification"
        title="Check a certificate"
        lede="A certificate is worthless if its holder cannot prove it to a stranger. Enter the reference printed on the document — no account needed."
      />

      <Section tight>
        <form
          className="gs-row"
          style={{ gap: 10, maxWidth: 560 }}
          onSubmit={(e) => {
            e.preventDefault()
            void navigate({ search: { ref: input.trim() || undefined } })
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. GS-VOL-2024-0100"
            aria-label="Credential reference"
            style={{ flex: 1, minWidth: 220 }}
          />
          <button type="submit" className="gs-btn gs-btn--primary">
            Verify
          </button>
        </form>

        {needle ? (
          <div
            className="gs-card gs-card--flat"
            style={{ marginTop: 26, maxWidth: 640 }}
          >
            {credential && holder ? (
              <>
                <div className="gs-row gs-row--between">
                  <p className="gs-eyebrow">Result</p>
                  <Pill tone={credential.status === 'valid' ? 'green' : 'red'}>
                    {credential.status === 'valid'
                      ? 'Status: Valid'
                      : `Status: ${credential.status}`}
                  </Pill>
                </div>
                <dl className="gs-stack" style={{ gap: 14, marginTop: 18 }}>
                  <Field label="Issued to" value={holder.fullName} />
                  <Field label="Credential" value={credential.title} />
                  <Field
                    label="Programme"
                    value={credential.programSlug ?? '—'}
                  />
                  <Field
                    label="Service recorded"
                    value={credential.serviceSummary ?? '—'}
                  />
                  <Field label="Issued" value={credential.issuedLabel ?? '—'} />
                  <Field label="Reference" value={credential.ref} />
                </dl>
                <div className="gs-row" style={{ marginTop: 20 }}>
                  <Link
                    to="/people/$volunteerId"
                    params={{ volunteerId: holder.slug }}
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                  >
                    Open the passport
                  </Link>
                </div>
                {credential.status !== 'valid' ? (
                  <p
                    className="gs-small"
                    style={{ marginTop: 16, color: 'var(--gs-red)' }}
                  >
                    This credential was withdrawn by Goodness Society. A revoked
                    reference stays checkable on purpose — history is never
                    quietly deleted.
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="gs-eyebrow">Result</p>
                <h3 style={{ marginTop: 10 }}>
                  No credential with that reference
                </h3>
                <p className="gs-small gs-muted" style={{ marginTop: 8 }}>
                  Check the reference on the certificate, including the year. If
                  it still does not resolve, the document did not come from us.
                </p>
              </>
            )}
          </div>
        ) : null}
      </Section>
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="gs-small gs-muted">{label}</dt>
      <dd style={{ margin: 0, fontWeight: 600 }}>{value}</dd>
    </div>
  )
}
