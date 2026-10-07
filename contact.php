<?php
require_once __DIR__ . '/includes/functions.php';
$meta = [
    'title' => 'Contact & Get a Quote | Wedora Events, Moradabad',
    'description' => 'Request a quotation, consultation or decoration proposal from Wedora Events. Call +91 92586 51664 or WhatsApp us. Kanth, Moradabad, Uttar Pradesh.',
    'path' => 'contact.php',
    'body_class' => 'page',
    'schema' => [['@context' => 'https://schema.org', '@type' => 'ContactPage', 'name' => 'Contact Wedora Events', 'url' => url('contact.php')]],
];
require __DIR__ . '/includes/header.php';
?>
<main id="main">
<header class="page-hero"><div class="container">
  <p class="eyebrow">Contact</p>
  <h1>Tell us about your <em>celebration.</em></h1>
</div></header>
<section class="section" id="enquire"><div class="container split">
  <div class="reveal">
    <p class="lead">Request a quotation, consultation, decoration proposal, venue styling or event planning. We'll get back to you personally.</p>
    <ul class="contact-list">
      <li><b>Call</b><a href="tel:<?= e(BIZ['phone']) ?>"><?= e(BIZ['phone_display']) ?></a></li>
      <li><b>WhatsApp</b><a href="<?= e(wa_link()) ?>" target="_blank" rel="noopener">Chat now</a></li>
      <li><b>Email</b><a href="mailto:<?= e(BIZ['email']) ?>"><?= e(BIZ['email']) ?></a></li>
      <li><b>Studio</b><span><?= e(BIZ['street']) ?>, <?= e(BIZ['locality']) ?> <?= e(BIZ['postal']) ?>, <?= e(BIZ['region']) ?>, India</span></li>
    </ul>
    <a class="map-link link-arrow" href="https://www.google.com/maps/search/?api=1&query=<?= rawurlencode(BIZ['street'] . ', ' . BIZ['locality'] . ' ' . BIZ['postal']) ?>" target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">→</span></a>
  </div>
  <div class="reveal"><?php require __DIR__ . '/includes/lead-form.php'; ?></div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
