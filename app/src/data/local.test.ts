import { describe, expect, it } from 'vitest'
import { applyOverlay, baseDataset, emptyOverlay } from './local'
import { buildOS } from './os'

describe('local overlay', () => {
  it('leaves the seeded record untouched when nothing has been changed', () => {
    const base = baseDataset()
    const merged = applyOverlay(base, emptyOverlay())
    expect(merged.profiles.length).toBe(base.profiles.length)
    expect(merged.donations.length).toBe(base.donations.length)
    expect(merged.assignments.length).toBe(0)
  })

  it('applies profile patches without mutating the seed', () => {
    const base = baseDataset()
    const target = base.profiles[0]!
    const overlay = emptyOverlay()
    overlay.profilePatches[target.id] = { certificateEnabled: !target.certificateEnabled }
    const merged = applyOverlay(base, overlay)
    expect(merged.profiles[0]!.certificateEnabled).toBe(!target.certificateEnabled)
    expect(baseDataset().profiles[0]!.certificateEnabled).toBe(target.certificateEnabled)
  })

  it('puts a locally recorded donation into the ledger totals', () => {
    const base = baseDataset()
    const overlay = emptyOverlay()
    overlay.donations.push({
      id: 'don-test', donorName: 'Test donor', donorProfileId: null, partnerId: null,
      kind: 'Individual', amount: 10_000, currency: 'BDT', dateLabel: '01 Sep 2026',
      method: 'bKash', restrictedProgramSlug: null, restrictedChapterId: null,
      receiptRef: 'GS-RCP-TEST', acknowledged: false,
    })
    const before = buildOS(base).finance.received
    const after = buildOS(applyOverlay(base, overlay)).finance.received
    expect(after - before).toBe(10_000)
  })

  it('moves a member to the chapter they chose', () => {
    const base = baseDataset()
    const person = base.profiles.find((p) => p.chapterId !== 'chp-chattogram')!
    const overlay = emptyOverlay()
    overlay.memberChapter[person.id] = 'chp-chattogram'
    const merged = applyOverlay(base, overlay)
    expect(merged.profiles.find((p) => p.id === person.id)?.chapterId).toBe('chp-chattogram')
  })
})
