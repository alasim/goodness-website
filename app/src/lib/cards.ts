/**
 * GOODNESS OS — card catalogue.
 *
 * Every card is generated from the live model. Numbers are locked: nothing on a card can be typed
 * by the person sharing it, so a card is always a claim the platform can stand behind. Cards that
 * are not earned yet are shown locked, with an honest reason.
 */
import type { OSModel, VolunteerView } from '../data/os'
import { rhythmPer30 } from '../data/os'
import { formatNumber, formatShortMoney } from './format'
import type { CardSpec } from './card-canvas'

const HOUR_MILESTONES = [10, 25, 50, 100, 250, 500, 1000]
const MISSION_MILESTONES = [5, 10, 25, 50]

const crossed = (value: number, ladder: Array<number>) =>
  ladder.filter((step) => value >= step).slice(-1)[0] ?? null

export interface CardCatalogue {
  section: string
  cards: Array<CardSpec>
}

export function buildCards(
  os: OSModel,
  options: {
    person?: VolunteerView | null
    partnerId?: string | null
    chapterId?: string | null
  } = {},
): Array<CardCatalogue> {
  const person = options.person ?? null
  const chapter = options.chapterId
    ? os.chapterById.get(options.chapterId)
    : person?.chapterId
      ? os.chapterById.get(person.chapterId)
      : os.activeChapters[0]
  const partner = options.partnerId
    ? os.partnerById.get(options.partnerId)
    : os.activePartners[0]
  const currency = os.currency

  // ── My journey ────────────────────────────────────────────────────────────
  const journey: Array<CardSpec> = []
  if (person) {
    journey.push({
      id: 'identity',
      section: 'My journey',
      name: 'Volunteer identity',
      eyebrow: 'Goodness Passport',
      headline: person.fullName,
      subline: `${person.roleTitle ?? 'Volunteer'} · ${person.program?.name ?? ''}`,
      stats: [
        { value: formatNumber(person.totalHours), label: 'Verified hours' },
        { value: formatNumber(person.totalMissions), label: 'Missions' },
        { value: person.level, label: 'Journey stage' },
      ],
      theme: 'gradient',
      formats: ['square', 'story'],
      verified: true,
      verifyRef: person.credentials[0]?.ref,
      caption: `Volunteering with Goodness Society — ${formatNumber(person.totalHours)} verified hours across ${person.totalMissions} missions. Every hour on this card was confirmed by a team lead.`,
      footnote: person.goodnessId ?? undefined,
    })

    const hourMilestone = crossed(person.totalHours, HOUR_MILESTONES)
    journey.push({
      id: 'hours',
      section: 'My journey',
      name: 'Service-hour milestone',
      eyebrow: 'Service milestone',
      headline: `${hourMilestone ?? HOUR_MILESTONES[0]} verified hours`,
      subline: hourMilestone
        ? `${person.fullName} · ${person.chapter?.name ?? ''}`
        : undefined,
      stat: {
        value: formatNumber(hourMilestone ?? 0),
        label: 'hours of verified service',
      },
      theme: 'ink',
      formats: ['square', 'story'],
      verified: Boolean(hourMilestone),
      verifyRef: person.credentials[0]?.ref,
      caption: `${hourMilestone ?? 0} hours of verified service with Goodness Society. Hours count only once a team lead confirms them.`,
      lockedReason: hourMilestone
        ? undefined
        : `Unlocks at ${HOUR_MILESTONES[0]} verified hours — you have ${person.totalHours}.`,
    })

    const missionMilestone = crossed(person.totalMissions, MISSION_MILESTONES)
    journey.push({
      id: 'missions',
      section: 'My journey',
      name: 'Mission milestone',
      eyebrow: 'Mission milestone',
      headline: `${missionMilestone ?? MISSION_MILESTONES[0]} missions completed`,
      stat: {
        value: formatNumber(missionMilestone ?? 0),
        label: 'missions completed',
      },
      theme: 'forest',
      formats: ['square', 'story'],
      verified: Boolean(missionMilestone),
      caption: `${missionMilestone ?? 0} missions completed with Goodness Society. Real work, on the record.`,
      lockedReason: missionMilestone
        ? undefined
        : `Unlocks at ${MISSION_MILESTONES[0]} completed missions.`,
    })

    const credential = person.credentials[0]
    journey.push({
      id: 'credential',
      section: 'My journey',
      name: 'Credential earned',
      eyebrow: 'Credential',
      headline: credential?.title ?? 'Certificate of Volunteer Service',
      subline: credential
        ? `Issued to ${person.fullName} · ${credential.issuedLabel}`
        : undefined,
      bullets: credential?.serviceSummary
        ? [credential.serviceSummary]
        : undefined,
      theme: 'light',
      formats: ['square', 'poster'],
      verified: Boolean(credential),
      verifyRef: credential?.ref,
      caption: `Credential earned with Goodness Society. Anyone can check it at goodness.org/verify using ${credential?.ref ?? 'the reference on the certificate'}.`,
      lockedReason: credential
        ? undefined
        : 'Unlocks when your first credential is issued.',
    })

    journey.push({
      id: 'year',
      section: 'My journey',
      name: 'My year in Goodness',
      eyebrow: 'Year in Goodness',
      headline: String(new Date().getFullYear()),
      subline: person.fullName,
      stats: [
        { value: formatNumber(person.totalHours), label: 'Verified hours' },
        { value: formatNumber(person.totalMissions), label: 'Missions' },
        {
          value: formatNumber(person.peopleSupported),
          label: 'People supported',
        },
      ],
      theme: 'gradient',
      formats: ['square', 'story'],
      verified: true,
      caption:
        'My year in Goodness — everything on this card comes from my verified record.',
    })
  }

  // ── Giving ────────────────────────────────────────────────────────────────
  const giving: Array<CardSpec> = []
  const commitment = person
    ? os.data.commitments.find((c) => c.profileId === person.id)
    : undefined
  const contributions = commitment
    ? os.data.commitmentContributions.filter(
        (c) => c.commitmentId === commitment.id,
      ).length
    : 0
  giving.push({
    id: 'sustaining',
    section: 'Giving',
    name: 'Sustaining member',
    eyebrow: 'Sustaining member',
    headline: 'I sustain this movement',
    subline:
      'Members sustain. Partners accelerate. Volunteers bring it to life.',
    footnote: `${formatNumber(os.stats.sustainingMembers)} members sustaining`,
    theme: 'ink',
    formats: ['square', 'story'],
    verified: Boolean(commitment),
    caption:
      'I make a regular contribution to Goodness Society. Small commitments. One strong movement.',
    lockedReason: commitment
      ? undefined
      : 'Unlocks when you start a Goodness Commitment.',
  })
  giving.push({
    id: 'commitmile',
    section: 'Giving',
    name: 'Commitment milestone',
    eyebrow: 'Commitment milestone',
    headline: `${contributions} contributions and counting`,
    stat: { value: String(contributions), label: 'contributions made' },
    theme: 'royal',
    formats: ['square'],
    verified: contributions > 0,
    caption:
      'Every contribution enters the public Trust Ledger with its own receipt.',
    lockedReason:
      contributions > 0 ? undefined : 'Unlocks after your first contribution.',
  })

  // ── Chapter and network ───────────────────────────────────────────────────
  const network: Array<CardSpec> = []
  if (chapter) {
    network.push({
      id: 'chapter',
      section: 'My chapter',
      name: 'Chapter member',
      eyebrow: 'My chapter',
      headline: chapter.name,
      stats: [
        { value: String(chapter.memberCount), label: 'Members' },
        { value: String(chapter.missions.length), label: 'Missions' },
        {
          value: formatNumber(chapter.peopleSupported),
          label: 'People supported',
        },
      ],
      theme: 'gradient',
      formats: ['square', 'story'],
      verified: true,
      caption: `${chapter.name} — ${chapter.memberCount} members, ${formatNumber(chapter.peopleSupported)} people supported through published records.`,
    })
    const chapterMilestone = crossed(
      chapter.peopleSupported,
      [50, 100, 250, 500, 1000, 2500],
    )
    network.push({
      id: 'chapmile',
      section: 'My chapter',
      name: 'Chapter milestone',
      eyebrow: 'Chapter milestone',
      headline: `${formatNumber(chapterMilestone ?? 0)} people supported`,
      subline: chapter.name,
      stat: {
        value: formatNumber(chapterMilestone ?? 0),
        label: 'people supported',
      },
      theme: 'forest',
      formats: ['square', 'story'],
      verified: Boolean(chapterMilestone),
      caption: `${chapter.name} has supported ${formatNumber(chapterMilestone ?? 0)} people through published impact records.`,
      lockedReason: chapterMilestone
        ? undefined
        : 'Unlocks at the first 50-person threshold.',
    })
  }
  const forming = os.formingChapters[0]
  network.push({
    id: 'launch',
    section: 'My chapter',
    name: 'Chapter launch',
    eyebrow: 'Chapter forming',
    headline: forming ? forming.city.toUpperCase() : 'YOUR CITY',
    subline: forming
      ? 'Founding volunteers, leaders and partners wanted'
      : undefined,
    theme: 'gradient',
    formats: ['square', 'story'],
    verified: Boolean(forming),
    caption: forming
      ? `Goodness ${forming.city} is forming. Founding volunteers, leaders and partners wanted.`
      : 'Start a chapter in your city.',
    lockedReason: forming ? undefined : 'Unlocks when a chapter is forming.',
  })

  // ── Impact and trust ──────────────────────────────────────────────────────
  const impact: Array<CardSpec> = []
  const record = os.publishedImpact[0]
  if (record) {
    impact.push({
      id: 'impactpub',
      section: 'Impact & trust',
      name: 'Impact update',
      eyebrow: record.program?.shortName ?? 'Impact',
      headline: record.title,
      stat: {
        value: formatNumber(record.primaryValue),
        label: record.unitLabel,
      },
      bullets: record.outcomes
        .slice(0, 3)
        .map((o) => `${o.label} — ${o.basis}`),
      theme: 'light',
      formats: ['square', 'poster'],
      verified: record.fullyVerified,
      footnote: `${record.evidenceVerified}/${record.evidenceTotal} evidence items checked`,
      caption: `${record.title}: ${formatNumber(record.primaryValue)} ${record.unitLabel}. Outcomes are labelled by how strongly they are evidenced.`,
    })
    const fullyVerified = os.publishedImpact.find((r) => r.fullyVerified)
    impact.push({
      id: 'evidence',
      section: 'Impact & trust',
      name: 'Evidence verified',
      eyebrow: 'Evidence verified',
      headline: fullyVerified
        ? `${fullyVerified.evidenceVerified} of ${fullyVerified.evidenceTotal} checked`
        : 'Evidence in progress',
      subline: fullyVerified?.title,
      theme: 'light',
      formats: ['square'],
      verified: Boolean(fullyVerified),
      caption:
        'Every evidence item behind this record has been checked by our team.',
      lockedReason: fullyVerified
        ? undefined
        : 'Unlocks when every evidence item on a published record is checked.',
    })
  }
  const topFund = os.finance.funds.slice().sort((a, b) => b.spent - a.spent)[0]
  if (topFund) {
    impact.push({
      id: 'money',
      section: 'Impact & trust',
      name: 'Where the money went',
      eyebrow: 'Trust ledger',
      headline: 'Where the money went',
      stats: [
        {
          value: formatShortMoney(os.finance.received, currency),
          label: 'Received',
        },
        {
          value: formatShortMoney(os.finance.allocated, currency),
          label: 'Allocated',
        },
        { value: formatShortMoney(os.finance.spent, currency), label: 'Spent' },
      ],
      footnote: `${os.finance.programSharePct}% programmes · ${os.finance.overheadPct}% operations · ${os.finance.documentedPct}% documents checked`,
      theme: 'ink',
      formats: ['square', 'story'],
      verified: true,
      caption:
        'Received, allocated, spent — three different numbers, published line by line in our Trust Ledger.',
    })
  }

  // ── Missions and funding ──────────────────────────────────────────────────
  const recruiting: Array<CardSpec> = []
  os.openMissions
    .slice()
    .sort(
      (a, b) =>
        Number(b.priority === 'urgent') - Number(a.priority === 'urgent'),
    )
    .slice(0, 3)
    .forEach((mission) => {
      recruiting.push({
        id: `mission-${mission.id}`,
        section: 'Missions & funding',
        name: `${mission.priority === 'urgent' ? 'Urgent' : 'Recruit'} — ${mission.title}`,
        eyebrow:
          mission.priority === 'urgent'
            ? 'Urgent — volunteers needed'
            : 'Volunteers needed',
        headline: mission.title,
        subline: `${mission.dateLabel} · ${mission.venue ?? 'Remote'}`,
        stat: { value: String(mission.remaining), label: 'places still open' },
        bullets: mission.roles
          .filter((r) => r.remaining > 0)
          .map((r) => `${r.remaining} × ${r.role}`),
        theme: mission.priority === 'urgent' ? 'ink' : 'paper',
        formats: ['square', 'poster', 'story'],
        verified: true,
        caption: `${mission.title} — ${mission.remaining} places still open on ${mission.dateLabel}. ${mission.impactTarget ?? ''}`,
      })
    })
  os.opportunities
    .filter((o) => !o.funded)
    .slice(0, 2)
    .forEach((opportunity) => {
      recruiting.push({
        id: `fund-${opportunity.id}`,
        section: 'Missions & funding',
        name: `Funding gap — ${opportunity.title}`,
        eyebrow: opportunity.urgent ? 'Urgent funding gap' : 'Funding gap',
        headline: formatShortMoney(opportunity.gap, currency),
        subline: opportunity.title,
        bullets: opportunity.expected.slice(0, 3),
        footnote: `${opportunity.securedPct}% secured · contributions are pooled`,
        theme: 'royal',
        formats: ['square', 'poster'],
        verified: true,
        caption: `${opportunity.title} — ${formatShortMoney(opportunity.gap, currency)} still needed. Contributions join the pool for this initiative and results are reported collectively.`,
      })
    })

  // ── Partners ──────────────────────────────────────────────────────────────
  const partners: Array<CardSpec> = []
  if (partner) {
    partners.push({
      id: 'partner',
      section: 'Partners',
      name: 'Partner announcement',
      eyebrow: 'New partnership',
      headline: `${partner.name} × Goodness Society`,
      subline: partner.story ?? undefined,
      bullets: partner.programs.map((p) => p.name),
      theme: 'gradient',
      formats: ['square', 'story'],
      verified: true,
      caption: `${partner.name} and Goodness Society are working together on ${partner.programs.map((p) => p.name).join(' and ')}.`,
    })
    partners.push({
      id: 'partnermile',
      section: 'Partners',
      name: 'Partnership impact milestone',
      eyebrow: 'Partnership impact',
      headline: `${formatNumber(partner.peopleSupported)} people supported`,
      subline: `${partner.name} · ${partner.tenureMonths} months together`,
      footnote: 'Supported alongside other funders and volunteer time',
      theme: 'royal',
      formats: ['square'],
      verified: true,
      caption: `Work supported by our partnership with ${partner.name} has reached ${formatNumber(partner.peopleSupported)} people through published impact records.`,
    })
  }

  // ── Digests ───────────────────────────────────────────────────────────────
  const digests: Array<CardSpec> = [
    {
      id: 'week',
      section: 'Digests',
      name: 'Goodness this week',
      eyebrow: 'This week',
      headline: 'Goodness, this week',
      stats: [
        { value: String(os.stats.liveMissions), label: 'Live missions' },
        { value: String(os.stats.openPositions), label: 'Places open' },
        { value: formatNumber(os.stats.volunteers), label: 'Volunteers' },
        {
          value: formatNumber(os.stats.peopleSupported),
          label: 'People supported',
        },
        {
          value: formatShortMoney(os.finance.spent, currency),
          label: 'Deployed',
        },
        { value: String(os.stats.activeChapters), label: 'Chapters' },
      ],
      theme: 'light',
      formats: ['square', 'story'],
      verified: true,
      caption:
        'This week at Goodness Society — every figure computed from our public record.',
    },
    {
      id: 'month',
      section: 'Digests',
      name: 'Goodness this month',
      eyebrow: 'This month',
      headline: `${formatNumber(os.stats.peopleSupported)} people supported`,
      stats: [
        {
          value: String(os.stats.publishedRecords),
          label: 'Published records',
        },
        {
          value: `${os.stats.evidenceVerifiedPct}%`,
          label: 'Evidence checked',
        },
        {
          value: formatNumber(os.stats.verifiedHours),
          label: 'Verified hours',
        },
      ],
      theme: 'ink',
      formats: ['square', 'story'],
      verified: true,
      caption:
        'This month at Goodness Society. We don’t stop at what we delivered — we measure what changed.',
    },
  ]

  const sections: Array<CardCatalogue> = [
    { section: 'My journey', cards: journey },
    { section: 'Giving', cards: giving },
    { section: 'My chapter', cards: network },
    { section: 'Impact & trust', cards: impact },
    { section: 'Missions & funding', cards: recruiting },
    { section: 'Partners', cards: partners },
    { section: 'Digests', cards: digests },
  ]
  return sections.filter((s) => s.cards.length > 0)
}

export { rhythmPer30 }
