<?php
// api/login.php
session_start();
require '../db.php';

// Tell the browser we are sending JSON back
header('Content-Type: application/json');

// Get the JSON data sent by React
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Please provide both username and password."]);
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

    // 1. Fetch permissions for this specific role
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

    // 2. Create the session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    // 3. RECORD THE LOGIN ACTIVITY
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

    // 4. Send the success response back to React, complete with permissions
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
} else {
    // Invalid credentials
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
}
