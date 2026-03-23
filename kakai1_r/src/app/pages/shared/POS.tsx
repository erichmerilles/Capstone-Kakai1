import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, Receipt, Plus, Minus, PackageOpen } from "lucide-react";

const API_URL = "http://localhost/kakai1_r/api";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  selling_price: number;
  shelf_stock: number; // We specifically check shelf stock for the POS!
}

interface CartItem extends Product {
  cartQty: number;
  subtotal: number;
}

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
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
        if (newQty < 1) return item; // Use remove function instead
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
  const change = Number(amountTendered) - cartTotal;
  const isTenderValid = paymentMethod === "gcash" || (Number(amountTendered) >= cartTotal && cartTotal > 0);

  // 5. Submit Transaction
  const handleCheckout = async () => {
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
          change: paymentMethod === "cash" ? change : 0
        });
        setCart([]);
        setAmountTendered("");
        fetchProducts(); // Refresh stock levels instantly!
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
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">

      {/* LEFT PANEL: Product Selection */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Scan barcode or search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={p.shelf_stock <= 0}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all ${p.shelf_stock > 0
                    ? "border-slate-200 hover:border-orange-400 hover:shadow-md bg-white cursor-pointer"
                    : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                  }`}
              >
                <span className="text-xs text-slate-400 mb-1 font-mono">{p.sku}</span>
                <span className="font-semibold text-slate-800 text-sm line-clamp-2 flex-1">{p.name}</span>
                <div className="mt-3 flex items-end justify-between w-full">
                  <span className="text-orange-600 font-bold">₱{Number(p.selling_price).toFixed(2)}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${p.shelf_stock > 10 ? "bg-green-100 text-green-700" :
                      p.shelf_stock > 0 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                    }`}>
                    {p.shelf_stock} left
                  </span>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center text-slate-400">
                <PackageOpen size={48} className="opacity-20 mb-3" />
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Current Cart & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingCart size={18} /> Current Order
          </div>
          <span className="bg-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{cart.length} items</span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart size={40} className="opacity-20 mb-3" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 items-center pb-3 border-b border-slate-50 last:border-0">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 leading-tight">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">₱{Number(item.selling_price).toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-600"><Minus size={14} /></button>
                  <span className="text-sm font-semibold w-6 text-center">{item.cartQty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-600"><Plus size={14} /></button>
                </div>
                <div className="text-right min-w-[4rem]">
                  <p className="text-sm font-bold text-slate-800">₱{item.subtotal.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">

          <div className="flex justify-between items-center text-lg font-bold text-slate-800">
            <span>Total:</span>
            <span className="text-2xl text-orange-600">₱{cartTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${paymentMethod === "cash" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-300"}`}
              >
                Cash
              </button>
              <button
                onClick={() => { setPaymentMethod("gcash"); setAmountTendered(cartTotal.toString()); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${paymentMethod === "gcash" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300"}`}
              >
                GCash / Online
              </button>
            </div>

            {paymentMethod === "cash" && (
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Amount Tendered (Cash)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₱</span>
                  <input
                    type="number"
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-400 focus:outline-none font-semibold text-lg"
                    placeholder="0.00"
                  />
                </div>
                {Number(amountTendered) > 0 && (
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-500">Change:</span>
                    <span className={`font-bold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                      ₱{change >= 0 ? change.toFixed(2) : "0.00"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !isTenderValid || isProcessing}
            className="w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <CreditCard size={20} />
            {isProcessing ? "Processing..." : "Complete Payment"}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Payment Successful!</h2>
            <p className="text-slate-500 text-sm mb-6">Receipt: {receipt.number}</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Total Paid</span>
                <span className="font-bold text-slate-800">₱{receipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 text-sm">Change Due</span>
                <span className="font-bold text-green-600">₱{receipt.change.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setReceipt(null)}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}

    </div>
  );
}