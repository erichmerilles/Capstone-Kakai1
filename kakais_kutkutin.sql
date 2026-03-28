-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2026 at 04:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kakais_kutkutin`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(100) DEFAULT 'Authentication',
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `user_id`, `action`, `module`, `details`, `created_at`) VALUES
(1, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-26 05:08:09'),
(2, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-26 05:17:31'),
(3, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-26 05:58:50'),
(4, 2, 'User Login', 'Auth', 'User \'erichjoelmerilles\' successfully logged in.', '2026-03-26 08:40:56'),
(5, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-26 08:57:59'),
(6, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-28 01:11:33'),
(7, 2, 'User Login', 'Auth', 'User \'erichjoelmerilles\' successfully logged in.', '2026-03-28 01:13:46'),
(8, 2, 'User Login', 'Auth', 'User \'erichjoelmerilles\' successfully logged in.', '2026-03-28 01:36:22'),
(9, 2, 'User Login', 'Auth', 'User \'erichjoelmerilles\' successfully logged in.', '2026-03-28 01:36:45'),
(10, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-28 01:44:58'),
(11, 1, 'User Login', 'Auth', 'User \'admin\' successfully logged in.', '2026-03-28 01:47:34'),
(12, 3, 'User Login', 'Auth', 'User \'erich\' successfully logged in.', '2026-03-28 02:16:18');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` enum('receive','return','transfer','adjustment','sale') NOT NULL,
  `quantity_changed` int(11) NOT NULL,
  `location` enum('wholesale','retail','shelf') NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_logs`
--

INSERT INTO `inventory_logs` (`id`, `product_id`, `user_id`, `action`, `quantity_changed`, `location`, `remarks`, `created_at`) VALUES
(1, 1, 1, 'receive', 10, 'wholesale', ' (From: Unknown Supplier)', '2026-03-22 13:41:01'),
(2, 1, 1, '', -2, 'wholesale', 'Transfer Out', '2026-03-22 13:41:22'),
(3, 1, 1, '', 48, 'retail', 'Transfer In', '2026-03-22 13:41:22'),
(4, 1, 1, 'transfer', 0, 'retail', 'Transfer Out', '2026-03-22 13:41:26'),
(5, 1, 1, 'transfer', 0, 'shelf', 'Transfer In', '2026-03-22 13:41:26'),
(6, 1, 1, 'transfer', 0, 'retail', 'Transfer Out', '2026-03-22 13:41:28'),
(7, 1, 1, 'transfer', 0, 'shelf', 'Transfer In', '2026-03-22 13:41:28'),
(8, 1, 1, 'transfer', 0, 'retail', 'Transfer Out', '2026-03-22 13:41:29'),
(9, 1, 1, 'transfer', 0, 'shelf', 'Transfer In', '2026-03-22 13:41:29'),
(10, 1, 1, 'transfer', -20, 'retail', 'Transfer Out', '2026-03-22 13:41:32'),
(11, 1, 1, 'transfer', 20, 'shelf', 'Transfer In', '2026-03-22 13:41:32'),
(12, 1, 1, 'adjustment', -1, 'retail', '', '2026-03-22 13:45:07'),
(13, 1, 1, 'adjustment', -2, 'retail', '', '2026-03-22 13:45:29'),
(14, 1, 1, 'sale', -3, 'shelf', 'Sold (Receipt: RCPT-20260322-145026-124)', '2026-03-22 13:50:26'),
(15, 1, 1, 'sale', -2, 'shelf', 'Sold (Receipt: RCPT-20260323-042409-637)', '2026-03-23 03:24:09'),
(16, 1, 1, 'adjustment', -2, 'shelf', 'Manual Adjustment', '2026-03-23 03:50:37'),
(17, 1, 1, 'receive', 2, 'shelf', 'Manual Adjustment', '2026-03-23 03:50:54'),
(18, 1, 1, 'sale', -5, 'shelf', 'Sold (Receipt: RCPT-20260323-050629-460)', '2026-03-23 04:06:29'),
(19, 1, 1, 'sale', -2, 'shelf', 'Sold (Receipt: RCPT-20260323-050709-890)', '2026-03-23 04:07:09'),
(20, 1, 1, 'sale', -1, 'shelf', 'Sold (Receipt: RCPT-20260324-012022-600)', '2026-03-24 00:20:22'),
(21, 1, 2, 'sale', -3, 'shelf', 'Sold (Receipt: RCPT-20260324-040224-266)', '2026-03-24 03:02:24'),
(22, 1, 2, 'sale', -1, 'shelf', 'Sold (Receipt: RCPT-20260326-014954-779)', '2026-03-26 00:49:54');

-- --------------------------------------------------------

--
-- Table structure for table `online_orders`
--

CREATE TABLE `online_orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `source` varchar(50) DEFAULT 'Facebook',
  `note` text DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'Cash on Delivery',
  `status` enum('Pending','Processing','Ready','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `online_orders`
--

INSERT INTO `online_orders` (`id`, `customer_name`, `contact`, `address`, `source`, `note`, `total_amount`, `payment_method`, `status`, `created_at`) VALUES
(1, 'asd', '12387198273', '123 qweqweqwe', 'Facebook', 'asdas', 0.00, 'COD', 'Cancelled', '2026-03-23 03:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `online_order_items`
--

CREATE TABLE `online_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(50) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module`, `action`, `description`) VALUES
('activity_view', 'Activity Log', 'View Activity Log', 'Access system activity logs'),
('damage_entry', 'Inventory', 'Damage/Loss Entry', 'Record damaged or lost items'),
('dash_view', 'Dashboard', 'View Dashboard', 'Access the main dashboard'),
('expiry_view', 'Business Intelligence', 'Expiry Tracker', 'View expiry & low stock alerts'),
('forecast_view', 'Business Intelligence', 'View Forecast', 'Access inventory forecast'),
('inv_breakdown', 'Inventory', 'Bulk Breakdown', 'Break down wholesale to retail'),
('online_orders', 'Daily Operations', 'Online Orders', 'Create and manage online orders'),
('pos_access', 'Daily Operations', 'Access POS', 'Use point of sale terminal'),
('products_edit', 'Inventory', 'Edit Products', 'Add, edit, delete products'),
('products_view', 'Inventory', 'View Products', 'View product master list'),
('rbac_edit', 'User Management', 'Manage Access', 'Edit role permissions'),
('receive_shipment', 'Inventory', 'Receive Shipment', 'Receive products from suppliers'),
('reports_view', 'Business Intelligence', 'View Reports', 'Access profitability reports'),
('stock_adjust', 'Inventory', 'Stock Adjustment', 'Manually adjust stock counts'),
('stock_transfer', 'Inventory', 'Stock Transfer', 'Transfer stock between locations'),
('suppliers_edit', 'Inventory', 'Edit Suppliers', 'Add, edit, delete suppliers'),
('suppliers_view', 'Inventory', 'View Suppliers', 'View supplier directory'),
('users_edit', 'User Management', 'Manage Users', 'Add, edit, delete users'),
('users_view', 'User Management', 'View Users', 'View employee list');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT 'Uncategorized',
  `unit` varchar(20) DEFAULT 'pcs',
  `pcs_per_box` int(11) DEFAULT 1,
  `wholesale_price` decimal(10,2) DEFAULT 0.00,
  `retail_price` decimal(10,2) DEFAULT 0.00,
  `buying_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL,
  `wholesale_stock` int(11) DEFAULT 0,
  `retail_stock` int(11) DEFAULT 0,
  `shelf_stock` int(11) DEFAULT 0,
  `expiry_date` date DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `category`, `unit`, `pcs_per_box`, `wholesale_price`, `retail_price`, `buying_price`, `selling_price`, `wholesale_stock`, `retail_stock`, `shelf_stock`, `expiry_date`, `supplier_id`, `description`, `created_at`) VALUES
(1, 'CHR', 'asdas', 'Chicharon', 'pcs', 24, 50.00, 60.00, 45.00, 60.00, 8, 25, 3, '2026-03-24', NULL, NULL, '2026-03-22 11:08:39');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_name` varchar(20) NOT NULL,
  `permission_id` varchar(50) NOT NULL,
  `is_allowed` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_name`, `permission_id`, `is_allowed`) VALUES
(122, 'stockman', 'dash_view', 1),
(123, 'stockman', 'products_view', 1),
(124, 'stockman', 'receive_shipment', 1),
(125, 'stockman', 'damage_entry', 1),
(126, 'stockman', 'inv_breakdown', 1),
(127, 'stockman', 'stock_transfer', 1),
(128, 'stockman', 'stock_adjust', 1),
(129, 'stockman', 'suppliers_view', 1),
(130, 'cashier', 'dash_view', 1),
(131, 'cashier', 'pos_access', 1),
(132, 'cashier', 'online_orders', 1),
(133, 'cashier', 'products_view', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `cashier_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'cash',
  `receipt_number` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `cashier_id`, `total_amount`, `payment_method`, `receipt_number`, `created_at`) VALUES
