<?php
// api/validate_session.php
session_start();
require '../db.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    // The user has an active session
    echo json_encode([
        "success" => true,
        "isAuthenticated" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "username" => $_SESSION['username'],
            "role" => $_SESSION['role']
        ]
    ]);
} else {
    // No active session
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "isAuthenticated" => false,
        "message" => "Not logged in"
    ]);
}
