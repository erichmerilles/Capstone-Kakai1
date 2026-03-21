// ─── Products ───────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  wholesalePrice: number;
  retailPrice: number;
  sellingPrice: number;
  wholesaleStock: number; // boxes
  retailStock: number;    // pcs
  shelfStock: number;     // pcs
  expiryDate: string;
  supplierId: number;
  barcode: string;
  pcsPerBox: number;
}

export const products: Product[] = [
  { id: 1, name: "Kakai Chicharon Original", category: "Chicharon", unit: "pcs", wholesalePrice: 350, retailPrice: 45, sellingPrice: 55, wholesaleStock: 24, retailStock: 180, shelfStock: 48, expiryDate: "2025-04-10", supplierId: 1, barcode: "8001234567890", pcsPerBox: 24 },
  { id: 2, name: "Kakai Chicharon Spicy", category: "Chicharon", unit: "pcs", wholesalePrice: 360, retailPrice: 46, sellingPrice: 56, wholesaleStock: 18, retailStock: 144, shelfStock: 36, expiryDate: "2025-04-15", supplierId: 1, barcode: "8001234567891", pcsPerBox: 24 },
  { id: 3, name: "Kutkutin Crackers Cheese", category: "Crackers", unit: "pcs", wholesalePrice: 280, retailPrice: 35, sellingPrice: 42, wholesaleStock: 32, retailStock: 256, shelfStock: 60, expiryDate: "2025-06-20", supplierId: 2, barcode: "8001234567892", pcsPerBox: 30 },
  { id: 4, name: "Kutkutin Crackers Garlic", category: "Crackers", unit: "pcs", wholesalePrice: 280, retailPrice: 35, sellingPrice: 42, wholesaleStock: 4, retailStock: 32, shelfStock: 8, expiryDate: "2025-03-30", supplierId: 2, barcode: "8001234567893", pcsPerBox: 30 },
  { id: 5, name: "Pinipig Crunch", category: "Pinipig", unit: "pcs", wholesalePrice: 200, retailPrice: 28, sellingPrice: 35, wholesaleStock: 15, retailStock: 90, shelfStock: 24, expiryDate: "2025-07-01", supplierId: 3, barcode: "8001234567894", pcsPerBox: 20 },
  { id: 6, name: "Cornick BBQ", category: "Cornick", unit: "pcs", wholesalePrice: 240, retailPrice: 32, sellingPrice: 40, wholesaleStock: 2, retailStock: 18, shelfStock: 5, expiryDate: "2025-03-25", supplierId: 3, barcode: "8001234567895", pcsPerBox: 24 },
  { id: 7, name: "Peanut Butter Bar", category: "Candy", unit: "pcs", wholesalePrice: 180, retailPrice: 22, sellingPrice: 28, wholesaleStock: 40, retailStock: 320, shelfStock: 80, expiryDate: "2025-08-15", supplierId: 4, barcode: "8001234567896", pcsPerBox: 24 },
  { id: 8, name: "Choco Mallows", category: "Candy", unit: "pcs", wholesalePrice: 220, retailPrice: 28, sellingPrice: 35, wholesaleStock: 0, retailStock: 12, shelfStock: 6, expiryDate: "2025-05-10", supplierId: 4, barcode: "8001234567897", pcsPerBox: 24 },
  { id: 9, name: "Rice Puffs Plain", category: "Puffs", unit: "pcs", wholesalePrice: 160, retailPrice: 20, sellingPrice: 26, wholesaleStock: 28, retailStock: 200, shelfStock: 55, expiryDate: "2025-09-01", supplierId: 5, barcode: "8001234567898", pcsPerBox: 20 },
  { id: 10, name: "Rice Puffs Adobo", category: "Puffs", unit: "pcs", wholesalePrice: 165, retailPrice: 21, sellingPrice: 27, wholesaleStock: 22, retailStock: 165, shelfStock: 42, expiryDate: "2025-09-05", supplierId: 5, barcode: "8001234567899", pcsPerBox: 20 },
];

// ─── Suppliers ───────────────────────────────────────────────────────────────
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  products: string;
  status: "Active" | "Inactive";
}

