import { Link } from "react-router";
import { ArrowRight, CheckCircle2, BookOpen, Cpu, Users, Globe, Lightbulb } from "lucide-react";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { GSwash } from "../components/brand/GSwash";
import { GradientTag } from "../components/brand/GradientTag";
import { ImpactCounters } from "../components/sections/ImpactCounter";
import { TransparencyDashboard } from "../components/sections/TransparencyDashboard";

const focusAreas = [
  {
    icon: BookOpen,
    title: "Education & Career Readiness",
    desc: "Practical training, mentorship, and industry exposure for students and young professionals.",
    color: "#1B7A34",
  },
  {
    icon: Cpu,
    title: "AI & Digital Skills",
    desc: "Helping individuals adapt to the future of work through AI literacy and automation training.",
    color: "#1565C0",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    desc: "Skills, resources, and opportunities that unlock the potential of young people.",
    color: "#1B7A34",
  },
  {
    icon: Globe,
    title: "Community Development",
    desc: "Initiatives that address local challenges and improve quality of life through collaborative action.",
    color: "#1565C0",
  },
  {
    icon: Lightbulb,
    title: "Innovation for Social Good",
    desc: "Technology-driven solutions that create scalable and lasting social impact.",
    color: "#1B7A34",
  },
];

const donorPromises = [
  "Transparent project updates after every milestone",
  "Public impact reports — no hidden numbers",
  "Clear financial accountability and overhead disclosure",
  "Measurable outcomes with success metrics",
  "Full visibility into how contributions are utilised",
];

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-[72px]">
        {/* Background G-swash ornament */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-24 pointer-events-none select-none hidden lg:block">
          <GSwash width={700} height={520} color="#4DC86A" opacity={0.06} />
        </div>

        {/* Subtle background rounded-square */}
        <div className="absolute -bottom-20 -left-20 pointer-events-none select-none opacity-[0.04]">
          <RoundedSquare size={500} rotate={-15} gradient />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <GradientTag className="mb-8">Non-Profit · Government Registered</GradientTag>

            <h1 className="text-[clamp(2.8rem,6vw,5rem)] leading-[1.08] tracking-tight text-[#0D0D0D] mb-6">
              <span className="font-light">Together for a</span>
              <br />
              <span className="font-extrabold" style={{ color: "#1B7A34" }}>Better</span>
              <span className="font-extrabold text-[#0D0D0D]"> Tomorrow</span>
            </h1>

            <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg mb-10 font-normal">
              Goodness Society empowers individuals and communities through education, digital skills, and transparent accountability. Every contribution is tracked, reported, and verified.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/partner"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                Partner with Us <ArrowRight size={16} />
              </Link>
              <Link
                to="/transparency"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[#0D0D0D] bg-black/5 hover:bg-black/10 transition-colors"
              >
                See Our Impact
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 mt-10 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <CheckCircle2 size={16} className="text-[#4DC86A]" />
                Radically Transparent
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <CheckCircle2 size={16} className="text-[#4DC86A]" />
                Measurable Impact
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <CheckCircle2 size={16} className="text-[#4DC86A]" />
                Verified Outcomes
              </div>
            </div>
          </div>

          {/* Right: brand shape + image placeholder */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Big rotated rounded-square as frame */}
            <div className="relative w-[420px] h-[420px]">
              <div className="absolute inset-0" style={{ transform: "rotate(12deg)" }}>
                <RoundedSquare size={420} rotate={0} gradient opacity={0.12} />
              </div>
              {/* Smaller solid square offset */}
              <div className="absolute -bottom-6 -right-6">
                <RoundedSquare size={120} rotate={-8} color="#1565C0" opacity={0.15} />
              </div>
              {/* Placeholder image area */}
              <div
                className="absolute inset-8 rounded-[20%] overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f0faf3 0%, #e8f5e9 100%)" }}
              >
                <div className="text-center px-8 py-10">
                  <div className="w-16 h-16 rounded-[30%] mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}>
                    <Users size={28} color="white" />
                  </div>
                  <p className="text-sm text-[#6B7280] font-medium">Community photo</p>
                  <p className="text-xs text-[#6B7280]/70 mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT COUNTERS ── */}
      <ImpactCounters />

      {/* ── MISSION STRIP ── */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}>
        <div className="absolute top-0 right-0 pointer-events-none select-none opacity-10">
          <RoundedSquare size={360} rotate={20} color="#ffffff" />
        </div>
        <div className="absolute -bottom-12 -left-12 pointer-events-none select-none opacity-10">
          <RoundedSquare size={200} rotate={-10} color="#ffffff" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-5 font-semibold">Our Mission</p>
          <blockquote className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-light text-white leading-snug">
            To design and execute impactful initiatives that improve lives through{" "}
            <strong className="font-extrabold">education, workforce readiness,</strong> and{" "}
            <strong className="font-extrabold">technology adoption</strong> — with complete transparency.
          </blockquote>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">What We Do</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">Five areas of</span>
              <br />
              <span className="font-extrabold text-[#0D0D0D]">sustainable impact</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="group relative bg-white border border-black/8 rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-7 right-7 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${area.color}, transparent)` }}
                  />

                  {/* Icon in brand rounded-square */}
                  <div
                    className="w-12 h-12 rounded-[28%] flex items-center justify-center mb-5"
                    style={{ background: area.color === "#1B7A34" ? "#f0faf3" : "#e8f0fc" }}
                  >
                    <Icon size={22} color={area.color} />
                  </div>

                  <h3 className="font-bold text-[#0D0D0D] mb-2 text-base leading-snug">{area.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{area.desc}</p>

                  {/* Small decorative rounded-square */}
                  <div className="absolute -bottom-8 -right-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                    <RoundedSquare size={100} rotate={15} color={area.color} />
                  </div>
                </div>
              );
            })}

            {/* CTA card */}
            <div className="relative bg-[#0D0D0D] rounded-2xl p-7 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <GSwash width={300} height={200} color="#4DC86A" opacity={1} />
              </div>
              <div className="relative">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-4 font-semibold">Join the Mission</p>
                <p className="text-white font-light text-xl leading-snug mb-6">
                  Your involvement builds a <strong className="font-extrabold">better tomorrow</strong>
                </p>
              </div>
              <Link
                to="/programs"
                className="relative inline-flex items-center gap-2 text-sm font-semibold text-[#4DC86A] hover:text-[#6dd98a] transition-colors"
              >
                See all programs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY FEATURE ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <GradientTag className="mb-8">Our Promise</GradientTag>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-tight mb-6">
                <span className="font-extrabold text-[#0D0D0D]">Radical</span>
                <br />
                <span className="font-light text-[#0D0D0D]">Transparency</span>
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-8 max-w-md">
                We believe trust is earned through openness. Every donation, project expense, and milestone is openly documented and shared.
              </p>

              <ul className="space-y-4">
                {donorPromises.map((promise) => (
                  <li key={promise} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: "#4DC86A" }} />
                    <span className="text-sm text-[#0D0D0D]">{promise}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/transparency"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border-2 border-[#1B7A34] text-[#1B7A34] text-sm font-semibold hover:bg-[#f0faf3] transition-colors"
              >
                View Full Transparency Report <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: dashboard */}
            <TransparencyDashboard />
          </div>
        </div>
      </section>

      {/* ── PARTNER CTA ── */}
      <section className="relative py-28 bg-white overflow-hidden">
        {/* Giant "G" watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="text-[32rem] font-extrabold leading-none"
            style={{ color: "rgba(27,122,52,0.04)" }}
          >
            G
          </span>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-5 font-semibold">Get Involved</p>
          <h2 className="text-[clamp(2.2rem,5vw,4rem)] leading-tight mb-6">
            <span className="font-light text-[#0D0D0D]">Ready to create</span>
            <br />
            <span className="font-extrabold" style={{ color: "#1B7A34" }}>meaningful change?</span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you bring funding, expertise, partnerships, or volunteer support — your involvement helps build a better tomorrow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/partner"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
            >
              Partner with Us <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#0D0D0D] bg-black/5 hover:bg-black/10 transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
