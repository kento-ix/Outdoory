<?php
require_once __DIR__ . '/../utils/api_headers.php';

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Event.php';

require_once __DIR__ . '/../utils/jwt_helper.php';
require_once __DIR__ . '/../utils/request_helper.php';

$eventModel = new Event($pdo);


// post event
if ($method_type === 'POST' && $action === 'create') {
    $userId = getUserIdFromToken();

    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $eventTime = $_POST['event_time'] ?? null;
    $capacity = isset($_POST['capacity']) ? (int)$_POST['capacity'] : null;

    $imageUrls = [];

    if (isset($_FILES['images'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                $originalName = $_FILES['images']['name'][$i];

                $newName = uniqid() . '_' . basename($originalName);

                $targetPath = $uploadDir . $newName;

                $tmpPath = $_FILES['images']['tmp_name'][$i];

                if (move_uploaded_file($tmpPath, $targetPath)) {
                    $imageUrls[] = '/uploads/' . $newName;
                }
            }
        }
    }

    $imageUrl = $imageUrls[0] ?? null;

    if (!$title || !$eventTime) {
        http_response_code(400);
        echo json_encode(['error' => 'title and event_time is needed']);
        exit();
    }

    $res = $eventModel->create($userId, $title, $location, $eventTime, $capacity, $imageUrl);

    if ($res) {
        http_response_code(201);
        echo json_encode(['message' => 'Event created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create event']);
    }
    exit();
}


// get all event list
if ($method_type === 'GET' && $action === 'list') {
    $events = $eventModel->getAll();
    echo json_encode(['events' => $events]);
    exit();
}

// get event by user
if ($method_type === 'GET' && $action === 'user') {
    $userId = getUserIdFromToken();
    
    $events = $eventModel->getByUserId($userId);
    echo json_encode(['events' => $events]);
    exit();
}

// delete event
if ($method_type === 'DELETE' && $action === 'delete') {
    $userId = getUserIdFromToken();
    $eventId = $_GET['event_id'] ?? null;

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    $res = $eventModel->deleteById($eventId, $userId);
    if ($res) {
        echo json_encode(['message' => 'Event deleted successfully']);
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Failed to delete event or permission denied']);
    }
    exit();
}

// update event
if ($method_type === 'PUT' && $action === 'update') {
    $userId = getUserIdFromToken();
    $eventId = $_GET['event_id'] ?? null;
    
    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }
    
    $eventTime = $data['event_time'] ?? null;
    $capacity = isset($data['capacity']) ? (int)$data['capacity'] : null;
    
    if ($eventTime === null && $capacity === null) {
        http_response_code(400);
        echo json_encode(['error' => 'At least one field (event_time or capacity) is required']);
        exit();
    }
    
    if ($eventTime !== null) {
        $dateTime = DateTime::createFromFormat('Y-m-d H:i:s', $eventTime);
        if (!$dateTime || $dateTime->format('Y-m-d H:i:s') !== $eventTime) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid date format. Use YYYY-MM-DD HH:MM:SS']);
            exit();
        }
        
        if ($dateTime < new DateTime()) {
            http_response_code(400);
            echo json_encode(['error' => 'Event time cannot be in the past']);
            exit();
        }
    }
    
    if ($capacity !== null && $capacity <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Capacity must be greater than 0']);
        exit();
    }
    
    $result = $eventModel->updateEventDetails($eventId, $userId, $eventTime, $capacity);
    
    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['message' => $result['message']]);
    } else {
        $statusCode = ($result['error'] === 'Event not found or permission denied') ? 403 : 400;
        http_response_code($statusCode);
        echo json_encode(['error' => $result['error']]);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);


