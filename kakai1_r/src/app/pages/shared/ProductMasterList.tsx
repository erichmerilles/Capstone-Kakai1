import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X, Package } from "lucide-react";

// Point this to your new API folder structure
const API_URL = "http://localhost/kakai1_r/api";

// We define the Product interface here now instead of using mockData
export interface Product {
  id: number;
  name: string;
  category: string;
  barcode: string;
  sellingPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  wholesaleStock: number;
  retailStock: number;
  shelfStock: number;
  expiryDate: string;
  unit: string;
  pcsPerBox: number;
}

export default function ProductMasterList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Products from PHP API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/get_products.php`, {
        credentials: "include", // Required for the auth_guard.php check
      });
      const data = await response.json();

      if (data.success) {
        // Map the database columns to your UI variable names
        const formattedData = data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || "Uncategorized",
          barcode: p.sku,
          sellingPrice: parseFloat(p.selling_price),
          wholesalePrice: parseFloat(p.wholesale_price),
          retailPrice: parseFloat(p.retail_price),
          wholesaleStock: parseInt(p.wholesale_stock),
          retailStock: parseInt(p.retail_stock),
          shelfStock: parseInt(p.shelf_stock),
          expiryDate: p.expiry_date || "",
          unit: p.unit || "pcs",
          pcsPerBox: parseInt(p.pcs_per_box) || 1,
        }));
        setProducts(formattedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run the fetch when the page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openEdit = (p: Product) => { setEditProduct(p); setForm(p); setShowForm(true); };
  const openNew = () => { setEditProduct(null); setForm({ category: "Chicharon", unit: "pcs", pcsPerBox: 24 }); setShowForm(true); };

  // 2. Save Product to PHP API (Handles both Add and Edit)
  const saveProduct = async () => {
    const isEdit = !!editProduct;
    const endpoint = isEdit ? "edit_product.php" : "add_product.php";

    // Prepare data to match your MySQL database columns
    const payload = {
      id: editProduct?.id,
      sku: form.barcode,
      name: form.name,
      category: form.category,
      unit: form.unit,
      pcs_per_box: form.pcsPerBox,
      wholesale_price: form.wholesalePrice,
      retail_price: form.retailPrice,
      selling_price: form.sellingPrice,
      expiry_date: form.expiryDate
    };

    try {
      const response = await fetch(`${API_URL}/products/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        fetchProducts(); // Refresh the list from the database
        setShowForm(false);
      } else {
        alert("Failed to save: " + data.message);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("A network error occurred.");
    }
  };

  // 3. Delete Product via PHP API
  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product permanently?")) return;

    try {
      const response = await fetch(`${API_URL}/products/delete_product.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh the list
      } else {
        alert("Failed to delete: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU/barcode…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
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
                <th className="px-4 py-3 text-left font-medium">SKU/Barcode</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Package size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No products found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
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
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{p.wholesaleStock}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{p.retailStock}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">{p.shelfStock}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{p.expiryDate}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">{p.barcode}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500"><Pencil size={13} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-slate-800 font-semibold">{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">

              {/* Row 1: Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Product Name *</label>
                  <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="e.g. Spicy Peanuts" required />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Barcode / SKU *</label>
                  <input value={form.barcode || ""} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                </div>
              </div>

              {/* Row 2: Categorization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Category</label>
                  <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="e.g. Nuts" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Unit</label>
                  <input value={form.unit || ""} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="e.g. pcs, box" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Pcs per Box</label>
                  <input type="number" value={form.pcsPerBox || ""} onChange={(e) => setForm({ ...form, pcsPerBox: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>

              {/* Row 3: Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Wholesale Price ₱</label>
                  <input type="number" step="0.01" value={form.wholesalePrice || ""} onChange={(e) => setForm({ ...form, wholesalePrice: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Retail Price ₱</label>
                  <input type="number" step="0.01" value={form.retailPrice || ""} onChange={(e) => setForm({ ...form, retailPrice: Number(e.target.value) })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
                </div>
                <div>
                  <label className="text-slate-700 font-medium text-xs mb-1 block">Selling Price ₱ *</label>
                  <input type="number" step="0.01" value={form.sellingPrice || ""} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white font-semibold text-orange-600" required />
                </div>
              </div>

              {/* Row 4: Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Expiry Date</label>
                  <input type="date" value={form.expiryDate || ""} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100">
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