import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Display } from '../../components/ui'
import { submitChapterRequest } from '../../data/actions'
import { formatNumber } from '../../lib/format'
import type { ChapterView, OSModel } from '../../data/os'

/** Chapters — a faithful build of `Chapters.dc.html`, including its start-a-chapter band. */
export const Route = createFileRoute('/chapters/')({
  head: () => ({
    meta: [
      { title: 'Chapters — Goodness Society' },
      {
        name: 'description',
        content:
          'One organisation. Goodness, everywhere. Chapters run their own missions with their own leaders while identity, standards and the money trail stay one system.',
      },
    ],
  }),
  component: Chapters,
})

function Chapters() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const active = os.activeChapters
  const forming = os.formingChapters
  const members = active.reduce((n, c) => n + c.memberCount, 0)
  const hours = active.reduce((n, c) => n + c.hours, 0)

  const feed: Array<{ place: string; color: string; text: string }> = []
  active.forEach((chapter) => {
    const live = chapter.missions.find((m) => m.status === 'open')
    if (live)
      feed.push({
        place: chapter.city,
        color: '#E65100',
        text: `“${live.title}” needs ${live.remaining} more volunteers`,
      })
    const record = chapter.impact[0]
    if (record)
      feed.push({
        place: chapter.city,
        color: '#1B7A34',
        text: `${record.title} published — ${formatNumber(record.beneficiaries)} people supported`,
      })
  })
  forming.forEach((chapter) =>
    feed.unshift({
      place: chapter.city,
      color: '#6B21A8',
      text: `${chapter.name} is forming — leadership team assembling`,
    }),
  )

  return (
    <>
      <section className="gs-inksection" style={{ padding: '64px 0 52px' }}>
        <GWatermark
          width={560}
          height={380}
          style={{ top: -30, right: -20, opacity: 0.07 }}
        />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span
            className="gs-livepill"
            style={{ fontSize: 12, letterSpacing: '0.06em', marginBottom: 24 }}
          >
            The Network
          </span>
          <div className="gs-hero-grid">
            <Display
              as="h1"
              onInk
              stacked
              light="One organisation."
              bold="Goodness, everywhere."
              variant="page"
            />
            <div>
              <p
                style={{
                  margin: '0 0 18px',
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                }}
              >
                Chapters run their own missions with their own leaders — while
                identity, standards, impact measurement, and the money trail
                stay one system. Every number below is computed from the same
                records as the rest of the platform.
              </p>
              <a href="#start" className="gs-btn gs-btn--white gs-btn--md">
                Start a chapter in your city →
              </a>
            </div>
          </div>

          <div className="gs-inkbar gs-inkbar--4" style={{ marginTop: 40 }}>
            <div>
              <div
                className="gs-inkbar__big gs-num"
                style={{ color: 'var(--gs-green)' }}
              >
                {active.length}
              </div>
              <div className="gs-inkbar__cap">Active chapters</div>
            </div>
            <div>
              <div className="gs-inkbar__big gs-num">{forming.length}</div>
              <div className="gs-inkbar__cap">Forming chapters</div>
            </div>
            <div>
              <div className="gs-inkbar__big gs-num">{members}</div>
              <div className="gs-inkbar__cap">Chapter members</div>
            </div>
            <div>
              <div className="gs-inkbar__big gs-num">{formatNumber(hours)}</div>
              <div className="gs-inkbar__cap">
                Verified hours across the network
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '44px 0 8px',
          background: 'var(--gs-mist)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="gs-wrap">
          <div
            className="gs-row"
            style={{ gap: 10, marginBottom: 16, flexWrap: 'nowrap' }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--gs-green)',
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--gs-ink-40)',
                fontWeight: 800,
              }}
            >
              Across Goodness right now
            </h2>
          </div>
          <div className="gs-row" style={{ gap: 12 }}>
            {feed.slice(0, 6).map((item, i) => (
              <div key={i} className="gs-feedpill">
                <span
                  style={{ fontSize: 11, fontWeight: 800, color: item.color }}
                >
                  {item.place}
                </span>
                <span style={{ fontSize: 12, color: '#374151' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 0 72px', background: 'var(--gs-mist)' }}>
        <div className="gs-wrap">
          <div className="gs-chaptercards">
            {os.chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      </section>

      <StartAChapter os={os} />
    </>
  )
}

function ChapterCard({ chapter }: { chapter: ChapterView }) {
  const forming = chapter.status === 'forming'
  const university = chapter.type === 'university'
  const accent = forming ? '#E65100' : university ? '#1565C0' : '#4DC86A'
  const lead =
    chapter.team.find((t) => /lead$/i.test(t.role) && t.volunteer) ??
    chapter.team.find((t) => t.volunteer)
  const parent = chapter.parent

  return (
    <Link
      to="/chapters/$chapterId"
      params={{ chapterId: chapter.id }}
      className="gs-chaptercard"
      style={{ borderTopColor: accent }}
    >
      <div className="gs-row" style={{ gap: 8 }}>
        <span
          className="gs-tag"
          style={{
            background: university ? '#e8f0fc' : '#f0faf3',
            color: university ? '#1565C0' : '#1B7A34',
          }}
        >
          {university ? 'University chapter' : 'District chapter'}
        </span>
        {forming ? (
          <span
            className="gs-tag"
            style={{ background: '#fff3e0', color: '#E65100' }}
          >
            Forming
          </span>
        ) : null}
        {parent ? (
          <span style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
            under {parent.name}
          </span>
        ) : null}
      </div>

      <div>
        <h3
          style={{
            margin: '0 0 3px',
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: '-0.01em',
          }}
        >
          {chapter.name}
        </h3>
        <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
          {university
            ? (chapter.campusNote ?? chapter.city)
            : chapter.coverage.join(' · ') || chapter.city}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
        {chapter.story}
      </p>

      {!forming ? (
        <div className="gs-ministats">
          <div>
            <div className="gs-ministats__value gs-num">
              {university ? 26 : chapter.memberCount}
            </div>
            <div className="gs-ministats__label">Members</div>
          </div>
          <div>
            <div
              className="gs-ministats__value gs-num"
              style={{ color: 'var(--gs-green-deep)' }}
            >
              {chapter.liveMissions}
            </div>
            <div className="gs-ministats__label">Missions live</div>
          </div>
          <div>
            <div className="gs-ministats__value gs-num">
              {formatNumber(chapter.peopleSupported)}
            </div>
            <div className="gs-ministats__label">People supported</div>
          </div>
          <div>
            <div className="gs-ministats__value gs-num">
              {chapter.partners.length}
            </div>
            <div className="gs-ministats__label">Partners</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#E65100', fontWeight: 600 }}>
          Leadership team being established · Goodness standards{' '}
          {chapter.standardsDone} / {chapter.standardsTotal}
        </div>
      )}

      <div className="gs-cardfoot">
        <div
          className="gs-row"
          style={{ gap: 8, minWidth: 0, flexWrap: 'nowrap' }}
        >
          {lead?.volunteer ? (
            <span
              className={`gs-mark ${lead.volunteer.avatarColor === 'blue' ? 'gs-mark--blue' : lead.volunteer.avatarColor === 'teal' ? 'gs-mark--teal' : ''}`}
              style={{ width: 28, height: 28, fontSize: 10 }}
            >
              {lead.volunteer.initials}
            </span>
          ) : null}
          <span
            style={{
              fontSize: 12,
              color: 'var(--gs-ink-50)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {lead?.volunteer
              ? `${lead.role}: ${lead.volunteer.fullName}`
              : 'Leadership forming'}
          </span>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gs-green-deep)',
            flexShrink: 0,
          }}
        >
          {forming ? 'Follow progress' : 'Visit chapter'} →
        </span>
      </div>
    </Link>
  )
}

function StartAChapter({ os }: { os: OSModel }) {
  const [city, setCity] = useState('')
  const [contact, setContact] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const send = () => {
    if (!city || !contact) {
      setError(true)
      return
    }
    void submitChapterRequest({
      countryId: os.data.countries[0]?.id ?? 'ctry-bd',
      city,
      division: null,
      requesterName: contact,
      requesterEmail: null,
      why: why || null,
      peopleReady: null,
    })
    setError(false)
    setSent(true)
  }

  return (
    <section
      id="start"
      style={{
        padding: '72px 0',
        background: 'var(--gs-ink)',
        scrollMarginTop: 90,
      }}
    >
      <div className="gs-centreband__inner">
        <Display
          onInk
          stacked
          variant="minor"
          light="Don’t see Goodness in your city?"
          bold="Start a chapter."
        />
        <p
          style={{
            margin: '14px auto 26px',
            fontSize: 15,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Chapters begin with a few committed people. Tell us where, and we’ll
          help you form a leadership team, meet the Goodness standards, and go
          active — like Goodness Cumilla is doing right now.
        </p>

        {sent ? (
          <div
            className="gs-inknote"
            style={{ maxWidth: 560, margin: '0 auto' }}
          >
            Chapter proposal received — HQ reviews it and, if approved, your
            chapter appears here as Forming. Watch this page.
          </div>
        ) : (
          <div
            className="gs-inkform gs-stack"
            style={{
              gap: 10,
              maxWidth: 560,
              margin: '0 auto',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or campus *"
                aria-label="City or campus"
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Your name & contact *"
                aria-label="Your name and contact"
              />
            </div>
            <input
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Why here? Local needs, your team, your Goodness ID if you have one"
              aria-label="Why here"
            />
            <div className="gs-row" style={{ gap: 12 }}>
              <button
                type="button"
                className="gs-btn gs-btn--white gs-btn--md"
                onClick={send}
              >
                Propose the chapter →
              </button>
              {error ? (
                <span
                  style={{ fontSize: 12, color: '#FFB74D', fontWeight: 700 }}
                >
                  City and contact are required.
                </span>
              ) : null}
            </div>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              Lifecycle: Proposed → Forming (leadership + Goodness standards) →
              Active.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
