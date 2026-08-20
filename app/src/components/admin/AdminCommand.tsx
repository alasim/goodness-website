import { Link } from '@tanstack/react-router'
import { formatNumber, formatShortMoney, timeAgo } from '../../lib/format'
import type { OSModel } from '../../data/os'

/**
 * The command screen, built from the overview pane of `Mission Control.dc.html`. It answers one
 * question — what is happening right now, and what is waiting on HQ — with every figure computed
 * from the same records the public pages read.
 */
export function AdminCommand({
  os,
  onGo,
}: {
  os: OSModel
  onGo: (tab: string) => void
}) {
  const applications = os.data.applications.filter(
    (a) => a.status === 'pending',
  )
  const toVerify = os.data.assignments.filter((a) => a.state === 'submitted')
  const expenses = os.finance.expenses.filter((e) => e.status === 'pending')
  const drafts = os.impact.filter((r) => !r.published)
  const chapterRequests = os.data.chapterRequests.filter(
    (r) => r.stage === 'proposed',
  )
  const proposals = os.data.chapterProposals.filter(
    (p) => p.stage === 'pending',
  )
  const enquiries = os.data.partnerEnquiries.filter((q) => q.stage === 'new')

  const inbox = [
    ...applications.map((a) => ({
      domain: 'People',
      accent: '#1B7A34',
      chipBg: '#f0faf3',
      chipColor: '#1B7A34',
      title: `${a.fullName} applied to volunteer`,
      meta: `${a.city ?? '—'} · ${a.programSlug ?? 'any programme'}`,
      tab: 'applications',
    })),
    ...toVerify.map((a) => ({
      domain: 'Attendance',
      accent: '#E65100',
      chipBg: '#fff3e0',
      chipColor: '#E65100',
      title: `Hours submitted on ${os.missionById.get(a.missionId)?.title ?? 'a mission'}`,
      meta: `${os.personById.get(a.profileId)?.fullName ?? 'A volunteer'} · awaiting verification`,
      tab: 'attendance',
    })),
    ...expenses.map((e) => ({
      domain: 'Money',
      accent: '#1565C0',
      chipBg: '#e8f0fc',
      chipColor: '#1565C0',
      title: `${e.item} — ${formatShortMoney(e.amount, os.currency)}`,
      meta: `${e.payee ?? 'Awaiting approval'} · ${e.evidence.length} document${e.evidence.length === 1 ? '' : 's'}`,
      tab: 'money',
    })),
    ...drafts.map((r) => ({
      domain: 'Impact',
      accent: '#6B21A8',
      chipBg: '#f5f0ff',
      chipColor: '#6B21A8',
      title: `${r.title} is still a draft`,
      meta: `Evidence ${r.evidenceVerified}/${r.evidenceTotal} verified`,
      tab: 'impact',
    })),
    ...chapterRequests.map((r) => ({
      domain: 'Network',
      accent: '#1B7A34',
      chipBg: '#f0faf3',
      chipColor: '#1B7A34',
      title: `Chapter requested in ${r.city}`,
      meta: `${r.requesterName} · ${r.peopleReady ?? 0} people ready`,
      tab: 'network',
    })),
    ...proposals.map((p) => ({
      domain: 'Network',
      accent: '#1B7A34',
      chipBg: '#f0faf3',
      chipColor: '#1B7A34',
      title: p.title,
      meta: `${p.kind} · chapter proposal`,
      tab: 'network',
    })),
    ...enquiries.map((q) => ({
      domain: 'Partners',
      accent: '#1565C0',
      chipBg: '#e8f0fc',
      chipColor: '#1565C0',
      title: `${q.organisation} wants to partner`,
      meta: `${q.contact}${q.commitmentRange ? ` · ${q.commitmentRange}` : ''}`,
      tab: 'partners',
    })),
  ]

  const worthSharing = [
    os.publishedImpact[0]
      ? {
          domain: 'Impact',
          chipBg: '#f5f0ff',
          chipColor: '#6B21A8',
          title: os.publishedImpact[0].title,
          meta: `${formatNumber(os.publishedImpact[0].primaryValue)} ${os.publishedImpact[0].unitLabel} · published`,
          card: `imppub-${os.publishedImpact[0].id}`,
        }
      : null,
    (() => {
      const urgent = os.openMissions.find((m) => m.priority === 'urgent')
      return urgent
        ? {
            domain: 'Missions',
            chipBg: '#fff3e0',
            chipColor: '#E65100',
            title: urgent.title,
            meta: `${urgent.remaining} positions still open · ${urgent.dateLabel ?? ''}`,
            card: `urgent-${urgent.id}`,
          }
        : null
    })(),
    (() => {
      const funding = os.opportunities.find(
        (o) => o.open && o.securedPct >= 25 && !o.funded,
      )
      return funding
        ? {
            domain: 'Funding',
            chipBg: '#e8f0fc',
            chipColor: '#1565C0',
            title: funding.title,
            meta: `${funding.securedPct}% secured · ${formatShortMoney(funding.gap, os.currency)} to go`,
            card: `pct-${funding.id}`,
          }
        : null
    })(),
    os.formingChapters[0]
      ? {
          domain: 'Network',
          chipBg: '#f0faf3',
          chipColor: '#1B7A34',
          title: `${os.formingChapters[0].name} is forming`,
          meta: `Goodness standards ${os.formingChapters[0].standardsDone}/${os.formingChapters[0].standardsTotal}`,
          card: `launch-${os.formingChapters[0].id}`,
        }
      : null,
  ].filter(Boolean) as Array<{
    domain: string
    chipBg: string
    chipColor: string
    title: string
    meta: string
    card: string
  }>

  const busiest = Math.max(
    1,
    ...os.activeChapters.map((c) => c.liveMissions + c.missions.length),
  )
  const audit = os.data.auditEvents.slice(0, 12)

  return (
    <div className="gs-stack" style={{ gap: 24 }}>
      <div className="gs-row gs-row--between" style={{ gap: 16 }}>
        <div>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            What's happening in Goodness right now
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--gs-ink-50)' }}>
            One view across people, operations, money, impact, partners, and the
            network · updates as you act
          </p>
        </div>
        <Link to="/people" style={{ fontSize: 13, fontWeight: 700 }}>
          View public site →
        </Link>
      </div>

      <div className="gs-mc-stats">
        <McStat
          value={formatNumber(os.stats.volunteers)}
          label="Active volunteers"
          green
        />
        <McStat
          value={String(os.stats.liveMissions)}
          label="Live missions"
          green
        />
        <McStat value={String(toVerify.length)} label="Hours to verify" amber />
        <McStat
          value={formatNumber(os.stats.verifiedHours)}
          label="Verified hours"
        />
        <McStat
          value={formatNumber(os.stats.peopleSupported)}
          label="People supported"
          green
        />
        <McStat
          value={formatShortMoney(os.finance.spent, os.currency)}
          label="Accepted spending"
        />
      </div>

      <section className="gs-mc-card">
        <div className="gs-row gs-row--between" style={{ gap: 10 }}>
          <div className="gs-mc-label">Decision inbox</div>
          <span
            className="gs-mc-chip"
            style={{
              background: inbox.length ? '#fff3e0' : '#f0faf3',
              color: inbox.length ? '#E65100' : '#1B7A34',
            }}
          >
            {inbox.length}
          </span>
        </div>
        <p className="gs-mc-note">
          Everything across the OS waiting on HQ — one queue, newest first.
          Acting on an item happens in its domain; this inbox takes you straight
          there.
        </p>
        {inbox.length === 0 ? (
          <div className="gs-mc-zero">
            Inbox zero — nothing in Goodness is waiting on HQ right now.
          </div>
        ) : (
          <div className="gs-stack" style={{ gap: 8 }}>
            {inbox.map((item) => (
              <div
                key={`${item.domain}-${item.title}`}
                className="gs-mc-row"
                style={{ borderLeftColor: item.accent }}
              >
                <span
                  className="gs-mc-domain"
                  style={{ background: item.chipBg, color: item.chipColor }}
                >
                  {item.domain}
                </span>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                    {item.meta}
                  </div>
                </div>
                <button
                  type="button"
                  className="gs-mc-review"
                  onClick={() => onGo(item.tab)}
                >
                  Review →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="gs-mc-card">
        <div className="gs-row gs-row--between" style={{ gap: 10 }}>
          <div className="gs-mc-label">Worth sharing now</div>
          <span
            className="gs-mc-chip"
            style={{ background: '#f0faf3', color: '#1B7A34' }}
          >
            {worthSharing.length}
          </span>
        </div>
        <p className="gs-mc-note">
          Moments across the OS that deserve a post — one click opens Share
          Studio with the card pre-selected, numbers already live.
        </p>
        <div className="gs-stack" style={{ gap: 8 }}>
          {worthSharing.map((item) => (
            <div key={item.card} className="gs-mc-row">
              <span
                className="gs-mc-domain"
                style={{ background: item.chipBg, color: item.chipColor }}
              >
                {item.domain}
              </span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                  {item.meta}
                </div>
              </div>
              <Link
                to="/studio"
                search={{ card: item.card }}
                className="gs-btn gs-btn--primary gs-btn--sm"
              >
                Create card →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="gs-mc-split">
        <section className="gs-mc-card">
          <div className="gs-mc-label" style={{ marginBottom: 16 }}>
            Live operations by city
          </div>
          <div className="gs-stack" style={{ gap: 12 }}>
            {os.activeChapters.map((chapter) => (
              <div key={chapter.id} className="gs-row" style={{ gap: 12 }}>
                <div
                  style={{
                    width: 96,
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {chapter.name.replace('Goodness ', '')}
                </div>
                <div className="gs-capbar" style={{ flex: 1, height: 10 }}>
                  <div
                    className="gs-capbar__fill"
                    style={{
                      width: `${Math.round(((chapter.liveMissions + chapter.missions.length) / busiest) * 100)}%`,
                      background: 'linear-gradient(90deg, #4DC86A, #1B7A34)',
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 96,
                    fontSize: 12,
                    color: 'var(--gs-ink-50)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {chapter.liveMissions} live · {chapter.missions.length} total
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="gs-mc-card">
          <div className="gs-mc-label" style={{ marginBottom: 16 }}>
            Audit log
          </div>
          {audit.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--gs-ink-40)' }}>
              No admin actions yet. Every change you make is recorded here —
              nothing is silently rewritten.
            </div>
          ) : (
            <div className="gs-mc-audit">
              {audit.map((event) => (
                <div
                  key={event.id}
                  className="gs-row"
                  style={{ gap: 10, alignItems: 'flex-start' }}
                >
                  <span className="gs-mc-dot" />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}
                    >
                      {event.action}
                      {event.entity ? ` · ${event.entity}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gs-ink-40)' }}>
                      {timeAgo(event.createdAt)} · {event.actorLabel ?? 'Admin'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function McStat({
  value,
  label,
  green,
  amber,
}: {
  value: string
  label: string
  green?: boolean
  amber?: boolean
}) {
  return (
    <div className="gs-mc-stat">
      <div
        className="gs-num"
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: green ? '#1B7A34' : amber ? '#E65100' : undefined,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--gs-ink-50)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}
