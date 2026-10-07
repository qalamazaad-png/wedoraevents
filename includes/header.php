<?php
/** Shared <head> + navigation. Expects $meta = [title, description, path, (optional) image, body_class, schema[]]. */
require_once __DIR__ . '/functions.php';
$meta += ['image' => 'assets/img/og-image.png', 'body_class' => '', 'schema' => [], 'robots' => 'index,follow'];
$canonical = url($meta['path'] === 'index.php' ? '' : $meta['path']);
$current = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');
$nav = [
    ['Home', 'index.php', 'index.php'],
    ['About', 'about.php', 'about.php'],
    ['Services', 'services.php', 'services.php'],
    ['Experiences', 'index.php#experience', null],
    ['Portfolio', 'portfolio.php', 'portfolio.php'],
    ['Contact', 'contact.php', 'contact.php'],
];
$localBusiness = [
    '@context' => 'https://schema.org',
    '@type' => ['LocalBusiness', 'EventPlanner'],
    '@id' => url('#business'),
    'name' => SITE_NAME,
    'description' => 'Wedding, stage, mandap, reception, engagement, mehndi, haldi and corporate event decoration in Moradabad, Uttar Pradesh.',
    'url' => url(),
    'logo' => url('assets/img/favicon.svg'),
    'image' => url($meta['image']),
    'telephone' => BIZ['phone'],
    'email' => BIZ['email'],
    'founder' => ['@type' => 'Person', 'name' => BIZ['founder']],
    'address' => [
        '@type' => 'PostalAddress',
        'streetAddress' => BIZ['street'],
        'addressLocality' => BIZ['locality'],
        'addressRegion' => BIZ['region'],
        'postalCode' => BIZ['postal'],
        'addressCountry' => BIZ['country'],
    ],
    'areaServed' => ['@type' => 'AdministrativeArea', 'name' => 'Moradabad, Uttar Pradesh'],
];
?>
<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= e($meta['title']) ?></title>
<meta name="description" content="<?= e($meta['description']) ?>">
<meta name="robots" content="<?= e($meta['robots']) ?>">
<meta name="theme-color" content="#171514">
<link rel="canonical" href="<?= e($canonical) ?>">
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
<meta property="og:title" content="<?= e($meta['title']) ?>">
<meta property="og:description" content="<?= e($meta['description']) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:image" content="<?= e(url($meta['image'])) ?>">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($meta['title']) ?>">
<meta name="twitter:description" content="<?= e($meta['description']) ?>">
<meta name="twitter:image" content="<?= e(url($meta['image'])) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="assets/css/style.css?v=1">
<script type="application/ld+json"><?= json_encode($localBusiness, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?></script>
<?php foreach ($meta['schema'] as $s): ?>
<script type="application/ld+json"><?= json_encode($s, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?></script>
<?php endforeach; ?>
<script>document.documentElement.classList.add('js')</script>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script>
</head>
<body class="<?= e($meta['body_class']) ?>">
<a class="skip-link" href="#main">Skip to content</a>

<header class="site-header" id="siteHeader">
  <div class="container nav-wrap">
    <a class="brand" href="index.php" aria-label="Wedora Events — home">WEDORA</a>
    <nav class="primary-nav" id="primaryNav" aria-label="Main">
      <ul>
        <?php foreach ($nav as [$label, $href, $match]): ?>
          <li><a href="<?= e($href) ?>"<?= $match === $current ? ' aria-current="page"' : '' ?>><?= e($label) ?></a></li>
        <?php endforeach; ?>
      </ul>
      <a class="btn btn-sm nav-cta" href="contact.php">Plan Your Event</a>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="primaryNav">
      <span></span><span></span>
    </button>
  </div>
</header>
