<?php
// get_permissions.php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Change to your frontend URL
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Database connection (adjust to match your setup)
$host = 'localhost';
$db   = 'kakai_db'; // Your database name
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

try {
    // Get all allowed permissions
    $stmt = $pdo->query("SELECT role_name, permission_id FROM role_permissions WHERE is_allowed = 1");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedData = [
        "Stockman" => [],
        "Cashier" => []
    ];

    // Format the database rows into the JSON structure React expects
    foreach ($results as $row) {
        // Convert lowercase database role to Title Case for the React state
        $roleTitleCase = ucfirst(strtolower($row['role_name']));

        if (isset($formattedData[$roleTitleCase])) {
            $formattedData[$roleTitleCase][$row['permission_id']] = true;
        }
    }

    echo json_encode($formattedData);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
