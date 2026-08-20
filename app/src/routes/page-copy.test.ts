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

/**
 * The design files carry the same words in three encodings: literal characters in markup, numeric
 * HTML entities, and JavaScript `\uXXXX` escapes inside the logic blocks. Normalise all three so a
 * comparison is about words, not encoding.
 */
const normalise = (text: string) =>
  text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/[’‘]/g, "'")
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
  {
    page: 'Mission detail',
    design: 'Mission Detail.dc.html',
    routes: ['missions/$missionId.tsx'],
    copy: [
      'All missions',
      'Share this mission',
      'Chapter',
      'When',
      'Where',
      'Service hours',
      'Added on verification',
      'Mission lead',
      'Roles needed',
      'filled',
      'positions',
      'Helpful skills:',
      'Open to everyone — no specific skills needed',
      'Claim role',
      'Change to this',
      'Your role',
      'Impact report',
      'people supported · published record',
      'Delivered',
      'What changed',
      'See the full impact record',
      'Impact target',
      'Team joined',
      'No one from the platform has claimed a role yet. Be the first.',
      'Your place on this mission',
      'Sign in to My Goodness to claim a role.',
      'Sign in to join',
      'Pick a role on the left to join this mission.',
      "You're on this mission",
      'Check-in code',
      'Show this to your mission lead on the day, or tap below.',
      'Remote contribution',
      "No check-in needed. Start when you're ready, then submit your completion for verification.",
      'Start contribution',
      'Check in now',
      'Submit completion',
      'Your contribution has been submitted for verification.',
      'Hours verified',
      'Leave mission',
      'Leave this mission?',
      'Your position becomes available to another volunteer straight away.',
      'Yes, leave',
      'Keep my place',
      'How it works',
      'Contribution submitted',
      'Your team lead confirms — hours post to your passport.',
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
