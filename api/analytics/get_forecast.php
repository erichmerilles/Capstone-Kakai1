<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    // Calculate exact daily profit: (Selling Price Revenue) - (Quantity * Buying Price)
    $stmt_trends = $pdo->query("
        SELECT 
            DATE(s.created_at) as sale_date, 
            SUM(si.quantity) as total_items_sold, 
            SUM(si.subtotal) as daily_revenue,
            (SUM(si.subtotal) - SUM(si.quantity * p.buying_price)) as daily_profit
        FROM sales s
        JOIN sale_items si ON s.id = si.sale_id
        JOIN products p ON si.product_id = p.id
        WHERE s.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(s.created_at)
        ORDER BY sale_date ASC
    ");
    $daily_sales = $stmt_trends->fetchAll(PDO::FETCH_ASSOC);

    $stmt_top = $pdo->query("
        SELECT p.name, SUM(si.quantity) as qty_sold
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        GROUP BY p.id
        ORDER BY qty_sold DESC
        LIMIT 5
    ");
    $top_products = $stmt_top->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "trends" => $daily_sales,
            "fast_moving" => $top_products
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
