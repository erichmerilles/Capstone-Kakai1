<?php
// api/validate_session.php
session_start();
require '../db.php'; // Make sure your DB connection variable here is named $pdo 
// (If it's $conn or $db, just change $pdo to match below)

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    try {
        $role = strtolower($_SESSION['role']);
        $permissions = [];

        // 1. Fetch permissions based on the user's role
        if ($role === 'admin' || $role === 'administrator') {
            // Admins get all permission IDs automatically
            $stmt = $pdo->query("SELECT id FROM permissions");
            $permissions = $stmt->fetchAll(PDO::FETCH_COLUMN);
        } else {
            // Other roles only get the permissions explicitly allowed in the database
            $stmt = $pdo->prepare("SELECT permission_id FROM role_permissions WHERE role_name = ? AND is_allowed = 1");
            $stmt->execute([$role]);
            $permissions = $stmt->fetchAll(PDO::FETCH_COLUMN);
        }

        // 2. The user has an active session, send back data PLUS permissions
        echo json_encode([
            "success" => true,
            "isAuthenticated" => true,
            "user" => [
                "id" => $_SESSION['user_id'],
                "username" => $_SESSION['username'],
                "role" => $_SESSION['role'],
                "permissions" => $permissions // <-- Added to the response
            ]
        ]);
    } catch (Exception $e) {
        // Catch any database errors so it doesn't break the JSON response
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "isAuthenticated" => false,
            "error" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    // No active session
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "isAuthenticated" => false,
        "message" => "Not logged in"
    ]);
}
