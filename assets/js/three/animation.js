/** Easing + a tiny tween/updater manager. All motion runs from a single requestAnimationFrame loop. */
export const ease = {
  linear: (t) => t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  smooth: (t) => t * t * (3 - 2 * t),
};
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Frame-rate independent damping factor. */
export const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

export class AnimationManager {
  constructor() { this.tweens = []; this.updaters = []; }
  /** Run fn(dt, elapsed) every frame. */
  add(fn) { this.updaters.push(fn); return fn; }
  tween({ duration = 0.8, ease: e = ease.inOutCubic, onUpdate, onComplete }) {
    this.tweens.push({ t: 0, duration, e, onUpdate, onComplete });
  }
  update(dt, elapsed) {
    for (const u of this.updaters) u(dt, elapsed);
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      tw.t += dt;
      const k = clamp01(tw.t / tw.duration);
      tw.onUpdate(tw.e(k));
      if (k >= 1) { this.tweens.splice(i, 1); tw.onComplete && tw.onComplete(); }
    }
  }
  dispose() { this.tweens.length = 0; this.updaters.length = 0; }
}
