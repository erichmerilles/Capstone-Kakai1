import React, { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Percent } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";
const COLORS = ["#f97316", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function ProfitabilityReports() {
  const [report, setReport] = useState({ summary: { total_revenue: 0, total_cost: 0, total_profit: 0 }, data: [] as any[] });
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profitRes, forecastRes] = await Promise.all([
          fetch(`${API_URL}/analytics/get_profitability.php`, { credentials: "include" }),
          fetch(`${API_URL}/analytics/get_forecast.php`, { credentials: "include" })
        ]);

        const profitData = await profitRes.json();
        const forecastData = await forecastRes.json();

        if (profitData.success) setReport(profitData);
        if (forecastData.success) {
          const formattedTrends = forecastData.data.trends.map((t: any) => ({
            day: new Date(t.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: Number(t.daily_revenue),
            items: Number(t.total_items_sold)
          }));
          setTrends(formattedTrends);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = report.summary.total_revenue;
  const totalProfit = report.summary.total_profit;
  const margin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0";
  const totalItemsSold = report.data.reduce((sum, item) => sum + Number(item.items_sold), 0);

  // Transform top 5 products into Pie Chart format
  const topProductsForPie = report.data.slice(0, 5).map(p => ({
    name: p.name,
    value: Number(p.total_revenue)
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Profitability Reports</h1>
          <p className="text-slate-400 text-sm">Live sales analytics and margin insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₱${totalSales.toLocaleString()}`, icon: <DollarSign size={18} />, color: "bg-orange-500", sub: "Gross sales" },
          { label: "Net Profit", value: `₱${totalProfit.toLocaleString()}`, icon: <TrendingUp size={18} />, color: "bg-purple-500", sub: "After COGS" },
          { label: "Profit Margin", value: `${margin}%`, icon: <Percent size={18} />, color: "bg-green-500", sub: "Avg margin" },
          { label: "Items Sold", value: totalItemsSold.toLocaleString(), icon: <ShoppingBag size={18} />, color: "bg-blue-500", sub: "All time volume" },
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
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Daily Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            {trends.length > 0 ? (
              <LineChart data={trends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} dot={true} name="Revenue ₱" />
              </LineChart>
            ) : <div className="h-full flex justify-center items-center text-slate-400 text-sm">No trend data available</div>}
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Items Sold Daily</h2>
          <ResponsiveContainer width="100%" height={220}>
            {trends.length > 0 ? (
              <BarChart data={trends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="items" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Units Sold" />
              </BarChart>
            ) : <div className="h-full flex justify-center items-center text-slate-400 text-sm">No volume data available</div>}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-slate-700 font-semibold text-sm mb-4">Top Revenue Drivers</h2>
          {topProductsForPie.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={topProductsForPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {topProductsForPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₱${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1 w-full mt-4 sm:mt-0">
                {topProductsForPie.map((c, i) => {
                  const percent = ((c.value / totalSales) * 100).toFixed(1);
                  return (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-slate-600 text-xs truncate">{c.name}</span>
                      </div>
                      <span className="text-slate-700 text-xs font-semibold">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : <div className="py-8 text-center text-slate-400 text-sm">Not enough data to graph</div>}
        </div>

        {/* Detailed Profitability Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full max-h-[300px]">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 sticky top-0"><h2 className="text-slate-700 font-semibold text-sm">Full Product Profitability</h2></div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-500 text-xs">
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-right font-medium">Sold</th>
                  <th className="px-4 py-3 text-right font-medium">Revenue</th>
                  <th className="px-4 py-3 text-right font-medium">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? <tr><td colSpan={4} className="py-4 text-center text-slate-400 text-xs">Loading...</td></tr> : null}
                {report.data.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-700 text-xs font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-right text-slate-600 text-xs">{p.items_sold}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700 text-xs">₱{Number(p.total_revenue).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold text-xs">{p.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}