<?php
/**
 * Wedora Events — site configuration.
 * Secrets (DB credentials, mail settings) are read from environment variables
 * and never printed to the page.
 */
declare(strict_types=1);

const SITE_NAME   = 'Wedora Events';
const SITE_TAGLINE = 'Wedding & Event Decoration';

// Canonical origin. Override with WEDORA_SITE_URL in production.
define('SITE_URL', rtrim(getenv('WEDORA_SITE_URL') ?: 'https://www.weddingflowerdecoration.com', '/'));

const BIZ = [
    'founder' => 'Deepanshu Kumar',
    'email'   => 'booking@weddingflowerdecoration.com',
    'phone'   => '+919258651664',
    'phone_display' => '+91 92586 51664',
    'whatsapp' => '919258651664',
    'street'  => 'Village Dadhi Mehmoodpur, Near Kaleem Chicken Tikka',
    'locality' => 'Kanth, Moradabad',
    'region'  => 'Uttar Pradesh',
    'postal'  => '244501',
    'country' => 'IN',
];

// Where lead notification e-mails go.
define('LEAD_NOTIFY_EMAIL', getenv('WEDORA_NOTIFY_EMAIL') ?: BIZ['email']);

// Database: SQLite by default (zero config). Set WEDORA_DB_DSN / _USER / _PASS for MySQL, e.g.
// mysql:host=localhost;dbname=wedora;charset=utf8mb4
define('DB_DSN',  getenv('WEDORA_DB_DSN')  ?: 'sqlite:' . dirname(__DIR__) . '/data/wedora.sqlite');
define('DB_USER', getenv('WEDORA_DB_USER') ?: null);
define('DB_PASS', getenv('WEDORA_DB_PASS') ?: null);

const LEAD_RATE_LIMIT_PER_HOUR = 5;
