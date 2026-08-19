import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Download, CheckCircle2, Eye, BarChart3, TrendingUp, Cpu, Shield, FileText } from "lucide-react";
import { GradientTag } from "../components/brand/GradientTag";
import { RoundedSquare } from "../components/brand/RoundedSquare";

const allocationData = [
  { name: "Programs & Activities", value: 72, color: "#1B7A34" },
  { name: "Operations & Staff", value: 17, color: "#4DC86A" },
  { name: "Administration", value: 11, color: "#a8e6b8" },
];

const quarterlyData = [
  { q: "Q1 '24", raised: 5.2, spent: 4.8 },
  { q: "Q2 '24", raised: 6.1, spent: 5.5 },
  { q: "Q3 '24", raised: 7.4, spent: 6.9 },
  { q: "Q4 '24", raised: 5.8, spent: 4.6 },
];

const growthData = [
  { month: "Jan", lives: 180 },
  { month: "Mar", lives: 420 },
  { month: "May", lives: 780 },
  { month: "Jul", lives: 1100 },
  { month: "Sep", lives: 1680 },
  { month: "Nov", lives: 2100 },
  { month: "Dec", lives: 2400 },
];

const milestones = [
  { date: "Jan 2024", event: "Organisation officially registered with CAC", type: "milestone" },
  { date: "Mar 2024", event: "First education cohort launched — 45 participants", type: "program" },
  { date: "May 2024", event: "₦8.2M raised in first funding round", type: "funding" },
  { date: "Jun 2024", event: "AI & Digital Skills program launched in partnership with TechHub Lagos", type: "program" },
  { date: "Aug 2024", event: "500th beneficiary milestone reached", type: "milestone" },
  { date: "Oct 2024", event: "Second funding round — ₦16.3M raised", type: "funding" },
  { date: "Nov 2024", event: "Youth Empowerment bootcamp — 120 graduates", type: "program" },
  { date: "Dec 2024", event: "Annual report published — 2,400+ lives touched", type: "milestone" },
];

