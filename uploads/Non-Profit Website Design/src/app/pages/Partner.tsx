import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Building2, BookOpen, Cpu, HeartHandshake, User, CheckCircle2 } from "lucide-react";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { GSwash } from "../components/brand/GSwash";

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporate Partners",
    desc: "CSR alignment, employee volunteering, and co-branded impact programs. We help companies make social investment measurable.",
    benefit: "Branded impact report + Employee engagement program",
    color: "#1B7A34",
    bg: "#f0faf3",
  },
  {
    icon: HeartHandshake,
    title: "Foundations & Grantors",
    desc: "We design programs to meet grant objectives and provide rigorous reporting aligned with your foundation's mandate.",
    benefit: "Quarterly grant reports + Independent evaluation",
    color: "#1565C0",
    bg: "#e8f0fc",
  },
  {
    icon: BookOpen,
    title: "Educational Institutions",
    desc: "Co-develop curriculum, provide internship pipelines, and collaborate on research that drives community outcomes.",
    benefit: "Co-branded curriculum + Student placement pathways",
    color: "#1B7A34",
    bg: "#f0faf3",
  },
  {
    icon: Cpu,
    title: "Technology Companies",
    desc: "Tools, platforms, and expertise from tech partners power our digital skills programs and accountability dashboards.",
    benefit: "Visibility to 2,400+ beneficiaries + Impact showcase",
    color: "#1565C0",
    bg: "#e8f0fc",
  },
  {
    icon: User,
    title: "Individual Donors",
    desc: "Your personal contribution funds scholarships, equipment, and program delivery — with full transparency on how it's used.",
    benefit: "Personal impact dashboard + Donor newsletter",
    color: "#1B7A34",
    bg: "#f0faf3",
  },
];

const steps = [
  { number: "01", title: "Submit your enquiry", desc: "Fill in the form below with your organisation and partnership interests." },
  { number: "02", title: "Discovery call", desc: "Our partnerships team will reach out within 48 hours for a 30-minute alignment call." },
  { number: "03", title: "Partnership proposal", desc: "We draft a tailored proposal with scope, reporting cadence, and expected outcomes." },
];

interface FormData {
  name: string;
  organisation: string;
  type: string;
  email: string;
  message: string;
}

export default function Partner() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Partner enquiry:", data);
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none select-none">
          <GSwash width={500} height={380} color="#4DC86A" opacity={0.05} />
        </div>
        <div className="absolute -bottom-16 -left-16 pointer-events-none select-none opacity-[0.05]">
          <RoundedSquare size={380} rotate={-12} gradient />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <GradientTag className="mb-8">Partner with Us</GradientTag>
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-tight mb-6">
              <span className="font-light text-[#0D0D0D]">Build the future</span>
              <br />
              <span className="font-extrabold text-[#0D0D0D]">with us</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
              Together, we can create meaningful, measurable, and sustainable change. Whether you bring funding, expertise, or network — your involvement matters.
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTNER TYPES ── */}
      <section className="py-20 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Who We Collaborate With</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">Five ways to</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">get involved</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerTypes.map((pt) => {
              const Icon = pt.icon;
              return (
                <div key={pt.title} className="bg-white rounded-2xl border border-black/8 p-7 hover:shadow-md transition-shadow group">
                  <div
                    className="w-12 h-12 rounded-[28%] flex items-center justify-center mb-5"
                    style={{ background: pt.bg }}
                  >
                    <Icon size={22} color={pt.color} />
                  </div>
                  <h3 className="font-bold text-[#0D0D0D] mb-2 text-base">{pt.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{pt.desc}</p>
                  <div
                    className="flex items-start gap-2 pt-4 border-t border-black/5 text-xs font-medium"
                    style={{ color: pt.color }}
                  >
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                    {pt.benefit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">The Process</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">What happens</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">next</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%-1rem)] w-8 h-0.5 bg-black/10 z-10" />
                )}
                <div className="bg-[#fafafa] rounded-2xl border border-black/8 p-7">
                  <div
                    className="w-12 h-12 rounded-[28%] flex items-center justify-center mb-5 text-white font-extrabold text-sm"
                    style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-bold text-[#0D0D0D] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="py-20 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Get in Touch</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">
              <span className="font-extrabold text-[#0D0D0D]">Send us an enquiry</span>
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-[#1B7A34]/20 p-12 text-center">
              <div
                className="w-16 h-16 rounded-[30%] flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                <CheckCircle2 size={28} color="white" />
              </div>
              <h3 className="font-bold text-[#0D0D0D] text-xl mb-2">Thank you!</h3>
              <p className="text-[#6B7280] max-w-sm mx-auto">We've received your enquiry and will be in touch within 48 hours for a discovery call.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-black/8 p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Full Name *</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">This field is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Organisation</label>
                  <input
                    {...register("organisation")}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="Organisation or company"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Email Address *</label>
                  <input
                    {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">Valid email required</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Partnership Type *</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
                  >
                    <option value="">Select a type...</option>
                    <option value="corporate">Corporate Partner</option>
                    <option value="foundation">Foundation / Grantor</option>
                    <option value="education">Educational Institution</option>
                    <option value="tech">Technology Company</option>
                    <option value="individual">Individual Donor</option>
                  </select>
                  {errors.type && <p className="text-xs text-red-500 mt-1">Please select a type</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Message *</label>
                <textarea
                  {...register("message", { required: true })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors resize-none"
                  placeholder="Tell us about your organisation and how you'd like to partner with Goodness Society..."
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">This field is required</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                Send Enquiry <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center text-[#6B7280]">
                We'll respond within 48 hours — hello@goodnesssociety.org
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
