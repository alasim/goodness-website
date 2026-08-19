import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Search, MapPin, ArrowRight, X, ExternalLink, Users, Globe, Zap } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import {
  volunteers, programFilters, programColors, avatarGradients,
  type Volunteer,
} from "../data/volunteers";
import { GradientTag } from "../components/brand/GradientTag";
import { GSwash } from "../components/brand/GSwash";
import { RoundedSquare } from "../components/brand/RoundedSquare";

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ v, size = 56 }: { v: Volunteer; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "28%",
        background: avatarGradients[v.avatarColor],
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: size * 0.32,
        fontWeight: 800,
        color: "white",
        letterSpacing: "-0.02em",
      }}
    >
      {v.initials}
    </div>
  );
}

// ── Program badge ─────────────────────────────────────────────────────────────
function ProgramBadge({ slug, label }: { slug: string; label: string }) {
  const c = programColors[slug] ?? programColors["education-career-readiness"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}20` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.light }} />
      {label}
    </span>
  );
}

// ── Volunteer card ────────────────────────────────────────────────────────────
function VolunteerCard({ v, onClick }: { v: Volunteer; onClick: () => void }) {
  const c = programColors[v.programSlug] ?? programColors["education-career-readiness"];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      className="group cursor-pointer bg-white border border-black/8 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${c.light}, ${c.color})` }}
      />

      {/* Decorative brand shape — subtle bg */}
      <div className="absolute -bottom-6 -right-6 pointer-events-none select-none opacity-[0.04] group-hover:opacity-[0.09] transition-opacity">
        <RoundedSquare size={90} rotate={18} color={c.color} />
      </div>

      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar v={v} size={52} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#0D0D0D] text-base leading-tight truncate">{v.name}</p>
          <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: c.color }}>{v.role}</p>
          <div className="flex items-center gap-1 mt-1 text-[#9CA3AF]">
            <MapPin size={10} />
            <span className="text-[10px]">{v.city}</span>
          </div>
        </div>
        {/* Impact stat */}
        <div className="text-right shrink-0">
          <div className="font-extrabold text-lg leading-none" style={{ color: c.color }}>{v.impactStat}</div>
          <div className="text-[9px] text-[#9CA3AF] mt-0.5 max-w-[60px] text-right leading-tight">{v.impactLabel}</div>
        </div>
      </div>

      {/* Program badge */}
      <ProgramBadge slug={v.programSlug} label={v.program.split(" ").slice(0, 3).join(" ")} />

      {/* Quote */}
      <blockquote className="mt-4 text-sm text-[#374151] italic leading-relaxed line-clamp-2 font-light flex-1">
        "{v.quote}"
      </blockquote>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
        <span className="text-[10px] text-[#9CA3AF]">Since {v.joinedMonth}</span>
        <span
          className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          style={{ color: c.color }}
        >
          View profile <ArrowRight size={11} />
        </span>
      </div>
    </motion.div>
  );
}

