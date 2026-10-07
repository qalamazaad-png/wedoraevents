<?php require_once __DIR__ . '/functions.php'; ?>
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="brand" href="index.php" aria-label="Wedora Events — home">WEDORA</a>
      <p class="muted">We don't just decorate weddings. We create the environment in which your memories happen.</p>
    </div>
    <nav aria-label="Footer">
      <h2 class="footer-h">Explore</h2>
      <ul>
        <li><a href="services.php">Services</a></li>
        <li><a href="portfolio.php">Portfolio</a></li>
        <li><a href="about.php">About</a></li>
        <li><a href="contact.php">Plan Your Event</a></li>
      </ul>
    </nav>
    <address>
      <h2 class="footer-h">Contact</h2>
      <p><a href="tel:<?= e(BIZ['phone']) ?>"><?= e(BIZ['phone_display']) ?></a><br>
         <a href="mailto:<?= e(BIZ['email']) ?>"><?= e(BIZ['email']) ?></a></p>
      <p class="muted"><?= e(BIZ['street']) ?>,<br><?= e(BIZ['locality']) ?> <?= e(BIZ['postal']) ?>,<br><?= e(BIZ['region']) ?>, India</p>
    </address>
  </div>
  <div class="container footer-base"><span>© <?= date('Y') ?> Wedora Events</span><span>Founder: <?= e(BIZ['founder']) ?></span></div>
</footer>

<a class="wa-float" href="<?= e(wa_link()) ?>" target="_blank" rel="noopener" aria-label="Chat with Wedora on WhatsApp">
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11 19.8L3 29l6.4-2A13 13 0 1 0 16 3Zm0 23.7a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.8 1.2 1.2-3.7-.3-.4A10.7 10.7 0 1 1 16 26.700Zm5.9-8c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.700 8.700 0 0 1-4.300-3.800c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6a1.200 1.200 0 0 0-.9.400 3.700 3.700 0 0 0-1.100 2.700 6.400 6.400 0 0 0 1.400 3.400 14.600 14.600 0 0 0 5.600 5c2 .8 2.800.9 3.800.7a3.200 3.200 0 0 0 2.100-1.500 2.600 2.600 0 0 0 .2-1.500c-.1-.1-.3-.2-.6-.4Z"/></svg>
</a>

<script type="module" src="assets/js/main.js?v=1"></script>
</body>
</html>
