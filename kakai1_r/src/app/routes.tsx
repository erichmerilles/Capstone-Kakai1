import { createBrowserRouter, Navigate } from "react-router";
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
  {
    path: "/admin",
    // Protect the entire /admin section. Only admins get past this line.
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <Layout />, // Apply the sidebar layout to all valid admin routes
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
          { path: "dashboard", element: <StockmanDashboard /> },
          { path: "products", element: <ProductMasterList /> },
          { path: "receive-return", element: <ReceiveReturn /> },
          { path: "inventory-control", element: <InventoryControl /> },
          { path: "suppliers", element: <SupplierDirectory /> },
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
          { path: "dashboard", element: <CashierDashboard /> },
          { path: "pos", element: <POS /> },
          { path: "online-orders", element: <OnlineOrders /> },
          { path: "store-shelf", element: <StoreShelf /> },
        ]
      }
    ],
  },
]);