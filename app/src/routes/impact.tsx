import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { GWatermark } from '../components/GWatermark'
import { Display } from '../components/ui'
import { formatNumber } from '../lib/format'
import type { ImpactView, OSModel } from '../data/os'

/** Impact — a faithful build of `Impact.dc.html`. */
export const Route = createFileRoute('/impact')({
  head: () => ({
    meta: [
      { title: 'Impact — Goodness Society' },
      {
        name: 'description',
        content:
          'We don’t stop at what we delivered. We measure what changed — with the evidence behind every claim.',
      },
    ],
  }),
  component: Impact,
})

const BASIS_META: Record<string, { label: string; bg: string; color: string }> =
  {
    verified: { label: 'Verified', bg: '#e6f4ea', color: '#1B7A34' },
    'self-reported': {
      label: 'Self-reported',
      bg: '#e8f0fc',
      color: '#1565C0',
    },
    observed: { label: 'Observed', bg: '#f5f0ff', color: '#6B21A8' },
    pending: { label: 'Awaiting measurement', bg: '#fff3e0', color: '#E65100' },
  }

function Impact() {
  const { os } = useOS()
  const [pick, setPick] = useState<string | null>(null)
  if (!os) return <LoadingState />

  const all = os.publishedImpact
  const totalPeople = all.reduce((n, r) => n + r.beneficiaries, 0)
  const targetsTotal = all.reduce((n, r) => n + r.targetsTotal, 0)
  const targetsHit = all.reduce((n, r) => n + r.targetsMet, 0)
  const pendingOutcomes = all.reduce(
    (n, r) => n + r.outcomes.filter((o) => o.basis === 'pending').length,
    0,
  )

  const groups = [
    ...new Map(all.map((r) => [r.programSlug, r.program])).entries(),
  ]
    .map(([slug, program]) => {
      const records = all.filter((r) => r.programSlug === slug)
      return {
        slug,
        program,
        people: records.reduce((n, r) => n + r.beneficiaries, 0),
        records: records.length,
        outcomes: records.reduce((n, r) => n + r.outcomes.length, 0),
      }
    })
    .sort((a, b) => b.people - a.people)
  const groupMax = Math.max(1, ...groups.map((g) => g.people))

  const shown = pick ? all.filter((r) => r.programSlug === pick) : all
  const picked = groups.find((g) => g.slug === pick)

  return (
    <>
      {/* Hero */}
      <section className="gs-inksection">
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
            Impact
          </span>
          <Display
            as="h1"
            onInk
            light="We don’t stop at what we delivered."
            bold="We measure what changed."
          />
          <div
            className="gs-split"
            style={{ marginTop: 32, alignItems: 'end' }}
          >
            <div>
              <div className="gs-hugefig gs-num">
                {formatNumber(totalPeople)}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 12,
                  maxWidth: 460,
                  lineHeight: 1.6,
                }}
              >
                people supported through published impact records. Counted once
                per record — someone who joins two programmes appears in both
                records.
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
              }}
            >
              <div className="gs-rail">
                <div className="gs-rail__label">Outputs</div>
                <div className="gs-rail__text">
                  What we delivered — sessions run, people trained, packs
                  distributed.
                </div>
              </div>
              <div className="gs-rail gs-rail--green">
                <div className="gs-rail__label">Outcomes</div>
                <div className="gs-rail__text">
                  What changed because of it — jobs secured, accounts opened,
                  commitments won.
                </div>
              </div>
            </div>
          </div>

          <div className="gs-inkbar gs-inkbar--4" style={{ marginTop: 40 }}>
            <div>
              <div className="gs-inkbar__big gs-num">{all.length}</div>
              <div className="gs-inkbar__cap">Published records</div>
            </div>
            <div>
              <div
                className="gs-inkbar__big gs-num"
                style={{ color: 'var(--gs-green)' }}
              >
                {all.filter((r) => r.fullyVerified).length} / {all.length}
              </div>
              <div className="gs-inkbar__cap">Fully verified evidence</div>
            </div>
            <div>
              <div className="gs-inkbar__big gs-num">
                {targetsHit} / {targetsTotal}
              </div>
              <div className="gs-inkbar__cap">Output targets met</div>
            </div>
            <div>
              <div className="gs-inkbar__big gs-num">{pendingOutcomes}</div>
              <div className="gs-inkbar__cap">
                Outcomes awaiting measurement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme breakdown */}
      <section style={{ padding: '56px 0 40px', background: '#fff' }}>
        <div className="gs-wrap">
          <p className="gs-sectionlabel" style={{ marginBottom: 10 }}>
            Where the work happened
          </p>
          <Display variant="section" light="Break it down by" bold="program" />
          <p className="gs-sub" style={{ margin: '8px 0 28px' }}>
            Click a program to see the records, targets, outcomes, and the
            evidence behind each claim.
          </p>
          <div className="gs-stack" style={{ gap: 10 }}>
            {groups.map((group) => {
              const color = group.program?.color ?? '#1B7A34'
              const on = pick === group.slug
              return (
                <button
                  key={group.slug}
                  type="button"
                  className="gs-progrow"
                  aria-pressed={on}
                  onClick={() => setPick(on ? null : group.slug)}
                >
                  <div
                    className="gs-progrow__rail"
                    style={{ background: color }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>
                      {group.program?.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        marginTop: 2,
                      }}
                    >
                      {group.records}{' '}
                      {group.records === 1 ? 'record' : 'records'} ·{' '}
                      {group.outcomes} outcomes recorded
                    </div>
                  </div>
                  <div className="gs-progrow__bar">
                    <div
                      className="gs-progrow__fill"
                      style={{
                        width: `${Math.round((group.people / groupMax) * 100)}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <div style={{ width: 96, textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{ fontSize: 19, fontWeight: 800, color }}
                      className="gs-num"
                    >
                      {formatNumber(group.people)}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--gs-ink-40)' }}>
                      people
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {on ? '✓' : '→'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Records */}
      <section style={{ padding: '8px 0 80px', background: '#fff' }}>
        <div className="gs-wrap">
          <div className="gs-stack" style={{ gap: 20 }}>
            <div className="gs-row" style={{ gap: 12, paddingTop: 12 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--gs-ink-40)',
                  fontWeight: 800,
                }}
              >
                {picked
                  ? `${picked.program?.name} — published records`
                  : 'All published records'}
              </h3>
              {pick ? (
                <button
                  type="button"
                  onClick={() => setPick(null)}
                  className="gs-filter"
                  style={{ padding: '5px 12px', fontSize: 11 }}
                >
                  Show all programs
                </button>
              ) : null}
            </div>

            {shown.map((record) => (
              <RecordCard key={record.id} record={record} os={os} />
            ))}
          </div>

          <div className="gs-legend">
            <div className="gs-minilabel" style={{ paddingTop: 2 }}>
              How to read this
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 260,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 14,
              }}
            >
              {[
                {
                  term: 'Verified',
                  color: '#1B7A34',
                  note: 'Confirmed against a document or third-party record.',
                },
                {
                  term: 'Self-reported',
                  color: '#1565C0',
                  note: 'Told to us by participants, usually via survey.',
                },
                {
                  term: 'Observed',
                  color: '#6B21A8',
                  note: 'Recorded by our team in the field.',
                },
                {
                  term: 'Awaiting measurement',
                  color: '#E65100',
                  note: 'Too early to know. We publish the date, not a guess.',
                },
              ].map((item) => (
                <div key={item.term}>
                  <div
                    style={{ fontSize: 12, fontWeight: 800, color: item.color }}
                  >
                    {item.term}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--gs-ink-50)',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              margin: '18px 0 0',
              fontSize: 11.5,
              color: 'var(--gs-ink-40)',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Draft records stay internal until published. Publishing a record
            does not verify it — verification depends on the evidence, shown
            separately on every record.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="gs-centreband">
        <div className="gs-centreband__inner">
          <Display
            variant="minor"
            light="This is what goodness looks like"
            bold="when we organize it."
          />
          <p
            style={{
              margin: '14px auto 28px',
              fontSize: 15,
              color: 'var(--gs-ink-50)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Every number on this page traces back to a mission, a verified
            volunteer, and a document you can ask to see.
          </p>
          <div className="gs-row" style={{ gap: 12, justifyContent: 'center' }}>
            <Link to="/missions" className="gs-btn gs-btn--primary gs-btn--md">
              Join a mission
            </Link>
            <Link to="/partner" className="gs-btn gs-btn--soft gs-btn--md">
              Fund this work
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function RecordCard({ record, os }: { record: ImpactView; os: OSModel }) {
  const color = record.program?.color ?? '#1B7A34'
  const bg = record.program?.bgColor ?? '#f0faf3'
  const light = record.program?.lightColor ?? '#4DC86A'
  const verification = record.fullyVerified
    ? { label: 'Evidence verified', bg: '#e6f4ea', color: '#1B7A34' }
    : record.evidenceVerified > 0
      ? {
          label: `Evidence ${record.evidenceVerified}/${record.evidenceTotal} verified`,
          bg: '#fff3e0',
          color: '#E65100',
        }
      : { label: 'Evidence pending', bg: '#eef0f3', color: '#6B7280' }

  return (
    <article className="gs-record" id={record.id}>
      <div className="gs-record__head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="gs-row" style={{ gap: 8, marginBottom: 8 }}>
            <span
              className="gs-tag gs-tag--program"
              style={{ background: bg, color }}
            >
              <span className="gs-tag__dot" style={{ background: light }} />
              {record.program?.name}
            </span>
            <span
              className="gs-tag"
              style={{ background: '#eef0f3', color: '#4B5563' }}
            >
              Published
            </span>
            <span
              className="gs-tag"
              style={{ background: verification.bg, color: verification.color }}
            >
              {verification.label}
            </span>
          </div>
          <h4
            style={{
              margin: '0 0 4px',
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            {record.title}
          </h4>
          <div style={{ fontSize: 12.5, color: 'var(--gs-ink-50)' }}>
            {[record.projectLabel, record.chapter?.city, record.dateLabel]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            style={{ fontSize: 26, fontWeight: 800, color }}
            className="gs-num"
          >
            {formatNumber(record.primaryValue)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
            {record.unitLabel}
          </div>
        </div>
      </div>

      <div className="gs-record__split">
        <div className="gs-record__outputs">
          <div className="gs-minilabel" style={{ marginBottom: 4 }}>
            Outputs · what we delivered
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--gs-ink-40)',
              marginBottom: 14,
            }}
          >
            {record.targetsTotal
              ? `${record.targetsMet} of ${record.targetsTotal} targets met`
              : 'No numeric targets set'}
          </div>
          <div className="gs-stack" style={{ gap: 12 }}>
            {record.outputs.map((output) => {
              const pct = output.target
                ? Math.round((output.value / output.target) * 100)
                : 100
              const hit = output.target ? output.value >= output.target : true
              const barColor = hit ? '#1B7A34' : '#E65100'
              return (
                <div key={output.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 10,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {output.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: barColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {output.target
                        ? `${formatNumber(output.value)} / ${formatNumber(output.target)} · ${pct}%`
                        : formatNumber(output.value)}
                    </span>
                  </div>
                  <div className="gs-thinbar">
                    <div
                      className="gs-thinbar__fill"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: barColor,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="gs-record__outcomes">
          <div
            className="gs-minilabel gs-minilabel--green"
            style={{ marginBottom: 4 }}
          >
            Outcomes · what changed
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--gs-ink-50)',
              marginBottom: 14,
            }}
          >
            Each claim shows how we know it.
          </div>
          <div className="gs-stack" style={{ gap: 16 }}>
            {record.outcomes.map((outcome) => {
              const basis = BASIS_META[outcome.basis] ?? BASIS_META.observed!
              const isPending = outcome.basis === 'pending'
              return (
                <div
                  key={outcome.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div
                    className="gs-num"
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: isPending ? '#E65100' : '#1B7A34',
                      lineHeight: 1.1,
                      minWidth: 46,
                    }}
                  >
                    {isPending || outcome.value == null
                      ? '—'
                      : formatNumber(outcome.value)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.35,
                      }}
                    >
                      {outcome.label}
                    </div>
                    <div
                      className="gs-row"
                      style={{ gap: 6, margin: '5px 0 3px' }}
                    >
                      <span
                        className="gs-basis"
                        style={{ background: basis.bg, color: basis.color }}
                      >
                        {basis.label}
                      </span>
                      {outcome.evidenceLabel ? (
                        <span
                          style={{ fontSize: 11, color: 'var(--gs-ink-50)' }}
                        >
                          {isPending
                            ? outcome.evidenceLabel
                            : `Source: ${outcome.evidenceLabel}`}
                        </span>
                      ) : null}
                    </div>
                    {outcome.note ? (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: 'var(--gs-ink-50)',
                          lineHeight: 1.5,
                        }}
                      >
                        {outcome.note}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="gs-record__foot">
        <div className="gs-row" style={{ gap: 10, marginBottom: 12 }}>
          <div className="gs-minilabel">Evidence</div>
          <div style={{ fontSize: 11.5, color: 'var(--gs-ink-50)' }}>
            {record.evidenceVerified} of {record.evidenceTotal} items verified
            by our team
          </div>
        </div>
        <div className="gs-row" style={{ gap: 8 }}>
          {record.evidence.map((item) => (
            <div
              key={item.id}
              className={`gs-evchip ${item.verified ? 'gs-evchip--verified' : ''}`}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: item.verified ? '#1B7A34' : '#9CA3AF',
                }}
              >
                {item.verified ? '✓' : '○'}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                {item.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: item.verified ? '#1B7A34' : '#9CA3AF',
                }}
              >
                {item.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
        {record.missionId && os.missionById.has(record.missionId) ? (
          <Link
            to="/missions/$missionId"
            params={{ missionId: record.missionId }}
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              display: 'inline-block',
              marginTop: 12,
            }}
          >
            See the mission behind this record →
          </Link>
        ) : null}
      </div>
    </article>
  )
}
