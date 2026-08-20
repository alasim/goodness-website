import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useClaimedChapterId, useOS } from '../../hooks/useOS'
import { useCurrentPerson } from '../../hooks/useCurrentPerson'
import { LoadingState } from '../../components/LoadingState'
import { MissionCard } from '../../components/MissionCard'
import {
  Avatar,
  Banner,
  Bar,
  Empty,
  Pill,
  Section,
  Stat,
} from '../../components/ui'
import {
  claimChapterLead,
  setMyChapter,
  submitProposal,
} from '../../data/actions'
import { formatNumber, formatShortMoney } from '../../lib/format'

export const Route = createFileRoute('/chapters/$chapterId')({
  component: ChapterPage,
})

function ChapterPage() {
  const { chapterId } = Route.useParams()
  const { os } = useOS()
  const { person } = useCurrentPerson()
  const claimedLead = useClaimedChapterId()
  const [proposalSent, setProposalSent] = useState(false)

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

  const isMine = person?.chapterId === chapter.id
  const leadsThis =
    claimedLead === chapter.id ||
    os.data.memberRoles.some(
      (role) =>
        role.chapterId === chapter.id &&
        role.role === 'chapter_lead' &&
        role.profileId === person?.id,
    )
  const openMissions = chapter.missions.filter((m) => m.status === 'open')
  const fundingNeeds = os.opportunities.filter(
    (o) =>
      !o.funded &&
      (o.whereLabel ?? '').toLowerCase().includes(chapter.city.toLowerCase()),
  )
  const proposals = os.data.chapterProposals.filter(
    (p) => p.chapterId === chapter.id,
  )
  const announcements = os.data.announcements.filter(
    (a) => a.audience === 'network' || a.chapterId === chapter.id,
  )

  return (
    <>
      <section className="gs-hero">
        <div className="gs-wrap gs-stack" style={{ gap: 16 }}>
          <div className="gs-row" style={{ gap: 6 }}>
            <Pill tone={chapter.status === 'active' ? 'green' : 'amber'}>
              {chapter.status}
            </Pill>
            <Pill>{chapter.type} chapter</Pill>
            {chapter.parent ? (
              <Link
                to="/chapters/$chapterId"
                params={{ chapterId: chapter.parent.id }}
              >
                <Pill tone="blue">Within {chapter.parent.name}</Pill>
              </Link>
            ) : null}
            <Pill>Since {chapter.sinceLabel}</Pill>
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}>
            {chapter.name}
          </h1>
          <p className="gs-lede" style={{ maxWidth: 660 }}>
            {chapter.story}
          </p>
          <div className="gs-row" style={{ gap: 8 }}>
            {person && !isMine ? (
              <button
                type="button"
                className="gs-btn gs-btn--primary gs-btn--sm"
                onClick={() => void setMyChapter(person.id, chapter.id)}
              >
                Make this my chapter
              </button>
            ) : null}
            {isMine ? <Pill tone="green">Your chapter</Pill> : null}
            <Link
              to="/studio"
              search={{ chapter: chapter.id }}
              className="gs-btn gs-btn--ghost gs-btn--sm"
            >
              Share this chapter
            </Link>
            {!leadsThis ? (
              <button
                type="button"
                className="gs-btn gs-btn--ghost gs-btn--sm"
                onClick={() => claimChapterLead(chapter.id)}
              >
                I lead this chapter
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat gradient value={String(chapter.memberCount)} label="Members" />
          <Stat
            gradient
            value={formatNumber(chapter.hours)}
            label="Verified service hours"
          />
          <Stat
            gradient
            value={formatNumber(chapter.peopleSupported)}
            label="People supported"
            note="Published records"
          />
          <Stat
            gradient
            value={formatShortMoney(chapter.deployed, os.currency)}
            label="Deployed locally"
          />
        </div>
        {chapter.campusNote ? (
          <p className="gs-small gs-muted" style={{ marginTop: 14 }}>
            {chapter.campusNote}
          </p>
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
            <div>
              <div
                className="gs-row gs-row--between"
                style={{ marginBottom: 14 }}
              >
                <h2 style={{ fontSize: 26 }}>Needs now</h2>
                <Link
                  to="/missions"
                  className="gs-btn gs-btn--ghost gs-btn--sm"
                >
                  All missions
                </Link>
              </div>
              {openMissions.length ? (
                <div className="gs-grid gs-grid--2">
                  {openMissions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
                </div>
              ) : (
                <Empty>
                  No open missions here this week — check back, or start one
                  with your chapter lead.
                </Empty>
              )}
            </div>

            {fundingNeeds.length ? (
              <div className="gs-card gs-card--flat">
                <p className="gs-eyebrow">Funding needs</p>
                <div className="gs-stack" style={{ gap: 14, marginTop: 12 }}>
                  {fundingNeeds.map((need) => (
                    <div key={need.id} className="gs-stack" style={{ gap: 4 }}>
                      <div className="gs-row gs-row--between">
                        <Link
                          to="/fund"
                          className="gs-small"
                          style={{ fontWeight: 700 }}
                        >
                          {need.title}
                        </Link>
                        <span className="gs-small gs-muted">
                          {formatShortMoney(need.gap, os.currency)} still needed
                        </span>
                      </div>
                      <Bar
                        pct={need.securedPct}
                        tone={need.urgent ? 'amber' : 'green'}
                        label={need.title}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Published impact from this chapter</p>
              {chapter.impact.length ? (
                <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                  {chapter.impact.map((record) => (
                    <div key={record.id} className="gs-row gs-row--between">
                      <Link
                        to="/impact"
                        hash={record.id}
                        className="gs-small"
                        style={{ fontWeight: 700 }}
                      >
                        {record.title}
                      </Link>
                      <span className="gs-small gs-muted">
                        {formatNumber(record.primaryValue)} {record.unitLabel} ·{' '}
                        {record.evidenceVerified}/{record.evidenceTotal}{' '}
                        evidence checked
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="gs-small gs-muted" style={{ marginTop: 10 }}>
                  Nothing published yet. Records are published by HQ once the
                  evidence is in.
                </p>
              )}
            </div>

            {leadsThis ? (
              <div className="gs-card gs-card--blue-wash">
                <p className="gs-eyebrow">Chapter Control</p>
                <h3 style={{ marginTop: 8, fontSize: 20 }}>
                  Your chapter, within the guardrails
                </h3>
                <p
                  className="gs-small"
                  style={{ color: 'var(--gs-ink-70)', marginTop: 8 }}
                >
                  You can publish low-risk missions yourself. Budgets, published
                  impact records, credentials and public opportunities go to HQ
                  first — that is what keeps one chapter's claim as trustworthy
                  as the whole network's.
                </p>

                <div className="gs-stack" style={{ gap: 10, marginTop: 16 }}>
                  <div className="gs-row gs-row--between">
                    <span className="gs-small">Goodness Standards</span>
                    <span className="gs-small gs-num">
                      {chapter.standardsDone}/{chapter.standardsTotal}
                    </span>
                  </div>
                  <Bar pct={chapter.standardsPct} label="Goodness Standards" />
                </div>

                {proposalSent ? (
                  <Banner>
                    Sent to HQ. You will see the decision here with any note
                    attached.
                  </Banner>
                ) : (
                  <form
                    className="gs-stack"
                    style={{ gap: 10, marginTop: 16 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      const form = new FormData(e.currentTarget)
                      void submitProposal({
                        chapterId: chapter.id,
                        title: String(form.get('title') ?? ''),
                        kind: String(form.get('kind') ?? 'mission'),
                        detail: String(form.get('detail') ?? ''),
                        amount: Number(form.get('amount') ?? 0) || undefined,
                      }).then(() => setProposalSent(true))
                    }}
                  >
                    <input
                      name="title"
                      required
                      placeholder="What are you proposing?"
                      aria-label="Proposal title"
                    />
                    <div className="gs-grid gs-grid--2">
                      <select
                        name="kind"
                        defaultValue="mission"
                        aria-label="Proposal type"
                      >
                        <option value="mission">Mission</option>
                        <option value="budget">Budget</option>
                        <option value="impact">
                          Impact record publication
                        </option>
                        <option value="opportunity">Funding opportunity</option>
                      </select>
                      <input
                        name="amount"
                        type="number"
                        min={0}
                        placeholder={`Amount (${os.currency}) if any`}
                        aria-label="Amount"
                      />
                    </div>
                    <textarea
                      name="detail"
                      rows={3}
                      placeholder="Anything HQ needs to know"
                      aria-label="Detail"
                    />
                    <button
                      type="submit"
                      className="gs-btn gs-btn--primary gs-btn--sm"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Send to HQ
                    </button>
                  </form>
                )}

                {proposals.length ? (
                  <div className="gs-stack" style={{ gap: 8, marginTop: 18 }}>
                    <p className="gs-eyebrow">Your proposals</p>
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="gs-row gs-row--between">
                        <span className="gs-small">{proposal.title}</span>
                        <Pill
                          tone={
                            proposal.stage === 'approved'
                              ? 'green'
                              : proposal.stage === 'returned'
                                ? 'amber'
                                : 'neutral'
                          }
                        >
                          {proposal.stage}
                        </Pill>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="gs-stack" style={{ gap: 20 }}>
            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Leadership</p>
              <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                {chapter.team
                  .filter((member) => !member.untilLabel)
                  .map((member, i) => (
                    <div
                      key={`${member.role}-${i}`}
                      className="gs-row"
                      style={{ gap: 10 }}
                    >
                      {member.volunteer ? (
                        <Avatar
                          initials={member.volunteer.initials}
                          color={member.volunteer.avatarColor}
                          size="sm"
                        />
                      ) : null}
                      <div className="gs-stack" style={{ gap: 0 }}>
                        {member.volunteer ? (
                          <Link
                            to="/people/$volunteerId"
                            params={{ volunteerId: member.volunteer.slug }}
                            className="gs-small"
                            style={{ fontWeight: 700 }}
                          >
                            {member.volunteer.fullName}
                          </Link>
                        ) : (
                          <span
                            className="gs-small"
                            style={{ fontWeight: 700 }}
                          >
                            {member.personName}
                          </span>
                        )}
                        <span className="gs-small gs-muted">
                          {member.role} · since {member.sinceLabel}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              {chapter.team.some((m) => m.untilLabel) ? (
                <div className="gs-stack" style={{ gap: 6, marginTop: 14 }}>
                  <p className="gs-eyebrow">Previously</p>
                  {chapter.team
                    .filter((m) => m.untilLabel)
                    .map((member, i) => (
                      <span key={i} className="gs-small gs-muted">
                        {member.volunteer?.fullName ?? member.personName} ·{' '}
                        {member.role} ({member.untilLabel})
                      </span>
                    ))}
                </div>
              ) : null}
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Goals this year</p>
              <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
                {chapter.goals.map((goal) => (
                  <div key={goal.id} className="gs-stack" style={{ gap: 4 }}>
                    <div className="gs-row gs-row--between">
                      <span className="gs-small">{goal.label}</span>
                      <span className="gs-small gs-num">
                        {formatNumber(goal.current)} /{' '}
                        {formatNumber(goal.target)}
                      </span>
                    </div>
                    <Bar pct={goal.pct} label={goal.label} />
                  </div>
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Local partners</p>
              <div className="gs-stack" style={{ gap: 8, marginTop: 10 }}>
                {chapter.partners.length ? (
                  chapter.partners.map((partner) => (
                    <Link
                      key={partner.id}
                      to="/partners/$partnerId"
                      params={{ partnerId: partner.id }}
                      className="gs-small"
                      style={{ fontWeight: 600 }}
                    >
                      {partner.name}
                    </Link>
                  ))
                ) : (
                  <span className="gs-small gs-muted">
                    No local partner yet.
                  </span>
                )}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">From HQ</p>
              <div className="gs-stack" style={{ gap: 12, marginTop: 10 }}>
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="gs-stack"
                    style={{ gap: 4 }}
                  >
                    <strong className="gs-small">{announcement.title}</strong>
                    <span className="gs-small gs-muted">
                      {announcement.body}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gs-card gs-card--flat">
              <p className="gs-eyebrow">Members</p>
              <div className="gs-stack" style={{ gap: 8, marginTop: 10 }}>
                {chapter.members.slice(0, 8).map((member) => (
                  <Link
                    key={member.id}
                    to="/people/$volunteerId"
                    params={{ volunteerId: member.slug }}
                    className="gs-row gs-row--between"
                  >
                    <span className="gs-small">{member.fullName}</span>
                    <span className="gs-small gs-muted">
                      {member.totalHours} hrs
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
