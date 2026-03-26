<?php
// api/pos/get_sale_details.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

if (!isset($_GET['sale_id'])) {
    echo json_encode(["success" => false, "message" => "Sale ID is required."]);
    exit();
}

$sale_id = $_GET['sale_id'];

try {
    // Join sale_items with products so we get the actual product name, not just the ID
    $stmt = $pdo->prepare("
        SELECT si.id, si.quantity, si.price_at_time, si.subtotal, p.name as product_name, p.sku
        FROM sale_items si
        LEFT JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = ?
    ");

    $stmt->execute([$sale_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $items]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
