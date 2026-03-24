<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->sku) || !isset($data->name) || !isset($data->selling_price)) {
    echo json_encode(["success" => false, "message" => "Barcode, Name, and Selling Price are required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO products (
            sku, name, category, unit, pcs_per_box, 
            wholesale_price, retail_price, selling_price, 
            expiry_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data->sku,
        $data->name,
        $data->category ?? 'Uncategorized',
        $data->unit ?? 'pcs',
        $data->pcs_per_box ?? 1,
        $data->wholesale_price ?? 0,
        $data->retail_price ?? 0,
        $data->selling_price,
        $data->expiry_date ?? null
    ]);

    echo json_encode(["success" => true, "message" => "Product added successfully."]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "message" => "A product with this Barcode already exists."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}
