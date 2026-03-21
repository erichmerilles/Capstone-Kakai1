import React from "react";
import { useNavigate } from "react-router";
import { ReceiptText, MessageSquare, Package, ArrowRight, TrendingUp, ShoppingBag } from "lucide-react";
import { transactions, onlineOrders, products } from "../../data/mockData";

export default function CashierDashboard() {
  const navigate = useNavigate();

  const todayTxns = transactions.filter((t) => t.date === "2026-03-21");
  const todaySales = todayTxns.reduce((s, t) => s + t.total, 0);
  const pendingOnline = onlineOrders.filter((o) => o.status === "Pending").length;
  const lowShelf = products.filter((p) => p.shelfStock < 10).length;

  const quickActions = [
    { label: "Point of Sale", desc: "Process customer transactions", path: "/cashier/pos", icon: <ReceiptText size={20} />, color: "bg-orange-500" },
    { label: "Online Orders", desc: "Manage SMS & Facebook orders", path: "/cashier/online-orders", icon: <MessageSquare size={20} />, color: "bg-blue-500" },
    { label: "Store Shelf", desc: "Check store shelf inventory", path: "/cashier/store-shelf", icon: <Package size={20} />, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Cashier Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome, Ana! Here's your daily summary.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: `₱${todaySales.toLocaleString()}`, icon: <TrendingUp size={18} />, color: "bg-orange-500", sub: `${todayTxns.length} transactions` },
          { label: "Transactions", value: todayTxns.length, icon: <ReceiptText size={18} />, color: "bg-purple-500", sub: "Processed today" },
          { label: "Pending Orders", value: pendingOnline, icon: <MessageSquare size={18} />, color: "bg-blue-500", sub: "Online orders" },
          { label: "Low Shelf Items", value: lowShelf, icon: <Package size={18} />, color: "bg-red-500", sub: "Need restocking" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center text-white mb-3`}>{kpi.icon}</div>
            <p className="text-slate-400 text-xs">{kpi.label}</p>
            <p className="text-slate-800 font-bold text-xl mt-0.5">{kpi.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-slate-700 font-semibold text-sm mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center text-white flex-shrink-0`}>{a.icon}</div>
              <div className="flex-1">
                <p className="text-slate-700 font-medium">{a.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Today's Transactions */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={15} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Today's Transactions</h2>
        </div>
        {todayTxns.length === 0 ? (
          <div className="text-center py-12 text-slate-400"><ReceiptText size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No transactions yet today</p></div>
        ) : (
          <div className="divide-y divide-slate-50">
            {todayTxns.map((t) => (
              <div key={t.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <ShoppingBag size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-700 text-xs font-medium">{t.id}</p>
                    <p className="text-slate-400 text-xs">{t.type === "online" ? `Online - ${t.source}` : "Walk-in"} · {t.paymentMethod}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm font-semibold">₱{t.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between text-xs">
          <span className="text-slate-400">{todayTxns.length} transactions</span>
          <span className="text-orange-600 font-semibold">Total: ₱{todaySales.toLocaleString()}</span>
        </div>
      </div>

      {/* Pending Online Orders Alert */}
      {pendingOnline > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-blue-700 text-sm font-medium">{pendingOnline} pending online order{pendingOnline > 1 ? "s" : ""}</p>
              <p className="text-blue-500 text-xs">Review and process online orders</p>
            </div>
          </div>
          <button onClick={() => navigate("/cashier/online-orders")} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
            View <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
