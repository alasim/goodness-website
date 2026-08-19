import { useState } from "react";
import { ChevronDown, ArrowRight, Target, CheckCircle2 } from "lucide-react";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { Link } from "react-router";
import { programs } from "../data/programs";

export default function Programs() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="absolute -top-10 -right-10 pointer-events-none select-none opacity-[0.05]">
          <RoundedSquare size={400} rotate={25} gradient />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <GradientTag className="mb-8">Our Programs</GradientTag>
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-tight mb-6">
              <span className="font-light text-[#0D0D0D]">Five pathways to</span>
              <br />
              <span className="font-extrabold text-[#0D0D0D]">lasting change</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Every program is designed with measurable goals, community input, and public accountability. We build for outcomes — not outputs.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROGRAM CARDS ── */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-5">
          {programs.map((program) => {
            const Icon = program.icon;
            const isOpen = expanded === program.title;
            return (
              <div
                key={program.title}
                className="border border-black/8 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                {/* Header row — click to expand */}
                <button
                  className="w-full text-left p-8 flex items-start gap-6"
                  onClick={() => setExpanded(isOpen ? null : program.title)}
                >
                  <div
                    className="w-12 h-12 rounded-[28%] flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: program.bg }}
                  >
                    <Icon size={22} color={program.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2 className="font-bold text-[#0D0D0D] text-lg">{program.title}</h2>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: program.status === "Active" ? "#f0faf3" : "#fff3e0",
                          color: program.status === "Active" ? "#1B7A34" : "#E65100",
                        }}
                      >
                        {program.status}
                      </span>
                    </div>
                    <p className="text-[#6B7280] text-sm">{program.tagline}</p>
                  </div>

                  {/* Metrics preview */}
                  <div className="hidden md:flex items-center gap-8 shrink-0 mr-4">
                    <div className="text-center">
                      <div className="font-extrabold" style={{ color: program.color }}>{program.metrics.participants}</div>
                      <div className="text-xs text-[#6B7280]">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="font-extrabold" style={{ color: program.color }}>{program.metrics.partners}</div>
                      <div className="text-xs text-[#6B7280]">Partners</div>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className="shrink-0 mt-1 transition-transform duration-300 text-[#6B7280]"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-8 pb-8 pt-0 border-t border-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                      <div>
                        <p className="text-[#6B7280] leading-relaxed mb-6">{program.desc}</p>
                        <div className="flex md:hidden items-center gap-8 mb-6">
                          <div>
                            <div className="font-extrabold text-xl" style={{ color: program.color }}>{program.metrics.participants}</div>
                            <div className="text-xs text-[#6B7280]">Participants</div>
                          </div>
                          <div>
                            <div className="font-extrabold text-xl" style={{ color: program.color }}>{program.metrics.partners}</div>
                            <div className="text-xs text-[#6B7280]">Partners</div>
                          </div>
                        </div>
                        <Link
                          to={`/programs/${program.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                          style={{ color: program.color }}
                        >
                          View full program details <ArrowRight size={14} />
                        </Link>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Target size={14} color={program.color} />
                          <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7280]">Program Goals</p>
                        </div>
                        <ul className="space-y-3">
                          {program.goals.map((goal) => (
                            <li key={goal} className="flex items-start gap-2.5">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: program.color }} />
                              <span className="text-sm text-[#0D0D0D]">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight mb-4">
            <span className="font-light text-[#0D0D0D]">Support a program that</span>
            <br />
            <span className="font-extrabold" style={{ color: "#1B7A34" }}>changes lives</span>
          </h2>
          <p className="text-[#6B7280] mb-8 max-w-md mx-auto">Partner with us to fund, sponsor, or co-design a program initiative.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/partner"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
            >
              Partner with Us <ArrowRight size={16} />
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[#0D0D0D] bg-black/5 hover:bg-black/10 transition-colors"
            >
              Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
