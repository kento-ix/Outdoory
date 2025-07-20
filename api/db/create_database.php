<?php

require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    // abstract database name
    preg_match('/dbname=([^;]+)/', $_ENV['DATABASE_URL'], $matches);
    $dbName = $matches[1] ?? die("not found DB name at URL\n");

    // connect without database
    $pdo = new PDO(
        "mysql:host=127.0.0.1;charset=utf8mb4", // connect without database name
        $_ENV['DB_USER'],
        $_ENV['DB_PASSWORD'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // creaet database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    echo "Database '$dbName' created or already exists.\n";

} catch (PDOException $e) {
    die("Failed to create database: " . $e->getMessage() . "\n");
}
