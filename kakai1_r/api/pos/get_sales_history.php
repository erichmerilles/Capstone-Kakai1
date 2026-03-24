<?php
// api/pos/get_sales_history.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    // Join with users table to get the Cashier's actual name/username
    $stmt = $pdo->query("
        SELECT s.id, s.receipt_number, s.total_amount, s.payment_method, 
               DATE_FORMAT(s.created_at, '%b %d, %Y %h:%i %p') as date, 
               u.username as cashier
        FROM sales s
        LEFT JOIN users u ON s.cashier_id = u.id
        ORDER BY s.created_at DESC
        LIMIT 100
    ");
    $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $sales]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
