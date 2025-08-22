<?php
require_once __DIR__ . '/../utils/api_headers.php';

// CORS設定
$allowed_origins = [
    "https://outdoory-five.vercel.app",
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// リクエスト情報を取得
$path = $_GET['path'] ?? '';
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// URLパスで振り分け
switch(true) {
    case str_starts_with($path, 'auth/'):
        require __DIR__ . '/../auth/auth.php';
        break;
    case str_starts_with($path, 'events/'):
        require __DIR__ . '/../routes/events.php';
        break;
    case str_starts_with($path, 'eventParticipants/'):
        require __DIR__ . '/../routes/eventParticipants.php';
        break;
    case str_starts_with($path, 'experiences/'):
        require __DIR__ . '/../routes/experiences.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        break;
}
