<?php
class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function findByUsername($username) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindValue(':username', $username);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function exists($username, $email) {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username OR email = :email");
        $stmt->bindValue(':username', $username);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function create($username, $email, $hashedPassword) {
        $stmt = $this->pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
        $stmt->bindValue(':username', $username);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password', $hashedPassword);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }
}
