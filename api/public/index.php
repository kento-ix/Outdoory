<?php
require_once __DIR__ . '/../utils/api_headers.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(str_replace('/index.php', '', $uri), '/');
$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

var_dump($uri, $path); exit;
switch (true) {
    case str_starts_with($path, 'auth'):
        require_once __DIR__ . '/../auth/auth.php';
        break;
    case str_starts_with($path, 'events'):
        require_once __DIR__ . '/../routes/events.php';
        break;
    case str_starts_with($path, 'eventParticipants'):
        require_once __DIR__ . '/../routes/eventParticipants.php';
        break;
    case str_starts_with($path, 'experiences'):
        require_once __DIR__ . '/../routes/experiences.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        break;
}