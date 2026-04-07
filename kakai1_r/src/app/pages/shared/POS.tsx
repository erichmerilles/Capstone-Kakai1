import React, { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ReceiptText, CreditCard, Smartphone, Banknote, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kakai1_r/api";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  selling_price: number;
  shelf_stock: number;
}

interface CartItem extends Product {
  cartQty: number;
  subtotal: number;
}

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash" | "maya">("cash");
  const [amountTendered, setAmountTendered] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ number: string; total: number; change: number } | null>(null);

  // 1. Fetch live products when POS opens
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/get_products.php`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  // 3. Cart Logic
  const addToCart = (product: Product) => {
    if (product.shelf_stock <= 0) {
      alert("This item is out of stock on the store shelf! Please transfer stock from the warehouse first.");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQty >= product.shelf_stock) {
          alert("Cannot add more than available shelf stock.");
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQty: item.cartQty + 1, subtotal: (item.cartQty + 1) * item.selling_price }
            : item
        );
      }
      return [...prev, { ...product, cartQty: 1, subtotal: Number(product.selling_price) }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.cartQty + delta;
        if (newQty < 1) return item;
        if (newQty > item.shelf_stock) {
          alert("Cannot exceed available shelf stock.");
          return item;
        }
        return { ...item, cartQty: newQty, subtotal: newQty * item.selling_price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // 4. Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const change = paymentMethod === "cash" ? Number(amountTendered) - cartTotal : 0;
  const isTenderValid = paymentMethod !== "cash" || (Number(amountTendered) >= cartTotal && cartTotal > 0);

  // 5. Submit Transaction
  const processPayment = async () => {
    if (cart.length === 0) return alert("Cart is empty.");
    if (!isTenderValid) return alert("Invalid amount tendered.");

    setIsProcessing(true);

    const payload = {
      cart: cart.map(item => ({
        id: item.id,
        quantity: item.cartQty,
        price: item.selling_price
      })),
      total_amount: cartTotal,
      payment_method: paymentMethod
    };

    try {
      const response = await fetch(`${API_URL}/pos/create_sale.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setReceipt({
          number: data.receipt_number,
          total: cartTotal,
          change: change
        });

        fetchProducts(); // Refresh stock levels instantly!

        // Auto-close receipt after 3 seconds exactly like the initial design
        setTimeout(() => {
          setCart([]);
          setAmountTendered("");
          setReceipt(null);
        }, 3000);

      } else {
        alert("Transaction Failed: " + data.message);
      }
    } catch (error) {
      alert("Network error during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full">
      {/* Restored Header Design */}
      <div className="mb-4">
        <h1 className="text-slate-800 text-xl font-bold">Point of Sale</h1>
        <p className="text-slate-400 text-sm">Kakai's Kutkutin – POS Terminal</p>
      </div>

      {/* Restored Auto-Closing Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-xs w-full mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={28} className="text-green-500" />
            </div>
            <h2 className="text-slate-800 font-bold text-lg">Payment Successful!</h2>
            <p className="text-slate-500 text-sm mt-1">{receipt.number}</p>
            <p className="text-slate-800 font-bold text-2xl mt-3">₱{receipt.total.toFixed(2)}</p>
            {paymentMethod === "cash" && receipt.change >= 0 && (
              <p className="text-green-600 text-sm mt-1">Change: ₱{receipt.change.toFixed(2)}</p>
            )}
            <p className="text-slate-400 text-xs mt-3">Receipt printing…</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-180px)]">
        {/* Product Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, category, or barcode…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.shelf_stock <= 0}
                  className="bg-white border border-slate-100 rounded-xl p-3 text-left hover:border-orange-300 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {/* Restored Fries Placeholder Box */}
                  <div className="w-full aspect-square bg-orange-50 rounded-lg flex items-center justify-center mb-2 text-2xl">🍟</div>
                  <p className="text-slate-700 text-xs font-medium leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-orange-500 font-bold text-sm mt-1">₱{Number(p.selling_price).toFixed(2)}</p>
                  <p className={`text-xs mt-0.5 ${p.shelf_stock < 10 ? "text-red-500" : "text-slate-400"}`}>
                    {p.shelf_stock === 0 ? "Out of stock" : `${p.shelf_stock} left`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restored Cart Panel Design */}
        <div className="w-full lg:w-80 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-slate-700 font-semibold text-sm flex items-center gap-2">
              <ReceiptText size={15} className="text-orange-500" />
              Current Order
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-300">
                <ReceiptText size={32} className="mx-auto mb-2" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2 border-b border-slate-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-xs font-medium truncate">{item.name}</p>
                      <p className="text-orange-500 text-xs">₱{Number(item.selling_price).toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <Minus size={11} />
                      </button>
                      <span className="text-slate-700 text-xs font-medium w-6 text-center">{item.cartQty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="text-right min-w-12">
                      <p className="text-slate-700 text-xs font-semibold">₱{item.subtotal.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="px-4 py-3 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-slate-800">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-bold">₱{cartTotal.toFixed(2)}</span>
            </div>

            {/* Restored 3 Payment Buttons (Cash, GCash, Maya) */}
            <div className="flex gap-2">
              {(["cash", "gcash", "maya"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setPaymentMethod(m); if (m !== "cash") setAmountTendered(cartTotal.toString()); else setAmountTendered(""); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1 ${paymentMethod === m ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-500 hover:border-orange-200"
                    }`}
                >
                  {m === "cash" ? <Banknote size={12} /> : m === "gcash" ? <Smartphone size={12} /> : <CreditCard size={12} />}
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Cash Given</label>
                <input
                  type="number"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  placeholder="₱0.00"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {amountTendered && Number(amountTendered) >= cartTotal && cartTotal > 0 && (
                  <p className="text-green-600 text-xs mt-1">Change: ₱{(Number(amountTendered) - cartTotal).toFixed(2)}</p>
                )}
                {amountTendered && Number(amountTendered) < cartTotal && (
                  <p className="text-red-500 text-xs mt-1">Insufficient cash</p>
                )}
              </div>
            )}

            <button
              onClick={processPayment}
              disabled={cart.length === 0 || !isTenderValid || isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {isProcessing ? "Processing..." : "Process Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}