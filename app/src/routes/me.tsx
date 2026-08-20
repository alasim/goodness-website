import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { useCurrentPerson } from '../hooks/useCurrentPerson'
import { LoadingState } from '../components/LoadingState'
import { IdentityPicker } from '../components/IdentityPicker'
import { AuthPanel, SignOutButton } from '../components/AuthPanel'
import { CommitmentPanel } from '../components/CommitmentPanel'
import { GWatermark } from '../components/GWatermark'
import { hasSupabase } from '../lib/env'
import { formatMoney, formatNumber } from '../lib/format'
import { claimProfile, setMyChapter } from '../data/actions'
import type { JourneyLevel } from '../lib/types'
import type { MissionView, OSModel, VolunteerView } from '../data/os'

/** My Goodness — a faithful build of `My Goodness.dc.html`. */
export const Route = createFileRoute('/me')({
  head: () => ({ meta: [{ title: 'My Goodness — Goodness Society' }] }),
  component: MyGoodness,
})

/** Hour milestones a passport climbs towards, in the design's tiers. */
const TIERS = [10, 50, 100, 250, 500]

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

function MyGoodness() {
  const { os } = useOS()
  const { person, loading } = useCurrentPerson()

  if (!os || loading) return <LoadingState />
  if (!person) return <SignIn os={os} />
  return <Dashboard os={os} person={person} />
}

/** The signed-out half: choose your Goodness Passport to sign in. */
function SignIn({ os }: { os: OSModel }) {
  return (
    <div className="gs-narrow" style={{ maxWidth: 1080 }}>
      <section className="gs-signin">
        <span
          className="gs-mark"
          style={{ width: 52, height: 52, fontSize: 22 }}
        >
          G
        </span>
        <h1 className="gs-signin__title">
          <span style={{ fontWeight: 300 }}>My</span>{' '}
          <span style={{ fontWeight: 800 }}>Goodness</span>
        </h1>
        <p className="gs-signin__lede">
          Your verified service, credentials, and shareable assets in one place.
          Choose your Goodness Passport to sign in.
        </p>
        {hasSupabase ? <AuthPanel /> : <IdentityPicker os={os} />}
      </section>
    </div>
  )
}

