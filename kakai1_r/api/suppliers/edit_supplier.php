<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (empty($data->id) || empty($data->name)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, status = ?, supplied_products = ? WHERE id = ?");
    $stmt->execute([
        $data->name,
        $data->contact_person ?? null,
        $data->phone ?? null,
        $data->email ?? null,
        $data->address ?? null,
        $data->status ?? 'Active',
        $data->supplied_products ?? null,
        $data->id
    ]);
    echo json_encode(["success" => true, "message" => "Supplier updated successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
