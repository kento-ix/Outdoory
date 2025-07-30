<?php
class EventParticipant {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // join a event
    public function join($eventId, $userId) {
        if (!$this->canJoin($eventId)) {
            return ['success' => false, 'error' => 'Event is at full capacity'];
        }

        $pdo = $this->pdo;
        $sql = "INSERT INTO event_participants (event_id, user_id) VALUES (:event_id, :user_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        
        try {
            $result = $stmt->execute();
            return ['success' => $result, 'error' => null];
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                return ['success' => false, 'error' => 'Already participating in this event'];
            }
            return ['success' => false, 'error' => 'Database error'];
        }
    }

    // cancel participant
    public function leave($eventId, $userId) {
        $pdo = $this->pdo;
        $sql = "DELETE FROM event_participants WHERE event_id = :event_id AND user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // check if user is joined
    public function isParticipating($eventId, $userId) {
        $pdo = $this->pdo;
        $sql = "SELECT COUNT(*) FROM event_participants WHERE event_id = :event_id AND user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    // get participants numbers
    public function getParticipantCount($eventId) {
        $pdo = $this->pdo;
        $sql = "SELECT COUNT(*) FROM event_participants WHERE event_id = :event_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    // get a list of event participant
    public function getParticipants($eventId) {
        $pdo = $this->pdo;
        $sql = "SELECT u.id, u.username, ep.joined_at 
                FROM event_participants ep 
                JOIN users u ON ep.user_id = u.id 
                WHERE ep.event_id = :event_id 
                ORDER BY ep.joined_at ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserParticipatingEvents($userId) {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username, ep.joined_at
                FROM event_participants ep
                JOIN events e ON ep.event_id = e.id
                JOIN users u ON e.user_id = u.id
                WHERE ep.user_id = :user_id
                ORDER BY e.event_time ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // check if user can join
    private function canJoin($eventId) {
        $pdo = $this->pdo;
        $sql = "SELECT e.capacity, COUNT(ep.id) as current_participants
                FROM events e
                LEFT JOIN event_participants ep ON e.id = ep.event_id
                WHERE e.id = :event_id
                GROUP BY e.id, e.capacity";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':event_id', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) return false;
        if ($result['capacity'] === null) return true;
        return $result['current_participants'] < $result['capacity'];
    }
}
