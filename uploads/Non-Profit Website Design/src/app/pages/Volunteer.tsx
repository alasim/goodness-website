import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import {
  ArrowRight, CheckCircle2, Clock, MapPin, Heart,
  BookOpen, Cpu, Users, Globe, Lightbulb, Handshake
} from "lucide-react";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";
import { GSwash } from "../components/brand/GSwash";
import { programs } from "../data/programs";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  program: string;
  role: string;
  availability: string;
  experience: string;
  motivation: string;
  skills: string;
}

const availabilityOptions = [
  "Weekdays (daytime)",
  "Weekday evenings",
  "Weekends only",
  "Flexible / As needed",
  "Full-time commitment (3+ months)",
];

const benefits = [
  { icon: Heart, title: "Make Real Impact", desc: "Your skills directly support people building better futures for themselves." },
  { icon: Handshake, title: "Grow Your Network", desc: "Connect with professionals, community leaders, and change-makers across sectors." },
  { icon: BookOpen, title: "Develop Skills", desc: "Gain facilitation, project management, and social impact experience." },
  { icon: CheckCircle2, title: "Verified Reference", desc: "Receive an official volunteer reference letter from Goodness Society." },
];

const steps = [
  { num: "01", title: "Submit application", desc: "Fill in the form below with your background and area of interest." },
  { num: "02", title: "Screening call", desc: "A 20-minute call with our volunteer coordinator to align on fit and expectations." },
  { num: "03", title: "Onboarding session", desc: "Join a virtual or in-person orientation to meet the team and understand your role." },
  { num: "04", title: "Start volunteering", desc: "Begin contributing — your impact starts from day one." },
];

