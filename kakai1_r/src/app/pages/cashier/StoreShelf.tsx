import React, { useState } from "react";
import { Package, AlertTriangle, Search } from "lucide-react";
import { products } from "../../data/mockData";

export default function StoreShelf() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const critical = products.filter((p) => p.shelfStock < 10).length;
  const lowStock = products.filter((p) => p.shelfStock >= 10 && p.shelfStock < 20).length;
  const adequate = products.filter((p) => p.shelfStock >= 20).length;
  const totalPcs = products.reduce((s, p) => s + p.shelfStock, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Store Shelf Stocks</h1>
        <p className="text-slate-400 text-sm">Current inventory on store shelves (read-only view)</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs">Total SKUs</p><p className="text-slate-800 font-bold text-2xl mt-1">{products.length}</p></div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 shadow-sm"><p className="text-red-500 text-xs">Critical (&lt;10)</p><p className="text-red-600 font-bold text-2xl mt-1">{critical}</p></div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-sm"><p className="text-amber-500 text-xs">Low (10–20)</p><p className="text-amber-600 font-bold text-2xl mt-1">{lowStock}</p></div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 shadow-sm"><p className="text-green-500 text-xs">Adequate (20+)</p><p className="text-green-600 font-bold text-2xl mt-1">{adequate}</p></div>
      </div>

      {critical > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{critical} items are critically low on shelf. Please notify stockman to replenish from retail warehouse.</p>
        </div>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
      </div>

      {/* Shelf Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((p) => {
          const status = p.shelfStock < 10 ? "critical" : p.shelfStock < 20 ? "low" : "ok";
          return (
            <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-4 ${status === "critical" ? "border-red-200" : status === "low" ? "border-amber-200" : "border-slate-100"}`}>
              <div className="w-full aspect-square rounded-lg bg-orange-50 flex items-center justify-center text-3xl mb-3">🍟</div>
              <p className="text-slate-700 text-xs font-medium leading-tight line-clamp-2">{p.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{p.category}</p>
              <div className={`mt-3 rounded-lg p-2 text-center ${status === "critical" ? "bg-red-50" : status === "low" ? "bg-amber-50" : "bg-green-50"}`}>
                <p className={`font-bold text-lg ${status === "critical" ? "text-red-600" : status === "low" ? "text-amber-600" : "text-green-600"}`}>{p.shelfStock}</p>
                <p className={`text-xs ${status === "critical" ? "text-red-500" : status === "low" ? "text-amber-500" : "text-green-500"}`}>
                  {status === "critical" ? "CRITICAL" : status === "low" ? "LOW" : "pcs available"}
                </p>
              </div>
              <p className="text-orange-500 text-xs font-semibold mt-2 text-center">₱{p.sellingPrice}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><Package size={15} className="text-orange-500" /><span className="text-slate-600 text-sm">Total units on shelf:</span></div>
        <span className="text-slate-800 font-bold">{totalPcs.toLocaleString()} pcs</span>
      </div>
    </div>
  );
}
