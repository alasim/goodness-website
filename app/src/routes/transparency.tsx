import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { Display } from '../components/ui'
import { formatNumber } from '../lib/format'

/** Transparency — a faithful build of `Transparency.dc.html`. */
export const Route = createFileRoute('/transparency')({
  head: () => ({
    meta: [
      { title: 'Transparency — Goodness Society' },
      {
        name: 'description',
        content:
          'Nothing to hide. Everything to show. Every financial figure, every impact metric, and every milestone, published.',
      },
    ],
  }),
  component: Transparency,
})

/**
 * The audited 2024 report.
 *
 * These figures are a published, audited statement about a closed year — deliberately not the
 * live model, which reports 2026 to date on the Trust Ledger. The page says so where it matters:
 * the two will differ while the current year is still in progress, and blurring them would be
 * the exact thing this page exists to prevent.
 */
const AUDITED_2024 = {
  raised: '৳24.5M',
  raisedNote: 'Across 2 funding rounds',
  spent: '৳21.8M',
  spentNote: '89% utilisation rate',
  overhead: '11%',
  overheadNote: 'Below 15% benchmark',
  allocation: [
    { label: 'Programs & Activities', pct: 72, color: '#1B7A34' },
    { label: 'Operations & Staff', pct: 17, color: '#4DC86A' },
    { label: 'Administration', pct: 11, color: '#a8e6b8' },
  ],
  quarters: [
    { q: "Q1 '24", raised: 112, spent: 104 },
    { q: "Q2 '24", raised: 132, spent: 119 },
    { q: "Q3 '24", raised: 160, spent: 149 },
    { q: "Q4 '24", raised: 125, spent: 99 },
  ],
}

const MILESTONES = [
  {
    date: 'Jan 2024',
    event: 'Organisation officially registered',
    dot: '#1B7A34',
  },
  {
    date: 'Mar 2024',
    event: 'First education cohort launched — 45 participants',
    dot: '#4DC86A',
  },
  {
    date: 'May 2024',
    event: '৳82L raised in first funding round',
    dot: '#1565C0',
  },
  {
    date: 'Jun 2024',
    event:
      'AI & Digital Skills program launched in partnership with TechHub Dhaka',
    dot: '#4DC86A',
  },
  {
    date: 'Aug 2024',
    event: '500th beneficiary milestone reached',
    dot: '#1B7A34',
  },
  {
    date: 'Oct 2024',
    event: 'Second funding round — ৳1.63Cr raised',
    dot: '#1565C0',
  },
  {
    date: 'Nov 2024',
    event: 'Youth Empowerment bootcamp — 120 graduates',
    dot: '#4DC86A',
  },
  {
    date: 'Dec 2024',
    event:
      'First annual report published — audited accounts and programme results',
    dot: '#1B7A34',
  },
]

const PLEDGES = [
  {
    paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'],
    circles: [{ cx: 12, cy: 12, r: 3 }],
    title: 'Open Books',
    desc: 'All financial records are available for public review on request.',
  },
  {
    paths: ['M3 3v16a2 2 0 0 0 2 2h16', 'M7 16v-3', 'M12 16v-6', 'M17 16V8'],
    title: 'Impact Reports',
    desc: 'Quarterly reports published showing program outcomes and metrics.',
  },
  {
    paths: [
      'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    ],
    title: 'Donor Protection',
    desc: 'Your contributions are ring-fenced and allocated only to stated programs.',
  },
  {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'M14 2v4a2 2 0 0 0 2 2h4',
      'M10 9H8',
      'M16 13H8',
      'M16 17H8',
    ],
    title: 'Audit Compliance',
    desc: 'Annual independent audit conducted and results publicly disclosed.',
  },
  {
    paths: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
    title: 'Progress Tracking',
    desc: 'Every initiative has a public milestone tracker updated monthly.',
  },
]

