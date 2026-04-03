import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  Users, LogOut, ChevronDown, ChevronRight,
  ClipboardList, Truck, Warehouse, TrendingUp,
  AlertTriangle, UserCheck, Activity, Store,
  MessageSquare, BoxSelect, ShieldCheck, ReceiptText, Layers
} from "lucide-react";
import { useAuth, UserRole, User } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Dynamically builds the navigation based ONLY on the database permissions
function getNavItems(user: User): NavItem[] {
  const role = user.role;

  // 1. Master Permission Checker: Reads directly from the DB array attached to the user
  const hasPerm = (permId: string) => {
    if (role === "admin") return true; // Admins always have all access
    return user.permissions && user.permissions.includes(permId);
  };

  const items: NavItem[] = [];

  // --- DASHBOARD ---
  // Everyone gets their dashboard as a fallback landing page
  if (hasPerm("dash_view") || ["admin", "stockman", "cashier"].includes(role)) {
    items.push({ label: "Dashboard", path: `/${role}/dashboard`, icon: <LayoutDashboard size={16} /> });
  }

  // --- DAILY OPERATIONS ---
  const dailyOps: NavItem[] = [];
  if (hasPerm("pos_access")) {
    dailyOps.push({ label: "Point of Sale", path: `/${role}/pos`, icon: <ReceiptText size={15} /> });
  }
  if (hasPerm("online_orders")) {
    dailyOps.push({ label: "Online Orders", path: `/${role}/online-orders`, icon: <MessageSquare size={15} /> });
  }

  // Only render parent folder if there are items inside
  if (dailyOps.length > 0) {
    items.push({ label: "Daily Operations", icon: <ShoppingCart size={16} />, children: dailyOps });
  }

  // --- INVENTORY & LOGISTICS ---
  const inventory: NavItem[] = [];

  // 1. Store Shelf is a default operational view for Cashier
  if (["cashier"].includes(role)) {
    inventory.push({ label: "Store Shelf Stocks", path: `/${role}/store-shelf`, icon: <Store size={15} /> });
  }

  // 2. Product Master List is strictly controlled by the 'products_view' permission
  if (hasPerm("products_view")) {
    inventory.push({ label: "Product Master List", path: `/${role}/products`, icon: <Package size={15} /> });
  }

  if (hasPerm("receive_shipment")) {
    inventory.push({ label: "Receive & Return", path: `/${role}/receive-return`, icon: <Truck size={15} /> });
  }

  // Inventory Control encompasses adjustments, transfers, breakdowns, and damage entry
  if (hasPerm("stock_adjust") || hasPerm("stock_transfer") || hasPerm("inv_breakdown") || hasPerm("damage_entry")) {
    inventory.push({ label: "Inventory Control", path: `/${role}/inventory-control`, icon: <BoxSelect size={15} /> });
  }

  if (hasPerm("suppliers_view")) {
    inventory.push({ label: "Supplier Directory", path: `/${role}/suppliers`, icon: <Layers size={15} /> });
  }

  // Only render parent folder if there are items inside
  if (inventory.length > 0) {
    items.push({ label: "Inventory & Logistics", icon: <Warehouse size={16} />, children: inventory });
  }

  // --- BUSINESS INTELLIGENCE ---
  const bi: NavItem[] = [];
  if (hasPerm("reports_view")) {
    bi.push({ label: "Profitability Reports", path: `/${role}/profitability`, icon: <TrendingUp size={15} /> });
  }
  if (hasPerm("forecast_view")) {
    bi.push({ label: "Inventory Forecast", path: `/${role}/forecast`, icon: <ClipboardList size={15} /> });
  }
  if (hasPerm("expiry_view")) {
    bi.push({ label: "Expiry & Low Stock", path: `/${role}/expiry-stocks`, icon: <AlertTriangle size={15} /> });
  }

  // Only render parent folder if there are items inside
  if (bi.length > 0) {
    items.push({ label: "Business Intelligence", icon: <BarChart3 size={16} />, children: bi });
  }

  // --- USER MANAGEMENT ---
  const users: NavItem[] = [];
  if (hasPerm("users_view") || hasPerm("users_edit")) {
    users.push({ label: "User Profiles", path: `/${role}/users`, icon: <UserCheck size={15} /> });
  }
  if (hasPerm("rbac_edit")) {
    users.push({ label: "Access Control", path: `/${role}/access-control`, icon: <ShieldCheck size={15} /> });
  }

  // Only render parent folder if there are items inside
  if (users.length > 0) {
    items.push({ label: "User Management", icon: <Users size={16} />, children: users });
  }

  // --- ACTIVITY LOG ---
  if (hasPerm("activity_view")) {
    items.push({ label: "Activity Log", path: `/${role}/activity-log`, icon: <Activity size={16} /> });
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

  // NO MORE LOCAL STORAGE - The Sidebar is completely driven by the database session now
  if (!user) return null;

  // 2. Pass the entire user object down to map the permissions
  const navItems = getNavItems(user);

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