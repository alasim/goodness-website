import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import { submitApplication } from '../data/actions'
import { formatNumber } from '../lib/format'
import type { ReactNode } from 'react'
import type { OSModel } from '../data/os'

/** Volunteer with Us — a faithful build of `Volunteer.dc.html`. */
export const Route = createFileRoute('/join')({
  head: () => ({
    meta: [
      { title: 'Volunteer with Us — Goodness Society' },
      {
        name: 'description',
        content:
          "Give your time. Change a life. Whether you're a professional, student, or community member — your skills and time can drive real change.",
      },
    ],
  }),
  component: Join,
})

const AVAILABILITY = [
  'Weekdays (daytime)',
  'Weekday evenings',
  'Weekends only',
  'Flexible / As needed',
  'Full-time commitment (3+ months)',
]

/**
 * Programme taglines are editorial copy from the design; the programme record carries no summary.
 * Everything else about a programme on this page — its roles, its status — is read from the data.
 */
const TAGLINES: Record<string, string> = {
  'education-career-readiness': 'Preparing for modern careers',
  'ai-digital-skills': 'Future-proofing the workforce',
  'youth-empowerment': 'Unlocking the next generation',
  'community-development': 'Grassroots change at scale',
  'innovation-social-good': 'Technology as a change agent',
}

