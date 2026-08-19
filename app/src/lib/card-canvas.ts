/**
 * GOODNESS OS — Share Studio renderer.
 *
 * Cards are drawn straight onto a canvas rather than screenshotted from the DOM, for two reasons:
 * what you preview is byte-for-byte what you download, and the numbers on a card can only come
 * from the spec the platform built — a card is a social claim backed by the record behind it.
 */

export type CardTheme =
  'gradient' | 'ink' | 'paper' | 'royal' | 'light' | 'forest'
export type CardFormat = 'square' | 'story' | 'poster'

export interface CardStat {
  value: string
  label: string
}

export interface CardSpec {
  id: string
  section: string
  name: string
  eyebrow: string
  headline: string
  subline?: string
  stat?: CardStat
  stats?: Array<CardStat>
  bullets?: Array<string>
  footnote?: string
  theme: CardTheme
  formats: Array<CardFormat>
  verified?: boolean
  verifyRef?: string
  caption: string
  lockedReason?: string
}

export const FORMAT_SIZE: Record<CardFormat, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  poster: { w: 1080, h: 1528 }, // A4 proportions for print
}

interface Palette {
  bg: string | { from: string; to: string }
  ink: string
  muted: string
  accent: string
  rule: string
}

const PALETTES: Record<CardTheme, Palette> = {
  gradient: {
    bg: { from: '#4DC86A', to: '#1B7A34' },
    ink: '#FFFFFF',
    muted: 'rgba(255,255,255,0.78)',
    accent: '#FFFFFF',
    rule: 'rgba(255,255,255,0.28)',
  },
  ink: {
    bg: '#0D0D0D',
    ink: '#FFFFFF',
    muted: 'rgba(255,255,255,0.66)',
    accent: '#4DC86A',
    rule: 'rgba(255,255,255,0.18)',
  },
  paper: {
    bg: '#F6F1E7',
    ink: '#0D0D0D',
    muted: '#4B5563',
    accent: '#1B7A34',
    rule: 'rgba(0,0,0,0.14)',
  },
  royal: {
    bg: '#1565C0',
    ink: '#FFFFFF',
    muted: 'rgba(255,255,255,0.76)',
    accent: '#FFFFFF',
    rule: 'rgba(255,255,255,0.26)',
  },
  light: {
    bg: '#FFFFFF',
    ink: '#0D0D0D',
    muted: '#6B7280',
    accent: '#1B7A34',
    rule: 'rgba(0,0,0,0.1)',
  },
  forest: {
    bg: '#145A28',
    ink: '#FFFFFF',
    muted: 'rgba(255,255,255,0.72)',
    accent: '#4DC86A',
    rule: 'rgba(255,255,255,0.24)',
  },
}

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): Array<string> {
  const words = text.split(' ')
  const lines: Array<string> = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

/** The rounded-square G mark, drawn rather than loaded so a card never waits on an asset. */
function drawMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  inkColor: string,
) {
  const r = size * 0.28
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + size, y, x + size, y + size, r)
  ctx.arcTo(x + size, y + size, x, y + size, r)
  ctx.arcTo(x, y + size, x, y, r)
  ctx.arcTo(x, y, x + size, y, r)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = inkColor
  ctx.font = `800 ${size * 0.58}px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('G', x + size / 2, y + size / 2 + size * 0.02)
  ctx.restore()
}

export function renderCard(
  canvas: HTMLCanvasElement,
  spec: CardSpec,
  format: CardFormat,
  scale = 1,
): void {
  const { w, h } = FORMAT_SIZE[format]
  const palette = PALETTES[spec.theme]
  canvas.width = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(scale, scale)
  ctx.textBaseline = 'alphabetic'

  // Background
  if (typeof palette.bg === 'string') {
    ctx.fillStyle = palette.bg
  } else {
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, palette.bg.from)
    gradient.addColorStop(1, palette.bg.to)
    ctx.fillStyle = gradient
  }
  ctx.fillRect(0, 0, w, h)

  const pad = 96
  let y = pad + 40

  // Mark + wordmark
  drawMark(
    ctx,
    pad,
    pad - 10,
    76,
    palette.ink === '#FFFFFF'
      ? 'rgba(255,255,255,0.16)'
      : 'rgba(13,13,13,0.08)',
    palette.ink,
  )
  ctx.textAlign = 'left'
  ctx.fillStyle = palette.muted
  ctx.font = `700 26px ${FONT}`
  ctx.fillText('GOODNESS SOCIETY', pad + 100, pad + 32)
  y = pad + 150

  // Eyebrow
  ctx.fillStyle = palette.accent
  ctx.font = `800 26px ${FONT}`
  ctx.fillText(spec.eyebrow.toUpperCase(), pad, y)
  y += 62

  // Headline
  ctx.fillStyle = palette.ink
  const headlineSize =
    spec.headline.length > 60 ? 62 : spec.headline.length > 34 ? 78 : 96
  ctx.font = `800 ${headlineSize}px ${FONT}`
  for (const line of wrap(ctx, spec.headline, w - pad * 2)) {
    ctx.fillText(line, pad, y)
    y += headlineSize * 1.12
  }

  // Subline
  if (spec.subline) {
    y += 14
    ctx.fillStyle = palette.muted
    ctx.font = `500 34px ${FONT}`
    for (const line of wrap(ctx, spec.subline, w - pad * 2)) {
      ctx.fillText(line, pad, y)
      y += 46
    }
  }

  // Giant statistic
  if (spec.stat) {
    y += format === 'square' ? 40 : 70
    ctx.fillStyle = palette.ink
    const statSize = format === 'story' ? 230 : 190
    ctx.font = `800 ${statSize}px ${FONT}`
    ctx.fillText(spec.stat.value, pad, y + statSize * 0.76)
    y += statSize * 0.92
    ctx.fillStyle = palette.muted
    ctx.font = `600 34px ${FONT}`
    ctx.fillText(spec.stat.label, pad, y + 20)
    y += 60
  }

  // Stat row
  if (spec.stats?.length) {
    y += 40
    const columns = Math.min(spec.stats.length, format === 'square' ? 3 : 2)
    const colWidth = (w - pad * 2) / columns
    spec.stats.forEach((stat, i) => {
      const col = i % columns
      const row = Math.floor(i / columns)
      const x = pad + col * colWidth
      const rowY = y + row * 150
      ctx.fillStyle = palette.ink
      ctx.font = `800 62px ${FONT}`
      ctx.fillText(stat.value, x, rowY + 56)
      ctx.fillStyle = palette.muted
      ctx.font = `600 26px ${FONT}`
      for (const [j, line] of wrap(ctx, stat.label, colWidth - 30)
        .slice(0, 2)
        .entries()) {
        ctx.fillText(line, x, rowY + 96 + j * 32)
      }
    })
    y += Math.ceil(spec.stats.length / columns) * 150
  }

  // Bullets
  if (spec.bullets?.length) {
    y += 30
    ctx.font = `500 32px ${FONT}`
    for (const bullet of spec.bullets) {
      ctx.fillStyle = palette.accent
      ctx.fillText('·', pad, y)
      ctx.fillStyle = palette.muted
      for (const line of wrap(ctx, bullet, w - pad * 2 - 34)) {
        ctx.fillText(line, pad + 30, y)
        y += 44
      }
      y += 8
    }
  }

  // Footer
  const footerY = h - pad
  ctx.strokeStyle = palette.rule
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(pad, footerY - 92)
  ctx.lineTo(w - pad, footerY - 92)
  ctx.stroke()

  ctx.fillStyle = palette.muted
  ctx.font = `600 26px ${FONT}`
  ctx.fillText(
    spec.footnote ?? 'Together for a Better Tomorrow',
    pad,
    footerY - 44,
  )

  if (spec.verified) {
    ctx.textAlign = 'right'
    ctx.fillStyle = palette.accent
    ctx.font = `800 26px ${FONT}`
    ctx.fillText('GOODNESS VERIFIED ✓', w - pad, footerY - 44)
    if (spec.verifyRef) {
      ctx.fillStyle = palette.muted
      ctx.font = `500 22px ${FONT}`
      ctx.fillText(`Verify: ${spec.verifyRef}`, w - pad, footerY - 8)
    }
    ctx.textAlign = 'left'
  }
}

export function downloadCard(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}
