import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ReceiptText, MessageSquare, Package, ArrowRight, TrendingUp, ShoppingBag } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";

export default function CashierDashboard() {
  const navigate = useNavigate();

  // Real Data States
  const [todayTxns, setTodayTxns] = useState<any[]>([]);
  const [todaySales, setTodaySales] = useState(0);
  const [pendingOnline, setPendingOnline] = useState(0);
  const [lowShelf, setLowShelf] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCashierData = async () => {
      setIsLoading(true);
      try {
        const [invRes, salesRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/inventory/get_inventory.php`, { credentials: "include" }),
          fetch(`${API_URL}/pos/get_sales_history.php`, { credentials: "include" }),
          fetch(`${API_URL}/orders/get_online_orders.php`, { credentials: "include" })
        ]);

        const invData = await invRes.json();
        const salesData = await salesRes.json();
        const ordersData = await ordersRes.json();

        // 1. Calculate Low Shelf Stock
        if (invData.success) {
          const criticalItems = invData.data.filter((p: any) => Number(p.shelf_stock) < 10).length;
          setLowShelf(criticalItems);
        }

        // 2. Calculate Today's Sales & Transactions
        if (salesData.success) {
          // Get current local date in YYYY-MM-DD format to match MySQL created_at
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

          const todaysTransactions = salesData.data.filter((t: any) => t.created_at && t.created_at.startsWith(todayStr));
          setTodayTxns(todaysTransactions);

          const totalRevenue = todaysTransactions.reduce((sum: number, t: any) => sum + Number(t.total_amount || t.total || 0), 0);
          setTodaySales(totalRevenue);
        }

        // 3. Count Pending Online Orders
        if (ordersData.success) {
          const pendingCount = ordersData.data.filter((o: any) => o.status === "Pending").length;
          setPendingOnline(pendingCount);
        }

      } catch (error) {
        console.error("Error fetching cashier dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCashierData();
  }, []);

  const quickActions = [
    { label: "Point of Sale", desc: "Process customer transactions", path: "/cashier/pos", icon: <ReceiptText size={20} />, color: "bg-orange-500" },
    { label: "Online Orders", desc: "Manage SMS & Facebook orders", path: "/cashier/online-orders", icon: <MessageSquare size={20} />, color: "bg-blue-500" },
    { label: "Store Shelf", desc: "Check store shelf inventory", path: "/cashier/store-shelf", icon: <Package size={20} />, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Cashier Dashboard</h1>
        <p className="text-slate-400 text-sm">Welcome back! Here's your daily summary.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: `₱${todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <TrendingUp size={18} />, color: "bg-orange-500", sub: isLoading ? "Loading..." : `${todayTxns.length} transactions` },
          { label: "Transactions", value: isLoading ? "-" : todayTxns.length, icon: <ReceiptText size={18} />, color: "bg-purple-500", sub: "Processed today" },
          { label: "Pending Orders", value: isLoading ? "-" : pendingOnline, icon: <MessageSquare size={18} />, color: "bg-blue-500", sub: "Online orders" },
          { label: "Low Shelf Items", value: isLoading ? "-" : lowShelf, icon: <Package size={18} />, color: "bg-red-500", sub: "Need restocking" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center text-white mb-3`}>{kpi.icon}</div>
            <p className="text-slate-400 text-xs">{kpi.label}</p>
            <p className="text-slate-800 font-bold text-xl mt-0.5 truncate">{kpi.value}</p>
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

      {/* Pending Online Orders Alert */}
      {pendingOnline > 0 && !isLoading && (
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

      {/* Today's Transactions */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={15} className="text-orange-500" />
          <h2 className="text-slate-700 font-semibold text-sm">Today's Transactions</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading transactions...</div>
        ) : todayTxns.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ReceiptText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions yet today</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
            {todayTxns.map((t) => (
              <div key={t.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <ShoppingBag size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-700 text-xs font-medium">TXN-{t.id.toString().padStart(4, '0')}</p>
                    <p className="text-slate-400 text-xs capitalize">{t.sale_type || 'Walk-in'} · {t.payment_method || 'Cash'}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm font-semibold">₱{Number(t.total_amount || t.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between text-xs sticky bottom-0">
          <span className="text-slate-400">{todayTxns.length} transactions</span>
          <span className="text-orange-600 font-semibold">Total: ₱{todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

    </div>
  );
}