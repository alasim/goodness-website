import { describe, expect, it } from 'vitest'
import { buildCards } from './cards'
import { buildOS } from '../data/os'
import { baseDataset } from '../data/local'
import { formatShortMoney } from './format'

const os = buildOS(baseDataset())
const person = os.people[0]!
const catalogue = buildCards(os, { person })
const cards = catalogue.flatMap((section) => section.cards)
const card = (id: string) => cards.find((c) => c.id === id)!

describe('share studio catalogue', () => {
  it('builds every card from the live record', () => {
    expect(cards.length).toBeGreaterThan(10)
    expect(card('identity').headline).toBe(person.fullName)
    expect(card('identity').stats?.[0]?.value).toBe(String(person.totalHours))
  })

  it('locks cards that have not been earned, with a reason', () => {
    const locked = cards.filter((c) => c.lockedReason)
    for (const item of locked) {
      expect(item.lockedReason).toBeTruthy()
      expect(item.verified).toBeFalsy()
    }
  })

  it('never renders a giving amount on a sustaining card', () => {
    const sustaining = card('sustaining')
    const text = [sustaining.headline, sustaining.subline, sustaining.caption, sustaining.footnote].join(' ')
    expect(text).not.toMatch(/৳|\bBDT\b/)
  })

  it('keeps pooled-funding language on funding cards', () => {
    const funding = cards.find((c) => c.id.startsWith('fund-'))
    expect(funding).toBeTruthy()
    expect(funding!.caption.toLowerCase()).toContain('pool')
  })

  it('carries a verification reference on credential-backed cards', () => {
    expect(card('credential').verifyRef).toMatch(/^GS-/)
  })

  it('reports the money chain exactly as the ledger does', () => {
    const money = card('money')
    expect(money.stats?.map((s) => s.value)).toEqual([
      formatShortMoney(os.finance.received, os.currency),
      formatShortMoney(os.finance.allocated, os.currency),
      formatShortMoney(os.finance.spent, os.currency),
    ])
  })
})

describe('money formatting', () => {
  it('uses South Asian short forms', () => {
    expect(formatShortMoney(250_000, '৳')).toBe('৳2.5L')
    expect(formatShortMoney(12_500_000, '৳')).toBe('৳1.25Cr')
    expect(formatShortMoney(9_500, '৳')).toBe('৳9.5K')
  })
})
