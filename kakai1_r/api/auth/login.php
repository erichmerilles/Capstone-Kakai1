<?php
// api/login.php
session_start();
require '../db.php';

// Tell the browser we are sending JSON back
header('Content-Type: application/json');

// --- NEW FIX: STRICT METHOD CHECK ---
// Prevent users from accessing this script directly via a browser URL (GET request)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // 405 Method Not Allowed
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

// 1. SAFELY PARSE JSON
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input);

// Check if JSON is valid and required fields exist
if (json_last_error() !== JSON_ERROR_NONE || !isset($data->username) || !isset($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Invalid request. Please provide both username and password."]);
    exit;
}

$username = $data->username;
$password = $data->password;

// Use a prepared statement to prevent SQL Injection
$stmt = $pdo->prepare("SELECT id, username, password_hash, role, full_name, avatar FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Verify the password
if ($user && password_verify($password, $user['password_hash'])) {

    // Fetch permissions for this specific role
    $role = strtolower($user['role']);
    $permissions = [];

    try {
        if ($role === 'admin' || $role === 'administrator') {
            $permStmt = $pdo->query("SELECT id FROM permissions");
            $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
        } else {
            $permStmt = $pdo->prepare("SELECT permission_id FROM role_permissions WHERE role_name = ? AND is_allowed = 1");
            $permStmt->execute([$role]);
            $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
        }
    } catch (Exception $e) {
        error_log("Failed to fetch permissions during login: " . $e->getMessage());
    }

    // 2. PREVENT SESSION FIXATION (Crucial Security Fix)
    session_regenerate_id(true);

    // Create the session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    // RECORD THE LOGIN ACTIVITY
    try {
        $logStmt = $pdo->prepare("INSERT INTO activity_log (user_id, action, module, details) VALUES (?, ?, ?, ?)");
        $logAction = "User Login";
        $logModule = "Auth";
        $logDetails = "User '" . $user['username'] . "' successfully logged in.";
        $logStmt->execute([$user['id'], $logAction, $logModule, $logDetails]);
    } catch (Exception $e) {
        // Log the error to the server log so it doesn't block the actual login process
        error_log("Failed to record login activity: " . $e->getMessage());
    }

    // Send the success response back to React, complete with permissions
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "isAuthenticated" => true,
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "role" => $user['role'],
            "full_name" => $user['full_name'] ?? null,
            "avatar" => $user['avatar'] ?? null,
            "permissions" => $permissions
        ]
    ]);
    exit;
} else {
    // Invalid credentials
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    exit;
}
