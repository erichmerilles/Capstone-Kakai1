import React, { useState } from "react";
import { Search, Plus, Minus, Trash2, ReceiptText, CreditCard, Smartphone, Banknote, X } from "lucide-react";
import { products } from "../../data/mockData";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export default function POS() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash" | "maya">("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [receipt, setReceipt] = useState(false);
  const [transId] = useState(() => "TXN-" + Math.floor(Math.random() * 9000 + 1000));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const addToCart = (p: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === p.id);
      if (existing) return prev.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.sellingPrice, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const change = paymentMethod === "cash" ? Number(cashGiven) - total : 0;

  const processPayment = () => {
    if (cart.length === 0) return;
    setReceipt(true);
    setTimeout(() => {
      setCart([]);
      setReceipt(false);
      setCashGiven("");
    }, 3000);
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-slate-800 text-xl font-bold">Point of Sale</h1>
        <p className="text-slate-400 text-sm">Kakai's Kutkutin – POS Terminal</p>
      </div>

      {receipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-xs w-full mx-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={28} className="text-green-500" />
            </div>
            <h2 className="text-slate-800 font-bold text-lg">Payment Successful!</h2>
            <p className="text-slate-500 text-sm mt-1">{transId}</p>
            <p className="text-slate-800 font-bold text-2xl mt-3">₱{total.toFixed(2)}</p>
            {paymentMethod === "cash" && change >= 0 && (
              <p className="text-green-600 text-sm mt-1">Change: ₱{change.toFixed(2)}</p>
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
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.shelfStock === 0}
                  className="bg-white border border-slate-100 rounded-xl p-3 text-left hover:border-orange-300 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="w-full aspect-square bg-orange-50 rounded-lg flex items-center justify-center mb-2 text-2xl">🍟</div>
                  <p className="text-slate-700 text-xs font-medium leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-orange-500 font-bold text-sm mt-1">₱{p.sellingPrice}</p>
                  <p className={`text-xs mt-0.5 ${p.shelfStock < 10 ? "text-red-500" : "text-slate-400"}`}>
                    {p.shelfStock === 0 ? "Out of stock" : `${p.shelfStock} left`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
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
                      <p className="text-orange-500 text-xs">₱{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <Minus size={11} />
                      </button>
                      <span className="text-slate-700 text-xs font-medium w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="text-right min-w-12">
                      <p className="text-slate-700 text-xs font-semibold">₱{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="px-4 py-3 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-slate-800">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-bold">₱{total.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="flex gap-2">
              {(["cash", "gcash", "maya"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1 ${
                    paymentMethod === m ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-500 hover:border-orange-200"
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
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="₱0.00"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {cashGiven && Number(cashGiven) >= total && (
                  <p className="text-green-600 text-xs mt-1">Change: ₱{(Number(cashGiven) - total).toFixed(2)}</p>
                )}
                {cashGiven && Number(cashGiven) < total && (
                  <p className="text-red-500 text-xs mt-1">Insufficient cash</p>
                )}
              </div>
            )}

            <button
              onClick={processPayment}
              disabled={cart.length === 0 || (paymentMethod === "cash" && Number(cashGiven) < total)}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
