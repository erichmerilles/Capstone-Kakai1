<?php
// api/search_products.php
require '../db.php';
require 'auth_guard.php';

header('Content-Type: application/json');

$query = isset($_GET['q']) ? $_GET['q'] : '';

if (empty($query)) {
    echo json_encode(["success" => true, "data" => []]);
    exit();
}

try {
    // The % signs allow for partial matches (e.g., typing "nut" finds "Peanuts")
    $searchTerm = "%" . $query . "%";

    $stmt = $pdo->prepare("
        SELECT id, sku, name, selling_price, category 
        FROM products 
        WHERE name LIKE ? OR sku LIKE ? 
        LIMIT 20
    ");
    $stmt->execute([$searchTerm, $searchTerm]);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $results]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
