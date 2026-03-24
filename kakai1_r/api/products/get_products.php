<?php
// api/products/get_products.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT p.*, s.name as supplier_name 
        FROM products p 
        LEFT JOIN suppliers s ON p.supplier_id = s.id 
        ORDER BY p.name ASC
    ");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $products]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
