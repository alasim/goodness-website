import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { useCurrentPerson } from '../../hooks/useCurrentPerson'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Empty, Section } from '../../components/ui'
import { setMyChapter } from '../../data/actions'
import { formatNumber, formatShortMoney } from '../../lib/format'
import type { ChapterView } from '../../data/os'

/** Chapter — a faithful build of `Chapter.dc.html`. */
export const Route = createFileRoute('/chapters/$chapterId')({
  component: ChapterPage,
})

function ChapterPage() {
  const { chapterId } = Route.useParams()
  const { os } = useOS()
  const { person } = useCurrentPerson()
  const [justJoined, setJustJoined] = useState(false)

  if (!os) return <LoadingState />
  const chapter = os.chapterById.get(chapterId)
  if (!chapter) {
    return (
      <Section>
        <Empty>
          No chapter with that reference.{' '}
          <Link to="/chapters">See the network</Link>.
        </Empty>
      </Section>
    )
  }

  const forming = chapter.status === 'forming'
  const university = chapter.type === 'university'
  const shortName = chapter.name.replace('Goodness ', '')
  const isMine = person?.chapterId === chapter.id
  const openMissions = chapter.missions.filter((m) => m.status === 'open')
  const money = (n: number) => formatShortMoney(n, os.currency)

  // "Needed now" reads the open roles the way the design does: what is left after live claims and
  // the share of historical participants carried over on that mission.
  const needs: Array<{
    title: string
    note: string
    icon: string
    bg: string
    color: string
    to: string
    params?: Record<string, string>
  }> = []
  openMissions.forEach((mission) => {
    mission.roles.forEach((role) => {
      const carried = Math.round(
        mission.seedFilled / Math.max(1, mission.roles.length),
      )
      const left = role.need - role.filled - carried
      if (left > 0 && needs.length < 3) {
        needs.push({
          title: `${left} × ${role.role}`,
          note: mission.title,
          icon: '♥',
          bg: '#f0faf3',
          color: '#1B7A34',
          to: '/missions/$missionId',
          params: { missionId: mission.id },
        })
      }
    })
  })
  if (needs.length < 3 && !forming) {
    needs.push({
      title: 'Local partner',
      note: `Fund or resource ${chapter.name}’s next initiative`,
      icon: '৳',
      bg: '#e8f0fc',
      color: '#1565C0',
      to: '/partner',
    })
  }

  const stories: Array<string> = []
  if (chapter.hours >= 500)
    stories.push(
      `${chapter.name} crossed ${formatNumber(chapter.hours)} verified volunteer hours.`,
    )
  chapter.impact
    .slice(0, 1)
    .forEach((record) =>
      stories.push(
        `${record.title} — ${formatNumber(record.beneficiaries)} people supported, evidence ${record.evidenceVerified}/${record.evidenceTotal} verified.`,
      ),
    )
  chapter.team
    .filter((t) => t.volunteer && !t.untilLabel)
    .slice(0, 1)
    .forEach((t) =>
      stories.push(
        `${t.volunteer!.fullName} has been ${t.role} since ${t.sinceLabel}.`,
      ),
    )

  const history = chapter.team.filter((t) => t.untilLabel)

  return (
    <div className="gs-narrow" style={{ maxWidth: 1120 }}>
      <Link to="/chapters" className="gs-backlink" style={{ marginBottom: 20 }}>
        ← All chapters
      </Link>

      <section className="gs-inkhero">
        <GWatermark width={400} height={270} style={{ opacity: 0.07 }} />
        <div style={{ position: 'relative' }}>
          <div className="gs-row" style={{ gap: 8, marginBottom: 14 }}>
            <span
              className="gs-tag"
              style={{
                padding: '4px 12px',
                background: university ? '#e8f0fc' : '#4DC86A',
                color: university ? '#1565C0' : '#0D3B1A',
              }}
            >
              {university ? 'University chapter' : 'District chapter'}
            </span>
            {forming ? (
              <span
                className="gs-tag"
                style={{
                  padding: '4px 12px',
                  background: '#E65100',
                  color: '#fff',
                }}
              >
                Forming
              </span>
            ) : null}
            {chapter.parent ? (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                under {chapter.parent.name}
              </span>
            ) : null}
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              · since {chapter.sinceLabel}
            </span>
          </div>

          <h1 style={{ margin: '0 0 10px' }}>{chapter.name}</h1>
          <p
            style={{
              margin: '0 0 24px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 15,
              lineHeight: 1.65,
              maxWidth: 640,
            }}
          >
            {chapter.story}
          </p>

          {!forming ? (
            <div
              className="gs-inkbar"
              style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
            >
              <div>
                <div
                  style={{ fontSize: 21, fontWeight: 800 }}
                  className="gs-num"
                >
                  {university ? 26 : chapter.memberCount}
                </div>
                <div
                  className="gs-inkbar__label"
                  style={{ marginTop: 2, marginBottom: 0 }}
                >
                  Members
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: 'var(--gs-green)',
                  }}
                  className="gs-num"
                >
                  {university ? 210 : formatNumber(chapter.hours)}
                </div>
                <div
                  className="gs-inkbar__label"
                  style={{ marginTop: 2, marginBottom: 0 }}
                >
                  Verified hours
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 21, fontWeight: 800 }}
                  className="gs-num"
                >
                  {formatNumber(chapter.peopleSupported)}
                </div>
                <div
                  className="gs-inkbar__label"
                  style={{ marginTop: 2, marginBottom: 0 }}
                >
                  People supported
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 21, fontWeight: 800 }}
                  className="gs-num"
                >
                  {chapter.partners.length}
                </div>
                <div
                  className="gs-inkbar__label"
                  style={{ marginTop: 2, marginBottom: 0 }}
                >
                  Local partners
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 21, fontWeight: 800 }}
                  className="gs-num"
                >
                  {money(chapter.deployed)}
                </div>
                <div
                  className="gs-inkbar__label"
                  style={{ marginTop: 2, marginBottom: 0 }}
                >
                  Deployed locally
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 6,
                padding: '14px 18px',
                borderRadius: 12,
                background: 'rgba(230,81,0,0.15)',
                border: '1px solid rgba(230,81,0,0.4)',
                color: '#FFB74D',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Forming · Goodness standards {chapter.standardsDone} /{' '}
              {chapter.standardsTotal} complete · supported by Goodness
              Chattogram
            </div>
          )}
        </div>
      </section>

      <div
        className="gs-detailgrid"
        style={{ gridTemplateColumns: '1.15fr 0.85fr' }}
      >
        <div className="gs-detailcol">
          {needs.length ? (
            <section className="gs-panelcard">
              <h2
                className="gs-panelhead"
                style={{ color: '#E65100', marginBottom: 4 }}
              >
                Needed now
              </h2>
              <p
                style={{
                  margin: '0 0 14px',
                  fontSize: 12,
                  color: 'var(--gs-ink-40)',
                }}
              >
                How you can help this chapter this week.
              </p>
              <div className="gs-stack" style={{ gap: 10 }}>
                {needs.map((need, i) => (
                  <Link
                    key={i}
                    to={need.to}
                    params={need.params}
                    className="gs-teamrow"
                    style={{ padding: '13px 16px' }}
                  >
                    <span
                      className="gs-mark"
                      style={{
                        width: 30,
                        height: 30,
                        fontSize: 13,
                        background: need.bg,
                        color: need.color,
                      }}
                    >
                      {need.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {need.title}
                      </div>
                      <div
                        style={{ fontSize: 11.5, color: 'var(--gs-ink-50)' }}
                      >
                        {need.note}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--gs-green-deep)',
                      }}
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
              Missions in {chapter.city}
            </h2>
            {chapter.missions.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                No missions listed here yet.
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 10 }}>
                {chapter.missions.map((mission) => {
                  const done = mission.status === 'completed'
                  const full = mission.isFull || mission.status === 'full'
                  const urgent = mission.priority === 'urgent'
                  return (
                    <Link
                      key={mission.id}
                      to="/missions/$missionId"
                      params={{ missionId: mission.id }}
                      className="gs-teamrow"
                      style={{ padding: '14px 16px', borderRadius: 14 }}
                    >
                      <span
                        className="gs-tag"
                        style={{
                          letterSpacing: 0,
                          background: done
                            ? '#f0f1f3'
                            : urgent
                              ? '#fff3e0'
                              : full
                                ? '#e8f0fc'
                                : '#f0faf3',
                          color: done
                            ? '#6B7280'
                            : urgent
                              ? '#E65100'
                              : full
                                ? '#1565C0'
                                : '#1B7A34',
                        }}
                      >
                        {done
                          ? 'Completed'
                          : full
                            ? 'Full'
                            : urgent
                              ? 'Urgent'
                              : 'Open'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                          {mission.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: 'var(--gs-ink-50)',
                            marginTop: 2,
                          }}
                        >
                          {mission.dateLabel} · {mission.filled}/{mission.need}{' '}
                          roles filled · {mission.hours} service hours
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--gs-green-deep)',
                        }}
                      >
                        View →
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
              Published impact from this chapter
            </h2>
            {chapter.impact.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                No published impact records yet — nothing is invented before
                it’s measured.
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 10 }}>
                {chapter.impact.map((record) => (
                  <Link
                    key={record.id}
                    to="/impact"
                    hash={record.id}
                    className="gs-teamrow"
                    style={{ padding: '14px 16px', borderRadius: 14 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                        {record.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: 'var(--gs-ink-50)',
                          marginTop: 2,
                        }}
                      >
                        {formatNumber(record.primaryValue)} {record.unitLabel} ·
                        evidence {record.evidenceVerified}/
                        {record.evidenceTotal} verified
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--gs-green-deep)',
                      }}
                    >
                      Record →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {stories.length ? (
            <section className="gs-panelcard gs-panelcard--wash">
              <h2
                className="gs-panelhead gs-panelhead--green"
                style={{ marginBottom: 14 }}
              >
                From this chapter
              </h2>
              <div className="gs-stack" style={{ gap: 10 }}>
                {stories.map((story) => (
                  <div
                    key={story}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--gs-green)',
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: '#374151',
                        lineHeight: 1.55,
                      }}
                    >
                      {story}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="gs-detailcol">
          <section className="gs-panelcard">
            <div
              className="gs-row gs-row--between"
              style={{ gap: 10, marginBottom: 14 }}
            >
              <h2 className="gs-panelhead">Chapter team</h2>
              <Link
                to="/chapter-control"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                Lead? Chapter Control ↗
              </Link>
            </div>
            {chapter.team.filter((t) => t.volunteer && !t.untilLabel).length ===
            0 ? (
              <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                Leadership team being established.
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 10 }}>
                {chapter.team
                  .filter((t) => t.volunteer && !t.untilLabel)
                  .map((member, i) => (
                    <Link
                      key={i}
                      to="/people/$volunteerId"
                      params={{ volunteerId: member.volunteer!.slug }}
                      className="gs-teamrow"
                    >
                      <span
                        className={`gs-mark ${member.volunteer!.avatarColor === 'blue' ? 'gs-mark--blue' : member.volunteer!.avatarColor === 'teal' ? 'gs-mark--teal' : ''}`}
                        style={{ width: 36, height: 36, fontSize: 12 }}
                      >
                        {member.volunteer!.initials}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {member.volunteer!.fullName}
                        </div>
                        <div
                          style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}
                        >
                          {member.role} · since {member.sinceLabel}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
            {history.length ? (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid var(--gs-line-soft)',
                  fontSize: 11.5,
                  color: 'var(--gs-ink-40)',
                }}
              >
                {history
                  .map(
                    (h) =>
                      `${h.volunteer?.fullName ?? h.personName} — ${h.role} (${h.untilLabel})`,
                  )
                  .join(' · ')}
              </div>
            ) : null}
          </section>

          {chapter.goals.length ? (
            <section className="gs-panelcard">
              <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
                2026 goals
              </h2>
              <div className="gs-stack" style={{ gap: 14 }}>
                {chapter.goals.map((goal) => (
                  <div key={goal.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 10,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                        {goal.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: 'var(--gs-green-deep)',
                        }}
                      >
                        {formatNumber(goal.current)} /{' '}
                        {formatNumber(goal.target)}
                      </span>
                    </div>
                    <div className="gs-capbar">
                      <div
                        className="gs-capbar__fill"
                        style={{
                          width: `${goal.pct}%`,
                          background:
                            'linear-gradient(90deg, #4DC86A, #1B7A34)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="gs-panelcard">
            <h2 className="gs-panelhead" style={{ marginBottom: 14 }}>
              Partners powering {shortName}
            </h2>
            {chapter.partners.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
                No local partners yet — be the first.
              </div>
            ) : (
              <div className="gs-stack" style={{ gap: 8 }}>
                {chapter.partners.map((partner) => (
                  <Link
                    key={partner.id}
                    to="/partners/$partnerId"
                    params={{ partnerId: partner.id }}
                    className="gs-teamrow"
                  >
                    <span
                      className="gs-mark gs-mark--blue"
                      style={{ width: 28, height: 28, fontSize: 10 }}
                    >
                      {(partner.name.match(/[A-Z]/g) ?? [])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {partner.name}
                      </div>
                      <div
                        style={{ fontSize: 10.5, color: 'var(--gs-ink-40)' }}
                      >
                        {partner.tier}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              to="/fund"
              style={{
                display: 'inline-block',
                marginTop: 12,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Help fund {shortName} →
            </Link>
          </section>

          {(isMine || justJoined) && !forming ? (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 999,
                background: 'var(--gs-green-wash)',
                border: '1px solid rgba(27,122,52,0.3)',
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 800,
                color: 'var(--gs-green-deep)',
              }}
            >
              {justJoined
                ? `You now belong to ${chapter.name} ✓`
                : 'This is your chapter ✓'}
            </div>
          ) : person && !forming ? (
            <button
              type="button"
              className="gs-btn gs-btn--primary gs-btn--block"
              style={{ padding: '15px 0', fontSize: 14 }}
              onClick={() => {
                void setMyChapter(person.id, chapter.id)
                setJustJoined(true)
              }}
            >
              Make this my chapter →
            </button>
          ) : (
            <Link
              to={forming ? '/join' : '/me'}
              className="gs-btn gs-btn--primary gs-btn--block"
              style={{ padding: '15px 0', fontSize: 14 }}
            >
              {forming ? 'Help form this chapter' : `Join ${chapter.name}`} →
            </Link>
          )}

          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: 'var(--gs-ink-40)',
              lineHeight: 1.6,
            }}
          >
            Your primary chapter is where you belong organisationally — you can
            still join missions anywhere in Goodness.
          </p>

          {(isMine && !forming) || forming ? (
            <div className="gs-row" style={{ gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: 'var(--gs-ink-40)',
                }}
              >
                SHARE THIS CHAPTER:
              </span>
              {forming ? (
                <Link
                  to="/studio"
                  search={{ card: 'launch', chapter: chapter.id }}
                  className="gs-tag gs-tag--program"
                  style={{
                    background: '#f0faf3',
                    border: '1px solid rgba(27,122,52,0.25)',
                    color: '#1B7A34',
                    padding: '6px 12px',
                  }}
                >
                  Recruit founding volunteers
                </Link>
              ) : (
                <>
                  <Link
                    to="/studio"
                    search={{ card: 'chapter', chapter: chapter.id }}
                    className="gs-tag gs-tag--program"
                    style={{
                      background: '#f0faf3',
                      border: '1px solid rgba(27,122,52,0.25)',
                      color: '#1B7A34',
                      padding: '6px 12px',
                    }}
                  >
                    Proud member
                  </Link>
                  <Link
                    to="/studio"
                    search={{ card: 'chapmile', chapter: chapter.id }}
                    className="gs-tag gs-tag--program"
                    style={{
                      background: '#f0faf3',
                      border: '1px solid rgba(27,122,52,0.25)',
                      color: '#1B7A34',
                      padding: '6px 12px',
                    }}
                  >
                    Chapter milestone
                  </Link>
                  <Link
                    to="/studio"
                    search={{ card: 'yearchapter', chapter: chapter.id }}
                    className="gs-tag gs-tag--program"
                    style={{
                      background: '#f0faf3',
                      border: '1px solid rgba(27,122,52,0.25)',
                      color: '#1B7A34',
                      padding: '6px 12px',
                    }}
                  >
                    Year in review
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export type { ChapterView }
