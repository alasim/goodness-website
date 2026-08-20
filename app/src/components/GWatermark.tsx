/**
 * The G monogram used as a faint watermark on page heroes and in the footer, drawn from the same
 * path as `SiteFooter.dc.html` / `Missions.dc.html`.
 */
export function GWatermark({
  width = 520,
  height = 360,
  style,
}: {
  width?: number
  height?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0.05,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <circle
        cx="220"
        cy="180"
        r="160"
        stroke="#4DC86A"
        strokeWidth="44"
        fill="none"
      />
      <path
        d="M370 180 C390 180 420 200 430 240 C445 295 420 350 370 370 C310 395 240 370 210 320"
        stroke="#4DC86A"
        strokeWidth="44"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="220"
        y1="180"
        x2="380"
        y2="180"
        stroke="#4DC86A"
        strokeWidth="44"
        strokeLinecap="round"
      />
    </svg>
  )
}
