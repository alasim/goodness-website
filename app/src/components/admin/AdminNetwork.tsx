import { Link } from '@tanstack/react-router'
import type { OSModel } from '../../data/os'
import { Bar, Pill, Stat } from '../ui'
import { formatNumber, formatShortMoney } from '../../lib/format'
import { decideChapterRequest, decideProposal } from '../../data/actions'

/** Health is an HQ view: it is never published as a league table. */
function health(chapter: {
  standardsPct: number
  liveMissions: number
  memberCount: number
}) {
  if (chapter.standardsPct >= 100 && chapter.liveMissions > 0)
    return { label: 'Healthy', tone: 'green' as const }
  if (chapter.memberCount === 0 || chapter.standardsPct < 60)
    return { label: 'Needs support', tone: 'red' as const }
  return { label: 'Attention', tone: 'amber' as const }
}

export function AdminNetwork({ os }: { os: OSModel }) {
  const requests = os.data.chapterRequests
  const proposals = os.data.chapterProposals

  return (
    <div className="gs-stack" style={{ gap: 24 }}>
      <div className="gs-grid gs-grid--4">
        <Stat
          gradient
          value={String(os.stats.activeChapters)}
          label="Active chapters"
        />
        <Stat
          gradient
          value={String(os.formingChapters.length)}
          label="Forming"
        />
        <Stat
          gradient
          value={String(requests.filter((r) => r.stage === 'proposed').length)}
          label="Requests waiting"
        />
        <Stat
          gradient
          value={String(proposals.filter((p) => p.stage === 'pending').length)}
          label="Proposals waiting"
        />
      </div>

      <div>
        <p className="gs-eyebrow">Chapter health — internal view</p>
        <div className="gs-table-wrap" style={{ marginTop: 12 }}>
          <table className="gs-table">
            <thead>
              <tr>
                <th>Chapter</th>
                <th>Status</th>
                <th className="gs-table__num">Members</th>
                <th className="gs-table__num">Live missions</th>
                <th className="gs-table__num">People supported</th>
                <th className="gs-table__num">Deployed</th>
                <th>Standards</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {os.chapters.map((chapter) => {
                const signal = health(chapter)
                return (
                  <tr key={chapter.id}>
                    <td>
                      <Link
                        to="/chapters/$chapterId"
                        params={{ chapterId: chapter.id }}
                        className="gs-small"
                        style={{ fontWeight: 700 }}
                      >
                        {chapter.name}
                      </Link>
                    </td>
                    <td className="gs-small">{chapter.status}</td>
                    <td className="gs-table__num">{chapter.memberCount}</td>
                    <td className="gs-table__num">{chapter.liveMissions}</td>
                    <td className="gs-table__num">
                      {formatNumber(chapter.peopleSupported)}
                    </td>
                    <td className="gs-table__num">
                      {formatShortMoney(chapter.deployed, os.currency)}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <Bar
                        pct={chapter.standardsPct}
                        tone={chapter.standardsPct === 100 ? 'green' : 'amber'}
                        label={chapter.name}
                      />
                      <span className="gs-small gs-muted">
                        {chapter.standardsDone}/{chapter.standardsTotal}
                      </span>
                    </td>
                    <td>
                      <Pill tone={signal.tone}>{signal.label}</Pill>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="gs-small gs-muted" style={{ marginTop: 10 }}>
          Signals are for support conversations, not public comparison. There is
          no chapter leaderboard.
        </p>
      </div>

      <div className="gs-grid gs-grid--2">
        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Chapter requests</p>
          <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
            {requests.length ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="gs-row gs-row--between"
                  style={{ gap: 12, alignItems: 'flex-start' }}
                >
                  <div className="gs-stack" style={{ gap: 2 }}>
                    <strong className="gs-small">{request.city}</strong>
                    <span className="gs-small gs-muted">
                      {request.requesterName} · {request.peopleReady ?? '—'}{' '}
                      people ready
                    </span>
                    {request.why ? (
                      <span className="gs-small gs-muted">“{request.why}”</span>
                    ) : null}
                  </div>
                  {request.stage === 'proposed' ? (
                    <div className="gs-row" style={{ gap: 6 }}>
                      <button
                        type="button"
                        className="gs-btn gs-btn--primary gs-btn--sm"
                        onClick={() =>
                          void decideChapterRequest(request.id, true)
                        }
                      >
                        Approve → forming
                      </button>
                      <button
                        type="button"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                        onClick={() =>
                          void decideChapterRequest(
                            request.id,
                            false,
                            'Not yet — let us build interest first',
                          )
                        }
                      >
                        Return
                      </button>
                    </div>
                  ) : (
                    <Pill
                      tone={request.stage === 'forming' ? 'green' : 'neutral'}
                    >
                      {request.stage}
                    </Pill>
                  )}
                </div>
              ))
            ) : (
              <span className="gs-small gs-muted">No requests waiting.</span>
            )}
          </div>
        </div>

        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Proposals from chapters</p>
          <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
            {proposals.length ? (
              proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="gs-row gs-row--between"
                  style={{ gap: 12, alignItems: 'flex-start' }}
                >
                  <div className="gs-stack" style={{ gap: 2 }}>
                    <strong className="gs-small">{proposal.title}</strong>
                    <span className="gs-small gs-muted">
                      {os.chapterById.get(proposal.chapterId)?.name} ·{' '}
                      {proposal.kind}
                      {proposal.amount
                        ? ` · ${formatShortMoney(proposal.amount, os.currency)}`
                        : ''}
                    </span>
                  </div>
                  {proposal.stage === 'pending' ? (
                    <div className="gs-row" style={{ gap: 6 }}>
                      <button
                        type="button"
                        className="gs-btn gs-btn--primary gs-btn--sm"
                        onClick={() =>
                          void decideProposal(proposal.id, 'approved')
                        }
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                        onClick={() =>
                          void decideProposal(
                            proposal.id,
                            'returned',
                            'Needs more detail',
                          )
                        }
                      >
                        Return
                      </button>
                    </div>
                  ) : (
                    <Pill
                      tone={proposal.stage === 'approved' ? 'green' : 'amber'}
                    >
                      {proposal.stage}
                    </Pill>
                  )}
                </div>
              ))
            ) : (
              <span className="gs-small gs-muted">No proposals waiting.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminPartners({ os }: { os: OSModel }) {
  const stages = [
    'prospect',
    'conversation',
    'proposal',
    'active',
    'renewal',
    'dormant',
  ] as const
  return (
    <div className="gs-stack" style={{ gap: 20 }}>
      <p className="gs-eyebrow">Partnership pipeline</p>
      <div className="gs-grid gs-grid--3">
        {stages.map((stage) => {
          const partners = os.partners.filter((p) => p.stage === stage)
          return (
            <div
              key={stage}
              className="gs-card gs-card--flat gs-stack"
              style={{ gap: 10 }}
            >
              <div className="gs-row gs-row--between">
                <strong
                  className="gs-small"
                  style={{ textTransform: 'capitalize' }}
                >
                  {stage}
                </strong>
                <Pill>{partners.length}</Pill>
              </div>
              {partners.map((partner) => (
                <Link
                  key={partner.id}
                  to="/partners/$partnerId"
                  params={{ partnerId: partner.id }}
                  className="gs-small"
                >
                  {partner.name}
                  <span className="gs-muted">
                    {' '}
                    · {formatShortMoney(partner.received, os.currency)} received
                  </span>
                </Link>
              ))}
            </div>
          )
        })}
      </div>
      <p className="gs-small gs-muted">
        Renewal conversations start from what the partnership delivered, not
        from what is left to spend.
      </p>
    </div>
  )
}

export function AdminAudit({ os }: { os: OSModel }) {
  return (
    <div className="gs-stack" style={{ gap: 14 }}>
      <p className="gs-eyebrow">Audit trail</p>
      {os.data.auditEvents.length ? (
        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Before → after</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {os.data.auditEvents.map((event) => (
                <tr key={event.id}>
                  <td className="gs-small gs-muted">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                  <td className="gs-small">{event.actorLabel}</td>
                  <td className="gs-small">{event.action}</td>
                  <td className="gs-small gs-muted">
                    {event.entity}{' '}
                    {event.entityId ? `· ${event.entityId.slice(0, 14)}` : ''}
                  </td>
                  <td className="gs-small gs-muted">
                    {event.oldValue ? JSON.stringify(event.oldValue) : '—'} →{' '}
                    {event.newValue ? JSON.stringify(event.newValue) : '—'}
                  </td>
                  <td className="gs-small gs-muted">{event.reason ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="gs-small gs-muted">
          Nothing recorded in this session yet. Approvals, verifications,
          reversals and permission changes all land here with their before and
          after values.
        </p>
      )}
    </div>
  )
}