export default function Volunteer() {
  const location = useLocation();
  const preselectedProgram = (location.state as any)?.program ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(preselectedProgram);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { program: preselectedProgram },
  });

  const watchedProgram = watch("program");
  const availableRoles = programs.find((p) => p.title === (watchedProgram || selectedProgram))?.volunteerRoles ?? [];

  const onSubmit = (data: FormData) => {
    console.log("Volunteer application:", data);
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none select-none">
          <GSwash width={500} height={360} color="#4DC86A" opacity={0.05} />
        </div>
        <div className="absolute -bottom-16 -left-16 pointer-events-none select-none opacity-[0.04]">
          <RoundedSquare size={360} rotate={-15} gradient />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <GradientTag className="mb-8">Volunteer with Us</GradientTag>
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-tight mb-6">
              <span className="font-light text-[#0D0D0D]">Give your time.</span>
              <br />
              <span className="font-extrabold" style={{ color: "#1B7A34" }}>Change a life.</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
              Whether you're a professional, student, or community member — your skills and time can drive real change for the people in our programs.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: "120+", label: "Active Volunteers" },
              { value: "5", label: "Programs to Support" },
              { value: "4hrs", label: "Avg. Weekly Commitment" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold" style={{ color: "#1B7A34" }}>{s.value}</div>
                <div className="text-sm text-[#6B7280]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY VOLUNTEER ── */}
      <section className="py-16 bg-[#fafafa] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Why Volunteers Love Us</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight mb-10">
            <span className="font-extrabold text-[#0D0D0D]">What you gain</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => {
              const BIcon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-2xl border border-black/8 p-6">
                  <div className="w-11 h-11 rounded-[28%] flex items-center justify-center mb-4 bg-[#f0faf3]">
                    <BIcon size={20} color="#1B7A34" />
                  </div>
                  <h3 className="font-bold text-[#0D0D0D] mb-1 text-sm">{b.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES BY PROGRAM ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Open Roles</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight mb-10">
            <span className="font-light text-[#0D0D0D]">Find your</span>{" "}
            <span className="font-extrabold text-[#0D0D0D]">place</span>
          </h2>

          <div className="space-y-5">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <div key={program.slug} className="bg-white border border-black/8 rounded-2xl p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-10 h-10 rounded-[28%] flex items-center justify-center shrink-0"
                      style={{ background: program.bg }}
                    >
                      <Icon size={18} color={program.color} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0D0D0D] text-base">{program.title}</h3>
                      <p className="text-xs text-[#6B7280]">{program.tagline}</p>
                    </div>
                    <span
                      className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0"
                      style={{
                        background: program.status === "Active" ? "#f0faf3" : "#fff3e0",
                        color: program.status === "Active" ? "#1B7A34" : "#E65100",
                      }}
                    >
                      {program.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {program.volunteerRoles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{
                          borderColor: program.color === "#1B7A34" ? "#4DC86A40" : "#1976D240",
                          color: program.color,
                          background: program.bg,
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">The Process</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-extrabold text-[#0D0D0D]">How to join</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={step.num} className="relative bg-white rounded-2xl border border-black/8 p-6">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-[calc(100%-1px)] w-5 h-0.5 bg-black/8 z-10" />
                )}
                <div
                  className="w-11 h-11 rounded-[28%] flex items-center justify-center mb-4 text-white font-extrabold text-sm"
                  style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-[#0D0D0D] mb-1 text-sm">{step.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section className="py-20 bg-white border-t border-black/5" id="apply">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Apply Now</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-extrabold text-[#0D0D0D]">
              Volunteer application
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-[#1B7A34]/20 p-14 text-center">
              <div
                className="w-16 h-16 rounded-[30%] flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                <CheckCircle2 size={28} color="white" />
              </div>
              <h3 className="font-bold text-[#0D0D0D] text-xl mb-2">Application received!</h3>
              <p className="text-[#6B7280] max-w-sm mx-auto text-sm leading-relaxed">
                Thank you for applying. Our volunteer coordinator will reach out within 3–5 business days to schedule a screening call.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-black/8 p-8 space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">First Name *</label>
                  <input
                    {...register("firstName", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="First name"
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Last Name *</label>
                  <input
                    {...register("lastName", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">Required</p>}
                </div>
              </div>

              {/* Contact row */}
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
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Phone Number</label>
                  <input
                    {...register("phone")}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              {/* Location & Program row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">City / Location *</label>
                  <input
                    {...register("city", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                    placeholder="Lagos, Abuja, Remote..."
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Program of Interest *</label>
                  <select
                    {...register("program", { required: true })}
                    defaultValue={preselectedProgram}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
                  >
                    <option value="">Select a program...</option>
                    {programs.map((p) => (
                      <option key={p.slug} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                  {errors.program && <p className="text-xs text-red-500 mt-1">Required</p>}
                </div>
              </div>

              {/* Role & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Volunteer Role</label>
                  <select
                    {...register("role")}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
                    disabled={availableRoles.length === 0}
                  >
                    <option value="">{availableRoles.length === 0 ? "Select a program first" : "Select a role..."}</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Availability *</label>
                  <select
                    {...register("availability", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors text-[#0D0D0D]"
                  >
                    <option value="">Select availability...</option>
                    {availabilityOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.availability && <p className="text-xs text-red-500 mt-1">Required</p>}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Relevant Experience / Background</label>
                <input
                  {...register("experience")}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                  placeholder="e.g. Software engineer with 5 years experience, Teacher, HR Professional..."
                />
              </div>

              {/* Key skills */}
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Key Skills</label>
                <input
                  {...register("skills")}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors"
                  placeholder="e.g. Facilitation, Data analysis, Curriculum design, Public speaking..."
                />
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] mb-2">Why do you want to volunteer? *</label>
                <textarea
                  {...register("motivation", { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#fafafa] text-sm focus:outline-none focus:border-[#1B7A34] focus:ring-1 focus:ring-[#1B7A34] transition-colors resize-none"
                  placeholder="Tell us what drives you to contribute to Goodness Society's mission..."
                />
                {errors.motivation && <p className="text-xs text-red-500 mt-1">Required</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
              >
                Submit Application <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center text-[#6B7280]">
                Questions? Email us at{" "}
                <a href="mailto:volunteers@goodnesssociety.org" className="text-[#1B7A34] hover:underline">
                  volunteers@goodnesssociety.org
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
