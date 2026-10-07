/* Wedora Events — site behaviour. 3D code is dynamically imported so the page never depends on it. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Navigation ---------- */
function initNav() {
  const header = $('#siteHeader'), toggle = $('#navToggle');
  if (!header || !toggle) return;
  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
  $$('#primaryNav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
}

/* ---------- Scroll reveals ---------- */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduced) { items.forEach((i) => i.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((i) => io.observe(i));
}

/* ---------- Portfolio: filters + lightbox ---------- */
function initPortfolio() {
  const grid = $('#portfolioGrid');
  $$('.filters button').forEach((b) => b.addEventListener('click', () => {
    $$('.filters button').forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const f = b.dataset.filter;
    $$('.p-item', grid).forEach((it) => (it.hidden = f !== 'all' && it.dataset.category !== f));
  }));

  const links = () => $$('[data-lightbox]').filter((a) => !a.hidden);
  let lb, idx = 0, opener = null;
  const build = () => {
    lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Project gallery');
    lb.innerHTML = '<button class="lb-close" aria-label="Close gallery">×</button><button class="lb-prev" aria-label="Previous image">‹</button><figure style="margin:0;display:contents"><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Next image">›</button>';
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    $('.lb-close', lb).onclick = close; $('.lb-prev', lb).onclick = () => show(idx - 1); $('.lb-next', lb).onclick = () => show(idx + 1);
  };
  const show = (i) => {
    const l = links(); idx = (i + l.length) % l.length;
    const img = $('img', lb), src = l[idx].querySelector('img');
    img.src = l[idx].getAttribute('href'); img.alt = src ? src.alt : '';
    $('figcaption', lb).textContent = l[idx].dataset.caption || '';
  };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; opener && opener.focus(); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lightbox]'); if (!a) return;
    e.preventDefault(); opener = a; if (!lb) build();
    show(links().indexOf(a)); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus();
  });
  addEventListener('keydown', (e) => {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(idx + 1); else if (e.key === 'ArrowLeft') show(idx - 1);
  });
}

/* ---------- Before / After slider ---------- */
function initBeforeAfter() {
  const ba = $('#beforeAfter'); if (!ba) return;
  const range = $('.ba-range', ba);
  const set = () => ba.style.setProperty('--pos', range.value + '%');
  range.addEventListener('input', set); set();
}

/* ---------- Lead form ---------- */
function initForm() {
  const form = $('#leadForm'); if (!form) return;
  const status = $('#formStatus'), btn = $('button[type=submit]', form);
  const say = (msg, err) => { status.textContent = msg; status.classList.toggle('err', !!err); status.focus(); };

  // Pre-select event type when arriving from a service page (?service=mehndi-decoration)
  const svc = new URLSearchParams(location.search).get('service');
  const map = { 'wedding-decoration': 'Wedding', 'stage-decoration': 'Stage / Mandap Decoration', 'mandap-decoration': 'Stage / Mandap Decoration', 'reception-decoration': 'Reception', 'engagement-decoration': 'Engagement', 'mehndi-decoration': 'Mehndi', 'haldi-decoration': 'Haldi', 'floral-design': 'Floral Design', 'venue-styling': 'Venue Styling', 'corporate-events': 'Corporate Event' };
  if (svc && map[svc]) form.elements.event_type.value = map[svc];
  const date = form.elements.event_date; if (date) date.min = new Date().toISOString().slice(0, 10);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = form.elements, problems = [];
    [...form.elements].forEach((el) => el.classList && el.classList.remove('invalid'));
    const bad = (el, m) => { el.classList.add('invalid'); problems.push(m); };
    if (f.name.value.trim().length < 2) bad(f.name, 'Please enter your name.');
    if (!/^\+?[0-9][0-9\s-]{8,16}$/.test(f.phone.value.trim())) bad(f.phone, 'Please enter a valid phone number.');
    if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) bad(f.email, 'Please enter a valid email address.');
    if (!f.event_type.value) bad(f.event_type, 'Please choose an event type.');
    if (problems.length) { say(problems.join(' '), true); $('.invalid', form).focus(); return; }

    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json();
      say(data.message, !data.ok);
      if (data.ok) form.reset();
    } catch (_) { say('Network problem. Please call or WhatsApp us instead.', true); }
    btn.disabled = false; btn.textContent = 'Request a Quote';
  });
}

/* ---------- 3D (hero + configurator) ---------- */
let threeModules = null;
async function loadThree() {
  if (!threeModules) {
    const [perf, sceneM, camM, lightM, modelsM, interM] = await Promise.all([
      import('./three/performance.js'), import('./three/scene.js'), import('./three/camera.js'),
      import('./three/lighting.js'), import('./three/models.js'), import('./three/interaction.js'),
    ]);
    threeModules = { perf, sceneM, camM, lightM, modelsM, interM };
  }
  return threeModules;
}