// ── Featured spotlight ────────────────────────────────────────────────────────
function FeaturedSpotlight({ v, onClick }: { v: Volunteer; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-3xl overflow-hidden relative mb-14 group"
      style={{ background: "#0D0D0D", minHeight: 320 }}
    >
      {/* BG shapes */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-10">
        <GSwash width={480} height={320} color="#4DC86A" opacity={1} />
      </div>
      <div className="absolute -bottom-12 -left-12 pointer-events-none opacity-[0.08]">
        <RoundedSquare size={280} rotate={-15} color="#4DC86A" />
      </div>
      <div className="absolute top-8 right-8 pointer-events-none opacity-[0.07]">
        <RoundedSquare size={120} rotate={22} color="#1565C0" />
      </div>

      <div className="relative p-8 md:p-12 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[28%] flex items-center justify-center text-white font-extrabold text-4xl"
            style={{ background: avatarGradients[v.avatarColor], fontSize: 40 }}>
            {v.initials}
          </div>
          {/* Spotlight ring */}
          <div className="absolute -inset-2 rounded-[32%] border-2 border-white/10 pointer-events-none" />
          {/* Featured label */}
          <div className="absolute -top-3 -right-3 px-2.5 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}>
            Featured
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <ProgramBadge slug={v.programSlug} label={v.program} />
            <span className="flex items-center gap-1 text-white/40 text-[10px]">
              <MapPin size={9} /> {v.city}
            </span>
          </div>
          <h2 className="text-white font-extrabold text-2xl md:text-3xl mb-1 tracking-tight">{v.name}</h2>
          <p className="font-semibold mb-4" style={{ color: programColors[v.programSlug]?.light ?? "#4DC86A" }}>{v.role}</p>
          <blockquote className="text-white/70 text-base font-light italic leading-relaxed max-w-xl">
            "{v.quote}"
          </blockquote>
        </div>

        {/* Impact + CTA */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-4 shrink-0">
          <div className="text-center md:text-right">
            <div className="font-extrabold text-4xl text-white">{v.impactStat}</div>
            <div className="text-white/40 text-xs mt-1">{v.impactLabel}</div>
          </div>
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white opacity-80 group-hover:opacity-100 transition-opacity border border-white/20 group-hover:border-white/40 whitespace-nowrap"
          >
            View profile <ExternalLink size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile modal ─────────────────────────────────────────────────────────────
function ProfileModal({ v, open, onClose }: { v: Volunteer | null; open: boolean; onClose: () => void }) {
  if (!v) return null;
  const c = programColors[v.programSlug] ?? programColors["education-career-readiness"];
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl outline-none overflow-hidden max-h-[90vh] flex flex-col">

          {/* Top band */}
          <div className="relative h-28 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${c.light} 0%, ${c.color} 100%)` }}>
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <RoundedSquare size={200} rotate={20} color="#ffffff" />
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <X size={14} color="white" />
              </button>
            </Dialog.Close>
            {/* Avatar overlapping */}
            <div className="absolute -bottom-9 left-7">
              <div className="w-20 h-20 rounded-[28%] border-4 border-white shadow-lg flex items-center justify-center font-extrabold text-white text-2xl"
                style={{ background: avatarGradients[v.avatarColor] }}>
                {v.initials}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            <div className="px-7 pt-14 pb-7">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                <div>
                  <Dialog.Title className="font-extrabold text-[#0D0D0D] text-xl leading-tight">{v.name}</Dialog.Title>
                  <p className="font-semibold text-sm mt-0.5" style={{ color: c.color }}>{v.role}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-2xl" style={{ color: c.color }}>{v.impactStat}</div>
                  <div className="text-[10px] text-[#9CA3AF]">{v.impactLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <ProgramBadge slug={v.programSlug} label={v.program} />
                <span className="flex items-center gap-1 text-[#9CA3AF] text-xs">
                  <MapPin size={10} /> {v.city}
                </span>
                <span className="text-[#9CA3AF] text-xs">Volunteering since {v.joinedMonth}</span>
              </div>

              <blockquote className="mt-5 text-[#374151] italic leading-relaxed font-light border-l-3 border-l-2 pl-4 py-1"
                style={{ borderLeftColor: c.light }}>
                "{v.quote}"
              </blockquote>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2">About</p>
                <p className="text-sm text-[#374151] leading-relaxed">{v.bio}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {v.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: c.bg, color: c.color }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-7 py-5 border-t border-black/6 flex items-center gap-3 flex-shrink-0">
            <Link
              to="/volunteer"
              state={{ program: v.program }}
              onClick={onClose}
              className="flex-1 text-center py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${c.light} 0%, ${c.color} 100%)` }}
            >
              Volunteer like {v.name.split(" ")[0]}
            </Link>
            <Dialog.Close asChild>
              <button className="px-5 py-3 rounded-full text-sm font-semibold text-[#6B7280] bg-black/5 hover:bg-black/10 transition-colors">
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Users, value: "120+", label: "Active Volunteers" },
    { icon: Globe, value: "14", label: "Cities Represented" },
    { icon: Zap, value: "5", label: "Programs Supported" },
    { icon: ArrowRight, value: "2,400+", label: "Lives Impacted" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/8 rounded-2xl overflow-hidden mb-14 border border-black/8">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="bg-white px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-[28%] flex items-center justify-center shrink-0 bg-[#f0faf3]">
            <Icon size={18} color="#1B7A34" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-[#1B7A34] leading-none">{value}</div>
            <div className="text-xs text-[#6B7280] mt-0.5">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VolunteerListing() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<Volunteer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featured = volunteers.find((v) => v.featured) ?? volunteers[0];

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesFilter = activeFilter === "all" || v.programSlug === activeFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.role.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  const openModal = (v: Volunteer) => {
    setSelected(v);
    setModalOpen(true);
  };

  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-14 pb-10 overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none select-none opacity-[0.05]">
          <GSwash width={560} height={380} color="#4DC86A" opacity={1} />
        </div>
        <div className="absolute -bottom-16 -left-16 pointer-events-none select-none opacity-[0.04]">
          <RoundedSquare size={380} rotate={-12} gradient />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <GradientTag className="mb-7">Our Volunteers</GradientTag>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-10">
            <div>
              <h1 className="text-[clamp(2.8rem,6vw,5rem)] leading-[1.02] tracking-tight">
                <span className="font-light text-[#0D0D0D]">Meet our</span>
                <br />
                <span className="font-extrabold" style={{ color: "#1B7A34" }}>Change-Makers</span>
              </h1>
            </div>
            <div>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                Every person here chose to show up. They bring their time, skills, and belief that things can be better — and together, they're proving it.
              </p>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                Get Listed Here <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <StatsBar />
        </div>
      </section>

      {/* ── LISTING ── */}
      <section className="pb-24 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 pt-12">

          {/* Featured spotlight */}
          <FeaturedSpotlight v={featured} onClick={() => openModal(featured)} />

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-[72px] z-20 py-4 bg-[#fafafa]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill or city…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-black/10 bg-white text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} className="text-[#9CA3AF] hover:text-[#0D0D0D]" />
                </button>
              )}
            </div>

            {/* Program filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-nowrap">
              {programFilters.map((f) => {
                const active = activeFilter === f.slug;
                const c = f.slug !== "all" ? programColors[f.slug] : null;
                return (
                  <button
                    key={f.slug}
                    onClick={() => setActiveFilter(f.slug)}
                    className="px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                    style={
                      active
                        ? {
                            background: c ? `linear-gradient(135deg, ${c.light} 0%, ${c.color} 100%)` : "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                            color: "white",
                          }
                        : { background: "white", color: "#6B7280", border: "1px solid rgba(0,0,0,0.08)" }
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result count */}
          <p className="text-xs text-[#9CA3AF] mb-5 font-medium">
            {filtered.length} volunteer{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "all" ? ` in ${programFilters.find((f) => f.slug === activeFilter)?.label}` : ""}
            {search ? ` matching "${search}"` : ""}
          </p>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold text-[#0D0D0D] mb-1">No volunteers found</p>
              <p className="text-sm text-[#6B7280]">Try a different search or filter.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((v) => (
                  <VolunteerCard key={v.id} v={v} onClick={() => openModal(v)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── GET LISTED CTA ── */}
      <section className="relative py-28 bg-white overflow-hidden border-t border-black/5">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[28rem] font-extrabold leading-none" style={{ color: "rgba(27,122,52,0.03)" }}>G</span>
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-[#1B7A34]">
            <div className="w-8 h-px bg-[#4DC86A]" />
            120+ change-makers and counting
            <div className="w-8 h-px bg-[#4DC86A]" />
          </div>
          <h2 className="text-[clamp(2.2rem,5vw,4rem)] leading-tight mb-5">
            <span className="font-light text-[#0D0D0D]">Your name</span>
            <br />
            <span className="font-extrabold" style={{ color: "#1B7A34" }}>belongs here.</span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-lg mx-auto mb-10 leading-relaxed">
            Join a community of professionals, students, and community leaders using their skills to create real, lasting change.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
            >
              Apply to Volunteer <ArrowRight size={16} />
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-[#0D0D0D] bg-black/5 hover:bg-black/10 transition-colors"
            >
              See Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Profile modal */}
      <ProfileModal v={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
