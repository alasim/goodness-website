import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { useCurrentPerson } from '../../hooks/useCurrentPerson'
import { LoadingState } from '../../components/LoadingState'
import { IdentityPicker } from '../../components/IdentityPicker'
import {
  Avatar,
  Bar,
  Banner,
  Empty,
  Pill,
  Section,
  Stat,
} from '../../components/ui'
import {
  advanceAssignment,
  changeMissionRole,
  joinMission,
  withdrawFromMission,
} from '../../data/actions'
import { formatNumber } from '../../lib/format'
import type { MissionView } from '../../data/os'

export const Route = createFileRoute('/missions/$missionId')({
  component: MissionDetail,
})

const STEPS = [
  'Joined',
  'Checked in',
  'Contribution submitted',
  'Hours verified',
] as const

function MissionDetail() {
  const { missionId } = Route.useParams()
  const { os } = useOS()
  const { person } = useCurrentPerson()
  const [busy, setBusy] = useState(false)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)

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

  const mine = person
    ? mission.liveAssignments.find((a) => a.profileId === person.id)
    : undefined
  const stepIndex = mine
    ? mine.state === 'verified'
      ? 3
      : mine.state === 'submitted'
        ? 2
        : mine.state === 'checked_in'
          ? 1
          : 0
    : -1
  const record = os.publishedImpact.find((r) => r.missionId === mission.id)
  const remote = mission.participation === 'remote'

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap gs-stack" style={{ gap: 18 }}>
          <div className="gs-row" style={{ gap: 6 }}>
            {mission.priority === 'urgent' ? (
              <Pill tone="amber">Urgent</Pill>
            ) : null}
            <Pill tone={mission.status === 'open' ? 'green' : 'neutral'}>
              {mission.status === 'open'
                ? 'Open'
                : mission.status === 'full'
                  ? 'Full'
                  : 'Completed'}
            </Pill>
            <Pill tone="blue">{mission.program?.shortName}</Pill>
            <Pill>{remote ? 'Remote participation' : 'On site'}</Pill>
            {mission.scope === 'national' ? (
              <Pill>National mission</Pill>
            ) : null}
          </div>
          <h1 style={{ maxWidth: 860 }}>{mission.title}</h1>
          <p className="gs-lede" style={{ maxWidth: 680 }}>
            {mission.summary}
          </p>
          <div className="gs-row" style={{ gap: 22 }}>
            <Stat
              value={mission.dateLabel ?? '—'}
              label={mission.timeLabel ?? 'Time to be confirmed'}
            />
            <Stat
              value={`${mission.hours} hrs`}
              label="Service hours per volunteer"
            />
            <Stat
              value={`${mission.filled}/${mission.need}`}
              label="Places filled"
            />
          </div>
          <div className="gs-row" style={{ gap: 8 }}>
            <Link
              to="/studio"
              search={{
                card: mission.priority === 'urgent' ? 'urgent' : 'recruit',
                mission: mission.id,
              }}
              className="gs-btn gs-btn--ghost gs-btn--sm"
            >
              Share this mission
            </Link>
            {mission.chapter ? (
              <Link
                to="/chapters/$chapterId"
                params={{ chapterId: mission.chapter.id }}
                className="gs-btn gs-btn--ghost gs-btn--sm"
              >
                {mission.chapter.name}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <Section>
        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
            gap: 28,
          }}
        >
          <div className="gs-stack" style={{ gap: 24 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">What success looks like</p>
              <h3 style={{ marginTop: 8, fontSize: 20 }}>
                {mission.impactTarget}
              </h3>
              <div className="gs-stack" style={{ gap: 8, marginTop: 16 }}>
                <Detail label="Where" value={mission.venue ?? 'Remote'} />
                <Detail
                  label="Mission lead"
                  value={mission.leadName ?? 'To be assigned'}
                />
                <Detail
                  label="Programme"
                  value={mission.program?.name ?? mission.programSlug}
                />
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <div
                className="gs-row gs-row--between"
                style={{ marginBottom: 14 }}
              >
                <p className="gs-eyebrow">Roles</p>
                <span className="gs-small gs-muted">
                  {mission.remaining > 0
                    ? `${mission.remaining} places still open`
                    : 'Team complete'}
                </span>
              </div>
              <div className="gs-stack" style={{ gap: 14 }}>
                {mission.roles.map((role) => {
                  const isMine = mine?.missionRoleId === role.id
                  const full = role.remaining === 0 && !isMine
                  return (
                    <div
                      key={role.id}
                      className="gs-row gs-row--between"
                      style={{ gap: 14 }}
                    >
                      <div
                        className="gs-stack"
                        style={{ gap: 4, flex: 1, minWidth: 200 }}
                      >
                        <div className="gs-row" style={{ gap: 8 }}>
                          <strong className="gs-small">{role.role}</strong>
                          {isMine ? <Pill tone="green">Your role</Pill> : null}
                        </div>
                        <span className="gs-small gs-muted">
                          {role.filled}/{role.need} claimed
                          {role.skills.length
                            ? ` · ${role.skills.join(', ')}`
                            : ''}
                        </span>
                      </div>
                      {mission.status !== 'open' ? null : !person ? (
                        <span className="gs-small gs-muted">
                          Sign in to claim
                        </span>
                      ) : isMine ? (
                        <span className="gs-small gs-muted">Claimed</span>
                      ) : mine ? (
                        <button
                          type="button"
                          className="gs-btn gs-btn--ghost gs-btn--sm"
                          disabled={busy || full || mine.state !== 'joined'}
                          onClick={() =>
                            void run(() => changeMissionRole(mine.id, role.id))
                          }
                          title={
                            mine.state !== 'joined'
                              ? 'Roles are locked once you check in'
                              : undefined
                          }
                        >
                          Change to this role
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="gs-btn gs-btn--primary gs-btn--sm"
                          disabled={busy || full}
                          onClick={() =>
                            void run(() =>
                              joinMission({
                                missionId: mission.id,
                                missionRoleId: role.id,
                                profileId: person.id,
                              }),
                            )
                          }
                        >
                          {full ? 'Full' : `Join as ${role.role}`}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ marginTop: 18 }}>
                <Bar
                  pct={mission.fillPct}
                  tone={mission.priority === 'urgent' ? 'amber' : 'green'}
                  label="Places filled"
                />
              </div>
            </div>

            <Roster mission={mission} />

            {record ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">Impact report</p>
                <h3 style={{ marginTop: 8, fontSize: 20 }}>{record.title}</h3>
                <div className="gs-row" style={{ gap: 22, marginTop: 14 }}>
                  <Stat
                    value={formatNumber(record.primaryValue)}
                    label={record.unitLabel}
                  />
                  <Stat
                    value={`${record.targetsMet}/${record.targetsTotal}`}
                    label="Targets met"
                  />
                  <Stat
                    value={`${record.evidenceVerified}/${record.evidenceTotal}`}
                    label="Evidence checked"
                  />
                </div>
                <Link
                  to="/impact"
                  hash={record.id}
                  className="gs-btn gs-btn--ghost gs-btn--sm"
                  style={{ marginTop: 16 }}
                >
                  Read the full record
                </Link>
              </div>
            ) : null}
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            {!person ? (
              <IdentityPicker os={os} note="Join this mission" />
            ) : (
              <div className="gs-card gs-card--flat gs-stack">
                <p className="gs-eyebrow">Your participation</p>
                {!mine ? (
                  <>
                    <h3 style={{ fontSize: 19 }}>Pick a role to join</h3>
                    <p className="gs-small gs-muted">
                      One primary role per volunteer. Changing role later moves
                      your place rather than taking a second one.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="gs-stack" style={{ gap: 10 }}>
                      {STEPS.map((step, i) => (
                        <div key={step} className="gs-row" style={{ gap: 10 }}>
                          <span
                            aria-hidden
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 8,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 800,
                              color:
                                i <= stepIndex ? '#fff' : 'var(--gs-ink-40)',
                              background:
                                i <= stepIndex
                                  ? 'var(--gs-gradient)'
                                  : 'rgba(0,0,0,0.06)',
                            }}
                          >
                            {i <= stepIndex ? '✓' : i + 1}
                          </span>
                          <span
                            className="gs-small"
                            style={{ fontWeight: i === stepIndex ? 700 : 500 }}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="gs-stack" style={{ gap: 10, marginTop: 8 }}>
                      {mine.state === 'joined' ? (
                        <button
                          type="button"
                          className="gs-btn gs-btn--primary gs-btn--block"
                          disabled={busy}
                          onClick={() =>
                            void run(() =>
                              advanceAssignment(mine.id, 'checked_in'),
                            )
                          }
                        >
                          {remote ? 'Start contribution' : 'Check in with QR'}
                        </button>
                      ) : null}
                      {mine.state === 'checked_in' ? (
                        <button
                          type="button"
                          className="gs-btn gs-btn--primary gs-btn--block"
                          disabled={busy}
                          onClick={() =>
                            void run(() =>
                              advanceAssignment(mine.id, 'submitted'),
                            )
                          }
                        >
                          Submit completion
                        </button>
                      ) : null}
                      {mine.state === 'submitted' ? (
                        <Banner>
                          Awaiting verification by the mission lead. Hours reach
                          your passport only once they confirm attendance.
                        </Banner>
                      ) : null}
                      {mine.state === 'verified' ? (
                        <Banner>
                          {mine.hoursCredited ?? mission.hours} hours verified
                          and added to your passport.
                        </Banner>
                      ) : null}

                      {mine.state === 'joined' ? (
                        confirmWithdraw ? (
                          <div className="gs-stack" style={{ gap: 8 }}>
                            <p className="gs-small gs-muted">
                              Withdrawing frees your place for someone else. You
                              can rejoin while places remain.
                            </p>
                            <div className="gs-row" style={{ gap: 8 }}>
                              <button
                                type="button"
                                className="gs-btn gs-btn--danger gs-btn--sm"
                                disabled={busy}
                                onClick={() =>
                                  void run(() => withdrawFromMission(mine.id))
                                }
                              >
                                Yes, withdraw
                              </button>
                              <button
                                type="button"
                                className="gs-btn gs-btn--ghost gs-btn--sm"
                                onClick={() => setConfirmWithdraw(false)}
                              >
                                Keep my place
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="gs-btn gs-btn--ghost gs-btn--sm"
                            onClick={() => setConfirmWithdraw(true)}
                          >
                            Withdraw from this mission
                          </button>
                        )
                      ) : mine.state === 'checked_in' ||
                        mine.state === 'submitted' ? (
                        <p className="gs-small gs-muted">
                          Withdrawal is locked once you have checked in — the
                          record of attendance stays.
                        </p>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="gs-card gs-card--wash">
              <p className="gs-eyebrow">How hours become real</p>
              <p
                className="gs-small"
                style={{ marginTop: 10, color: 'var(--gs-ink-70)' }}
              >
                Joined → Checked in → Contribution submitted → Hours verified.
                Only the last step counts anywhere in the system, and only a
                team lead can grant it.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

function Roster({ mission }: { mission: MissionView }) {
  const { os } = useOS()
  if (!os) return null
  const roster = mission.liveAssignments
    .map((assignment) => ({
      assignment,
      person: os.personById.get(assignment.profileId),
    }))
    .filter((row) => row.person)
  const carried = Math.max(0, mission.filled - roster.length)

  return (
    <div className="gs-card gs-card--flat">
      <p className="gs-eyebrow">Team</p>
      {roster.length ? (
        <div className="gs-stack" style={{ gap: 12, marginTop: 14 }}>
          {roster.map(({ assignment, person }) => (
            <div key={assignment.id} className="gs-row gs-row--between">
              <div className="gs-row" style={{ gap: 10 }}>
                <Avatar
                  initials={person!.initials}
                  color={person!.avatarColor}
                  size="sm"
                />
                <div className="gs-stack" style={{ gap: 0 }}>
                  <Link
                    to="/people/$volunteerId"
                    params={{ volunteerId: person!.slug }}
                    className="gs-small"
                    style={{ fontWeight: 700 }}
                  >
                    {person!.fullName}
                  </Link>
                  <span className="gs-small gs-muted">
                    {mission.roles.find(
                      (r) => r.id === assignment.missionRoleId,
                    )?.role ?? 'Volunteer'}
                  </span>
                </div>
              </div>
              <Pill
                tone={assignment.state === 'verified' ? 'green' : 'neutral'}
              >
                {assignment.state === 'checked_in'
                  ? 'Checked in'
                  : assignment.state === 'submitted'
                    ? 'Contribution submitted'
                    : assignment.state === 'verified'
                      ? 'Hours verified'
                      : 'Joined'}
              </Pill>
            </div>
          ))}
        </div>
      ) : null}
      {carried > 0 ? (
        <p
          className="gs-small gs-muted"
          style={{ marginTop: roster.length ? 14 : 10 }}
        >
          {carried} {carried === 1 ? 'place is' : 'places are'} held by
          volunteers confirmed before this system went live.
        </p>
      ) : null}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="gs-row gs-row--between" style={{ gap: 12 }}>
      <span className="gs-small gs-muted">{label}</span>
      <span
        className="gs-small"
        style={{ fontWeight: 600, textAlign: 'right' }}
      >
        {value}
      </span>
    </div>
  )
}
