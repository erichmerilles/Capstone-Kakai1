<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

if ($_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id) || empty($data->name) || empty($data->role)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

try {
    if (!empty($data->password)) {
        $hashed = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, status = ?, password_hash = ? WHERE id = ?");
        $stmt->execute([$data->name, $data->email, $data->phone, strtolower($data->role), $data->status, $hashed, $data->id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, status = ? WHERE id = ?");
        $stmt->execute([$data->name, $data->email, $data->phone, strtolower($data->role), $data->status, $data->id]);
    }

    echo json_encode(["success" => true, "message" => "User updated successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
