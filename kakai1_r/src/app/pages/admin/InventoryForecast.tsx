import React, { useState, useEffect } from "react";
import { TrendingDown, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kakai1_r/api";

export default function InventoryForecast() {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Fetch current inventory AND sales history to calculate real daily averages
        const [invRes, profitRes] = await Promise.all([
          fetch(`${API_URL}/inventory/get_inventory.php`, { credentials: "include" }),
          fetch(`${API_URL}/analytics/get_profitability.php`, { credentials: "include" })
        ]);

        const invData = await invRes.json();
        const profitData = await profitRes.json();

        if (invData.success) {
          const liveForecasts = invData.data.map((p: any) => {
            const totalPcs = Number(p.wholesale_stock * (p.pcs_per_box || 1)) + Number(p.retail_stock) + Number(p.shelf_stock);

            // Find historical sales for this product
            const salesData = profitData.success ? profitData.data.find((sale: any) => sale.name === p.name) : null;
            const itemsSoldLast30Days = salesData ? Number(salesData.items_sold) : 0;

            // Calculate real daily average (minimum 1 to avoid division by zero)
            const avgDaily = itemsSoldLast30Days > 0 ? Math.ceil(itemsSoldLast30Days / 30) : 1;

            const daysLeft = Math.floor(totalPcs / avgDaily);

            let status: "OK" | "Low" | "Critical" = "OK";
            if (daysLeft < 7) status = "Critical";
            else if (daysLeft < 14) status = "Low";

            const reorderQty = Math.ceil((14 * avgDaily - totalPcs) / (p.pcs_per_box || 1));

            return {
              ...p,
              totalPcs,
              avgDaily,
              daysLeft,
              status,
              reorderQty: Math.max(0, reorderQty)
            };
          }).sort((a: any, b: any) => a.daysLeft - b.daysLeft); // Sort by most critical

          setForecasts(liveForecasts);
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  const critical = forecasts.filter((f) => f.status === "Critical").length;
  const low = forecasts.filter((f) => f.status === "Low").length;
  const ok = forecasts.filter((f) => f.status === "OK").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Inventory Forecast</h1>
        <p className="text-slate-400 text-sm">Stock duration predictions based on sales history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-red-500" /><p className="text-red-600 text-xs font-medium">Critical (&lt;7 days)</p></div>
          <p className="text-red-600 font-bold text-2xl">{isLoading ? "-" : critical}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-1"><Clock size={16} className="text-amber-500" /><p className="text-amber-600 text-xs font-medium">Low (7–14 days)</p></div>
          <p className="text-amber-600 font-bold text-2xl">{isLoading ? "-" : low}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><p className="text-green-600 text-xs font-medium">OK (&gt;14 days)</p></div>
          <p className="text-green-600 font-bold text-2xl">{isLoading ? "-" : ok}</p>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingDown size={15} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Stock Duration Forecast</h2>
        </div>
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-sm relative">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
              <tr className="text-slate-500 text-xs">
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
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Analyzing historical sales data...</td></tr>
              ) : forecasts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">No inventory available to forecast.</td></tr>
              ) : forecasts.map((f) => (
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
                          className={`h-1.5 rounded-full transition-all duration-1000 ${f.status === "Critical" ? "bg-red-400" : f.status === "Low" ? "bg-amber-400" : "bg-green-400"}`}
                          style={{ width: `${Math.min(100, (f.daysLeft / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold text-xs ${f.reorderQty > 0 ? "text-orange-500" : "text-slate-300"}`}>
                    {f.reorderQty > 0 ? `+${f.reorderQty} boxes` : "–"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${f.status === "Critical" ? "bg-red-50 text-red-600 border-red-200" :
                      f.status === "Low" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-green-50 text-green-600 border-green-200"
                      }`}>{f.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 text-xs text-slate-400 border-t border-slate-100">
          Forecasts are calculated based on the most recent 30 days of POS sales data, with reorder thresholds set to maintain a 14-day safety buffer.
        </div>
      </div>
    </div>
  );
}