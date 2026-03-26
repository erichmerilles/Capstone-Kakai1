<?php
require '../db.php';
require '../auth_guard.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if (empty($data->id) || empty($data->status)) {
    echo json_encode(["success" => false, "message" => "Missing data."]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $pdo->beginTransaction();

    // 1. Update status
    $stmt = $pdo->prepare("UPDATE online_orders SET status = ? WHERE id = ?");
    $stmt->execute([$data->status, $data->id]);

    // 2. If delivered, check if it has structured items to deduct from inventory
    if ($data->status === 'Delivered') {
        $stmt_items = $pdo->prepare("SELECT product_id, quantity, price, subtotal FROM online_order_items WHERE order_id = ?");
        $stmt_items->execute([$data->id]);
        $items = $stmt_items->fetchAll(PDO::FETCH_ASSOC);

        if (count($items) > 0) {
            $stmt_order = $pdo->prepare("SELECT total_amount FROM online_orders WHERE id = ?");
            $stmt_order->execute([$data->id]);
            $total_amount = $stmt_order->fetchColumn();

            $receipt_number = 'WEB-' . date('Ymd') . '-' . $data->id;
            $stmtSale = $pdo->prepare("INSERT INTO sales (cashier_id, total_amount, payment_method, receipt_number) VALUES (?, ?, 'online', ?)");
            $stmtSale->execute([$user_id, $total_amount, $receipt_number]);
            $sale_id = $pdo->lastInsertId();

            $stmtSaleItem = $pdo->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time, subtotal) VALUES (?, ?, ?, ?, ?)");
            $stmtDeduct = $pdo->prepare("UPDATE products SET shelf_stock = GREATEST(0, shelf_stock - ?) WHERE id = ?");
            $stmtLog = $pdo->prepare("INSERT INTO inventory_logs (product_id, user_id, action, quantity_changed, location, remarks) VALUES (?, ?, 'sale', ?, 'shelf', ?)");

            foreach ($items as $item) {
                $stmtSaleItem->execute([$sale_id, $item['product_id'], $item['quantity'], $item['price'], $item['subtotal']]);
                $stmtDeduct->execute([$item['quantity'], $item['product_id']]);
                $stmtLog->execute([$item['product_id'], $user_id, 'sale', -$item['quantity'], 'shelf', "Web Order: $receipt_number"]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Updated to " . $data->status]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
