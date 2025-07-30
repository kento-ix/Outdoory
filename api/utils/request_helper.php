<?php
$method_type = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $_GET['action'] ?? null;
?>