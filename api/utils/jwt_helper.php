<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function jwt_encode($payload) {
    return JWT::encode($payload, $_ENV['SECRET_KEY'], 'HS256');
}

function jwt_decode($token) {
    return JWT::decode($token, new Key($_ENV['SECRET_KEY'], 'HS256'));
}

function getUserIdFromToken() {
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
        $decoded = jwt_decode($jwt);
        return $decoded->sub;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit();
    }
}
