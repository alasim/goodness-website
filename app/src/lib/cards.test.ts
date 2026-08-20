import { describe, expect, it } from 'vitest'
import { buildCards, CATALOGUE_SECTIONS, RECOMMENDED_ORDER } from './cards'
import { buildOS } from '../data/os'
import { baseDataset } from '../data/local'
import { formatNumber, formatShortMoney } from './format'

const os = buildOS(baseDataset())
const person = os.people[0]!
const cards = buildCards(os, { person })
const card = (id: string) => cards.find((c) => c.id === id)!

/** Everything a card can say, so a test can assert about the whole surface at once. */
const textOf = (id: string) => {
  const c = card(id)
  return [
    c.eyebrow,
    c.title,
    c.meta,
    c.line1,
    c.chip,
    c.statement,
    c.giant,
    c.giantUnit,
    c.caption,
    ...(c.stats ?? []).flatMap((s) => [s.value, s.label]),
    ...(c.rows ?? []).flatMap((r) => [r.value, r.label]),
  ]
    .filter(Boolean)
    .join(' ')
}

describe('share studio catalogue', () => {
  it('builds the whole catalogue from the live record', () => {
    expect(cards.length).toBeGreaterThan(20)
    expect(card('identity').title).toBe(person.fullName)
    expect(card('identity').stats?.[0]?.value).toBe(
      String(person.totalMissions),
    )
  })

  it('places every card in a panel the rail renders', () => {
    const known = new Set(CATALOGUE_SECTIONS.map((s) => s.key))
    for (const spec of cards) expect(known.has(spec.category)).toBe(true)
  })

  it('gives every locked card an honest reason instead of hiding it', () => {
    const locked = cards.filter((c) => !c.available)
    for (const spec of locked) {
      expect(spec.sub).toBeTruthy()
      expect(spec.sub.toLowerCase()).toContain('unlock')
    }
  })

  it('never puts a giving amount on a member card', () => {
    for (const id of ['sustaining', 'commitment-milestone']) {
      expect(textOf(id)).not.toMatch(/৳|\bBDT\b/)
    }
  })

  it('says impact is shared, never converted from one gift', () => {
    expect(card('backed-impact').statement?.toLowerCase()).toContain('shared')
    expect(card('partner-mile').statement?.toLowerCase()).toContain('shared')
  })

  it('carries a verification reference on credential-backed cards', () => {
    expect(card('credential').refLine).toMatch(/GS-/)
    expect(card('credential').verifyLine).toContain('goodness.org/verify')
  })

  it('reports a fund exactly as the ledger does', () => {
    const fund = [...os.finance.funds].sort((a, b) => b.spent - a.spent)[0]!
    expect(card('money-fund').rows?.map((r) => r.value)).toEqual([
      formatShortMoney(fund.allocated, os.currency),
      formatShortMoney(fund.spent, os.currency),
      `${fund.documentedPct}%`,
    ])
  })

  it('offers the A4 poster only where the design offers it', () => {
    for (const spec of cards.filter((c) => c.a4)) {
      expect(['recruit', 'urgent', 'fund']).toContain(spec.layout)
    }
  })

  it('recommends only cards the catalogue can actually build', () => {
    const ids = new Set(cards.map((c) => c.id))
    for (const id of RECOMMENDED_ORDER) expect(ids.has(id)).toBe(true)
  })

  it('counts a chapter milestone from the chapter, not from a guess', () => {
    const chapter = os.chapterById.get(person.chapterId ?? '')
    if (!chapter || chapter.status !== 'active') return
    const spec = card('chap-member')
    expect(spec.stats?.[0]?.value).toBe(String(chapter.memberCount))
    expect(spec.stats?.[2]?.value).toBe(formatNumber(chapter.peopleSupported))
  })
})

describe('money formatting', () => {
  it('uses South Asian short forms', () => {
    expect(formatShortMoney(250_000, '৳')).toBe('৳2.5L')
    expect(formatShortMoney(12_500_000, '৳')).toBe('৳1.25Cr')
    expect(formatShortMoney(9_500, '৳')).toBe('৳9.5K')
  })
})
