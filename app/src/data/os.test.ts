import { describe, expect, it } from 'vitest'
import { buildOS, monthsSince, rhythmPer30 } from './os'
import { baseDataset } from './local'
import type { Assignment } from '../lib/types'

const os = buildOS(baseDataset())
const first = os.people[0]!

describe('money chain', () => {
  it('keeps received, allocated, budgeted and spent as four separate figures', () => {
    const { finance } = os
    expect(finance.received).toBe(6_790_000)
    expect(finance.allocated).toBeLessThanOrEqual(finance.received)
    expect(finance.spent).toBeLessThanOrEqual(finance.allocated)
    expect(finance.budgeted).toBeGreaterThanOrEqual(finance.allocated)
  })

  it('splits programme spend from overhead without losing a taka', () => {
    const { finance } = os
    expect(finance.programSpend + finance.overheadSpend).toBe(finance.spent)
    expect(
      finance.programSharePct + finance.overheadPct,
    ).toBeGreaterThanOrEqual(99)
  })

  it('counts a funding gap only where budget exceeds allocation', () => {
    const innovation = os.finance.funds.find(
      (f) => f.programSlug === 'innovation-social-good',
    )
    expect(innovation?.fundingGap).toBe(240_000)
    const education = os.finance.funds.find(
      (f) => f.programSlug === 'education-career-readiness',
    )
    expect(education?.fundingGap).toBe(0)
  })

  it('reports documentation as checked, not merely attached', () => {
    const fund = os.finance.funds.find((f) => f.documents > f.documentsChecked)
    expect(fund).toBeTruthy()
    expect(fund!.documentedPct).toBeLessThan(100)
  })
})

describe('mission capacity', () => {
  it('derives need and remaining from roles, never from a stored count', () => {
    const mission = os.missionById.get('msn-dhaka-digital-01')!
    expect(mission.need).toBe(6)
    expect(mission.filled).toBe(5)
    expect(mission.remaining).toBe(1)
    expect(mission.isFull).toBe(false)
  })

  it('counts a live claim towards capacity and never past it', () => {
    const claim: Assignment = {
      id: 'asg-test',
      missionId: 'msn-dhaka-digital-01',
      missionRoleId: 'msn-dhaka-digital-01-role-1',
      profileId: first.id,
      state: 'joined',
      joinedAt: new Date().toISOString(),
      checkedInAt: null,
      submittedAt: null,
      verifiedAt: null,
      verifiedBy: null,
      hoursCredited: null,
      note: null,
    }
    const withClaim = buildOS({ ...baseDataset(), assignments: [claim] })
    const mission = withClaim.missionById.get('msn-dhaka-digital-01')!
    expect(mission.filled).toBe(6)
    expect(mission.isFull).toBe(true)
    expect(mission.roles[0]!.filled).toBe(1)
  })

  it('withdrawing frees the place again', () => {
    const withdrawn: Assignment = {
      id: 'asg-test',
      missionId: 'msn-dhaka-digital-01',
      missionRoleId: 'msn-dhaka-digital-01-role-1',
      profileId: first.id,
      state: 'withdrawn',
      joinedAt: new Date().toISOString(),
      checkedInAt: null,
      submittedAt: null,
      verifiedAt: null,
      verifiedBy: null,
      hoursCredited: null,
      note: null,
    }
    const after = buildOS({ ...baseDataset(), assignments: [withdrawn] })
    expect(after.missionById.get('msn-dhaka-digital-01')!.filled).toBe(5)
  })
})

describe('hours and passports', () => {
  it('adds verified hours on top of migrated history, never replacing it', () => {
    const person = first
    const verified: Assignment = {
      id: 'asg-hours',
      missionId: 'msn-dhaka-digital-01',
      missionRoleId: 'msn-dhaka-digital-01-role-1',
      profileId: person.id,
      state: 'verified',
      joinedAt: new Date().toISOString(),
      checkedInAt: null,
      submittedAt: null,
      verifiedAt: new Date().toISOString(),
      verifiedBy: null,
      hoursCredited: null,
      note: null,
    }
    const after = buildOS({ ...baseDataset(), assignments: [verified] })
    const updated = after.personById.get(person.id)!
    expect(updated.totalHours).toBe(person.totalHours + 5)
    expect(updated.totalMissions).toBe(person.totalMissions + 1)
    expect(updated.verifiedMissions).toBe(1)
  })
})

describe('impact discipline', () => {
  it('treats publication and verification as separate axes', () => {
    expect(os.impact.length).toBeGreaterThan(os.publishedImpact.length)
    const partlyVerified = os.publishedImpact.find((r) => !r.fullyVerified)
    expect(partlyVerified).toBeTruthy()
    expect(partlyVerified!.published).toBe(true)
    expect(partlyVerified!.evidencePct).toBeLessThan(100)
  })

  it('counts people supported from published records only', () => {
    const fromPublished = os.publishedImpact.reduce(
      (n, r) => n + r.beneficiaries,
      0,
    )
    expect(os.stats.peopleSupported).toBe(fromPublished)
  })

  it('shows missed targets as a percentage rather than hiding them', () => {
    const missed = os.publishedImpact.find((r) => r.targetsMet < r.targetsTotal)
    expect(missed).toBeTruthy()
  })
})

describe('network rollups', () => {
  it('computes chapter figures from the graph rather than storing them', () => {
    const dhaka = os.chapterById.get('chp-dhaka')!
    expect(dhaka.memberCount).toBeGreaterThan(0)
    expect(dhaka.hours).toBe(
      dhaka.members.reduce((n, m) => n + m.totalHours, 0),
    )
    expect(dhaka.goals.every((g) => g.pct <= 100)).toBe(true)
  })

  it('keeps university chapters campus-scoped rather than absorbing the city', () => {
    const university = os.chapterById.get('chp-du')!
    expect(university.parent?.id).toBe('chp-dhaka')
    expect(university.missions.length).toBe(0)
  })
})

describe('helpers', () => {
  it('normalises sustaining rhythm to a 30-day window like the database does', () => {
    expect(rhythmPer30('Daily')).toBe(30)
    expect(rhythmPer30('Weekly')).toBe(4.3)
    expect(rhythmPer30('Monthly')).toBe(1)
  })

  it('reads partnership tenure from a month label', () => {
    expect(monthsSince('Jun 2026', new Date('2026-12-15'))).toBe(6)
    expect(monthsSince(null)).toBe(0)
  })
})
