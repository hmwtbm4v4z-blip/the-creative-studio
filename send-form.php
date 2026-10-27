<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'POST requests only.']);
    exit;
}

// Quietly reject the hidden bot field while returning the same safe response.
if (!empty($_POST['contactWebsite'])) {
    echo json_encode(['success' => true]);
    exit;
}

$recipient = 'jeremy@the-creative-studio.com';
$subject = trim((string)($_POST['email-subject'] ?? 'New Creative Studio website message'));
$subject = preg_replace('/[\r\n]+/', ' ', $subject) ?: 'New Creative Studio website message';
$subject = mb_substr($subject, 0, 180);
$body = trim((string)($_POST['email-body'] ?? ''));

if ($body === '') {
    $fields = [];
    foreach ($_POST as $key => $value) {
        if (in_array($key, ['email-subject', 'email-body', 'contactWebsite'], true)) continue;
        $values = is_array($value) ? implode(', ', array_map('strval', $value)) : (string)$value;
        $fields[] = ucwords(str_replace(['-', '_'], ' ', (string)$key)) . ': ' . trim($values);
    }
    $body = implode("\n", $fields);
}

$sender = trim((string)($_POST['email'] ?? $_POST['contactEmail'] ?? ''));
$sender = filter_var($sender, FILTER_VALIDATE_EMAIL) ? $sender : $recipient;
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: The Creative Studio Website <' . $recipient . '>',
    'Reply-To: ' . $sender,
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    http_response_code(502);
    echo json_encode(['success' => false, 'message' => 'Mail transport is not configured on this host.']);
    exit;
}

echo json_encode(['success' => true]);
