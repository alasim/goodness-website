interface GSwashProps {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  className?: string;
  flip?: boolean;
}

export function GSwash({
  width = 600,
  height = 400,
  color = "#4DC86A",
  opacity = 0.07,
  className = "",
  flip = false,
}: GSwashProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 600 400"
      fill="none"
      className={className}
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
      aria-hidden="true"
    >
      {/* Large circular arc — the "g" bowl */}
      <circle cx="220" cy="180" r="160" stroke={color} strokeWidth="44" fill="none" />
      {/* The descending tail of the g */}
      <path
        d="M370 180 C390 180 420 200 430 240 C445 295 420 350 370 370 C310 395 240 370 210 320"
        stroke={color}
        strokeWidth="44"
        fill="none"
        strokeLinecap="round"
      />
      {/* Cross-bar of the g */}
      <line x1="220" y1="180" x2="380" y2="180" stroke={color} strokeWidth="44" strokeLinecap="round" />
    </svg>
  );
}
