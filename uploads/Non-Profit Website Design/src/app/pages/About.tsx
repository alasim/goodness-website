import { RoundedSquare } from "../components/brand/RoundedSquare";
import { GSwash } from "../components/brand/GSwash";
import { GradientTag } from "../components/brand/GradientTag";
import { Eye, Target, Zap, BarChart3, TrendingUp, Cpu } from "lucide-react";

const differentiators = [
  {
    icon: Eye,
    title: "Radical Transparency",
    desc: "Every donation, project expense, milestone, and impact report is openly documented and shared with our donors and community.",
    color: "#1B7A34",
  },
  {
    icon: BarChart3,
    title: "Measurable Impact",
    desc: "We focus on outcomes, not activities. Every initiative has clear goals, success metrics, and public reporting built in.",
    color: "#1565C0",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Change",
    desc: "Rather than temporary assistance, we invest in programs that create long-term opportunities and self-sufficiency.",
    color: "#1B7A34",
  },
  {
    icon: Cpu,
    title: "Technology-Driven Accountability",
    desc: "We leverage digital tools, dashboards, and public reporting systems to ensure every contribution can be tracked and verified.",
    color: "#1565C0",
  },
];

const team = [
  { name: "Amina Hassan", role: "Executive Director", initials: "AH" },
  { name: "Chukwuemeka Obi", role: "Programs Lead", initials: "CO" },
  { name: "Fatima Aliyu", role: "Digital Skills Director", initials: "FA" },
  { name: "Tunde Adeyemi", role: "Partnerships Manager", initials: "TA" },
];

export default function About() {
  return (
    <div className="pt-[72px]">
      {/* ── PAGE HERO ── */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none select-none">
          <GSwash width={500} height={380} color="#4DC86A" opacity={0.05} />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <GradientTag className="mb-8">About Us</GradientTag>
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-tight mb-6">
              <span className="font-light text-[#0D0D0D]">Who we</span>
              <br />
              <span className="font-extrabold text-[#0D0D0D]">are</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
              Goodness Society is a government-registered, non-profit organisation dedicated to creating sustainable social impact through education, skills development, technology, and community empowerment.
            </p>
          </div>

          {/* Decorative brand shape cluster */}
          <div className="relative hidden lg:flex items-center justify-center h-64">
            <div className="absolute top-0 left-16">
              <RoundedSquare size={140} rotate={12} gradient opacity={0.18} />
            </div>
            <div className="absolute bottom-0 right-10">
              <RoundedSquare size={100} rotate={-20} color="#1565C0" opacity={0.12} />
            </div>
            <div className="absolute top-10 right-4">
              <RoundedSquare size={60} rotate={35} color="#4DC86A" opacity={0.2} />
            </div>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="py-16 bg-[#fafafa] border-y border-black/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[clamp(1.4rem,3vw,2.2rem)] font-light text-[#0D0D0D] leading-relaxed">
            We believe that{" "}
            <strong className="font-extrabold" style={{ color: "#1B7A34" }}>
              meaningful change happens
            </strong>{" "}
            when good intentions are combined with{" "}
            <strong className="font-extrabold text-[#0D0D0D]">
              transparency, accountability, and measurable results.
            </strong>
          </p>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="relative bg-[#0D0D0D] rounded-2xl p-10 overflow-hidden">
              <div className="absolute -top-8 -right-8 pointer-events-none select-none opacity-10">
                <RoundedSquare size={200} rotate={20} color="#4DC86A" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-[35%] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}>
                    <Eye size={16} color="white" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Our Vision</p>
                </div>
                <p className="text-white font-light text-xl leading-relaxed">
                  To create a society where every individual has access to{" "}
                  <strong className="font-extrabold">opportunities that enable them to thrive,</strong>{" "}
                  contribute, and succeed in an evolving world.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="relative border-2 border-[#1B7A34]/15 rounded-2xl p-10 overflow-hidden bg-white">
              <div className="absolute -bottom-8 -left-8 pointer-events-none select-none opacity-5">
                <RoundedSquare size={200} rotate={-10} gradient />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-[35%] flex items-center justify-center bg-[#f0faf3]">
                    <Target size={16} color="#1B7A34" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-[#6B7280] font-semibold">Our Mission</p>
                </div>
                <p className="text-[#0D0D0D] font-light text-xl leading-relaxed">
                  To design and execute impactful initiatives that improve lives through{" "}
                  <strong className="font-extrabold">education, workforce readiness, technology adoption,</strong>{" "}
                  and community development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Our Edge</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">What makes</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">us different</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {differentiators.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="bg-white rounded-2xl border border-black/8 p-8 hover:shadow-md transition-shadow">
                  <div
                    className="w-12 h-12 rounded-[28%] flex items-center justify-center mb-5"
                    style={{ background: d.color === "#1B7A34" ? "#f0faf3" : "#e8f0fc" }}
                  >
                    <Icon size={22} color={d.color} />
                  </div>
                  <h3 className="font-bold text-[#0D0D0D] mb-2 text-lg">{d.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed text-sm">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">The People</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-tight">
              <span className="font-extrabold text-[#0D0D0D]">Our team</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={member.name} className="text-center group">
                <div className="relative mx-auto w-20 h-20 mb-4">
                  {/* Avatar using rounded-square shape */}
                  <div
                    className="w-20 h-20 rounded-[30%] flex items-center justify-center mx-auto text-white font-bold text-lg"
                    style={{
                      background: i % 2 === 0
                        ? "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)"
                        : "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                    }}
                  >
                    {member.initials}
                  </div>
                </div>
                <p className="font-bold text-[#0D0D0D] text-sm">{member.name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#6B7280] mt-8">Photos & full bios coming soon.</p>
        </div>
      </section>
    </div>
  );
}
