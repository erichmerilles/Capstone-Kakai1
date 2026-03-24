<?php
$host = 'localhost'; // Change this to your InfinityFree host when deploying
$dbname = 'kakais_kutkutin';
$username = 'root';
$password = '';

// Define CORS headers so React can communicate with PHP
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow your Vite local server
header("Access-Control-Allow-Credentials: true"); // Important for sessions/cookies
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS requests from React
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}
