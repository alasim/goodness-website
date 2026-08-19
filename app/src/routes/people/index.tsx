import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useOS } from '../../hooks/useOS'
import { VolunteerCard } from '../../components/VolunteerCard'
import { LoadingState } from '../../components/LoadingState'
import { PageHero } from '../../components/PageHero'
import { Empty, Section, Stat } from '../../components/ui'
import { formatNumber } from '../../lib/format'

export const Route = createFileRoute('/people/')({
  head: () => ({
    meta: [
      { title: 'People — Goodness Society' },
      {
        name: 'description',
        content:
          'The volunteers behind the work: verified hours, programmes and credentials.',
      },
    ],
  }),
  component: People,
})

function People() {
  const { os } = useOS()
  const [query, setQuery] = useState('')
  const [program, setProgram] = useState('all')

  const people = useMemo(() => {
    if (!os) return []
    const needle = query.trim().toLowerCase()
    return os.people.filter((person) => {
      const matchesProgram = program === 'all' || person.programSlug === program
      const matchesQuery =
        !needle ||
        person.fullName.toLowerCase().includes(needle) ||
        (person.city ?? '').toLowerCase().includes(needle) ||
        (person.roleTitle ?? '').toLowerCase().includes(needle) ||
        person.skills.some((s) => s.toLowerCase().includes(needle))
      return matchesProgram && matchesQuery
    })
  }, [os, query, program])

  if (!os) return <LoadingState />

  return (
    <>
      <PageHero
        eyebrow="Goodness Passports"
        title="The people doing the work"
        lede="Every volunteer here carries a verified record: hours confirmed by a team lead, credentials that anyone can check, and the programmes they actually work in."
      />

      <Section tight variant="mist">
        <div className="gs-grid gs-grid--4">
          <Stat
            gradient
            value={formatNumber(os.stats.volunteers)}
            label="Active volunteers"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.verifiedHours)}
            label="Verified service hours"
          />
          <Stat
            gradient
            value={formatNumber(os.data.credentials.length)}
            label="Credentials issued"
          />
          <Stat
            gradient
            value={formatNumber(os.stats.activeChapters)}
            label="Chapters they belong to"
          />
        </div>
      </Section>

      <Section>
        <div className="gs-stack" style={{ gap: 16, marginBottom: 26 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, role or skill"
            aria-label="Search volunteers"
            style={{ maxWidth: 420 }}
          />
          <div className="gs-row" style={{ gap: 8 }}>
            <button
              type="button"
              className="gs-chip"
              aria-pressed={program === 'all'}
              onClick={() => setProgram('all')}
            >
              All programmes
            </button>
            {os.programs
              .filter((p) => !p.isOperations)
              .map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  className="gs-chip"
                  aria-pressed={program === p.slug}
                  onClick={() => setProgram(p.slug)}
                >
                  {p.shortName ?? p.name}
                </button>
              ))}
          </div>
        </div>

        {people.length ? (
          <div className="gs-grid gs-grid--3">
            {people.map((person) => (
              <VolunteerCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <Empty>No volunteer matches that search yet.</Empty>
        )}
      </Section>
    </>
  )
}
