<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

if ($_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->name) || empty($data->password) || empty($data->role)) {
    echo json_encode(["success" => false, "message" => "Name, password, and role are required."]);
    exit();
}

$hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
// Use the email as the login username if username isn't provided separately
$username = !empty($data->email) ? explode('@', $data->email)[0] : strtolower(str_replace(' ', '_', $data->name));

try {
    $stmt = $pdo->prepare("
        INSERT INTO users (username, full_name, email, phone, password_hash, role, status, date_hired) 
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    ");
    $stmt->execute([
        $username,
        $data->name,
        $data->email ?? null,
        $data->phone ?? null,
        $hashed_password,
        strtolower($data->role),
        $data->status ?? 'Active'
    ]);

    echo json_encode(["success" => true, "message" => "User created successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
