<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Event.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$method_type = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $_GET['action'] ?? null;

$eventModel = new Event($pdo);

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


if ($method_type === 'GET' && $action === 'list') {
    $events = $eventModel->getAll();
    echo json_encode(['events' => $events]);
    exit();
}

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

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);


function getUserIdFromToken() {
    global $pdo;
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? getallheaders()['Authorization']
        ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing or invalid']);
        exit();
    }

    $jwt = $matches[1];
    try {
        $decoded = JWT::decode($jwt, new Key($_ENV['SECRET_KEY'], 'HS256'));
        return $decoded->sub;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit();
    }
}