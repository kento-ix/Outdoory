<?php
class Experience {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($userId, $type, $imageUrl, $content) {
        $pdo = $this->pdo;
        $sql = "INSERT INTO experiences (user_id, type, image_url, content) VALUES (:user_id, :type, :image_url, :content)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':image_url', $imageUrl);
        $stmt->bindValue(':content', $content);
        return $stmt->execute();
    }

    public function getAll() {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username FROM experiences e JOIN users u ON e.user_id = u.id ORDER BY e.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUserId($userId) {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username 
                FROM experiences e 
                JOIN users u ON e.user_id = u.id 
                WHERE e.user_id = :user_id 
                ORDER BY e.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteById($experienceId, $userId) {
        $pdo = $this->pdo;
        $sql = "DELETE FROM experiences WHERE id = :id AND user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $experienceId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
