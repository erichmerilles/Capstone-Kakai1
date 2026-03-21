import React from "react";
import { TrendingDown, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { products } from "../../data/mockData";

const dailySales: Record<number, number> = { 1: 12, 2: 9, 3: 15, 4: 4, 5: 8, 6: 2, 7: 18, 8: 5, 9: 10, 10: 9 };

export default function InventoryForecast() {
  const forecasts = products.map((p) => {
    const totalPcs = p.wholesaleStock * p.pcsPerBox + p.retailStock + p.shelfStock;
    const avgDaily = dailySales[p.id] || 5;
    const daysLeft = Math.floor(totalPcs / avgDaily);
    let status: "OK" | "Low" | "Critical" = "OK";
    if (daysLeft < 7) status = "Critical";
    else if (daysLeft < 14) status = "Low";
    const reorderQty = Math.ceil((14 * avgDaily - totalPcs) / p.pcsPerBox);
    return { ...p, totalPcs, avgDaily, daysLeft, status, reorderQty: Math.max(0, reorderQty) };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  const critical = forecasts.filter((f) => f.status === "Critical").length;
  const low = forecasts.filter((f) => f.status === "Low").length;
  const ok = forecasts.filter((f) => f.status === "OK").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Inventory Forecast</h1>
        <p className="text-slate-400 text-sm">Projected stock duration based on average daily sales</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-red-500" /><p className="text-red-600 text-xs font-medium">Critical (&lt;7 days)</p></div>
          <p className="text-red-600 font-bold text-2xl">{critical}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-1"><Clock size={16} className="text-amber-500" /><p className="text-amber-600 text-xs font-medium">Low (7–14 days)</p></div>
          <p className="text-amber-600 font-bold text-2xl">{low}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><p className="text-green-600 text-xs font-medium">OK (&gt;14 days)</p></div>
          <p className="text-green-600 font-bold text-2xl">{ok}</p>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingDown size={15} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Stock Duration Forecast</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-right font-medium">Total Stock (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">Avg Daily Sales</th>
                <th className="px-4 py-3 text-right font-medium">Days Remaining</th>
                <th className="px-4 py-3 text-left font-medium">Stock Duration</th>
                <th className="px-4 py-3 text-right font-medium">Reorder (boxes)</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {forecasts.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium text-xs">{f.name}</td>
                  <td className="px-4 py-3 text-right text-slate-600 text-xs">{f.totalPcs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600 text-xs">{f.avgDaily}/day</td>
                  <td className={`px-4 py-3 text-right font-bold text-xs ${f.status === "Critical" ? "text-red-500" : f.status === "Low" ? "text-amber-500" : "text-green-600"}`}>
                    {f.daysLeft}
                  </td>
                  <td className="px-4 py-3 min-w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${f.status === "Critical" ? "bg-red-400" : f.status === "Low" ? "bg-amber-400" : "bg-green-400"}`}
                          style={{ width: `${Math.min(100, (f.daysLeft / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold text-xs ${f.reorderQty > 0 ? "text-orange-500" : "text-slate-300"}`}>
                    {f.reorderQty > 0 ? `+${f.reorderQty} boxes` : "–"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      f.status === "Critical" ? "bg-red-50 text-red-600 border-red-200" :
                      f.status === "Low" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-green-50 text-green-600 border-green-200"
                    }`}>{f.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 text-xs text-slate-400">
          Forecast based on average daily sales history · Reorder threshold: 14-day buffer
        </div>
      </div>
    </div>
  );
}
