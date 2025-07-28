<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Experience.php';

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

$experienceModel = new Experience($pdo);

if ($method_type === 'POST' && $action === 'create') {
    $userId = getUserIdFromToken();

    $type = $_POST['type'] ?? '';
    $content = $_POST['content'] ?? '';

    $imageUrl = null;

    // 修正: 'image'フィールドをチェック（配列ではなく単一ファイル）
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $originalName = $_FILES['image']['name'];
        $newName = uniqid() . '_' . basename($originalName);
        $targetPath = $uploadDir . $newName;
        $tmpPath = $_FILES['image']['tmp_name'];

        if (move_uploaded_file($tmpPath, $targetPath)) {
            $imageUrl = '/uploads/' . $newName;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload image']);
            exit();
        }
    }

    if (!$type || !in_array($type, ['photo', 'article'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid type (photo or article) is required']);
        exit();
    }

    $res = $experienceModel->create($userId, $type, $imageUrl, $content);

    if ($res) {
        http_response_code(201);
        echo json_encode(['message' => 'Experience created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create experience']);
    }
    exit();
}

if ($method_type === 'GET' && $action === 'list') {
    $experiences = $experienceModel->getAll();
    echo json_encode(['experiences' => $experiences]);
    exit();
}

if ($method_type === 'DELETE' && $action === 'delete') {
    $userId = getUserIdFromToken();
    $experienceId = $_GET['id'] ?? null;

    if (!$experienceId) {
        http_response_code(400);
        echo json_encode(['error' => 'id is required']);
        exit();
    }

    $res = $experienceModel->deleteById($experienceId, $userId);
    if ($res) {
        echo json_encode(['message' => 'Experience deleted successfully']);
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Failed to delete experience or permission denied']);
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