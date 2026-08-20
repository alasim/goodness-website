import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { OSModel } from '../../data/os'
import { Bar, Pill } from '../ui'
import { STATE_LABEL } from '../../lib/format'
import {
  createMission,
  patchMission,
  setEvidenceVerified,
  setImpactPublished,
  verifyAssignment,
} from '../../data/actions'

export function AdminMissions({ os }: { os: OSModel }) {
  const [creating, setCreating] = useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '')
    const id = `msn-${Date.now()}`
    void createMission(
      {
        id,
        title,
        programSlug: String(
          form.get('programSlug') ?? os.programs[0]?.slug ?? '',
        ),
        projectId: null,
        chapterId: String(form.get('chapterId') ?? '') || null,
        scope: 'chapter',
        venue: String(form.get('venue') ?? ''),
        dateLabel: String(form.get('dateLabel') ?? ''),
        timeLabel: String(form.get('timeLabel') ?? ''),
        startsAt: null,
        hours: Number(form.get('hours') ?? 4),
        impactTarget: String(form.get('impactTarget') ?? ''),
        summary: String(form.get('summary') ?? ''),
        status: 'open',
        priority:
          String(form.get('priority') ?? 'normal') === 'urgent'
            ? 'urgent'
            : 'normal',
        participation:
          String(form.get('participation') ?? 'onsite') === 'remote'
            ? 'remote'
            : 'onsite',
        leadProfileId: null,
        leadName: String(form.get('leadName') ?? ''),
        seedFilled: 0,
      },
      [
        {
          role: String(form.get('role1') ?? 'Volunteer'),
          need: Number(form.get('need1') ?? 2),
          skills: [],
          sortOrder: 0,
        },
        {
          role: String(form.get('role2') ?? 'Support Volunteer'),
          need: Number(form.get('need2') ?? 2),
          skills: [],
          sortOrder: 1,
        },
      ],
    ).then(() => setCreating(false))
  }

  return (
    <div className="gs-stack" style={{ gap: 20 }}>
      <div className="gs-row gs-row--between">
        <p className="gs-eyebrow">Missions — {os.missions.length}</p>
        <button
          type="button"
          className="gs-btn gs-btn--primary gs-btn--sm"
          onClick={() => setCreating((v) => !v)}
        >
          {creating ? 'Cancel' : 'Create mission'}
        </button>
      </div>

      {creating ? (
        <form
          className="gs-card gs-card--flat gs-stack"
          style={{ gap: 12 }}
          onSubmit={submit}
        >
          <input
            name="title"
            required
            placeholder="Mission title"
            aria-label="Mission title"
          />
          <div className="gs-grid gs-grid--2">
            <select name="programSlug" aria-label="Programme">
              {os.programs
                .filter((p) => !p.isOperations)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
            </select>
            <select name="chapterId" aria-label="Chapter">
              {os.activeChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input name="venue" placeholder="Venue" aria-label="Venue" />
            <input
              name="leadName"
              placeholder="Mission lead"
              aria-label="Mission lead"
            />
            <input
              name="dateLabel"
              placeholder="Sat 12 Sep 2026"
              aria-label="Date"
            />
            <input
              name="timeLabel"
              placeholder="10:00 AM – 3:00 PM"
              aria-label="Time"
            />
            <input
              name="hours"
              type="number"
              min={1}
              defaultValue={5}
              aria-label="Hours"
            />
            <select name="priority" aria-label="Priority">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
            <select name="participation" aria-label="Participation">
              <option value="onsite">On site</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <input
            name="impactTarget"
            placeholder="What success looks like"
            aria-label="Impact target"
          />
          <textarea
            name="summary"
            rows={2}
            placeholder="Summary"
            aria-label="Summary"
          />
          <div className="gs-grid gs-grid--2">
            <input
              name="role1"
              placeholder="Role 1"
              defaultValue="Trainer"
              aria-label="Role 1"
            />
            <input
              name="need1"
              type="number"
              min={1}
              defaultValue={2}
              aria-label="Role 1 need"
            />
            <input
              name="role2"
              placeholder="Role 2"
              defaultValue="Support Volunteer"
              aria-label="Role 2"
            />
            <input
              name="need2"
              type="number"
              min={1}
              defaultValue={3}
              aria-label="Role 2 need"
            />
          </div>
          <button
            type="submit"
            className="gs-btn gs-btn--primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Publish mission
          </button>
        </form>
      ) : null}

      <div className="gs-table-wrap">
        <table className="gs-table">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Chapter</th>
              <th>Date</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {os.missions.map((mission) => (
              <tr key={mission.id}>
                <td>
                  <Link
                    to="/missions/$missionId"
                    params={{ missionId: mission.id }}
                    className="gs-small"
                    style={{ fontWeight: 700 }}
                  >
                    {mission.title}
                  </Link>
                </td>
                <td className="gs-small">
                  {mission.chapter?.city ?? 'Remote'}
                </td>
                <td className="gs-small">{mission.dateLabel}</td>
                <td style={{ minWidth: 140 }}>
                  <Bar pct={mission.fillPct} label={mission.title} />
                  <span className="gs-small gs-muted">
                    {mission.filled}/{mission.need}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                    onClick={() =>
                      void patchMission(mission.id, {
                        status:
                          mission.status === 'open' ? 'completed' : 'open',
                      })
                    }
                  >
                    {mission.status === 'open'
                      ? 'Open — mark complete'
                      : `${mission.status} — reopen`}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="gs-btn gs-btn--ghost gs-btn--sm"
                    onClick={() =>
                      void patchMission(mission.id, {
                        priority:
                          mission.priority === 'urgent' ? 'normal' : 'urgent',
                      })
                    }
                  >
                    {mission.priority}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminAttendance({ os }: { os: OSModel }) {
  const rows = os.data.assignments
    .filter((a) => a.state !== 'withdrawn')
    .map((assignment) => ({
      assignment,
      mission: os.missionById.get(assignment.missionId),
      person: os.personById.get(assignment.profileId),
    }))
    .filter((row) => row.mission && row.person)

  return (
    <div className="gs-stack" style={{ gap: 16 }}>
      <p className="gs-eyebrow">Attendance and hours</p>
      {rows.length ? (
        <div className="gs-table-wrap">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Mission</th>
                <th>State</th>
                <th className="gs-table__num">Hours</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ assignment, mission, person }) => (
                <tr key={assignment.id}>
                  <td className="gs-small">{person!.fullName}</td>
                  <td className="gs-small">{mission!.title}</td>
                  <td>
                    <Pill
                      tone={
                        assignment.state === 'verified'
                          ? 'green'
                          : assignment.state === 'submitted'
                            ? 'amber'
                            : 'neutral'
                      }
                    >
                      {STATE_LABEL[assignment.state]}
                    </Pill>
                  </td>
                  <td className="gs-table__num">
                    {assignment.hoursCredited ?? mission!.hours}
                  </td>
                  <td>
                    {assignment.state === 'verified' ? (
                      <button
                        type="button"
                        className="gs-btn gs-btn--ghost gs-btn--sm"
                        onClick={() =>
                          void verifyAssignment(assignment.id, null, false)
                        }
                      >
                        Reverse verification
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="gs-btn gs-btn--primary gs-btn--sm"
                        disabled={assignment.state === 'joined'}
                        onClick={() =>
                          void verifyAssignment(
                            assignment.id,
                            mission!.hours,
                            true,
                          )
                        }
                        title={
                          assignment.state === 'joined'
                            ? 'The volunteer has not checked in yet'
                            : undefined
                        }
                      >
                        Verify {mission!.hours} hours
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="gs-small gs-muted">
          No live participation yet. Once volunteers join missions here, their
          hours queue up for verification on this tab.
        </p>
      )}
      <p className="gs-small gs-muted">
        Verified hours post to the volunteer’s passport immediately. Reversing a
        verification keeps both entries in the audit trail.
      </p>
    </div>
  )
}

export function AdminImpact({ os }: { os: OSModel }) {
  return (
    <div className="gs-stack" style={{ gap: 16 }}>
      <p className="gs-eyebrow">
        Impact records — publication and evidence are separate decisions
      </p>
      <div className="gs-stack" style={{ gap: 14 }}>
        {os.impact.map((record) => (
          <div key={record.id} className="gs-card gs-card--flat">
            <div
              className="gs-row gs-row--between"
              style={{ gap: 14, alignItems: 'flex-start' }}
            >
              <div
                className="gs-stack"
                style={{ gap: 6, flex: 1, minWidth: 240 }}
              >
                <div className="gs-row" style={{ gap: 6 }}>
                  <Pill tone={record.published ? 'green' : 'neutral'}>
                    {record.published ? 'Published' : 'Draft'}
                  </Pill>
                  <Pill tone={record.fullyVerified ? 'blue' : 'amber'}>
                    {record.evidenceVerified}/{record.evidenceTotal} evidence
                    checked
                  </Pill>
                  <Pill>{record.program?.shortName}</Pill>
                </div>
                <strong>{record.title}</strong>
                <span className="gs-small gs-muted">
                  {record.primaryValue} {record.unitLabel} · targets met{' '}
                  {record.targetsMet}/{record.targetsTotal}
                </span>
              </div>
              <button
                type="button"
                className="gs-btn gs-btn--ghost gs-btn--sm"
                onClick={() =>
                  void setImpactPublished(record.id, !record.published)
                }
              >
                {record.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
            <div className="gs-row" style={{ gap: 6, marginTop: 14 }}>
              {record.evidence.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="gs-chip"
                  aria-pressed={item.verified}
                  onClick={() =>
                    void setEvidenceVerified(item.id, !item.verified)
                  }
                  title={
                    item.verified
                      ? 'Checked — click to undo'
                      : 'Not checked — click to confirm'
                  }
                >
                  {item.verified ? '✓ ' : '○ '}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
