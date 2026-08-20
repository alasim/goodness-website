/**
 * GOODNESS OS — card catalogue, built from `Share Studio.dc.html`.
 *
 * Every card is generated from the live model. Numbers are locked: nothing on a card can be typed
 * by the person sharing it, so a card is always a claim the platform can stand behind. Cards that
 * are not earned yet stay in the catalogue, locked, with an honest reason — the list never hides
 * what is possible, and never pretends something happened.
 */
import { formatNumber, formatShortMoney } from './format'
import type { OSModel, VolunteerView } from '../data/os'
import type { CardSpec, CardStat } from './card-spec'

const SITE = 'goodness.org · backed by Goodness OS'

const HOURS = [1000, 500, 250, 100, 50, 25, 10]
const MISSIONS = [50, 25, 10, 5]
const CHAPTER_PEOPLE = [
  100000, 50000, 25000, 10000, 5000, 2500, 1000, 500, 250, 100,
]
const CHAPTER_HOURS = [50000, 25000, 10000, 5000, 2500, 1000, 500, 250, 100]
const CHAPTER_MEMBERS = [500, 250, 100, 50, 25]
const NETWORK_PEOPLE = [100000, 50000, 25000, 10000, 5000, 2500, 1000]
const CONTRIBUTIONS = [100, 50, 25, 10, 1]

const reached = (value: number, ladder: Array<number>) =>
  ladder.find((step) => value >= step) ?? null

const monthsSinceLabel = (label: string | null, now = new Date()) => {
  if (!label) return 0
  const parsed = new Date(`1 ${label}`)
  if (Number.isNaN(parsed.getTime())) return 0
  return Math.max(
    0,
    Math.floor((now.getTime() - parsed.getTime()) / (30.44 * 24 * 3600 * 1000)),
  )
}

export interface CardCatalogue {
  key: CardSpec['category']
  label: string
  note?: string
  cards: Array<CardSpec>
}

/**
 * Build every card for this viewer. A card with `available: false` still carries its name and the
 * reason it is locked, so the studio can show the whole ladder rather than an arbitrary subset.
 */
