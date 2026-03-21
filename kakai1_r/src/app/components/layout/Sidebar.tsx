import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  Users, LogOut, ChevronDown, ChevronRight,
  ClipboardList, Truck, Warehouse, TrendingUp,
  AlertTriangle, UserCheck, Activity, Store,
  MessageSquare, BoxSelect, ShieldCheck, ArrowLeftRight,
  ReceiptText, Layers
} from "lucide-react";
import { useAuth, UserRole } from "../../context/AuthContext";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

function getNavItems(role: UserRole): NavItem[] {
  const dailyOps: NavItem = {
    label: "Daily Operations",
    icon: <ShoppingCart size={16} />,
    children: [
      { label: "Point of Sale", path: `/${role}/pos`, icon: <ReceiptText size={15} /> },
      { label: "Online Orders", path: `/${role}/online-orders`, icon: <MessageSquare size={15} /> },
    ],
  };

  const inventoryLogistics: NavItem = {
    label: "Inventory & Logistics",
    icon: <Warehouse size={16} />,
    children: [
      { label: "Product Master List", path: `/${role}/products`, icon: <Package size={15} /> },
      { label: "Receive & Return", path: `/${role}/receive-return`, icon: <Truck size={15} /> },
      { label: "Inventory Control", path: `/${role}/inventory-control`, icon: <BoxSelect size={15} /> },
      { label: "Supplier Directory", path: `/${role}/suppliers`, icon: <Layers size={15} /> },
    ],
  };

  const businessIntel: NavItem = {
    label: "Business Intelligence",
    icon: <BarChart3 size={16} />,
    children: [
      { label: "Profitability Reports", path: `/admin/profitability`, icon: <TrendingUp size={15} /> },
      { label: "Inventory Forecast", path: `/admin/forecast`, icon: <ClipboardList size={15} /> },
      { label: "Expiry & Low Stock", path: `/admin/expiry-stocks`, icon: <AlertTriangle size={15} /> },
    ],
  };

  const userMgmt: NavItem = {
    label: "User Management",
    icon: <Users size={16} />,
    children: [
      { label: "User Profiles", path: `/admin/users`, icon: <UserCheck size={15} /> },
      { label: "Access Control", path: `/admin/access-control`, icon: <ShieldCheck size={15} /> },
    ],
  };

  if (role === "admin") {
    return [
      { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
      dailyOps,
      inventoryLogistics,
      businessIntel,
      userMgmt,
      { label: "Activity Log", path: "/admin/activity-log", icon: <Activity size={16} /> },
    ];
  }

  if (role === "stockman") {
    return [
      { label: "Dashboard", path: "/stockman/dashboard", icon: <LayoutDashboard size={16} /> },
      {
        label: "Inventory & Logistics",
        icon: <Warehouse size={16} />,
        children: [
          { label: "Product Master List", path: `/stockman/products`, icon: <Package size={15} /> },
          { label: "Receive & Return", path: `/stockman/receive-return`, icon: <Truck size={15} /> },
          { label: "Inventory Control", path: `/stockman/inventory-control`, icon: <BoxSelect size={15} /> },
          { label: "Supplier Directory", path: `/stockman/suppliers`, icon: <Layers size={15} /> },
        ],
      },
    ];
  }

  if (role === "cashier") {
    return [
      { label: "Dashboard", path: "/cashier/dashboard", icon: <LayoutDashboard size={16} /> },
      {
        label: "Daily Operations",
        icon: <ShoppingCart size={16} />,
        children: [
          { label: "Point of Sale", path: `/cashier/pos`, icon: <ReceiptText size={15} /> },
          { label: "Online Orders", path: `/cashier/online-orders`, icon: <MessageSquare size={15} /> },
        ],
      },
      {
        label: "Inventory View",
        icon: <Store size={16} />,
        children: [
          { label: "Store Shelf Stocks", path: `/cashier/store-shelf`, icon: <Package size={15} /> },
        ],
      },
    ];
  }

  return [];
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
            ${open ? "bg-white/10 text-white" : "text-orange-100/80 hover:bg-white/8 hover:text-white"}`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <span className="flex items-center gap-2.5">
            <span className="opacity-80">{item.icon}</span>
            {item.label}
          </span>
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
        {open && (
          <div className="mt-0.5">
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
          : "text-orange-100/80 hover:bg-white/8 hover:text-white"
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

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const roleLabel: Record<string, string> = {
    admin: "Administrator",
    staff: "Staff",
    stockman: "Stockman",
    cashier: "Cashier",
    customer: "Customer",
  };

  const handleLogout = () => {
    logout();
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
            {user.avatar}
          </div>
          <div>
            <p className="text-white text-xs font-medium leading-tight">{user.name}</p>
            <p className="text-orange-300 text-xs">{roleLabel[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
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
