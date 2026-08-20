import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Empty, Section } from '../../components/ui'
import { formatNumber } from '../../lib/format'
import type { JourneyLevel } from '../../lib/types'

/** Goodness Passport — a faithful build of `Volunteer Profile.dc.html`. */
export const Route = createFileRoute('/people/$volunteerId')({
  component: Passport,
})

/** The journey is the four levels in order; a passport sits on exactly one of them. */
const JOURNEY: Array<JourneyLevel> = [
  'Volunteer',
  'Senior Volunteer',
  'Team Lead',
  'Chapter Lead',
]

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

const PANEL_LABEL: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'var(--gs-ink-40)',
  fontWeight: 800,
}

function Passport() {
  const { volunteerId } = Route.useParams()
  const { os } = useOS()
  if (!os) return <LoadingState />

  const person = os.personBySlug.get(volunteerId)
  if (!person) {
    return (
      <Section>
        <Empty>
          No passport with that reference.{' '}
          <Link to="/people">Browse people</Link>.
        </Empty>
      </Section>
    )
  }

  const color = person.program?.color ?? '#1B7A34'
  const bg = person.program?.bgColor ?? '#f0faf3'
  const light = person.program?.lightColor ?? '#4DC86A'
  const grad = AVATAR_GRADIENTS[person.avatarColor] ?? AVATAR_GRADIENTS.green!
  const band = `linear-gradient(135deg, ${light} 0%, ${color} 100%)`
  const firstName = person.fullName.split(' ')[0] ?? person.fullName

  // The chapter line reads "Goodness Dhaka · Operations Lead" when this person holds a team seat.
  const chapter = person.chapter
    ? os.chapterById.get(person.chapter.id)
    : undefined
  const seat = chapter?.team.find(
    (t) => t.volunteer?.id === person.id && !t.untilLabel,
  )
  const chapterLine = chapter
    ? `${chapter.name}${seat ? ` · ${seat.role}` : ''}`
    : 'National network'

  const levelIndex = JOURNEY.indexOf(person.level)
  const certificate = person.credentials.find(
    (c) => c.title === 'Certificate of Volunteer Service',
  )
  const certEnabled = person.certificateEnabled && Boolean(certificate)

  return (
    <div className="gs-narrow" style={{ maxWidth: 1080 }}>
      <Link to="/people" className="gs-backlink" style={{ marginBottom: 20 }}>
        ← All volunteers
      </Link>

      {/* ── Passport card ── */}
      <section className="gs-inkhero" style={{ padding: 40, marginBottom: 24 }}>
        <GWatermark width={420} height={280} style={{ opacity: 0.08 }} />

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative' }}>
            <span
              className="gs-mark"
              style={{
                width: 120,
                height: 120,
                fontSize: 38,
                background: grad,
              }}
            >
              {person.initials}
            </span>
            <span className="gs-verifiedchip">✓ Verified</span>
          </div>

          <div>
            <div
              className="gs-row"
              style={{ gap: 10, marginBottom: 10, alignItems: 'center' }}
            >
              <span
                className="gs-tag gs-tag--program"
                style={{ background: bg, color, padding: '4px 10px' }}
              >
                <span className="gs-tag__dot" style={{ background: light }} />
                {person.program?.name}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                {chapterLine}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                · Since {person.joinedMonth}
              </span>
              {person.sustainingMember ? (
                <span className="gs-sustainchip">
                  Sustaining Member ✓
                  {person.sustainingSince
                    ? ` · since ${person.sustainingSince}`
                    : ''}
                </span>
              ) : null}
            </div>

            <h1
              style={{
                margin: '0 0 4px',
                color: '#fff',
                fontWeight: 800,
                fontSize: 37,
                letterSpacing: '-0.015em',
                lineHeight: 1.1,
              }}
            >
              {person.fullName}
            </h1>
            <p
              style={{
                margin: '0 0 14px',
                fontWeight: 700,
                fontSize: 15,
                color: light,
              }}
            >
              {person.roleTitle}
            </p>
            <blockquote
              style={{
                margin: 0,
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.6,
                maxWidth: 520,
                fontSize: 14,
              }}
            >
              “{person.quote}”
            </blockquote>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 10,
              flexShrink: 0,
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              Goodness Passport
            </div>
            <div
              className="gs-num"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {person.goodnessId}
            </div>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                color: 'var(--gs-ink)',
                background: '#fff',
              }}
            >
              {person.level}
            </span>
          </div>
        </div>

        <div className="gs-inkbar" style={{ marginTop: 32 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }} className="gs-num">
              {formatNumber(person.totalMissions)}
            </div>
            <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
              Missions
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: 'var(--gs-green)',
              }}
              className="gs-num"
            >
              {formatNumber(person.totalHours)}
            </div>
            <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
              Verified service hours
            </div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }} className="gs-num">
              {formatNumber(person.programsCount)}
            </div>
            <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
              Programs
            </div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }} className="gs-num">
              {person.impactStat}
            </div>
            <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
              {person.impactLabel}
            </div>
          </div>
        </div>
      </section>

      <div
        className="gs-detailgrid"
        style={{ gridTemplateColumns: '1.2fr 0.8fr' }}
      >
        <div className="gs-detailcol">
          {/* ── About + skills ── */}
          <section className="gs-panelcard">
            <h2 style={PANEL_LABEL}>About</h2>
            <p
              style={{
                margin: '12px 0 0',
                fontSize: 14,
                color: '#374151',
                lineHeight: 1.7,
              }}
            >
              {person.bio}
            </p>
            <h2 style={{ ...PANEL_LABEL, marginTop: 24 }}>Skills</h2>
            <div className="gs-row" style={{ gap: 8, marginTop: 12 }}>
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: bg,
                    color,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* ── Downloads ── */}
          <section className="gs-panelcard">
            <h2 style={PANEL_LABEL}>Downloads</h2>
            <p
              style={{
                margin: '4px 0 20px',
                fontSize: 12,
                color: 'var(--gs-ink-40)',
              }}
            >
              Official branded assets for {firstName} — issued and controlled by
              Goodness Society.
            </p>

            <div className="gs-stack" style={{ gap: 12 }}>
              {certEnabled ? (
                <div className="gs-assetrow gs-assetrow--on">
                  <span className="gs-mark gs-mark--44">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
                    </svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      Certificate of Volunteer Service
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        marginTop: 2,
                      }}
                    >
                      Ref {certificate?.ref} · issued &amp; enabled by admin
                    </div>
                  </div>
                  <Link
                    to="/studio"
                    search={{ card: 'credential', person: person.slug }}
                    className="gs-btn gs-btn--primary gs-btn--sm"
                  >
                    Open &amp; download
                  </Link>
                </div>
              ) : (
                <div className="gs-assetrow gs-assetrow--off">
                  <span className="gs-mark gs-mark--44 gs-mark--locked">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: 'var(--gs-ink-50)',
                      }}
                    >
                      Certificate of Volunteer Service
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-40)',
                        marginTop: 2,
                      }}
                    >
                      Not yet issued — becomes available once enabled by the
                      admin team
                    </div>
                  </div>
                  <span className="gs-lockchip">Locked</span>
                </div>
              )}

              <div className="gs-assetrow">
                <span className="gs-mark gs-mark--44 gs-mark--ink">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4DC86A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.6 13.5 6.8 4" />
                    <path d="m15.4 6.5-6.8 4" />
                  </svg>
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    Share this moment
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--gs-ink-50)',
                      marginTop: 2,
                    }}
                  >
                    Cards pre-filled from live verified records — numbers
                    locked, never typed
                  </div>
                </div>
                <Link
                  to="/studio"
                  search={{ person: person.slug }}
                  className="gs-btn gs-btn--ghost gs-btn--sm"
                >
                  Open Share Studio →
                </Link>
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
                  QUICK CARDS:
                </span>
                {[
                  { card: 'identity', label: 'My identity' },
                  { card: 'hours', label: 'Hour milestone' },
                  { card: 'missions', label: 'Mission milestone' },
                  { card: 'credential', label: 'Credential' },
                  { card: 'yearme', label: 'My Year in Goodness' },
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
            </div>
          </section>
        </div>

        <div className="gs-detailcol">
          {/* ── Journey ── */}
          <section className="gs-panelcard">
            <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>Journey</h2>
            <div>
              {JOURNEY.map((label, i) => (
                <JourneyStep
                  key={label}
                  label={label}
                  reached={i <= levelIndex}
                  current={i === levelIndex}
                  passed={i < levelIndex}
                  last={i === JOURNEY.length - 1}
                />
              ))}
            </div>
          </section>

          {/* ── Credentials ── */}
          <section className="gs-panelcard">
            <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>Credentials</h2>
            <div className="gs-stack" style={{ gap: 12 }}>
              {person.credentials.map((credential) => {
                const valid = credential.status === 'valid'
                return (
                  <div key={credential.id} className="gs-credrow">
                    <span
                      className="gs-credrow__icon"
                      style={{
                        background: valid ? '#f0faf3' : '#fdecec',
                        color: valid ? '#1B7A34' : '#d4183d',
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        {credential.title}
                      </div>
                      <div
                        className="gs-num"
                        style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}
                      >
                        {credential.ref} · {credential.issuedLabel}
                      </div>
                    </div>
                    <Link
                      to="/verify"
                      search={{ ref: credential.ref }}
                      className="gs-tag"
                      style={{
                        background: valid ? '#f0faf3' : '#fdecec',
                        color: valid ? '#1B7A34' : '#d4183d',
                      }}
                    >
                      {valid ? 'Valid' : 'Revoked'}
                    </Link>
                  </div>
                )
              })}
            </div>
          </section>

          <Link
            to="/join"
            className="gs-btn gs-btn--block"
            style={{
              padding: '16px 0',
              fontSize: 15,
              background: band,
              color: '#fff',
            }}
          >
            Volunteer like {firstName} →
          </Link>
        </div>
      </div>
    </div>
  )
}

/** One rung of the journey: a ring, the line to the next rung, and its state note. */
function JourneyStep({
  label,
  reached,
  current,
  passed,
  last,
}: {
  label: string
  reached: boolean
  current: boolean
  passed: boolean
  last: boolean
}) {
  return (
    <div className="gs-row" style={{ gap: 12, alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `2px solid ${reached ? '#1B7A34' : '#D1D5DB'}`,
            background: current ? '#1B7A34' : reached ? '#4DC86A' : '#fff',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: 2,
            height: 28,
            background: last ? 'transparent' : passed ? '#4DC86A' : '#E5E7EB',
          }}
        />
      </div>
      <div style={{ marginTop: -2, paddingBottom: 12 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: current ? 800 : 600,
            color: reached ? 'var(--gs-ink)' : 'var(--gs-ink-40)',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
          {current ? 'Current level' : reached ? 'Completed' : 'Next step'}
        </div>
      </div>
    </div>
  )
}
