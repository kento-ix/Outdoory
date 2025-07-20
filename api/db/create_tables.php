<?php
require_once __DIR__ . '/db.php';

try {
    // 1. users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. events table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            event_time DATETIME,
            capacity INT,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 3. experiences table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS experiences (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            type ENUM('photo', 'article') NOT NULL,
            image_url VARCHAR(255),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 4. event_participants table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS event_participants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_id INT NOT NULL,
            user_id INT NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo "All tables created successfully.\n";

} catch (PDOException $e) {
    die("Table creation failed: " . $e->getMessage() . "\n");
}
