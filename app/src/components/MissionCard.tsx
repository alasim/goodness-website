import { Link } from '@tanstack/react-router'
import type { MissionView } from '../data/os'

/**
 * Mission card — built from `Missions.dc.html`: an accent rail on top (grey when the mission is
 * closed, orange when urgent, otherwise the programme's light tone), status tags, the venue and
 * date lines, a capacity bar in the programme's gradient, and a CTA row.
 */
export function MissionCard({ mission }: { mission: MissionView }) {
  const program = mission.program
  const color = program?.color ?? '#1B7A34'
  const light = program?.lightColor ?? '#4DC86A'
  const bg = program?.bgColor ?? '#f0faf3'
  const done = mission.status === 'completed' || mission.status === 'cancelled'
  const full = mission.isFull || mission.status === 'full'
  const urgent = mission.priority === 'urgent'
  const remote = mission.participation === 'remote'
  const accent = done ? '#D1D5DB' : urgent ? '#E65100' : light

  return (
    <Link
      to="/missions/$missionId"
      params={{ missionId: mission.id }}
      className="gs-mcard"
      style={{ borderTopColor: accent }}
    >
      <div className="gs-row" style={{ gap: 8 }}>
        {urgent ? (
          <span
            className="gs-tag"
            style={{ background: '#E65100', color: '#fff' }}
          >
            Urgent
          </span>
        ) : null}
        <span
          className="gs-tag"
          style={{
            background: done ? '#f0f1f3' : full ? '#e8f0fc' : '#f0faf3',
            color: done ? '#6B7280' : full ? '#1565C0' : '#1B7A34',
          }}
        >
          {done
            ? 'Completed'
            : full
              ? 'Full'
              : `Open · ${mission.remaining} left`}
        </span>
        {remote ? (
          <span
            className="gs-tag"
            style={{ background: '#e8f0fc', color: '#1565C0' }}
          >
            Remote
          </span>
        ) : null}
        <span
          className="gs-tag gs-tag--program"
          style={{ background: bg, color }}
        >
          <span className="gs-tag__dot" style={{ background: light }} />
          {(program?.name ?? '').split(' ').slice(0, 3).join(' ')}
        </span>
      </div>

      <h2 className="gs-mcard__title">{mission.title}</h2>

      <div className="gs-mcard__meta">
        <div>📍 {mission.venue ?? 'Remote'}</div>
        <div>
          📅 {mission.dateLabel} · {mission.timeLabel}
        </div>
      </div>

      <p className="gs-mcard__summary">{mission.summary}</p>

      <div style={{ marginTop: 'auto' }}>
        <div
          className="gs-row gs-row--between"
          style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}
        >
          <span>
            {mission.filled} / {mission.need} positions filled
          </span>
          <span
            style={{
              color: done || full ? '#9CA3AF' : urgent ? '#E65100' : '#1B7A34',
            }}
          >
            {done ? 'Closed' : full ? 'Full' : `${mission.remaining} left`}
          </span>
        </div>
        <div className="gs-capbar">
          <div
            className="gs-capbar__fill"
            style={{
              width: `${mission.fillPct}%`,
              background: `linear-gradient(90deg, ${light}, ${color})`,
            }}
          />
        </div>
      </div>

      <div className="gs-mcard__foot">
        <span style={{ fontSize: 12, color: 'var(--gs-ink-40)' }}>
          {mission.hours} service hours ·{' '}
          {remote ? 'Remote' : (mission.chapter?.city ?? 'On site')}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {done ? 'View report' : 'View mission'} →
        </span>
      </div>
    </Link>
  )
}
