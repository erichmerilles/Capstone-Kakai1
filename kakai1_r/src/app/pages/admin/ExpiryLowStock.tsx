import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, Package, Filter } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kakai1_r/api";

export default function ExpiryLowStock() {
  const [view, setView] = useState<"all" | "expiry" | "low">("all");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/inventory/get_inventory.php`, {
          credentials: "include"
        });
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching inventory for alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const enriched = products.map((p) => {
    let expiryDays = Infinity;
    let isExpiring = false;
    let isExpired = false;

    if (p.expiry_date) {
      const diff = (new Date(p.expiry_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      expiryDays = Math.floor(diff);
      isExpiring = expiryDays <= 30 && expiryDays >= 0;
      isExpired = expiryDays < 0;
    }

    const shelfStock = Number(p.shelf_stock) || 0;
    const retailStock = Number(p.retail_stock) || 0;
    const wholesaleStock = Number(p.wholesale_stock) || 0;

    const isLowShelf = shelfStock < 10;
    const isLowRetail = retailStock < 30;

    return {
      ...p,
      expiryDays,
      isExpiring,
      isExpired,
      isLowShelf,
      isLowRetail,
      shelfStock,
      retailStock,
      wholesaleStock,
      expiryDate: p.expiry_date || "N/A"
    };
  });

  const filtered = enriched.filter((p) => {
    if (view === "expiry") return p.isExpiring || p.isExpired;
    if (view === "low") return p.isLowShelf || p.isLowRetail;
    return p.isExpiring || p.isExpired || p.isLowShelf || p.isLowRetail;
  });

  const expiredCount = enriched.filter((p) => p.isExpired).length;
  const expiringCount = enriched.filter((p) => p.isExpiring).length;
  const critShelf = enriched.filter((p) => p.isLowShelf).length;
  const critRetail = enriched.filter((p) => p.isLowRetail).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Expiry & Low Stock Tracker</h1>
        <p className="text-slate-400 text-sm">Monitor products near expiry and critically low stock levels</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle size={15} className="text-red-500" /><p className="text-red-600 text-xs font-medium">Expired</p></div>
          <p className="text-red-600 font-bold text-2xl">{isLoading ? "-" : expiredCount}</p>
          <p className="text-red-400 text-xs mt-1">Remove from shelf immediately</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-1"><Clock size={15} className="text-amber-500" /><p className="text-amber-600 text-xs font-medium">Expiring Soon</p></div>
          <p className="text-amber-600 font-bold text-2xl">{isLoading ? "-" : expiringCount}</p>
          <p className="text-amber-400 text-xs mt-1">Within 30 days</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1"><Package size={15} className="text-red-500" /><p className="text-red-600 text-xs font-medium">Critical Shelf</p></div>
          <p className="text-red-600 font-bold text-2xl">{isLoading ? "-" : critShelf}</p>
          <p className="text-red-400 text-xs mt-1">Below 10 pcs on shelf</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-1"><Package size={15} className="text-orange-500" /><p className="text-orange-600 text-xs font-medium">Low Retail WH</p></div>
          <p className="text-orange-600 font-bold text-2xl">{isLoading ? "-" : critRetail}</p>
          <p className="text-orange-400 text-xs mt-1">Below 30 pcs in retail WH</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 w-fit">
        <button onClick={() => setView("all")} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${view === "all" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>
          <Filter size={13} /> All Alerts ({enriched.filter((p) => p.isExpiring || p.isExpired || p.isLowShelf || p.isLowRetail).length})
        </button>
        <button onClick={() => setView("expiry")} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${view === "expiry" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>
          <Clock size={13} /> Expiry ({expiringCount + expiredCount})
        </button>
        <button onClick={() => setView("low")} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${view === "low" ? "bg-white shadow text-slate-700" : "text-slate-400"}`}>
          <Package size={13} /> Low Stock ({Math.max(critShelf, critRetail)})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Expiry Date</th>
                <th className="px-4 py-3 text-right font-medium">Days to Expiry</th>
                <th className="px-4 py-3 text-right font-medium">Shelf (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">Retail WH (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">WH (boxes)</th>
                <th className="px-4 py-3 text-left font-medium">Alerts</th>
                <th className="px-4 py-3 text-left font-medium">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">Loading alerts...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No alerts for this filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/50 ${p.isExpired ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="text-slate-700 font-medium">{p.name}</p>
                      <p className="text-slate-400 text-xs">{p.category || 'Uncategorized'}</p>
                    </td>
                    <td className={`px-4 py-3 text-xs font-medium ${p.isExpired ? "text-red-600" : p.isExpiring ? "text-amber-600" : "text-slate-500"}`}>{p.expiryDate}</td>
                    <td className={`px-4 py-3 text-right font-bold text-xs ${p.isExpired ? "text-red-600" : p.isExpiring ? "text-amber-600" : "text-slate-500"}`}>
                      {p.isExpired ? `Expired ${Math.abs(p.expiryDays)}d ago` : p.expiryDays !== Infinity ? `${p.expiryDays}d` : "-"}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold text-xs ${p.isLowShelf ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                    <td className={`px-4 py-3 text-right font-semibold text-xs ${p.isLowRetail ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                    <td className="px-4 py-3 text-right text-slate-700 text-xs">{p.wholesaleStock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isExpired && <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">EXPIRED</span>}
                        {p.isExpiring && !p.isExpired && <span className="bg-amber-100 text-amber-600 text-xs px-1.5 py-0.5 rounded-full font-medium">EXPIRING</span>}
                        {p.isLowShelf && <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">LOW SHELF</span>}
                        {p.isLowRetail && <span className="bg-orange-100 text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-medium">LOW RETAIL</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {p.isExpired ? "Pull from shelf, record damage" :
                        p.isExpiring ? "Promote / discount to sell fast" :
                          p.isLowShelf ? "Transfer from retail warehouse" :
                            "Reorder from supplier"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}