import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp, Package, AlertTriangle, PhilippinePeso,
  ShoppingBag, ArrowUpRight, Clock
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { products, weeklySales, monthlySales } from "../../data/mockData";

const ORANGE = "#f97316";
const PURPLE = "#7c3aed";

function KpiCard({ title, value, sub, icon, color, onClick, badge }: {
  title: string; value: string; sub: string;
  icon: React.ReactNode; color: string; onClick?: () => void; badge?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs">{title}</p>
        <p className="text-slate-800 text-xl font-bold mt-0.5 truncate">{value}</p>
        <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
      </div>
      {badge && (
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">{badge}</span>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [salesPeriod, setSalesPeriod] = useState<"week" | "month">("week");

  const critStocks = products.filter((p) => p.shelfStock < 10 || p.retailStock < 20).length;
  const today = new Date();
  const expiringCount = products.filter((p) => {
    const diff = (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }).length;

  const chartData = salesPeriod === "week" ? weeklySales : monthlySales;
  const xKey = salesPeriod === "week" ? "day" : "month";

  const topProducts = [
    { name: "Kakai Chicharon Original", sold: 342, revenue: 18810, change: 12 },
    { name: "Kutkutin Crackers Cheese", sold: 280, revenue: 11760, change: 8 },
    { name: "Peanut Butter Bar", sold: 265, revenue: 7420, change: -3 },
  ];

  const inventoryIntelligence = products.map((p) => {
    let action = "OK";
    if (p.shelfStock < 10) action = "Restock Shelf";
    else if (p.retailStock < 30) action = "Reorder Retail";
    else if (p.wholesaleStock < 5) action = "Reorder Wholesale";
    const diff = (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 30 && diff >= 0) action = "⚠ Expiring Soon";
    return { ...p, action };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, Maria! Here's today's overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sales Today"
          value="₱18,450"
          sub="+12% from yesterday"
          icon={<PhilippinePeso size={20} />}
          color="bg-orange-500"
        />
        <KpiCard
          title="Net Profit Today"
          value="₱5,535"
          sub="30% margin"
          icon={<TrendingUp size={20} />}
          color="bg-purple-600"
        />
        <KpiCard
          title="Critical Stocks"
          value={String(critStocks)}
          sub="Items need restocking"
          icon={<Package size={20} />}
          color="bg-red-500"
          onClick={() => navigate("/admin/expiry-stocks")}
          badge="URGENT"
        />
        <KpiCard
          title="Expiring Items"
          value={String(expiringCount)}
          sub="Within 30 days"
          icon={<AlertTriangle size={20} />}
          color="bg-amber-500"
          onClick={() => navigate("/admin/expiry-stocks")}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-700 font-semibold text-sm">Sales Overview</h2>
              <p className="text-slate-400 text-xs">Revenue & Profit trend</p>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setSalesPeriod("week")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${salesPeriod === "week" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
              >Week</button>
              <button
                onClick={() => setSalesPeriod("month")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${salesPeriod === "month" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
              >Month</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="sales" stroke={ORANGE} strokeWidth={2} fill={ORANGE} fillOpacity={0.08} name="Sales" />
              <Area type="monotone" dataKey="profit" stroke={PURPLE} strokeWidth={2} fill={PURPLE} fillOpacity={0.08} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-orange-400 inline-block" /> Sales</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-purple-500 inline-block" /> Profit</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-700 font-semibold text-sm">Top Selling Products</h2>
            <span className="text-orange-500 text-xs font-medium bg-orange-50 px-2 py-0.5 rounded-full">This Week</span>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? "bg-orange-500" : i === 1 ? "bg-purple-500" : "bg-slate-400"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-xs font-medium truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-1">
                      <div className="bg-orange-400 h-1 rounded-full" style={{ width: `${(p.sold / 342) * 100}%` }} />
                    </div>
                    <span className="text-slate-400 text-xs">{p.sold} sold</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 text-xs font-semibold">₱{p.revenue.toLocaleString()}</p>
                  <span className={`text-xs font-medium flex items-center justify-end gap-0.5 ${p.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <ArrowUpRight size={10} className={p.change < 0 ? "rotate-180" : ""} />
                    {Math.abs(p.change)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={16} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Inventory Intelligence</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-right font-medium">Wholesale (Boxes)</th>
                <th className="px-4 py-3 text-right font-medium">Retail Warehouse (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">Store Shelf (pcs)</th>
                <th className="px-4 py-3 text-left font-medium">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventoryIntelligence.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="text-slate-700 font-medium">{p.name}</p>
                    <p className="text-slate-400 text-xs">{p.category}</p>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.wholesaleStock < 5 ? "text-red-500" : "text-slate-700"}`}>{p.wholesaleStock}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.retailStock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.shelfStock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.action === "OK" ? "bg-green-50 text-green-600" :
                        p.action.includes("Expiring") ? "bg-amber-50 text-amber-600" :
                          "bg-red-50 text-red-600"
                      }`}>{p.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-slate-700 font-semibold text-sm mb-4 flex items-center gap-2"><Clock size={15} className="text-orange-500" /> Recent Transactions</h2>
        <div className="space-y-2">
          {[
            { id: "TXN-001", time: "08:32 AM", amount: "₱249.00", type: "Walk-in", cashier: "Ana V." },
            { id: "TXN-002", time: "08:15 AM", amount: "₱280.00", type: "Online - FB", cashier: "Ana V." },
            { id: "TXN-003", time: "Yesterday 3:45 PM", amount: "₱384.00", type: "Walk-in", cashier: "Ana V." },
          ].map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <ShoppingBag size={14} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-slate-700 text-xs font-medium">{t.id}</p>
                  <p className="text-slate-400 text-xs">{t.type} · {t.cashier}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-700 text-xs font-semibold">{t.amount}</p>
                <p className="text-slate-400 text-xs">{t.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}