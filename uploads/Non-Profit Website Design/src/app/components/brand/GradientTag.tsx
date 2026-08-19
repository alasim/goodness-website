interface GradientTagProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientTag({ children, className = "" }: GradientTagProps) {
  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-white text-sm font-semibold tracking-wide uppercase ${className}`}
      style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
    >
      {children}
    </span>
  );
}
