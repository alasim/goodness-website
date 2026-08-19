import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { OSModel } from '../../data/os'
import type { JourneyLevel } from '../../lib/types'
import { Pill } from '../ui'
import { decideApplication, patchProfile } from '../../data/actions'

const LEVELS: Array<JourneyLevel> = [
  'Volunteer',
  'Senior Volunteer',
  'Team Lead',
  'Chapter Lead',
]

export function AdminPeople({ os }: { os: OSModel }) {
  const [query, setQuery] = useState('')
  const people = os.people.filter(
    (p) =>
      !query ||
      p.fullName.toLowerCase().includes(query.toLowerCase()) ||
      (p.city ?? '').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="gs-stack" style={{ gap: 18 }}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search volunteers"
        aria-label="Search volunteers"
        style={{ maxWidth: 360 }}
      />
      <div className="gs-table-wrap">
        <table className="gs-table">
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Chapter</th>
              <th className="gs-table__num">Hours</th>
              <th>Journey</th>
              <th>Certificate</th>
              <th>Passport</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>
                  <div className="gs-stack" style={{ gap: 2 }}>
                    <strong className="gs-small">{person.fullName}</strong>
                    <span className="gs-small gs-muted">
                      {person.roleTitle} · {person.city}
                    </span>
                  </div>
                </td>
                <td className="gs-small">{person.chapter?.name ?? '—'}</td>
                <td className="gs-table__num">{person.totalHours}</td>
                <td>
                  <select
                    value={person.level}
                    aria-label={`Journey level for ${person.fullName}`}
                    onChange={(e) =>
                      void patchProfile(
                        person.id,
                        { level: e.target.value as JourneyLevel },
                        'Journey level changed by an administrator',
                      )
                    }
                    style={{ padding: '6px 8px', fontSize: 12.5 }}
                  >
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                    onClick={() =>
                      void patchProfile(
                        person.id,
                        { certificateEnabled: !person.certificateEnabled },
                        'Certificate download permission changed',
                      )
                    }
                  >
                    {person.certificateEnabled
                      ? 'Enabled — turn off'
                      : 'Disabled — turn on'}
                  </button>
                </td>
                <td>
                  <Link
                    to="/people/$volunteerId"
                    params={{ volunteerId: person.slug }}
                    className="gs-small"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="gs-small gs-muted">
        Every change here writes an audit entry with the old value, the new
        value and who made it.
      </p>
    </div>
  )
}

export function AdminApplications({ os }: { os: OSModel }) {
  const applications = os.data.applications
  const pending = applications.filter((a) => a.status === 'pending')
  const decided = applications.filter((a) => a.status !== 'pending')

  return (
    <div className="gs-stack" style={{ gap: 22 }}>
      <div>
        <p className="gs-eyebrow">Awaiting review — {pending.length}</p>
        {pending.length ? (
          <div className="gs-stack" style={{ gap: 14, marginTop: 12 }}>
            {pending.map((application) => (
              <div key={application.id} className="gs-card gs-card--flat">
                <div
                  className="gs-row gs-row--between"
                  style={{ gap: 14, alignItems: 'flex-start' }}
                >
                  <div
                    className="gs-stack"
                    style={{ gap: 6, flex: 1, minWidth: 240 }}
                  >
                    <strong>{application.fullName}</strong>
                    <span className="gs-small gs-muted">
                      {application.city} ·{' '}
                      {application.roleTitle ?? 'Role open'} ·{' '}
                      {os.programBySlug.get(application.programSlug ?? '')
                        ?.shortName ?? 'Any programme'}
                    </span>
                    {application.why ? (
                      <p className="gs-small">“{application.why}”</p>
                    ) : null}
                    {application.skills ? (
                      <span className="gs-small gs-muted">
                        Skills: {application.skills}
                      </span>
                    ) : null}
                  </div>
                  <div className="gs-row" style={{ gap: 8 }}>
                    <button
                      type="button"
                      className="gs-btn gs-btn--primary gs-btn--sm"
                      onClick={() =>
                        void decideApplication(application.id, 'approved')
                      }
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="gs-btn gs-btn--ghost gs-btn--sm"
                      onClick={() =>
                        void decideApplication(
                          application.id,
                          'rejected',
                          'Not a fit right now',
                        )
                      }
                    >
                      Not now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="gs-small gs-muted" style={{ marginTop: 10 }}>
            Nothing waiting. New applications from the join form land here.
          </p>
        )}
      </div>

      {decided.length ? (
        <div>
          <p className="gs-eyebrow">Decided</p>
          <div className="gs-stack" style={{ gap: 8, marginTop: 12 }}>
            {decided.map((application) => (
              <div key={application.id} className="gs-row gs-row--between">
                <span className="gs-small">{application.fullName}</span>
                <Pill
                  tone={application.status === 'approved' ? 'green' : 'neutral'}
                >
                  {application.status}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
