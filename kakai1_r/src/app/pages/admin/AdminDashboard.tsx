import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp, Package, AlertTriangle, PhilippinePeso,
  ShoppingBag, Clock
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";

const API_URL = "http://localhost/kakai1_r/api";
const ORANGE = "#f97316";
const PURPLE = "#7c3aed";

function KpiCard({ title, value, sub, icon, color, onClick, badge }: {
  title: string; value: string; sub?: string;
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
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
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

  const [inventory, setInventory] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({ salesToday: 0, profitToday: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [invRes, forecastRes, profitRes, logsRes] = await Promise.all([
          fetch(`${API_URL}/inventory/get_inventory.php`, { credentials: "include" }),
          fetch(`${API_URL}/analytics/get_forecast.php`, { credentials: "include" }),
          fetch(`${API_URL}/analytics/get_profitability.php`, { credentials: "include" }),
          fetch(`${API_URL}/analytics/get_activity_log.php`, { credentials: "include" })
        ]);

        const invData = await invRes.json();
        const forecastData = await forecastRes.json();
        const profitData = await profitRes.json();
        const logsData = await logsRes.json();

        if (invData.success) setInventory(invData.data);

        if (forecastData.success) {
          const formattedTrends = forecastData.data.trends.map((t: any) => ({
            date: t.sale_date,
            day: new Date(t.sale_date).toLocaleDateString('en-US', { weekday: 'short' }),
            month: new Date(t.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: Number(t.daily_revenue),
            profit: Number(t.daily_profit)
          }));
          setTrends(formattedTrends);

          if (formattedTrends.length > 0) {
            const lastRecord = formattedTrends[formattedTrends.length - 1];
            const isActuallyToday = new Date(lastRecord.date).toDateString() === new Date().toDateString();

            setDashboardStats({
              salesToday: isActuallyToday ? lastRecord.sales : 0,
              profitToday: isActuallyToday ? lastRecord.profit : 0
            });
          }
        }

        if (profitData.success) {
          const topList = profitData.data.slice(0, 3).map((p: any) => ({
            name: p.name,
            sold: p.items_sold,
            revenue: Number(p.total_revenue)
          }));
          setTopProducts(topList);
        }

        if (logsData.success) {
          const formattedLogs = logsData.data.slice(0, 4).map((s: any) => ({
            id: s.id,
            time: s.timestamp.split(" ")[1] || "Just now",
            description: s.details,
            type: s.module,
            user: s.user
          }));
          setRecentActivity(formattedLogs);
        }

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const critStocks = inventory.filter((p) => p.shelf_stock < 10 || p.retail_stock < 20).length;
  const today = new Date();
  const expiringCount = inventory.filter((p) => {
    if (!p.expiry_date) return false;
    const diff = (new Date(p.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }).length;

  const inventoryIntelligence = inventory.map((p) => {
    let action = "OK";
    if (p.shelf_stock < 10) action = "Restock Shelf";
    else if (p.retail_stock < 30) action = "Reorder Retail";
    else if (p.wholesale_stock < 5) action = "Reorder Wholesale";

    if (p.expiry_date) {
      const diff = (new Date(p.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 30 && diff >= 0) action = "⚠ Expiring Soon";
    }
    return { ...p, action };
  });

  const chartData = salesPeriod === "week" ? trends.slice(-7) : trends;
  const xKey = salesPeriod === "week" ? "day" : "month";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back, Admin! Here's today's overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sales Today"
          value={`₱${dashboardStats.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          sub="Daily gross revenue"
          icon={<PhilippinePeso size={20} />}
          color="bg-orange-500"
        />
        <KpiCard
          title="Net Profit Today"
          value={`₱${dashboardStats.profitToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          sub="Actual daily net"
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
          badge={critStocks > 0 ? "URGENT" : undefined}
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
            {chartData.length > 0 ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ORANGE} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={ORANGE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="sales" stroke={ORANGE} strokeWidth={2} fill="url(#gradSales)" name="Sales" />
                <Area type="monotone" dataKey="profit" stroke={PURPLE} strokeWidth={2} fill="url(#gradProfit)" name="Profit" />
              </AreaChart>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Waiting for live data...</div>
            )}
          </ResponsiveContainer>

          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-orange-400 inline-block" /> Sales</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-purple-500 inline-block" /> Profit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-700 font-semibold text-sm">Top Selling Products</h2>
            <span className="text-orange-500 text-xs font-medium bg-orange-50 px-2 py-0.5 rounded-full">All Time</span>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">No sales recorded yet.</p> : null}
            {topProducts.map((p, i) => {
              const maxSold = Math.max(...topProducts.map(x => x.sold));
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? "bg-orange-500" : i === 1 ? "bg-purple-500" : "bg-slate-400"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 text-xs font-medium truncate">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-1">
                        <div className="bg-orange-400 h-1 rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs">{p.sold} sold</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-700 text-xs font-semibold">₱{p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={16} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Inventory Intelligence</h2>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-sm relative">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-slate-500 text-xs">
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
                    <p className="text-slate-400 text-xs">{p.category || 'Uncategorized'}</p>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.wholesale_stock < 5 ? "text-red-500" : "text-slate-700"}`}>{p.wholesale_stock}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.retail_stock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retail_stock}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.shelf_stock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelf_stock}</td>
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

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-slate-700 font-semibold text-sm mb-4 flex items-center gap-2"><Clock size={15} className="text-orange-500" /> Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.length === 0 ? <p className="text-xs text-slate-400">No recent activity found.</p> : null}
          {recentActivity.map((t, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={14} className="text-orange-500" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-slate-700 text-xs font-medium truncate">{t.description}</p>
                  <p className="text-slate-400 text-xs capitalize">{t.type} · {t.user}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-slate-400 text-xs">{t.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}