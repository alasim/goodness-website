import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import { submitPartnerEnquiry } from '../data/actions'
import { formatNumber, formatShortMoney } from '../lib/format'
import type { ReactNode } from 'react'
import type { OSModel, OpportunityView } from '../data/os'

/** Partner with Us — a faithful build of `Partner.dc.html`. */
export const Route = createFileRoute('/partner')({
  head: () => ({
    meta: [
      { title: 'Partner with Us — Goodness Society' },
      {
        name: 'description',
        content:
          'Build the future with us. Whether you bring funding, expertise, or network — your involvement matters.',
      },
    ],
  }),
  component: Partner,
})

/** What a partner brings, in the design's three shapes. */
const BRINGS = [
  { value: '', label: 'Funding' },
  { value: 'employees', label: 'Employee skills & time' },
  { value: 'inkind', label: 'Technology / venue / in-kind' },
  { value: 'multiple', label: 'Several of these' },
]

const RANGES = ['Under ৳1L', '৳1–5L', '৳5–20L', '৳20L+', 'In-kind / mixed']

const PROCESS = [
  {
    num: '01',
    title: 'Submit your enquiry',
    desc: 'Fill in the form below with your organisation and partnership interests.',
  },
  {
    num: '02',
    title: 'Discovery call',
    desc: 'Our partnerships team will reach out within 48 hours for a 30-minute alignment call.',
  },
  {
    num: '03',
    title: 'Partnership proposal',
    desc: 'We draft a tailored proposal with scope, reporting cadence, and expected outcomes.',
  },
]

const PARTNER_KINDS = [
  'Corporate Partner',
  'Foundation / Grantor',
  'Educational Institution',
  'Technology Company',
  'Individual Donor',
]

