<?php
// api/inventory/get_movements.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT l.id, l.action as type, l.quantity_changed as qty, l.location, l.remarks as note, 
               DATE_FORMAT(l.created_at, '%b %d, %Y %h:%i %p') as date,
               p.name as product, u.username as user
        FROM inventory_logs l
        LEFT JOIN products p ON l.product_id = p.id
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC LIMIT 50
    ");
    $movements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $movements]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
