<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/content.php';
$meta = [
    'title' => 'Wedora Events | Wedding & Event Decoration in Moradabad',
    'description' => 'Wedora designs wedding, stage, mandap, reception, engagement, mehndi, haldi and corporate event décor in Moradabad, Uttar Pradesh. Plan your event with us.',
    'path' => 'index.php',
    'body_class' => 'home',
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => SITE_NAME, 'url' => url(),
    ]],
];
require __DIR__ . '/includes/header.php';
?>

<div class="loader" id="loader" aria-hidden="true">
  <div class="loader-inner">
    <div class="loader-brand">WEDORA</div>
    <p>Creating your experience…</p>
    <div class="loader-bar"><span id="loaderBar"></span></div>
  </div>
</div>

<main id="main">

<!-- HERO: cinematic 3D venue. Real <h1> and links stay in the HTML for SEO / no-JS / no-WebGL visitors. -->
<section class="hero-journey" id="hero" aria-label="Wedora Events introduction">
  <div class="hero-sticky">
    <img class="hero-fallback" src="assets/img/hero-fallback.svg" alt="Floral wedding arch softly lit with warm lights" width="1920" height="1080" fetchpriority="high">
    <canvas class="hero-canvas" id="heroCanvas" aria-hidden="true"></canvas>
    <div class="hero-shade" aria-hidden="true"></div>

    <div class="container hero-copy">
      <p class="eyebrow">Wedding &amp; Event Decoration · Moradabad</p>
      <h1>Your Wedding.<br><em>Designed Around You.</em></h1>
      <p class="lead">From intimate ceremonies to unforgettable celebrations, we design spaces that feel uniquely yours.</p>
      <div class="btn-row">
        <a class="btn" href="portfolio.php">Explore Our Work</a>
        <a class="btn btn-ghost" href="contact.php">Plan Your Event</a>
      </div>
    </div>

    <ol class="journey-captions" aria-hidden="true">
      <li data-step="1"><span>01</span>The venue</li>
      <li data-step="2"><span>02</span>The stage</li>
      <li data-step="3"><span>03</span>The details</li>
    </ol>
    <div class="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><i></i></div>
  </div>
</section>

<!-- INTRODUCTION -->
<section class="section intro" id="about">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">About Wedora</p>
      <h2>Where Every Detail <em>Becomes a Memory.</em></h2>
      <p>Wedora Events is a decoration studio based in Kanth, Moradabad, led by founder <?= e(BIZ['founder']) ?>. We design and build the settings for weddings and celebrations — flowers, stages, mandaps, lighting and seating — so the space feels like it belongs to you.</p>
      <a class="link-arrow" href="about.php">Our story <span aria-hidden="true">→</span></a>
    </div>
    <figure class="intro-photo reveal">
      <img src="assets/img/portfolio/p1.svg" alt="Wedding stage framed with flowers and warm lights" loading="lazy" width="1200" height="1500">
    </figure>
  </div>
</section>

<!-- SERVICES: editorial list -->
<section class="section services" id="services">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Services</p>
      <h2>Everything your celebration needs, <em>designed as one.</em></h2>
    </div>
    <ul class="service-list">
      <?php foreach ($SERVICES as $i => $s): ?>
      <li class="service-item reveal">
        <a href="services.php#<?= e($s['slug']) ?>">
          <span class="s-num"><?= sprintf('%02d', $i + 1) ?></span>
          <span class="s-body"><h3><?= e($s['title']) ?></h3><p><?= e($s['text']) ?></p></span>
          <span class="s-img"><img src="<?= e($s['img']) ?>" alt="<?= e($s['title']) ?> by Wedora" loading="lazy" width="320" height="400"></span>
          <span class="s-arrow" aria-hidden="true">→</span>
        </a>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<!-- INTERACTIVE 3D VENUE -->
<section class="section experience" id="experience" aria-labelledby="imagine-h">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Experiences</p>
      <h2 id="imagine-h">Imagine Your <em>Celebration.</em></h2>
      <p class="muted">Try different flowers, lighting, stage and table layouts in a live 3D venue. A preview of how we shape a space with you.</p>
    </div>
    <div class="venue-stage reveal" id="venueStage">
      <canvas id="venueCanvas" aria-label="Interactive 3D wedding venue preview" role="img"></canvas>
      <img class="venue-fallback" src="assets/img/portfolio/p6.svg" alt="Wedding venue with floral arch and lights" loading="lazy" width="1200" height="1500">
      <div class="venue-controls" role="group" aria-label="Customise the venue">
        <button type="button" data-option="flowers" aria-pressed="false"><b>Flowers</b><span data-value>Ivory &amp; Blush</span></button>
        <button type="button" data-option="lighting" aria-pressed="false"><b>Lighting</b><span data-value>Warm Evening</span></button>
        <button type="button" data-option="stage" aria-pressed="false"><b>Stage</b><span data-value>Floral Arch</span></button>
        <button type="button" data-option="tables" aria-pressed="false"><b>Tables</b><span data-value>Round Tables</span></button>
      </div>
    </div>
    <p class="center reveal"><a class="btn" href="contact.php">Plan This With Us</a></p>
  </div>
