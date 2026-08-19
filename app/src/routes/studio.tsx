import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { useCurrentPerson } from '../hooks/useCurrentPerson'
import { LoadingState } from '../components/LoadingState'
import { IdentityPicker } from '../components/IdentityPicker'
import { Banner, Pill, Section } from '../components/ui'
import { buildCards } from '../lib/cards'
import { downloadCard, renderCard } from '../lib/card-canvas'
import type { CardFormat, CardSpec } from '../lib/card-canvas'

interface StudioSearch {
  card?: string
  person?: string
  partner?: string
  chapter?: string
  mission?: string
}

export const Route = createFileRoute('/studio')({
  validateSearch: (search: Record<string, unknown>): StudioSearch => ({
    card: typeof search.card === 'string' ? search.card : undefined,
    person: typeof search.person === 'string' ? search.person : undefined,
    partner: typeof search.partner === 'string' ? search.partner : undefined,
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
    mission: typeof search.mission === 'string' ? search.mission : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Share Studio — Goodness Society' },
      {
        name: 'description',
        content:
          'Evidence-backed cards built from the live record. The numbers are locked, so what you share is backed by the platform.',
      },
    ],
  }),
  component: Studio,
})

function Studio() {
  const search = Route.useSearch()
  const { os } = useOS()
  const { person: signedIn } = useCurrentPerson()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(
    search.card ?? null,
  )
  const [format, setFormat] = useState<CardFormat>('square')
  const [copied, setCopied] = useState(false)

  const person = os
    ? search.person
      ? (os.personBySlug.get(search.person) ?? signedIn)
      : signedIn
    : null

  const catalogue = useMemo(
    () =>
      os
        ? buildCards(os, {
            person,
            partnerId: search.partner ?? null,
            chapterId: search.chapter ?? null,
          })
        : [],
    [os, person, search.partner, search.chapter],
  )

  const allCards = useMemo(
    () => catalogue.flatMap((section) => section.cards),
    [catalogue],
  )
  const selected: CardSpec | null =
    allCards.find((card) => card.id === selectedId) ??
    allCards.find((card) => !card.lockedReason) ??
    allCards[0] ??
    null

  useEffect(() => {
    if (!selected || !canvasRef.current) return
    const chosen = selected.formats.includes(format)
      ? format
      : selected.formats[0]!
    renderCard(canvasRef.current, selected, chosen)
  }, [selected, format])

  if (!os) return <LoadingState />

  return (
    <>
      <section style={{ paddingTop: 34 }}>
        <div className="gs-wrap gs-stack" style={{ gap: 10 }}>
          <p className="gs-eyebrow">Share Studio</p>
          <h1 style={{ fontSize: 'clamp(26px, 3.4vw, 40px)' }}>
            Every good moment, worth sharing
          </h1>
          <p className="gs-lede" style={{ maxWidth: 680 }}>
            Cards are built from the live record. The numbers are locked — you
            can choose the card and the format, but not the figures, because a
            card is a claim the platform stands behind.
          </p>
        </div>
      </section>

      <Section tight>
        {!person ? (
          <div style={{ maxWidth: 620, marginBottom: 22 }}>
            <IdentityPicker
              os={os}
              note="Pick a passport to unlock personal cards"
            />
          </div>
        ) : null}

        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)',
            gap: 28,
            alignItems: 'start',
          }}
        >
          <div
            className="gs-stack"
            style={{ gap: 22, position: 'sticky', top: 96 }}
          >
            {catalogue.map((section) => (
              <div
                key={section.section}
                className="gs-stack"
                style={{ gap: 8 }}
              >
                <p className="gs-eyebrow">{section.section}</p>
                {section.cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="gs-card"
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '12px 14px',
                      borderColor:
                        selected?.id === card.id
                          ? 'var(--gs-green)'
                          : undefined,
                      opacity: card.lockedReason ? 0.6 : 1,
                    }}
                    onClick={() => setSelectedId(card.id)}
                  >
                    <div className="gs-row gs-row--between" style={{ gap: 8 }}>
                      <span className="gs-small" style={{ fontWeight: 700 }}>
                        {card.name}
                      </span>
                      {card.lockedReason ? (
                        <Pill>Locked</Pill>
                      ) : card.verified ? (
                        <Pill tone="green">✓</Pill>
                      ) : null}
                    </div>
                    {card.lockedReason ? (
                      <span
                        className="gs-small gs-muted"
                        style={{ display: 'block', marginTop: 4 }}
                      >
                        {card.lockedReason}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="gs-stack" style={{ gap: 16 }}>
            {selected ? (
              <>
                <div className="gs-row gs-row--between">
                  <div className="gs-row" style={{ gap: 8 }}>
                    {selected.formats.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="gs-chip"
                        aria-pressed={
                          (selected.formats.includes(format)
                            ? format
                            : selected.formats[0]) === option
                        }
                        onClick={() => setFormat(option)}
                      >
                        {option === 'square'
                          ? 'Square 1080'
                          : option === 'story'
                            ? 'Story 1080×1920'
                            : 'Poster A4'}
                      </button>
                    ))}
                  </div>
                  <div className="gs-row" style={{ gap: 8 }}>
                    <button
                      type="button"
                      className="gs-btn gs-btn--ghost gs-btn--sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(selected.caption)
                        setCopied(true)
                        window.setTimeout(() => setCopied(false), 1600)
                      }}
                    >
                      {copied ? 'Caption copied' : 'Copy caption'}
                    </button>
                    <button
                      type="button"
                      className="gs-btn gs-btn--primary gs-btn--sm"
                      disabled={Boolean(selected.lockedReason)}
                      onClick={() => {
                        if (canvasRef.current)
                          downloadCard(
                            canvasRef.current,
                            `goodness-${selected.id}.png`,
                          )
                      }}
                    >
                      Download PNG
                    </button>
                  </div>
                </div>

                {selected.lockedReason ? (
                  <Banner variant="warn">{selected.lockedReason}</Banner>
                ) : null}

                <div
                  className="gs-card gs-card--flat"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    background: 'var(--gs-mist)',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      maxWidth:
                        (selected.formats.includes(format)
                          ? format
                          : selected.formats[0]) === 'square'
                          ? 520
                          : 400,
                      height: 'auto',
                      borderRadius: 18,
                      boxShadow: 'var(--gs-shadow)',
                    }}
                  />
                </div>

                <div className="gs-card gs-card--flat">
                  <p className="gs-eyebrow">Suggested caption</p>
                  <p style={{ marginTop: 10 }}>{selected.caption}</p>
                  {selected.verifyRef ? (
                    <p className="gs-small gs-muted" style={{ marginTop: 10 }}>
                      Card carries the verification reference{' '}
                      {selected.verifyRef} — anyone can check it.
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <Banner>
                No cards available yet — join a mission or publish a record and
                they appear here.
              </Banner>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
