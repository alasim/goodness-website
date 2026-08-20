import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { LoadingState } from '../../components/LoadingState'
import { Avatar, Banner, Empty, Pill, Section, Stat } from '../../components/ui'
import { formatNumber } from '../../lib/format'

export const Route = createFileRoute('/people/$volunteerId')({
  component: Passport,
})

const JOURNEY = ['Volunteer', 'Senior Volunteer', 'Team Lead', 'Chapter Lead']

function Passport() {
  const { volunteerId } = Route.useParams()
  const { os } = useOS()
  if (!os) return <LoadingState />

  const person = os.personBySlug.get(volunteerId)
  if (!person) {
    return (
      <Section>
        <Empty>
          No passport with that reference.{' '}
          <Link to="/people">Browse people</Link>.
        </Empty>
      </Section>
    )
  }

  const levelIndex = JOURNEY.indexOf(person.level)
  const missions = os.missions.filter((m) =>
    m.liveAssignments.some((a) => a.profileId === person.id),
  )

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap">
          <div className="gs-row" style={{ gap: 22, alignItems: 'flex-start' }}>
            <Avatar
              initials={person.initials}
              color={person.avatarColor}
              size="lg"
            />
            <div
              className="gs-stack"
              style={{ gap: 10, flex: 1, minWidth: 260 }}
            >
              <p className="gs-eyebrow">
                Goodness Passport · {person.goodnessId}
              </p>
              <h1 style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}>
                {person.fullName}
              </h1>
              <p className="gs-lede" style={{ maxWidth: 620 }}>
                {person.roleTitle} · {person.program?.name}
              </p>
              <div className="gs-row" style={{ gap: 6 }}>
                <Pill tone="green">{person.level}</Pill>
                <Pill>{person.city}</Pill>
                {person.chapter ? (
                  <Link
                    to="/chapters/$chapterId"
                    params={{ chapterId: person.chapter.id }}
                  >
                    <Pill tone="blue">{person.chapter.name}</Pill>
                  </Link>
                ) : null}
                <Pill>Joined {person.joinedMonth}</Pill>
                {person.sustainingMember ? (
                  <Pill tone="blue">Sustaining Member ✓</Pill>
                ) : null}
              </div>
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
            note={
              person.verifiedHours
                ? `${person.verifiedHours} verified in this system`
                : undefined
            }
          />
          <Stat
            gradient
            value={formatNumber(person.totalMissions)}
            label="Missions completed"
          />
          <Stat
            gradient
            value={formatNumber(person.peopleSupported)}
            label="People supported"
          />
          <Stat
            gradient
            value={formatNumber(person.programsCount)}
            label="Programmes worked in"
          />
        </div>
      </Section>

      <Section>
        <div
          className="gs-grid"
          style={{
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
            gap: 28,
          }}
        >
          <div className="gs-stack" style={{ gap: 26 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">In their words</p>
              <p style={{ fontSize: 19, lineHeight: 1.5, marginTop: 10 }}>
                “{person.quote}”
              </p>
              <p
                className="gs-small"
                style={{ marginTop: 16, color: 'var(--gs-ink-70)' }}
              >
                {person.bio}
              </p>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Journey</p>
              <div className="gs-row" style={{ gap: 8, marginTop: 14 }}>
                {JOURNEY.map((level, i) => (
                  <Pill
                    key={level}
                    tone={i <= levelIndex ? 'green' : 'neutral'}
                  >
                    {i <= levelIndex ? '✓ ' : ''}
                    {level}
                  </Pill>
                ))}
              </div>
              <p className="gs-small gs-muted" style={{ marginTop: 14 }}>
                Progression is earned through verified contribution, never
                granted by request.
              </p>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Credentials</p>
              <div className="gs-stack" style={{ gap: 10, marginTop: 14 }}>
                {person.credentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="gs-row gs-row--between"
                    style={{ gap: 12 }}
                  >
                    <div className="gs-stack" style={{ gap: 2 }}>
                      <strong className="gs-small">{credential.title}</strong>
                      <span className="gs-small gs-muted">
                        {credential.ref} · issued {credential.issuedLabel}
                      </span>
                    </div>
                    <div className="gs-row" style={{ gap: 8 }}>
                      <Pill
                        tone={credential.status === 'valid' ? 'green' : 'red'}
                      >
                        {credential.status === 'valid' ? 'Valid' : 'Revoked'}
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
            </div>

            {missions.length ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">Missions in this system</p>
                <div className="gs-stack" style={{ gap: 10, marginTop: 14 }}>
                  {missions.map((mission) => (
                    <Link
                      key={mission.id}
                      to="/missions/$missionId"
                      params={{ missionId: mission.id }}
                      className="gs-row gs-row--between"
                    >
                      <span className="gs-small">{mission.title}</span>
                      <span className="gs-small gs-muted">
                        {mission.dateLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Skills</p>
              <div className="gs-row" style={{ gap: 6, marginTop: 12 }}>
                {person.skills.map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Downloads</p>
              <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
                {person.certificateEnabled ? (
                  <>
                    <Link
                      to="/studio"
                      search={{ card: 'credential', person: person.slug }}
                      className="gs-btn gs-btn--primary gs-btn--sm gs-btn--block"
                    >
                      Certificate of service
                    </Link>
                    <Link
                      to="/studio"
                      search={{ person: person.slug }}
                      className="gs-btn gs-btn--ghost gs-btn--sm gs-btn--block"
                    >
                      Share this moment
                    </Link>
                  </>
                ) : (
                  <Banner variant="warn">
                    Certificate downloads are switched off for this passport by
                    an administrator.
                  </Banner>
                )}
              </div>
            </div>

            <div className="gs-card gs-card--wash">
              <p className="gs-eyebrow">What is public here</p>
              <p
                className="gs-small"
                style={{ marginTop: 10, color: 'var(--gs-ink-70)' }}
              >
                Name, role, programme, chapter, verified service and
                credentials. Contact details, address, identity documents and
                any administrative notes are never shown on a passport — they
                are not even readable by this page.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
