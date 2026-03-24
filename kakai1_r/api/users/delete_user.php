<?php
// api/users/delete_user.php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

if ($_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    echo json_encode(["success" => false, "message" => "User ID is required."]);
    exit();
}

// PREVENT ADMIN SUICIDE: Do not allow the logged-in admin to delete themselves
if ($data->id == $_SESSION['user_id']) {
    echo json_encode(["success" => false, "message" => "You cannot delete your own active account!"]);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$data->id]);

    echo json_encode(["success" => true, "message" => "User deleted successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