</section>

<!-- PORTFOLIO -->
<section class="section portfolio" id="portfolio">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Portfolio</p>
      <h2>Spaces we've <em>brought to life.</em></h2>
    </div>
    <div class="grid-portfolio">
      <?php foreach (array_slice($PORTFOLIO, 0, 6) as $p): ?>
      <a class="p-item reveal" href="<?= e($p['img']) ?>" data-lightbox data-caption="<?= e($p['title'] . ' — ' . $p['category']) ?>">
        <img src="<?= e($p['img']) ?>" alt="<?= e($p['title']) ?>, <?= e($p['category']) ?> décor by Wedora" loading="lazy" width="600" height="750">
        <span class="p-meta"><b><?= e($p['title']) ?></b><em><?= e($p['category']) ?></em></span>
      </a>
      <?php endforeach; ?>
    </div>
    <p class="center reveal"><a class="link-arrow" href="portfolio.php">View Our Work <span aria-hidden="true">→</span></a></p>
  </div>
</section>

<!-- BEFORE / AFTER -->
<section class="section before-after" id="transformation">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Transformation</p>
      <h2>From an empty hall to <em>your celebration.</em></h2>
    </div>
    <div class="ba reveal" id="beforeAfter" style="--pos:50%">
      <img class="ba-img" src="<?= e($BEFORE_AFTER['after']) ?>" alt="Venue after Wedora decoration" loading="lazy" width="1600" height="1000">
      <div class="ba-before"><img class="ba-img" src="<?= e($BEFORE_AFTER['before']) ?>" alt="Venue before decoration" loading="lazy" width="1600" height="1000"></div>
      <span class="ba-tag ba-tag-l">Venue</span><span class="ba-tag ba-tag-r">Wedora Design</span>
      <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare the venue before and after decoration">
      <span class="ba-handle" aria-hidden="true"></span>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section process" id="process">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Our Process</p>
      <h2>Four steps, <em>one calm journey.</em></h2>
    </div>
    <ol class="steps">
      <?php foreach ($PROCESS as $i => [$t, $d]): ?>
      <li class="reveal"><span class="step-n"><?= sprintf('%02d', $i + 1) ?></span><h3><?= e($t) ?></h3><p><?= e($d) ?></p></li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<!-- WHY WEDORA -->
<section class="section why" id="why">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Why Wedora</p>
      <h2>Considered design, <em>carefully delivered.</em></h2>
    </div>
    <ul class="why-list">
      <?php foreach ($WHY as [$t, $d]): ?>
      <li class="reveal"><h3><?= e($t) ?></h3><p><?= e($d) ?></p></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<?php if ($TESTIMONIALS): ?>
<section class="section testimonials" id="testimonials">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Kind Words</p><h2>Celebrations <em>remembered.</em></h2></div>
    <div class="quotes">
      <?php foreach ($TESTIMONIALS as $t): ?>
      <figure class="reveal">
        <blockquote><p>“<?= e($t['quote']) ?>”</p></blockquote>
        <figcaption><?php if (!empty($t['photo'])): ?><img src="<?= e($t['photo']) ?>" alt="<?= e($t['name']) ?>" loading="lazy" width="48" height="48"><?php endif; ?>
          <b><?= e($t['name']) ?></b> <span><?= e($t['event']) ?></span></figcaption>
      </figure>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- FINAL CTA -->
<section class="section final-cta">
  <div class="container center reveal">
    <h2>Let's Create <em>Something Beautiful.</em></h2>
    <p class="lead">Tell us about your celebration and we'll help turn your vision into a space worth remembering.</p>
    <div class="btn-row center-row">
      <a class="btn" href="contact.php">Plan My Event</a>
      <a class="btn btn-ghost" href="<?= e(wa_link()) ?>" target="_blank" rel="noopener">WhatsApp Us</a>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="section contact-home" id="enquire">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Contact</p>
      <h2>Request a quote or <em>consultation.</em></h2>
      <ul class="contact-list">
        <li><b>Call</b><a href="tel:<?= e(BIZ['phone']) ?>"><?= e(BIZ['phone_display']) ?></a></li>
        <li><b>Email</b><a href="mailto:<?= e(BIZ['email']) ?>"><?= e(BIZ['email']) ?></a></li>
        <li><b>Studio</b><span><?= e(BIZ['street']) ?>, <?= e(BIZ['locality']) ?> <?= e(BIZ['postal']) ?>, <?= e(BIZ['region']) ?></span></li>
      </ul>
    </div>
    <div class="reveal"><?php require __DIR__ . '/includes/lead-form.php'; ?></div>
  </div>
</section>

</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
