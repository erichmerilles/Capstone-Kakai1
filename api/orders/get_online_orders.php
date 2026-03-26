<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT id, customer_name as customer, contact, address, source, note, 
               total_amount as total, payment_method as paymentMethod, status, 
               DATE_FORMAT(created_at, '%b %d, %Y %h:%i %p') as date 
        FROM online_orders 
        ORDER BY created_at DESC
    ");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch structured items if they exist (for future customer-facing apps)
    $stmt_items = $pdo->prepare("SELECT quantity as qty, price, subtotal, p.name FROM online_order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?");

    foreach ($orders as &$order) {
        $stmt_items->execute([$order['id']]);
        $order['items'] = $stmt_items->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(["success" => true, "data" => $orders]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
