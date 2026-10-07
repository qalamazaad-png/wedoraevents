<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/content.php';
$items = [];
foreach ($SERVICES as $i => $s) {
    $items[] = ['@type' => 'ListItem', 'position' => $i + 1, 'item' => ['@type' => 'Service', 'name' => $s['title'], 'description' => $s['text'], 'provider' => ['@id' => url('#business')], 'areaServed' => 'Moradabad, Uttar Pradesh']];
}
$meta = [
    'title' => 'Wedding & Event Decoration Services | Wedora Events Moradabad',
    'description' => 'Wedding, stage, mandap, reception, engagement, mehndi and haldi decoration, floral design, venue styling and corporate events by Wedora in Moradabad.',
    'path' => 'services.php',
    'body_class' => 'page',
    'schema' => [['@context' => 'https://schema.org', '@type' => 'ItemList', 'itemListElement' => $items]],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
<header class="page-hero"><div class="container">
  <p class="eyebrow">Services</p>
  <h1>Decoration for every <em>celebration.</em></h1>
</div></header>
<section class="section"><div class="container">
  <?php foreach ($SERVICES as $i => $s): ?>
  <article class="service-row reveal<?= $i % 2 ? ' flip' : '' ?>" id="<?= e($s['slug']) ?>">
    <div class="sr-text">
      <span class="s-num"><?= sprintf('%02d', $i + 1) ?></span>
      <h2><?= e($s['title']) ?></h2>
      <p><?= e($s['text']) ?></p>
      <a class="link-arrow" href="contact.php?service=<?= e($s['slug']) ?>#enquire">Enquire about this <span aria-hidden="true">→</span></a>
    </div>
    <figure class="sr-img"><img src="<?= e($s['img']) ?>" alt="<?= e($s['title']) ?> by Wedora" loading="lazy" width="800" height="1000"></figure>
  </article>
  <?php endforeach; ?>
</div></section>
<section class="section final-cta"><div class="container center reveal">
  <h2>Not sure what you need? <em>Let's talk.</em></h2>
  <div class="btn-row center-row"><a class="btn" href="contact.php">Plan Your Event</a><a class="btn btn-ghost" href="<?= e(wa_link()) ?>" target="_blank" rel="noopener">WhatsApp Us</a></div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