(1, 1, 180.00, 'gcash', 'RCPT-20260322-145026-124', '2026-03-22 13:50:26'),
(2, 1, 120.00, 'cash', 'RCPT-20260323-042409-637', '2026-03-23 03:24:09'),
(3, 1, 300.00, 'cash', 'RCPT-20260323-050629-460', '2026-03-23 04:06:29'),
(4, 1, 120.00, 'gcash', 'RCPT-20260323-050709-890', '2026-03-23 04:07:09'),
(5, 1, 60.00, 'cash', 'RCPT-20260324-012022-600', '2026-03-24 00:20:22'),
(6, 2, 180.00, 'cash', 'RCPT-20260324-040224-266', '2026-03-24 03:02:24'),
(7, 2, 60.00, 'cash', 'RCPT-20260326-014954-779', '2026-03-26 00:49:54');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `quantity`, `price_at_time`, `subtotal`) VALUES
(1, 1, 1, 3, 60.00, 180.00),
(2, 2, 1, 2, 60.00, 120.00),
(3, 3, 1, 5, 60.00, 300.00),
(4, 4, 1, 2, 60.00, 120.00),
(5, 5, 1, 1, 60.00, 60.00),
(6, 6, 1, 3, 60.00, 180.00),
(7, 7, 1, 1, 60.00, 60.00);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `supplied_products` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact_person`, `phone`, `email`, `address`, `status`, `supplied_products`, `created_at`) VALUES
(1, 'asdzxc', 'asdzx', '231321', 'earsdf', 'asd123', 'Active', 'chichirya', '2026-03-23 03:29:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_hired` date DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','stockman','cashier','customer') NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `phone`, `date_hired`, `last_login`, `password_hash`, `role`, `status`, `created_at`, `avatar`) VALUES
(1, 'admin', 'System Admin', NULL, NULL, '2026-03-23', NULL, '$2y$10$rD/1TxEA/iLoAXYk5gNqxerc7.Wghvz9zTFuLbWkBjIi8he4nzepe', 'admin', 'Active', '2026-03-22 10:46:10', NULL),
(2, 'erichjoelmerilles', 'Erich Merilles', 'erichjoelmerilles', '09913901952', '2026-03-24', NULL, '$2y$10$fr1u1lNJw8pl2eGsvKjY..qYKTtxfrBAnLx3FKn9wpPFq1cUUTqTW', 'cashier', 'Active', '2026-03-24 02:57:55', NULL),
(3, 'erich', 'Erich', NULL, NULL, '2026-03-28', NULL, '$2y$10$/IsY5.yCzhsBISIaUUNgpeZytMldrk19omnIIjUR1PgusHyTd1gT.', 'stockman', 'Active', '2026-03-28 02:15:40', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `online_orders`
--
ALTER TABLE `online_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `online_order_items`
--
ALTER TABLE `online_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_perm` (`role_name`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `cashier_id` (`cashier_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `online_orders`
--
ALTER TABLE `online_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `online_order_items`
--
ALTER TABLE `online_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `online_order_items`
--
ALTER TABLE `online_order_items`
  ADD CONSTRAINT `online_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `online_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `online_order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
