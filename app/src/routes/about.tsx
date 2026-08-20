import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import type { OSModel } from '../data/os'

/** About Us — a faithful build of `About.dc.html`. */
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us — Goodness Society' },
      {
        name: 'description',
        content:
          'A government-registered non-profit creating sustainable social impact through education, skills development, technology, and community empowerment.',
      },
    ],
  }),
  component: About,
})

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

const DIFFERENTIATORS = [
  {
    color: '#1B7A34',
    bg: '#f0faf3',
    paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'],
    circles: [{ cx: 12, cy: 12, r: 3 }],
    title: 'Radical Transparency',
    desc: 'Every donation, project expense, milestone, and impact report is openly documented and shared with our donors and community.',
  },
  {
    color: '#1565C0',
    bg: '#e8f0fc',
    paths: ['M3 3v16a2 2 0 0 0 2 2h16', 'M7 16v-3', 'M12 16v-6', 'M17 16V8'],
    title: 'Measurable Impact',
    desc: 'We focus on outcomes, not activities. Every initiative has clear goals, success metrics, and public reporting built in.',
  },
  {
    color: '#1B7A34',
    bg: '#f0faf3',
    paths: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
    title: 'Sustainable Change',
    desc: 'Rather than temporary assistance, we invest in programs that create long-term opportunities and self-sufficiency.',
  },
  {
    color: '#1565C0',
    bg: '#e8f0fc',
    paths: ['M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2'],
    rects: [
      { x: 4, y: 4, width: 16, height: 16, rx: 2 },
      { x: 9, y: 9, width: 6, height: 6 },
    ],
    title: 'Technology-Driven Accountability',
    desc: 'We leverage digital tools, dashboards, and public reporting systems to ensure every contribution can be tracked and verified.',
  },
]

/**
 * The team is the people who actually lead chapters, read from the network — not a fixed list.
 * The design showed stock photographs; the build uses the brand's avatar marks, so no page here
 * depends on an outside image host.
 */
function leadership(os: OSModel) {
  const seats: Array<{
    id: string
    slug: string
    name: string
    initials: string
    avatarColor: string
    role: string
  }> = []
  os.activeChapters.forEach((chapter) =>
    chapter.team
      .filter((seat) => seat.volunteer && !seat.untilLabel)
      .forEach((seat) => {
        const person = seat.volunteer!
        if (seats.some((s) => s.id === person.id)) return
        seats.push({
          id: person.id,
          slug: person.slug,
          name: person.fullName,
          initials: person.initials,
          avatarColor: person.avatarColor,
          role: `${seat.role} · ${chapter.name}`,
        })
      }),
  )
  return seats.slice(0, 8)
}

