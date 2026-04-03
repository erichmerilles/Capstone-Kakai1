import { createBrowserRouter, Navigate, Link } from "react-router";
import { Layout } from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProfitabilityReports from "./pages/admin/ProfitabilityReports";
import InventoryForecast from "./pages/admin/InventoryForecast";
import ExpiryLowStock from "./pages/admin/ExpiryLowStock";
import UserManagement from "./pages/admin/UserManagement";
import AccessControl from "./pages/admin/AccessControl";
import ActivityLog from "./pages/admin/ActivityLog";

// Stockman
import StockmanDashboard from "./pages/stockman/StockmanDashboard";

// Cashier
import CashierDashboard from "./pages/cashier/CashierDashboard";
import StoreShelf from "./pages/cashier/StoreShelf";

// Shared
import POS from "./pages/shared/POS";
import OnlineOrders from "./pages/shared/OnlineOrders";
import ProductMasterList from "./pages/shared/ProductMasterList";
import ReceiveReturn from "./pages/shared/ReceiveReturn";
import InventoryControl from "./pages/shared/InventoryControl";
import SupplierDirectory from "./pages/shared/SupplierDirectory";

// Customer
import CustomerPage from "./pages/customer/CustomerPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  // --- CUSTOMER ROUTES ---
  {
    path: "/customer",
    element: <ProtectedRoute allowedRoles={["customer", "admin"]} />,
    children: [
      { index: true, element: <CustomerPage /> }
    ]
  },

  // --- ADMIN ROUTES ---
  // The Admin group does not need granular locks because the ProtectedRoute automatically bypasses checks for user.role === "admin"
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "pos", element: <POS /> },
          { path: "online-orders", element: <OnlineOrders /> },
          { path: "products", element: <ProductMasterList /> },
          { path: "receive-return", element: <ReceiveReturn /> },
          { path: "inventory-control", element: <InventoryControl /> },
          { path: "suppliers", element: <SupplierDirectory /> },
          { path: "profitability", element: <ProfitabilityReports /> },
          { path: "forecast", element: <InventoryForecast /> },
          { path: "expiry-stocks", element: <ExpiryLowStock /> },
          { path: "users", element: <UserManagement /> },
          { path: "access-control", element: <AccessControl /> },
          { path: "activity-log", element: <ActivityLog /> },
        ]
      }
    ],
  },

  // --- STOCKMAN ROUTES ---
  {
    path: "/stockman",
    element: <ProtectedRoute allowedRoles={["stockman", "admin"]} />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/stockman/dashboard" replace /> },
          // Panelist Note: We don't lock dashboards so users always have a landing page.
          { path: "dashboard", element: <StockmanDashboard /> },

          { path: "products", element: <ProtectedRoute requiredPermission="products_view"><ProductMasterList /></ProtectedRoute> },
          { path: "store-shelf", element: <StoreShelf /> }, // 🔥 Added Store Shelf without granular lock
          { path: "receive-return", element: <ProtectedRoute requiredPermission="receive_shipment"><ReceiveReturn /></ProtectedRoute> },

          // Inventory Control allows access if they have ANY of these 4 permissions
          { path: "inventory-control", element: <ProtectedRoute requiredPermission={["stock_adjust", "stock_transfer", "inv_breakdown", "damage_entry"]}><InventoryControl /></ProtectedRoute> },

          { path: "suppliers", element: <ProtectedRoute requiredPermission="suppliers_view"><SupplierDirectory /></ProtectedRoute> },
          { path: "profitability", element: <ProtectedRoute requiredPermission="reports_view"><ProfitabilityReports /></ProtectedRoute> },
          { path: "forecast", element: <ProtectedRoute requiredPermission="forecast_view"><InventoryForecast /></ProtectedRoute> },
          { path: "expiry-stocks", element: <ProtectedRoute requiredPermission="expiry_view"><ExpiryLowStock /></ProtectedRoute> },
          { path: "users", element: <ProtectedRoute requiredPermission={["users_view", "users_edit"]}><UserManagement /></ProtectedRoute> },
          { path: "access-control", element: <ProtectedRoute requiredPermission="rbac_edit"><AccessControl /></ProtectedRoute> },
          { path: "activity-log", element: <ProtectedRoute requiredPermission="activity_view"><ActivityLog /></ProtectedRoute> },
        ]
      }
    ],
  },

  // --- CASHIER ROUTES ---
  {
    path: "/cashier",
    element: <ProtectedRoute allowedRoles={["cashier", "admin"]} />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/cashier/dashboard" replace /> },
          // Panelist Note: We don't lock dashboards so users always have a landing page.
          { path: "dashboard", element: <CashierDashboard /> },
          { path: "pos", element: <ProtectedRoute requiredPermission="pos_access"><POS /></ProtectedRoute> },
          { path: "online-orders", element: <ProtectedRoute requiredPermission="online_orders"><OnlineOrders /></ProtectedRoute> },
          { path: "store-shelf", element: <StoreShelf /> }, // Keep Store Shelf unlocked

          { path: "products", element: <ProtectedRoute requiredPermission="products_view"><ProductMasterList /></ProtectedRoute> },
          { path: "receive-return", element: <ProtectedRoute requiredPermission="receive_shipment"><ReceiveReturn /></ProtectedRoute> },

          // Inventory Control allows access if they have ANY of these 4 permissions
          { path: "inventory-control", element: <ProtectedRoute requiredPermission={["stock_adjust", "stock_transfer", "inv_breakdown", "damage_entry"]}><InventoryControl /></ProtectedRoute> },

          { path: "suppliers", element: <ProtectedRoute requiredPermission="suppliers_view"><SupplierDirectory /></ProtectedRoute> },
          { path: "profitability", element: <ProtectedRoute requiredPermission="reports_view"><ProfitabilityReports /></ProtectedRoute> },
          { path: "forecast", element: <ProtectedRoute requiredPermission="forecast_view"><InventoryForecast /></ProtectedRoute> },
          { path: "expiry-stocks", element: <ProtectedRoute requiredPermission="expiry_view"><ExpiryLowStock /></ProtectedRoute> },
          { path: "users", element: <ProtectedRoute requiredPermission={["users_view", "users_edit"]}><UserManagement /></ProtectedRoute> },
          { path: "access-control", element: <ProtectedRoute requiredPermission="rbac_edit"><AccessControl /></ProtectedRoute> },
          { path: "activity-log", element: <ProtectedRoute requiredPermission="activity_view"><ActivityLog /></ProtectedRoute> },
        ]
      }
    ],
  },

  // --- CATCH ALL / 404 ROUTE ---
  // Panelist Note: Handles bad URLs cleanly instead of showing a blank screen.
  {
    path: "*",
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <h1 className="text-8xl font-black text-orange-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    )
  }
]);