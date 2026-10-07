import { clamp01, ease } from './animation.js';

/**
 * Pointer parallax. Mouse: tiny camera rotation following the cursor (CameraRig caps it at a few degrees).
 * Touch: limited horizontal drag; vertical gestures are left to the browser so page scrolling is never blocked
 * (the canvas uses touch-action: pan-y).
 */
export function bindPointer(el, rig, { fine, touch = true }) {
  let dragging = false, startX = 0;
  const norm = (e) => { const r = el.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1]; };

  if (fine) {
    const move = (e) => { const [x, y] = norm(e); rig.setPointer(x, y); };
    el.addEventListener('pointermove', (e) => e.pointerType === 'mouse' && move(e), { passive: true });
    el.addEventListener('pointerleave', () => rig.setPointer(0, 0), { passive: true });
  }
  if (touch) {
    el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; dragging = true; startX = e.clientX; });
    el.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerType === 'mouse') return;
      rig.setPointer(Math.max(-1, Math.min(1, (e.clientX - startX) / (el.clientWidth * 0.5))), 0);
    }, { passive: true });
    const end = () => { dragging = false; rig.setPointer(0, 0); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
}

/**
 * Scroll → camera. The hero is a tall section with a sticky viewport; scroll progress through it drives the
 * camera between hero → venue → stage → detail, fades the copy, and switches captions.
 */
export function bindHeroScroll(section, rig, { copy, cue, captions }) {
  let ticking = false, lastStep = -1;
  const update = () => {
    ticking = false;
    const span = section.offsetHeight - innerHeight;
    const p = span > 0 ? clamp01(-section.getBoundingClientRect().top / span) : 0;
    rig.setProgress(p);
    const fade = 1 - ease.smooth(clamp01(p / 0.12));
    if (copy) { copy.style.opacity = fade; copy.style.pointerEvents = fade < 0.2 ? 'none' : ''; copy.style.transform = `translate(-50%, ${(1 - fade) * -24}px)`; }
    if (cue) cue.style.opacity = fade;
    const step = p < 0.2 ? 0 : p < 0.5 ? 1 : p < 0.82 ? 2 : 3;
    if (step !== lastStep) { lastStep = step; captions.forEach((li) => li.classList.toggle('on', +li.dataset.step === step)); }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  update();
  return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
}

/** "Imagine Your Celebration" buttons: Flowers · Lighting · Stage · Tables. Each click cycles to the next variant. */
export function bindConfigurator(root, { venue, lighting, rig, stage, names }) {
  const state = { flowers: 0, lighting: 0, stage: 0, tables: 0 };
  const actions = {
    flowers: () => { venue.setFlowers(state.flowers); rig.focus('focusFlowers'); },
    lighting: () => { lighting.setMood(state.lighting); rig.focus('focusLight', 1.2); },
    stage: () => { venue.setStage(state.stage); rig.focus('focusStage'); },
    tables: () => { venue.setTables(state.tables); rig.focus('focusTables'); },
  };
  root.querySelectorAll('[data-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.option;
      state[k] = (state[k] + 1) % names[k].length;
      actions[k]();
      const label = btn.querySelector('[data-value]');
      label.textContent = names[k][state[k]];
      btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
      root.querySelectorAll('[data-option]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      stage.renderOnce();                                  // keeps reduced-motion (static) mode in sync
    });
  });
}
