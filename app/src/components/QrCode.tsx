/**
 * Check-in code — the deterministic pseudo-QR from `Mission Detail.dc.html`.
 *
 * It is a visual stand-in, not a scannable code: the same mission and volunteer always produce the
 * same pattern, so the screen looks and behaves consistently until a real check-in code service
 * exists. Finder squares are drawn properly; the rest is seeded noise.
 */
export function QrCode({ seed, size = 132 }: { seed: string; size?: number }) {
  const n = 21
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const random = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const finder = (r: number, c: number): 'on' | 'off' | null => {
    for (const [r0, c0] of [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ]) {
      if (r >= r0! && r < r0! + 7 && c >= c0! && c < c0! + 7) {
        return Math.max(Math.abs(r - (r0! + 3)), Math.abs(c - (c0! + 3))) === 1
          ? 'off'
          : 'on'
      }
    }
    return null
  }

  const cells: Array<{ x: number; y: number }> = []
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const f = finder(r, c)
      if (f ? f === 'on' : random() > 0.52) cells.push({ x: c, y: r })
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', background: '#fff' }}
      aria-label="Check-in code"
      role="img"
    >
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill="#0D0D0D"
        />
      ))}
    </svg>
  )
}