async function initHero(caps) {
  const hero = $('#hero'), loader = $('#loader'), bar = $('#loaderBar');
  const finish = () => { if (!loader) return; loader.classList.add('done'); setTimeout(() => loader.remove(), 1000); };
  if (!hero) return;
  const progress = (v) => bar && (bar.style.transform = `scaleX(${v})`);
  const useFallback = () => { hero.classList.remove('is-3d'); finish(); };

  if (!caps.enable3d) return useFallback();
  const t0 = performance.now(), guard = setTimeout(useFallback, 9000);   // never leave visitors waiting
  try {
    progress(0.15);
    const m = await loadThree(); progress(0.55);
    const { createStage } = m.sceneM, { CameraRig } = m.camM;
    const canvas = $('#heroCanvas');
    let stage;
    stage = createStage(canvas, {
      tier: caps.tier, still: caps.reducedMotion,
      onFail: (err) => { console.warn('[wedora] 3D unavailable, showing fallback:', err.message); stage && stage.dispose(); useFallback(); },
      onDegrade: () => {},
    });
    if (!stage) return;
    const lighting = m.lightM.createLighting(stage.scene, { tier: caps.tier, still: caps.reducedMotion });
    const venue = m.modelsM.buildVenue(stage.scene, lighting, { tier: caps.tier, still: caps.reducedMotion });
    lighting.renderer = stage.renderer; lighting.bind({ renderer: stage.renderer });
    progress(0.85);

    const rig = new m.camM.CameraRig(stage.camera, {
      sequence: ['hero', 'venue', 'stage', 'detail'], maxYaw: 3, drift: caps.coarse ? 1.3 : 1, still: caps.reducedMotion,
    });
    stage.onFrame((dt, t) => { rig.update(dt, t); lighting.update(dt, t); venue.update(dt, t); });
    if (caps.reducedMotion) { /* single static wide shot: no scroll journey */ }
    else {
      hero.classList.add('is-3d');   // tall scroll-journey layout
      m.interM.bindHeroScroll(hero, rig, { copy: $('.hero-copy', hero), cue: $('.scroll-cue', hero), captions: $$('.journey-captions li', hero) });
    }
    m.interM.bindPointer(canvas, rig, { fine: caps.finePointer && !caps.reducedMotion, touch: !caps.reducedMotion });
    m.modelsM.loadOptionalModels(null, venue, { tier: caps.tier }).catch(() => {});   // authored GLBs, if provided
    hero.classList.add('is-3d');
    stage.resize(); caps.reducedMotion ? stage.renderOnce() : stage.start();
    progress(1);
    clearTimeout(guard);
    setTimeout(finish, Math.max(0, 700 - (performance.now() - t0)));
  } catch (err) {
    console.warn('[wedora] 3D failed, using fallback:', err);
    clearTimeout(guard); useFallback();
  }
}

function initVenue(caps) {
  const wrap = $('#venueStage'); if (!wrap) return;
  const fail = () => wrap.classList.add('no-3d');
  if (!caps.enable3d) return fail();
  let started = false;
  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || started) return;
    started = true; io.disconnect();
    try {
      const m = await loadThree();
      let stage;
      stage = m.sceneM.createStage($('#venueCanvas'), {
        tier: caps.tier, still: caps.reducedMotion, fov: 46,
        onFail: (err) => { console.warn('[wedora] venue 3D unavailable:', err.message); stage && stage.dispose(); fail(); },
      });
      if (!stage) return fail();
      const lighting = m.lightM.createLighting(stage.scene, { tier: caps.tier, still: caps.reducedMotion });
      const venue = m.modelsM.buildVenue(stage.scene, lighting, { tier: caps.tier, still: caps.reducedMotion });
      lighting.bind({ renderer: stage.renderer });
      const rig = new m.camM.CameraRig(stage.camera, { base: 'show', maxYaw: 5, drift: 0.8, still: caps.reducedMotion });
      stage.onFrame((dt, t) => { rig.update(dt, t); lighting.update(dt, t); venue.update(dt, t); });
      m.interM.bindPointer($('#venueCanvas'), rig, { fine: caps.finePointer && !caps.reducedMotion });
      m.interM.bindConfigurator(wrap, {
        venue, lighting, rig, stage,
        names: { flowers: venue.options.flowers, lighting: m.lightM.MOODS.map((x) => x.name), stage: venue.options.stage, tables: venue.options.tables },
      });
      stage.resize(); caps.reducedMotion ? stage.renderOnce() : stage.start();
    } catch (err) { console.warn('[wedora] venue 3D failed:', err); fail(); }
  }, { rootMargin: '300px' });
  io.observe(wrap);
}

/* ---------- Boot ---------- */
async function boot() {
  initNav(); initReveal(); initPortfolio(); initBeforeAfter(); initForm();
  if (!$('#hero')) return;
  let caps;
  try { caps = await (await import('./three/performance.js')).detectCapabilities(); }
  catch (_) { $('#loader') && $('#loader').remove(); return; }
  initHero(caps); initVenue(caps);
}
boot();
