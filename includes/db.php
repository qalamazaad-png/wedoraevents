<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

/** Shared PDO connection (prepared statements only). Creates the leads table if needed. */
function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;

    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $isSqlite = str_starts_with(DB_DSN, 'sqlite:');
    $id = $isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY';
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id $id,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(160) NULL,
        event_type VARCHAR(60) NOT NULL,
        event_date VARCHAR(20) NULL,
        venue VARCHAR(160) NULL,
        guests VARCHAR(30) NULL,
        budget VARCHAR(40) NULL,
        message TEXT NULL,
        ip_hash CHAR(64) NOT NULL,
        created_at DATETIME NOT NULL
    )");
    return $pdo;
}
