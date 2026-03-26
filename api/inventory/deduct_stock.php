<?php
// api/inventory/deduct_stock.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->product_id) || !isset($data->quantity) || !isset($data->location) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$valid_locations = ['wholesale', 'retail', 'shelf'];
$valid_actions = ['return', 'adjustment']; // 'sale' will be handled by the POS script later

if (!in_array($data->location, $valid_locations) || !in_array($data->action, $valid_actions)) {
    echo json_encode(["success" => false, "message" => "Invalid location or action."]);
    exit();
}

$location_column = $data->location . '_stock';
$user_id = $_SESSION['user_id'];

try {
    $pdo->beginTransaction();

    // 1. Deduct the stock (GREATEST(0, ...) prevents negative stock numbers)
    $stmt1 = $pdo->prepare("UPDATE products SET {$location_column} = GREATEST(0, {$location_column} - ?) WHERE id = ?");
    $stmt1->execute([$data->quantity, $data->product_id]);

    // 2. Log the deduction
    $stmt2 = $pdo->prepare("
        INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    // Store as negative quantity for clearer reporting later
    $stmt2->execute([
        $data->product_id,
        $user_id,
        $data->action,
        -$data->quantity,
        $data->location,
        $data->remarks ?? 'Stock deducted'
    ]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Stock deducted successfully."]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
}
