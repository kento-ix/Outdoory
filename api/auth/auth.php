<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';

require_once __DIR__ . '/../utils/api_headers.php';
require_once __DIR__ . '/../utils/jwt_helper.php';
require_once __DIR__ . '/../utils/request_helper.php';

$userModel = new User($pdo);

// register, login, logout and delete 
if ($method_type === 'POST') {

    if ($action === 'register') {
        // register
        list($isValid, $val_messages) = validate_registration($data);

        if(!$isValid) {
            http_response_code(400);
            echo json_encode(['errors' => $val_messages]);
            exit;
        }

        // get data
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];


        // check username or email exist
        if ($userModel->exists($username, $email)) {
            http_response_code(409);
            echo json_encode(['error' => 'Username or email already exists']);
            exit;
        }

        // hashpassword
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        

        // add users info to database
        $userModel->create($username, $email, $hashedPassword);

        http_response_code(201);
        echo json_encode(['message' => 'User registered successfully']);
        exit;

    } elseif ($action === 'login') {
        // login
        list($isValid, $val_messages) = validate_login($data);

        if (!$isValid) {
            http_response_code(400);
            echo json_encode(['errors' => $val_messages]);
            exit;
        }

        $username = $data['username'];
        $password = $data['password'];

        // find user by username
        $user = $userModel->findByUsername($username);


        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password']);
            exit;
        }

        // JWT
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

    } elseif ($action === 'logout') {
        // logout
        setcookie("token", "", time() - 3600, "/", "localhost", false, true);

        http_response_code(200);
        echo json_encode(['message' => 'Logged out successfully']);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Unknown POST action']);
    }
}

// DELETE method
if ($method_type === 'DELETE' && $action === 'delete_account') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? getallheaders()['Authorization']
        ?? '';

    // find by jwt
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing or invalid']);
        exit;
    }

    $jwt = $matches[1];

    try {
        $decoded = JWT::decode($jwt, new Key($_ENV['SECRET_KEY'], 'HS256'));
        $userId = $decoded->sub;

        // delete user
        $userModel->deleteById($userId);
        http_response_code(200);
        echo json_encode(['message' => 'Account deleted successfully']);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
    }
    exit;
}

if ($_GET['action'] === 'pong') {
    echo json_encode(["status" => "ok", "message" => "pong"]);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);


// --- Validation functions --- 

// signin
function validate_registration($data) {
    $messages = [
        'username' => '',
        'email' => '',
        'password' => ''
    ];
    $isValid = true;

    // username
    if(empty($data['username'])) {
        $messages['username'] = 'Username is required';
        $isValid = false;
    }

    // email
    $email_pattern = '#^(.+)@([^\.].*)\.([a-z]{2,})$#';
    if(empty($data['email']) || !preg_match($email_pattern, $data['email'])) {
        $messages['email'] = 'Invalid or missing email';
        $isValid = false;
    }

    // password
    if (empty($data['password'])) {
        $messages['password'] = 'Password is required';
        $isValid = false;
    }

    return [$isValid, $messages];

}

// login
function validate_login($data) {
    $messages = [
        'username' => '',
        'password' => ''
    ];
    $isValid = true;

    if(empty($data['username'])) {
        $messages['username'] = 'Username is required';
        $isValid = false;
    }

    if(empty($data['password'])) {
        $messages['password'] = 'Password is required';
        $isValid = false;
    }

    return [$isValid, $messages];
}