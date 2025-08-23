<?php
if (file_exists(__DIR__ . '/../api/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../api');
    $dotenv->load();
}

$user = $_ENV['MYSQLUSER'] ?? getenv('MYSQLUSER');
$pass = $_ENV['MYSQLPASSWORD'] ?? getenv('MYSQLPASSWORD');
$db   = $_ENV['MYSQLDATABASE'] ?? getenv('MYSQLDATABASE');
$host = $_ENV['MYSQLHOST'] ?? getenv('MYSQLHOST');
$port = $_ENV['MYSQLPORT'] ?? getenv('MYSQLPORT');

var_dump($_ENV);
var_dump($_SERVER);
var_dump(getenv());


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
