import React, { useState } from "react";
import { MessageSquare, Facebook, Phone, Plus, Search, Eye, X } from "lucide-react";
import { onlineOrders, OnlineOrder } from "../../data/mockData";

const statusColor: Record<OnlineOrder["status"], string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Ready: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OnlineOrders() {
  const [orders, setOrders] = useState<OnlineOrder[]>(onlineOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | OnlineOrder["status"]>("All");
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: "", contact: "", address: "", source: "Facebook" as "SMS" | "Facebook", payment: "GCash", note: "" });

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id: string, status: OnlineOrder["status"]) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder((o) => o ? { ...o, status } : null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Online Orders</h1>
          <p className="text-slate-400 text-sm">Manage SMS & Facebook orders</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["Pending", "Processing", "Ready", "Delivered"] as const).map((s) => (
          <div key={s} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs">{s}</p>
            <p className="text-slate-800 font-bold text-xl">{orders.filter((o) => o.status === s).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID or customer…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {(["All", "Pending", "Processing", "Ready", "Delivered", "Cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filter === s ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Source</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Payment</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700 font-medium">{o.customer}</p>
                    <p className="text-slate-400 text-xs">{o.contact}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${o.source === "Facebook" ? "text-blue-600" : "text-green-600"}`}>
                      {o.source === "Facebook" ? <Facebook size={13} /> : <Phone size={13} />}
                      {o.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{o.date}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">₱{o.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColor[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{o.paymentMethod}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-400 text-xs">Customer</p><p className="text-slate-700 font-medium">{selectedOrder.customer}</p></div>
                <div><p className="text-slate-400 text-xs">Contact</p><p className="text-slate-700">{selectedOrder.contact}</p></div>
                <div><p className="text-slate-400 text-xs">Source</p><p className={`font-medium ${selectedOrder.source === "Facebook" ? "text-blue-600" : "text-green-600"}`}>{selectedOrder.source}</p></div>
                <div><p className="text-slate-400 text-xs">Payment</p><p className="text-slate-700">{selectedOrder.paymentMethod}</p></div>
                <div className="col-span-2"><p className="text-slate-400 text-xs">Address</p><p className="text-slate-700">{selectedOrder.address}</p></div>
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium mb-2">Order Items</p>
                <div className="space-y-1">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-slate-700">{item.name} × {item.qty}</span>
                      <span className="text-slate-700 font-semibold">₱{(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm px-3 py-2 font-bold text-slate-800">
                    <span>Total</span><span>₱{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-xs font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["Pending", "Processing", "Ready", "Delivered", "Cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedOrder.status === s ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-500 hover:border-orange-300"}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">Create Online Order</h2>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Customer Name</label>
                  <input value={newOrder.customer} onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Contact</label>
                  <input value={newOrder.contact} onChange={(e) => setNewOrder({ ...newOrder, contact: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Delivery Address</label>
                <input value={newOrder.address} onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Source</label>
                  <select value={newOrder.source} onChange={(e) => setNewOrder({ ...newOrder, source: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Facebook</option>
                    <option>SMS</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Payment</label>
                  <select value={newOrder.payment} onChange={(e) => setNewOrder({ ...newOrder, payment: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>GCash</option>
                    <option>Maya</option>
                    <option>COD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Order Note / Items</label>
                <textarea value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} rows={3} placeholder="e.g. 5 pcs Chicharon Original, 3 pcs Crackers Cheese" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNew(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button
                  onClick={() => {
                    const id = "ORD-" + String(orders.length + 100).padStart(3, "0");
                    setOrders((prev) => [{
                      id, date: new Date().toLocaleString(), customer: newOrder.customer || "Customer",
                      source: newOrder.source, items: [], total: 0, status: "Pending",
                      paymentMethod: newOrder.payment, address: newOrder.address, contact: newOrder.contact,
                    }, ...prev]);
                    setShowNew(false);
                    setNewOrder({ customer: "", contact: "", address: "", source: "Facebook", payment: "GCash", note: "" });
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                >Create Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
