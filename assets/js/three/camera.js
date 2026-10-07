import * as THREE from 'three';
import { clamp01, ease, damp, lerp } from './animation.js';

/**
 * A limited set of meaningful camera states (not one per scroll pixel).
 * Positions are in metres; the stage sits around z = -7, the audience area around z = 0…6.
 */
export const cameraStates = {
  hero:   { pos: [0, 4.3, 12.5],  look: [0, 2.3, -4.5], fov: 46 },   // wide, slightly elevated
  venue:  { pos: [-3.6, 2.7, 6.4], look: [0, 2.2, -5.5], fov: 44 },  // moving into the room
  stage:  { pos: [0.6, 2.3, -0.4], look: [0, 2.5, -7.2], fov: 42 },  // toward the stage
  detail: { pos: [0.8, 3.3, -2.4], look: [-0.9, 4.1, -7.4], fov: 40 }, // close on the florals
  // Configurator (second scene) states
  show:   { pos: [0, 3.6, 10.2],  look: [0, 2.1, -4.0], fov: 46 },
  focusFlowers: { pos: [1.2, 2.6, -1.0], look: [0, 2.7, -7.3], fov: 40 },
  focusStage:   { pos: [-2.2, 3.0, 2.2], look: [0, 2.2, -6.5], fov: 42 },
  focusTables:  { pos: [0, 5.2, 7.5],   look: [0, 0.6, 1.0],  fov: 46 },
  focusLight:   { pos: [0, 3.8, 11.5],  look: [0, 3.2, -3.0], fov: 48 },
};

const V = (a) => new THREE.Vector3(...a);

export class CameraRig {
  /**
   * @param camera       THREE.PerspectiveCamera
   * @param opts.sequence state names the scroll progress travels through (hero rig)
   * @param opts.base     single base state (configurator rig)
   * @param opts.maxYaw   max pointer-driven rotation about the look target, degrees (kept at ~2–4°)
   * @param opts.drift    amplitude of the slow cinematic drift (0 disables)
   * @param opts.still    reduced-motion: no drift / no smoothing
   */
  constructor(camera, { sequence = null, base = 'show', maxYaw = 3, maxPitch = 1.5, drift = 1, still = false } = {}) {
    this.camera = camera;
    this.sequence = sequence;
    this.baseName = base;
    this.maxYaw = THREE.MathUtils.degToRad(maxYaw);
    this.maxPitch = THREE.MathUtils.degToRad(maxPitch);
    this.drift = still ? 0 : drift;
    this.still = still;
    this.p = 0; this.targetP = 0;
    this.px = 0; this.py = 0; this.tpx = 0; this.tpy = 0;
    this.focusName = null; this.focusW = 0; this.focusTarget = 0; this.focusHold = 0;
    this._pos = new THREE.Vector3(); this._look = new THREE.Vector3(); this._off = new THREE.Vector3();
  }

  setProgress(p) { this.targetP = clamp01(p); if (this.still) this.p = this.targetP; }
  /** x,y in -1..1 (pointer position or drag offset). */
  setPointer(x, y) { this.tpx = x; this.tpy = y; }

  /** Briefly glide to a named state, hold, and return (used by configurator buttons). */
  focus(name, hold = 1.6) {
    this.focusName = name; this.focusTarget = this.still ? 0 : 1; this.focusHold = hold;
  }

  /** Where the camera would be for scroll progress p along the sequence. */
  _sample(p, outPos, outLook) {
    const seq = this.sequence, segs = seq.length - 1;
    const f = Math.min(p * segs, segs - 1e-6), i = Math.floor(f);
    const k = ease.inOutCubic(f - i);
    const a = cameraStates[seq[i]], b = cameraStates[seq[i + 1]];
    outPos.lerpVectors(V(a.pos), V(b.pos), k);
    outLook.lerpVectors(V(a.look), V(b.look), k);
    return lerp(a.fov, b.fov, k);
  }

  update(dt, t) {
    const cam = this.camera;
    let fov;
    if (this.sequence) {
      this.p += (this.targetP - this.p) * (this.still ? 1 : damp(3.2, dt)); // smooth scroll follow
      fov = this._sample(this.p, this._pos, this._look);
    } else {
      const s = cameraStates[this.baseName];
      this._pos.set(...s.pos); this._look.set(...s.look); fov = s.fov;
    }

    // focus blend (configurator)
    if (this.focusName) {
      if (this.focusTarget === 1 && this.focusW > 0.995) {
        this.focusHold -= dt; if (this.focusHold <= 0) this.focusTarget = 0;
      }
      this.focusW += (this.focusTarget - this.focusW) * damp(2.4, dt);
      if (this.focusTarget === 0 && this.focusW < 0.002) { this.focusW = 0; this.focusName = null; }
      if (this.focusName) {
        const f = cameraStates[this.focusName], w = ease.smooth(this.focusW);
        this._pos.lerp(V(f.pos), w); this._look.lerp(V(f.look), w); fov = lerp(fov, f.fov, w);
      }
    }

    // very slow cinematic drift
    if (this.drift) {
      this._pos.x += Math.sin(t * 0.11) * 0.28 * this.drift;
      this._pos.y += Math.sin(t * 0.083 + 1.3) * 0.12 * this.drift;
      this._look.x += Math.sin(t * 0.07 + 0.6) * 0.18 * this.drift;
    }

    // pointer / touch parallax = small rotation around the look target (never more than maxYaw)
    this.px += (this.tpx - this.px) * damp(2.6, dt);
    this.py += (this.tpy - this.py) * damp(2.6, dt);
    if (Math.abs(this.px) + Math.abs(this.py) > 1e-4) {
      this._off.copy(this._pos).sub(this._look);
      this._off.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -this.px * this.maxYaw);
      const right = new THREE.Vector3().crossVectors(this._off, THREE.Object3D.DEFAULT_UP).normalize();
      this._off.applyAxisAngle(right, this.py * this.maxPitch);
      this._pos.copy(this._look).add(this._off);
    }

    cam.position.copy(this._pos);
    cam.lookAt(this._look);
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
  }
}
