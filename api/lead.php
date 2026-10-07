<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/db.php';

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, string $msg, bool $json, string $return = 'contact.php', int $code = 200): never
{
    if ($json) {
        http_response_code($ok ? 200 : $code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    } else {
        $return = preg_match('/^[a-z\-]+\.php$/', $return) ? $return : 'contact.php';
        header('Location: ../' . $return . '?' . ($ok ? 'sent=1' : 'error=' . rawurlencode($msg)) . '#enquire');
    }
    exit;
}

$return = (string)($_POST['return'] ?? 'contact.php');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(false, 'Invalid request.', $wantsJson, $return, 405);
if (!csrf_ok($_POST['csrf'] ?? null)) respond(false, 'Your session expired. Please reload the page and try again.', $wantsJson, $return, 403);

// Spam protection: honeypot + minimum fill time. Bots get a silent "success".
$tooFast = isset($_SESSION['form_t']) && (time() - (int)$_SESSION['form_t']) < 3;
if (!empty($_POST['website']) || $tooFast) respond(true, 'Thank you.', $wantsJson, $return);

$clean = static fn(string $k, int $max): string => mb_substr(trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', (string)($_POST[$k] ?? ''))), 0, $max);

$d = [
    'name' => $clean('name', 120), 'phone' => $clean('phone', 20), 'email' => $clean('email', 160),
    'event_type' => $clean('event_type', 60), 'event_date' => $clean('event_date', 10), 'venue' => $clean('venue', 160),
    'guests' => $clean('guests', 30), 'budget' => $clean('budget', 40), 'message' => $clean('message', 2000),
];

$errors = [];
if (mb_strlen($d['name']) < 2) $errors[] = 'Please enter your name.';
if (!preg_match('/^\+?[0-9][0-9\s\-]{8,16}$/', $d['phone'])) $errors[] = 'Please enter a valid phone number.';
if ($d['email'] !== '' && !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
if (!in_array($d['event_type'], EVENT_TYPES, true)) $errors[] = 'Please choose an event type.';
if ($d['event_date'] !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $d['event_date'])) $errors[] = 'Please enter a valid date.';
if ($d['guests'] !== '' && !in_array($d['guests'], GUEST_COUNTS, true)) $d['guests'] = '';
if ($d['budget'] !== '' && !in_array($d['budget'], BUDGETS, true)) $d['budget'] = '';
if ($errors) respond(false, implode(' ', $errors), $wantsJson, $return, 422);

try {
    $pdo = db();
    $ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|wedora');
    $since = date('Y-m-d H:i:s', time() - 3600);

    $st = $pdo->prepare('SELECT COUNT(*) FROM leads WHERE ip_hash = ? AND created_at > ?');
    $st->execute([$ipHash, $since]);
    if ((int)$st->fetchColumn() >= LEAD_RATE_LIMIT_PER_HOUR) {
        respond(false, 'Too many enquiries from your connection. Please call or WhatsApp us instead.', $wantsJson, $return, 429);
    }

    $pdo->prepare('INSERT INTO leads (name, phone, email, event_type, event_date, venue, guests, budget, message, ip_hash, created_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        ->execute([$d['name'], $d['phone'], $d['email'] ?: null, $d['event_type'], $d['event_date'] ?: null, $d['venue'] ?: null,
                   $d['guests'] ?: null, $d['budget'] ?: null, $d['message'] ?: null, $ipHash, date('Y-m-d H:i:s')]);
} catch (Throwable $ex) {
    error_log('Wedora lead DB error: ' . $ex->getMessage());
    respond(false, 'Sorry, something went wrong. Please call or WhatsApp us directly.', $wantsJson, $return, 500);
}

// Notification e-mail (best effort — the lead is already stored). Header-injection safe: no user data in headers.
$body = "New Wedora enquiry\n\n";
foreach ($d as $k => $v) $body .= ucfirst(str_replace('_', ' ', $k)) . ': ' . $v . "\n";
@mail(LEAD_NOTIFY_EMAIL, 'New enquiry: ' . preg_replace('/[\r\n]+/', ' ', $d['event_type']), $body,
      'Content-Type: text/plain; charset=UTF-8' . "\r\n" . 'From: ' . SITE_NAME . ' <' . BIZ['email'] . '>');

unset($_SESSION['form_t']);
respond(true, "Thank you — we've received your enquiry and will call you shortly.", $wantsJson, $return);
