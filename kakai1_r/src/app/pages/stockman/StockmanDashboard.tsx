import React from "react";
import { useNavigate } from "react-router";
import { Package, Truck, BoxSelect, Layers, ArrowRight, AlertTriangle } from "lucide-react";
import { products } from "../../data/mockData";

export default function StockmanDashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const critStocks = products.filter((p) => p.shelfStock < 10 || p.retailStock < 30 || p.wholesaleStock < 5).length;
  const expiringCount = products.filter((p) => {
    const diff = (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }).length;

  const quickActions = [
    { label: "Product Master List", desc: "View all products and stock counts", path: "/stockman/products", icon: <Package size={20} />, color: "bg-orange-500" },
    { label: "Receive Shipment", desc: "Record incoming deliveries", path: "/stockman/receive-return", icon: <Truck size={20} />, color: "bg-blue-500" },
    { label: "Inventory Control", desc: "Breakdown, transfer, adjust stocks", path: "/stockman/inventory-control", icon: <BoxSelect size={20} />, color: "bg-purple-500" },
    { label: "Supplier Directory", desc: "View and manage suppliers", path: "/stockman/suppliers", icon: <Layers size={20} />, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Stockman Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome, Carlos! Here's your inventory overview.</p>
      </div>

      {/* Alerts */}
      {(critStocks > 0 || expiringCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {critStocks > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 text-sm font-medium">{critStocks} products at critical stock levels</p>
                <p className="text-red-500 text-xs">Check inventory control immediately</p>
              </div>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-amber-700 text-sm font-medium">{expiringCount} products expiring within 30 days</p>
                <p className="text-amber-500 text-xs">Review and take action</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, sub: "SKUs tracked", color: "bg-orange-500" },
          { label: "Wholesale Stock", value: products.reduce((s, p) => s + p.wholesaleStock, 0) + " boxes", sub: "Total in WH", color: "bg-purple-500" },
          { label: "Retail Stock", value: products.reduce((s, p) => s + p.retailStock, 0).toLocaleString(), sub: "pcs in retail WH", color: "bg-blue-500" },
          { label: "Store Shelf", value: products.reduce((s, p) => s + p.shelfStock, 0).toLocaleString(), sub: "pcs on shelf", color: "bg-green-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center text-white text-sm mb-3`}>📦</div>
            <p className="text-slate-400 text-xs">{kpi.label}</p>
            <p className="text-slate-800 font-bold text-xl mt-0.5">{kpi.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-slate-700 font-semibold text-sm mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4 text-left">
              <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center text-white flex-shrink-0`}>{a.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 font-medium text-sm">{a.label}</p>
                <p className="text-slate-400 text-xs">{a.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Stock Summary Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-700 font-semibold text-sm">Stock Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-right font-medium">WH (boxes)</th>
                <th className="px-4 py-3 text-right font-medium">Retail (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">Shelf (pcs)</th>
                <th className="px-4 py-3 text-left font-medium">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => {
                const diff = (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                const expiryClass = diff <= 30 ? "text-red-500 font-semibold" : "text-slate-500";
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-700 font-medium text-xs">{p.name}</td>
                    <td className={`px-4 py-3 text-right text-xs font-semibold ${p.wholesaleStock < 5 ? "text-red-500" : "text-slate-700"}`}>{p.wholesaleStock}</td>
                    <td className={`px-4 py-3 text-right text-xs font-semibold ${p.retailStock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                    <td className={`px-4 py-3 text-right text-xs font-semibold ${p.shelfStock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                    <td className={`px-4 py-3 text-xs ${expiryClass}`}>{p.expiryDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
