import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, mockUsers, UserRole } from "../context/AuthContext";
import { LogIn, Eye, EyeOff } from "lucide-react";

const demoPasswords: Record<number, string> = {
  1: "admin123",
  2: "staff123",
  3: "stockman123",
  4: "cashier123",
  5: "customer123",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  staff: "bg-blue-100 text-blue-700 border-blue-200",
  stockman: "bg-green-100 text-green-700 border-green-200",
  cashier: "bg-orange-100 text-orange-700 border-orange-200",
  customer: "bg-slate-100 text-slate-700 border-slate-200",
};

const roleHomeMap: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  staff: "/admin/dashboard",
  stockman: "/stockman/dashboard",
  cashier: "/cashier/dashboard",
  customer: "/customer",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (!user || demoPasswords[user.id] !== password) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      login(user);
      navigate(roleHomeMap[user.role]);
      setLoading(false);
    }, 600);
  };

  const quickLogin = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId)!;
    login(user);
    navigate(roleHomeMap[user.role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #1e1040 0%, #2d1b5e 60%, #1a0f30 100%)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl">🍟</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Kakai's Kutkutin</h1>
          <p className="text-purple-300 text-sm mt-1">Wholesale & Retail Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-slate-800 font-semibold mb-6">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <LogIn size={16} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-slate-400 text-xs mb-3 text-center">Quick Demo Login</p>
            <div className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">{u.avatar}</div>
                    <div className="text-left">
                      <p className="text-slate-700 text-xs font-medium">{u.name}</p>
                      <p className="text-slate-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColors[u.role]}`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-purple-300/60 text-xs mt-5">
          © 2026 Kakai's Kutkutin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
