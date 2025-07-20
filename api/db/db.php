<?php
// setup composer to read .env file and generate jwt token

// require_once __DIR__ pass directiry correct
require_once __DIR__ . '/../vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    $pdo = new PDO(
        $_ENV['DATABASE_URL'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASSWORD'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    //echo "DB connection success";
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}
