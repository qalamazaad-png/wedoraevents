/**
 * Device capability detection. Decides whether to run 3D at all and at which quality tier.
 *   tier 'high' – desktop/laptop with decent GPU  → shadows, more flowers, DPR up to 2
 *   tier 'mid'  – phones/tablets/modest laptops    → no shadows, fewer instances, DPR ≤ 1.5
 *   tier 'low'  – no WebGL / save-data / very weak → skip 3D, show static fallback
 */
export function detectCapabilities() {
  const nav = navigator;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(nav.userAgent);
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (_) { /* webgl stays false */ }

  const mem = nav.deviceMemory || 4;           // GB (not available in Safari/Firefox → assume 4)
  const cores = nav.hardwareConcurrency || 4;
  const saveData = !!(nav.connection && (nav.connection.saveData || /(^|-)2g$/.test(nav.connection.effectiveType || '')));

  let tier = 'high';
  if (!webgl || saveData || mem <= 1 || cores <= 2) tier = 'low';
  else if (coarse || mem <= 4 || cores <= 4 || innerWidth < 820) tier = 'mid';

  return { webgl, tier, coarse, finePointer, reducedMotion, enable3d: tier !== 'low' };
}

/** Pixel ratio cap per tier — never blindly use a phone's 3x DPR. */
export function pixelRatioFor(tier) {
  const cap = tier === 'high' ? 2 : tier === 'mid' ? 1.5 : 1;
  return Math.min(window.devicePixelRatio || 1, cap);
}

/**
 * Watches frame times. After a warm-up, averages a window of frames; if too slow it calls
 * onSlow(level) — level 1 = reduce quality, level 2 = give up and use the fallback.
 */
export class FrameMonitor {
  constructor(onSlow) { this.onSlow = onSlow; this.reset(); this.level = 0; }
  reset() { this.n = 0; this.sum = 0; this.skip = 45; }
  tick(dt) {
    if (this.skip > 0) { this.skip--; return; }
    this.sum += dt; this.n++;
    if (this.n >= 90) {
      const avg = this.sum / this.n;
      this.reset();
      if (avg > 0.045 && this.level < 2) { this.level++; this.onSlow(this.level); }
    }
  }
}
