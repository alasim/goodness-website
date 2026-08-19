import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { useCurrentPerson } from '../hooks/useCurrentPerson'
import { LoadingState } from '../components/LoadingState'
import { IdentityPicker } from '../components/IdentityPicker'
import { AuthPanel, SignOutButton } from '../components/AuthPanel'
import { CommitmentPanel } from '../components/CommitmentPanel'
import { MissionCard } from '../components/MissionCard'
import { Avatar, Bar, Banner, Pill, Section, Stat } from '../components/ui'
import { hasSupabase } from '../lib/env'
import { STATE_LABEL, formatMoney, formatNumber } from '../lib/format'
import { advanceAssignment, claimProfile, setMyChapter } from '../data/actions'

export const Route = createFileRoute('/me')({
  head: () => ({ meta: [{ title: 'My Goodness' }] }),
  component: MyGoodness,
})

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000]

function MyGoodness() {
  const { os } = useOS()
  const { person, loading } = useCurrentPerson()

  if (!os || loading) return <LoadingState />

  if (!person) {
    return (
      <Section>
        <p className="gs-eyebrow">My Goodness</p>
        <h1 style={{ marginBottom: 18 }}>Your record, in one place</h1>
        <div style={{ maxWidth: 560 }}>
          {hasSupabase ? <AuthPanel /> : <IdentityPicker os={os} />}
        </div>
      </Section>
    )
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const myAssignments = os.data.assignments.filter(
    (a) => a.profileId === person.id && a.state !== 'withdrawn',
  )
  const myMissions = myAssignments
    .map((assignment) => ({
      assignment,
      mission: os.missionById.get(assignment.missionId),
    }))
    .filter((row) => row.mission)
  const nextMilestone = MILESTONES.find((m) => m > person.totalHours) ?? null
  const myDonations = os.finance.donations.filter(
    (d) => d.donorProfileId === person.id || d.donorName === person.fullName,
  )
  const recommended = os.openMissions
    .filter((mission) => !myAssignments.some((a) => a.missionId === mission.id))
    .map((mission) => {
      const skillMatch = mission.roles.some((role) =>
        role.skills.some((skill) => person.skills.includes(skill)),
      )
      const cityMatch = mission.chapter?.city === person.city
      const programMatch = mission.programSlug === person.programSlug
      return {
        mission,
        score:
          Number(skillMatch) * 3 + Number(cityMatch) * 2 + Number(programMatch),
      }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  const chapter = person.chapterId ? os.chapterById.get(person.chapterId) : null

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap">
          <div
            className="gs-row gs-row--between"
            style={{ gap: 18, alignItems: 'flex-start' }}
          >
            <div
              className="gs-row"
              style={{ gap: 18, alignItems: 'flex-start' }}
            >
              <Avatar
                initials={person.initials}
                color={person.avatarColor}
                size="lg"
              />
              <div className="gs-stack" style={{ gap: 8 }}>
                <p className="gs-eyebrow">My Goodness · {person.goodnessId}</p>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                  {greeting}, {person.fullName.split(' ')[0]}
                </h1>
                <p className="gs-lede">
                  {formatNumber(person.totalHours)} verified hours across{' '}
                  {person.totalMissions} missions.
                </p>
              </div>
            </div>
            <div className="gs-row" style={{ gap: 8 }}>
              <Link
                to="/people/$volunteerId"
                params={{ volunteerId: person.slug }}
                className="gs-btn gs-btn--ghost gs-btn--sm"
              >
                View public passport
              </Link>
              {hasSupabase ? (
                <SignOutButton />
              ) : (
                <button
                  type="button"
                  className="gs-btn gs-btn--ghost gs-btn--sm"
                  onClick={() => claimProfile(null)}
                >
                  Switch passport
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(person.totalHours)}
            label="Verified service hours"
          />
          <Stat
            gradient
            value={formatNumber(person.totalMissions)}
            label="Missions completed"
          />
          <Stat
            gradient
            value={formatNumber(person.credentials.length)}
            label="Credentials earned"
          />
          <Stat gradient value={person.level} label="Journey stage" />
        </div>
        {nextMilestone ? (
          <div style={{ marginTop: 22, maxWidth: 520 }}>
            <div className="gs-row gs-row--between" style={{ marginBottom: 6 }}>
              <span className="gs-small gs-muted">Next milestone</span>
              <span className="gs-small">
                {nextMilestone - person.totalHours} hours to {nextMilestone}
              </span>
            </div>
            <Bar
              pct={(person.totalHours / nextMilestone) * 100}
              label="Progress to next milestone"
            />
          </div>
        ) : null}
      </Section>

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
              <p className="gs-eyebrow">My missions</p>
              {myMissions.length ? (
                <div className="gs-stack" style={{ gap: 14, marginTop: 14 }}>
                  {myMissions.map(({ assignment, mission }) => (
                    <div
                      key={assignment.id}
                      className="gs-row gs-row--between"
                      style={{ gap: 12 }}
                    >
                      <div
                        className="gs-stack"
                        style={{ gap: 2, minWidth: 200, flex: 1 }}
                      >
                        <Link
                          to="/missions/$missionId"
                          params={{ missionId: mission!.id }}
                          style={{ fontWeight: 700, fontSize: 14 }}
                        >
                          {mission!.title}
                        </Link>
                        <span className="gs-small gs-muted">
                          {mission!.dateLabel} ·{' '}
                          {mission!.chapter?.city ?? 'Remote'}
                        </span>
                      </div>
                      <div className="gs-row" style={{ gap: 8 }}>
                        <Pill
                          tone={
                            assignment.state === 'verified'
                              ? 'green'
                              : 'neutral'
                          }
                        >
                          {STATE_LABEL[assignment.state]}
                        </Pill>
                        {assignment.state === 'joined' ? (
                          <button
                            type="button"
                            className="gs-btn gs-btn--ghost gs-btn--sm"
                            onClick={() =>
                              void advanceAssignment(
                                assignment.id,
                                'checked_in',
                              )
                            }
                          >
                            {mission!.participation === 'remote'
                              ? 'Start'
                              : 'Check in'}
                          </button>
                        ) : null}
                        {assignment.state === 'checked_in' ? (
                          <button
                            type="button"
                            className="gs-btn gs-btn--primary gs-btn--sm"
                            onClick={() =>
                              void advanceAssignment(assignment.id, 'submitted')
                            }
                          >
                            Submit completion
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="gs-small gs-muted" style={{ marginTop: 12 }}>
                  You have not joined a mission in this system yet. Your{' '}
                  {person.baselineMissions} earlier missions are already on your
                  passport.
                </p>
              )}
            </div>

            {recommended.length ? (
              <div>
                <div
                  className="gs-row gs-row--between"
                  style={{ marginBottom: 14 }}
                >
                  <p className="gs-eyebrow">Recommended for you</p>
                  <span className="gs-small gs-muted">
                    Matched on your skills, city and programme
                  </span>
                </div>
                <div className="gs-grid gs-grid--2">
                  {recommended.map(({ mission }) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">My credentials</p>
              <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
                {person.credentials.map((credential) => (
                  <div key={credential.id} className="gs-row gs-row--between">
                    <div className="gs-stack" style={{ gap: 2 }}>
                      <strong className="gs-small">{credential.title}</strong>
                      <span className="gs-small gs-muted">
                        {credential.ref}
                      </span>
                    </div>
                    <div className="gs-row" style={{ gap: 8 }}>
                      <Pill
                        tone={credential.status === 'valid' ? 'green' : 'red'}
                      >
                        {credential.status}
                      </Pill>
                      <Link
                        to="/verify"
                        search={{ ref: credential.ref }}
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                      >
                        Verify
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {!person.certificateEnabled ? (
                <Banner variant="warn">
                  Certificate downloads are currently switched off for your
                  passport. Your team lead can enable them.
                </Banner>
              ) : null}
            </div>

            {myDonations.length ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">My giving</p>
                <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
                  {myDonations.map((donation) => (
                    <div key={donation.id} className="gs-row gs-row--between">
                      <div className="gs-stack" style={{ gap: 2 }}>
                        <span className="gs-small" style={{ fontWeight: 600 }}>
                          {donation.method}
                        </span>
                        <span className="gs-small gs-muted">
                          {donation.dateLabel} · receipt {donation.receiptRef}
                        </span>
                      </div>
                      <strong className="gs-small gs-num">
                        {formatMoney(donation.amount, os.currency)}
                      </strong>
                    </div>
                  ))}
                </div>
                <p className="gs-small gs-muted" style={{ marginTop: 12 }}>
                  Your contributions join a pool. We report what that pool
                  achieved collectively rather than assigning outcomes to
                  individual gifts.
                </p>
              </div>
            ) : null}
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            <CommitmentPanel os={os} person={person} />

            <div className="gs-card gs-card--flat gs-stack">
              <p className="gs-eyebrow">My chapter</p>
              {chapter ? (
                <>
                  <h3 style={{ fontSize: 19 }}>{chapter.name}</h3>
                  <p className="gs-small gs-muted">
                    {chapter.memberCount} members · {chapter.liveMissions} live
                    missions · {formatNumber(chapter.peopleSupported)} people
                    supported
                  </p>
                  <Link
                    to="/chapters/$chapterId"
                    params={{ chapterId: chapter.id }}
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Open my chapter
                  </Link>
                </>
              ) : (
                <>
                  <p className="gs-small gs-muted">
                    You are not attached to a chapter yet. Pick the one closest
                    to where you work — you can still join missions anywhere.
                  </p>
                  <div className="gs-row" style={{ gap: 6 }}>
                    {os.activeChapters.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="gs-chip"
                        onClick={() => void setMyChapter(person.id, c.id)}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="gs-card gs-card--wash">
              <p className="gs-eyebrow">Share</p>
              <p
                className="gs-small"
                style={{ marginTop: 8, color: 'var(--gs-ink-70)' }}
              >
                Cards built from your verified record — the numbers are locked,
                so what you share is backed by the platform.
              </p>
              <Link
                to="/studio"
                search={{ person: person.slug }}
                className="gs-btn gs-btn--primary gs-btn--sm"
                style={{ marginTop: 12 }}
              >
                Open Share Studio
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
