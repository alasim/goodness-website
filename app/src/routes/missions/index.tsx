import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { MissionCard } from '../../components/MissionCard'
import { LoadingState } from '../../components/LoadingState'
import { PageHero } from '../../components/PageHero'
import { Empty, Section, Stat } from '../../components/ui'
import { formatNumber } from '../../lib/format'

export const Route = createFileRoute('/missions/')({
  head: () => ({
    meta: [
      { title: 'Missions — Goodness Society' },
      {
        name: 'description',
        content:
          'Real opportunities with real roles: see what is needed, where, and how many places are left.',
      },
    ],
  }),
  component: Missions,
})

function Missions() {
  const { os } = useOS()
  const [query, setQuery] = useState('')
  const [chapter, setChapter] = useState('all')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [openOnly, setOpenOnly] = useState(true)

  const missions = useMemo(() => {
    if (!os) return []
    const needle = query.trim().toLowerCase()
    return os.missions
      .filter((mission) => {
        if (openOnly && mission.status !== 'open') return false
        if (urgentOnly && mission.priority !== 'urgent') return false
        if (chapter !== 'all' && mission.chapterId !== chapter) return false
        if (!needle) return true
        return (
          mission.title.toLowerCase().includes(needle) ||
          (mission.venue ?? '').toLowerCase().includes(needle) ||
          (mission.summary ?? '').toLowerCase().includes(needle) ||
          mission.roles.some((role) => role.role.toLowerCase().includes(needle))
        )
      })
      .sort(
        (a, b) =>
          Number(b.priority === 'urgent') - Number(a.priority === 'urgent'),
      )
  }, [os, query, chapter, urgentOnly, openOnly])

  if (!os) return <LoadingState />

  return (
    <>
      <PageHero
        eyebrow="Goodness Missions"
        title="One meaningful Saturday"
        lede="Every mission names the work, the place, the hours and the exact roles still open. Join one, and the hours land on your passport once a team lead verifies them."
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(os.stats.liveMissions)}
            label="Missions open now"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.openPositions)}
            label="Places still to fill"
          />
          <Stat
            gradient
            value={formatNumber(
              os.missions.filter(
                (m) => m.priority === 'urgent' && m.status === 'open',
              ).length,
            )}
            label="Marked urgent"
          />
          <Stat
            gradient
            value={formatNumber(
              new Set(os.missions.map((m) => m.chapterId)).size,
            )}
            label="Chapters running missions"
          />
        </div>
      </Section>

      <Section>
        <div className="gs-stack" style={{ gap: 14, marginBottom: 24 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search missions, venues or roles"
            aria-label="Search missions"
            style={{ maxWidth: 420 }}
          />
          <div className="gs-row" style={{ gap: 8 }}>
            <button
              type="button"
              className="gs-chip"
              aria-pressed={chapter === 'all'}
              onClick={() => setChapter('all')}
            >
              All chapters
            </button>
            {os.activeChapters.map((c) => (
              <button
                key={c.id}
                type="button"
                className="gs-chip"
                aria-pressed={chapter === c.id}
                onClick={() => setChapter(c.id)}
              >
                {c.city}
              </button>
            ))}
          </div>
          <div className="gs-row" style={{ gap: 8 }}>
            <button
              type="button"
              className="gs-chip"
              aria-pressed={urgentOnly}
              onClick={() => setUrgentOnly((v) => !v)}
            >
              Urgent only
            </button>
            <button
              type="button"
              className="gs-chip"
              aria-pressed={openOnly}
              onClick={() => setOpenOnly((v) => !v)}
            >
              Open only
            </button>
          </div>
        </div>

        {missions.length ? (
          <div className="gs-grid gs-grid--3">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        ) : (
          <Empty>
            No mission matches those filters right now. Try clearing “urgent
            only”.
          </Empty>
        )}
      </Section>
    </>
  )
}
