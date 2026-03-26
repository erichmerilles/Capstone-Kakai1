<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');

try {
    // Now we grab the status and supplied_products columns too
    $stmt = $pdo->query("SELECT id, name, contact_person, phone, email, address, status, supplied_products FROM suppliers ORDER BY name ASC");
    $suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $suppliers]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
