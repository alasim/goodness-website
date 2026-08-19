import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const allocationData = [
  { name: "Programs", value: 72, color: "#1B7A34" },
  { name: "Operations", value: 17, color: "#4DC86A" },
  { name: "Admin", value: 11, color: "#a8e6b8" },
];

const quarterlyData = [
  { q: "Q1", raised: 5.2, spent: 4.8 },
  { q: "Q2", raised: 6.1, spent: 5.5 },
  { q: "Q3", raised: 7.4, spent: 6.9 },
  { q: "Q4", raised: 5.8, spent: 4.6 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-black/10 rounded-xl px-3 py-2 shadow text-xs">
        <p className="font-semibold">{payload[0].name}</p>
        <p style={{ color: payload[0].color }}>₦{payload[0].value}M</p>
      </div>
    );
  }
  return null;
};

export function TransparencyDashboard() {
  return (
    <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-1">2024 Overview</p>
          <p className="font-bold text-[#0D0D0D]">Fund Allocation</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#1B7A34] bg-[#f0faf3] border border-[#1B7A34]/15">
          Live Data
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Donut */}
        <div className="relative shrink-0">
          <PieChart width={160} height={160}>
            <Pie data={allocationData} cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
              {allocationData.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-extrabold text-[#1B7A34]">72%</div>
              <div className="text-[10px] text-[#6B7280]">Programs</div>
            </div>
          </div>
        </div>

        {/* Legend & bars */}
        <div className="flex-1 w-full">
          <div className="space-y-2 mb-5">
            {allocationData.map((d) => (
              <div key={d.name} className="flex items-center gap-3 text-sm">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-[#0D0D0D] flex-1">{d.name}</span>
                <span className="font-semibold text-[#0D0D0D]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quarterly bar chart */}
      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3">Quarterly (₦M)</p>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={quarterlyData} barGap={2} barCategoryGap="30%">
            <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="raised" name="Raised" fill="#4DC86A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="spent" name="Spent" fill="#1B7A34" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key metric */}
      <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#6B7280]">Total Raised (2024)</p>
          <p className="font-extrabold text-[#0D0D0D]">₦24.5M</p>
        </div>
        <div>
          <p className="text-xs text-[#6B7280]">Overhead Ratio</p>
          <p className="font-extrabold text-[#1B7A34]">11%</p>
        </div>
      </div>
    </div>
  );
}
