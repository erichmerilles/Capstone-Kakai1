<?php
// api/pos/create_sale.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->cart) || empty($data->cart) || !isset($data->total_amount)) {
    echo json_encode(["success" => false, "message" => "Cart is empty or missing total."]);
    exit();
}

$cashier_id = $_SESSION['user_id'];
$receipt_number = 'RCPT-' . date('Ymd-His') . '-' . rand(100, 999);

try {
    $pdo->beginTransaction();

    // 1. Create the main Sales record
    $stmtSale = $pdo->prepare("
        INSERT INTO sales (cashier_id, total_amount, payment_method, receipt_number) 
        VALUES (?, ?, ?, ?)
    ");
    $stmtSale->execute([
        $cashier_id,
        $data->total_amount,
        $data->payment_method ?? 'cash',
        $receipt_number
    ]);

    $sale_id = $pdo->lastInsertId();

    // Prepare statements for the loop to make it lightning fast
    $stmtItem = $pdo->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time, subtotal) VALUES (?, ?, ?, ?, ?)");
    $stmtDeduct = $pdo->prepare("UPDATE products SET shelf_stock = GREATEST(0, shelf_stock - ?) WHERE id = ?");
    $stmtLog = $pdo->prepare("INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) VALUES (?, ?, 'sale', ?, 'shelf', ?)");

    // 2. Loop through the cart and process every item
    foreach ($data->cart as $item) {
        $subtotal = $item->quantity * $item->price;

        // A. Record the item in the receipt
        $stmtItem->execute([$sale_id, $item->id, $item->quantity, $item->price, $subtotal]);

        // B. Deduct the item from the Store Shelf
        $stmtDeduct->execute([$item->quantity, $item->id]);

        // C. Write the paper trail in the Activity Log
        $stmtLog->execute([$item->id, $cashier_id, -$item->quantity, "Sold (Receipt: $receipt_number)"]);
    }

    $pdo->commit();
    echo json_encode([
        "success" => true,
        "message" => "Sale completed successfully.",
        "receipt_number" => $receipt_number
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
}
