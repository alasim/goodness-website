import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { Display } from '../components/ui'
import { formatNumber } from '../lib/format'
import type { OSModel } from '../data/os'

/** Our Programs — a faithful build of `Programs.dc.html`. */
export const Route = createFileRoute('/programs')({
  head: () => ({
    meta: [
      { title: 'Our Programs — Goodness Society' },
      {
        name: 'description',
        content:
          'Five pathways to lasting change. Every program is designed with measurable goals, community input, and public accountability.',
      },
    ],
  }),
  component: Programs,
})

/**
 * Taglines, descriptions and goals are editorial copy from the design — the programme record
 * carries no prose. Everything countable on this page is derived from the platform's own records.
 */
const COPY: Record<
  string,
  { tagline: string; desc: string; goals: Array<string>; paths: Array<string> }
> = {
  'education-career-readiness': {
    tagline: 'Preparing for modern careers',
    desc: 'We prepare students and young professionals for modern careers through practical training, industry mentorship, and real-world project exposure.',
    goals: [
      'Train 500+ students annually in career-ready skills',
      'Partner with 15+ companies for internship placements',
      'Achieve 80%+ employment rate within 6 months of graduation',
      'Deliver CV writing, interview prep, and portfolio building',
    ],
    paths: [
      'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z',
      'M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
    ],
  },
  'ai-digital-skills': {
    tagline: 'Future-proofing the workforce',
    desc: 'Helping individuals adapt to the future of work through AI literacy, automation training, and technology-focused learning programs.',
    goals: [
      'Deliver AI literacy to 1,000 individuals annually',
      'Train 200 professionals in automation and no-code tools',
      'Build a community of AI-enabled graduates in the region',
      'Partner with tech companies for live tooling access',
    ],
    paths: ['M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2'],
  },
  'youth-empowerment': {
    tagline: 'Unlocking the next generation',
    desc: 'Supporting young people aged 16–30 with skills, resources, mentorship networks, and opportunities that unlock their potential.',
    goals: [
      'Reach 800 young people through skills bootcamps',
      'Establish mentorship circles in 5 cities',
      'Award 50 micro-grants to youth-led initiatives annually',
      'Build a youth alumni network of 2,000+ members',
    ],
    paths: [
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
      'M22 21v-2a4 4 0 0 0-3-3.87',
      'M16 3.13a4 4 0 0 1 0 7.75',
    ],
  },
  'community-development': {
    tagline: 'Grassroots change at scale',
    desc: 'Launching initiatives that address local challenges and improve quality of life through collaborative, community-led action.',
    goals: [
      'Launch 3 community development projects per year',
      'Engage 50+ community leaders and stakeholders',
      'Deliver infrastructure and resource support to underserved areas',
      'Track and publish community well-being metrics annually',
    ],
    paths: ['M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20'],
  },
  'innovation-social-good': {
    tagline: 'Technology as a change agent',
    desc: 'Exploring and deploying technology-driven solutions that create scalable and lasting social impact.',
    goals: [
      'Launch 2 social-good tech products per cycle',
      'Open-source all non-proprietary tools and methodologies',
      'Partner with universities for research and co-development',
      'Create an innovation grant fund for social entrepreneurs',
    ],
    paths: [
      'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
      'M9 18h6',
      'M10 22h4',
    ],
  },
}

/** Programme figures come from published records and real partnerships, never from a fixed list. */
function figuresOf(os: OSModel, slug: string) {
  const records = os.impact.filter((r) => r.published && r.programSlug === slug)
  return {
    participants: records.reduce((n, r) => n + r.beneficiaries, 0),
    partners: os.partners.filter(
      (p) => p.stage !== 'proposal' && p.programs.some((x) => x.slug === slug),
    ).length,
    live: os.openMissions.some((m) => m.programSlug === slug),
  }
}