export function buildCards(
  os: OSModel,
  options: {
    person?: VolunteerView | null
    partnerId?: string | null
    chapterId?: string | null
  } = {},
): Array<CardSpec> {
  const person = options.person ?? null
  const cards: Array<CardSpec> = []
  const money = (value: number) => formatShortMoney(value, os.currency)
  const year = new Date().getFullYear()

  const chapter = options.chapterId
    ? os.chapterById.get(options.chapterId)
    : person?.chapterId
      ? os.chapterById.get(person.chapterId)
      : os.activeChapters[0]
  const chapterName = chapter?.name ?? 'the national network'
  const countryName =
    os.data.countries.find((c) => c.id === chapter?.countryId)?.name ??
    os.data.countries[0]?.name ??
    ''

  // ── My journey ────────────────────────────────────────────────────────────
  if (person) {
    const hours = person.totalHours
    const missions = person.totalMissions
    const credentials = person.credentials.filter((c) => c.status === 'valid')
    const certificate = credentials.find((c) =>
      /certificate of volunteer/i.test(c.title),
    )
    const skill = credentials.find(
      (c) => !/certificate of volunteer/i.test(c.title),
    )
    const statRow: Array<CardStat> = [
      { value: String(missions), label: 'MISSIONS' },
      { value: formatNumber(hours), label: 'VERIFIED HOURS' },
      { value: String(credentials.length), label: 'CREDENTIALS' },
    ]

    const mine = os.data.assignments
      .filter((a) => a.profileId === person.id && a.state === 'verified')
      .map((a) => ({ a, m: os.missionById.get(a.missionId) }))
      .filter((row) => row.m)
    const first = mine[0]
    const last = mine[mine.length - 1]

    cards.push({
      id: 'identity',
      category: 'journey',
      name: 'Volunteer Identity',
      sub: 'Who I am in Goodness — live from my Passport',
      available: true,
      theme: 'light',
      layout: 'default',
      allowNote: true,
      eyebrow: 'I VOLUNTEER WITH GOODNESS',
      showAvatar: true,
      title: person.fullName,
      line1: `${person.roleTitle ?? 'Volunteer'} · ${chapterName}`,
      stats: statRow,
      verifyLine: SITE,
      caption: `I volunteer with Goodness Society through ${chapterName} — ${missions} missions and ${formatNumber(hours)} verified service hours so far. There is a place for you too.`,
    })

    cards.push({
      id: 'first-mission',
      category: 'journey',
      name: 'First Mission',
      sub: first
        ? 'Where my journey began'
        : 'Unlocks when your first mission is verified',
      available: Boolean(first),
      theme: 'gradient',
      layout: 'default',
      eyebrow: 'MY FIRST GOODNESS MISSION ✓',
      title: first?.m?.title ?? 'My first mission',
      line1: first?.m
        ? `${first.m.chapter?.city ?? 'Goodness'} · ${roleOf(os, first.a.missionRoleId)}`
        : '',
      chip: `${first?.a.hoursCredited ?? first?.m?.hours ?? 0} verified service hours`,
      statement: 'This is where my Goodness journey begins.',
      verifyLine: SITE,
      caption: first
        ? `I completed my first Goodness mission — ${first.m?.title}. ${first.a.hoursCredited ?? first.m?.hours ?? 0} verified service hours. This is where it begins.`
        : '',
    })

    cards.push({
      id: 'mission-completed',
      category: 'journey',
      name: 'Mission Completed',
      sub: last
        ? 'My latest verified mission'
        : 'Unlocks when a mission you joined is verified',
      available: Boolean(last),
      theme: 'ink',
      layout: 'default',
      eyebrow: 'MISSION ACCOMPLISHED',
      title: last?.m?.title ?? 'Mission',
      line1: last?.m
        ? `${last.m.chapter?.city ?? 'Goodness'} · ${last.m.program?.name ?? ''}`
        : '',
      chip: `My contribution: ${roleOf(os, last?.a.missionRoleId)} · ${last?.a.hoursCredited ?? last?.m?.hours ?? 0}h verified`,
      statement: 'Delivered together, verified on the Goodness OS.',
      verifyLine: SITE,
      caption: last
        ? `Mission accomplished: ${last.m?.title} with ${chapterName}. My part: ${roleOf(os, last.a.missionRoleId)} · ${last.a.hoursCredited ?? last.m?.hours ?? 0} verified hours.`
        : '',
    })

    const hourMile = reached(hours, HOURS)
    cards.push({
      id: 'hours',
      category: 'journey',
      name: 'Service Hour Milestone',
      sub: hourMile
        ? `${hourMile} hours reached`
        : `Unlocks at 10 verified hours — you have ${hours}`,
      available: Boolean(hourMile),
      theme: 'ink',
      layout: 'default',
      allowNote: true,
      eyebrow: 'SERVICE HOUR MILESTONE',
      giant: hourMile ? formatNumber(hourMile) : '',
      giantUnit: 'HOURS OF GOODNESS',
      line1: `${missions} missions · ${chapterName}`,
      statement: 'Every hour verified on my Goodness Passport.',
      verifyLine: SITE,
      caption: hourMile
        ? `${formatNumber(hourMile)} hours of Goodness. Every one verified on my Goodness Passport across ${missions} missions with ${chapterName}. Small actions, done consistently.`
        : '',
    })

    const missionMile = reached(missions, MISSIONS)
    cards.push({
      id: 'missions',
      category: 'journey',
      name: 'Mission Milestone',
      sub: missionMile
        ? `${missionMile} missions reached`
        : `Unlocks at 5 verified missions — you have ${missions}`,
      available: Boolean(missionMile),
      theme: 'gradient',
      layout: 'default',
      allowNote: true,
      eyebrow: 'MISSION MILESTONE',
      giant: missionMile ? String(missionMile) : '',
      giantUnit: 'MISSIONS',
      line1: `${formatNumber(hours)} verified hours · ${chapterName}`,
      statement: `${missionMile ?? ''} missions. One commitment to doing good.`,
      verifyLine: SITE,
      caption: missionMile
        ? `${missionMile} missions with Goodness Society, ${formatNumber(hours)} verified service hours. One commitment to doing good.`
        : '',
    })

    const promoted = person.level !== 'Volunteer'
    cards.push({
      id: 'promotion',
      category: 'journey',
      name: 'Journey Promotion',
      sub: promoted
        ? `You are a ${person.level}`
        : 'Unlocks when you advance beyond Volunteer',
      available: promoted,
      theme: 'light',
      layout: 'default',
      eyebrow: 'NEW CHAPTER IN MY JOURNEY',
      title: `I’m now a ${person.level} at Goodness Society.`,
      line1: `${missions} missions · ${formatNumber(hours)} verified hours · ${chapterName}`,
      statement: 'Ready to help more people create meaningful change.',
      verifyLine: SITE,
      caption: promoted
        ? `A new chapter: I’m now a ${person.level} at Goodness Society. ${missions} missions and ${formatNumber(hours)} verified hours in — ready to help more people create meaningful change.`
        : '',
    })

    cards.push({
      id: 'credential',
      category: 'journey',
      name: 'Credential Earned',
      sub:
        skill?.title ?? 'Unlocks when Goodness issues you a skill credential',
      available: Boolean(skill),
      theme: 'light',
      layout: 'default',
      eyebrow: 'CREDENTIAL EARNED ✓',
      showBadge: true,
      title: skill?.title ?? '',
      line1: `Issued by Goodness Society · ${skill?.issuedLabel ?? ''}`,
      refLine: `Credential ${skill?.ref ?? ''}`,
      verifyLine: `Verify · goodness.org/verify · ${skill?.ref ?? ''}`,
      caption: skill
        ? `Goodness Society issued my credential — ${skill.title}. Independently verifiable, any time: goodness.org/verify · ${skill.ref}.`
        : '',
    })

    const certReady = Boolean(certificate && person.certificateEnabled)
    cards.push({
      id: 'certificate',
      category: 'journey',
      name: 'Certificate Achievement',
      sub: certReady
        ? 'Social version of your service certificate'
        : 'Unlocks with your Certificate of Volunteer Service',
      available: certReady,
      theme: 'light',
      layout: 'default',
      eyebrow: 'VOLUNTEER SERVICE CERTIFICATE',
      showBadge: true,
      title: 'Certificate of Volunteer Service earned',
      line1: `${formatNumber(hours)} verified service hours · ${person.program?.name ?? ''}`,
      refLine: `Ref ${certificate?.ref ?? ''}`,
      verifyLine: `Verify · goodness.org/verify · ${certificate?.ref ?? ''}`,
      caption: certificate
        ? `My Certificate of Volunteer Service from Goodness Society — ${formatNumber(hours)} verified hours in ${person.program?.name ?? ''}. Verify it: goodness.org/verify · ${certificate.ref}.`
        : '',
    })

    // ── Member & giving ─────────────────────────────────────────────────────
    const commitment = os.data.commitments.find(
      (c) => c.profileId === person.id && c.status !== 'ended',
    )
    const sustaining = Boolean(commitment)
    const since = person.sustainingSince ?? commitment?.startedOn ?? ''
    const contributions = commitment
      ? os.data.commitmentContributions.filter(
          (c) => c.commitmentId === commitment.id,
        ).length
      : 0
    const months = monthsSinceLabel(since)
    const durationMile =
      months >= 36
        ? 'Three years'
        : months >= 12
          ? 'One year'
          : months >= 6
            ? 'Six months'
            : null
    const countMile = reached(contributions, CONTRIBUTIONS)

    cards.push({
      id: 'sustaining',
      category: 'giving',
      name: 'Sustaining Member',
      sub: sustaining
        ? `Sustaining since ${since} — never shows your amount`
        : 'Unlocks when you start a Goodness Commitment (My Goodness)',
      available: sustaining,
      theme: 'gradient',
      layout: 'default',
      allowNote: true,
      eyebrow: 'I HELP SUSTAIN GOODNESS',
      title: `Sustaining Member since ${since}`,
      line1: chapterName,
      chip: 'Entirely voluntary — never a membership fee',
      statement: 'Showing up consistently for a better tomorrow.',
      verifyLine: SITE,
      caption: sustaining
        ? `I’m a Sustaining Member of Goodness Society — a voluntary commitment in my own rhythm, since ${since}. Small commitments. One strong movement.`
        : '',
    })

    const milestoneReady = sustaining && Boolean(durationMile ?? countMile)
    cards.push({
      id: 'commitment-milestone',
      category: 'giving',
      name: 'Commitment Milestone',
      sub: sustaining
        ? durationMile
          ? `${durationMile} sustaining`
          : countMile
            ? `${countMile} ${countMile === 1 ? 'contribution' : 'contributions'}`
            : 'First contribution unlocks this card'
        : 'Unlocks with an active Goodness Commitment',
      available: milestoneReady,
      theme: 'ink',
      layout: 'default',
      allowNote: true,
      eyebrow: 'COMMITMENT MILESTONE',
      ...(durationMile
        ? { title: `${durationMile} sustaining Goodness.` }
        : {
            giant: countMile ? String(countMile) : '',
            giantUnit: countMile === 1 ? 'CONTRIBUTION' : 'CONTRIBUTIONS',
          }),
      line1: durationMile
        ? `Since ${since} · ${chapterName}`
        : `Sustaining since ${since} · ${chapterName}`,
      statement: 'Small commitments. One strong movement.',
      verifyLine: SITE,
      caption: milestoneReady
        ? durationMile
          ? `${durationMile} sustaining Goodness Society — showing up in my own rhythm since ${since}. Small commitments. One strong movement.`
          : `${countMile} ${countMile === 1 ? 'contribution' : 'contributions'} to sustain Goodness Society since ${since}. Small commitments. One strong movement.`
        : '',
    })

    const myGifts = os.finance.donations.filter(
      (d) => d.donorProfileId === person.id || d.donorName === person.fullName,
    )
    const restrictedRecord = myGifts
      .map((d) =>
        d.restrictedProgramSlug
          ? os.impact.find(
              (r) => r.published && r.programSlug === d.restrictedProgramSlug,
            )
          : undefined,
      )
      .find(Boolean)
    const backed =
      restrictedRecord ??
      (myGifts.length ? os.impact.find((r) => r.published) : undefined)
    const unrestricted = Boolean(backed && !restrictedRecord)
    const outcome = backed?.outcomes.find((o) => o.basis === 'verified')

    cards.push({
      id: 'backed-impact',
      category: 'giving',
      name: 'Supporter Impact Update',
      sub: backed
        ? `Latest published record from work you back${unrestricted ? ' (unrestricted giving)' : ''}`
        : 'Unlocks when an initiative you backed publishes impact',
      available: Boolean(backed),
      theme: 'light',
      layout: 'default',
      eyebrow: 'AN INITIATIVE I BACKED REPORTED IMPACT',
      title: backed?.title ?? '',
      line1: backed
        ? `${backed.program?.name ?? ''} · ${backed.chapter?.city ?? 'Goodness'} · ${backed.dateLabel ?? ''}`
        : '',
      stats: backed
        ? [
            {
              value: formatNumber(backed.primaryValue),
              label: backed.unitLabel.toUpperCase(),
            },
            {
              value: `${backed.evidenceVerified}/${backed.evidenceTotal}`,
              label: 'EVIDENCE VERIFIED',
            },
          ]
        : [],
      chip: outcome
        ? `${formatNumber(outcome.value ?? 0)} ${outcome.label.toLowerCase()} · Verified`
        : '',
      statement:
        'Results are shared across all funders — my giving joined pooled programme funding.',
      verifyLine: SITE,
      caption: backed
        ? `An initiative I backed just reported impact: ${backed.title} — ${formatNumber(backed.primaryValue)} ${backed.unitLabel}${outcome ? `, ${formatNumber(outcome.value ?? 0)} ${outcome.label.toLowerCase()} (verified)` : ''}. Every record is published with evidence on Goodness.`
        : '',
    })

    // ── My chapter & network ────────────────────────────────────────────────
    const active = chapter?.status === 'active'
    const mono = (chapter?.city ?? 'G').charAt(0)

    cards.push({
      id: 'chap-member',
      category: 'chapter',
      name: 'Chapter Member',
      sub: active
        ? `Proud member of ${chapter.name} — live chapter stats`
        : 'Unlocks when your city has an active chapter',
      available: active,
      theme: 'light',
      layout: 'chapmember',
      allowNote: true,
      mono,
      eyebrow: 'PROUD MEMBER OF',
      title: chapter?.name ?? '',
      meta: `${chapter?.city ?? ''}${countryName ? `, ${countryName}` : ''}`,
      statement: 'Together for a Better Tomorrow.',
      stats: chapter
        ? [
            { value: String(chapter.memberCount), label: 'MEMBERS' },
            { value: String(chapter.liveMissions), label: 'LIVE MISSIONS' },
            {
              value: formatNumber(chapter.peopleSupported),
              label: 'PEOPLE SUPPORTED',
            },
          ]
        : [],
      verifyLine: SITE,
      caption: active
        ? `Proud member of ${chapter.name} — ${chapter.memberCount} members, ${chapter.liveMissions} live missions, ${formatNumber(chapter.peopleSupported)} people supported through published impact. Together for a Better Tomorrow.`
        : '',
    })

    const seat = chapter?.team.find(
      (t) => t.volunteer?.id === person.id && !t.untilLabel,
    )
    const leads = Boolean(seat && /lead/i.test(seat.role))
    cards.push({
      id: 'chap-lead',
      category: 'chapter',
      name: 'Chapter Leadership',
      sub: leads
        ? `${seat!.role} · ${chapter?.name ?? ''}`
        : 'Unlocks when you hold a chapter leadership role',
      available: leads,
      theme: 'light',
      layout: 'lead',
      allowNote: true,
      eyebrow: 'LEADING GOODNESS LOCALLY',
      title: person.fullName,
      meta: leads ? `${seat!.role} · ${chapter?.name ?? ''}` : '',
      statement: 'Building local action with national standards.',
      stats: [
        { value: String(missions), label: 'MISSIONS' },
        { value: formatNumber(hours), label: 'VERIFIED HOURS' },
      ],
      verifyLine: SITE,
      caption: leads
        ? `I serve as ${seat!.role} of ${chapter?.name ?? ''} — building local action with national standards. ${missions} missions and ${formatNumber(hours)} verified hours so far.`
        : '',
    })

    const forming = chapter?.status === 'forming'
    cards.push({
      id: 'founding',
      category: 'chapter',
      name: 'Founding Member',
      sub: forming
        ? `Building ${chapter.name} from day one`
        : 'Unlocks for members of a forming chapter — from day one',
      available: forming,
      theme: 'ink',
      layout: 'lead',
      allowNote: true,
      eyebrow: 'FOUNDING MEMBER',
      title: person.fullName,
      meta: `${chapter?.name ?? ''} · forming`,
      statement: 'Building the chapter from day one.',
      verifyLine: SITE,
      caption: forming
        ? `Founding member of ${chapter.name} — building the chapter from day one. Goodness is coming to ${chapter.city}.`
        : '',
    })

    const chapterMile = active
      ? (milestoneOf(
          chapter.peopleSupported,
          CHAPTER_PEOPLE,
          'PEOPLE SUPPORTED',
        ) ??
        milestoneOf(chapter.hours, CHAPTER_HOURS, 'VERIFIED SERVICE HOURS') ??
        milestoneOf(chapter.memberCount, CHAPTER_MEMBERS, 'MEMBERS STRONG'))
      : null
    cards.push({
      id: 'chap-mile',
      category: 'chapter',
      name: 'Chapter Milestone',
      sub: chapterMile
        ? `${chapter?.name ?? ''} · ${chapterMile.giant} ${chapterMile.unit.toLowerCase()}`
        : 'Unlocks when your chapter crosses a milestone',
      available: Boolean(chapterMile),
      theme: 'forest',
      layout: 'chapmile',
      mono,
      eyebrow: `${(chapter?.name ?? '').toUpperCase()} REACHED`,
      giant: chapterMile?.giant ?? '',
      giantUnit: chapterMile?.unit ?? '',
      statement:
        'Reached together — every number from verified records on Goodness OS.',
      verifyLine: SITE,
      caption: chapterMile
        ? `${chapter?.name ?? ''} reached ${chapterMile.giant} ${chapterMile.unit.toLowerCase()} — every number from verified records. Together for a Better Tomorrow.`
        : '',
    })
  }

  // ── Chapter launches (visible to everyone) ─────────────────────────────────
  os.formingChapters.forEach((forming) => {
    cards.push({
      id: `launch-${forming.id}`,
      category: 'chapter',
      name: `Chapter forming — ${forming.city}`,
      sub: 'Recruit the founding community',
      available: true,
      theme: 'gradient',
      layout: 'launch',
      eyebrow: 'GOODNESS IS COMING TO',
      giant: forming.city,
      title: 'We are forming a chapter — join from day one.',
      expected: [
        `Goodness standards ${forming.standardsDone}/${forming.standardsTotal}`,
        'Leadership team assembling',
        'Founding members welcome',
      ],
      band2: 'goodness.org/chapters',
      verifyLine: SITE,
      caption: `Goodness is coming to ${forming.city}. We are forming a chapter — founding members welcome. Goodness standards ${forming.standardsDone}/${forming.standardsTotal} complete.`,
    })
  })

  os.activeChapters.slice(0, 2).forEach((live) => {
    cards.push({
      id: `launched-${live.id}`,
      category: 'chapter',
      name: `Now active — ${live.city}`,
      sub: 'Chapter launch announcement',
      available: true,
      theme: 'gradient',
      layout: 'launch',
      eyebrow: 'NOW ACTIVE IN',
      giant: live.city,
      title: `${live.name} is running missions.`,
      expected: [
        `${live.memberCount} members`,
        `${live.liveMissions} live missions`,
        `${formatNumber(live.peopleSupported)} people supported`,
      ],
      band2: 'goodness.org/chapters',
      verifyLine: SITE,
      caption: `${live.name} is now active — ${live.memberCount} members and ${live.liveMissions} live missions. Every number from verified records.`,
    })
  })

  const networkMile = milestoneOf(
    os.stats.peopleSupported,
    NETWORK_PEOPLE,
    'PEOPLE SUPPORTED',
  )
  cards.push({
    id: 'network',
    category: 'chapter',
    name: 'National Milestone',
    sub: networkMile
      ? `The network · ${networkMile.giant} people supported`
      : 'Unlocks at the next national milestone',
    available: Boolean(networkMile),
    theme: 'ink',
    layout: 'duo',
    eyebrow: 'THE GOODNESS NETWORK REACHED',
    giant: networkMile?.giant ?? '',
    giantUnit: networkMile?.unit ?? '',
    stats: [
      { value: String(os.stats.activeChapters), label: 'ACTIVE CHAPTERS' },
      { value: formatNumber(os.stats.volunteers), label: 'VOLUNTEERS' },
      {
        value: formatNumber(os.stats.verifiedHours),
        label: 'VERIFIED HOURS',
      },
    ],
    statement:
      'One organisation, many chapters — every figure computed from the same records.',
    verifyLine: SITE,
    caption: networkMile
      ? `The Goodness network reached ${networkMile.giant} people supported through published impact records, across ${os.stats.activeChapters} active chapters.`
      : '',
  })

  // ── Impact & trust ─────────────────────────────────────────────────────────
  os.impact
    .filter((r) => r.published)
    .slice(0, 3)
    .forEach((record) => {
      cards.push({
        id: `imppub-${record.id}`,
        category: 'impact',
        name: `Impact update — ${record.title.split(' — ')[0]}`,
        sub: `${record.program?.name ?? ''} · ${record.dateLabel ?? ''}`,
        available: true,
        theme: 'light',
        layout: 'impactpub',
        eyebrow: 'IMPACT PUBLISHED',
        title: record.title,
        meta: `${record.program?.name ?? ''} · ${record.chapter?.city ?? 'Goodness'} · ${record.dateLabel ?? ''}`,
        rows: [
          {
            value: formatNumber(record.primaryValue),
            label: record.unitLabel,
          },
          ...record.outcomes.slice(0, 3).map((outcome) => ({
            value: outcome.value == null ? '—' : formatNumber(outcome.value),
            label: outcome.label,
            basis: outcome.basis.toUpperCase(),
          })),
        ],
        band2: `Evidence ${record.evidenceVerified}/${record.evidenceTotal} verified`,
        verifyLine: SITE,
        caption: `${record.title} — ${formatNumber(record.primaryValue)} ${record.unitLabel}, published with ${record.evidenceVerified}/${record.evidenceTotal} evidence items verified.`,
      })
    })

  const bestOutcome = os.impact
    .filter((r) => r.published)
    .flatMap((r) => r.outcomes.map((o) => ({ o, r })))
    .find((row) => row.o.basis === 'verified' && row.o.value != null)
  cards.push({
    id: 'outcome',
    category: 'impact',
    name: 'Outcome Milestone',
    sub: bestOutcome
      ? `${formatNumber(bestOutcome.o.value ?? 0)} ${bestOutcome.o.label.toLowerCase()} · verified`
      : 'Unlocks when a published record carries a verified outcome',
    available: Boolean(bestOutcome),
    theme: 'royal',
    layout: 'outcome',
    eyebrow: 'VERIFIED OUTCOME',
    giant: bestOutcome ? formatNumber(bestOutcome.o.value ?? 0) : '',
    giantUnit: bestOutcome?.o.label.toUpperCase() ?? '',
    title: bestOutcome?.r.title ?? '',
    chip: 'VERIFIED',
    statement:
      'An outcome is what changed afterwards — measured, evidenced, and published, never estimated.',
    verifyLine: SITE,
    caption: bestOutcome
      ? `${formatNumber(bestOutcome.o.value ?? 0)} ${bestOutcome.o.label.toLowerCase()} — a verified outcome from ${bestOutcome.r.title}. Measured after the work, not estimated during it.`
      : '',
  })

  const fullyEvidenced = os.impact.find(
    (r) => r.published && r.evidenceTotal > 0 && r.fullyVerified,
  )
  cards.push({
    id: 'evidence',
    category: 'impact',
    name: 'Evidence Verified',
    sub: fullyEvidenced
      ? `${fullyEvidenced.evidenceTotal}/${fullyEvidenced.evidenceTotal} items verified · ${fullyEvidenced.title.split(' — ')[0]}`
      : 'Unlocks when every evidence item on a published record is verified',
    available: Boolean(fullyEvidenced),
    theme: 'light',
    layout: 'evidence',
    eyebrow: 'EVIDENCE VERIFIED',
    giant: fullyEvidenced
      ? `${fullyEvidenced.evidenceVerified}/${fullyEvidenced.evidenceTotal}`
      : '',
    title: fullyEvidenced?.title ?? '',
    meta: fullyEvidenced
      ? `${fullyEvidenced.program?.name ?? ''} · ${fullyEvidenced.dateLabel ?? ''}`
      : '',
    expected: (fullyEvidenced?.evidence ?? []).slice(0, 4).map((e) => e.label),
    band2: 'Every item checked by a second pair of eyes',
    verifyLine: SITE,
    caption: fullyEvidenced
      ? `Every evidence item on ${fullyEvidenced.title} is verified — ${fullyEvidenced.evidenceVerified}/${fullyEvidenced.evidenceTotal} checked. Claims are only as good as what backs them.`
      : '',
  })

  const topFund = [...os.finance.funds].sort((a, b) => b.spent - a.spent)[0]
  cards.push({
    id: 'money-fund',
    category: 'impact',
    name: 'Where the Money Went',
    sub: topFund?.spent
      ? `${topFund.program?.name ?? ''} · ${money(topFund.spent)} approved spending`
      : 'Unlocks once a programme has approved spending',
    available: Boolean(topFund?.spent),
    theme: 'ink',
    layout: 'money',
    eyebrow: 'WHERE THE MONEY WENT',
    title: topFund?.program?.name ?? '',
    rows: topFund
      ? [
          { value: money(topFund.allocated), label: 'ALLOCATED' },
          { value: money(topFund.spent), label: 'APPROVED SPENDING' },
          {
            value: `${topFund.documentedPct}%`,
            label: 'OF SPENDING WITH A DOCUMENT',
          },
        ]
      : [],
    band2: 'Line by line on the Trust Ledger',
    verifyLine: SITE,
    caption: topFund
      ? `${topFund.program?.name ?? ''}: ${money(topFund.spent)} of approved spending, ${topFund.documentedPct}% of it documented. Every line is public on the Trust Ledger.`
      : '',
  })

  cards.push({
    id: 'money-annual',
    category: 'impact',
    name: 'Programme vs operations',
    sub: `${os.finance.programSharePct}% programme · ${os.finance.overheadPct}% operations`,
    available: os.finance.spent > 0,
    theme: 'ink',
    layout: 'duo',
    eyebrow: 'WHERE EVERY TAKA GOES',
    giant: `${os.finance.programSharePct}%`,
    giantUnit: 'OF SPENDING GOES TO PROGRAMMES',
    stats: [
      {
        value: `${os.finance.overheadPct}%`,
        label: 'OPERATIONS & ADMIN',
      },
      {
        value: `${os.finance.documentedPct}%`,
        label: 'OF SPENDING DOCUMENTED',
      },
      {
        value: money(os.finance.spent),
        label: 'APPROVED SPENDING',
      },
    ],
    statement:
      'Published while the year is still running — not tidied up afterwards.',
    band2: 'goodness.org/trust',
    verifyLine: SITE,
    caption: `${os.finance.programSharePct}% of Goodness spending goes to programmes, ${os.finance.overheadPct}% to operations — published live, line by line, on the Trust Ledger.`,
  })

  // ── Missions & funding ─────────────────────────────────────────────────────
  os.openMissions.slice(0, 4).forEach((mission) => {
    const left = mission.remaining
    if (left <= 0) return
    const urgent = mission.priority === 'urgent'
    // Role counts carry the same share of migrated participants the mission's own capacity does,
    // so a poster's per-role numbers add up to the spots it advertises.
    const carried = Math.round(
      mission.seedFilled / Math.max(1, mission.roles.length),
    )
    const roles = mission.roles
      .map((r) => ({
        count: Math.max(0, r.need - r.filled - carried),
        role: r.role,
      }))
      .filter((r) => r.count > 0)
      .slice(0, 4)
      .map((r) => ({ count: String(r.count), role: r.role }))
    if (urgent) {
      cards.push({
        id: `urgent-${mission.id}`,
        category: 'orgs',
        name: `Urgent — ${mission.title}`,
        sub: `${left} positions still open · ${mission.dateLabel ?? ''}`,
        available: true,
        theme: 'alarm',
        layout: 'urgent',
        a4: true,
        eyebrow: 'URGENT',
        giant: String(left),
        giantUnit: left === 1 ? 'POSITION LEFT' : 'POSITIONS LEFT',
        title: mission.title,
        meta: `${mission.chapter?.city ?? 'Remote'} · ${mission.dateLabel ?? ''} · ${mission.hours} hours`,
        band1: 'JOIN NOW',
        band2: 'goodness.org/missions',
        verifyLine: SITE,
        caption: `Urgent: ${left} positions still open on ${mission.title} (${mission.dateLabel ?? ''}). If you can be there, we need you.`,
      })
    } else {
      cards.push({
        id: `recruit-${mission.id}`,
        category: 'orgs',
        name: `Volunteers needed — ${mission.title}`,
        sub: `${left} spots open · ${mission.dateLabel ?? ''}`,
        available: true,
        theme: 'paper',
        layout: 'recruit',
        a4: true,
        stack1: 'VOLUNTEERS',
        stack2: 'NEEDED',
        title: mission.title,
        meta: `${mission.chapter?.city ?? 'Remote'} · ${mission.dateLabel ?? ''} · ${mission.hours} service hours`,
        roles,
        band1: 'goodness.org/missions',
        band2: `${left} ${left === 1 ? 'spot' : 'spots'} open`,
        verifyLine: SITE,
        caption: `${left} volunteer spots open on ${mission.title} — ${mission.dateLabel ?? ''} in ${mission.chapter?.city ?? 'remote'}. ${mission.hours} verified service hours.`,
      })
    }
  })

  os.opportunities
    .filter((o) => o.open)
    .slice(0, 4)
    .forEach((opportunity) => {
      if (opportunity.funded) {
        cards.push({
          id: `funded-${opportunity.id}`,
          category: 'orgs',
          name: `Fully funded — ${opportunity.title}`,
          sub: `${money(opportunity.target)} secured together`,
          available: true,
          theme: 'gradient',
          layout: 'funded',
          title: opportunity.title,
          statement: `${money(opportunity.target)} secured. Delivery starts now, and every result will be published with evidence.`,
          verifyLine: SITE,
          caption: `Fully funded: ${opportunity.title}. ${money(opportunity.target)} secured together — results will be published with evidence.`,
        })
        return
      }
      cards.push({
        id: `fund-${opportunity.id}`,
        category: 'orgs',
        name: `Help fund — ${opportunity.title}`,
        sub: `${money(opportunity.gap)} still needed · ${opportunity.securedPct}% secured`,
        available: true,
        theme: 'blue',
        layout: 'fund',
        a4: true,
        eyebrow: 'HELP FUND THIS',
        title: opportunity.title,
        giant: money(opportunity.gap),
        giantUnit: 'STILL NEEDED',
        barPct: opportunity.securedPct,
        money1: `${money(opportunity.secured)} of ${money(opportunity.target)}`,
        pctLive: `${opportunity.securedPct}% secured`,
        expected: opportunity.expected.slice(0, 3),
        band2: 'goodness.org/fund',
        verifyLine: SITE,
        caption: `${opportunity.title} needs ${money(opportunity.gap)} to go — ${opportunity.securedPct}% secured. Expected outcomes are published up front and measured afterwards.`,
      })

      const pctMile = [75, 50, 25].find((m) => opportunity.securedPct >= m)
      if (pctMile) {
        cards.push({
          id: `pct-${opportunity.id}`,
          category: 'orgs',
          name: `${pctMile}% funded — ${opportunity.title}`,
          sub: `Progress milestone · live at ${opportunity.securedPct}%`,
          available: true,
          theme: 'light',
          layout: 'pct',
          eyebrow: 'FUNDING MILESTONE',
          giant: `${opportunity.securedPct}%`,
          giantUnit: 'SECURED',
          barPct: opportunity.securedPct,
          title: opportunity.title,
          money1: `${money(opportunity.secured)} secured`,
          money2: `${money(opportunity.gap)} still needed`,
          statement: 'Thank you — and there is still room to join.',
          verifyLine: SITE,
          caption: `${opportunity.title} is ${opportunity.securedPct}% funded — ${money(opportunity.secured)} secured, ${money(opportunity.gap)} to go.`,
        })
      }
    })

  // ── Partners ───────────────────────────────────────────────────────────────
  const partner = options.partnerId
    ? os.partnerById.get(options.partnerId)
    : os.activePartners[0]
  const corporate =
    os.activePartners.find((p) => p.employeesParticipated > 0) ?? partner

  cards.push({
    id: 'partner-announce',
    category: 'partner',
    name: 'Partner Announcement',
    sub: partner
      ? `${partner.name} · ${partner.tier ?? ''}`
      : 'Unlocks when a partnership becomes active',
    available: Boolean(partner),
    theme: 'light',
    layout: 'duo',
    eyebrow: 'NEW PARTNERSHIP',
    title: partner ? `${partner.name} × Goodness Society` : '',
    line1: partner
      ? `${partner.tier ?? ''} · since ${partner.sinceLabel ?? ''}`
      : '',
    chip: partner?.programs.map((p) => p.shortName ?? p.name).join(' · ') ?? '',
    statement:
      'Every partnership gets a live public page — what it supports, and what happened.',
    band2: 'goodness.org/partners',
    verifyLine: SITE,
    caption: partner
      ? `${partner.name} is partnering with Goodness Society. What the partnership supports — and what it achieves — is published on a live page anyone can read.`
      : '',
  })

  cards.push({
    id: 'partner-mile',
    category: 'partner',
    name: 'Partner Impact Milestone',
    sub: partner?.peopleSupported
      ? `${formatNumber(partner.peopleSupported)} people supported · ${partner.name}`
      : 'Unlocks when a backed programme publishes impact',
    available: Boolean(partner?.peopleSupported),
    theme: 'gradient',
    layout: 'duo',
    eyebrow: 'SHARED IMPACT MILESTONE',
    giant: partner ? formatNumber(partner.peopleSupported) : '',
    giantUnit: 'PEOPLE SUPPORTED BY PROGRAMMES WE BACK',
    title: partner ? `${partner.name} × Goodness Society` : '',
    statement:
      'A shared result across all funders of these programmes — never a private conversion of one gift.',
    band2: 'goodness.org/partners',
    verifyLine: SITE,
    caption: partner
      ? `${formatNumber(partner.peopleSupported)} people supported by the programmes ${partner.name} backs — a shared result, published with evidence.`
      : '',
  })

  cards.push({
    id: 'emp-vol',
    category: 'partner',
    name: 'Employee Volunteer',
    sub: corporate?.employeesParticipated
      ? `For ${corporate.name} employees · ${corporate.employeesParticipated} volunteering`
      : "Unlocks when a corporate partner's employees volunteer",
    available: Boolean(corporate?.employeesParticipated),
    theme: 'paper',
    layout: 'default',
    allowNote: true,
    eyebrow: 'I VOLUNTEER THROUGH MY WORKPLACE',
    title: corporate ? `${corporate.name} × Goodness Society` : '',
    line1: 'Employee volunteering, verified hour by hour',
    stats: corporate
      ? [
          {
            value: String(corporate.employeesParticipated),
            label: 'EMPLOYEES',
          },
          { value: String(corporate.employeesHours), label: 'SERVICE HOURS' },
          { value: String(corporate.employeesSessions), label: 'SESSIONS' },
        ]
      : [],
    statement: 'Skills given at work, counted the same as any other volunteer.',
    verifyLine: SITE,
    caption: corporate
      ? `I volunteer with Goodness Society through ${corporate.name} — employee hours verified the same way as everyone else's.`
      : '',
  })

  cards.push({
    id: 'emp-hours',
    category: 'partner',
    name: 'Corporate Employee Milestone',
    sub: corporate?.employeesHours
      ? `${corporate.employeesHours} employee hours · ${corporate.name}`
      : 'Unlocks with employee volunteering',
    available: Boolean(corporate?.employeesHours),
    theme: 'royal',
    layout: 'duo',
    eyebrow: 'EMPLOYEE VOLUNTEERING',
    giant: corporate ? String(corporate.employeesHours) : '',
    giantUnit: 'VERIFIED EMPLOYEE SERVICE HOURS',
    title: corporate?.name ?? '',
    stats: corporate
      ? [
          {
            value: String(corporate.employeesParticipated),
            label: 'EMPLOYEES',
          },
          { value: String(corporate.employeesSessions), label: 'SESSIONS' },
        ]
      : [],
    statement: 'Every hour verified by a team lead, like any other volunteer.',
    verifyLine: SITE,
    caption: corporate
      ? `${corporate.employeesHours} verified employee service hours from ${corporate.name} — counted the same way as every other Goodness volunteer.`
      : '',
  })

  const anniversary = os.activePartners
    .map((p) => ({ p, years: Math.floor(p.tenureMonths / 12) }))
    .find((row) => row.years >= 1)
  cards.push({
    id: 'partner-anniv',
    category: 'partner',
    name: 'Partnership Anniversary',
    sub: anniversary
      ? `${anniversary.years} ${anniversary.years === 1 ? 'year' : 'years'} · ${anniversary.p.name}`
      : "Unlocks at a partnership's first anniversary",
    available: Boolean(anniversary),
    theme: 'ink',
    layout: 'duo',
    eyebrow: 'PARTNERSHIP ANNIVERSARY',
    giant: anniversary ? String(anniversary.years) : '',
    giantUnit: anniversary?.years === 1 ? 'YEAR TOGETHER' : 'YEARS TOGETHER',
    title: anniversary ? `${anniversary.p.name} × Goodness Society` : '',
    line1: anniversary ? `Since ${anniversary.p.sinceLabel ?? ''}` : '',
    statement:
      'Partnerships are measured in what they delivered, not in years.',
    verifyLine: SITE,
    caption: anniversary
      ? `${anniversary.years} ${anniversary.years === 1 ? 'year' : 'years'} of partnership between ${anniversary.p.name} and Goodness Society — with the results published throughout.`
      : '',
  })

  // ── Digests ────────────────────────────────────────────────────────────────
  cards.push({
    id: 'digest-week',
    category: 'digest',
    name: 'Goodness This Week',
    sub: 'The weekly movement snapshot — no designer needed',
    available: true,
    theme: 'light',
    layout: 'digest',
    eyebrow: 'GOODNESS THIS WEEK',
    meta: `${os.stats.activeChapters} chapters · every figure computed live`,
    title: os.openMissions[0]?.title ?? '',
    stats: [
      { value: String(os.stats.liveMissions), label: 'MISSIONS LIVE' },
      { value: String(os.stats.openPositions), label: 'POSITIONS OPEN' },
      {
        value: formatNumber(os.stats.verifiedHours),
        label: 'VERIFIED HOURS',
      },
      {
        value: formatNumber(os.stats.peopleSupported),
        label: 'PEOPLE SUPPORTED',
      },
    ],
    statement:
      'Written by the OS from the same records the public pages read. Nobody hand-counts on a Friday.',
    verifyLine: SITE,
    caption: `Goodness this week: ${os.stats.liveMissions} missions live, ${os.stats.openPositions} positions open, ${formatNumber(os.stats.verifiedHours)} verified hours to date.`,
  })

  const monthLabel = new Date().toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
  const headline = os.impact.find((r) => r.published)
  cards.push({
    id: 'digest-month',
    category: 'digest',
    name: 'Goodness This Month',
    sub: `${monthLabel} recap with the month’s headline result`,
    available: true,
    theme: 'ink',
    layout: 'digest',
    eyebrow: 'GOODNESS THIS MONTH',
    meta: monthLabel,
    title: headline?.title ?? '',
    stats: [
      {
        value: formatNumber(os.stats.peopleSupported),
        label: 'PEOPLE SUPPORTED',
      },
      {
        value: String(os.impact.filter((r) => r.published).length),
        label: 'PUBLISHED RECORDS',
      },
      { value: money(os.finance.spent), label: 'APPROVED SPENDING' },
      { value: `${os.finance.documentedPct}%`, label: 'OF IT DOCUMENTED' },
    ],
    statement:
      'One recap, generated from the ledger and the impact records — not assembled by hand.',
    verifyLine: SITE,
    caption: `Goodness in ${monthLabel}: ${formatNumber(os.stats.peopleSupported)} people supported across published records, ${money(os.finance.spent)} of approved spending, ${os.finance.documentedPct}% documented.`,
  })

  // ── Year in review ─────────────────────────────────────────────────────────
  if (person) {
    cards.push({
      id: 'year-me',
      category: 'journey',
      name: 'My Year in Goodness',
      sub: `The flagship recap — my ${year}, verified`,
      available: true,
      theme: 'gradient',
      layout: 'year',
      allowNote: true,
      eyebrow: 'MY YEAR IN GOODNESS',
      giant: String(year),
      title: person.fullName,
      meta: `${person.roleTitle ?? 'Volunteer'} · ${chapterName}`,
      stats: [
        { value: String(person.totalMissions), label: 'MISSIONS' },
        {
          value: formatNumber(person.totalHours),
          label: 'VERIFIED HOURS',
        },
        { value: String(person.credentials.length), label: 'CREDENTIALS' },
        { value: person.level, label: 'JOURNEY STAGE' },
        {
          value: formatNumber(person.peopleSupported),
          label: 'PEOPLE SUPPORTED',
        },
        { value: String(person.programsCount), label: 'PROGRAMMES' },
      ],
      statement: 'Every number on this card comes from my verified record.',
      verifyLine: SITE,
      caption: `My year in Goodness: ${person.totalMissions} missions, ${formatNumber(person.totalHours)} verified hours, ${person.credentials.length} credentials. Every number verified.`,
    })
  }

  cards.push({
    id: 'year-partner',
    category: 'partner',
    name: 'Partner Year in Goodness',
    sub: partner
      ? `Our ${year} with Goodness — ${partner.name}`
      : 'Unlocks with an active partnership',
    available: Boolean(partner),
    theme: 'royal',
    layout: 'year',
    eyebrow: 'OUR YEAR IN GOODNESS',
    giant: String(year),
    title: partner?.name ?? '',
    meta: partner
      ? `${partner.tier ?? ''} · since ${partner.sinceLabel ?? ''}`
      : '',
    stats: partner
      ? [
          { value: money(partner.committed), label: 'COMMITTED' },
          { value: money(partner.received), label: 'RECEIVED' },
          { value: money(partner.deployed), label: 'PROGRAMME SPENDING' },
          {
            value: formatNumber(partner.peopleSupported),
            label: 'PEOPLE SUPPORTED (SHARED)',
          },
          {
            value: String(partner.employeesParticipated),
            label: 'EMPLOYEE VOLUNTEERS',
          },
          { value: String(partner.programs.length), label: 'PROGRAMMES' },
        ]
      : [],
    statement:
      'Programme results are collective — supported alongside other funding and volunteer effort.',
    verifyLine: SITE,
    caption: partner
      ? `Our year with Goodness Society: ${money(partner.received)} received, ${money(partner.deployed)} deployed by the programmes we back, ${formatNumber(partner.peopleSupported)} people supported.`
      : '',
  })

  const yearChapter = chapter?.status === 'active' ? chapter : null
  cards.push({
    id: 'year-chapter',
    category: 'chapter',
    name: 'Chapter Year in Goodness',
    sub: yearChapter
      ? `${yearChapter.name} — ${year} in review`
      : 'Unlocks when your chapter is active',
    available: Boolean(yearChapter),
    theme: 'gradient',
    layout: 'year',
    eyebrow: 'OUR YEAR IN GOODNESS',
    giant: String(year),
    title: yearChapter?.name ?? '',
    meta: yearChapter?.city ?? '',
    stats: yearChapter
      ? [
          { value: String(yearChapter.memberCount), label: 'MEMBERS' },
          {
            value: formatNumber(yearChapter.hours),
            label: 'VERIFIED HOURS',
          },
          {
            value: formatNumber(yearChapter.peopleSupported),
            label: 'PEOPLE SUPPORTED',
          },
          { value: String(yearChapter.missions.length), label: 'MISSIONS' },
          {
            value: String(yearChapter.partners.length),
            label: 'LOCAL PARTNERS',
          },
          { value: money(yearChapter.deployed), label: 'DEPLOYED LOCALLY' },
        ]
      : [],
    statement: 'Every figure computed from the chapter’s own verified records.',
    verifyLine: SITE,
    caption: yearChapter
      ? `${yearChapter.name} in ${year}: ${yearChapter.memberCount} members, ${formatNumber(yearChapter.hours)} verified hours, ${formatNumber(yearChapter.peopleSupported)} people supported.`
      : '',
  })

  return cards
}

