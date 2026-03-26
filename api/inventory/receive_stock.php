<?php
// api/inventory/receive_stock.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

// Validate incoming data
if (!isset($data->product_id) || !isset($data->quantity) || !isset($data->location)) {
    echo json_encode(["success" => false, "message" => "Product ID, Quantity, and Location are required."]);
    exit();
}

$valid_locations = ['wholesale', 'retail', 'shelf'];
if (!in_array($data->location, $valid_locations)) {
    echo json_encode(["success" => false, "message" => "Invalid stock location."]);
    exit();
}

$location_column = $data->location . '_stock';
$user_id = $_SESSION['user_id'];

try {
    // Start a Database Transaction for safety
    $pdo->beginTransaction();

    // 1. Add the stock to the products table
    $stmt1 = $pdo->prepare("UPDATE products SET {$location_column} = {$location_column} + ? WHERE id = ?");
    $stmt1->execute([$data->quantity, $data->product_id]);

    // 2. Create the permanent paper trail in inventory_logs
    $stmt2 = $pdo->prepare("
        INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) 
        VALUES (?, ?, 'receive', ?, ?, ?)
    ");
    $stmt2->execute([
        $data->product_id,
        $user_id,
        $data->quantity,
        $data->location,
        $data->remarks ?? 'Stock received from supplier'
    ]);

    // If both succeeded, lock them into the database
    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Stock received successfully."]);
} catch (Exception $e) {
    // If anything fails, undo everything so data isn't corrupted
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
}
