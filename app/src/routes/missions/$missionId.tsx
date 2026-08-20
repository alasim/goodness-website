import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { useCurrentPerson } from '../../hooks/useCurrentPerson'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { QrCode } from '../../components/QrCode'
import { Empty, Section } from '../../components/ui'
import {
  advanceAssignment,
  changeMissionRole,
  joinMission,
  withdrawFromMission,
} from '../../data/actions'
import { formatNumber } from '../../lib/format'
import type { ImpactView, MissionView, VolunteerView } from '../../data/os'
import type { Assignment } from '../../lib/types'

/** Mission detail — a faithful build of `Mission Detail.dc.html`. */
export const Route = createFileRoute('/missions/$missionId')({
  component: MissionDetail,
})

const STATE_ORDER = ['joined', 'checked_in', 'submitted', 'verified'] as const

function MissionDetail() {
  const { missionId } = Route.useParams()
  const { os } = useOS()
  const { person } = useCurrentPerson()
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!os) return <LoadingState />
  const mission = os.missionById.get(missionId)
  if (!mission) {
    return (
      <Section>
        <Empty>
          That mission is not on the board.{' '}
          <Link to="/missions">See open missions</Link>.
        </Empty>
      </Section>
    )
  }

  const program = mission.program
  const color = program?.color ?? '#1B7A34'
  const light = program?.lightColor ?? '#4DC86A'
  const done = mission.status === 'completed' || mission.status === 'cancelled'
  const full = mission.isFull || mission.status === 'full'
  const remote = mission.participation === 'remote'
  const mine = person
    ? mission.liveAssignments.find((a) => a.profileId === person.id)
    : undefined
  const state = mine?.state ?? null
  const record = os.publishedImpact.find((r) => r.missionId === mission.id)

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  const stateNote = !state
    ? ''
    : state === 'joined'
      ? remote
        ? 'Not started yet'
        : 'Not checked in yet'
      : state === 'checked_in'
        ? remote
          ? 'Contribution in progress'
          : 'Checked in'
        : state === 'submitted'
          ? 'Contribution submitted'
          : 'Hours verified'

  return (
    <div className="gs-narrow">
      <Link to="/missions" className="gs-backlink" style={{ marginBottom: 20 }}>
        ← All missions
      </Link>

      <section className="gs-inkhero">
        <GWatermark width={400} height={270} style={{ opacity: 0.08 }} />
        <div style={{ position: 'relative' }}>
          <div className="gs-row" style={{ gap: 8, marginBottom: 16 }}>
            {mission.priority === 'urgent' ? (
              <span
                className="gs-tag"
                style={{
                  background: '#E65100',
                  color: '#fff',
                  padding: '4px 12px',
                }}
              >
                Urgent
              </span>
            ) : null}
            <span
              className="gs-tag"
              style={{
                padding: '4px 12px',
                background: done
                  ? 'rgba(255,255,255,0.12)'
                  : full
                    ? 'rgba(21,101,192,0.9)'
                    : '#4DC86A',
                color: done ? 'rgba(255,255,255,0.7)' : '#ffffff',
              }}
            >
              {done
                ? 'Completed'
                : full
                  ? 'Full'
                  : `Open · ${mission.remaining} position${mission.remaining === 1 ? '' : 's'} left`}
            </span>
            {remote ? (
              <span
                className="gs-tag"
                style={{
                  padding: '4px 12px',
                  background: 'rgba(21,101,192,0.9)',
                  color: '#fff',
                }}
              >
                Remote
              </span>
            ) : null}
            <span
              className="gs-tag gs-tag--program"
              style={{
                padding: '4px 12px',
                background: 'rgba(255,255,255,0.1)',
                color: light,
              }}
            >
              <span className="gs-tag__dot" style={{ background: light }} />
              {program?.name}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              {mission.chapter?.city ?? 'National'} Chapter
            </span>
            {mission.status === 'open' ? (
              <Link
                to="/studio"
                search={{
                  card: mission.priority === 'urgent' ? 'urgent' : 'recruit',
                  mission: mission.id,
                }}
                className="gs-tag"
                style={{
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                }}
              >
                Share this mission ↗
              </Link>
            ) : null}
          </div>

          <h1 style={{ margin: '0 0 16px', maxWidth: 720 }}>{mission.title}</h1>
          <p
            style={{
              margin: '0 0 24px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 16,
              lineHeight: 1.65,
              maxWidth: 640,
            }}
          >
            {mission.summary}
          </p>

          <div className="gs-inkbar">
            <div>
              <div className="gs-inkbar__label">When</div>
              <div className="gs-inkbar__value">{mission.dateLabel}</div>
              <div className="gs-inkbar__sub">{mission.timeLabel}</div>
            </div>
            <div>
              <div className="gs-inkbar__label">Where</div>
              <div className="gs-inkbar__value">
                {mission.venue ?? 'Remote'}
              </div>
            </div>
            <div>
              <div className="gs-inkbar__label">Service hours</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--gs-green)',
                }}
              >
                {mission.hours}
              </div>
              <div className="gs-inkbar__sub">Added on verification</div>
            </div>
            <div>
              <div className="gs-inkbar__label">Mission lead</div>
              <div className="gs-inkbar__value">
                {mission.leadName ?? 'To be assigned'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gs-detailgrid">
        <div className="gs-detailcol">
          {/* Roles needed */}
          <section className="gs-panelcard">
            <div
              className="gs-row gs-row--between"
              style={{ marginBottom: 6, gap: 8 }}
            >
              <h2 className="gs-panelhead">Roles needed</h2>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    done || mission.remaining === 0 ? '#9CA3AF' : '#1B7A34',
                }}
              >
                {mission.filled} / {mission.need} filled
              </span>
            </div>
            <div className="gs-capbar" style={{ marginBottom: 20 }}>
              <div
                className="gs-capbar__fill"
                style={{
                  width: `${mission.fillPct}%`,
                  background: `linear-gradient(90deg, ${light}, ${color})`,
                }}
              />
            </div>

            <div className="gs-stack" style={{ gap: 10 }}>
              {mission.roles.map((role) => {
                const isMine = mine?.missionRoleId === role.id
                const roleFull = role.filled >= role.need
                const locked = mine && mine.state !== 'joined'
                const canSwitch = Boolean(
                  person && mine && !isMine && !done && !roleFull && !locked,
                )
                const canJoin = Boolean(person && !mine && !done && !roleFull)
                const active = canJoin || canSwitch

                return (
                  <div
                    key={role.id}
                    className={`gs-rolerow ${isMine ? 'gs-rolerow--mine' : ''}`}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {role.role}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--gs-ink-50)',
                          marginTop: 2,
                        }}
                      >
                        {role.skills.length
                          ? `Helpful skills: ${role.skills.join(', ')}`
                          : 'Open to everyone — no specific skills needed'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: roleFull ? '#9CA3AF' : '#1B7A34',
                        }}
                      >
                        {role.filled} / {role.need}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                        positions
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`gs-rolebtn ${active ? 'gs-rolebtn--active' : ''}`}
                      disabled={busy || !active}
                      onClick={() => {
                        if (!person || !active) return
                        void run(() =>
                          mine
                            ? changeMissionRole(mine.id, role.id)
                            : joinMission({
                                missionId: mission.id,
                                missionRoleId: role.id,
                                profileId: person.id,
                              }),
                        )
                      }}
                    >
                      {isMine
                        ? 'Your role'
                        : done
                          ? 'Closed'
                          : roleFull
                            ? 'Full'
                            : !person
                              ? 'Sign in'
                              : canSwitch
                                ? 'Change to this'
                                : mine
                                  ? 'Locked'
                                  : 'Claim role'}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {record ? <ImpactReport record={record} /> : null}

          {/* Impact target + team */}
          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 12 }}>
              Impact target
            </h2>
            <p
              style={{
                margin: '0 0 18px',
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {mission.impactTarget}
            </p>
            <div
              style={{
                borderTop: '1px solid var(--gs-line-soft)',
                paddingTop: 18,
              }}
            >
              <h2 className="gs-panelhead" style={{ marginBottom: 12 }}>
                Team joined ({mission.liveAssignments.length})
              </h2>
              {mission.liveAssignments.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                  No one from the platform has claimed a role yet. Be the first.
                </div>
              ) : (
                <div className="gs-stack" style={{ gap: 8 }}>
                  {mission.liveAssignments.map((assignment) => (
                    <TeamRow
                      key={assignment.id}
                      assignment={assignment}
                      mission={mission}
                      remote={remote}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="gs-detailcol">
          {/* Your place */}
          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
              Your place on this mission
            </h2>

            {!person ? (
              <div className="gs-stack" style={{ gap: 12 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  Sign in to My Goodness to claim a role. Your verified hours
                  land on your Goodness Passport automatically.
                </p>
                <Link to="/me" className="gs-btn gs-btn--primary gs-btn--block">
                  Sign in to join →
                </Link>
              </div>
            ) : !mine ? (
              <div className="gs-stack" style={{ gap: 12 }}>
                <Identity person={person} />
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: 'var(--gs-ink-50)',
                    lineHeight: 1.6,
                  }}
                >
                  Pick a role on the left to join this mission.
                </p>
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 14 }}>
                <div
                  className="gs-row"
                  style={{
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'var(--gs-green-wash)',
                    border: '1px solid rgba(27,122,52,0.2)',
                    flexWrap: 'nowrap',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1B7A34"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: 'var(--gs-green-deep)',
                      }}
                    >
                      You’re on this mission
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gs-ink-50)' }}>
                      Role:{' '}
                      {mission.roles.find((r) => r.id === mine.missionRoleId)
                        ?.role ?? 'Volunteer'}{' '}
                      · {stateNote}
                    </div>
                  </div>
                </div>

                {state === 'joined' ? (
                  <div className="gs-stack" style={{ gap: 12 }}>
                    {!remote ? (
                      <div
                        style={{
                          border: '1px solid var(--gs-line)',
                          borderRadius: 14,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div
                          className="gs-panelhead"
                          style={{ fontSize: 11, letterSpacing: '0.14em' }}
                        >
                          Check-in code
                        </div>
                        <QrCode seed={`${mission.id}|${person.slug}`} />
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--gs-ink-40)',
                            textAlign: 'center',
                            lineHeight: 1.5,
                          }}
                        >
                          Show this to your mission lead on the day, or tap
                          below.
                        </div>
                      </div>
                    ) : (
                      <div
                        className="gs-notice gs-notice--blue"
                        style={{ borderRadius: 14, padding: '14px 16px' }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: 'var(--gs-blue)',
                          }}
                        >
                          Remote contribution
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            lineHeight: 1.55,
                            marginTop: 4,
                          }}
                        >
                          No check-in needed. Start when you’re ready, then
                          submit your completion for verification.
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className="gs-btn gs-btn--primary gs-btn--block"
                      disabled={busy}
                      onClick={() =>
                        void run(() => advanceAssignment(mine.id, 'checked_in'))
                      }
                    >
                      {remote ? 'Start contribution' : 'Check in now'}
                    </button>
                  </div>
                ) : null}

                {state === 'checked_in' ? (
                  <>
                    <button
                      type="button"
                      className="gs-btn gs-btn--primary gs-btn--block"
                      disabled={busy}
                      onClick={() =>
                        void run(() => advanceAssignment(mine.id, 'submitted'))
                      }
                    >
                      Submit completion
                    </button>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--gs-ink-40)',
                        lineHeight: 1.5,
                      }}
                    >
                      You’ve checked in, so this place can no longer be released
                      from here. Speak to{' '}
                      {mission.leadName ?? 'your mission lead'} if plans change.
                    </div>
                  </>
                ) : null}

                {state === 'submitted' ? (
                  <div className="gs-notice gs-notice--amber">
                    Your contribution has been submitted for verification. Once
                    your team lead verifies it, {mission.hours} hours are added
                    to your passport.
                  </div>
                ) : null}

                {state === 'verified' ? (
                  <div className="gs-notice gs-notice--green">
                    Hours verified · +{mine.hoursCredited ?? mission.hours}{' '}
                    service hours on your passport.
                  </div>
                ) : null}

                {state === 'joined' && !confirmLeave ? (
                  <button
                    type="button"
                    className="gs-btn gs-btn--ghost gs-btn--block gs-btn--sm"
                    onClick={() => setConfirmLeave(true)}
                  >
                    Leave mission
                  </button>
                ) : null}

                {state === 'joined' && confirmLeave ? (
                  <div
                    className="gs-notice gs-notice--danger gs-stack"
                    style={{ gap: 10, padding: '14px 16px' }}
                  >
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                      Leave this mission?
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: 'var(--gs-ink-50)',
                        lineHeight: 1.55,
                      }}
                    >
                      Your position becomes available to another volunteer
                      straight away.
                    </div>
                    <div
                      className="gs-row"
                      style={{ gap: 8, flexWrap: 'nowrap' }}
                    >
                      <button
                        type="button"
                        className="gs-btn gs-btn--leave gs-btn--sm"
                        style={{ flex: 1 }}
                        disabled={busy}
                        onClick={() => {
                          setConfirmLeave(false)
                          void run(() => withdrawFromMission(mine.id))
                        }}
                      >
                        Yes, leave
                      </button>
                      <button
                        type="button"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                        style={{ flex: 1 }}
                        onClick={() => setConfirmLeave(false)}
                      >
                        Keep my place
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* How it works */}
          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
              How it works
            </h2>
            <div className="gs-stack" style={{ gap: 14 }}>
              {[
                {
                  title: 'Joined',
                  note: 'You’ve claimed a role on this mission.',
                },
                {
                  title: remote ? 'Contribution started' : 'Checked in',
                  note: remote
                    ? 'Begin your remote contribution.'
                    : 'Scan or tap to record your attendance.',
                },
                {
                  title: 'Contribution submitted',
                  note: 'Confirm you finished your part.',
                },
                {
                  title: 'Hours verified',
                  note: 'Your team lead confirms — hours post to your passport.',
                },
              ].map((step, i) => {
                const reached = state
                  ? STATE_ORDER.indexOf(
                      state as (typeof STATE_ORDER)[number],
                    ) >= i
                  : false
                return (
                  <div key={step.title} className="gs-steprow">
                    <div
                      className={`gs-stepnum ${reached ? 'gs-stepnum--on' : ''}`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: reached ? 'var(--gs-ink)' : 'var(--gs-ink-50)',
                        }}
                      >
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--gs-ink-40)',
                          lineHeight: 1.5,
                        }}
                      >
                        {step.note}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Identity({ person }: { person: VolunteerView }) {
  return (
    <div className="gs-row" style={{ gap: 12, flexWrap: 'nowrap' }}>
      <span
        className={`gs-mark ${person.avatarColor === 'blue' ? 'gs-mark--blue' : person.avatarColor === 'teal' ? 'gs-mark--teal' : ''}`}
        style={{ width: 38, height: 38, fontSize: 13 }}
      >
        {person.initials}
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{person.fullName}</div>
        <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
          {person.goodnessId}
        </div>
      </div>
    </div>
  )
}

