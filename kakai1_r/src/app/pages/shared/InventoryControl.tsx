import React, { useState, useEffect } from "react";
import { BoxSelect, ArrowRight, SlidersHorizontal, BarChart2, Plus, X } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";

type Tab = "levels" | "breakdown" | "transfer" | "adjustment" | "movements";

// Updated to match your database structure
interface Product {
  id: number;
  name: string;
  pcsPerBox: number;
  wholesaleStock: number;
  retailStock: number;
  shelfStock: number;
}

interface Movement {
  id: number;
  date: string;
  product: string;
  type: string;
  location: string;
  qty: number;
  note: string;
  user: string;
}

export default function InventoryControl() {
  const [tab, setTab] = useState<Tab>("levels");
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [breakdownForm, setBreakdownForm] = useState({ productId: 0, boxes: 0 });
  const [transferForm, setTransferForm] = useState({ productId: 0, qty: 0 });
  const [adjForm, setAdjForm] = useState({ productId: 0, location: "shelf" as "wholesale" | "retail" | "shelf", delta: 0, reason: "" });
  const [success, setSuccess] = useState("");

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 4000); };

  // Fetch Inventory
  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/inventory/get_inventory.php`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        // Map database columns to your UI state
        const formatted = data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          pcsPerBox: p.pcs_per_box || 1,
          wholesaleStock: p.wholesale_stock,
          retailStock: p.retail_stock,
          shelfStock: p.shelf_stock
        }));
        setProducts(formatted);

        // Auto-select first product for forms if none selected
        if (formatted.length > 0 && breakdownForm.productId === 0) {
          setBreakdownForm(prev => ({ ...prev, productId: formatted[0].id }));
          setTransferForm(prev => ({ ...prev, productId: formatted[0].id }));
          setAdjForm(prev => ({ ...prev, productId: formatted[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching inventory", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Movement Logs
  const fetchMovements = async () => {
    try {
      const response = await fetch(`${API_URL}/inventory/get_movements.php`, { credentials: "include" });
      const data = await response.json();
      if (data.success) setMovements(data.data);
    } catch (error) {
      console.error("Error fetching movements", error);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (tab === "levels" || tab === "breakdown" || tab === "transfer" || tab === "adjustment") {
      fetchInventory();
    } else if (tab === "movements") {
      fetchMovements();
    }
  }, [tab]);

  // Handle Breakdown (Database Transaction)
  const handleBreakdown = async () => {
    const p = products.find((x) => x.id === breakdownForm.productId)!;
    if (p.wholesaleStock < breakdownForm.boxes) { alert("Not enough wholesale stock!"); return; }

    const newPcs = breakdownForm.boxes * p.pcsPerBox;

    try {
      const response = await fetch(`${API_URL}/inventory/process_transfer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: p.id,
          from_location: "wholesale",
          to_location: "retail",
          deduct_qty: breakdownForm.boxes,
          add_qty: newPcs,
          action: "breakdown"
        })
      });
      const data = await response.json();
      if (data.success) {
        showSuccess(`Breakdown successful: ${breakdownForm.boxes} boxes → ${newPcs} pcs added to retail`);
        fetchInventory(); // Refresh stock
        setBreakdownForm({ ...breakdownForm, boxes: 0 });
      } else alert(data.message);
    } catch (error) {
      alert("Network error.");
    }
  };

  // Handle Transfer (Database Transaction)
  const handleTransfer = async () => {
    const p = products.find((x) => x.id === transferForm.productId)!;
    if (p.retailStock < transferForm.qty) { alert("Not enough retail stock!"); return; }

    try {
      const response = await fetch(`${API_URL}/inventory/process_transfer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: p.id,
          from_location: "retail",
          to_location: "shelf",
          deduct_qty: transferForm.qty,
          add_qty: transferForm.qty,
          action: "transfer"
        })
      });
      const data = await response.json();
      if (data.success) {
        showSuccess(`Transferred ${transferForm.qty} pcs to store shelf`);
        fetchInventory();
        setTransferForm({ ...transferForm, qty: 0 });
      } else alert(data.message);
    } catch (error) {
      alert("Network error.");
    }
  };

  // Handle Adjustment (Uses Receive/Deduct endpoints)
  const handleAdjustment = async () => {
    if (adjForm.delta === 0) return;

    const isAdding = adjForm.delta > 0;
    const endpoint = isAdding ? "receive_stock.php" : "deduct_stock.php";

    try {
      const response = await fetch(`${API_URL}/inventory/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: adjForm.productId,
          location: adjForm.location,
          quantity: Math.abs(adjForm.delta),
          action: "adjustment",
          remarks: adjForm.reason || "Manual Adjustment"
        })
      });
      const data = await response.json();
      if (data.success) {
        showSuccess(`Stock adjusted successfully`);
        fetchInventory();
        setAdjForm({ ...adjForm, delta: 0, reason: "" });
      } else alert(data.message);
    } catch (error) {
      alert("Network error.");
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "levels", label: "Stock Levels", icon: <BarChart2 size={14} /> },
    { key: "breakdown", label: "Bulk Breakdown", icon: <BoxSelect size={14} /> },
    { key: "transfer", label: "Stock Transfer", icon: <ArrowRight size={14} /> },
    { key: "adjustment", label: "Stock Adjustment", icon: <SlidersHorizontal size={14} /> },
    { key: "movements", label: "Stock Movements", icon: <Plus size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-slate-800 text-xl font-bold">Inventory Control</h1>
        <p className="text-slate-400 text-sm">Manage stock levels, breakdowns, transfers, and adjustments</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="text-green-500 text-sm font-medium">✓ {success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${tab === t.key ? "bg-white shadow text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Stock Levels */}
      {tab === "levels" && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-slate-700 font-semibold text-sm">Current Stock Levels</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs">
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-right font-medium">Wholesale (boxes)</th>
                  <th className="px-4 py-3 text-right font-medium">Retail WH (pcs)</th>
                  <th className="px-4 py-3 text-right font-medium">Store Shelf (pcs)</th>
                  <th className="px-4 py-3 text-right font-medium">Total (pcs equiv.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
                ) : products.map((p) => {
                  const totalPcs = Number(p.wholesaleStock * p.pcsPerBox) + Number(p.retailStock) + Number(p.shelfStock);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-700 font-medium">{p.name}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${p.wholesaleStock < 5 ? "text-red-500" : "text-slate-700"}`}>{p.wholesaleStock}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${p.retailStock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${p.shelfStock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{totalPcs.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Breakdown */}
      {tab === "breakdown" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <BoxSelect size={16} className="text-purple-500" />
              <h2 className="text-slate-700 font-semibold text-sm">Bulk Breakdown (Wholesale → Retail)</h2>
            </div>
            <p className="text-slate-400 text-xs">Convert wholesale boxes to retail pieces</p>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Product</label>
              <select value={breakdownForm.productId} onChange={(e) => setBreakdownForm({ ...breakdownForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.wholesaleStock} boxes available)</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Number of Boxes to Break Down</label>
              <input type="number" min={1} value={breakdownForm.boxes || ""} onChange={(e) => setBreakdownForm({ ...breakdownForm, boxes: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            {breakdownForm.boxes > 0 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-purple-700 text-sm font-medium">Preview</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-slate-600">{breakdownForm.boxes} boxes</span>
                  <ArrowRight size={14} className="text-purple-400" />
                  <span className="text-purple-700 font-semibold">{breakdownForm.boxes * (products.find((p) => p.id === breakdownForm.productId)?.pcsPerBox || 1)} pcs</span>
                </div>
              </div>
            )}
            <button onClick={handleBreakdown} className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Confirm Breakdown</button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-slate-700 font-semibold text-sm">Pcs Per Box Reference</h2></div>
            <div className="divide-y divide-slate-50">
              {products.map((p) => (
                <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-slate-700 text-sm">{p.name}</span>
                  <span className="text-slate-500 text-sm"><span className="font-semibold text-slate-700">{p.pcsPerBox}</span> pcs/box</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Transfer */}
      {tab === "transfer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowRight size={16} className="text-blue-500" />
              <h2 className="text-slate-700 font-semibold text-sm">Stock Transfer (Retail → Store Shelf)</h2>
            </div>
            <p className="text-slate-400 text-xs">Move stock from retail warehouse to store shelf</p>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Product</label>
              <select value={transferForm.productId} onChange={(e) => setTransferForm({ ...transferForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.retailStock} pcs in retail WH)</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Quantity (pcs)</label>
              <input type="number" min={1} value={transferForm.qty || ""} onChange={(e) => setTransferForm({ ...transferForm, qty: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <button onClick={handleTransfer} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Confirm Transfer</button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-slate-700 font-semibold text-sm">Shelf vs Retail Levels</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 text-slate-500 text-xs"><th className="px-4 py-3 text-left font-medium">Product</th><th className="px-4 py-3 text-right font-medium">Retail WH</th><th className="px-4 py-3 text-right font-medium">Store Shelf</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-700 text-xs font-medium">{p.name}</td>
                      <td className={`px-4 py-3 text-right font-semibold text-xs ${p.retailStock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                      <td className={`px-4 py-3 text-right font-semibold text-xs ${p.shelfStock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment */}
      {tab === "adjustment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-amber-500" />
              <h2 className="text-slate-700 font-semibold text-sm">Manual Stock Adjustment</h2>
            </div>
            <p className="text-slate-400 text-xs">Use positive values to add, negative to deduct</p>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Product</label>
              <select value={adjForm.productId} onChange={(e) => setAdjForm({ ...adjForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Location</label>
              <select value={adjForm.location} onChange={(e) => setAdjForm({ ...adjForm, location: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="wholesale">Wholesale Warehouse</option>
                <option value="retail">Retail Warehouse</option>
                <option value="shelf">Store Shelf</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Adjustment (+/-)</label>
              <input type="number" value={adjForm.delta || ""} onChange={(e) => setAdjForm({ ...adjForm, delta: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Reason</label>
              <input value={adjForm.reason} onChange={(e) => setAdjForm({ ...adjForm, reason: e.target.value })} placeholder="e.g. Physical count discrepancy" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <button onClick={handleAdjustment} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Apply Adjustment</button>
          </div>
        </div>
      )}

      {/* Stock Movements */}
      {tab === "movements" && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><h2 className="text-slate-700 font-semibold text-sm">Stock Movement History</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs">
                  <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Location</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-left font-medium">Note</th>
                  <th className="px-4 py-3 text-left font-medium">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {movements.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-slate-400">No recent movements found.</td></tr>
                ) : movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500 text-xs">{m.date}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium text-xs">{m.product}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${m.type === "receive" ? "bg-green-50 text-green-600 border-green-200" :
                          m.type === "breakdown" ? "bg-purple-50 text-purple-600 border-purple-200" :
                            m.type === "transfer" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              m.type === "adjustment" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>{m.type.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs capitalize">{m.location}</td>
                    <td className={`px-4 py-3 text-right font-semibold text-xs ${m.qty < 0 ? "text-red-500" : "text-green-600"}`}>{m.qty > 0 ? "+" : ""}{m.qty}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{m.note}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{m.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}