import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import { LogIn, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kakai1_r/api";

const roleHomeMap: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  stockman: "/stockman/dashboard",
  cashier: "/cashier/dashboard",
  customer: "/customer",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Changed from email to username to match the database
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures the PHP session cookie is saved in the browser
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Pass the user data from PHP directly to the AuthContext
        login(data.user);

        // Route them to the correct dashboard based on their role
        const destination = roleHomeMap[data.user.role as UserRole] || "/login";
        navigate(destination);
      } else {
        // Display the error message sent from PHP (e.g., "Invalid password")
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Cannot connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
              <label className="block text-slate-600 text-sm mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-slate-800"
                placeholder="Enter your username"
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
        </div>

        <p className="text-center text-purple-300/60 text-xs mt-5">
          © 2026 Kakai's Kutkutin. All rights reserved.
        </p>
      </div>
    </div>
  );
}