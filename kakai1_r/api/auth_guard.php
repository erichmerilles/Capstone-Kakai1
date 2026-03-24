<?php
// api/auth_guard.php
session_start();

// If the user is not logged in, block them immediately
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized access. Please log in."
    ]);
    exit(); // Stops the rest of the script from running
}