export const suppliers: Supplier[] = [
  { id: 1, name: "Crispy Bites Corp.", contact: "Ramon Cruz", phone: "09171234567", email: "ramon@crispybites.com", address: "123 Macapagal Ave, Pasay", products: "Chicharon variants", status: "Active" },
  { id: 2, name: "Golden Crackers Inc.", contact: "Linda Tan", phone: "09281234567", email: "linda@goldencrackers.com", address: "456 Rizal St, Quezon City", products: "Cracker variants", status: "Active" },
  { id: 3, name: "Agri-Snacks PH", contact: "Ben Mercado", phone: "09391234567", email: "ben@agrisnacks.ph", address: "789 Kalayaan Ave, Makati", products: "Pinipig, Cornick", status: "Active" },
  { id: 4, name: "Sweet Treats Manila", contact: "Cathy Santos", phone: "09501234567", email: "cathy@sweettreats.ph", address: "321 Buendia Ave, Makati", products: "Peanut Butter Bar, Choco Mallows", status: "Active" },
  { id: 5, name: "Puff Masters Co.", contact: "Dino Lim", phone: "09611234567", email: "dino@puffmasters.com", address: "654 Shaw Blvd, Mandaluyong", products: "Rice Puffs variants", status: "Inactive" },
];

// ─── Sales / Transactions ─────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  date: string;
  cashier: string;
  items: { productId: number; name: string; qty: number; price: number }[];
  total: number;
  type: "walk-in" | "online";
  source?: string;
  paymentMethod: "cash" | "gcash" | "maya";
}

export const transactions: Transaction[] = [
  { id: "TXN-001", date: "2026-03-21", cashier: "Ana Villanueva", items: [{ productId: 1, name: "Kakai Chicharon Original", qty: 3, price: 55 }, { productId: 3, name: "Kutkutin Crackers Cheese", qty: 2, price: 42 }], total: 249, type: "walk-in", paymentMethod: "cash" },
  { id: "TXN-002", date: "2026-03-21", cashier: "Ana Villanueva", items: [{ productId: 2, name: "Kakai Chicharon Spicy", qty: 5, price: 56 }], total: 280, type: "online", source: "Facebook", paymentMethod: "gcash" },
  { id: "TXN-003", date: "2026-03-20", cashier: "Ana Villanueva", items: [{ productId: 7, name: "Peanut Butter Bar", qty: 10, price: 28 }, { productId: 9, name: "Rice Puffs Plain", qty: 4, price: 26 }], total: 384, type: "walk-in", paymentMethod: "cash" },
  { id: "TXN-004", date: "2026-03-20", cashier: "Ana Villanueva", items: [{ productId: 5, name: "Pinipig Crunch", qty: 6, price: 35 }], total: 210, type: "online", source: "SMS", paymentMethod: "maya" },
  { id: "TXN-005", date: "2026-03-19", cashier: "Ana Villanueva", items: [{ productId: 1, name: "Kakai Chicharon Original", qty: 2, price: 55 }, { productId: 2, name: "Kakai Chicharon Spicy", qty: 2, price: 56 }], total: 222, type: "walk-in", paymentMethod: "cash" },
];

// ─── Weekly Sales Data ─────────────────────────────────────────────────────
export const weeklySales = [
  { day: "Mon", sales: 1850, profit: 540 },
  { day: "Tue", sales: 2200, profit: 680 },
  { day: "Wed", sales: 1650, profit: 490 },
  { day: "Thu", sales: 2900, profit: 870 },
  { day: "Fri", sales: 3400, profit: 1020 },
  { day: "Sat", sales: 4100, profit: 1230 },
  { day: "Sun", sales: 2600, profit: 780 },
];

export const monthlySales = [
  { month: "Jan", sales: 48000, profit: 14400 },
  { month: "Feb", sales: 52000, profit: 15600 },
  { month: "Mar", sales: 61000, profit: 18300 },
  { month: "Apr", sales: 55000, profit: 16500 },
  { month: "May", sales: 67000, profit: 20100 },
  { month: "Jun", sales: 72000, profit: 21600 },
  { month: "Jul", sales: 69000, profit: 20700 },
  { month: "Aug", sales: 78000, profit: 23400 },
  { month: "Sep", sales: 83000, profit: 24900 },
  { month: "Oct", sales: 91000, profit: 27300 },
  { month: "Nov", sales: 105000, profit: 31500 },
  { month: "Dec", sales: 120000, profit: 36000 },
];

