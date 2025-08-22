<?php
require_once __DIR__ . '/../vendor/autoload.php';

// .env があれば読み込む
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

// 環境判定
$appEnv = $_ENV['APP_ENV'] ?? 'local';
$isLocal = ($appEnv === 'local');

if ($isLocal) {
    // ローカル接続
    $host = $_ENV['DB_HOST_LOCAL'] ?? '127.0.0.1';
    $port = $_ENV['DB_PORT_LOCAL'] ?? '3306';
    $user = $_ENV['DB_USER_LOCAL'] ?? 'root';
    $pass = $_ENV['DB_PASSWORD_LOCAL'] ?? '';
    $db   = $_ENV['DB_NAME'] ?? 'mydb';
} else {
    // 本番接続 (Railway 内 Private Network)
    $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
    $port = $_ENV['DB_PORT'] ?? '3306';
    $user = $_ENV['DB_USER'] ?? 'root';
    $pass = $_ENV['DB_PASSWORD'] ?? '';
    $db   = $_ENV['DB_NAME'] ?? 'mydb';
}

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}
