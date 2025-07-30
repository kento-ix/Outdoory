<?php
class Event {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // create event sql
    public function create($userId, $title, $location, $eventTime, $capacity, $imageUrl) {
        $pdo = $this->pdo;
        $sql = "INSERT INTO events (user_id, title, location, event_time, capacity, image_url) VALUES (:user_id, :title, :location, :event_time, :capacity, :image_url)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title);
        $stmt->bindValue(':location', $location);
        $stmt->bindValue(':event_time', $eventTime);
        $stmt->bindValue(':capacity', $capacity, PDO::PARAM_INT);
        $stmt->bindValue(':image_url', $imageUrl);
        return $stmt->execute();
    }

    // get all event info
    public function getAll() {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id ORDER BY e.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUserId($userId) {
        // display recent event on top
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username 
                FROM events e 
                JOIN users u ON e.user_id = u.id 
                WHERE e.user_id = :user_id 
                ORDER BY e.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteById($eventId, $userId) {
        $pdo = $this->pdo;
        $sql = "DELETE FROM events WHERE id = :id AND user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $eventId, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // get event by id
    public function getById($eventId) {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id WHERE e.id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $eventId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // get event info with participant data
    public function getByIdWithParticipants($eventId, $currentUserId = null) {
        $pdo = $this->pdo;
        $sql = "SELECT e.*, u.username,
                (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count";

        if ($currentUserId) {
            $sql .= ", (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id AND user_id = :current_user_id) as is_participating";
        }

        $sql .= " FROM events e JOIN users u ON e.user_id = u.id WHERE e.id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $eventId, PDO::PARAM_INT);

        if ($currentUserId) {
            $stmt->bindValue(':current_user_id', $currentUserId, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // update event date and capacity
    public function updateEventDetails($eventId, $userId, $eventTime = null, $capacity = null) {
        $pdo = $this->pdo;

        $checkSql = "SELECT user_id FROM events WHERE id = :id";
        $checkStmt = $pdo->prepare($checkSql);
        $checkStmt->bindValue(':id', $eventId, PDO::PARAM_INT);
        $checkStmt->execute();
        $event = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$event || $event['user_id'] != $userId) {
            return ['success' => false, 'error' => 'Event not found or permission denied'];
        }

        $updateFields = [];
        $params = [':id' => $eventId, ':user_id' => $userId];

        if ($eventTime !== null) {
            $updateFields[] = "event_time = :event_time";
            $params[':event_time'] = $eventTime;
        }

        if ($capacity !== null) {
            $updateFields[] = "capacity = :capacity";
            $params[':capacity'] = $capacity;
        }

        if (empty($updateFields)) {
            return ['success' => false, 'error' => 'No fields to update'];
        }

        $sql = "UPDATE events SET " . implode(", ", $updateFields) . " WHERE id = :id AND user_id = :user_id";

        try {
            $stmt = $pdo->prepare($sql);
            foreach ($params as $key => $value) {
                if ($key === ':capacity') {
                    $stmt->bindValue($key, $value, PDO::PARAM_INT);
                } else {
                    $stmt->bindValue($key, $value);
                }
            }

            $result = $stmt->execute();

            if ($result && $stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Event updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update event'];
            }

        } catch (PDOException $e) {
            return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }
}
