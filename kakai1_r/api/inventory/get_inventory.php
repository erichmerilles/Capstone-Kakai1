<?php
// api/inventory/get_inventory.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    // Added all pricing columns to the SELECT statement
    $stmt = $pdo->query("
        SELECT 
            id, sku, name, category, unit, pcs_per_box, 
            buying_price, wholesale_price, retail_price, selling_price,
            wholesale_stock, retail_stock, shelf_stock, expiry_date 
        FROM products 
        ORDER BY name ASC
    ");
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $inventory]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
