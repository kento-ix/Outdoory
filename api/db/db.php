<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// 環境判定
$appEnv = $_ENV['APP_ENV'] ?? 'local';
$isLocal = ($appEnv === 'local');

// 接続情報を切り替え
$host = $isLocal ? $_ENV['DB_HOST_LOCAL'] : $_ENV['DB_HOST_PROD'];
$port = $isLocal ? $_ENV['DB_PORT_LOCAL'] : $_ENV['DB_PORT_PROD'];
$user = $isLocal ? $_ENV['DB_USER_LOCAL'] : $_ENV['DB_USER_PROD'];
$pass = $isLocal ? $_ENV['DB_PASSWORD_LOCAL'] : $_ENV['DB_PASSWORD_PROD'];
$db   = $_ENV['DB_NAME'];

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "DB connection success";
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}
