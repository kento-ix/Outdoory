<?php
class Event {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($userId, $title, $location, $eventTime, $capacity, $imageUrl) {
        $sql = "INSERT INTO events (user_id, title, location, event_time, capacity, image_url) VALUES (:user_id, :title, :location, :event_time, :capacity, :image_url)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':location', $location);
        $stmt->bindValue(':event_time', $eventTime);
        $stmt->bindValue(':capacity', $capacity, PDO::PARAM_INT);
        $stmt->bindValue(':image_url', $imageUrl);
        return $stmt->execute();
    }

    public function deleteById($eventId, $userId) {
        $sql = "DELETE FROM events WHERE id = :id AND user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getAll() {
        $sql = "SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id ORDER BY e.created_at DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
