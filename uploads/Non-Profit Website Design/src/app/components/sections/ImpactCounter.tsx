import { useEffect, useRef, useState } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

function Counter({ end, suffix = "", prefix = "", label, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold" style={{ color: "#1B7A34" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-[#6B7280] font-medium">{label}</div>
    </div>
  );
}

export function ImpactCounters() {
  return (
    <section className="py-16 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={2400} suffix="+" label="Lives Touched" />
          <Counter end={12} label="Active Programs" />
          <Counter end={8} label="Partner Organisations" />
          <Counter end={100} suffix="%" label="Financial Transparency" />
        </div>
      </div>
    </section>
  );
}
