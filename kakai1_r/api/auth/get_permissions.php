<?php
// api/auth/get_permissions.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Use your main database connection instead of a hardcoded one!
require '../db.php';

try {
    // Get all allowed permissions
    $stmt = $pdo->query("SELECT role_name, permission_id FROM role_permissions WHERE is_allowed = 1");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedData = [
        "Stockman" => [],
        "Cashier" => []
    ];

    // Format the database rows into the JSON structure React expects
    foreach ($results as $row) {
        $roleTitleCase = ucfirst(strtolower($row['role_name']));

        if (isset($formattedData[$roleTitleCase])) {
            $formattedData[$roleTitleCase][$row['permission_id']] = true;
        }
    }

    echo json_encode($formattedData);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
