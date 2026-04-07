<?php
// api/db.php

// ==========================================================
// 1. CORS CONFIGURATION (Ready for Local & Production)
// ==========================================================
$allowedOrigins = [
    'http://localhost:5173',
    'https://your-infinityfree-domain.com' // Just update this line when you go live
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Added a few extra standard headers to prevent unexpected CORS blocks
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// ==========================================================
// 2. DATABASE CREDENTIALS
// ==========================================================
// Tip: Change these 4 variables when uploading to InfinityFree
$host = 'localhost';
$dbname = 'kakais_kutkutin';
$username = 'root';
$password = '';

// ==========================================================
// 3. SECURE CONNECTION
// ==========================================================
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    // CRITICAL FIX: Keep this as EXCEPTION. 
    // This ensures your try/catch blocks in files like login.php actually work if a query fails.
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prevent emulation of prepared statements (security best practice against SQL injection)
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    // We catch the specific connection error here so credentials don't leak to the frontend
    error_log("DB Connection Failed: " . $e->getMessage());

    http_response_code(500);
    die(json_encode([
        "success" => false,
        "error" => "Database connection failed. Please try again later."
    ]));
}
