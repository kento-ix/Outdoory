<?php

require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api');
$dotenv->load();


// .env に書かれた環境変数を読み取る
$user = $_ENV['MYSQLUSER'] ?? null;
$pass = $_ENV['MYSQLPASSWORD'] ?? null;
$db   = $_ENV['MYSQLDATABASE'] ?? null;
$host = $_ENV['MYSQLHOST'] ?? null;
$port = $_ENV['MYSQLPORT'] ?? null;

var_dump($user, $pass, $db, $host, $port);
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
