import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Bar, Pill, Section, Stat } from '../components/ui'
import { BASIS_LABEL, formatNumber } from '../lib/format'
import type { ImpactView } from '../data/os'
import type { Tone } from '../components/ui'

export const Route = createFileRoute('/impact')({
  head: () => ({
    meta: [
      { title: 'Impact — Goodness Society' },
      {
        name: 'description',
        content:
          'What we delivered and what changed, with the evidence behind it and an honest note on what is still being measured.',
      },
    ],
  }),
  component: Impact,
})

const BASIS_TONE: Record<string, Tone> = {
  verified: 'green',
  'self-reported': 'neutral',
  observed: 'blue',
  pending: 'amber',
}

function Impact() {
  const { os } = useOS()
  const [program, setProgram] = useState('all')
  if (!os) return <LoadingState />

  const records = os.publishedImpact.filter(
    (r) => program === 'all' || r.programSlug === program,
  )
  const byProgram = os.programs
    .filter((p) => !p.isOperations)
    .map((p) => ({
      program: p,
      people: os.publishedImpact
        .filter((r) => r.programSlug === p.slug)
        .reduce((n, r) => n + r.beneficiaries, 0),
      records: os.publishedImpact.filter((r) => r.programSlug === p.slug)
        .length,
    }))
    .filter((row) => row.records > 0)
  const largest = Math.max(1, ...byProgram.map((row) => row.people))
  const targetsMet = os.publishedImpact.reduce((n, r) => n + r.targetsMet, 0)
  const targetsTotal = os.publishedImpact.reduce(
    (n, r) => n + r.targetsTotal,
    0,
  )

  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="We don’t stop at what we delivered. We measure what changed."
        lede={`${formatNumber(os.stats.peopleSupported)} people supported through published impact records. That figure counts people reached by work we have published — not everyone we have ever met, and not the same person twice within a record.`}
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(os.stats.peopleSupported)}
            label="People supported"
          />
          <Stat
            gradient
            value={`${os.stats.evidenceVerifiedPct}%`}
            label="Evidence checked by our team"
          />
          <Stat
            gradient
            value={`${targetsMet}/${targetsTotal}`}
            label="Output targets met"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.publishedRecords)}
            label="Published records"
          />
        </div>
      </Section>

      <Section>
        <h2 style={{ marginBottom: 18 }}>By programme</h2>
        <div className="gs-stack" style={{ gap: 16 }}>
          {byProgram.map((row) => (
            <button
              key={row.program.slug}
              type="button"
              onClick={() =>
                setProgram(
                  program === row.program.slug ? 'all' : row.program.slug,
                )
              }
              className="gs-card gs-card--flat"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
                background:
                  program === row.program.slug
                    ? row.program.bgColor
                    : undefined,
              }}
            >
              <div
                className="gs-row gs-row--between"
                style={{ marginBottom: 10 }}
              >
                <strong style={{ fontSize: 15 }}>{row.program.name}</strong>
                <span className="gs-small gs-muted">
                  {formatNumber(row.people)} people · {row.records} records
                </span>
              </div>
              <Bar
                pct={(row.people / largest) * 100}
                label={row.program.name}
              />
            </button>
          ))}
        </div>
        {program !== 'all' ? (
          <button
            type="button"
            className="gs-btn gs-btn--ghost gs-btn--sm"
            style={{ marginTop: 16 }}
            onClick={() => setProgram('all')}
          >
            Clear programme filter
          </button>
        ) : null}
      </Section>

      <Section variant="mist">
        <div className="gs-card gs-card--flat" style={{ marginBottom: 26 }}>
          <p className="gs-eyebrow">How to read this page</p>
          <ul
            className="gs-small"
            style={{
              color: 'var(--gs-ink-70)',
              marginTop: 10,
              paddingLeft: 20,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>Outputs</strong> are what we delivered, shown against what
              we said we would deliver. Where we fell short, the percentage is
              shown rather than the shortfall hidden.
            </li>
            <li>
              <strong>Outcomes</strong> are what changed. Each one carries a
              basis — verified, observed, self-reported, or awaiting measurement
              — so you know how strongly it is held.
            </li>
            <li>
              <strong>Evidence</strong> is checked by our team. “Published” and
              “verified” are separate promises: a record can be public while its
              evidence is still being checked.
            </li>
            <li>
              Drafts are internal. This page shows published records only.
            </li>
          </ul>
        </div>

        <div className="gs-stack" style={{ gap: 22 }}>
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      </Section>
    </>
  )
}

