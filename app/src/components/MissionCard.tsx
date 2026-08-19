import { Link } from '@tanstack/react-router'
import type { MissionView } from '../data/os'
import { Bar, Pill } from './ui'

export function MissionCard({ mission }: { mission: MissionView }) {
  return (
    <Link
      to="/missions/$missionId"
      params={{ missionId: mission.id }}
      className="gs-card gs-card--flat gs-card--link"
    >
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
        <Pill>
          {mission.participation === 'remote'
            ? 'Remote'
            : (mission.chapter?.city ?? 'On site')}
        </Pill>
      </div>
      <h3 style={{ marginTop: 12, fontSize: 18 }}>{mission.title}</h3>
      <p className="gs-small gs-muted" style={{ marginTop: 6 }}>
        {mission.dateLabel} · {mission.timeLabel} · {mission.hours} hrs
      </p>
      <p
        className="gs-small"
        style={{ marginTop: 10, color: 'var(--gs-ink-70)' }}
      >
        {mission.impactTarget}
      </p>
      <div style={{ marginTop: 16 }}>
        <div className="gs-row gs-row--between" style={{ marginBottom: 6 }}>
          <span className="gs-small gs-muted">
            {mission.filled} of {mission.need} places filled
          </span>
          <strong className="gs-small">
            {mission.remaining > 0
              ? `${mission.remaining} still needed`
              : 'Team complete'}
          </strong>
        </div>
        <Bar
          pct={mission.fillPct}
          tone={mission.priority === 'urgent' ? 'amber' : 'green'}
          label={mission.title}
        />
      </div>
    </Link>
  )
}
