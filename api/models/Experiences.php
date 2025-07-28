<?php
class Experience {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($userId, $type, $imageUrl, $content) {
        $sql = "INSERT INTO experiences (user_id, type, image_url, content) VALUES (:user_id, :type, :image_url, :content)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':type', $type);
        $stmt->bindValue(':image_url', $imageUrl);
        $stmt->bindValue(':content', $content);
        return $stmt->execute();
    }

    public function deleteById($experienceId, $userId) {
        $sql = "DELETE FROM experiences WHERE id = :id AND user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $experienceId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getAll() {
        $sql = "SELECT e.*, u.username FROM experiences e JOIN users u ON e.user_id = u.id ORDER BY e.created_at DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}