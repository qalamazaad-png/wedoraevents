<?php
require_once __DIR__ . '/includes/content.php';
$meta = [
    'title' => 'Portfolio | Wedding & Event Decoration by Wedora Events',
    'description' => 'Browse Wedora Events decoration projects: weddings, receptions, engagements, mehndi, haldi, luxury décor and corporate events in Moradabad.',
    'path' => 'portfolio.php',
    'body_class' => 'page',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
<header class="page-hero"><div class="container">
  <p class="eyebrow">Portfolio</p>
  <h1>Spaces we've <em>brought to life.</em></h1>
</div></header>
<section class="section"><div class="container">
  <div class="filters" role="group" aria-label="Filter projects by category">
    <button type="button" class="active" data-filter="all" aria-pressed="true">All</button>
    <?php foreach ($CATEGORIES as $c): ?><button type="button" data-filter="<?= e($c) ?>" aria-pressed="false"><?= e($c) ?></button><?php endforeach; ?>
  </div>
  <div class="grid-portfolio" id="portfolioGrid">
    <?php foreach ($PORTFOLIO as $p): ?>
    <a class="p-item" href="<?= e($p['img']) ?>" data-lightbox data-category="<?= e($p['category']) ?>" data-caption="<?= e($p['title'] . ' — ' . $p['category']) ?>">
      <img src="<?= e($p['img']) ?>" alt="<?= e($p['title']) ?>, <?= e($p['category']) ?> décor by Wedora" loading="lazy" width="600" height="750">
      <span class="p-meta"><b><?= e($p['title']) ?></b><em><?= e($p['category']) ?></em></span>
    </a>
    <?php endforeach; ?>
  </div>
</div></section>
<section class="section final-cta"><div class="container center reveal">
  <h2>Imagine this, <em>for your day.</em></h2>
  <div class="btn-row center-row"><a class="btn" href="contact.php">Plan Your Event</a></div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