const commitments = [
  { icon: Eye, title: "Open Books", desc: "All financial records are available for public review on request." },
  { icon: BarChart3, title: "Impact Reports", desc: "Quarterly reports published showing program outcomes and metrics." },
  { icon: Shield, title: "Donor Protection", desc: "Your contributions are ring-fenced and allocated only to stated programs." },
  { icon: FileText, title: "Audit Compliance", desc: "Annual independent audit conducted and results publicly disclosed." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Every initiative has a public milestone tracker updated monthly." },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-black/10 rounded-xl px-3 py-2 shadow text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" ? (p.name === "Lives Touched" ? p.value.toLocaleString() : `₦${p.value}M`) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Transparency() {
  return (
    <div className="pt-[72px]">
      {/* ── HERO ── */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden">
        <div className="absolute -top-10 -right-10 pointer-events-none select-none opacity-[0.05]">
          <RoundedSquare size={400} rotate={25} gradient />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <GradientTag className="mb-8">Our Open Books</GradientTag>
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] tracking-tight mb-6">
              <span className="font-extrabold text-[#0D0D0D]">Nothing to hide.</span>
              <br />
              <span className="font-light text-[#0D0D0D]">Everything to show.</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed max-w-xl">
              We publish every financial figure, every impact metric, and every milestone. This page is our commitment to accountability — updated quarterly.
            </p>
          </div>
        </div>
      </section>

      {/* ── KEY METRICS ROW ── */}
      <section className="py-12 bg-[#fafafa] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Raised (2024)", value: "₦24.5M", note: "Across 2 funding rounds" },
              { label: "Total Spent (2024)", value: "₦21.8M", note: "89% utilisation rate" },
              { label: "Overhead Ratio", value: "11%", note: "Below 15% benchmark", highlight: true },
              { label: "Lives Touched", value: "2,400+", note: "Direct beneficiaries" },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-2xl border border-black/8 p-6">
                <p className="text-xs text-[#6B7280] mb-2">{m.label}</p>
                <p className={`text-3xl font-extrabold ${m.highlight ? "text-[#1B7A34]" : "text-[#0D0D0D]"}`}>{m.value}</p>
                <p className="text-xs text-[#6B7280] mt-1">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARTS ROW ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Allocation donut */}
          <div className="bg-white border border-black/8 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-1 font-semibold">Fund Allocation</p>
            <p className="font-bold text-[#0D0D0D] mb-6">Where your money goes</p>
            <div className="flex justify-center">
              <div className="relative">
                <PieChart width={180} height={180}>
                  <Pie data={allocationData} cx={85} cy={85} innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                    {allocationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-[#1B7A34]">72%</div>
                    <div className="text-[10px] text-[#6B7280]">Programs</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {allocationData.map((d) => (
                <div key={d.name} className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
                  <span className="text-[#0D0D0D] flex-1 text-xs">{d.name}</span>
                  <span className="font-bold text-[#0D0D0D] text-xs">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quarterly bar */}
          <div className="bg-white border border-black/8 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-1 font-semibold">Quarterly Finances</p>
            <p className="font-bold text-[#0D0D0D] mb-6">Raised vs Spent (₦M)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quarterlyData} barGap={2} barCategoryGap="35%">
                <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="raised" name="Raised" fill="#4DC86A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill="#1B7A34" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#4DC86A]" /><span className="text-xs text-[#6B7280]">Raised</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#1B7A34]" /><span className="text-xs text-[#6B7280]">Spent</span></div>
            </div>
          </div>

          {/* Growth line */}
          <div className="bg-white border border-black/8 rounded-2xl p-7">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-1 font-semibold">Cumulative Impact</p>
            <p className="font-bold text-[#0D0D0D] mb-6">Lives Touched (2024)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 2" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="lives"
                  name="Lives Touched"
                  stroke="#1B7A34"
                  strokeWidth={3}
                  dot={{ fill: "#1B7A34", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── MILESTONE TIMELINE ── */}
      <section className="py-20 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Track Record</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">
              <span className="font-light text-[#0D0D0D]">Our</span>{" "}
              <span className="font-extrabold text-[#0D0D0D]">milestones</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-black/8" />

            <div className="space-y-8 pl-12">
              {milestones.map((m, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div
                    className="absolute -left-[2.15rem] w-4 h-4 rounded-full border-2 border-white"
                    style={{
                      background:
                        m.type === "milestone" ? "#1B7A34"
                          : m.type === "funding" ? "#1565C0"
                          : "#4DC86A",
                    }}
                  />
                  <div className="bg-white rounded-xl border border-black/8 p-5 hover:shadow-sm transition-shadow">
                    <p className="text-xs text-[#6B7280] mb-1 font-semibold">{m.date}</p>
                    <p className="text-sm text-[#0D0D0D] font-medium">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMITMENTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3 font-semibold">Our Pledge</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight">
              <span className="font-extrabold text-[#0D0D0D]">5 donor commitments</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {commitments.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="text-center p-6 rounded-2xl border border-black/8 bg-white hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-[28%] flex items-center justify-center mx-auto mb-4 bg-[#f0faf3]">
                    <Icon size={22} color="#1B7A34" />
                  </div>
                  <p className="font-bold text-[#0D0D0D] text-sm mb-1">{c.title}</p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section className="py-16 bg-[#fafafa] border-t border-black/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-3">Download our Annual Report</h2>
          <p className="text-[#6B7280] text-sm mb-6">Full 2024 Annual Impact Report — financials, outcomes, and forward outlook.</p>
          <button
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)" }}
            onClick={() => alert("Annual report PDF will be available here. Contact hello@goodnesssociety.org to request a copy.")}
          >
            <Download size={16} />
            Download PDF Report
          </button>
        </div>
      </section>
    </div>
  );
}
