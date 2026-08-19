import { Link } from '@tanstack/react-router'
import type { VolunteerView } from '../data/os'
import { Avatar, Pill } from './ui'

export function VolunteerCard({ person }: { person: VolunteerView }) {
  return (
    <Link
      to="/people/$volunteerId"
      params={{ volunteerId: person.slug }}
      className="gs-card gs-card--flat gs-card--link"
    >
      <div className="gs-row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <Avatar initials={person.initials} color={person.avatarColor} />
        <div className="gs-stack" style={{ gap: 2, flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: 15.5 }}>{person.fullName}</strong>
          <span className="gs-small gs-muted">{person.roleTitle}</span>
        </div>
      </div>
      <p
        className="gs-small"
        style={{ marginTop: 14, color: 'var(--gs-ink-70)' }}
      >
        “{person.quote}”
      </p>
      <div className="gs-row" style={{ gap: 6, marginTop: 14 }}>
        <Pill tone="green">{person.level}</Pill>
        <Pill>{person.city}</Pill>
        {person.sustainingMember ? (
          <Pill tone="blue">Sustaining member ✓</Pill>
        ) : null}
      </div>
      <div className="gs-row gs-row--between" style={{ marginTop: 16 }}>
        <span className="gs-small gs-muted">
          {person.program?.shortName ?? person.programSlug}
        </span>
        <strong className="gs-small gs-num">
          {person.totalHours} verified hours
        </strong>
      </div>
    </Link>
  )
}
