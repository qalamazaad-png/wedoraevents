<?php
require_once __DIR__ . '/includes/content.php';
$meta = [
    'title' => 'About Wedora Events | Wedding Decorators in Kanth, Moradabad',
    'description' => 'Meet Wedora Events, a wedding and event decoration studio in Kanth, Moradabad led by founder Deepanshu Kumar. Our story, philosophy and approach.',
    'path' => 'about.php',
    'body_class' => 'page',
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
<header class="page-hero"><div class="container">
  <p class="eyebrow">About</p>
  <h1>We create the environment in which <em>your memories happen.</em></h1>
</div></header>

<section class="section"><div class="container split">
  <div class="reveal"><p class="eyebrow">Story</p><h2>A studio built around celebrations.</h2></div>
  <div class="reveal prose">
    <p>Wedora Events designs and builds decoration for weddings and family celebrations from our base in Kanth, Moradabad, Uttar Pradesh. Founder <?= e(BIZ['founder']) ?> leads every project, from the first conversation to the final flower.</p>
    <p>We work with families to turn a hall, lawn or banquet into a setting that reflects their traditions, tastes and guests.</p>
  </div>
</div></section>

<section class="section alt"><div class="container split">
  <div class="reveal"><p class="eyebrow">Philosophy</p><h2>Design the space, <em>then the moment.</em></h2></div>
  <div class="reveal prose">
    <p>Photographs fade, but the feeling of walking into a beautiful room stays. We design for that first look: the light, the scent of flowers, the sense that every corner was considered.</p>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head reveal"><p class="eyebrow">Approach</p><h2>How we work.</h2></div>
  <ol class="steps">
    <?php foreach ($PROCESS as $i => [$t, $d]): ?>
    <li class="reveal"><span class="step-n"><?= sprintf('%02d', $i + 1) ?></span><h3><?= e($t) ?></h3><p><?= e($d) ?></p></li>
    <?php endforeach; ?>
  </ol>
</div></section>

<section class="section alt"><div class="container split">
  <div class="reveal"><p class="eyebrow">Team</p><h2>Led by <?= e(BIZ['founder']) ?>.</h2></div>
  <div class="reveal prose">
    <p><?= e(BIZ['founder']) ?> is the founder of Wedora Events and your point of contact throughout planning and execution.</p>
    <p><a class="btn" href="contact.php">Talk to Us</a></p>
  </div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
