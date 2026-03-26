import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router"; // Changed to react-router-dom
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  Users, LogOut, ChevronDown, ChevronRight,
  ClipboardList, Truck, Warehouse, TrendingUp,
  AlertTriangle, UserCheck, Activity, Store,
  MessageSquare, BoxSelect, ShieldCheck, ReceiptText, Layers
} from "lucide-react";
import { useAuth, UserRole } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Default permissions so users aren't locked out before the Admin saves RBAC settings
const DEFAULT_RBAC = {
  Cashier: {
    dash_view: true,
    pos_access: true,
    products_view: true, // Needed for Store Shelf View
  },
  Stockman: {
    dash_view: true,
    products_view: true,
    receive_shipment: true,
    stock_adjust: true,
    stock_transfer: true,
    suppliers_view: true,
  }
};

// Dynamically builds the navigation based on the saved RBAC permissions
function getNavItems(role: UserRole, rbac: any): NavItem[] {
  // Map the internal role to the Display Role saved in RBAC
  const roleName = role === "admin" ? "Administrator" : role.charAt(0).toUpperCase() + role.slice(1);

  // Use localStorage RBAC, or fall back to defaults if empty
  const myPerms = rbac[roleName] || DEFAULT_RBAC[roleName as keyof typeof DEFAULT_RBAC] || {};

  // Admin bypasses all checks; others check their specific boolean permission
  const hasPerm = (permId: string) => role === "admin" || myPerms[permId];

  const items: NavItem[] = [];

  if (hasPerm("dash_view")) {
    items.push({ label: "Dashboard", path: `/${role}/dashboard`, icon: <LayoutDashboard size={16} /> });
  }

  // --- DAILY OPERATIONS ---
  const dailyOps: NavItem[] = [];
  if (hasPerm("pos_access")) dailyOps.push({ label: "Point of Sale", path: `/${role}/pos`, icon: <ReceiptText size={15} /> });
  if (hasPerm("online_orders")) dailyOps.push({ label: "Online Orders", path: `/${role}/online-orders`, icon: <MessageSquare size={15} /> });
  if (dailyOps.length > 0) items.push({ label: "Daily Operations", icon: <ShoppingCart size={16} />, children: dailyOps });

  // --- INVENTORY & LOGISTICS ---
  const inventory: NavItem[] = [];
  if (hasPerm("products_view")) {
    // Cashiers use a specialized read-only Store Shelf view for products
    if (role === "cashier") {
      inventory.push({ label: "Store Shelf Stocks", path: `/cashier/store-shelf`, icon: <Package size={15} /> });
    } else {
      inventory.push({ label: "Product Master List", path: `/${role}/products`, icon: <Package size={15} /> });
    }
  }
  if (hasPerm("receive_shipment")) inventory.push({ label: "Receive & Return", path: `/${role}/receive-return`, icon: <Truck size={15} /> });
  if (hasPerm("stock_adjust") || hasPerm("stock_transfer") || hasPerm("inv_breakdown")) {
    inventory.push({ label: "Inventory Control", path: `/${role}/inventory-control`, icon: <BoxSelect size={15} /> });
  }
  if (hasPerm("suppliers_view")) inventory.push({ label: "Supplier Directory", path: `/${role}/suppliers`, icon: <Layers size={15} /> });

  if (inventory.length > 0) {
    items.push({
      label: role === "cashier" && inventory.length === 1 && inventory[0].label.includes("Shelf") ? "Inventory View" : "Inventory & Logistics",
      icon: role === "cashier" && inventory.length === 1 && inventory[0].label.includes("Shelf") ? <Store size={16} /> : <Warehouse size={16} />,
      children: inventory
    });
  }

  // --- BUSINESS INTELLIGENCE ---
  const bi: NavItem[] = [];
  if (hasPerm("reports_view")) bi.push({ label: "Profitability Reports", path: `/admin/profitability`, icon: <TrendingUp size={15} /> });
  if (hasPerm("forecast_view")) bi.push({ label: "Inventory Forecast", path: `/admin/forecast`, icon: <ClipboardList size={15} /> });
  if (hasPerm("expiry_view")) bi.push({ label: "Expiry & Low Stock", path: `/admin/expiry-stocks`, icon: <AlertTriangle size={15} /> });
  if (bi.length > 0) items.push({ label: "Business Intelligence", icon: <BarChart3 size={16} />, children: bi });

  // --- USER MANAGEMENT ---
  const users: NavItem[] = [];
  if (hasPerm("users_view")) users.push({ label: "User Profiles", path: `/admin/users`, icon: <UserCheck size={15} /> });
  if (hasPerm("rbac_edit")) users.push({ label: "Access Control", path: `/admin/access-control`, icon: <ShieldCheck size={15} /> });
  if (users.length > 0) items.push({ label: "User Management", icon: <Users size={16} />, children: users });

  // --- ACTIVITY LOG ---
  if (hasPerm("activity_view")) {
    items.push({ label: "Activity Log", path: "/admin/activity-log", icon: <Activity size={16} /> });
  }

  return items;
}

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some((c) => c.path === location.pathname);
  });

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
            ${open ? "bg-white/10 text-white" : "text-orange-100/80 hover:bg-white/5 hover:text-white"}`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <span className="flex items-center gap-2.5">
            <span className="opacity-80">{item.icon}</span>
            {item.label}
          </span>
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {open && (
          <div className="mt-0.5 space-y-0.5">
            {item.children.map((child) => (
              <NavLink key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = location.pathname === item.path;
  return (
    <Link
      to={item.path!}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
        ${isActive
          ? "bg-orange-500 text-white shadow-md"
          : "text-orange-100/80 hover:bg-white/5 hover:text-white"
        }`}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <span className="opacity-80">{item.icon}</span>
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Lazily initialize state to prevent "No access" from flashing on screen refresh
  const [rbac, setRbac] = useState<any>(() => {
    const storedRbac = localStorage.getItem("kakai_rbac_settings");
    return storedRbac ? JSON.parse(storedRbac) : {};
  });

  useEffect(() => {
    const loadRbac = () => {
      const storedRbac = localStorage.getItem("kakai_rbac_settings");
      if (storedRbac) setRbac(JSON.parse(storedRbac));
    };

    window.addEventListener("rbacUpdated", loadRbac);
    return () => window.removeEventListener("rbacUpdated", loadRbac);
  }, []);

  if (!user) return null;

  const navItems = getNavItems(user.role, rbac);

  const roleLabel: Record<string, string> = {
    admin: "Administrator",
    stockman: "Stockman",
    cashier: "Cashier",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #1e1040 0%, #2d1b5e 100%)" }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-base">🍟</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Kakai's Kutkutin</p>
            <p className="text-orange-300 text-xs">Wholesale & Retail</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">
            {user.avatar || "👤"}
          </div>
          <div>
            <p className="text-white text-xs font-medium leading-tight truncate w-36">{user.name}</p>
            <p className="text-orange-300 text-xs">{roleLabel[user.role] || "Staff"}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.length === 0 ? (
          <p className="text-white/40 text-xs text-center mt-4">No access assigned.</p>
        ) : (
          navItems.map((item) => <NavLink key={item.label} item={item} />)
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-orange-100/80 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}