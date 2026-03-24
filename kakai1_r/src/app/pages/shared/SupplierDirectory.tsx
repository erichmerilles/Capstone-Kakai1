import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X, Phone, Mail, MapPin } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";

export interface Supplier {
  id: number;
  name: string;
  contact: string; // Maps to contact_person in DB
  phone: string;
  email: string;
  address: string;
  products: string; // Handled locally for UI
  status: string;   // Handled locally for UI
}

export default function SupplierDirectory() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Suppliers from Database
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/suppliers/get_suppliers.php`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        // Map database columns to match your UI preferences
        const formatted = data.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          contact: s.contact_person || "",
          phone: s.phone || "",
          email: s.email || "",
          address: s.address || "",
          products: s.supplied_products || "General",
          status: s.status || "Active"
        }));
        setSuppliers(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.toLowerCase().includes(search.toLowerCase()) ||
    s.products.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditSupplier(null); setForm({ status: "Active", products: "General Wholesale" }); setShowForm(true); };
  const openEdit = (s: Supplier) => { setEditSupplier(s); setForm(s); setShowForm(true); };

  // 2. Save to Database
  const save = async () => {
    if (!form.name) return alert("Supplier name is required.");

    const endpoint = editSupplier ? "edit_supplier.php" : "add_supplier.php";

    // Package data for your MySQL database
    const payload = {
      id: editSupplier?.id,
      name: form.name,
      contact_person: form.contact,
      phone: form.phone,
      email: form.email,
      address: form.address,
      status: form.status,
      supplied_products: form.products // Pass the products to the DB
    };

    try {
      const response = await fetch(`${API_URL}/suppliers/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        fetchSuppliers(); // Refresh from DB instantly
        setShowForm(false);
      } else {
        alert("Failed: " + data.message);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  // 3. Delete from Database
  const del = async (id: number) => {
    if (!confirm("Delete this supplier?")) return;

    try {
      const response = await fetch(`${API_URL}/suppliers/delete_supplier.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id })
      });
      const data = await response.json();

      if (data.success) {
        fetchSuppliers();
      } else {
        alert("Failed to delete: " + data.message);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Supplier Directory</h1>
          <p className="text-slate-400 text-sm">Manage supplier contacts and product listings</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs">Total Suppliers</p><p className="text-slate-800 font-bold text-2xl mt-1">{suppliers.length}</p></div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs">Active</p><p className="text-green-600 font-bold text-2xl mt-1">{suppliers.filter((s) => s.status === "Active").length}</p></div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs">Inactive</p><p className="text-slate-400 font-bold text-2xl mt-1">{suppliers.filter((s) => s.status === "Inactive").length}</p></div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-slate-400 text-xs">Product Lines</p><p className="text-slate-800 font-bold text-2xl mt-1">12</p></div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, contact, or products…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Supplier</th>
                <th className="px-4 py-3 text-left font-medium">Contact Person</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Products</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">Loading suppliers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">No suppliers found.</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-700 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.contact}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs"><Phone size={12} />{s.phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs"><Mail size={12} />{s.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs"><MapPin size={12} />{s.address}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{s.products}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${s.status === "Active" ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => del(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold">{editSupplier ? "Edit Supplier" : "Add Supplier"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-slate-500 text-xs mb-1 block">Supplier Name</label><input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><label className="text-slate-500 text-xs mb-1 block">Contact Person</label><input value={form.contact || ""} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-slate-500 text-xs mb-1 block">Phone</label><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <div><label className="text-slate-500 text-xs mb-1 block">Email</label><input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              </div>
              <div><label className="text-slate-500 text-xs mb-1 block">Address</label><input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>

              {/* Optional: Kept visually for UI parity, but not saved to the DB */}
              <div><label className="text-slate-500 text-xs mb-1 block">Products Supplied (Display Only)</label><input value={form.products || ""} onChange={(e) => setForm({ ...form, products: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><label className="text-slate-500 text-xs mb-1 block">Status</label>
                <select value={form.status || "Active"} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={save} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}