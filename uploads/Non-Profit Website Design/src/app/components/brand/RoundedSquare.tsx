interface RoundedSquareProps {
  size?: number;
  rotate?: number;
  gradient?: boolean;
  color?: string;
  opacity?: number;
  className?: string;
}

export function RoundedSquare({
  size = 200,
  rotate = 0,
  gradient = false,
  color = "#4DC86A",
  opacity = 1,
  className = "",
}: RoundedSquareProps) {
  const id = `rsq-grad-${Math.random().toString(36).slice(2, 7)}`;
  const rx = size * 0.2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, opacity, display: "block" }}
    >
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4DC86A" />
            <stop offset="100%" stopColor="#1B7A34" />
          </linearGradient>
        </defs>
      )}
      <rect
        x={size * 0.04}
        y={size * 0.04}
        width={size * 0.92}
        height={size * 0.92}
        rx={rx}
        fill={gradient ? `url(#${id})` : color}
      />
    </svg>
  );
}
