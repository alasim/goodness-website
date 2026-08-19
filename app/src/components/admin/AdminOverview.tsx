import { Link } from '@tanstack/react-router'
import type { OSModel } from '../../data/os'
import { Bar, Pill, Stat } from '../ui'
import { formatNumber, formatShortMoney, timeAgo } from '../../lib/format'

/** The first screen answers one question: what is happening right now, and what needs me. */
export function AdminOverview({
  os,
  onGo,
}: {
  os: OSModel
  onGo: (tab: string) => void
}) {
  const pendingApplications = os.data.applications.filter(
    (a) => a.status === 'pending',
  )
  const pendingExpenses = os.finance.expenses.filter(
    (e) => e.status === 'pending',
  )
  const awaitingVerification = os.data.assignments.filter(
    (a) => a.state === 'submitted',
  )
  const drafts = os.impact.filter((r) => !r.published)
  const chapterRequests = os.data.chapterRequests.filter(
    (r) => r.stage === 'proposed',
  )
  const proposals = os.data.chapterProposals.filter(
    (p) => p.stage === 'pending',
  )

  const worthSharing = [
    os.publishedImpact[0]
      ? {
          label: `Published record: ${os.publishedImpact[0].title}`,
          to: '/studio',
        }
      : null,
    os.openMissions.find((m) => m.priority === 'urgent')
      ? {
          label: `Urgent mission needs people: ${os.openMissions.find((m) => m.priority === 'urgent')!.title}`,
          to: '/studio',
        }
      : null,
    os.opportunities.find((o) => o.securedPct >= 50 && !o.funded)
      ? {
          label: `Funding past halfway: ${os.opportunities.find((o) => o.securedPct >= 50 && !o.funded)!.title}`,
          to: '/studio',
        }
      : null,
    os.formingChapters[0]
      ? {
          label: `Chapter forming: ${os.formingChapters[0].name}`,
          to: '/studio',
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; to: string }>

  const queue = [
    {
      label: 'Applications to review',
      count: pendingApplications.length,
      tab: 'applications',
    },
    {
      label: 'Hours awaiting verification',
      count: awaitingVerification.length,
      tab: 'attendance',
    },
    {
      label: 'Expenses awaiting approval',
      count: pendingExpenses.length,
      tab: 'money',
    },
    { label: 'Impact records in draft', count: drafts.length, tab: 'impact' },
    {
      label: 'Chapter requests',
      count: chapterRequests.length,
      tab: 'network',
    },
    { label: 'Chapter proposals', count: proposals.length, tab: 'network' },
  ]

  return (
    <div className="gs-stack" style={{ gap: 26 }}>
      <div className="gs-grid gs-grid--4">
        <Stat
          gradient
          value={formatNumber(os.stats.volunteers)}
          label="Active volunteers"
        />
        <Stat
          gradient
          value={String(os.stats.liveMissions)}
          label="Live missions"
          note={`${os.stats.openPositions} places open`}
        />
        <Stat
          gradient
          value={formatNumber(os.stats.peopleSupported)}
          label="People supported"
        />
        <Stat
          gradient
          value={formatShortMoney(os.finance.spent, os.currency)}
          label="Funds deployed"
          note={`${formatShortMoney(os.finance.pending, os.currency)} pending`}
        />
      </div>

      <div className="gs-grid gs-grid--2">
        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Needs a decision</p>
          <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
            {queue.map((row) => (
              <button
                key={row.label}
                type="button"
                className="gs-row gs-row--between"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 0',
                  cursor: 'pointer',
                  width: '100%',
                }}
                onClick={() => onGo(row.tab)}
              >
                <span className="gs-small">{row.label}</span>
                <Pill tone={row.count > 0 ? 'amber' : 'green'}>
                  {row.count}
                </Pill>
              </button>
            ))}
          </div>
        </div>

        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Live operations by chapter</p>
          <div className="gs-stack" style={{ gap: 12, marginTop: 12 }}>
            {os.activeChapters.map((chapter) => (
              <div key={chapter.id} className="gs-stack" style={{ gap: 4 }}>
                <div className="gs-row gs-row--between">
                  <span className="gs-small">{chapter.name}</span>
                  <span className="gs-small gs-muted">
                    {chapter.liveMissions} live · {chapter.memberCount} members
                  </span>
                </div>
                <Bar
                  pct={chapter.standardsPct}
                  tone={chapter.standardsPct === 100 ? 'green' : 'amber'}
                  label={chapter.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gs-grid gs-grid--2">
        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Worth sharing now</p>
          <div className="gs-stack" style={{ gap: 10, marginTop: 12 }}>
            {worthSharing.map((item) => (
              <div
                key={item.label}
                className="gs-row gs-row--between"
                style={{ gap: 12 }}
              >
                <span className="gs-small">{item.label}</span>
                <Link to="/studio" className="gs-btn gs-btn--ghost gs-btn--sm">
                  Create card
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="gs-card gs-card--flat">
          <p className="gs-eyebrow">Audit trail</p>
          <div className="gs-stack" style={{ gap: 8, marginTop: 12 }}>
            {os.data.auditEvents.slice(0, 8).map((event) => (
              <div
                key={event.id}
                className="gs-row gs-row--between"
                style={{ gap: 10 }}
              >
                <span className="gs-small">
                  {event.action}{' '}
                  <span className="gs-muted">· {event.entity}</span>
                </span>
                <span className="gs-small gs-muted">
                  {timeAgo(event.createdAt)}
                </span>
              </div>
            ))}
            {os.data.auditEvents.length === 0 ? (
              <span className="gs-small gs-muted">
                No governed changes recorded in this session yet.
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
