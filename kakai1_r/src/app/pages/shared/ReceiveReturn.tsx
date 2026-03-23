import React, { useState, useEffect } from "react";
import { Truck, AlertTriangle, Plus, X, CheckCircle } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";

// Define our interfaces based on the database
interface Product {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
  status?: string;
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

export default function ReceiveReturn() {
  const [tab, setTab] = useState<"receive" | "damage">("receive");

  // Real Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [receiveForm, setReceiveForm] = useState({ supplierId: 0, productId: 0, qty: "", unit: "boxes", note: "" });
  const [damageForm, setDamageForm] = useState({ productId: 0, qty: "", unit: "pcs", reason: "" });
  const [receiveSuccess, setReceiveSuccess] = useState(false);

  // Load Data
  const fetchData = async () => {
    try {
      // Fetch Products
      const prodRes = await fetch(`${API_URL}/inventory/get_inventory.php`, { credentials: "include" });
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.data);
        if (prodData.data.length > 0) {
          setReceiveForm(prev => ({ ...prev, productId: prodData.data[0].id }));
          setDamageForm(prev => ({ ...prev, productId: prodData.data[0].id }));
        }
      }

      // Fetch Movements (Activity Log)
      const moveRes = await fetch(`${API_URL}/inventory/get_movements.php`, { credentials: "include" });
      const moveData = await moveRes.json();
      if (moveData.success) setMovements(moveData.data);

      // Fetch Suppliers (We will create this quick endpoint below)
      const suppRes = await fetch(`${API_URL}/suppliers/get_suppliers.php`, { credentials: "include" });
      const suppData = await suppRes.json();
      if (suppData.success) {
        setSuppliers(suppData.data);
        if (suppData.data.length > 0) setReceiveForm(prev => ({ ...prev, supplierId: suppData.data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter movements for our tables
  const receiveLogs = movements.filter(m => m.type === "receive");
  const damageLogs = movements.filter(m => m.type === "adjustment" || m.type === "return");
  const todayDeliveries = receiveLogs.filter(m => m.date.includes(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })));

  // Submit Receive
  const handleReceive = async () => {
    if (!receiveForm.productId || !receiveForm.qty) return alert("Please fill all required fields.");

    const locationMap = receiveForm.unit === "boxes" ? "wholesale" : "retail";
    const supplierName = suppliers.find(s => s.id === receiveForm.supplierId)?.name || "Unknown Supplier";

    try {
      const response = await fetch(`${API_URL}/inventory/receive_stock.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: receiveForm.productId,
          location: locationMap,
          quantity: Number(receiveForm.qty),
          remarks: `${receiveForm.note} (From: ${supplierName})`
        })
      });

      const data = await response.json();
      if (data.success) {
        setReceiveSuccess(true);
        setShowReceiveForm(false);
        setReceiveForm({ ...receiveForm, qty: "", note: "" });
        fetchData(); // Refresh logs
        setTimeout(() => setReceiveSuccess(false), 3000);
      } else alert(data.message);
    } catch (error) {
      alert("Network error.");
    }
  };

  // Submit Damage/Loss
  const handleDamage = async () => {
    if (!damageForm.productId || !damageForm.qty) return alert("Please fill all required fields.");

    const locationMap = damageForm.unit === "boxes" ? "wholesale" : "retail";

    try {
      const response = await fetch(`${API_URL}/inventory/deduct_stock.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: damageForm.productId,
          location: locationMap,
          quantity: Number(damageForm.qty),
          action: "adjustment", // Action type for damages
          remarks: damageForm.reason
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowDamageForm(false);
        setDamageForm({ ...damageForm, qty: "", reason: "" });
        fetchData(); // Refresh logs
      } else alert(data.message);
    } catch (error) {
      alert("Network error.");
    }
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
              <p className="text-slate-800 font-bold text-2xl mt-1">{todayDeliveries.length}</p>
              <p className="text-slate-400 text-xs mt-1">Shipments received</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs">Active Suppliers</p>
              <p className="text-slate-800 font-bold text-2xl mt-1">{suppliers.length}</p>
              <p className="text-slate-400 text-xs mt-1">Registered suppliers</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs">Pending Orders</p>
              <p className="text-slate-800 font-bold text-2xl mt-1">0</p>
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
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-left font-medium">Location</th>
                    <th className="px-4 py-3 text-left font-medium">Note</th>
                    <th className="px-4 py-3 text-left font-medium">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr> :
                    receiveLogs.length === 0 ? <tr><td colSpan={6} className="text-center py-4 text-slate-400">No shipments found.</td></tr> :
                      receiveLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-500 text-xs">{log.date}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{log.product}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-700">+{log.qty}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs capitalize">{log.location}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{log.note}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{log.user}</td>
                        </tr>
                      ))}
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
              <h2 className="text-slate-700 font-semibold text-sm">Damage & Loss Records</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-left font-medium">From Location</th>
                    <th className="px-4 py-3 text-left font-medium">Reason</th>
                    <th className="px-4 py-3 text-left font-medium">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr> :
                    damageLogs.length === 0 ? <tr><td colSpan={6} className="text-center py-4 text-slate-400">No damage records found.</td></tr> :
                      damageLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-500 text-xs">{log.date}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{log.product}</td>
                          <td className="px-4 py-3 text-right font-semibold text-red-500">{log.qty}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs capitalize">{log.location}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{log.note}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{log.user}</td>
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
                  <option value={0}>General Delivery (No Supplier)</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                  <input type="number" min={1} value={receiveForm.qty} onChange={(e) => setReceiveForm({ ...receiveForm, qty: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Unit (Location)</label>
                  <select value={receiveForm.unit} onChange={(e) => setReceiveForm({ ...receiveForm, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="boxes">Boxes (Wholesale)</option>
                    <option value="pcs">Pcs (Retail)</option>
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
                <select value={damageForm.productId} onChange={(e) => setDamageForm({ ...damageForm, productId: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Quantity to Deduct</label>
                  <input type="number" min={1} value={damageForm.qty} onChange={(e) => setDamageForm({ ...damageForm, qty: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">From Location</label>
                  <select value={damageForm.unit} onChange={(e) => setDamageForm({ ...damageForm, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                    <option value="pcs">Retail WH (pcs)</option>
                    <option value="boxes">Wholesale WH (boxes)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Reason</label>
                <input value={damageForm.reason} onChange={(e) => setDamageForm({ ...damageForm, reason: e.target.value })} placeholder="e.g. Crushed packaging, expired" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
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