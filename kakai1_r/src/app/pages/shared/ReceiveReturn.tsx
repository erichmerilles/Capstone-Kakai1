import React, { useState } from "react";
import { Truck, AlertTriangle, Plus, X, CheckCircle } from "lucide-react";
import { products, suppliers, damageEntries as initialDamage, DamageEntry } from "../../data/mockData";

export default function ReceiveReturn() {
  const [tab, setTab] = useState<"receive" | "damage">("receive");
  const [damages, setDamages] = useState<DamageEntry[]>(initialDamage);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [receiveForm, setReceiveForm] = useState({ supplierId: 1, productId: 1, qty: 0, unit: "boxes", note: "" });
  const [damageForm, setDamageForm] = useState({ productId: 1, qty: 0, unit: "pcs", reason: "" });
  const [receiveSuccess, setReceiveSuccess] = useState(false);

  const handleReceive = () => {
    setReceiveSuccess(true);
    setShowReceiveForm(false);
    setTimeout(() => setReceiveSuccess(false), 3000);
  };

  const handleDamage = () => {
    const product = products.find((p) => p.id === damageForm.productId);
    const newEntry: DamageEntry = {
      id: damages.length + 1,
      date: new Date().toISOString().split("T")[0],
      product: product?.name || "",
      qty: damageForm.qty,
      unit: damageForm.unit,
      reason: damageForm.reason,
      recordedBy: "Carlos Dela Cruz",
      status: "Pending",
    };
    setDamages((prev) => [newEntry, ...prev]);
    setShowDamageForm(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Receive & Return Products</h1>
        <p className="text-slate-400 text-sm">Manage incoming shipments and damage records</p>
      </div>

      {receiveSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">Shipment received successfully! Inventory updated.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 w-fit">
        <button onClick={() => setTab("receive")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "receive" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
          <Truck size={15} /> Receive Shipment
        </button>
        <button onClick={() => setTab("damage")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "damage" ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
          <AlertTriangle size={15} /> Damage / Loss Entry
        </button>
      </div>

      {tab === "receive" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowReceiveForm(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Receive Shipment
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs">Today's Deliveries</p>
              <p className="text-slate-800 font-bold text-2xl mt-1">2</p>
              <p className="text-slate-400 text-xs mt-1">Shipments received</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs">Active Suppliers</p>
              <p className="text-slate-800 font-bold text-2xl mt-1">{suppliers.filter((s) => s.status === "Active").length}</p>
              <p className="text-slate-400 text-xs mt-1">Registered suppliers</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs">Pending Orders</p>
              <p className="text-slate-800 font-bold text-2xl mt-1">1</p>
              <p className="text-slate-400 text-xs mt-1">Awaiting delivery</p>
            </div>
          </div>

          {/* Recent Receipts */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Truck size={15} className="text-orange-500" />
              <h2 className="text-slate-700 font-semibold text-sm">Recent Shipments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-left font-medium">Supplier</th>
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-left font-medium">Note</th>
                    <th className="px-4 py-3 text-left font-medium">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500 text-xs">2026-03-21</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">Kakai Chicharon Original</td>
                    <td className="px-4 py-3 text-slate-500">Crispy Bites Corp.</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">10 boxes</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">Regular delivery</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">Carlos Dela Cruz</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500 text-xs">2026-03-19</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">Rice Puffs Plain</td>
                    <td className="px-4 py-3 text-slate-500">Puff Masters Co.</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700">8 boxes</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">Reorder delivery</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">Carlos Dela Cruz</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "damage" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowDamageForm(true)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Record Damage / Loss
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500" />
              <h2 className="text-slate-700 font-semibold text-sm">Damage & Loss Records (Back Orders)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-left font-medium">Reason</th>
                    <th className="px-4 py-3 text-left font-medium">Recorded By</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {damages.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500 text-xs">{d.date}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{d.product}</td>
                      <td className="px-4 py-3 text-right font-semibold text-red-500">-{d.qty} {d.unit}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{d.reason}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{d.recordedBy}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${d.status === "Confirmed" ? "bg-green-50 text-green-600 border-green-200" : "bg-yellow-50 text-yellow-600 border-yellow-200"}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receive Form Modal */}
      {showReceiveForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">Receive Shipment</h2>
              <button onClick={() => setShowReceiveForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Supplier</label>
                <select value={receiveForm.supplierId} onChange={(e) => setReceiveForm({ ...receiveForm, supplierId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {suppliers.filter((s) => s.status === "Active").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Product</label>
                <select value={receiveForm.productId} onChange={(e) => setReceiveForm({ ...receiveForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Quantity</label>
                  <input type="number" min={1} value={receiveForm.qty} onChange={(e) => setReceiveForm({ ...receiveForm, qty: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Unit</label>
                  <select value={receiveForm.unit} onChange={(e) => setReceiveForm({ ...receiveForm, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>boxes</option>
                    <option>pcs</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Note</label>
                <input value={receiveForm.note} onChange={(e) => setReceiveForm({ ...receiveForm, note: e.target.value })} placeholder="e.g. Regular delivery" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReceiveForm(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={handleReceive} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Confirm Receipt</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Damage Form Modal */}
      {showDamageForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">Record Damage / Loss</h2>
              <button onClick={() => setShowDamageForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Product</label>
                <select value={damageForm.productId} onChange={(e) => setDamageForm({ ...damageForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Quantity</label>
                  <input type="number" min={1} value={damageForm.qty} onChange={(e) => setDamageForm({ ...damageForm, qty: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Unit</label>
                  <select value={damageForm.unit} onChange={(e) => setDamageForm({ ...damageForm, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>pcs</option>
                    <option>boxes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Reason</label>
                <input value={damageForm.reason} onChange={(e) => setDamageForm({ ...damageForm, reason: e.target.value })} placeholder="e.g. Crushed packaging, expired" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDamageForm(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={handleDamage} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Record Damage</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
