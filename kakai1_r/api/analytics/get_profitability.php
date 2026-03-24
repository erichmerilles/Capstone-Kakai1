<?php
// api/analytics/get_profitability.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    // Calculate total revenue, cost, and profit per product
    $stmt = $pdo->query("
        SELECT 
            p.name, 
            p.sku, 
            SUM(si.quantity) as items_sold, 
            SUM(si.subtotal) as total_revenue,
            SUM(si.quantity * p.wholesale_price) as total_cost
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        JOIN sales s ON si.sale_id = s.id
        GROUP BY p.id
        ORDER BY total_revenue DESC
    ");
    $report = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate the grand totals for the dashboard
    $grand_revenue = 0;
    $grand_cost = 0;

    foreach ($report as &$row) {
        $row['profit'] = $row['total_revenue'] - $row['total_cost'];
        // Prevent division by zero errors
        $row['margin'] = $row['total_revenue'] > 0 ? round(($row['profit'] / $row['total_revenue']) * 100, 2) : 0;

        $grand_revenue += $row['total_revenue'];
        $grand_cost += $row['total_cost'];
    }

    $grand_profit = $grand_revenue - $grand_cost;

    echo json_encode([
        "success" => true,
        "summary" => [
            "total_revenue" => $grand_revenue,
            "total_cost" => $grand_cost,
            "total_profit" => $grand_profit
        ],
        "data" => $report
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
