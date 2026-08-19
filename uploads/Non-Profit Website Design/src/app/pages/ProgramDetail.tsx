import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Target, Users, BarChart3 } from "lucide-react";
import { getProgramBySlug, programs } from "../data/programs";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { GSwash } from "../components/brand/GSwash";

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const program = getProgramBySlug(slug ?? "");

  if (!program) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl font-extrabold text-black/10 mb-4">404</p>
          <p className="text-[#6B7280] mb-6">Program not found.</p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
          >
            <ArrowLeft size={15} /> Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const Icon = program.icon;
  const otherPrograms = programs.filter((p) => p.slug !== program.slug).slice(0, 3);

  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-10 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none select-none">
          <GSwash width={480} height={340} color={program.color} opacity={0.05} />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-8">
            <Link to="/programs" className="hover:text-[#0D0D0D] transition-colors flex items-center gap-1.5">
              <ArrowLeft size={14} /> Programs
            </Link>
            <span>/</span>
            <span className="text-[#0D0D0D]">{program.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: program.status === "Active" ? "#f0faf3" : "#fff3e0",
                    color: program.status === "Active" ? "#1B7A34" : "#E65100",
                  }}
                >
                  {program.status}
                </span>
                <GradientTag>{program.tagline}</GradientTag>
              </div>

              <h1 className="text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] tracking-tight mb-6">
                <span className="font-extrabold text-[#0D0D0D]">{program.title.split(" ").slice(0, 2).join(" ")}</span>
                <br />
                <span className="font-light text-[#0D0D0D]">{program.title.split(" ").slice(2).join(" ")}</span>
              </h1>

              <p className="text-lg text-[#6B7280] leading-relaxed">{program.longDesc}</p>
            </div>

            {/* Stats card */}
            <div className="relative">
              <div className="absolute -top-8 -right-8 pointer-events-none select-none opacity-10">
                <RoundedSquare size={220} rotate={18} color={program.color} />
              </div>
              <div className="relative bg-white border border-black/8 rounded-2xl p-8 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-6 font-semibold">Program at a Glance</p>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Participants", value: program.metrics.participants, icon: Users },
                    { label: "Partners", value: String(program.metrics.partners), icon: BarChart3 },
                    { label: "Placements", value: program.metrics.placements, icon: Target },
                  ].map((m) => {
                    const MIcon = m.icon;
                    return (
                      <div key={m.label} className="text-center">
                        <div
                          className="w-10 h-10 rounded-[28%] flex items-center justify-center mx-auto mb-2"
                          style={{ background: program.bg }}
                        >
                          <MIcon size={18} color={program.color} />
                        </div>
                        <div className="font-extrabold text-xl" style={{ color: program.color }}>{m.value}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5">{m.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/volunteer"
                    state={{ program: program.title }}
                    className="flex-1 text-center py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${program.color === "#1B7A34" ? "#4DC86A 0%, #1B7A34" : "#1976D2 0%, #1565C0"} 100%)` }}
                  >
                    Volunteer Here
                  </Link>
                  <Link
                    to="/partner"
                    className="flex-1 text-center py-3 rounded-full text-sm font-semibold border-2 transition-colors hover:bg-black/5"
                    style={{ borderColor: program.color, color: program.color }}
                  >
                    Partner with Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOALS ── */}
      <section className="py-16 bg-[#fafafa] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-8 h-8 rounded-[30%] flex items-center justify-center"
              style={{ background: program.bg }}
            >
              <Target size={16} color={program.color} />
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7280]">Program Goals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {program.goals.map((goal) => (
              <div key={goal} className="flex items-start gap-3 bg-white rounded-xl border border-black/8 p-5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: program.color }} />
                <span className="text-sm text-[#0D0D0D] font-medium">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">What We Do</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-10">
            <span className="font-light text-[#0D0D0D]">Program</span>{" "}
            <span className="font-extrabold text-[#0D0D0D]">activities</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {program.activities.map((activity, i) => (
              <div key={activity.title} className="bg-white border border-black/8 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-[28%] flex items-center justify-center mb-4 text-white font-extrabold text-sm"
                  style={{ background: program.color === "#1B7A34"
                    ? `linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)`
                    : `linear-gradient(135deg, #1976D2 0%, #1565C0 100%)` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-[#0D0D0D] mb-2 text-sm">{activity.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{activity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOLUNTEER ROLES ── */}
      <section className="py-16 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Get Involved</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-4">
                <span className="font-extrabold text-[#0D0D0D]">Volunteer roles</span>
                <br />
                <span className="font-light text-[#0D0D0D]">in this program</span>
              </h2>
              <p className="text-[#6B7280] mb-6 leading-relaxed">
                We're looking for skilled volunteers to support this program. Your time and expertise make a direct difference to the people we serve.
              </p>
              <Link
                to="/volunteer"
                state={{ program: program.title }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                Apply to Volunteer <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.volunteerRoles.map((role) => (
                <div key={role} className="flex items-center gap-3 bg-white rounded-xl border border-black/8 px-4 py-3.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: program.color === "#1B7A34" ? "#4DC86A" : "#1976D2" }}
                  />
                  <span className="text-sm font-medium text-[#0D0D0D]">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OTHER PROGRAMS ── */}
      <section className="py-20 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Explore More</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-8 font-extrabold text-[#0D0D0D]">Other programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherPrograms.map((p) => {
              const PIcon = p.icon;
              return (
                <Link
                  key={p.slug}
                  to={`/programs/${p.slug}`}
                  className="group bg-white border border-black/8 rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div
                    className="w-10 h-10 rounded-[28%] flex items-center justify-center mb-4"
                    style={{ background: p.bg }}
                  >
                    <PIcon size={18} color={p.color} />
                  </div>
                  <h3 className="font-bold text-[#0D0D0D] mb-1 text-sm">{p.title}</h3>
                  <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">{p.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2" style={{ color: p.color }}>
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
