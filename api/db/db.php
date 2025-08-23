<?php
// if (file_exists(__DIR__ . '/../api/.env')) {
//     $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api');
//     $dotenv->load();
// }

$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASSWORD'];
$db   = $_ENV['DB_NAME'];

var_dump($user, $pass, $db, $host, $port);
exit;

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    // echo "DB connection successful! Host: $host, DB: $db\n";
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage() . "\n");
}