function Programs() {
  const { os } = useOS()
  const [expanded, setExpanded] = useState<string | null>(
    'education-career-readiness',
  )

  if (!os) return <LoadingState />
  const programmes = os.programs.filter((p) => !p.isOperations)

  return (
    <>
      {/* ── 01 Hero ── */}
      <section
        style={{
          position: 'relative',
          background: '#fff',
          padding: '64px 0 80px',
          overflow: 'hidden',
        }}
      >
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            transform: 'rotate(25deg)',
            opacity: 0.05,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="phsq" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4DC86A" />
              <stop offset="100%" stopColor="#1B7A34" />
            </linearGradient>
          </defs>
          <rect
            x="16"
            y="16"
            width="368"
            height="368"
            rx="80"
            fill="url(#phsq)"
          />
        </svg>
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 32 }}>
            Our Programs
          </span>
          <div style={{ maxWidth: 680 }}>
            <Display
              as="h1"
              stacked
              light={`${programmes.length} pathways to`}
              bold="lasting change"
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
              }}
            >
              Every program is designed with measurable goals, community input,
              and public accountability. We build for outcomes — not outputs.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 The programmes ── */}
      <section style={{ padding: '0 0 96px', background: '#fff' }}>
        <div className="gs-wrap gs-stack" style={{ gap: 20 }}>
          {programmes.map((program) => {
            const copy = COPY[program.slug]
            const figures = figuresOf(os, program.slug)
            const open = expanded === program.slug
            return (
              <div key={program.slug} className="gs-programrow">
                <button
                  type="button"
                  className="gs-programrow__head"
                  aria-expanded={open}
                  onClick={() => setExpanded(open ? null : program.slug)}
                >
                  <span
                    className="gs-mark gs-mark--48"
                    style={{
                      background: program.bgColor,
                      color: program.color,
                      marginTop: 2,
                    }}
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
                      {program.slug === 'ai-digital-skills' ? (
                        <>
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                          <rect x="9" y="9" width="6" height="6" />
                        </>
                      ) : null}
                      {program.slug === 'youth-empowerment' ? (
                        <circle cx="9" cy="7" r="4" />
                      ) : null}
                      {program.slug === 'community-development' ? (
                        <circle cx="12" cy="12" r="10" />
                      ) : null}
                      {(copy?.paths ?? []).map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </svg>
                  </span>

                  <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <span
                      className="gs-row"
                      style={{ gap: 12, marginBottom: 4 }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 700 }}>
                        {program.name}
                      </span>
                      <span
                        className="gs-statuschip"
                        style={{
                          background: figures.live ? '#f0faf3' : '#fff3e0',
                          color: figures.live ? '#1B7A34' : '#E65100',
                        }}
                      >
                        {figures.live ? 'Active' : 'Between cohorts'}
                      </span>
                    </span>
                    <span
                      style={{
                        display: 'block',
                        color: 'var(--gs-ink-50)',
                        fontSize: 14,
                      }}
                    >
                      {copy?.tagline}
                    </span>
                  </span>

                  <span
                    className="gs-row"
                    style={{ gap: 32, flexShrink: 0, marginRight: 16 }}
                  >
                    <span style={{ textAlign: 'center' }}>
                      <span
                        className="gs-num"
                        style={{
                          display: 'block',
                          fontWeight: 800,
                          color: program.color,
                        }}
                      >
                        {formatNumber(figures.participants)}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                        Participants
                      </span>
                    </span>
                    <span style={{ textAlign: 'center' }}>
                      <span
                        className="gs-num"
                        style={{
                          display: 'block',
                          fontWeight: 800,
                          color: program.color,
                        }}
                      >
                        {figures.partners}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                        Partners
                      </span>
                    </span>
                  </span>

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      marginTop: 4,
                      transition: 'transform 0.3s',
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {open ? (
                  <div className="gs-programrow__body">
                    <div className="gs-split" style={{ gap: 32 }}>
                      <div>
                        <p
                          style={{
                            margin: '0 0 24px',
                            color: 'var(--gs-ink-50)',
                            lineHeight: 1.65,
                          }}
                        >
                          {copy?.desc}
                        </p>
                        <Link
                          to="/join"
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: program.color,
                          }}
                        >
                          Volunteer for this program →
                        </Link>
                      </div>
                      <div>
                        <p
                          className="gs-nearlabel"
                          style={{ marginBottom: 16 }}
                        >
                          Program Goals
                        </p>
                        <ul className="gs-goallist">
                          {(copy?.goals ?? []).map((goal) => (
                            <li key={goal}>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ stroke: program.color }}
                                aria-hidden="true"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                              <span style={{ fontSize: 14 }}>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 03 Support a program ── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <Display
            stacked
            light="Support a program that"
            bold="changes lives"
            boldColor="var(--gs-green-deep)"
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(29px, 4vw, 48px)',
              lineHeight: 1.15,
            }}
          />
          <p
            style={{
              margin: '0 auto 32px',
              color: 'var(--gs-ink-50)',
              maxWidth: 440,
            }}
          >
            Partner with us to fund, sponsor, or co-design a program initiative.
          </p>
          <div className="gs-row" style={{ gap: 16, justifyContent: 'center' }}>
            <Link to="/partner" className="gs-btn gs-btn--primary gs-btn--md">
              Partner with Us →
            </Link>
            <Link to="/join" className="gs-btn gs-btn--soft gs-btn--md">
              Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
