<?php
require_once __DIR__ . '/../vendor/autoload.php';

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

// 共通設定（ユーザー名、パスワード、DB名は同じ）
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASSWORD'] ?? '';
$db   = $_ENV['DB_NAME'] ?? 'mydb';

// 環境ごとのホストとポート
if (($_ENV['APP_ENV'] ?? 'local') === 'local') {
    $host = $_ENV['DB_HOST'];
    $port = $_ENV['DB_PORT'];
} else {
    $host = $_ENV['MYSQLHOST'];
    $port = $_ENV['MYSQLPORT'];
}

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