function Transparency() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const lives = os.impact
    .filter((r) => r.published)
    .reduce((n, r) => n + r.beneficiaries, 0)

  // The donut is drawn as three arcs of one circle: each segment's length is its share of it.
  const circumference = 2 * Math.PI * 66
  let offset = 0
  const arcs = AUDITED_2024.allocation.map((slice) => {
    const length = (slice.pct / 100) * circumference
    const arc = { ...slice, length, offset }
    offset -= length
    return arc
  })

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
            <linearGradient id="thsq" x1="0" y1="0" x2="1" y2="1">
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
            fill="url(#thsq)"
          />
        </svg>
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 32 }}>
            Our Open Books
          </span>
          <div style={{ maxWidth: 760 }}>
            <Display
              as="h1"
              stacked
              reverse
              light="Everything to show."
              bold="Nothing to hide."
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
                maxWidth: 580,
              }}
            >
              We publish every financial figure, every impact metric, and every
              milestone. This page is our commitment to accountability — updated
              quarterly.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 Audited headline figures ── */}
      <section
        style={{
          padding: '48px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
          borderBottom: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-wrap gs-cols-4" style={{ gap: 24 }}>
          <AuditCard
            label="Total Raised (2024, audited)"
            value={AUDITED_2024.raised}
            note={AUDITED_2024.raisedNote}
          />
          <AuditCard
            label="Total Spent (2024, audited)"
            value={AUDITED_2024.spent}
            note={AUDITED_2024.spentNote}
          />
          <AuditCard
            label="Overhead Ratio (2024, audited)"
            value={AUDITED_2024.overhead}
            note={AUDITED_2024.overheadNote}
            green
          />
          <AuditCard
            label="People Supported"
            value={formatNumber(lives)}
            note="Backed by published impact records"
          />
        </div>
      </section>

      {/* ── 03 The three charts ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="gs-wrap gs-cols-3" style={{ gap: 32 }}>
          <div className="gs-chartcard">
            <p className="gs-chartcard__kicker">Fund Allocation</p>
            <p className="gs-chartcard__title">Where your money goes</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 180, height: 180 }}>
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  style={{ transform: 'rotate(-90deg)' }}
                  aria-hidden="true"
                >
                  {arcs.map((arc) => (
                    <circle
                      key={arc.label}
                      cx="90"
                      cy="90"
                      r="66"
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="28"
                      strokeDasharray={`${arc.length} ${circumference - arc.length}`}
                      strokeDashoffset={arc.offset}
                    />
                  ))}
                </svg>
                <div className="gs-donut__centre">
                  <div
                    className="gs-num"
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: 'var(--gs-green-deep)',
                    }}
                  >
                    {AUDITED_2024.allocation[0]!.pct}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gs-ink-50)' }}>
                    Programs
                  </div>
                </div>
              </div>
            </div>
            <div className="gs-stack" style={{ gap: 8, marginTop: 16 }}>
              {AUDITED_2024.allocation.map((slice) => (
                <div key={slice.label} className="gs-row" style={{ gap: 12 }}>
                  <span
                    className="gs-swatch"
                    style={{ background: slice.color }}
                  />
                  <span style={{ flex: 1, fontSize: 12 }}>{slice.label}</span>
                  <span
                    className="gs-num"
                    style={{ fontWeight: 700, fontSize: 12 }}
                  >
                    {slice.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="gs-chartcard">
            <p className="gs-chartcard__kicker">Quarterly Finances</p>
            <p className="gs-chartcard__title">Raised vs Spent (৳M)</p>
            <div className="gs-quarterchart">
              {AUDITED_2024.quarters.map((quarter) => (
                <div key={quarter.q} className="gs-quarterchart__col">
                  <div className="gs-quarterchart__bars">
                    <span
                      style={{ height: quarter.raised, background: '#4DC86A' }}
                    />
                    <span
                      style={{ height: quarter.spent, background: '#1B7A34' }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gs-ink-50)' }}>
                    {quarter.q}
                  </div>
                </div>
              ))}
            </div>
            <div className="gs-row" style={{ gap: 16, marginTop: 12 }}>
              <span className="gs-row" style={{ gap: 6 }}>
                <span className="gs-swatch" style={{ background: '#4DC86A' }} />
                <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                  Raised
                </span>
              </span>
              <span className="gs-row" style={{ gap: 6 }}>
                <span className="gs-swatch" style={{ background: '#1B7A34' }} />
                <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                  Spent
                </span>
              </span>
            </div>
          </div>

          <div className="gs-chartcard">
            <p className="gs-chartcard__kicker">Cumulative Impact</p>
            <p className="gs-chartcard__title">People Supported (2024)</p>
            <svg
              width="100%"
              height="180"
              viewBox="0 0 300 190"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[20, 70, 120, 170].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="#f0f0f0"
                  strokeDasharray="4 2"
                />
              ))}
              <polyline
                points="10,168 55,152 100,128 145,107 190,68 235,40 280,20"
                fill="none"
                stroke="#1B7A34"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                [10, 168],
                [55, 152],
                [100, 128],
                [145, 107],
                [190, 68],
                [235, 40],
                [280, 20],
              ].map(([cx, cy]) => (
                <circle key={cx} cx={cx} cy={cy} r="4" fill="#1B7A34" />
              ))}
            </svg>
            <div
              className="gs-row gs-row--between"
              style={{ marginTop: 4, padding: '0 2px' }}
            >
              {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'].map((m) => (
                <span
                  key={m}
                  style={{ fontSize: 10, color: 'var(--gs-ink-50)' }}
                >
                  {m}
                </span>
              ))}
            </div>
            <p
              style={{
                margin: '12px 0 0',
                fontSize: 12,
                color: 'var(--gs-ink-50)',
              }}
            >
              180 in January →{' '}
              <strong style={{ color: 'var(--gs-green-deep)' }}>
                {formatNumber(lives)} in published records
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── 04 Milestones ── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-narrow" style={{ maxWidth: 880 }}>
          <div style={{ marginBottom: 56 }}>
            <p className="gs-sectionlabel">Track Record</p>
            <Display
              light="Our"
              bold="milestones"
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
              }}
            />
          </div>
          <div className="gs-timeline">
            <span className="gs-timeline__rail" />
            <div className="gs-timeline__items">
              {MILESTONES.map((milestone) => (
                <div key={milestone.date} style={{ position: 'relative' }}>
                  <span
                    className="gs-timeline__dot"
                    style={{ background: milestone.dot }}
                  />
                  <div className="gs-timeline__card">
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        fontWeight: 700,
                      }}
                    >
                      {milestone.date}
                    </p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Donor commitments ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="gs-wrap">
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <p className="gs-sectionlabel">Our Pledge</p>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
                fontWeight: 800,
              }}
            >
              {PLEDGES.length} donor commitments
            </h2>
          </div>
          <div className="gs-cols-5" style={{ gap: 20 }}>
            {PLEDGES.map((pledge) => (
              <div key={pledge.title} className="gs-pledgecard">
                <span
                  className="gs-mark gs-mark--48"
                  style={{
                    background: '#f0faf3',
                    color: '#1B7A34',
                    margin: '0 auto 16px',
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
                    {pledge.circles?.map((c) => (
                      <circle key={c.r} {...c} />
                    ))}
                    {pledge.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14 }}>
                  {pledge.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  {pledge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Annual report ── */}
      <section
        style={{
          padding: '64px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 700 }}>
            Download our Annual Report
          </h2>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 13,
              color: 'var(--gs-ink-50)',
            }}
          >
            These are the audited 2024 figures. For {new Date().getFullYear()}{' '}
            year-to-date, line by line, see the{' '}
            <Link to="/trust" style={{ fontWeight: 700 }}>
              Trust Ledger
            </Link>{' '}
            — its overhead share differs because the year is still in progress.
          </p>
          <p
            style={{
              margin: '0 0 24px',
              color: 'var(--gs-ink-50)',
              fontSize: 14,
            }}
          >
            Full 2024 Annual Impact Report — financials, outcomes, and forward
            outlook.
          </p>
          <a
            href="mailto:hello@goodnesssociety.org?subject=Annual%20Report%20Request"
            className="gs-btn gs-btn--primary gs-btn--md"
          >
            Request PDF Report
          </a>
        </div>
      </section>
    </>
  )
}

function AuditCard({
  label,
  value,
  note,
  green,
}: {
  label: string
  value: string
  note: string
  green?: boolean
}) {
  return (
    <div className="gs-auditcard">
      <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--gs-ink-50)' }}>
        {label}
      </p>
      <p
        className="gs-num"
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 800,
          color: green ? 'var(--gs-green-deep)' : undefined,
        }}
      >
        {value}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--gs-ink-50)' }}>
        {note}
      </p>
    </div>
  )
}
