<?php
// api/inventory/get_alerts.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

// Define our warning thresholds
$low_stock_threshold = 20;
$days_to_expiry = 30;

try {
    // Find Low Stock Items (Total across all locations is less than the threshold)
    $stmt_stock = $pdo->prepare("
        SELECT id, sku, name, category, (wholesale_stock + retail_stock + shelf_stock) as total_stock 
        FROM products 
        WHERE (wholesale_stock + retail_stock + shelf_stock) <= ?
        ORDER BY total_stock ASC
    ");
    $stmt_stock->execute([$low_stock_threshold]);
    $low_stock_items = $stmt_stock->fetchAll(PDO::FETCH_ASSOC);

    // Find Expiring Items (Expiry date is within the next X days, or already passed)
    $stmt_expiry = $pdo->prepare("
        SELECT id, sku, name, expiry_date, DATEDIFF(expiry_date, CURDATE()) as days_left 
        FROM products 
        WHERE expiry_date IS NOT NULL 
          AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
        ORDER BY expiry_date ASC
    ");
    $stmt_expiry->execute([$days_to_expiry]);
    $expiring_items = $stmt_expiry->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "low_stock" => $low_stock_items,
            "expiring" => $expiring_items
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
