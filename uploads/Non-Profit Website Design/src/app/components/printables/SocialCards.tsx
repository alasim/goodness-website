import { useRef, useState } from "react";
import { Upload, Download, User } from "lucide-react";
import gsLogo from "../../../imports/gs-logo.png";
import { programs } from "../../data/programs";

// ── shared download util ──────────────────────────────────────────────────────
async function downloadCard(elementId: string, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── Avatar with upload ────────────────────────────────────────────────────────
function AvatarUpload({
  src, onUpload, size = 80, rounded = "30%",
}: {
  src: string | null;
  onUpload: (url: string) => void;
  size?: number;
  rounded?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div
        onClick={() => ref.current?.click()}
        className="cursor-pointer group relative overflow-hidden flex items-center justify-center"
        style={{ width: size, height: size, borderRadius: rounded, flexShrink: 0 }}
      >
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#f0faf3] border-2 border-dashed border-[#4DC86A]/40">
            <Upload size={size > 60 ? 20 : 14} className="text-[#4DC86A]" />
            <span className="text-[10px] text-[#6B7280] mt-1 text-center leading-tight px-1">Upload photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload size={16} color="white" />
        </div>
      </div>
    </>
  );
}

// ── field util ────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, as: As = "input" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; as?: "input" | "select"; children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide">{label}</label>
      {As === "input" ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
        />
      ) : null}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VOLUNTEER SOCIAL CARD
// ══════════════════════════════════════════════════════════════════════════════