/** The rail's panels, in the design's order, each with the note that explains it. */
export const CATALOGUE_SECTIONS: Array<{
  key: CardSpec['category']
  label: string
  note?: string
}> = [
  { key: 'journey', label: 'MY JOURNEY' },
  {
    key: 'giving',
    label: 'MEMBER & GIVING',
    note: 'Amounts never appear on these cards — the commitment is what counts.',
  },
  {
    key: 'chapter',
    label: 'MY CHAPTER & NETWORK',
    note: 'Chapter pride, leadership, launches and national milestones — all counted live from the network.',
  },
  {
    key: 'impact',
    label: 'IMPACT & TRUST',
    note: 'What happened afterward — published records, verified outcomes, and where the money went.',
  },
  {
    key: 'orgs',
    label: 'MISSIONS & FUNDING',
    note: 'Recruitment posters and funding cards, generated from live OS data — each type has its own look. Recruitment and funding support the A4 poster format for print.',
  },
  {
    key: 'partner',
    label: 'PARTNERS',
    note: 'Partnership announcements, shared-impact milestones, employee volunteering and anniversaries — figures pull live from the Partner Room.',
  },
  {
    key: 'digest',
    label: 'WEEKLY & MONTHLY DIGESTS',
    note: 'Recurring recap posts the OS writes itself — nobody hand-counts numbers on a Friday.',
  },
]

/** The order the studio suggests cards in — the ones most likely to be worth sharing today. */
export const RECOMMENDED_ORDER = [
  'credential',
  'commitment-milestone',
  'chap-lead',
  'founding',
  'hours',
  'missions',
  'chap-mile',
  'sustaining',
  'backed-impact',
  'promotion',
  'mission-completed',
  'chap-member',
  'first-mission',
  'identity',
]

function milestoneOf(value: number, ladder: Array<number>, unit: string) {
  const step = reached(value, ladder)
  return step ? { giant: formatNumber(step), unit } : null
}

function roleOf(os: OSModel, missionRoleId: string | null | undefined) {
  if (!missionRoleId) return 'Volunteer'
  return (
    os.data.missionRoles.find((r) => r.id === missionRoleId)?.role ??
    'Volunteer'
  )
}
