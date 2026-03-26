<?php
// api/logout.php
session_start();
require '../db.php';

header('Content-Type: application/json');

// Destroy all session data
session_unset();
session_destroy();

// Clear the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

echo json_encode(["success" => true, "message" => "Logged out successfully."]);