function Partner() {
  const { os } = useOS()
  if (!os) return <LoadingState />

  const open = os.opportunities.filter((o) => o.open)
  const wall = os.partners.filter((p) => p.stage !== 'proposal')
  const money = (value: number) => formatShortMoney(value, os.currency)

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
        <GWatermark width={500} height={380} />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 32 }}>
            Partner with Us
          </span>
          <div style={{ maxWidth: 680 }}>
            <Display
              as="h1"
              stacked
              light="Build the future"
              bold="with us"
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
              Together, we can create meaningful, measurable, and sustainable
              change. Whether you bring funding, expertise, or network — your
              involvement matters.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 Live funding opportunities ── */}
      <section style={{ padding: '64px 0 8px', background: '#fff' }}>
        <div className="gs-wrap">
          <div className="gs-head" style={{ marginBottom: 22 }}>
            <div>
              <p className="gs-sectionlabel">Live funding opportunities</p>
              <Display
                light="Build"
                bold="measurable impact with us"
                style={{
                  margin: 0,
                  fontSize: 'clamp(26px, 3.2vw, 40px)',
                  lineHeight: 1.15,
                }}
              />
            </div>
            <Link to="/fund" style={{ fontSize: 13, fontWeight: 700 }}>
              All opportunities →
            </Link>
          </div>
          <div className="gs-minioppgrid">
            {open.slice(0, 3).map((opportunity) => (
              <MiniOpportunity
                key={opportunity.id}
                opportunity={opportunity}
                money={money}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Partnership builder ── */}
      <PartnershipBuilder os={os} money={money} />

      {/* ── 04 Our partners ── */}
      <section style={{ padding: '8px 0 56px', background: '#fff' }}>
        <div className="gs-wrap">
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--gs-ink-40)',
              fontWeight: 800,
            }}
          >
            Our partners
          </h2>
          <p
            style={{
              margin: '0 0 18px',
              fontSize: 13,
              color: 'var(--gs-ink-50)',
            }}
          >
            Every partner name opens a live page of what the partnership
            supports and what happened — a logo here is a gateway to evidence.
          </p>
          <div className="gs-row" style={{ gap: 12 }}>
            {wall.map((partner) => (
              <Link
                key={partner.id}
                to="/partners/$partnerId"
                params={{ partnerId: partner.slug }}
                className="gs-partnerpill"
              >
                <span className="gs-mark gs-mark--blue gs-mark--30">
                  {initialsOf(partner.name)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  {partner.name}
                </span>
                <span style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                  {partner.tier}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Five ways to get involved ── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--gs-mist)',
          borderTop: '1px solid var(--gs-line-soft)',
        }}
      >
        <div className="gs-wrap">
          <div style={{ marginBottom: 48 }}>
            <p className="gs-sectionlabel">Who We Collaborate With</p>
            <Display
              light="Five ways to"
              bold="get involved"
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
              }}
            />
          </div>
          <div className="gs-cols-3" style={{ gap: 20 }}>
            {partnerKinds(os).map((kind) => (
              <div key={kind.title} className="gs-kindcard">
                <span
                  className="gs-mark gs-mark--48"
                  style={{ background: kind.bg, color: kind.color }}
                >
                  {kind.icon}
                </span>
                <h3
                  style={{
                    margin: '20px 0 8px',
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {kind.title}
                </h3>
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 14,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  {kind.desc}
                </p>
                <div
                  className="gs-kindcard__benefit"
                  style={{ color: kind.color }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  {kind.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 The process ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="gs-narrow" style={{ maxWidth: 1080 }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <p className="gs-sectionlabel">The Process</p>
            <Display
              light="What happens"
              bold="next"
              style={{
                margin: 0,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.15,
              }}
            />
          </div>
          <div className="gs-cols-3" style={{ gap: 24 }}>
            {PROCESS.map((step) => (
              <div key={step.num} className="gs-stepcard">
                <span
                  className="gs-mark gs-mark--48"
                  style={{ fontSize: 14, marginBottom: 20 }}
                >
                  {step.num}
                </span>
                <h3
                  style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 16 }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
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

      {/* ── 07 Send us an enquiry ── */}
      <EnquiryForm />
    </>
  )
}

/** A compact opportunity teaser: accent rail, funding bar, what is still needed. */
function MiniOpportunity({
  opportunity,
  money,
}: {
  opportunity: OpportunityView
  money: (value: number) => string
}) {
  return (
    <Link
      to="/fund"
      className="gs-miniopp"
      style={{ borderTopColor: opportunity.urgent ? '#E65100' : '#4DC86A' }}
    >
      <span className="gs-row" style={{ gap: 6 }}>
        {opportunity.urgent ? (
          <span
            className="gs-tag"
            style={{ background: '#E65100', color: '#fff', padding: '2px 9px' }}
          >
            Urgent
          </span>
        ) : null}
        <span style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
          {opportunity.whereLabel}
        </span>
      </span>
      <span style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.3 }}>
        {opportunity.title}
      </span>
      <span className="gs-capbar" style={{ height: 8, display: 'block' }}>
        <span
          className="gs-capbar__fill"
          style={{
            display: 'block',
            width: `${opportunity.securedPct}%`,
            background: 'linear-gradient(90deg, #4DC86A, #1B7A34)',
          }}
        />
      </span>
      <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
        {money(opportunity.gap)} still needed · {opportunity.securedPct}% funded
      </span>
    </Link>
  )
}

/**
 * Partnership builder: pick a cause, a place and what you bring, see which live opportunities fit,
 * and express interest. The place list is read from the network rather than a fixed country.
 */
function PartnershipBuilder({
  os,
  money,
}: {
  os: OSModel
  money: (value: number) => string
}) {
  const [cause, setCause] = useState('')
  const [where, setWhere] = useState('')
  const [brings, setBrings] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [contact, setContact] = useState('')
  const [range, setRange] = useState('')
  const [objective, setObjective] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const places = [
    ...new Set(os.activeChapters.map((c) => c.city).filter(Boolean)),
  ]

  const matches = os.opportunities
    .filter((o) => o.open)
    .filter((o) => {
      const causeFits = !cause || o.programSlug === cause
      const whereFits = !where || (o.whereLabel ?? '').includes(where)
      return causeFits && whereFits
    })
    .slice(0, 3)

  const why = (o: OpportunityView) =>
    (cause && o.programSlug === cause
      ? 'Matches your cause'
      : 'Open to all causes') +
    (where && (o.whereLabel ?? '').includes(where) ? ` · in ${where}` : '') +
    (brings === 'employees'
      ? ' · employee volunteering welcome'
      : brings === 'inkind'
        ? ' · in-kind contributions listed'
        : '')

  const send = () => {
    if (!organisation || !contact) {
      setError(true)
      return
    }
    void submitPartnerEnquiry({
      organisation,
      contact,
      commitmentRange: range,
      objective,
      causeProgramSlug: cause,
      whereLabel: where,
      brings,
      opportunityId: matches[0]?.id ?? null,
    })
    setSent(true)
    setError(false)
  }

  return (
    <section id="build" style={{ padding: '56px 0', background: '#fff' }}>
      <div className="gs-narrow" style={{ maxWidth: 880 }}>
        <div className="gs-buildercard">
          <p className="gs-buildercard__label">Partnership builder</p>
          <Display
            onInk
            light="Tell us what matters —"
            bold="we'll match the opportunity."
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(22px, 2.8vw, 31px)',
              lineHeight: 1.2,
            }}
          />

          <div className="gs-cols-3" style={{ gap: 14, marginBottom: 18 }}>
            <Field label="What matters to you">
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                aria-label="What matters to you"
              >
                <option value="">Any cause</option>
                {os.programs
                  .filter((p) => !p.isOperations)
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.shortName ?? p.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Where">
              <select
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                aria-label="Where"
              >
                <option value="">Anywhere in the network</option>
                {places.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="You bring">
              <select
                value={brings}
                onChange={(e) => setBrings(e.target.value)}
                aria-label="You bring"
              >
                {BRINGS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {matches.length ? (
            <div className="gs-stack" style={{ gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#4DC86A' }}>
                {matches.length} opportunities fit your goals
              </div>
              {sent ? (
                <div className="gs-inknote">
                  Partnership request received — our partnerships team will
                  reach out within 48 hours. It is already in our pipeline.
                </div>
              ) : null}
              {matches.map((opportunity) => (
                <Link key={opportunity.id} to="/fund" className="gs-matchrow">
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    >
                      {opportunity.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 11.5,
                        color: 'rgba(255,255,255,0.55)',
                        marginTop: 2,
                      }}
                    >
                      {why(opportunity)}
                    </span>
                  </span>
                  <span
                    className="gs-num"
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#4DC86A',
                      flexShrink: 0,
                    }}
                  >
                    {money(opportunity.gap)} needed →
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          {!sent ? (
            <div className="gs-builderform">
              <div className="gs-builderform__label">
                Express interest — start this partnership
              </div>
              <div className="gs-cols-2" style={{ gap: 10 }}>
                <input
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Organisation name *"
                  aria-label="Organisation name"
                />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contact person & email *"
                  aria-label="Contact person and email"
                />
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  aria-label="Approximate commitment"
                >
                  <option value="">Approximate commitment…</option>
                  {RANGES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <input
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Your objective (optional)"
                  aria-label="Your objective"
                />
              </div>
              <div className="gs-row" style={{ gap: 12 }}>
                <button
                  type="button"
                  className="gs-btn gs-btn--primary gs-btn--md"
                  onClick={send}
                >
                  Start this partnership →
                </button>
                {error ? (
                  <span
                    style={{
                      fontSize: 12,
                      color: '#FFB74D',
                      fontWeight: 700,
                    }}
                  >
                    Organisation and contact are required.
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** The long-form enquiry: a full contact record for the partnerships team. */
function EnquiryForm() {
  const [name, setName] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [email, setEmail] = useState('')
  const [kind, setKind] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const submit = () => {
    if (!name || !email || !kind || !message) {
      setError(true)
      return
    }
    void submitPartnerEnquiry({
      organisation: organisation || name,
      contact: `${name} · ${email}`,
      commitmentRange: kind,
      objective: message,
    })
    setSent(true)
    setError(false)
  }

  return (
    <section
      style={{
        padding: '80px 0',
        background: 'var(--gs-mist)',
        borderTop: '1px solid var(--gs-line-soft)',
      }}
    >
      <div className="gs-narrow" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 40 }}>
          <p className="gs-sectionlabel">Get in Touch</p>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              fontWeight: 800,
            }}
          >
            Send us an enquiry
          </h2>
        </div>

        {sent ? (
          <div className="gs-thanks">
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
              Thank you!
            </h3>
            <p style={{ margin: 0, color: 'var(--gs-ink-50)', maxWidth: 360 }}>
              We've received your enquiry and will be in touch within 48 hours
              for a discovery call.
            </p>
          </div>
        ) : (
          <div className="gs-enquiryform">
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <label>
                <span className="gs-formlabel">Full Name *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label>
                <span className="gs-formlabel">Organisation</span>
                <input
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Organisation or company"
                />
              </label>
            </div>
            <div className="gs-cols-2" style={{ gap: 20 }}>
              <label>
                <span className="gs-formlabel">Email Address *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span className="gs-formlabel">Partnership Type *</span>
                <select value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option value="">Select a type...</option>
                  {PARTNER_KINDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              <span className="gs-formlabel">Message *</span>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your organisation and how you'd like to partner with Goodness Society..."
              />
            </label>
            {error ? (
              <p style={{ margin: 0, fontSize: 13, color: '#d4183d' }}>
                Please fill in all required fields (*) before sending.
              </p>
            ) : null}
            <button
              type="button"
              className="gs-btn gs-btn--primary gs-btn--block"
              style={{ padding: '14px 0', fontSize: 15 }}
              onClick={submit}
            >
              Send Enquiry →
            </button>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                textAlign: 'center',
                color: 'var(--gs-ink-50)',
              }}
            >
              We'll respond within 48 hours — hello@goodnesssociety.org
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="gs-inkfieldlabel">{label}</span>
      {children}
    </div>
  )
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/** The five ways in, each with the benefit it carries. Reach is read live, never asserted. */
function partnerKinds(os: OSModel) {
  const green = { color: '#1B7A34', bg: '#f0faf3' }
  const blue = { color: '#1565C0', bg: '#e8f0fc' }
  return [
    {
      ...green,
      icon: (
        <Icon
          paths={[
            'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z',
            'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2',
            'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2',
            'M10 6h4',
            'M10 10h4',
            'M10 14h4',
            'M10 18h4',
          ]}
        />
      ),
      title: 'Corporate Partners',
      desc: 'CSR alignment, employee volunteering, and co-branded impact programs. We help companies make social investment measurable.',
      benefit: 'Branded impact report + Employee engagement program',
    },
    {
      ...blue,
      icon: (
        <Icon
          paths={[
            'M11 17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h4',
            'M13 7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4',
            'M8 12h8',
          ]}
        />
      ),
      title: 'Foundations & Grantors',
      desc: "We design programs to meet grant objectives and provide rigorous reporting aligned with your foundation's mandate.",
      benefit: 'Quarterly grant reports + Independent evaluation',
    },
    {
      ...green,
      icon: (
        <Icon
          paths={[
            'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z',
            'M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
          ]}
        />
      ),
      title: 'Educational Institutions',
      desc: 'Co-develop curriculum, provide internship pipelines, and collaborate on research that drives community outcomes.',
      benefit: 'Co-branded curriculum + Student placement pathways',
    },
    {
      ...blue,
      icon: (
        <Icon
          paths={['M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2']}
          rects={[
            { x: 4, y: 4, width: 16, height: 16, rx: 2 },
            { x: 9, y: 9, width: 6, height: 6 },
          ]}
        />
      ),
      title: 'Technology Companies',
      desc: 'Tools, platforms, and expertise from tech partners power our digital skills programs and accountability dashboards.',
      benefit: `Visibility to ${formatNumber(os.stats.peopleSupported)}+ beneficiaries + Impact showcase`,
    },
    {
      ...green,
      icon: (
        <Icon
          paths={['M20 21a8 8 0 0 0-16 0']}
          circles={[{ cx: 12, cy: 8, r: 5 }]}
        />
      ),
      title: 'Individual Donors',
      desc: "Your personal contribution funds scholarships, equipment, and program delivery — with full transparency on how it's used.",
      benefit: 'Personal impact dashboard + Donor newsletter',
    },
  ]
}

function Icon({
  paths,
  rects,
  circles,
}: {
  paths: Array<string>
  rects?: Array<{
    x: number
    y: number
    width: number
    height: number
    rx?: number
  }>
  circles?: Array<{ cx: number; cy: number; r: number }>
}) {
  return (
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
      {rects?.map((r) => (
        <rect key={`${r.x}-${r.y}`} {...r} />
      ))}
      {circles?.map((c) => (
        <circle key={`${c.cx}-${c.cy}`} {...c} />
      ))}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
