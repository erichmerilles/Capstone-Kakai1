<?php
// api/suppliers/delete_supplier.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["success" => false, "message" => "Supplier ID is required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM suppliers WHERE id = ?");
    $stmt->execute([$data->id]);

    echo json_encode(["success" => true, "message" => "Supplier deleted successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
