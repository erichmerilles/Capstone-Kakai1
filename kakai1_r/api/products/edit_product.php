<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->sku) || !isset($data->name) || !isset($data->selling_price)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

try {
    // Added buying_price to the UPDATE statement
    $stmt = $pdo->prepare("
        UPDATE products SET 
            sku = ?, name = ?, category = ?, unit = ?, pcs_per_box = ?, 
            buying_price = ?, wholesale_price = ?, retail_price = ?, selling_price = ?, 
            expiry_date = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $data->sku,
        $data->name,
        $data->category ?? 'Uncategorized',
        $data->unit ?? 'pcs',
        $data->pcs_per_box ?? 1,
        $data->buying_price ?? 0,
        $data->wholesale_price ?? 0,
        $data->retail_price ?? 0,
        $data->selling_price,
        $data->expiry_date ?? null,
        $data->id
    ]);

    echo json_encode(["success" => true, "message" => "Product updated successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
