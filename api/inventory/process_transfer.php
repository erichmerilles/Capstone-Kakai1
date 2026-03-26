<?php
// api/inventory/process_transfer.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->product_id) || !isset($data->from_location) || !isset($data->to_location) || !isset($data->action)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$from_col = $data->from_location . '_stock';
$to_col = $data->to_location . '_stock';
$user_id = $_SESSION['user_id'];

try {
    $pdo->beginTransaction();

    // 1. Deduct from origin
    $stmt1 = $pdo->prepare("UPDATE products SET {$from_col} = GREATEST(0, {$from_col} - ?) WHERE id = ?");
    $stmt1->execute([$data->deduct_qty, $data->product_id]);

    // 2. Log deduction
    $stmt2 = $pdo->prepare("INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt2->execute([$data->product_id, $user_id, $data->action, -$data->deduct_qty, $data->from_location, "Transfer Out"]);

    // 3. Add to destination
    $stmt3 = $pdo->prepare("UPDATE products SET {$to_col} = {$to_col} + ? WHERE id = ?");
    $stmt3->execute([$data->add_qty, $data->product_id]);

    // 4. Log addition
    $stmt4 = $pdo->prepare("INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt4->execute([$data->product_id, $user_id, $data->action, $data->add_qty, $data->to_location, "Transfer In"]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Transfer processed successfully."]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
}
