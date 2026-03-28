<?php
// api/auth/update_permissions.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Use your main database connection instead of a hardcoded one!
require '../db.php';

// Get JSON payload from React
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Loop through the roles sent by React (e.g., "Stockman", "Cashier")
    foreach (['Stockman', 'Cashier'] as $role) {
        $dbRole = strtolower($role); // Convert back to lowercase for the DB

        // 1. Delete old permissions for this role to start fresh
        $stmt = $pdo->prepare("DELETE FROM role_permissions WHERE role_name = ?");
        $stmt->execute([$dbRole]);

        // 2. Insert the new permissions
        if (isset($data[$role])) {
            $insertStmt = $pdo->prepare("INSERT INTO role_permissions (role_name, permission_id, is_allowed) VALUES (?, ?, 1)");

            foreach ($data[$role] as $permId => $isAllowed) {
                if ($isAllowed === true) {
                    $insertStmt->execute([$dbRole, $permId]);
                }
            }
        }
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Permissions updated successfully"]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Failed to update database: " . $e->getMessage()]);
}
