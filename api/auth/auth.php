<?php
require_once __DIR__ . '/../utils/api_headers.php';

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';

require_once __DIR__ . '/../utils/jwt_helper.php';
require_once __DIR__ . '/../utils/request_helper.php';

// POST/DELETE
$method_type = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true) ?? [];

// GET パラメータ
$action = $_GET['action'];

// User モデル
$userModel = new User($pdo);

// --- GET: pong test ---
if ($action === 'pong') {
    echo json_encode([
        "status" => "ok",
        "message" => "pong",
        "test" => "auth api test message"
    ]);
    exit();
}

// --- POST ---
if ($method_type === 'POST') {

    // -------------------
    // register
    // -------------------
    if ($action === 'register') {

        list($isValid, $val_messages) = validate_registration($data);
        if (!$isValid) {
            http_response_code(400);
            echo json_encode(['errors' => $val_messages]);
            exit;
        }
        
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        if ($userModel->exists($username, $email)) {
            http_response_code(409);
            echo json_encode(['error' => 'Username or email already exists']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $userModel->create($username, $email, $hashedPassword);

        http_response_code(201);
        echo json_encode(['message' => 'User registered successfully']);
        exit;

    // -------------------
    // login
    // -------------------
    } elseif ($action === 'login') {
        list($isValid, $val_messages) = validate_login($data);
        if (!$isValid) {
            http_response_code(400);
            echo json_encode(['errors' => $val_messages]);
            exit;
        }

        $username = $data['username'];
        $password = $data['password'];
        $user = $userModel->findByUsername($username);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password']);
            exit;
        }

        $payload = [
            'sub' => $user['id'],
            'username' => $user['username'],
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];
        $token = JWT::encode($payload, $_ENV['SECRET_KEY'], 'HS256');

        echo json_encode([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ]
        ]);
        exit;

    // -------------------
    // logout
    // -------------------
    } elseif ($action === 'logout') {
        // domain は空にして本番対応
        setcookie("token", "", time() - 3600, "/", "", false, true);
        http_response_code(200);
        echo json_encode(['message' => 'Logged out successfully']);
        exit;

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown POST action']);
        exit;
    }
}

// --- DELETE ---
if ($method_type === 'DELETE' && $action === 'delete_account') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? getallheaders()['Authorization']
        ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing or invalid']);
        exit;
    }

    $jwt = $matches[1];

    try {
        $decoded = JWT::decode($jwt, new Key($_ENV['SECRET_KEY'], 'HS256'));
        $userId = $decoded->sub;
        $userModel->deleteById($userId);
        http_response_code(200);
        echo json_encode(['message' => 'Account deleted successfully']);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
    }
    exit;
}

// --- Default ---
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
exit();


// -------------------
// validation functions
// -------------------
function validate_registration($data) {
    $messages = ['username'=>'','email'=>'','password'=>''];
    $isValid = true;

    if (empty($data['username'])) { $messages['username']='Username is required'; $isValid=false; }
    if (empty($data['email']) || !preg_match('#^(.+)@([^\.].*)\.([a-z]{2,})$#', $data['email'])) {
        $messages['email']='Invalid or missing email'; $isValid=false;
    }
    if (empty($data['password'])) { $messages['password']='Password is required'; $isValid=false; }

    return [$isValid, $messages];
}

function validate_login($data) {
    $messages = ['username'=>'','password'=>''];
    $isValid = true;

    if (empty($data['username'])) { $messages['username']='Username is required'; $isValid=false; }
    if (empty($data['password'])) { $messages['password']='Password is required'; $isValid=false; }

    return [$isValid, $messages];
}
