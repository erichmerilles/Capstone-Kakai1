<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (empty($data->customer)) {
    echo json_encode(["success" => false, "message" => "Customer name is required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO online_orders (customer_name, contact, address, source, payment_method, note, total_amount, status) 
        VALUES (?, ?, ?, ?, ?, ?, 0, 'Pending')
    ");
    $stmt->execute([
        $data->customer,
        $data->contact ?? null,
        $data->address ?? null,
        $data->source ?? 'Facebook',
        $data->payment ?? 'GCash',
        $data->note ?? null
    ]);

    echo json_encode(["success" => true, "message" => "Order created successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
