import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Page copy contract.
 *
 * Each rebuilt page must still carry the copy its design file defines — the lines that make the
 * product's promises, not just decoration. Extended one page at a time as pages are rebuilt from
 * their `.dc.html` source.
 */
const root = resolve(__dirname, '../../..')

const normalise = (text: string) =>
  text
    .replace(/[’‘]/g, "'")
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8230;/g, '…')
    .replace(/\s+/g, ' ')
    .trim()

interface PageContract {
  page: string
  design: string
  routes: Array<string>
  /** Copy that must survive from the design into the build. */
  copy: Array<string>
}

const CONTRACTS: Array<PageContract> = [
  {
    page: 'Missions board',
    design: 'Missions.dc.html',
    routes: ['missions/index.tsx', '../components/MissionCard.tsx'],
    copy: [
      'Live Now',
      'Do one',
      'meaningful thing',
      "You don't have to join an organisation to make a difference today",
      'Become a volunteer',
      'My missions',
      'Open missions',
      'Positions to fill',
      'Chapters active',
      'Volunteer hours open to claim',
      'Search missions, venue, role…',
      'All missions',
      'Open now',
      'Urgent',
      'Remote',
      'No missions match that',
      'Try another search or clear the filters.',
      'positions filled',
      'service hours',
      'View mission',
      'View report',
    ],
  },
]

describe.each(CONTRACTS)('$page follows $design', (contract) => {
  const design = normalise(readFileSync(resolve(root, contract.design), 'utf8'))
  const built = normalise(
    contract.routes
      .map((file) => readFileSync(resolve(__dirname, file), 'utf8'))
      .join('\n'),
  )

  it('quotes copy that really is in the design file', () => {
    for (const line of contract.copy) {
      expect(design, `"${line}" is not in ${contract.design}`).toContain(
        normalise(line),
      )
    }
  })

  it('keeps that copy in the build', () => {
    for (const line of contract.copy) {
      expect(built, `"${line}" is missing from the page`).toContain(
        normalise(line),
      )
    }
  })
})