const PROGRAM_ICONS: Record<string, Array<string>> = {
  'education-career-readiness': [
    'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z',
    'M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
  ],
  'ai-digital-skills': [
    'M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2',
  ],
  'youth-empowerment': [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  'community-development': [
    'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
    'M2 12h20',
  ],
  'innovation-social-good': [
    'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
    'M9 18h6',
    'M10 22h4',
  ],
}

const BENEFITS = [
  {
    paths: [
      'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    ],
    title: 'Make Real Impact',
    desc: 'Your skills directly support people building better futures for themselves.',
  },
  {
    paths: [
      'M11 17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h4',
      'M13 7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4',
      'M8 12h8',
    ],
    title: 'Grow Your Network',
    desc: 'Connect with professionals, community leaders, and change-makers across sectors.',
  },
  {
    paths: [
      'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z',
      'M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
    ],
    title: 'Develop Skills',
    desc: 'Gain facilitation, project management, and social impact experience.',
  },
  {
    paths: ['m9 12 2 2 4-4'],
    circles: [{ cx: 12, cy: 12, r: 10 }],
    title: 'Verified Reference',
    desc: 'Receive an official volunteer reference letter from Goodness Society.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Submit application',
    desc: 'Fill in the form below with your background and area of interest.',
  },
  {
    num: '02',
    title: 'Screening call',
    desc: 'A 20-minute call with our volunteer coordinator to align on fit and expectations.',
  },
  {
    num: '03',
    title: 'Onboarding session',
    desc: 'Join a virtual or in-person orientation to meet the team and understand your role.',
  },
  {
    num: '04',
    title: 'Start volunteering',
    desc: 'Begin contributing — your impact starts from day one.',
  },
]

/** Roles a programme actually asks for, read from its missions rather than a fixed list. */
function rolesOf(os: OSModel, slug: string): Array<string> {
  const roles = new Set<string>()
  os.missions
    .filter((m) => m.programSlug === slug)
    .forEach((m) => m.roles.forEach((r) => roles.add(r.role)))
  return [...roles].sort()
}

function Join() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const programmes = os.programs.filter((p) => !p.isOperations)
  const missionHours = os.openMissions.map((m) => m.hours)
  const averageCommitment = missionHours.length
    ? Math.round(missionHours.reduce((n, h) => n + h, 0) / missionHours.length)
    : 0

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
        <GWatermark width={500} height={360} />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 32 }}>
            Volunteer with Us
          </span>
          <div style={{ maxWidth: 680 }}>
            <Display
              as="h1"
              stacked
              light="Give your time."
              bold="Change a life."
              boldColor="var(--gs-green-deep)"
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
              Whether you're a professional, student, or community member — your
              skills and time can drive real change for the people in our
              programs.
            </p>
          </div>
          <div className="gs-row" style={{ gap: 40, marginTop: 40 }}>
            <HeroFigure
              value={`${formatNumber(os.people.length)}+`}
              label="Active Volunteers"
            />
            <HeroFigure
              value={String(programmes.length)}
              label="Programs to Support"
            />
            <HeroFigure
              value={`${averageCommitment}hrs`}
              label="Avg. Mission Commitment"
            />
          </div>
        </div>
      </section>

      {/* ── 02 What you gain ── */}
      <section
        style={{
          padding: '64px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
          borderBottom: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-wrap">
          <p className="gs-sectionlabel">Why Volunteers Love Us</p>
          <h2
            style={{
              margin: '0 0 40px',
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              fontWeight: 800,
            }}
          >
            What you gain
          </h2>
          <div className="gs-cols-4" style={{ gap: 20 }}>
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="gs-gaincard">
                <span
                  className="gs-mark gs-mark--44"
                  style={{ background: '#f0faf3', color: '#1B7A34' }}
                >
                  <Icon paths={benefit.paths} circles={benefit.circles} />
                </span>
                <h3
                  style={{
                    margin: '16px 0 4px',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Open roles ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="gs-wrap">
          <p className="gs-sectionlabel">Open Roles</p>
          <Display
            light="Find your"
            bold="place"
            style={{
              margin: '0 0 40px',
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
            }}
          />
          <div className="gs-stack" style={{ gap: 20 }}>
            {programmes.map((program) => {
              const roles = rolesOf(os, program.slug)
              const live = os.openMissions.some(
                (m) => m.programSlug === program.slug,
              )
              return (
                <div key={program.slug} className="gs-rolecard">
                  <div
                    className="gs-row"
                    style={{
                      gap: 16,
                      marginBottom: 20,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      className="gs-mark"
                      style={{
                        width: 40,
                        height: 40,
                        background: program.bgColor,
                        color: program.color,
                      }}
                    >
                      <Icon paths={PROGRAM_ICONS[program.slug] ?? []} />
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>
                        {program.name}
                      </h3>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: 12,
                          color: 'var(--gs-ink-50)',
                        }}
                      >
                        {TAGLINES[program.slug]}
                      </p>
                    </div>
                    <span
                      className="gs-statuschip"
                      style={{
                        marginLeft: 'auto',
                        background: live ? '#f0faf3' : '#fff3e0',
                        color: live ? '#1B7A34' : '#E65100',
                      }}
                    >
                      {live ? 'Active' : 'Between cohorts'}
                    </span>
                  </div>
                  <div className="gs-row" style={{ gap: 8 }}>
                    {roles.map((role) => (
                      <span
                        key={role}
                        className="gs-rolechip"
                        style={{
                          color: program.color,
                          background: program.bgColor,
                          borderColor: `${program.lightColor}40`,
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 04 How to join ── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-narrow" style={{ maxWidth: 1080 }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <p className="gs-sectionlabel">The Process</p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              How to join
            </h2>
          </div>
          <div className="gs-cols-4" style={{ gap: 20 }}>
            {STEPS.map((step) => (
              <div key={step.num} className="gs-gaincard">
                <span className="gs-mark gs-mark--44" style={{ fontSize: 14 }}>
                  {step.num}
                </span>
                <h3
                  style={{
                    margin: '16px 0 4px',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Application ── */}
      <ApplicationForm os={os} />
    </>
  )
}

function HeroFigure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="gs-num"
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: 'var(--gs-green-deep)',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 14, color: 'var(--gs-ink-50)' }}>{label}</div>
    </div>
  )
}

function ApplicationForm({ os }: { os: OSModel }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [program, setProgram] = useState('')
  const [role, setRole] = useState('')
  const [availability, setAvailability] = useState('')
  const [experience, setExperience] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const programmes = os.programs.filter((p) => !p.isOperations)
  const roles = program ? rolesOf(os, program) : []

  const submit = () => {
    if (
      !first ||
      !last ||
      !email ||
      !city ||
      !program ||
      !availability ||
      !why
    ) {
      setError(true)
      return
    }
    void submitApplication({
      fullName: `${first} ${last}`.trim(),
      email,
      phone: phone || null,
      city,
      chapterId: null,
      programSlug: program,
      roleTitle: role || null,
      skills: experience || null,
      availability,
      why,
      experience: experience || null,
    })
    setSent(true)
    setError(false)
  }

  return (
    <section
      id="apply"
      style={{
        padding: '80px 0',
        background: '#fff',
        borderTop: '1px solid var(--gs-line-soft)',
      }}
    >
      <div className="gs-narrow" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 40 }}>
          <p className="gs-sectionlabel">Apply Now</p>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              fontWeight: 800,
            }}
          >
            Volunteer application
          </h2>
        </div>

        {sent ? (
          <div className="gs-thanks" style={{ padding: 56 }}>
            <span className="gs-mark" style={{ width: 64, height: 64 }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <h3 style={{ margin: '20px 0 8px', fontWeight: 700, fontSize: 21 }}>
              Application received!
            </h3>
            <p
              style={{
                margin: 0,
                color: 'var(--gs-ink-50)',
                maxWidth: 360,
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Thank you for applying. Our volunteer coordinator will reach out
              within 3–5 business days to schedule a screening call. Once
              approved, your Goodness Passport goes live.
            </p>
            <Link
              to="/me"
              className="gs-btn gs-btn--primary gs-btn--md"
              style={{ marginTop: 20 }}
            >
              Go to My Goodness →
            </Link>
          </div>
        ) : (
          <div className="gs-enquiryform">
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <Field label="First Name *">
                <input
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="First name"
                />
              </Field>
              <Field label="Last Name *">
                <input
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="Last name"
                />
              </Field>
            </div>
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <Field label="Email Address *">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </Field>
            </div>
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <Field label="City / Location *">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={`${[
                    ...new Set(os.activeChapters.map((c) => c.city)),
                  ]
                    .slice(0, 2)
                    .join(', ')}, Remote...`}
                />
              </Field>
              <Field label="Program of Interest *">
                <select
                  value={program}
                  onChange={(e) => {
                    setProgram(e.target.value)
                    setRole('')
                  }}
                >
                  <option value="">Select a program...</option>
                  {programmes.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <Field label="Volunteer Role">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!program}
                >
                  <option value="">
                    {program ? 'Select a role...' : 'Select a program first'}
                  </option>
                  {roles.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Availability *">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Select availability...</option>
                  {AVAILABILITY.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Relevant Experience / Background">
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. Software engineer with 5 years experience, Teacher, HR Professional..."
              />
            </Field>
            <Field label="Why do you want to volunteer? *">
              <textarea
                rows={4}
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Tell us what drives you to contribute to Goodness Society's mission..."
              />
            </Field>
            {error ? (
              <p style={{ margin: 0, fontSize: 13, color: '#d4183d' }}>
                Please fill in all required fields (*) before submitting.
              </p>
            ) : null}
            <button
              type="button"
              className="gs-btn gs-btn--primary gs-btn--block"
              style={{ padding: '14px 0', fontSize: 15 }}
              onClick={submit}
            >
              Submit Application →
            </button>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                textAlign: 'center',
                color: 'var(--gs-ink-50)',
              }}
            >
              Questions? Email us at{' '}
              <a href="mailto:volunteers@goodnesssociety.org">
                volunteers@goodnesssociety.org
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label>
      <span className="gs-formlabel">{label}</span>
      {children}
    </label>
  )
}

function Icon({
  paths,
  circles,
}: {
  paths: Array<string>
  circles?: Array<{ cx: number; cy: number; r: number }>
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {circles?.map((c) => (
        <circle key={`${c.cx}-${c.cy}`} {...c} />
      ))}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
