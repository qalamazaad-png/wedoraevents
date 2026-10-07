<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS'])]);
    session_start();
}

/** Escape for HTML output. */
function e(?string $v): string { return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

/** Absolute URL for a site path. */
function url(string $path = ''): string { return SITE_URL . '/' . ltrim($path, '/'); }

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function csrf_ok(?string $t): bool { return is_string($t) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $t); }

function wa_link(string $text = 'Hello Wedora, I would like to plan an event.'): string
{
    return 'https://wa.me/' . BIZ['whatsapp'] . '?text=' . rawurlencode($text);
}

const EVENT_TYPES = [
    'Wedding', 'Reception', 'Engagement', 'Mehndi', 'Haldi',
    'Stage / Mandap Decoration', 'Floral Design', 'Venue Styling', 'Corporate Event', 'Other',
];
const BUDGETS = ['Under ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹3,00,000', '₹3,00,000 – ₹5,00,000', '₹5,00,000+', 'Not sure yet'];
const GUEST_COUNTS = ['Under 100', '100 – 250', '250 – 500', '500 – 1,000', '1,000+'];
