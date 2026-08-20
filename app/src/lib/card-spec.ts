/**
 * GOODNESS OS — share card spec.
 *
 * A card is a social claim the platform can stand behind, so every value on one is built here from
 * the live model. The only field a person can type is the personal note. Cards that are not earned
 * yet are still listed, locked, with an honest reason — the catalogue never hides what is possible.
 */

/** The eight looks a card can wear, from `Share Studio.dc.html`. */
export type CardTheme =
  'light' | 'ink' | 'gradient' | 'paper' | 'alarm' | 'royal' | 'forest' | 'blue'

/** Each layout is a distinct composition; the default one covers most milestone cards. */
export type CardLayout =
  | 'default'
  | 'recruit'
  | 'urgent'
  | 'fund'
  | 'pct'
  | 'funded'
  | 'impactpub'
  | 'outcome'
  | 'evidence'
  | 'duo'
  | 'digest'
  | 'year'
  | 'money'
  | 'chapmember'
  | 'chapmile'
  | 'lead'
  | 'launch'

export type CardFormat = 'square' | 'story' | 'a4'

export interface CardStat {
  value: string
  label: string
}

export interface CardRow {
  value: string
  label: string
  basis?: string
}

export interface CardSpec {
  id: string
  /** Which rail panel the card belongs to. */
  category:
    'journey' | 'giving' | 'chapter' | 'impact' | 'orgs' | 'partner' | 'digest'
  name: string
  /** The one-line explanation under the name — or the reason it is locked. */
  sub: string
  available: boolean
  theme: CardTheme
  layout: CardLayout
  /** A4 is offered only where the design offers it: recruitment and funding posters. */
  a4?: boolean
  allowNote?: boolean
  caption: string

  eyebrow?: string
  title?: string
  meta?: string
  line1?: string
  chip?: string
  statement?: string
  giant?: string
  giantUnit?: string
  mono?: string
  refLine?: string
  band1?: string
  band2?: string
  money1?: string
  money2?: string
  barPct?: number
  pctLive?: string
  stack1?: string
  stack2?: string
  showAvatar?: boolean
  showBadge?: boolean
  stats?: Array<CardStat>
  rows?: Array<CardRow>
  expected?: Array<string>
  roles?: Array<{ count: string; role: string }>
  verifyLine?: string
}

/** The pixel size each format exports at. */
export const FORMAT_SIZE: Record<CardFormat, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  a4: { w: 1080, h: 1528 },
}

/** The card is composed at 540px wide; height follows the format. */
export const CARD_HEIGHT: Record<CardFormat, number> = {
  square: 540,
  story: 960,
  a4: 764,
}

/** How far the preview is scaled down to sit in the studio's frame. */
export const PREVIEW_SCALE: Record<CardFormat, number> = {
  square: 0.72,
  story: 0.55,
  a4: 0.62,
}

export interface ThemeTokens {
  bg: string
  fg: string
  sub: string
  accent: string
  motif: string
  tileBg: string
  tileFg: string
  giant: string
  chipBg: string
  chipFg: string
  verifiedBg: string
  verifiedFg: string
  badgeBg: string
  badgeStroke: string
}

const GREEN_GRADIENT = 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)'

