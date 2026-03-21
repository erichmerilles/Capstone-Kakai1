import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { products as initialProducts, Product } from "../../data/mockData";

export default function ProductMasterList() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openEdit = (p: Product) => { setEditProduct(p); setForm(p); setShowForm(true); };
  const openNew = () => { setEditProduct(null); setForm({ category: "Chicharon", unit: "pcs", pcsPerBox: 24 }); setShowForm(true); };

  const saveProduct = () => {
    if (editProduct) {
      setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...form } as Product : p));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...form, id: newId } as Product]);
    }
    setShowForm(false);
  };

  const deleteProduct = (id: number) => {
    if (confirm("Delete this product?")) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Product Master List</h1>
          <p className="text-slate-400 text-sm">All products with pricing and stock information</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or barcode…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-700">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Wholesale ₱</th>
                <th className="px-4 py-3 text-right font-medium">Retail ₱</th>
                <th className="px-4 py-3 text-right font-medium">Selling ₱</th>
                <th className="px-4 py-3 text-right font-medium">WH (boxes)</th>
                <th className="px-4 py-3 text-right font-medium">Retail (pcs)</th>
                <th className="px-4 py-3 text-right font-medium">Shelf (pcs)</th>
                <th className="px-4 py-3 text-left font-medium">Expiry</th>
                <th className="px-4 py-3 text-left font-medium">Barcode</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => {
                const today = new Date();
                const diff = (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                const expiryClass = diff <= 30 ? "text-red-500 font-semibold" : "text-slate-500";
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm flex-shrink-0">🍟</div>
                        <span className="text-slate-700 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{p.category}</span></td>
                    <td className="px-4 py-3 text-right text-slate-700">₱{p.wholesalePrice}</td>
                    <td className="px-4 py-3 text-right text-slate-700">₱{p.retailPrice}</td>
                    <td className="px-4 py-3 text-right font-semibold text-orange-600">₱{p.sellingPrice}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.wholesaleStock < 5 ? "text-red-500" : "text-slate-700"}`}>{p.wholesaleStock}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.retailStock < 30 ? "text-amber-500" : "text-slate-700"}`}>{p.retailStock}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.shelfStock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.shelfStock}</td>
                    <td className={`px-4 py-3 text-xs ${expiryClass}`}>{p.expiryDate}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{p.barcode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500"><Pencil size={13} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No products found</p></div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-slate-400 text-xs">Showing {filtered.length} of {products.length} products</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-slate-800 font-semibold">{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Product Name</label>
                <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Category</label>
                  <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Unit</label>
                  <input value={form.unit || ""} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Wholesale ₱</label>
                  <input type="number" value={form.wholesalePrice || ""} onChange={(e) => setForm({ ...form, wholesalePrice: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Retail ₱</label>
                  <input type="number" value={form.retailPrice || ""} onChange={(e) => setForm({ ...form, retailPrice: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Selling ₱</label>
                  <input type="number" value={form.sellingPrice || ""} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Expiry Date</label>
                  <input type="date" value={form.expiryDate || ""} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Barcode</label>
                  <input value={form.barcode || ""} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Pcs per Box</label>
                <input type="number" value={form.pcsPerBox || ""} onChange={(e) => setForm({ ...form, pcsPerBox: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={saveProduct} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
