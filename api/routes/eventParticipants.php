<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Event.php';
require_once __DIR__ . '/../models/EventParticipant.php';

require_once __DIR__ . '/../utils/api_headers.php';
require_once __DIR__ . '/../utils/jwt_helper.php';
require_once __DIR__ . '/../utils/request_helper.php';


$eventModel = new Event($pdo);
$participantModel = new EventParticipant($pdo);

// join a event
if ($method_type === 'POST' && $action === 'join') {
    $userId = getUserIdFromToken();
    $eventId = $data['event_id'] ?? null;

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    // check if the event exist
    $event = $eventModel->getById($eventId);
    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        exit();
    }

    $result = $participantModel->join($eventId, $userId);
    
    if ($result['success']) {
        http_response_code(201);
        echo json_encode(['message' => 'Successfully joined the event']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => $result['error']]);
    }
    exit();
}

// leave the event
if ($method_type === 'DELETE' && $action === 'leave') {
    $userId = getUserIdFromToken();
    $eventId = $_GET['event_id'] ?? null;

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    $result = $participantModel->leave($eventId, $userId);
    
    if ($result) {
        echo json_encode(['message' => 'Successfully left the event']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to leave event or not participating']);
    }
    exit();
}

// get a lsit of participants 
if ($method_type === 'GET' && $action === 'participants') {
    $eventId = $_GET['event_id'] ?? null;
    

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    $participants = $participantModel->getParticipants($eventId);
    $participantCount = $participantModel->getParticipantCount($eventId);
    
    echo json_encode([
        'participants' => $participants,
        'count' => $participantCount
    ]);
    exit();
}

// check state of user participant
if ($method_type === 'GET' && $action === 'check') {
    $userId = getUserIdFromToken();
    $eventId = $_GET['event_id'] ?? null;

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    $isParticipating = $participantModel->isParticipating($eventId, $userId);
    $participantCount = $participantModel->getParticipantCount($eventId);
    
    echo json_encode([
        'is_participating' => $isParticipating,
        'participant_count' => $participantCount
    ]);
    exit();
}

// get event where user joined
if ($method_type === 'GET' && $action === 'my_events') {
    $userId = getUserIdFromToken();
    
    $events = $participantModel->getUserParticipatingEvents($userId);
    
    echo json_encode(['events' => $events]);
    exit();
}

// event information
if ($method_type === 'GET' && $action === 'event_detail') {
    $eventId = $_GET['event_id'] ?? null;
    $userId = getUserIdFromToken();

    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'event_id is required']);
        exit();
    }

    $event = $eventModel->getByIdWithParticipants($eventId, $userId);
    
    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        exit();
    }
    
    if (isset($event['is_participating'])) {
        $event['is_participating'] = (bool)$event['is_participating'];
    }

    echo json_encode(['event' => $event]);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);

