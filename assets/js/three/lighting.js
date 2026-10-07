import * as THREE from 'three';
import { damp } from './animation.js';

/** Lighting moods the "Lighting" button cycles through. Values are lerped for soft transitions. */
export const MOODS = [
  { name: 'Warm Evening', bg: 0x14100e, hemiSky: 0xffe2bd, hemiGround: 0x2a1a12, hemi: 0.55, key: 0xffd7a0, keyI: 1.0,
    spot: 0xffc680, spotI: 420, glow: 0xffcf8a, glowOp: 0.95, backdrop: 0xffc57a, backdropOp: 0.3, exposure: 1.0 },
  { name: 'Golden Hour', bg: 0x2b1b12, hemiSky: 0xffd2a0, hemiGround: 0x3a2314, hemi: 0.95, key: 0xffb066, keyI: 1.7,
    spot: 0xffb070, spotI: 520, glow: 0xffb35c, glowOp: 0.85, backdrop: 0xffa860, backdropOp: 0.48, exposure: 1.1 },
  { name: 'Twilight Blue', bg: 0x0b1020, hemiSky: 0x8fa2d8, hemiGround: 0x181626, hemi: 0.55, key: 0xb8c4ff, keyI: 0.7,
    spot: 0xffd9c8, spotI: 380, glow: 0xfff1e2, glowOp: 0.9, backdrop: 0xe9b9c9, backdropOp: 0.3, exposure: 1.0 },
];

const _c = new THREE.Color();
const lerpColor = (c, hex, k) => c.lerp(_c.set(hex), k);

export function createLighting(scene, { tier, still = false }) {
  const m = MOODS[0];
  scene.background = new THREE.Color(m.bg);
  scene.fog = new THREE.FogExp2(m.bg, 0.018);

  const hemi = new THREE.HemisphereLight(m.hemiSky, m.hemiGround, m.hemi);
  const key = new THREE.DirectionalLight(m.key, m.keyI);
  key.position.set(-6, 12, 10);
  if (tier === 'high') {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -13, right: 13, top: 12, bottom: -12, near: 1, far: 40 });
    key.shadow.bias = -0.0004; key.shadow.radius = 4;
  }
  // warm spot washing the stage
  const spot = new THREE.SpotLight(m.spot, m.spotI, 40, 0.75, 0.7, 2);
  spot.position.set(0, 6.6, -1.5);
  spot.target.position.set(0, 2.2, -7.4);
  scene.add(hemi, key, spot, spot.target);

  // two low point lights for candle-warm pools of light over the tables
  const pools = [new THREE.PointLight(0xffc27a, 14, 14, 2), new THREE.PointLight(0xffc27a, 14, 14, 2)];
  pools[0].position.set(-5, 1.8, 1); pools[1].position.set(5, 1.8, 1);
  scene.add(...pools);

  const bound = { glow: [], backdrop: null, renderer: null };
  let idx = 0;
  // current animated values
  const cur = {
    bg: new THREE.Color(m.bg), hemiSky: new THREE.Color(m.hemiSky), hemiGround: new THREE.Color(m.hemiGround),
    key: new THREE.Color(m.key), spot: new THREE.Color(m.spot), glow: new THREE.Color(m.glow), backdrop: new THREE.Color(m.backdrop),
    hemi: m.hemi, keyI: m.keyI, spotI: m.spotI, glowOp: m.glowOp, backdropOp: m.backdropOp, exposure: m.exposure,
  };

  function apply() {
    scene.background.copy(cur.bg); scene.fog.color.copy(cur.bg);
    hemi.color.copy(cur.hemiSky); hemi.groundColor.copy(cur.hemiGround); hemi.intensity = cur.hemi;
    key.color.copy(cur.key); key.intensity = cur.keyI;
    spot.color.copy(cur.spot);
    pools.forEach((p) => p.color.copy(cur.glow));
    bound.glow.forEach((g) => g.color.copy(cur.glow));
    if (bound.backdrop) bound.backdrop.color.copy(cur.backdrop);
    if (bound.renderer) bound.renderer.toneMappingExposure = cur.exposure;
  }

  return {
    mood: () => idx,
    moodName: () => MOODS[idx].name,
    /** models.js registers its glowing materials so mood changes recolour them. */
    bind(opts) { Object.assign(bound, opts); apply(); },
    setMood(i, instant = false) {
      idx = ((i % MOODS.length) + MOODS.length) % MOODS.length;
      if (instant || still) {
        const t = MOODS[idx];
        cur.bg.set(t.bg); cur.hemiSky.set(t.hemiSky); cur.hemiGround.set(t.hemiGround); cur.key.set(t.key);
        cur.spot.set(t.spot); cur.glow.set(t.glow); cur.backdrop.set(t.backdrop);
        Object.assign(cur, { hemi: t.hemi, keyI: t.keyI, spotI: t.spotI, glowOp: t.glowOp, backdropOp: t.backdropOp, exposure: t.exposure });
        apply();
      }
    },
    /** Called every frame: eases toward the target mood + gentle candle-like flicker. */
    update(dt, t) {
      const tg = MOODS[idx], k = damp(2.2, dt);
      lerpColor(cur.bg, tg.bg, k); lerpColor(cur.hemiSky, tg.hemiSky, k); lerpColor(cur.hemiGround, tg.hemiGround, k);
      lerpColor(cur.key, tg.key, k); lerpColor(cur.spot, tg.spot, k); lerpColor(cur.glow, tg.glow, k); lerpColor(cur.backdrop, tg.backdrop, k);
      for (const f of ['hemi', 'keyI', 'spotI', 'glowOp', 'backdropOp', 'exposure']) cur[f] += (tg[f] - cur[f]) * k;
      apply();
      const flicker = 1 + Math.sin(t * 1.3) * 0.035 + Math.sin(t * 3.1 + 1) * 0.02; // subtle light intensity change
      spot.intensity = cur.spotI * flicker;
      pools.forEach((p, i) => (p.intensity = 14 * (1 + Math.sin(t * 2.1 + i * 2) * 0.05)));
      bound.glow.forEach((g) => (g.opacity = cur.glowOp * (0.92 + Math.sin(t * 1.7) * 0.08)));
      if (bound.backdrop) bound.backdrop.opacity = cur.backdropOp * flicker;
    },
  };
}
