<?php
// api/auth/reset_admin.php
require '../db.php';

// The password we want to use
$newPassword = 'admin123';

// Let your specific server generate the perfect hash
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

try {
    // Forcefully update the admin account with this new hash
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE username = 'admin'");
    $stmt->execute([$hashedPassword]);

    echo "<h1>Success!</h1>";
    echo "<p>The admin password has been successfully hard-reset to: <b>admin123</b></p>";
    echo "<p>You can close this tab and try logging into React now!</p>";
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
