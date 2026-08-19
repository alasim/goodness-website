import { Printer, FileText, Receipt, Award, Share2 } from "lucide-react";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { MemberForm } from "../components/printables/MemberForm";
import { MoneyReceipt } from "../components/printables/MoneyReceipt";
import { VolunteerCertificate } from "../components/printables/VolunteerCertificate";
import { VolunteerSocialCard, MemberSocialCard } from "../components/printables/SocialCards";
import { printElement } from "../utils/usePrint";

// ── Printable document sections ────────────────────────────────────────────────
const printDocs = [
  {
    id: "print-member-form",
    icon: FileText,
    title: "Member Registration Form",
    description: "Official A4 form for registering new members. Includes personal info, professional background, and declaration.",
    format: "A4 Portrait",
    tip: "Print on standard A4 paper. Ideal for events and onboarding sessions.",
    landscape: false,
  },
  {
    id: "print-money-receipt",
    icon: Receipt,
    title: "Official Money Receipt",
    description: "Two-part receipt (original + duplicate) for cash donations and payments. Includes bank details.",
    format: "A4 Portrait · 2 copies per sheet",
    tip: "Cut along the dashed line. Give original to donor, keep duplicate.",
    landscape: false,
  },
  {
    id: "print-volunteer-cert",
    icon: Award,
    title: "Volunteer Certificate",
    description: "Landscape certificate of volunteer service with official seal, signature lines, and full brand treatment.",
    format: "A4 Landscape",
    tip: "Print on heavier paper (120gsm+) for best results.",
    landscape: true,
  },
];

// ── Social card sections ───────────────────────────────────────────────────────
const socialSections = [
  {
    id: "volunteer-card",
    icon: Award,
    title: "Volunteer Social Card",
    description: "A shareable card celebrating your role as a Goodness Society volunteer — perfect for LinkedIn and Instagram.",
    tip: "Fill in your details and photo, then download as a high-resolution PNG.",
  },
  {
    id: "member-card",
    icon: Share2,
    title: "Member Social Card",
    description: "Show your Goodness Society membership with pride. Share your role and what the mission means to you.",
    tip: "Customise your name, role, and personal message, then share with your network.",
  },
];