export const THEMES: Record<CardTheme, ThemeTokens> = {
  ink: {
    bg: '#0D0D0D',
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.55)',
    accent: '#4DC86A',
    motif: 'rgba(255,255,255,0.08)',
    tileBg: GREEN_GRADIENT,
    tileFg: '#ffffff',
    giant: '#4DC86A',
    chipBg: 'rgba(77,200,106,0.15)',
    chipFg: '#4DC86A',
    verifiedBg: 'rgba(255,255,255,0.1)',
    verifiedFg: '#4DC86A',
    badgeBg: 'rgba(77,200,106,0.15)',
    badgeStroke: '#4DC86A',
  },
  gradient: {
    bg: GREEN_GRADIENT,
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.75)',
    accent: 'rgba(255,255,255,0.9)',
    motif: 'rgba(255,255,255,0.18)',
    tileBg: '#ffffff',
    tileFg: '#1B7A34',
    giant: '#ffffff',
    chipBg: 'rgba(255,255,255,0.16)',
    chipFg: '#ffffff',
    verifiedBg: 'rgba(255,255,255,0.16)',
    verifiedFg: '#ffffff',
    badgeBg: 'rgba(255,255,255,0.16)',
    badgeStroke: '#ffffff',
  },
  paper: {
    bg: '#F6F3EA',
    fg: '#141410',
    sub: '#6f6a5c',
    accent: '#1B7A34',
    motif: 'transparent',
    tileBg: '#141410',
    tileFg: '#F6F3EA',
    giant: '#141410',
    chipBg: '#141410',
    chipFg: '#F6F3EA',
    verifiedBg: '#141410',
    verifiedFg: '#4DC86A',
    badgeBg: '#141410',
    badgeStroke: '#4DC86A',
  },
  alarm: {
    bg: '#0D0D0D',
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.6)',
    accent: '#FF7A28',
    motif: 'transparent',
    tileBg: '#FF7A28',
    tileFg: '#0D0D0D',
    giant: '#FF7A28',
    chipBg: 'rgba(255,122,40,0.16)',
    chipFg: '#FF7A28',
    verifiedBg: 'rgba(255,122,40,0.16)',
    verifiedFg: '#FF7A28',
    badgeBg: 'rgba(255,122,40,0.16)',
    badgeStroke: '#FF7A28',
  },
  royal: {
    bg: '#1565C0',
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.7)',
    accent: '#BBDEFB',
    motif: 'rgba(255,255,255,0.1)',
    tileBg: '#ffffff',
    tileFg: '#1565C0',
    giant: '#ffffff',
    chipBg: 'rgba(255,255,255,0.16)',
    chipFg: '#ffffff',
    verifiedBg: 'rgba(255,255,255,0.16)',
    verifiedFg: '#BBDEFB',
    badgeBg: 'rgba(255,255,255,0.16)',
    badgeStroke: '#BBDEFB',
  },
  forest: {
    bg: '#145A28',
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.65)',
    accent: '#7FE49A',
    motif: 'rgba(255,255,255,0.1)',
    tileBg: '#ffffff',
    tileFg: '#145A28',
    giant: '#ffffff',
    chipBg: 'rgba(255,255,255,0.14)',
    chipFg: '#ffffff',
    verifiedBg: 'rgba(255,255,255,0.14)',
    verifiedFg: '#7FE49A',
    badgeBg: 'rgba(255,255,255,0.14)',
    badgeStroke: '#7FE49A',
  },
  blue: {
    bg: '#1565C0',
    fg: '#ffffff',
    sub: 'rgba(255,255,255,0.72)',
    accent: 'rgba(255,255,255,0.9)',
    motif: 'rgba(255,255,255,0.14)',
    tileBg: '#ffffff',
    tileFg: '#1565C0',
    giant: '#ffffff',
    chipBg: 'rgba(255,255,255,0.16)',
    chipFg: '#ffffff',
    verifiedBg: 'rgba(255,255,255,0.16)',
    verifiedFg: '#ffffff',
    badgeBg: 'rgba(255,255,255,0.16)',
    badgeStroke: '#ffffff',
  },
  light: {
    bg: '#ffffff',
    fg: '#0D0D0D',
    sub: '#6B7280',
    accent: '#1B7A34',
    motif: 'rgba(27,122,52,0.12)',
    tileBg: GREEN_GRADIENT,
    tileFg: '#ffffff',
    giant: '#1B7A34',
    chipBg: '#f0faf3',
    chipFg: '#1B7A34',
    verifiedBg: '#f0faf3',
    verifiedFg: '#1B7A34',
    badgeBg: '#f0faf3',
    badgeStroke: '#1B7A34',
  },
}