export function VolunteerSocialCard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [program, setProgram] = useState("");
  const [quote, setQuote] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCard("volunteer-social-card", `gs-volunteer-${(name || "card").replace(/\s+/g, "-").toLowerCase()}.png`);
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      {/* ── Card preview ── */}
      <div className="flex flex-col items-center gap-4">
        <div
          id="volunteer-social-card"
          style={{
            width: 540,
            height: 540,
            background: "#0D0D0D",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            flexShrink: 0,
          }}
        >
          {/* Background brand shapes */}
          <svg style={{ position: "absolute", top: -24, right: -24, opacity: 0.12 }} width="200" height="200" viewBox="0 0 200 200">
            <rect x="20" y="20" width="160" height="160" rx="36" fill="none" stroke="#4DC86A" strokeWidth="3" transform="rotate(18 100 100)" />
            <rect x="44" y="44" width="112" height="112" rx="24" fill="#4DC86A" transform="rotate(32 100 100)" />
          </svg>
          <svg style={{ position: "absolute", bottom: -20, left: -20, opacity: 0.08 }} width="160" height="160" viewBox="0 0 160 160">
            <rect x="10" y="10" width="140" height="140" rx="32" fill="none" stroke="#1565C0" strokeWidth="3" transform="rotate(-14 80 80)" />
            <rect x="28" y="28" width="104" height="104" rx="22" fill="#1565C0" transform="rotate(-28 80 80)" />
          </svg>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
            <img src={gsLogo} alt="Goodness Society" style={{ height: 28, width: "auto", filter: "brightness(10)" }} />
            <div style={{
              padding: "4px 12px", borderRadius: 20,
              background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
              fontSize: 9.5, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Volunteer
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 24px" }}>
            {/* Photo + name cluster */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
              {/* Photo */}
              <div style={{
                width: 90, height: 90, borderRadius: "28%", overflow: "hidden", flexShrink: 0,
                border: "3px solid rgba(77,200,106,0.5)",
                background: "#1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {photo
                  ? <img src={photo} alt="volunteer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <User size={32} color="rgba(255,255,255,0.2)" />
                }
              </div>

              {/* Name & role */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 4, letterSpacing: "-0.02em" }}>
                  {name || "Your Name"}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#4DC86A", marginBottom: 3 }}>
                  {role || "Volunteer Role"}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.07)", borderRadius: 8,
                  padding: "3px 8px",
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4DC86A" }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    {program || "Program Area"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote / message */}
            {(quote || true) && (
              <div style={{
                background: "rgba(255,255,255,0.06)",
                borderLeft: "3px solid #4DC86A",
                borderRadius: "0 10px 10px 0",
                padding: "10px 14px",
                marginBottom: 18,
              }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontStyle: "italic", fontWeight: 300 }}>
                  "{quote || "Volunteering with Goodness Society has been a life-changing experience."}"
                </p>
              </div>
            )}

            {/* Bottom tagline */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Together for a Better Tomorrow
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 1 }}>goodnesssociety.org</div>
              </div>
              {/* Mini GS mark */}
              <div style={{
                width: 32, height: 32, borderRadius: "28%",
                background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>G</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
        >
          <Download size={15} />
          {downloading ? "Generating…" : "Download Card (PNG)"}
        </button>
      </div>

      {/* ── Form ── */}
      <div className="space-y-5 bg-[#fafafa] rounded-2xl border border-black/8 p-7">
        <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7280] mb-1">Fill in your details</p>

        {/* Photo upload */}
        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">Your Photo</label>
          <AvatarUpload src={photo} onUpload={setPhoto} size={72} rounded="28%" />
        </div>

        <Field label="Full Name" value={name} onChange={setName} placeholder="e.g. Amina Hassan" />
        <Field label="Volunteer Role / Title" value={role} onChange={setRole} placeholder="e.g. AI Skills Trainer" />

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide">Program Area</label>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
          >
            <option value="">Select a program…</option>
            {programs.map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide">Personal Quote (optional)</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            maxLength={120}
            placeholder="Share what volunteering means to you…"
            className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors resize-none"
          />
          <p className="text-xs text-[#9CA3AF] mt-1 text-right">{quote.length}/120</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MEMBER SOCIAL CARD
// ══════════════════════════════════════════════════════════════════════════════

const memberRoles = [
  "General Member",
  "Community Champion",
  "Youth Ambassador",
  "Education Advocate",
  "Digital Skills Fellow",
  "Innovation Fellow",
  "Community Leader",
  "Strategic Partner",
];

export function MemberSocialCard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [tagline, setTagline] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCard("member-social-card", `gs-member-${(name || "card").replace(/\s+/g, "-").toLowerCase()}.png`);
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      {/* ── Card preview ── */}
      <div className="flex flex-col items-center gap-4">
        <div
          id="member-social-card"
          style={{
            width: 540,
            height: 540,
            background: "white",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            border: "1.5px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          {/* Top gradient band */}
          <div style={{
            height: 180,
            background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            {/* Decorative shapes in gradient */}
            <svg style={{ position: "absolute", top: -20, right: -20, opacity: 0.15 }} width="160" height="160" viewBox="0 0 160 160">
              <rect x="10" y="10" width="140" height="140" rx="32" fill="white" transform="rotate(16 80 80)" />
            </svg>
            <svg style={{ position: "absolute", bottom: -30, left: 20, opacity: 0.1 }} width="120" height="120" viewBox="0 0 120 120">
              <rect x="10" y="10" width="100" height="100" rx="22" fill="white" transform="rotate(-12 60 60)" />
            </svg>

            {/* Logo in top-left */}
            <div style={{ position: "absolute", top: 18, left: 22 }}>
              <img src={gsLogo} alt="Goodness Society" style={{ height: 26, width: "auto", filter: "brightness(10)" }} />
            </div>

            {/* Member badge top-right */}
            <div style={{
              position: "absolute", top: 18, right: 22,
              background: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              padding: "3px 10px", borderRadius: 16,
              fontSize: 9, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Member
            </div>

            {/* Photo — overlapping the gradient bottom edge */}
            <div style={{
              position: "absolute",
              bottom: -44,
              left: "50%",
              transform: "translateX(-50%)",
              width: 88,
              height: 88,
              borderRadius: "28%",
              overflow: "hidden",
              border: "4px solid white",
              background: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}>
              {photo
                ? <img src={photo} alt="member" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <User size={34} color="#4DC86A" />
              }
            </div>
          </div>

          {/* White body */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 28px 22px" }}>

            {/* Name */}
            <div style={{ fontSize: 24, fontWeight: 800, color: "#0D0D0D", textAlign: "center", lineHeight: 1.1, marginBottom: 6, letterSpacing: "-0.02em" }}>
              {name || "Your Name"}
            </div>

            {/* Role pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f0faf3",
              border: "1.5px solid rgba(27,122,52,0.2)",
              padding: "5px 14px", borderRadius: 20,
              fontSize: 11, fontWeight: 600, color: "#1B7A34",
              marginBottom: city ? 6 : 16,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4DC86A" }} />
              {role || "Member Role"}
            </div>

            {city && (
              <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 16 }}>📍 {city}</div>
            )}

            {/* Divider */}
            <div style={{ width: 40, height: 2, background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)", borderRadius: 1, marginBottom: 14 }} />

            {/* Tagline or default */}
            <p style={{ fontSize: 11.5, color: "#6B7280", textAlign: "center", lineHeight: 1.6, maxWidth: 340, fontStyle: "italic", fontWeight: 300, marginBottom: "auto" }}>
              "{tagline || "Proud member of Goodness Society — building a better tomorrow, together."}"
            </p>

            {/* Bottom bar */}
            <div style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div>
                <div style={{ fontSize: 8.5, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Together for a Better Tomorrow</div>
                <div style={{ fontSize: 8.5, color: "#C4C4C4", marginTop: 1 }}>goodnesssociety.org</div>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: "28%",
                background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>G</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
        >
          <Download size={15} />
          {downloading ? "Generating…" : "Download Card (PNG)"}
        </button>
      </div>

      {/* ── Form ── */}
      <div className="space-y-5 bg-[#fafafa] rounded-2xl border border-black/8 p-7">
        <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7280] mb-1">Fill in your details</p>

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">Your Photo</label>
          <AvatarUpload src={photo} onUpload={setPhoto} size={72} rounded="28%" />
        </div>

        <Field label="Full Name" value={name} onChange={setName} placeholder="e.g. Chukwuemeka Obi" />

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide">Member Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
          >
            <option value="">Select a role…</option>
            {memberRoles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <Field label="City / Location (optional)" value={city} onChange={setCity} placeholder="e.g. Lagos, Nigeria" />

        <div>
          <label className="block text-xs font-semibold text-[#6B7280] mb-1.5 uppercase tracking-wide">Personal Tagline (optional)</label>
          <textarea
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            rows={3}
            maxLength={120}
            placeholder="What does being part of Goodness Society mean to you?"
            className="w-full px-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors resize-none"
          />
          <p className="text-xs text-[#9CA3AF] mt-1 text-right">{tagline.length}/120</p>
        </div>
      </div>
    </div>
  );
}