function RecordCard({ record }: { record: ImpactView }) {
  return (
    <article className="gs-card gs-card--flat" id={record.id}>
      <div
        className="gs-row gs-row--between"
        style={{ alignItems: 'flex-start', gap: 16 }}
      >
        <div className="gs-stack" style={{ gap: 8, maxWidth: 640 }}>
          <div className="gs-row" style={{ gap: 6 }}>
            <Pill tone="green">{record.program?.shortName}</Pill>
            {record.chapter ? <Pill>{record.chapter.city}</Pill> : null}
            <Pill>{record.dateLabel}</Pill>
            {record.fullyVerified ? (
              <Pill tone="blue">Evidence verified by our team</Pill>
            ) : (
              <Pill tone="amber">
                {record.evidenceVerified}/{record.evidenceTotal} evidence
                checked
              </Pill>
            )}
          </div>
          <h3 style={{ fontSize: 22 }}>{record.title}</h3>
          {record.projectLabel ? (
            <p className="gs-small gs-muted">{record.projectLabel}</p>
          ) : null}
        </div>
        <Stat
          value={formatNumber(record.primaryValue)}
          label={record.unitLabel}
        />
      </div>

      <div className="gs-grid gs-grid--3" style={{ marginTop: 24 }}>
        <div className="gs-stack" style={{ gap: 12 }}>
          <p className="gs-eyebrow">Outputs — what we delivered</p>
          {record.outputs.map((output) => {
            const hit = output.target == null || output.value >= output.target
            const share = output.target
              ? Math.round((output.value / output.target) * 100)
              : 100
            return (
              <div key={output.id} className="gs-stack" style={{ gap: 4 }}>
                <div className="gs-row gs-row--between">
                  <span className="gs-small">{output.label}</span>
                  <span className="gs-small gs-num" style={{ fontWeight: 700 }}>
                    {formatNumber(output.value)}
                    {output.target != null
                      ? ` / ${formatNumber(output.target)}`
                      : ''}
                  </span>
                </div>
                <Bar
                  pct={share}
                  tone={hit ? 'green' : 'amber'}
                  label={output.label}
                />
                {!hit ? (
                  <span className="gs-small gs-muted">{share}% of target</span>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="gs-stack" style={{ gap: 12 }}>
          <p className="gs-eyebrow">Outcomes — what changed</p>
          {record.outcomes.map((outcome) => (
            <div key={outcome.id} className="gs-stack" style={{ gap: 4 }}>
              <div className="gs-row" style={{ gap: 8 }}>
                <strong className="gs-small">
                  {outcome.value != null
                    ? `${formatNumber(outcome.value)} · `
                    : ''}
                  {outcome.label}
                </strong>
                <Pill tone={BASIS_TONE[outcome.basis] ?? 'neutral'}>
                  {BASIS_LABEL[outcome.basis]}
                </Pill>
              </div>
              {outcome.note ? (
                <span className="gs-small gs-muted">{outcome.note}</span>
              ) : null}
              {outcome.evidenceLabel ? (
                <span className="gs-small gs-muted">
                  Source: {outcome.evidenceLabel}
                </span>
              ) : null}
              {outcome.dueLabel ? (
                <span className="gs-small" style={{ color: 'var(--gs-amber)' }}>
                  Measurement due {outcome.dueLabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="gs-stack" style={{ gap: 12 }}>
          <p className="gs-eyebrow">Evidence</p>
          <div className="gs-row" style={{ gap: 6 }}>
            {record.evidence.map((item) => (
              <Pill
                key={item.id}
                tone={item.verified ? 'green' : 'neutral'}
                title={
                  item.verified
                    ? 'Checked by our team'
                    : 'Attached, not yet checked'
                }
              >
                {item.verified ? '✓ ' : '○ '}
                {item.label}
              </Pill>
            ))}
          </div>
          {record.missionId ? (
            <Link
              to="/missions/$missionId"
              params={{ missionId: record.missionId }}
              className="gs-small"
              style={{ fontWeight: 700 }}
            >
              See the mission behind this record →
            </Link>
          ) : null}
          <Link to="/trust" className="gs-small" style={{ fontWeight: 700 }}>
            See what funded it →
          </Link>
        </div>
      </div>
    </article>
  )
}