function Dashboard({ os, person }: { os: OSModel; person: VolunteerView }) {
  const hour = new Date().getHours()
  const greeting = `Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'},`
  const firstName = person.fullName.split(' ')[0] ?? person.fullName
  const grad = AVATAR_GRADIENTS[person.avatarColor] ?? AVATAR_GRADIENTS.green!

  const myAssignments = os.data.assignments.filter(
    (a) => a.profileId === person.id && a.state !== 'withdrawn',
  )
  const myMissions = myAssignments
    .map((assignment) => ({
      assignment,
      mission: os.missionById.get(assignment.missionId),
    }))
    .filter(
      (
        row,
      ): row is {
        assignment: (typeof myAssignments)[number]
        mission: MissionView
      } => Boolean(row.mission),
    )
  const joined = new Set(myMissions.map((row) => row.mission.id))

  // Recommendations score a mission on skill, programme, city and remote fit — the design's weights.
  const recommended = os.openMissions
    .filter((mission) => !joined.has(mission.id))
    .map((mission) => {
      const skillHit = mission.roles
        .flatMap((r) => r.skills)
        .find((skill) =>
          person.skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
        )
      const programHit = mission.programSlug === person.programSlug
      const cityHit = mission.chapter?.city === person.city
      const remote = mission.participation === 'remote'
      const score =
        (skillHit ? 3 : 0) +
        (programHit ? 2 : 0) +
        (cityHit ? 2 : 0) +
        (remote ? 1 : 0)
      const why = skillHit
        ? `Matches your ${skillHit} skill`
        : programHit
          ? `In your program — ${(person.program?.name ?? '').split(' ').slice(0, 3).join(' ')}`
          : cityHit
            ? `Close to you in ${mission.chapter?.city}`
            : remote
              ? 'Remote — fits any schedule'
              : ''
      return { mission, score, why }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const target = TIERS.find((t) => person.totalHours < t) ?? 1000
  const certificate = person.credentials.find(
    (c) => c.title === 'Certificate of Volunteer Service',
  )
  const certEnabled = person.certificateEnabled && Boolean(certificate)

  const chapter = person.chapterId ? os.chapterById.get(person.chapterId) : null
  const seat = chapter?.team.find(
    (t) => t.volunteer?.id === person.id && !t.untilLabel,
  )
  const chapterOpps = (chapter?.missions ?? [])
    .filter((m) => m.status === 'open')
    .slice(0, 2)
  const chapterOptions = os.activeChapters
    .filter((c) => c.id !== chapter?.id && c.type === 'district')
    .slice(0, 3)

  const myGifts = os.finance.donations.filter(
    (d) => d.donorProfileId === person.id || d.donorName === person.fullName,
  )
  const giftTotal = myGifts.reduce((n, d) => n + d.amount, 0)
  const restricted = myGifts.some((d) => d.restrictedProgramSlug)
  const reached = os.impact
    .filter(
      (record) =>
        record.published &&
        (myGifts.some((d) => d.restrictedProgramSlug === record.programSlug) ||
          myGifts.some((d) => !d.restrictedProgramSlug)),
    )
    .reduce((n, record) => n + record.beneficiaries, 0)

  return (
    <div className="gs-narrow" style={{ maxWidth: 1080 }}>
      <section className="gs-stack" style={{ gap: 20 }}>
        {/* ── Header ── */}
        <div className="gs-inkhero" style={{ padding: '32px 36px' }}>
          <GWatermark width={380} height={250} style={{ opacity: 0.07 }} />
          <div
            className="gs-row"
            style={{ position: 'relative', gap: 20, alignItems: 'center' }}
          >
            <span
              className="gs-mark"
              style={{ width: 64, height: 64, fontSize: 22, background: grad }}
            >
              {person.initials}
            </span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 4,
                }}
              >
                {greeting}
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.015em',
                }}
              >
                {firstName}
              </h1>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                You've contributed{' '}
                <strong style={{ color: '#4DC86A', fontWeight: 800 }}>
                  {formatNumber(person.totalHours)} hours
                </strong>{' '}
                of verified service across {person.totalMissions} missions.
              </p>
            </div>
            {hasSupabase ? (
              <SignOutButton />
            ) : (
              <button
                type="button"
                className="gs-btn gs-btn--onink gs-btn--sm"
                onClick={() => claimProfile(null)}
              >
                Sign out
              </button>
            )}
          </div>

          <div className="gs-inkbar" style={{ marginTop: 28 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }} className="gs-num">
                {person.totalMissions}
              </div>
              <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
                Missions
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: 22, fontWeight: 800, color: '#4DC86A' }}
                className="gs-num"
              >
                {formatNumber(person.totalHours)}
              </div>
              <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
                Verified hours
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }} className="gs-num">
                {person.credentials.length}
              </div>
              <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
                Credentials
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {person.level}
              </div>
              <div className="gs-inkbar__label" style={{ marginTop: 2 }}>
                Current level
              </div>
            </div>
          </div>
        </div>

        <div
          className="gs-detailgrid"
          style={{ gridTemplateColumns: '1.15fr 0.85fr' }}
        >
          <div className="gs-detailcol">
            {/* ── My missions ── */}
            <section className="gs-panelcard">
              <div
                className="gs-row gs-row--between"
                style={{ gap: 10, marginBottom: 4 }}
              >
                <h2 style={PANEL_LABEL}>My missions</h2>
                <Link to="/missions" style={{ fontSize: 12, fontWeight: 700 }}>
                  Find a mission →
                </Link>
              </div>
              <p
                style={{
                  margin: '0 0 18px',
                  fontSize: 12,
                  color: 'var(--gs-ink-40)',
                }}
              >
                Hours post to your passport the moment your team lead verifies
                them.
              </p>

              {myMissions.length === 0 ? (
                <div className="gs-emptybox">
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    You haven't joined a mission yet
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                    Pick one meaningful thing to do this week — roles start at 4
                    hours.
                  </div>
                  <Link
                    to="/missions"
                    className="gs-btn gs-btn--primary gs-btn--sm"
                  >
                    Browse missions →
                  </Link>
                </div>
              ) : null}

              {recommended.length ? (
                <div className="gs-stack" style={{ gap: 10, marginBottom: 18 }}>
                  <div className="gs-reclabel">Recommended for you</div>
                  {recommended.map(({ mission, why }) => (
                    <Link
                      key={mission.id}
                      to="/missions/$missionId"
                      params={{ missionId: mission.id }}
                      className="gs-recrow"
                    >
                      <span className="gs-mark gs-mark--34">✓</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1.35,
                          }}
                        >
                          {mission.title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 11,
                            color: 'var(--gs-green-deep)',
                            marginTop: 2,
                          }}
                        >
                          {why}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: 11,
                            color: 'var(--gs-ink-40)',
                            marginTop: 1,
                          }}
                        >
                          {mission.participation === 'remote'
                            ? 'Remote'
                            : (mission.chapter?.city ?? 'Goodness')}{' '}
                          · {mission.dateLabel} · {mission.hours} hours
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--gs-green-deep)',
                          flexShrink: 0,
                        }}
                      >
                        View →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="gs-stack" style={{ gap: 10 }}>
                {myMissions.map(({ assignment, mission }) => (
                  <MissionRow
                    key={assignment.id}
                    mission={mission}
                    state={assignment.state}
                  />
                ))}
              </div>
            </section>

            {/* ── My assets ── */}
            <section className="gs-panelcard">
              <h2 style={PANEL_LABEL}>My assets</h2>
              <p
                style={{
                  margin: '4px 0 18px',
                  fontSize: 12,
                  color: 'var(--gs-ink-40)',
                }}
              >
                Issued by Goodness Society. Locked items unlock when the team
                enables them.
              </p>
              <div className="gs-stack" style={{ gap: 12 }}>
                {certEnabled ? (
                  <div className="gs-assetrow gs-assetrow--on">
                    <span className="gs-mark gs-mark--44">
                      <svg
                        width="19"
                        height="19"
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        My certificate of service
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--gs-ink-50)',
                          marginTop: 2,
                        }}
                      >
                        Ref {certificate?.ref}
                      </div>
                    </div>
                    <Link
                      to="/studio"
                      search={{ card: 'credential', person: person.slug }}
                      className="gs-btn gs-btn--primary gs-btn--sm"
                    >
                      Download
                    </Link>
                  </div>
                ) : (
                  <div className="gs-assetrow gs-assetrow--off">
                    <span className="gs-mark gs-mark--44 gs-mark--locked">
                      <svg
                        width="17"
                        height="17"
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
                        My certificate of service
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--gs-ink-40)',
                          marginTop: 2,
                        }}
                      >
                        Awaiting issue by the Goodness team
                      </div>
                    </div>
                    <span className="gs-lockchip">Locked</span>
                  </div>
                )}

                <div className="gs-assetrow">
                  <span className="gs-mark gs-mark--44 gs-mark--ink">
                    <svg
                      width="17"
                      height="17"
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
                      My social card
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--gs-ink-50)',
                        marginTop: 2,
                      }}
                    >
                      Pre-filled with your profile · 1080×1080 PNG
                    </div>
                  </div>
                  <Link
                    to="/studio"
                    search={{ person: person.slug }}
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                  >
                    Create
                  </Link>
                </div>
              </div>
            </section>

            {/* ── My credentials ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>
                My credentials
              </h2>
              {person.credentials.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                  No credentials yet. Complete missions and your first
                  credential will appear here.
                </div>
              ) : (
                <div className="gs-stack" style={{ gap: 10 }}>
                  {person.credentials.map((credential) => {
                    const valid = credential.status === 'valid'
                    return (
                      <div key={credential.id} className="gs-credrow">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>
                            {credential.title}
                          </div>
                          <div
                            className="gs-num"
                            style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}
                          >
                            {credential.ref} · {credential.issuedLabel}
                          </div>
                        </div>
                        <span
                          className="gs-tag"
                          style={{
                            background: valid ? '#f0faf3' : '#fdecec',
                            color: valid ? '#1B7A34' : '#d4183d',
                          }}
                        >
                          {valid ? 'Valid' : 'Revoked'}
                        </span>
                        <Link
                          to="/verify"
                          search={{ ref: credential.ref }}
                          style={{ fontSize: 11, fontWeight: 700 }}
                        >
                          Verify ↗
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <div className="gs-detailcol">
            {/* ── Next milestone ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>
                Next milestone
              </h2>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>
                {target} hours of service
              </div>
              <div
                className="gs-capbar"
                style={{ height: 10, marginBottom: 8 }}
              >
                <div
                  className="gs-capbar__fill"
                  style={{
                    width: `${Math.min(100, Math.round((person.totalHours / target) * 100))}%`,
                    background: 'linear-gradient(90deg, #4DC86A, #1B7A34)',
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--gs-ink-50)' }}>
                {person.totalHours} of {target} hours ·{' '}
                {Math.max(0, target - person.totalHours)} to go
              </div>
            </section>

            {/* ── My journey ── */}
            <section className="gs-panelcard">
              <h2 style={{ ...PANEL_LABEL, marginBottom: 16 }}>My journey</h2>
              <div>
                {JOURNEY.map((label, i) => {
                  const levelIndex = JOURNEY.indexOf(person.level)
                  return (
                    <JourneyStep
                      key={label}
                      label={label}
                      reached={i <= levelIndex}
                      current={i === levelIndex}
                      passed={i < levelIndex}
                      last={i === JOURNEY.length - 1}
                    />
                  )
                })}
              </div>
            </section>

            {/* ── My chapter ── */}
            <section className="gs-panelcard">
              <div
                className="gs-row gs-row--between"
                style={{ gap: 10, marginBottom: 4 }}
              >
                <h2 style={PANEL_LABEL}>My chapter</h2>
                <Link to="/chapters" style={{ fontSize: 12, fontWeight: 700 }}>
                  All chapters →
                </Link>
              </div>
              <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                {chapter ? (
                  <Link
                    to="/chapters/$chapterId"
                    params={{ chapterId: chapter.id }}
                    className="gs-recrow"
                  >
                    <span
                      className="gs-mark"
                      style={{ width: 42, height: 42, fontSize: 16 }}
                    >
                      {chapter.name.replace('Goodness ', '').charAt(0)}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 14.5,
                          fontWeight: 800,
                        }}
                      >
                        {chapter.name}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontSize: 11.5,
                          color: 'var(--gs-ink-50)',
                          marginTop: 2,
                        }}
                      >
                        {chapter.memberCount}{' '}
                        {chapter.memberCount === 1 ? 'member' : 'members'} ·{' '}
                        {chapter.liveMissions}{' '}
                        {chapter.liveMissions === 1
                          ? 'mission live'
                          : 'missions live'}{' '}
                        · {chapter.partners.length}{' '}
                        {chapter.partners.length === 1 ? 'partner' : 'partners'}
                      </span>
                      {seat ? (
                        <span
                          style={{
                            display: 'block',
                            fontSize: 11,
                            fontWeight: 800,
                            color: 'var(--gs-green-deep)',
                            marginTop: 2,
                          }}
                        >
                          {seat.role} — you lead this chapter
                        </span>
                      ) : null}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--gs-green-deep)',
                        flexShrink: 0,
                      }}
                    >
                      View →
                    </span>
                  </Link>
                ) : (
                  <div style={{ fontSize: 12.5, color: 'var(--gs-ink-50)' }}>
                    No chapter covers your city yet.
                  </div>
                )}

                {chapterOpps.length ? (
                  <div className="gs-stack" style={{ gap: 8 }}>
                    <div className="gs-nearlabel">Near you</div>
                    {chapterOpps.map((mission) => (
                      <Link
                        key={mission.id}
                        to="/missions/$missionId"
                        params={{ missionId: mission.id }}
                        className="gs-nearrow"
                      >
                        <span style={{ fontWeight: 700, flex: 1 }}>
                          {mission.title}
                        </span>
                        <span
                          style={{
                            color: 'var(--gs-green-deep)',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {mission.remaining} spots →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {chapterOptions.length && !seat ? (
                  <div className="gs-row" style={{ gap: 10, paddingTop: 4 }}>
                    <span style={{ fontSize: 11.5, color: 'var(--gs-ink-40)' }}>
                      Make a different chapter your home:
                    </span>
                    {chapterOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="gs-quietbtn"
                        onClick={() => void setMyChapter(person.id, option.id)}
                      >
                        {option.name.replace('Goodness ', '')}
                      </button>
                    ))}
                  </div>
                ) : null}

                <p className="gs-finenote">
                  Your primary chapter is where you belong organisationally —
                  you can join missions anywhere in Goodness.
                </p>
              </div>
            </section>

            <CommitmentPanel os={os} person={person} />

            {/* ── My giving ── */}
            {myGifts.length ? (
              <section className="gs-panelcard">
                <h2 style={PANEL_LABEL}>My giving</h2>
                <p
                  style={{
                    margin: '4px 0 14px',
                    fontSize: 12,
                    color: 'var(--gs-ink-40)',
                  }}
                >
                  You support Goodness with money as well as time.
                </p>
                <div
                  className="gs-num"
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: 'var(--gs-green-deep)',
                  }}
                >
                  {formatMoney(giftTotal, os.currency)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                    marginBottom: 12,
                  }}
                >
                  contributed · {myGifts.length}{' '}
                  {myGifts.length === 1 ? 'gift' : 'gifts'} since{' '}
                  {myGifts[myGifts.length - 1]?.dateLabel} · receipts issued for
                  every gift
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: '#374151',
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {restricted
                    ? 'Your restricted gifts joined specific programme funds; unrestricted gifts support all programmes.'
                    : 'Your gifts are unrestricted, supporting every programme.'}{' '}
                  {restricted
                    ? 'Initiatives you supported'
                    : 'Published initiatives'}{' '}
                  have collectively reached {formatNumber(reached)} people — a
                  shared result, not a private conversion of your taka.
                </div>
                <div className="gs-row" style={{ gap: 14 }}>
                  <Link to="/trust" style={{ fontSize: 12, fontWeight: 700 }}>
                    See your gifts on the Trust Ledger →
                  </Link>
                  <Link to="/fund" style={{ fontSize: 12, fontWeight: 800 }}>
                    Back another initiative →
                  </Link>
                </div>
              </section>
            ) : null}

            <Link
              to="/people/$volunteerId"
              params={{ volunteerId: person.slug }}
              className="gs-btn gs-btn--primary gs-btn--block"
              style={{ padding: '14px 0', fontSize: 14 }}
            >
              View my public passport →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/** One joined mission: a date tile, its role line, its state chip and the hours it will credit. */
function MissionRow({
  mission,
  state,
}: {
  mission: MissionView
  state: string
}) {
  const verified = state === 'verified'
  const submitted = state === 'submitted'
  const parts = /(\d{1,2})\s+([A-Za-z]{3})/.exec(mission.dateLabel ?? '')
  const tone = verified
    ? { bg: '#f0faf3', color: '#1B7A34' }
    : submitted
      ? { bg: '#fff3e0', color: '#E65100' }
      : { bg: '#e8f0fc', color: '#1565C0' }
  const label = verified
    ? 'Hours verified'
    : submitted
      ? 'Submitted'
      : state === 'checked_in'
        ? mission.participation === 'remote'
          ? 'In progress'
          : 'Checked in'
        : 'Joined'

  return (
    <Link
      to="/missions/$missionId"
      params={{ missionId: mission.id }}
      className="gs-missionrow"
      style={{
        borderColor: verified ? 'rgba(27,122,52,0.25)' : 'rgba(0,0,0,0.07)',
        background: verified ? '#f8fdf9' : '#fff',
      }}
    >
      <span className="gs-daytile" style={{ background: tone.bg }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: tone.color,
            lineHeight: 1,
          }}
        >
          {parts?.[1] ?? '—'}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: tone.color,
            textTransform: 'uppercase',
          }}
        >
          {parts?.[2] ?? 'TBC'}
        </span>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {mission.title}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 11,
            color: 'var(--gs-ink-50)',
            marginTop: 2,
          }}
        >
          {mission.chapter?.name ?? 'Goodness'} · {mission.timeLabel}
        </span>
      </span>
      <span
        className="gs-tag"
        style={{ background: tone.bg, color: tone.color, flexShrink: 0 }}
      >
        {label}
      </span>
      <span
        className="gs-num"
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: verified ? '#1B7A34' : 'var(--gs-ink-40)',
          flexShrink: 0,
          width: 42,
          textAlign: 'right',
        }}
      >
        {verified ? '+' : ''}
        {mission.hours}h
      </span>
    </Link>
  )
}

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
            height: 26,
            background: last ? 'transparent' : passed ? '#4DC86A' : '#E5E7EB',
          }}
        />
      </div>
      <div style={{ marginTop: -2, paddingBottom: 10 }}>
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
