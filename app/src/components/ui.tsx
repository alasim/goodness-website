import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'ink' | 'neutral'

const toneClass: Record<Tone, string> = {
  green: 'gs-pill--green',
  blue: 'gs-pill--blue',
  amber: 'gs-pill--amber',
  red: 'gs-pill--red',
  ink: 'gs-pill--ink',
  neutral: '',
}

export function Pill({
  children,
  tone = 'neutral',
  title,
}: {
  children: ReactNode
  tone?: Tone
  title?: string
}) {
  return (
    <span className={`gs-pill ${toneClass[tone]}`} title={title}>
      {children}
    </span>
  )
}

export function Section({
  children,
  variant,
  tight,
  id,
}: {
  children: ReactNode
  variant?: 'mist' | 'ink'
  tight?: boolean
  id?: string
}) {
  const cls = [
    'gs-section',
    tight ? 'gs-section--tight' : '',
    variant === 'mist' ? 'gs-section--mist' : '',
    variant === 'ink' ? 'gs-section--ink' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <section className={cls} id={id}>
      <div className="gs-wrap">{children}</div>
    </section>
  )
}

export function Stat({
  value,
  label,
  note,
  gradient,
}: {
  value: ReactNode
  label: string
  note?: string
  gradient?: boolean
}) {
  return (
    <div className={`gs-stat ${gradient ? 'gs-stat--gradient' : ''}`}>
      <span className="gs-stat__value gs-num">{value}</span>
      <span className="gs-stat__label">{label}</span>
      {note ? <span className="gs-stat__note">{note}</span> : null}
    </div>
  )
}

export function Bar({
  pct,
  tone,
  tall,
  label,
}: {
  pct: number
  tone?: 'green' | 'blue' | 'amber'
  tall?: boolean
  label?: string
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)))
  const fill =
    tone === 'blue'
      ? 'gs-bar__fill--blue'
      : tone === 'amber'
        ? 'gs-bar__fill--amber'
        : ''
  return (
    <div
      className={`gs-bar ${tall ? 'gs-bar--tall' : ''}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'progress'}
    >
      <div
        className={`gs-bar__fill ${fill}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function Avatar({
  initials,
  color = 'green',
  size,
}: {
  initials: string
  color?: string
  size?: 'sm' | 'lg'
}) {
  const palette = ['green', 'blue', 'teal'].includes(color) ? color : 'green'
  const sizeClass = size ? `gs-avatar--${size}` : ''
  return (
    <span
      className={`gs-avatar gs-avatar--${palette} ${sizeClass}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="gs-empty">{children}</div>
}

export function Banner({
  children,
  variant,
}: {
  children: ReactNode
  variant?: 'warn' | 'info'
}) {
  return (
    <div
      className={`gs-banner ${variant ? `gs-banner--${variant}` : ''}`}
      role="status"
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="gs-eyebrow">{children}</p>
}

export function CardLink({
  children,
  ...linkProps
}: { children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link {...linkProps} className="gs-card gs-card--flat gs-card--link">
      {children}
    </Link>
  )
}

/**
 * Split-weight heading — the brand's signature (DESIGN-SYSTEM.md §1).
 * A light 300 clause and an extrabold 800 clause share one line; the hero reverses the order and
 * italicises the light clause.
 */
export function Display({
  light,
  bold,
  variant,
  onInk,
  reverse,
  italic,
  stacked,
  boldColor,
  style,
  as: Tag = 'h2',
}: {
  light: string
  bold: string
  variant?: 'hero' | 'page' | 'section' | 'minor' | 'cta'
  onInk?: boolean
  reverse?: boolean
  italic?: boolean
  /** Design sometimes breaks the two clauses onto their own lines (e.g. the missions board). */
  stacked?: boolean
  boldColor?: string
  /** A page whose design sets its own clamp (the scale is not fully shared) passes it here. */
  style?: CSSProperties
  as?: 'h1' | 'h2'
}) {
  const cls = [
    variant ? `gs-display--${variant}` : '',
    onInk ? 'gs-display--onink' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const lightSpan = (
    <span
      className={italic ? 'gs-display__light--italic' : 'gs-display__light'}
    >
      {light}
    </span>
  )
  const boldSpan = (
    <span style={boldColor ? { color: boldColor } : undefined}>{bold}</span>
  )
  const separator = stacked ? <br /> : ' '
  return (
    <Tag className={cls} style={style}>
      {reverse ? (
        <>
          {boldSpan}
          {separator}
          {lightSpan}
        </>
      ) : (
        <>
          {lightSpan}
          {separator}
          {boldSpan}
        </>
      )}
    </Tag>
  )
}