export const categoryRevenue = [
  { name: "Chicharon", value: 38 },
  { name: "Crackers", value: 22 },
  { name: "Candy", value: 18 },
  { name: "Puffs", value: 12 },
  { name: "Pinipig", value: 6 },
  { name: "Cornick", value: 4 },
];

// ─── Stock Movements ─────────────────────────────────────────────────────────
export interface StockMovement {
  id: number;
  date: string;
  product: string;
  type: "Receive" | "Breakdown" | "Transfer" | "Adjustment" | "Sale";
  from: string;
  to: string;
  qty: number;
  unit: string;
  note: string;
  user: string;
}

export const stockMovements: StockMovement[] = [
  { id: 1, date: "2026-03-21 08:30", product: "Kakai Chicharon Original", type: "Receive", from: "Supplier", to: "Wholesale", qty: 10, unit: "boxes", note: "Delivery from Crispy Bites Corp.", user: "Carlos Dela Cruz" },
  { id: 2, date: "2026-03-21 09:00", product: "Kutkutin Crackers Cheese", type: "Breakdown", from: "Wholesale", to: "Retail", qty: 5, unit: "boxes", note: "Bulk breakdown 5 boxes → 150 pcs", user: "Carlos Dela Cruz" },
  { id: 3, date: "2026-03-21 10:15", product: "Kakai Chicharon Spicy", type: "Transfer", from: "Retail", to: "Store Shelf", qty: 48, unit: "pcs", note: "Restocking store shelf", user: "Ana Villanueva" },
  { id: 4, date: "2026-03-20 14:00", product: "Cornick BBQ", type: "Adjustment", from: "Store Shelf", to: "Store Shelf", qty: -3, unit: "pcs", note: "Damaged items removed", user: "Carlos Dela Cruz" },
  { id: 5, date: "2026-03-20 11:30", product: "Peanut Butter Bar", type: "Transfer", from: "Retail", to: "Store Shelf", qty: 24, unit: "pcs", note: "Daily restocking", user: "Ana Villanueva" },
  { id: 6, date: "2026-03-19 09:00", product: "Rice Puffs Plain", type: "Receive", from: "Supplier", to: "Wholesale", qty: 8, unit: "boxes", note: "Delivery from Puff Masters Co.", user: "Carlos Dela Cruz" },
];

// ─── Damage / Loss ─────────────────────────────────────────────────────────
export interface DamageEntry {
  id: number;
  date: string;
  product: string;
  qty: number;
  unit: string;
  reason: string;
  recordedBy: string;
  status: "Confirmed" | "Pending";
}

export const damageEntries: DamageEntry[] = [
  { id: 1, date: "2026-03-20", product: "Cornick BBQ", qty: 3, unit: "pcs", reason: "Crushed packaging", recordedBy: "Carlos Dela Cruz", status: "Confirmed" },
  { id: 2, date: "2026-03-19", product: "Choco Mallows", qty: 5, unit: "pcs", reason: "Expired - pulled from shelf", recordedBy: "Ana Villanueva", status: "Confirmed" },
  { id: 3, date: "2026-03-18", product: "Kutkutin Crackers Garlic", qty: 2, unit: "pcs", reason: "Torn packaging", recordedBy: "Carlos Dela Cruz", status: "Pending" },
];

// ─── Users / Employees ─────────────────────────────────────────────────────
export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  dateHired: string;
  lastLogin: string;
}

export const employees: Employee[] = [
  { id: 1, name: "Maria Santos", email: "admin@kakai.com", phone: "09171111111", role: "Administrator", status: "Active", dateHired: "2020-01-15", lastLogin: "2026-03-21 08:02" },
  { id: 2, name: "Jose Reyes", email: "staff@kakai.com", phone: "09281111111", role: "Staff", status: "Active", dateHired: "2022-06-01", lastLogin: "2026-03-20 13:45" },
  { id: 3, name: "Carlos Dela Cruz", email: "stockman@kakai.com", phone: "09391111111", role: "Stockman", status: "Active", dateHired: "2021-03-10", lastLogin: "2026-03-21 07:55" },
  { id: 4, name: "Ana Villanueva", email: "cashier@kakai.com", phone: "09501111111", role: "Cashier", status: "Active", dateHired: "2023-01-20", lastLogin: "2026-03-21 08:10" },
  { id: 5, name: "Ben Torres", email: "ben@kakai.com", phone: "09611111111", role: "Cashier", status: "Inactive", dateHired: "2022-11-01", lastLogin: "2026-01-15 14:30" },
];