function PrintDocSection({ doc, children }: {
  doc: typeof printDocs[number];
  children: React.ReactNode;
}) {
  const Icon = doc.icon;
  // Scale so the paper preview fits nicely in the container
  // Portrait: 210mm wide → show at ~560px → scale = 560/794 ≈ 0.70
  // Landscape: 297mm wide → show at ~780px → scale = 780/1122 ≈ 0.70
  const previewScale = 0.68;
  // Natural px size of the document before scaling
  const naturalW = doc.landscape ? 1122 : 794;
  const naturalH = doc.landscape ? 794 : 1122;
  // Visible (scaled) size
  const visW = Math.round(naturalW * previewScale);
  const visH = Math.round(naturalH * previewScale);

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-7">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[28%] flex items-center justify-center shrink-0 bg-[#f0faf3]">
            <Icon size={22} color="#1B7A34" />
          </div>
          <div>
            <h2 className="font-bold text-[#0D0D0D] text-xl mb-1">{doc.title}</h2>
            <p className="text-sm text-[#6B7280] max-w-xl leading-relaxed">{doc.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-[#f0faf3] text-[#1B7A34] text-xs font-semibold border border-[#1B7A34]/15">
                {doc.format}
              </span>
              <span className="text-xs text-[#6B7280]">💡 {doc.tip}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => printElement(doc.id, doc.title)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold shrink-0 transition-opacity hover:opacity-90 self-start"
          style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
        >
          <Printer size={15} /> Print document
        </button>
      </div>

      {/* Paper preview on desk surface */}
      <div
        className="rounded-2xl p-8 flex justify-center overflow-auto"
        style={{ background: "#dde0e5", minHeight: visH + 64 }}
      >
        {/* Outer wrapper: reserves exactly the scaled size so the container sizes correctly */}
        <div style={{ width: visW, height: visH, flexShrink: 0, position: "relative" }}>
          {/* Shadow layer */}
          <div style={{
            position: "absolute", inset: 0,
            boxShadow: "0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)",
            borderRadius: 3,
            pointerEvents: "none",
          }} />
          {/* Scale container — transform-origin top-left so it fills from top-left */}
          <div
            id={doc.id}
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
              width: naturalW,
              height: naturalH,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialSection({ section, children }: {
  section: typeof socialSections[number];
  children: React.ReactNode;
}) {
  const Icon = section.icon;
  return (
    <div className="mb-20">
      <div className="flex items-start gap-4 mb-7">
        <div className="w-12 h-12 rounded-[28%] flex items-center justify-center shrink-0 bg-[#f0faf3]">
          <Icon size={22} color="#1B7A34" />
        </div>
        <div>
          <h2 className="font-bold text-[#0D0D0D] text-xl mb-1">{section.title}</h2>
          <p className="text-sm text-[#6B7280] max-w-xl leading-relaxed">{section.description}</p>
          <p className="text-xs text-[#6B7280] mt-2">💡 {section.tip}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Printables() {
  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-14 pb-16 overflow-hidden">
        <div className="absolute -top-10 -right-10 pointer-events-none select-none opacity-[0.05]">
          <RoundedSquare size={360} rotate={22} gradient />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <GradientTag className="mb-7">Printable & Shareable Assets</GradientTag>
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-tight mb-5">
              <span className="font-light text-[#0D0D0D]">Branded</span>
              <br />
              <span className="font-extrabold text-[#0D0D0D]">print & share</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Official Goodness Society print documents and social share cards. Print forms and certificates, or personalise your member and volunteer cards to share your journey.
            </p>
          </div>

          {/* Quick-jump pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { href: "#print-docs", icon: Printer, label: "Print Documents" },
              { href: "#social-cards", icon: Share2, label: "Social Cards" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 text-sm font-medium text-[#0D0D0D] hover:border-[#1B7A34] hover:text-[#1B7A34] transition-colors"
              >
                <item.icon size={13} /> {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINT DOCUMENTS ── */}
      <section id="print-docs" className="py-12 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-2 font-semibold">Section 1</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">Print</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">documents</span>
            </h2>
          </div>

          <PrintDocSection doc={printDocs[0]}>
            <MemberForm />
          </PrintDocSection>

          <PrintDocSection doc={printDocs[1]}>
            <MoneyReceipt />
          </PrintDocSection>

          <PrintDocSection doc={printDocs[2]}>
            <VolunteerCertificate />
          </PrintDocSection>
        </div>
      </section>

      {/* ── SOCIAL CARDS ── */}
      <section id="social-cards" className="py-12 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-2 font-semibold">Section 2</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              <span className="font-light text-[#0D0D0D]">Social</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">share cards</span>
            </h2>
            <p className="text-[#6B7280] max-w-xl">
              Personalise your card with your name, photo, and role — then download as a high-res PNG ready to share on LinkedIn, Instagram, or WhatsApp.
            </p>
          </div>

          <SocialSection section={socialSections[0]}>
            <VolunteerSocialCard />
          </SocialSection>

          <div className="border-t border-black/5 my-12" />

          <SocialSection section={socialSections[1]}>
            <MemberSocialCard />
          </SocialSection>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="py-16 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-[28%] flex items-center justify-center mx-auto mb-5 bg-[#f0faf3]">
            <Printer size={22} color="#1B7A34" />
          </div>
          <h2 className="font-bold text-[#0D0D0D] text-xl mb-6">Printing tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {[
              { title: "Colour printing", desc: "Enable 'Print background colours and images' in your browser's print settings for full brand fidelity." },
              { title: "Paper size", desc: "Set paper to A4. The certificate should use landscape orientation — most browsers detect this automatically." },
              { title: "Scale & margins", desc: "Set scale to 100% and margins to 'None' or 'Minimum' for best results." },
            ].map((tip) => (
              <div key={tip.title} className="bg-white border border-black/8 rounded-xl p-5">
                <p className="font-semibold text-[#0D0D0D] text-sm mb-1">{tip.title}</p>
                <p className="text-xs text-[#6B7280] leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
