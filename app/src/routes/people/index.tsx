import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Display } from '../../components/ui'
import { formatNumber } from '../../lib/format'
import type { VolunteerView } from '../../data/os'

/** Our Volunteers — a faithful build of `Volunteers.dc.html`. */
export const Route = createFileRoute('/people/')({
  head: () => ({
    meta: [
      { title: 'Our Volunteers — Goodness Society' },
      {
        name: 'description',
        content:
          "Every person here chose to show up. They bring their time, skills, and belief that things can be better — and together, they're proving it.",
      },
    ],
  }),
  component: Volunteers,
})

/** The gradient a volunteer's avatar carries, keyed the way the design keys it. */
const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

/** Programme colour with the design's fallback: education green when a volunteer has no programme. */
function paletteOf(person: VolunteerView) {
  return {
    color: person.program?.color ?? '#1B7A34',
    bg: person.program?.bgColor ?? '#f0faf3',
    light: person.program?.lightColor ?? '#4DC86A',
    grad: AVATAR_GRADIENTS[person.avatarColor] ?? AVATAR_GRADIENTS.green!,
    /** The card shows the programme name clipped to its first three words. */
    programShort: (person.program?.name ?? '').split(' ').slice(0, 3).join(' '),
  }
}

function Volunteers() {
  const { os } = useOS()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (!os) return []
    const q = search.trim().toLowerCase()
    return os.people.filter((v) => {
      const matchesFilter = filter === 'all' || v.programSlug === filter
      const matchesSearch =
        !q ||
        v.fullName.toLowerCase().includes(q) ||
        (v.roleTitle ?? '').toLowerCase().includes(q) ||
        (v.city ?? '').toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q))
      return matchesFilter && matchesSearch
    })
  }, [os, search, filter])

  if (!os) return <LoadingState />

  const listed = os.people
  const featured = listed.find((v) => v.featured) ?? listed[0]
  const programmes = os.programs.filter((p) => !p.isOperations)
  const filterLabel = programmes.find((p) => p.slug === filter)
  const resultCount =
    `${filtered.length} volunteer${filtered.length === 1 ? '' : 's'}` +
    (filterLabel ? ` in ${filterLabel.shortName ?? filterLabel.name}` : '') +
    (search ? ` matching “${search}”` : '')

  return (
    <>
      {/* ── 01 Hero ── */}
      <section
        style={{
          position: 'relative',
          background: '#fff',
          padding: '56px 0 40px',
          overflow: 'hidden',
        }}
      >
        <GWatermark width={560} height={380} />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 28 }}>
            Our Volunteers
          </span>
          <div
            className="gs-split"
            style={{ gap: 40, alignItems: 'end', marginBottom: 40 }}
          >
            <Display
              as="h1"
              stacked
              light="Meet our"
              bold="Change-Makers"
              boldColor="var(--gs-green-deep)"
              style={{
                margin: 0,
                fontSize: 'clamp(44px, 6vw, 80px)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
              }}
            />
            <div>
              <p
                style={{
                  margin: '0 0 24px',
                  fontSize: 18,
                  color: 'var(--gs-ink-50)',
                  lineHeight: 1.65,
                }}
              >
                Every person here chose to show up. They bring their time,
                skills, and belief that things can be better — and together,
                they're proving it.
              </p>
              <Link to="/join" className="gs-btn gs-btn--primary gs-btn--md">
                Get Listed Here →
              </Link>
            </div>
          </div>

          {/* ── 02 Stat strip ── */}
          <div className="gs-iconbar">
            <IconStat
              value={formatNumber(listed.length)}
              label="Active Volunteers"
              path="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
              circle={{ cx: 9, cy: 7, r: 4 }}
            />
            <IconStat
              value={formatNumber(
                new Set(listed.map((v) => v.city).filter(Boolean)).size,
              )}
              label="Cities Represented"
              path="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20 M2 12h20"
              circle={{ cx: 12, cy: 12, r: 10 }}
            />
            <IconStat
              value={formatNumber(
                new Set(listed.map((v) => v.programSlug).filter(Boolean)).size,
              )}
              label="Programs Supported"
              path="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
            />
            <IconStat
              value={formatNumber(listed.reduce((n, v) => n + v.totalHours, 0))}
              label="Verified Service Hours"
              path="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
          </div>
        </div>
      </section>

      {/* ── 03 Featured + directory ── */}
      <section
        style={{
          padding: '48px 0 96px',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-wrap">
          {featured ? <Featured person={featured} /> : null}

          <div
            className="gs-row"
            style={{ gap: 16, marginBottom: 24, alignItems: 'center' }}
          >
            <input
              type="search"
              className="gs-searchpill"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill or city…"
              aria-label="Search volunteers"
            />
            <div className="gs-row" style={{ gap: 6 }}>
              <button
                type="button"
                className="gs-filter"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Programs
              </button>
              {programmes.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  className="gs-filter"
                  aria-pressed={filter === p.slug}
                  onClick={() => setFilter(p.slug)}
                  style={
                    filter === p.slug
                      ? {
                          background: `linear-gradient(135deg, ${p.lightColor} 0%, ${p.color} 100%)`,
                        }
                      : undefined
                  }
                >
                  {p.shortName ?? p.name}
                </button>
              ))}
            </div>
          </div>

          <p className="gs-resultcount" style={{ margin: '0 0 20px' }}>
            {resultCount}
          </p>

          {filtered.length ? (
            <div className="gs-vcards">
              {filtered.map((person) => (
                <VolunteerCardLarge key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div
              className="gs-stack"
              style={{ alignItems: 'center', padding: '80px 0', gap: 4 }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>No volunteers found</p>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--gs-ink-50)' }}>
                Try a different search or filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 04 Your name belongs here ── */}
      <section
        style={{
          position: 'relative',
          padding: '112px 0',
          background: '#fff',
          overflow: 'hidden',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <span className="gs-gletter" aria-hidden="true">
          G
        </span>
        <div
          style={{
            position: 'relative',
            maxWidth: 760,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <div className="gs-ruleline" style={{ marginBottom: 24 }}>
            {listed.length}+ change-makers and counting
          </div>
          <Display
            stacked
            light="Your name"
            bold="belongs here."
            boldColor="var(--gs-green-deep)"
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(35px, 5vw, 64px)',
              lineHeight: 1.15,
            }}
          />
          <p
            style={{
              margin: '0 auto 40px',
              fontSize: 18,
              color: 'var(--gs-ink-50)',
              maxWidth: 480,
              lineHeight: 1.65,
            }}
          >
            Join a community of professionals, students, and community leaders
            using their skills to create real, lasting change.
          </p>
          <div className="gs-row" style={{ gap: 16, justifyContent: 'center' }}>
            <Link to="/join" className="gs-btn gs-btn--primary gs-btn--lg">
              Apply to Volunteer →
            </Link>
            <Link to="/programs" className="gs-btn gs-btn--soft gs-btn--lg">
              See Our Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function IconStat({
  value,
  label,
  path,
  circle,
}: {
  value: string
  label: string
  path: string
  circle?: { cx: number; cy: number; r: number }
}) {
  return (
    <div>
      <span className="gs-iconbar__tile">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1B7A34"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={path} />
          {circle ? (
            <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
          ) : null}
        </svg>
      </span>
      <div>
        <div className="gs-iconbar__value gs-num">{value}</div>
        <div className="gs-iconbar__label">{label}</div>
      </div>
    </div>
  )
}

function Featured({ person }: { person: VolunteerView }) {
  const p = paletteOf(person)
  return (
    <Link
      to="/people/$volunteerId"
      params={{ volunteerId: person.slug }}
      className="gs-vfeature"
      style={{ marginBottom: 56 }}
    >
      <GWatermark width={480} height={320} style={{ opacity: 0.1 }} />
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -48,
          left: -48,
          transform: 'rotate(-15deg)',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <rect x="11" y="11" width="258" height="258" rx="56" fill="#4DC86A" />
      </svg>

      <div className="gs-vfeature__grid">
        <div style={{ position: 'relative' }}>
          <span
            className="gs-mark"
            style={{
              width: 128,
              height: 128,
              fontSize: 40,
              background: p.grad,
            }}
          >
            {person.initials}
          </span>
          <span className="gs-vfeature__badge">Featured</span>
        </div>

        <div>
          <div
            className="gs-row"
            style={{ gap: 12, marginBottom: 12, alignItems: 'center' }}
          >
            <span
              className="gs-tag gs-tag--program"
              style={{ background: p.bg, color: p.color, padding: '4px 10px' }}
            >
              <span className="gs-tag__dot" style={{ background: p.light }} />
              {person.program?.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              📍 {person.city}
            </span>
          </div>
          <h2
            style={{
              margin: '0 0 4px',
              color: '#fff',
              fontWeight: 800,
              fontSize: 29,
              letterSpacing: '-0.01em',
            }}
          >
            {person.fullName}
          </h2>
          <p style={{ margin: '0 0 16px', fontWeight: 700, color: p.light }}>
            {person.roleTitle}
          </p>
          <blockquote
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.65,
              maxWidth: 560,
            }}
          >
            “{person.quote}”
          </blockquote>
        </div>

        <div className="gs-vfeature__aside">
          <div style={{ textAlign: 'right' }}>
            <div
              className="gs-num"
              style={{ fontWeight: 800, fontSize: 40, color: '#fff' }}
            >
              {person.impactStat}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {person.impactLabel}
            </div>
          </div>
          <span className="gs-btn gs-btn--onink">View profile</span>
        </div>
      </div>
    </Link>
  )
}

function VolunteerCardLarge({ person }: { person: VolunteerView }) {
  const p = paletteOf(person)
  return (
    <Link
      to="/people/$volunteerId"
      params={{ volunteerId: person.slug }}
      className="gs-vcard"
    >
      <div
        className="gs-row"
        style={{ gap: 12, marginBottom: 16, alignItems: 'flex-start' }}
      >
        <span
          className="gs-mark"
          style={{
            width: 52,
            height: 52,
            fontSize: 17,
            letterSpacing: '-0.02em',
            background: p.grad,
          }}
        >
          {person.initials}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 15,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {person.fullName}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 12,
              fontWeight: 700,
              color: p.color,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {person.roleTitle}
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 10,
              color: 'var(--gs-ink-40)',
            }}
          >
            📍 {person.city}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            className="gs-num"
            style={{
              fontWeight: 800,
              fontSize: 18,
              lineHeight: 1,
              color: p.color,
            }}
          >
            {person.impactStat}
          </div>
          <div
            style={{
              fontSize: 9,
              color: 'var(--gs-ink-40)',
              marginTop: 2,
              maxWidth: 64,
              lineHeight: 1.3,
            }}
          >
            {person.impactLabel}
          </div>
        </div>
      </div>

      <span
        className="gs-tag gs-tag--program"
        style={{
          alignSelf: 'flex-start',
          background: p.bg,
          color: p.color,
          padding: '4px 10px',
        }}
      >
        <span className="gs-tag__dot" style={{ background: p.light }} />
        {p.programShort}
      </span>

      <blockquote className="gs-vcard__quote">“{person.quote}”</blockquote>

      <div className="gs-vcard__foot">
        <span style={{ fontSize: 10, color: 'var(--gs-ink-40)' }}>
          Since {person.joinedMonth}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>
          View profile →
        </span>
      </div>
    </Link>
  )
}