// ─── Activity Log ─────────────────────────────────────────────────────────
export interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ip: string;
}

export const activityLogs: ActivityLog[] = [
  { id: 1, timestamp: "2026-03-21 08:32", user: "Maria Santos", role: "Admin", action: "VIEW", module: "Dashboard", details: "Viewed admin dashboard", ip: "192.168.1.10" },
  { id: 2, timestamp: "2026-03-21 08:30", user: "Carlos Dela Cruz", role: "Stockman", action: "CREATE", module: "Receive Shipment", details: "Received 10 boxes of Kakai Chicharon Original", ip: "192.168.1.12" },
  { id: 3, timestamp: "2026-03-21 09:00", user: "Carlos Dela Cruz", role: "Stockman", action: "UPDATE", module: "Inventory Control", details: "Bulk breakdown: 5 boxes Kutkutin Crackers Cheese → 150 pcs", ip: "192.168.1.12" },
  { id: 4, timestamp: "2026-03-21 08:10", user: "Ana Villanueva", role: "Cashier", action: "CREATE", module: "POS", details: "Transaction TXN-001 processed. Total: ₱249.00", ip: "192.168.1.15" },
  { id: 5, timestamp: "2026-03-21 08:00", user: "Maria Santos", role: "Admin", action: "LOGIN", module: "Auth", details: "User logged in successfully", ip: "192.168.1.10" },
  { id: 6, timestamp: "2026-03-20 17:00", user: "Jose Reyes", role: "Staff", action: "LOGOUT", module: "Auth", details: "User logged out", ip: "192.168.1.11" },
  { id: 7, timestamp: "2026-03-20 14:00", user: "Carlos Dela Cruz", role: "Stockman", action: "UPDATE", module: "Inventory Control", details: "Stock adjustment: Cornick BBQ -3 pcs (damaged)", ip: "192.168.1.12" },
  { id: 8, timestamp: "2026-03-20 11:30", user: "Ana Villanueva", role: "Cashier", action: "UPDATE", module: "Stock Transfer", details: "Transferred 24 pcs Peanut Butter Bar → Store Shelf", ip: "192.168.1.15" },
];

// ─── Online Orders ─────────────────────────────────────────────────────────
export interface OnlineOrder {
  id: string;
  date: string;
  customer: string;
  source: "SMS" | "Facebook";
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "Pending" | "Processing" | "Ready" | "Delivered" | "Cancelled";
  paymentMethod: string;
  address: string;
  contact: string;
}

export const onlineOrders: OnlineOrder[] = [
  { id: "ORD-001", date: "2026-03-21 09:30", customer: "Pedro Lim", source: "Facebook", items: [{ name: "Kakai Chicharon Original", qty: 5, price: 55 }, { name: "Cornick BBQ", qty: 3, price: 40 }], total: 395, status: "Pending", paymentMethod: "GCash", address: "123 Mabini St, Pasay", contact: "09171234567" },
  { id: "ORD-002", date: "2026-03-21 08:15", customer: "Rosa Cruz", source: "SMS", items: [{ name: "Kutkutin Crackers Cheese", qty: 10, price: 42 }], total: 420, status: "Processing", paymentMethod: "COD", address: "456 Rizal Ave, Manila", contact: "09281234567" },
  { id: "ORD-003", date: "2026-03-20 16:45", customer: "Noel Garcia", source: "Facebook", items: [{ name: "Peanut Butter Bar", qty: 8, price: 28 }, { name: "Choco Mallows", qty: 5, price: 35 }], total: 399, status: "Delivered", paymentMethod: "GCash", address: "789 Del Pilar St, Makati", contact: "09391234567" },
  { id: "ORD-004", date: "2026-03-20 14:00", customer: "Lita Bautista", source: "SMS", items: [{ name: "Kakai Chicharon Spicy", qty: 6, price: 56 }], total: 336, status: "Ready", paymentMethod: "Maya", address: "321 Taft Ave, Manila", contact: "09501234567" },
];
