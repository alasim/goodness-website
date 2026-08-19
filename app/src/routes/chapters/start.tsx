import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { PageHero } from '../../components/PageHero'
import { Banner, Pill, Section } from '../../components/ui'
import { submitChapterRequest } from '../../data/actions'

export const Route = createFileRoute('/chapters/start')({
  head: () => ({
    meta: [
      { title: 'Start a chapter — Goodness Society' },
      {
        name: 'description',
        content:
          'Chapters start with people, not paperwork. Tell us who is ready in your city.',
      },
    ],
  }),
  component: StartChapter,
})

const LIFECYCLE = [
  {
    stage: 'Proposed',
    body: 'You tell us who is ready and what the city needs.',
  },
  {
    stage: 'Forming',
    body: 'HQ confirms interest, a leadership team takes shape, first missions are planned.',
  },
  {
    stage: 'Active',
    body: 'The chapter publishes missions itself and appears across the network with live figures.',
  },
]

function StartChapter() {
  const { os } = useOS()
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!os) return <LoadingState />

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    try {
      await submitChapterRequest({
        countryId: os.data.countries[0]?.id ?? 'ctry-bd',
        city: String(form.get('city') ?? ''),
        division: String(form.get('division') ?? '') || null,
        requesterName: String(form.get('name') ?? ''),
        requesterEmail: String(form.get('email') ?? '') || null,
        why: String(form.get('why') ?? '') || null,
        peopleReady: Number(form.get('peopleReady') ?? 0) || null,
      })
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Grow the network"
        title="Start a chapter in your city"
        lede="A chapter is a group of people who keep showing up, supported by the same systems as everyone else: missions, passports, evidence, ledger."
      />

      <Section tight>
        <div className="gs-grid gs-grid--3" style={{ marginBottom: 30 }}>
          {LIFECYCLE.map((step, i) => (
            <div key={step.stage} className="gs-card gs-card--flat gs-stack">
              <Pill
                tone={i === 2 ? 'green' : 'neutral'}
              >{`${i + 1}. ${step.stage}`}</Pill>
              <p className="gs-small" style={{ color: 'var(--gs-ink-70)' }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {sent ? (
          <Banner>
            Request received. HQ reviews every request by hand — if it goes
            forward, your city appears in the network as a forming chapter and
            we start building the founding team with you.
          </Banner>
        ) : (
          <form
            className="gs-stack"
            style={{ gap: 14, maxWidth: 620 }}
            onSubmit={(e) => void submit(e)}
          >
            <div className="gs-grid gs-grid--2">
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  City *
                </span>
                <input name="city" required />
              </label>
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  Division or region
                </span>
                <input name="division" />
              </label>
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  Your name *
                </span>
                <input name="name" required />
              </label>
              <label className="gs-stack" style={{ gap: 6 }}>
                <span className="gs-small" style={{ fontWeight: 600 }}>
                  Email *
                </span>
                <input name="email" type="email" required />
              </label>
            </div>
            <label className="gs-stack" style={{ gap: 6 }}>
              <span className="gs-small" style={{ fontWeight: 600 }}>
                How many people are ready to start with you?
              </span>
              <input
                name="peopleReady"
                type="number"
                min={1}
                defaultValue={5}
              />
            </label>
            <label className="gs-stack" style={{ gap: 6 }}>
              <span className="gs-small" style={{ fontWeight: 600 }}>
                What does your city need most?
              </span>
              <textarea name="why" rows={4} />
            </label>
            <button
              type="submit"
              className="gs-btn gs-btn--primary"
              disabled={busy}
              style={{ alignSelf: 'flex-start' }}
            >
              {busy ? 'Sending…' : 'Send to HQ'}
            </button>
          </form>
        )}
      </Section>

      <Section variant="mist" tight>
        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">What HQ handles, what you handle</p>
          <div className="gs-grid gs-grid--2" style={{ marginTop: 14 }}>
            <div className="gs-stack" style={{ gap: 6 }}>
              <strong className="gs-small">Your chapter</strong>
              <span className="gs-small gs-muted">
                Low-risk missions, local partnerships, member care, the six
                Goodness Standards.
              </span>
            </div>
            <div className="gs-stack" style={{ gap: 6 }}>
              <strong className="gs-small">HQ</strong>
              <span className="gs-small gs-muted">
                Budgets, publishing impact records, issuing credentials, public
                funding opportunities.
              </span>
            </div>
          </div>
          <Link
            to="/chapters"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            style={{ marginTop: 16 }}
          >
            See the chapters already running
          </Link>
        </div>
      </Section>
    </>
  )
}
