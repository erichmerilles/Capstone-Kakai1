import React, { useState, useEffect } from "react";
import { ShieldCheck, Check, X, Loader2 } from "lucide-react";

const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost/kakai1_r/api";

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

const permissions: Permission[] = [
  { id: "dash_view", module: "Dashboard", action: "View Dashboard", description: "Access the main dashboard" },
  { id: "pos_access", module: "Daily Operations", action: "Access POS", description: "Use point of sale terminal" },
  { id: "online_orders", module: "Daily Operations", action: "Online Orders", description: "Create and manage online orders" },
  { id: "products_view", module: "Inventory", action: "View Products", description: "View product master list" },
  { id: "products_edit", module: "Inventory", action: "Edit Products", description: "Add, edit, delete products" },
  { id: "receive_shipment", module: "Inventory", action: "Receive Shipment", description: "Receive products from suppliers" },
  { id: "damage_entry", module: "Inventory", action: "Damage/Loss Entry", description: "Record damaged or lost items" },
  { id: "inv_breakdown", module: "Inventory", action: "Bulk Breakdown", description: "Break down wholesale to retail" },
  { id: "stock_transfer", module: "Inventory", action: "Stock Transfer", description: "Transfer stock between locations" },
  { id: "stock_adjust", module: "Inventory", action: "Stock Adjustment", description: "Manually adjust stock counts" },
  { id: "suppliers_view", module: "Inventory", action: "View Suppliers", description: "View supplier directory" },
  { id: "suppliers_edit", module: "Inventory", action: "Edit Suppliers", description: "Add, edit, delete suppliers" },
  { id: "reports_view", module: "Business Intelligence", action: "View Reports", description: "Access profitability reports" },
  { id: "forecast_view", module: "Business Intelligence", action: "View Forecast", description: "Access inventory forecast" },
  { id: "expiry_view", module: "Business Intelligence", action: "Expiry Tracker", description: "View expiry & low stock alerts" },
  { id: "users_view", module: "User Management", action: "View Users", description: "View employee list" },
  { id: "users_edit", module: "User Management", action: "Manage Users", description: "Add, edit, delete users" },
  { id: "rbac_edit", module: "User Management", action: "Manage Access", description: "Edit role permissions" },
  { id: "activity_view", module: "Activity Log", action: "View Activity Log", description: "Access system activity logs" },
];

const roles = ["Administrator", "Stockman", "Cashier"];
const modules = [...new Set(permissions.map((p) => p.module))];

export default function AccessControl() {
  const [access, setAccess] = useState<Record<string, Record<string, boolean>>>({});
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load the permissions from the MySQL database when the page loads
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/get_permissions.php`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          // Force Administrator to always have all permissions locally
          data.Administrator = Object.fromEntries(permissions.map((p) => [p.id, true]));
          setAccess(data);
        } else {
          console.error("Failed to fetch permissions");
        }
      } catch (error) {
        console.error("Error loading permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const toggle = (role: string, permId: string) => {
    if (role === "Administrator") return; // Admin always has all access
    setAccess((prev) => ({
      ...prev,
      [role]: { ...prev[role], [permId]: !prev[role]?.[permId] },
    }));
  };

  // 2. Save exactly what is checked to the MySQL database
  const handleSave = async () => {
    try {
      setSaved(true); // Temporarily show saving state

      const response = await fetch(`${API_URL}/auth/update_permissions.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(access)
      });

      if (!response.ok) throw new Error("Failed to save to database");

      // Broadcast an event so the Sidebar (if still listening) instantly knows permissions changed
      window.dispatchEvent(new Event("rbacUpdated"));

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("Failed to save permissions to the database. Check your connection.");
      setSaved(false);
    }
  };

  // Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-slate-500">Loading access controls...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Access Control (RBAC)</h1>
          <p className="text-slate-400 text-sm">Manage role-based access control for all system features</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <ShieldCheck size={16} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-amber-700 text-xs"><span className="font-semibold">Note:</span> Administrator always has full access to all features and cannot be restricted.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-slate-500 text-xs font-medium w-64">Permission</th>
                {roles.map((r) => (
                  <th key={r} className="px-4 py-3 text-center text-xs font-medium min-w-24">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r === "Administrator" ? "bg-purple-100 text-purple-700" :
                        r === "Stockman" ? "bg-green-100 text-green-700" :
                          "bg-orange-100 text-orange-700"
                      }`}>{r}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <React.Fragment key={mod}>
                  <tr className="bg-slate-50/80">
                    <td colSpan={roles.length + 1} className="px-4 py-2">
                      <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{mod}</span>
                    </td>
                  </tr>
                  {permissions.filter((p) => p.module === mod).map((perm) => (
                    <tr key={perm.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="text-slate-700 text-xs font-medium">{perm.action}</p>
                        <p className="text-slate-400 text-xs">{perm.description}</p>
                      </td>
                      {roles.map((role) => (
                        <td key={role} className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggle(role, perm.id)}
                            disabled={role === "Administrator"}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${access[role]?.[perm.id]
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                              } ${role === "Administrator" ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {access[role]?.[perm.id] ? <Check size={13} /> : <X size={13} />}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}