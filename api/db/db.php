<?php

require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$user = $_ENV['MYSQLUSER'];
$pass = $_ENV['MYSQLPASSWORD'];
$db   = $_ENV['MYSQLDATABASE'];
$host = $_ENV['MYSQLHOST'];
$port = $_ENV['MYSQLPORT'];

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