function About() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  return (
    <>
      {/* ── 01 Who we are ── */}
      <section
        style={{
          position: 'relative',
          background: '#fff',
          padding: '64px 0 80px',
          overflow: 'hidden',
        }}
      >
        <GWatermark width={500} height={380} />
        <div className="gs-wrap gs-split" style={{ gap: 64 }}>
          <div>
            <span className="gs-livepill" style={{ marginBottom: 32 }}>
              About Us
            </span>
            <Display
              as="h1"
              stacked
              light="Who we"
              bold="are"
              style={{
                margin: '0 0 24px',
                fontSize: 'clamp(40px, 5vw, 67px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 18,
                color: 'var(--gs-ink-50)',
                lineHeight: 1.65,
                maxWidth: 520,
              }}
            >
              Goodness Society is a government-registered, non-profit
              organisation dedicated to creating sustainable social impact
              through education, skills development, technology, and community
              empowerment.
            </p>
          </div>
          <div className="gs-aboutpanel">
            <GWatermark
              width={420}
              height={300}
              style={{ top: -10, right: -30, opacity: 0.18 }}
            />
            <div className="gs-aboutpanel__figures">
              <div>
                <div className="gs-num gs-aboutpanel__value">
                  {os.stats.activeChapters}
                </div>
                <div className="gs-aboutpanel__label">Active chapters</div>
              </div>
              <div>
                <div className="gs-num gs-aboutpanel__value">
                  {os.programs.filter((p) => !p.isOperations).length}
                </div>
                <div className="gs-aboutpanel__label">Programmes</div>
              </div>
              <div>
                <div className="gs-num gs-aboutpanel__value">
                  {os.stats.volunteers}
                </div>
                <div className="gs-aboutpanel__label">Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 What we believe ── */}
      <section
        style={{
          padding: '64px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
          borderBottom: '1px solid var(--gs-line-soft)',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(22px, 3vw, 35px)',
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            We believe that{' '}
            <strong style={{ fontWeight: 800, color: 'var(--gs-green-deep)' }}>
              meaningful change happens
            </strong>{' '}
            when good intentions are combined with{' '}
            <strong style={{ fontWeight: 800 }}>
              transparency, accountability, and measurable results.
            </strong>
          </p>
        </div>
      </section>

      {/* ── 03 Vision and mission ── */}
      <section style={{ padding: '96px 0', background: '#fff' }}>
        <div
          className="gs-wrap gs-split"
          style={{ gap: 32, alignItems: 'stretch' }}
        >
          <div className="gs-visioncard">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: -32,
                right: -32,
                transform: 'rotate(20deg)',
                opacity: 0.1,
                pointerEvents: 'none',
              }}
            >
              <rect
                x="8"
                y="8"
                width="184"
                height="184"
                rx="40"
                fill="#4DC86A"
              />
            </svg>
            <div style={{ position: 'relative' }}>
              <div className="gs-row" style={{ gap: 12, marginBottom: 24 }}>
                <span className="gs-tinymark">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 700,
                  }}
                >
                  Our Vision
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  color: '#fff',
                  fontWeight: 300,
                  fontSize: 21,
                  lineHeight: 1.6,
                }}
              >
                To create a society where every individual has access to{' '}
                <strong style={{ fontWeight: 800 }}>
                  opportunities that enable them to thrive,
                </strong>{' '}
                contribute, and succeed in an evolving world.
              </p>
            </div>
          </div>

          <div className="gs-missioncard">
            <div style={{ position: 'relative' }}>
              <div className="gs-row" style={{ gap: 12, marginBottom: 24 }}>
                <span className="gs-tinymark" style={{ background: '#f0faf3' }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1B7A34"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--gs-ink-50)',
                    fontWeight: 700,
                  }}
                >
                  Our Mission
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 300,
                  fontSize: 21,
                  lineHeight: 1.6,
                }}
              >
                To design and execute impactful initiatives that improve lives
                through{' '}
                <strong style={{ fontWeight: 800 }}>
                  education, workforce readiness, technology adoption,
                </strong>{' '}
                and community development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 What makes us different ── */}
      <section style={{ padding: '96px 0', background: 'var(--gs-mist)' }}>
        <div className="gs-wrap">
          <div style={{ marginBottom: 56 }}>
            <p className="gs-sectionlabel">Our Edge</p>
            <Display
              light="What makes"
              bold="us different"
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 51px)',
                lineHeight: 1.15,
              }}
            />
          </div>
          <div className="gs-split" style={{ gap: 24, alignItems: 'stretch' }}>
            {DIFFERENTIATORS.map((item) => (
              <div key={item.title} className="gs-edgecard">
                <span
                  className="gs-mark gs-mark--48"
                  style={{ background: item.bg, color: item.color }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.rects?.map((r) => (
                      <rect key={`${r.x}-${r.y}`} {...r} />
                    ))}
                    {item.circles?.map((c) => (
                      <circle key={`${c.cx}-${c.r}`} {...c} />
                    ))}
                    {item.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <h3
                  style={{
                    margin: '20px 0 8px',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Our team ── */}
      <section style={{ padding: '96px 0', background: '#fff' }}>
        <div className="gs-wrap">
          <div style={{ marginBottom: 56 }}>
            <p className="gs-sectionlabel">The People</p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 51px)',
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              Our team
            </h2>
          </div>
          <div className="gs-cols-4" style={{ gap: 24 }}>
            {leadership(os).map((member) => (
              <Link
                key={member.id}
                to="/people/$volunteerId"
                params={{ volunteerId: member.slug }}
                className="gs-teamcard"
              >
                <span
                  className="gs-mark gs-teamcard__mark"
                  style={{
                    background:
                      AVATAR_GRADIENTS[member.avatarColor] ??
                      AVATAR_GRADIENTS.green!,
                  }}
                >
                  {member.initials}
                </span>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                  {member.name}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                  }}
                >
                  {member.role}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
