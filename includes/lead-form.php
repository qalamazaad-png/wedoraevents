<?php
/** Enquiry form. Works without JS (posts to api/lead.php, redirects back); enhanced by main.js. */
require_once __DIR__ . '/functions.php';
$_SESSION['form_t'] = time();
$sent = ($_GET['sent'] ?? '') === '1';
$err  = $_GET['error'] ?? '';
?>
<form class="lead-form" id="leadForm" action="api/lead.php" method="post" novalidate>
  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
  <input type="hidden" name="return" value="<?= e(basename($_SERVER['SCRIPT_NAME'] ?? 'contact.php')) ?>">
  <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>

  <div class="form-status" id="formStatus" role="status" aria-live="polite" tabindex="-1">
    <?php if ($sent): ?>Thank you — we've received your enquiry and will call you shortly.<?php elseif ($err): ?><?= e($err) ?><?php endif; ?>
  </div>

  <div class="field-row">
    <div class="field"><label for="f-name">Name *</label><input id="f-name" name="name" type="text" required maxlength="120" autocomplete="name"></div>
    <div class="field"><label for="f-phone">Phone *</label><input id="f-phone" name="phone" type="tel" required maxlength="20" autocomplete="tel" inputmode="tel" placeholder="+91"></div>
  </div>
  <div class="field-row">
    <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" maxlength="160" autocomplete="email"></div>
    <div class="field"><label for="f-type">Event type *</label>
      <select id="f-type" name="event_type" required>
        <option value="">Select…</option>
        <?php foreach (EVENT_TYPES as $t): ?><option><?= e($t) ?></option><?php endforeach; ?>
      </select></div>
  </div>
  <div class="field-row">
    <div class="field"><label for="f-date">Event date</label><input id="f-date" name="event_date" type="date"></div>
    <div class="field"><label for="f-venue">Venue</label><input id="f-venue" name="venue" type="text" maxlength="160" placeholder="Venue or city"></div>
  </div>
  <div class="field-row">
    <div class="field"><label for="f-guests">Guest count</label>
      <select id="f-guests" name="guests"><option value="">Select…</option><?php foreach (GUEST_COUNTS as $g): ?><option><?= e($g) ?></option><?php endforeach; ?></select></div>
    <div class="field"><label for="f-budget">Budget range</label>
      <select id="f-budget" name="budget"><option value="">Select…</option><?php foreach (BUDGETS as $b): ?><option><?= e($b) ?></option><?php endforeach; ?></select></div>
  </div>
  <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="4" maxlength="2000" placeholder="Tell us about your celebration"></textarea></div>
  <button class="btn" type="submit">Request a Quote</button>
  <p class="muted small">We reply by phone or WhatsApp, usually within a day. Your details are used only to respond to your enquiry.</p>
</form>
