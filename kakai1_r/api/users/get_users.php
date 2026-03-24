<?php
require '../db.php';
require '../auth_guard.php';

header('Content-Type: application/json');

if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit();
}

try {
    $stmt = $pdo->query("
        SELECT id, username, full_name, email, phone, role, status, 
               DATE_FORMAT(date_hired, '%Y-%m-%d') as date_hired, 
               DATE_FORMAT(last_login, '%b %d, %Y %h:%i %p') as last_login 
        FROM users 
        ORDER BY role ASC, full_name ASC
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $users]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
