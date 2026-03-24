<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (empty($data->name)) {
    echo json_encode(["success" => false, "message" => "Supplier name is required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO suppliers (name, contact_person, phone, email, address, status, supplied_products) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data->name,
        $data->contact_person ?? null,
        $data->phone ?? null,
        $data->email ?? null,
        $data->address ?? null,
        $data->status ?? 'Active',
        $data->supplied_products ?? null
    ]);
    echo json_encode(["success" => true, "message" => "Supplier added successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
