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
$stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Verify the password (assuming you used password_hash() when creating users)
if ($user && password_verify($password, $user['password_hash'])) {

    // Create the session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    // Send the success response back to React
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "role" => $user['role']
        ]
    ]);
} else {
    // Invalid credentials
    http_response_code(401); // Unauthorized status code
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
}
