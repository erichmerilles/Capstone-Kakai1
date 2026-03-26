<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

try {
    // Join users and products to get all the structured details
    $stmt = $pdo->query("
        SELECT 
            l.id, 
            l.action as raw_action, 
            l.quantity_changed, 
            l.location, 
            l.remarks,
            DATE_FORMAT(l.created_at, '%Y-%m-%d %H:%i:%s') as timestamp,
            p.name as product_name, 
            u.username as user_name,
            u.role
        FROM inventory_logs l
        LEFT JOIN products p ON l.product_id = p.id
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC 
        LIMIT 150
    ");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted_logs = array_map(function ($log) {
        // Determine the Module based on the action
        $module = 'Inventory';
        if ($log['raw_action'] === 'sale') $module = 'POS';
        if ($log['raw_action'] === 'return') $module = 'Returns';

        // Format the Action to match your UI's expected badges
        $action = strtoupper($log['raw_action']);

        // Create the specific detail string
        $qty = abs($log['quantity_changed']);
        $details = "Processed {$qty} units of {$log['product_name']} ({$log['location']})";
        if (!empty($log['remarks'])) {
            $details .= " - Note: {$log['remarks']}";
        }

        return [
            "id" => $log['id'],
            "timestamp" => $log['timestamp'],
            "user" => ucfirst($log['user_name'] ?? 'System'),
            "role" => ucfirst($log['role'] ?? 'System'),
            "action" => $action,
            "module" => $module,
            "details" => $details
        ];
    }, $logs);

    echo json_encode(["success" => true, "data" => $formatted_logs]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
