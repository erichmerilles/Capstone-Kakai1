import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { weeklySales, monthlySales, categoryRevenue } from "../../data/mockData";
import { TrendingUp, DollarSign, ShoppingBag, Percent } from "lucide-react";

const COLORS = ["#f97316", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function ProfitabilityReports() {
  const [period, setPeriod] = useState<"week" | "month">("month");

  const data = period === "week" ? weeklySales : monthlySales;
  const xKey = period === "week" ? "day" : "month";

  const totalSales = data.reduce((s, d) => s + d.sales, 0);
  const totalProfit = data.reduce((s, d) => s + d.profit, 0);
  const margin = ((totalProfit / totalSales) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Profitability Reports</h1>
          <p className="text-slate-400 text-sm">Sales analytics and profitability insights</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          <button onClick={() => setPeriod("week")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === "week" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>This Week</button>
          <button onClick={() => setPeriod("month")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${period === "month" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>This Year</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₱${(totalSales / 1000).toFixed(0)}k`, icon: <DollarSign size={18} />, color: "bg-orange-500", sub: "Gross sales" },
          { label: "Net Profit", value: `₱${(totalProfit / 1000).toFixed(0)}k`, icon: <TrendingUp size={18} />, color: "bg-purple-500", sub: "After COGS" },
          { label: "Profit Margin", value: `${margin}%`, icon: <Percent size={18} />, color: "bg-green-500", sub: "Avg margin" },
          { label: "Transactions", value: "1,234", icon: <ShoppingBag size={18} />, color: "bg-blue-500", sub: period === "week" ? "This week" : "This year" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center text-white flex-shrink-0`}>{kpi.icon}</div>
              <div>
                <p className="text-slate-400 text-xs">{kpi.label}</p>
                <p className="text-slate-800 font-bold text-xl mt-0.5">{kpi.value}</p>
                <p className="text-slate-400 text-xs">{kpi.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Revenue vs Profit Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} dot={false} name="Sales" />
              <Line type="monotone" dataKey="profit" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Sales by Period</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="profit" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Revenue by Category</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {categoryRevenue.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600 text-xs">{c.name}</span>
                  </div>
                  <span className="text-slate-700 text-xs font-semibold">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-slate-700 font-semibold text-sm">Top Performing Products</h2></div>
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs"><th className="px-4 py-3 text-left font-medium">Product</th><th className="px-4 py-3 text-right font-medium">Units Sold</th><th className="px-4 py-3 text-right font-medium">Revenue</th><th className="px-4 py-3 text-right font-medium">Margin</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "Kakai Chicharon Original", sold: 342, revenue: 18810, margin: 27 },
                { name: "Kutkutin Crackers Cheese", sold: 280, revenue: 11760, margin: 25 },
                { name: "Peanut Butter Bar", sold: 265, revenue: 7420, margin: 21 },
                { name: "Rice Puffs Plain", sold: 220, revenue: 5720, margin: 23 },
                { name: "Kakai Chicharon Spicy", sold: 198, revenue: 11088, margin: 27 },
              ].map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 text-xs font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-right text-slate-600 text-xs">{p.sold}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700 text-xs">₱{p.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold text-xs">{p.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
