/** Presentation helpers. Money is never rounded away — only abbreviated with its unit shown. */

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export function formatMoney(value: number, symbol = '৳'): string {
  return `${symbol}${formatNumber(value)}`
}

/** South Asian short form used across the prototype: 250000 -> ৳2.5L, 12500000 -> ৳1.25Cr. */
export function formatShortMoney(value: number, symbol = '৳'): string {
  const abs = Math.abs(value)
  if (abs >= 10_000_000) return `${symbol}${trim(value / 10_000_000)}Cr`
  if (abs >= 100_000) return `${symbol}${trim(value / 100_000)}L`
  if (abs >= 1_000) return `${symbol}${trim(value / 1_000)}K`
  return `${symbol}${formatNumber(value)}`
}

function trim(value: number): string {
  return value.toFixed(value >= 10 ? 1 : 2).replace(/\.?0+$/, '')
}

export function formatHours(value: number): string {
  return `${formatNumber(value)} hrs`
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

/** Assignment state -> the one vocabulary the whole product uses. */
export const STATE_LABEL: Record<string, string> = {
  joined: 'Joined',
  checked_in: 'Checked in',
  submitted: 'Contribution submitted',
  verified: 'Hours verified',
  withdrawn: 'Withdrawn',
}

export const BASIS_LABEL: Record<string, string> = {
  verified: 'Verified',
  'self-reported': 'Self-reported',
  observed: 'Observed',
  pending: 'Awaiting measurement',
}