function TeamRow({
  assignment,
  mission,
  remote,
}: {
  assignment: Assignment
  mission: MissionView
  remote: boolean
}) {
  const { os } = useOS()
  const volunteer = os?.personById.get(assignment.profileId)
  const label =
    assignment.state === 'verified'
      ? 'Hours verified'
      : assignment.state === 'submitted'
        ? 'Submitted'
        : assignment.state === 'checked_in'
          ? remote
            ? 'In progress'
            : 'Checked in'
          : 'Joined'
  const chipBg =
    assignment.state === 'verified'
      ? '#f0faf3'
      : assignment.state === 'submitted'
        ? '#fff3e0'
        : '#e8f0fc'
  const chipColor =
    assignment.state === 'verified'
      ? '#1B7A34'
      : assignment.state === 'submitted'
        ? '#E65100'
        : '#1565C0'

  return (
    <div className="gs-teamrow">
      <span
        className={`gs-mark ${volunteer?.avatarColor === 'blue' ? 'gs-mark--blue' : volunteer?.avatarColor === 'teal' ? 'gs-mark--teal' : ''}`}
        style={{ width: 32, height: 32, fontSize: 11 }}
      >
        {volunteer?.initials ?? 'GS'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>
          {volunteer?.fullName ?? 'Volunteer'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
          {mission.roles.find((r) => r.id === assignment.missionRoleId)?.role ??
            'Volunteer'}
        </div>
      </div>
      <span
        className="gs-tag"
        style={{ background: chipBg, color: chipColor, letterSpacing: 0 }}
      >
        {label}
      </span>
    </div>
  )
}

function ImpactReport({ record }: { record: ImpactView }) {
  const chipLabel = record.fullyVerified
    ? 'Evidence verified'
    : record.evidenceVerified > 0
      ? `Evidence ${record.evidenceVerified}/${record.evidenceTotal} verified`
      : 'Evidence pending'
  const chipBg = record.fullyVerified
    ? '#e6f4ea'
    : record.evidenceVerified > 0
      ? '#fff3e0'
      : '#eef0f3'
  const chipColor = record.fullyVerified
    ? '#1B7A34'
    : record.evidenceVerified > 0
      ? '#E65100'
      : '#6B7280'

  return (
    <section className="gs-panelcard gs-panelcard--wash">
      <div className="gs-row" style={{ gap: 10, marginBottom: 16 }}>
        <h2 className="gs-panelhead gs-panelhead--green">Impact report</h2>
        <span
          className="gs-tag"
          style={{
            background: chipBg,
            color: chipColor,
            letterSpacing: '0.08em',
          }}
        >
          {chipLabel}
        </span>
        <span style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
          {formatNumber(record.beneficiaries)} people supported · published
          record
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div
            className="gs-panelhead"
            style={{ fontSize: 11, letterSpacing: '0.14em', marginBottom: 10 }}
          >
            Delivered
          </div>
          <div className="gs-stack" style={{ gap: 8 }}>
            {record.outputs.map((output) => {
              const met = output.target == null || output.value >= output.target
              return (
                <div
                  key={output.id}
                  className="gs-row gs-row--between"
                  style={{ gap: 10, fontSize: 12.5 }}
                >
                  <span style={{ color: '#374151' }}>{output.label}</span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: met ? '#1B7A34' : '#E65100',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {output.target
                      ? `${formatNumber(output.value)} / ${formatNumber(output.target)} · ${Math.round((output.value / output.target) * 100)}%`
                      : formatNumber(output.value)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div
            className="gs-panelhead gs-panelhead--green"
            style={{ fontSize: 11, letterSpacing: '0.14em', marginBottom: 10 }}
          >
            What changed
          </div>
          <div className="gs-stack" style={{ gap: 10 }}>
            {record.outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="gs-row"
                style={{
                  gap: 10,
                  alignItems: 'flex-start',
                  flexWrap: 'nowrap',
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: 'var(--gs-green-deep)',
                    minWidth: 38,
                    lineHeight: 1.2,
                  }}
                >
                  {outcome.value == null ? '—' : formatNumber(outcome.value)}
                </span>
                <span
                  style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.45 }}
                >
                  {outcome.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        to="/impact"
        hash={record.id}
        style={{
          marginTop: 18,
          fontSize: 13,
          fontWeight: 700,
          display: 'inline-block',
        }}
      >
        See the full impact record →
      </Link>
    </section>
  )
}
