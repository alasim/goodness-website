import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { MissionCard } from '../../components/MissionCard'
import { LoadingState } from '../../components/LoadingState'
import { GWatermark } from '../../components/GWatermark'
import { Display } from '../../components/ui'
import { formatNumber } from '../../lib/format'

/** Missions board — a faithful build of `Missions.dc.html`. */
export const Route = createFileRoute('/missions/')({
  head: () => ({
    meta: [
      { title: 'Missions — Goodness Society' },
      {
        name: 'description',
        content:
          'You don’t have to join an organisation to make a difference today. Pick a mission, claim a role, show up.',
      },
    ],
  }),
  component: Missions,
})

function Missions() {
  const { os } = useOS()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const missionChapters = useMemo(
    () =>
      os
        ? [
            ...new Set(
              os.missions
                .filter((m) => m.participation !== 'remote')
                .map((m) => m.chapter?.city),
            ),
          ].filter((city): city is string => !!city)
        : [],
    [os],
  )

  const list = useMemo(() => {
    if (!os) return []
    const needle = query.trim().toLowerCase()
    return os.missions.filter((mission) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'open'
            ? mission.status === 'open'
            : filter === 'urgent'
              ? mission.priority === 'urgent'
              : filter === 'remote'
                ? mission.participation === 'remote'
                : mission.chapter?.city === filter.slice(3)
      const matchesSearch =
        !needle ||
        mission.title.toLowerCase().includes(needle) ||
        (mission.venue ?? '').toLowerCase().includes(needle) ||
        (mission.program?.name ?? '').toLowerCase().includes(needle) ||
        mission.roles.some((role) => role.role.toLowerCase().includes(needle))
      return matchesFilter && matchesSearch
    })
  }, [os, query, filter])

  if (!os) return <LoadingState />

  const open = os.openMissions
  const filters = [
    { label: 'All missions', key: 'all' },
    { label: 'Open now', key: 'open' },
    { label: 'Urgent', key: 'urgent' },
    { label: 'Remote', key: 'remote' },
    ...missionChapters.map((city) => ({ label: city, key: `ch:${city}` })),
  ]

  return (
    <>
      <section className="gs-pagehero">
        <GWatermark />
        <div className="gs-wrap" style={{ position: 'relative' }}>
          <span className="gs-livepill" style={{ marginBottom: 28 }}>
            Live Now
          </span>
          <div className="gs-herogrid">
            <Display
              as="h1"
              variant="page"
              stacked
              boldColor="#1B7A34"
              light="Do one"
              bold="meaningful thing"
            />
            <div>
              <p
                style={{
                  margin: '0 0 20px',
                  fontSize: 18,
                  color: 'var(--gs-ink-50)',
                  lineHeight: 1.65,
                }}
              >
                You don’t have to join an organisation to make a difference
                today. Pick a mission, claim a role, show up. Your verified
                hours build from there.
              </p>
              <div className="gs-row" style={{ gap: 12 }}>
                <Link to="/join" className="gs-btn gs-btn--primary">
                  Become a volunteer
                </Link>
                <Link
                  to="/me"
                  className="gs-btn"
                  style={{
                    background: 'rgba(0,0,0,0.05)',
                    color: 'var(--gs-ink)',
                    fontWeight: 700,
                  }}
                >
                  My missions
                </Link>
              </div>
            </div>
          </div>

          <div className="gs-statbar" style={{ marginTop: 40 }}>
            <div>
              <div className="gs-statbar__value gs-num">{open.length}</div>
              <div className="gs-statbar__label">Open missions</div>
            </div>
            <div>
              <div className="gs-statbar__value gs-num">
                {os.stats.openPositions}
              </div>
              <div className="gs-statbar__label">Positions to fill</div>
            </div>
            <div>
              <div className="gs-statbar__value gs-num">
                {new Set(open.map((m) => m.chapter?.city)).size}
              </div>
              <div className="gs-statbar__label">Chapters active</div>
            </div>
            <div>
              <div className="gs-statbar__value gs-num">
                {formatNumber(
                  open.reduce((n, m) => n + m.hours * m.remaining, 0),
                )}
              </div>
              <div className="gs-statbar__label">
                Volunteer hours open to claim
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gs-board">
        <div className="gs-wrap">
          <div className="gs-row" style={{ gap: 16, marginBottom: 24 }}>
            <input
              type="search"
              className="gs-searchpill"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search missions, venue, role…"
              aria-label="Search missions"
            />
            <div className="gs-row" style={{ gap: 6 }}>
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="gs-filter"
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="gs-resultcount" style={{ marginBottom: 20 }}>
            {list.length} mission{list.length !== 1 ? 's' : ''}
            {query ? ` matching “${query}”` : ''}
          </p>

          {list.length ? (
            <div className="gs-cards">
              {list.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '72px 0',
              }}
            >
              <p style={{ margin: '0 0 4px', fontWeight: 700 }}>
                No missions match that
              </p>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--gs-ink-50)' }}>
                Try another search or clear the filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
