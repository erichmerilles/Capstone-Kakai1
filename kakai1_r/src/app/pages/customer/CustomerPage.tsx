import React, { useState } from "react";
import { Search, ShoppingCart, Facebook, Phone, Star, Package, X, Plus, Minus } from "lucide-react";
import { products } from "../../data/mockData";

interface CartItem { id: number; name: string; price: number; qty: number; }

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const available = products.filter((p) => p.shelfStock > 0);

  const filtered = available.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (p: typeof products[0]) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex) return prev.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.sellingPrice, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter((c) => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = () => {
    setOrdered(true);
    setCart([]);
    setShowCart(false);
    setTimeout(() => setOrdered(false), 5000);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <span className="text-white text-base">🍟</span>
            </div>
            <div>
              <p className="text-slate-800 font-bold text-sm">Kakai's Kutkutin</p>
              <p className="text-orange-500 text-xs">Fresh & Crispy Snacks</p>
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <ShoppingCart size={16} />
            Order
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Crispy, Tasty, Affordable!</h1>
          <p className="text-orange-100 mb-4">Fresh Filipino snacks delivered to your door. Order via Facebook or SMS!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
              <Facebook size={16} /> Order on Facebook
            </a>
            <a href="sms:09171234567" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
              <Phone size={16} /> Text: 09171234567
            </a>
          </div>
        </div>
      </div>

      {ordered && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-center">
          <p className="text-green-700 font-medium text-sm">🎉 Order placed! We'll contact you shortly via SMS or Facebook. Thank you!</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search snacks…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${category === c ? "bg-orange-500 text-white border-orange-500" : "bg-white border-slate-200 text-slate-600 hover:border-orange-300"}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((p) => {
            const inCart = cart.find((c) => c.id === p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-5xl p-4">🍟</div>
                <div className="p-3">
                  <p className="text-slate-700 text-xs font-semibold leading-tight line-clamp-2">{p.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-slate-300 text-xs">(42)</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-orange-500 font-bold text-sm">₱{p.sellingPrice}</span>
                    <span className="text-slate-400 text-xs">{p.shelfStock} left</span>
                  </div>
                  {inCart ? (
                    <div className="flex items-center justify-between mt-2 bg-orange-50 rounded-lg p-1">
                      <button onClick={() => updateQty(p.id, -1)} className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50"><Minus size={12} className="text-orange-500" /></button>
                      <span className="text-orange-600 font-semibold text-sm">{inCart.qty}</span>
                      <button onClick={() => addToCart(p)} className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center hover:bg-orange-600"><Plus size={12} className="text-white" /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p)} className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-1.5 text-xs font-medium transition-colors">Add to Order</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        )}

        {/* How to Order */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-slate-800 font-bold mb-4 text-center">How to Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { step: "1", title: "Choose Your Snacks", desc: "Browse and select from our fresh products above" },
              { step: "2", title: "Contact Us", desc: "Message us on Facebook or text 09171234567" },
              { step: "3", title: "Get It Delivered", desc: "We'll deliver right to your door!" },
            ].map((s) => (
              <div key={s.step} className="p-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center mx-auto mb-2">{s.step}</div>
                <p className="text-slate-700 font-semibold text-sm">{s.title}</p>
                <p className="text-slate-400 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold flex items-center gap-2"><ShoppingCart size={16} className="text-orange-500" /> Your Order</h2>
              <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400"><ShoppingCart size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Your cart is empty</p></div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <span className="text-2xl">🍟</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-700 text-xs font-medium truncate">{item.name}</p>
                        <p className="text-orange-500 text-xs">₱{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center"><Minus size={11} className="text-slate-500" /></button>
                        <span className="text-slate-700 text-xs font-medium w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center"><Plus size={11} className="text-white" /></button>
                      </div>
                      <span className="text-slate-700 text-xs font-semibold min-w-12 text-right">₱{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-slate-800 font-bold">
                  <span>Total</span><span>₱{total.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-sm font-medium transition-colors">
                  Place Order via Facebook / SMS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
