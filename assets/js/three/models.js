import * as THREE from 'three';
import { ease } from './animation.js';

/**
 * Procedural wedding venue. Nothing here needs a model file — it is built from instanced primitives so
 * it stays tiny and fast. To use authored models instead, see assets/3d/README.md and loadOptionalModels().
 *
 * Variants (driven by the "Imagine Your Celebration" buttons):
 *   flowers → 3 palettes · stage → arch / ring / mandap · tables → round / banquet / lounge
 */
export const PALETTES = [
  { name: 'Ivory & Blush', colors: [0xf8f1e8, 0xf0d9d3, 0xe8c4bf, 0xfffaf2], green: 0x6f7d5f },
  { name: 'Champagne & Gold', colors: [0xe9d8b8, 0xd8c3a5, 0xc9a45c, 0xf6ecd8], green: 0x7b7a55 },
  { name: 'Rose & Burgundy', colors: [0xc8a9a6, 0xb5646b, 0x8e3b46, 0xf0d9d3], green: 0x5e6b52 },
];
export const STAGES = ['Floral Arch', 'Floral Ring', 'Golden Mandap'];
export const TABLES = ['Round Tables', 'Long Banquet', 'Lounge Seating'];

const STAGE_Z = -7.4;      // z of the stage centre
const STAGE_Y = 0.45;      // top of the platform

// Small deterministic RNG so the layout is identical on every load.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft round sprite used for light glows and petals. */
function glowTexture(inner = 'rgba(255,255,255,1)', mid = 'rgba(255,255,255,.35)') {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, inner); r.addColorStop(0.35, mid); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function backdropTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 160;
  const g = c.getContext('2d'), r = g.createRadialGradient(128, 86, 6, 128, 86, 130);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.5, 'rgba(255,255,255,.4)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 160);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Pleated drape: a plane whose vertices are displaced with a sine so it catches the light. */
function drape(w, h, folds, amp, mat) {
  const geo = new THREE.PlaneGeometry(w, h, Math.round(folds * 6), 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / w) * Math.PI * 2 * folds) * amp);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat);
}

export function buildVenue(scene, lighting, { tier, still = false }) {
  const high = tier === 'high';
  const N = {                                   // counts scaled by device tier
    flowers: high ? 900 : 480, hanging: high ? 26 : 12, petals: high ? 140 : 45,
    strings: high ? 5 : 3, stringPts: high ? 46 : 24,
  };
  const rand = rng(42);
  const root = new THREE.Group(); scene.add(root);
  const disposables = [];
  const track = (o) => (disposables.push(o), o);

  // ---------- shared materials ----------
  const M = {
    floor: track(new THREE.MeshStandardMaterial({ color: 0x2a211c, roughness: 0.55, metalness: 0.08 })),
    drape: track(new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.95, side: THREE.DoubleSide, emissive: 0x1d1611 })),
    platform: track(new THREE.MeshStandardMaterial({ color: 0x3b2f27, roughness: 0.7 })),
    carpet: track(new THREE.MeshStandardMaterial({ color: 0xece3d4, roughness: 0.95 })),
    gold: track(new THREE.MeshStandardMaterial({ color: 0xc9a45c, roughness: 0.38, metalness: 0.55, emissive: 0x2a1d08 })),
    cloth: track(new THREE.MeshStandardMaterial({ color: 0xf4eee4, roughness: 0.9 })),
    chair: track(new THREE.MeshStandardMaterial({ color: 0xd9c08a, roughness: 0.45, metalness: 0.35, emissive: 0x201808 })),
    sofa: track(new THREE.MeshStandardMaterial({ color: 0xd8c3a5, roughness: 0.9 })),
    candle: track(new THREE.MeshStandardMaterial({ color: 0xfff4dc, roughness: 0.6, emissive: 0x3a2c14 })),
    flower: track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, emissive: 0x3a2a22 })),
    hang: track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, emissive: 0x6a5648 })),
    strand: track(new THREE.LineBasicMaterial({ color: 0xbfae8c, transparent: true, opacity: 0.55 })),
  };
  const glowTex = track(glowTexture());
  const glowMat = (size) => track(new THREE.PointsMaterial({
    map: glowTex, size, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffcf8a,
  }));
  const stringMat = glowMat(0.5), candleMat = glowMat(0.42);
  const backdropMat = track(new THREE.MeshBasicMaterial({
    map: track(backdropTexture()), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc57a,
  }));
  lighting.bind({ glow: [stringMat, candleMat], backdrop: backdropMat });

  // ---------- hall shell ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M.floor);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = high; root.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: 0x1a1412, roughness: 1 }));
  ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 7.6; root.add(ceiling);

  const back = drape(30, 8, 9, 0.22, M.drape); back.position.set(0, 4, -9.6); root.add(back);
  for (const s of [-1, 1]) {
    const side = drape(26, 8, 8, 0.2, M.drape); side.rotation.y = (-s * Math.PI) / 2; side.position.set(s * 13, 4, -2); root.add(side);
  }
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(15, 8.5), backdropMat);
  backdrop.position.set(0, 3.6, -9.0); root.add(backdrop);

  const platform = new THREE.Mesh(new THREE.BoxGeometry(10.5, STAGE_Y, 4.8), M.platform);
  platform.position.set(0, STAGE_Y / 2, STAGE_Z); platform.castShadow = platform.receiveShadow = high; root.add(platform);
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 16), M.carpet);
  runner.rotation.x = -Math.PI / 2; runner.position.set(0, 0.012, 0.2); root.add(runner);
  const steps = new THREE.Mesh(new THREE.BoxGeometry(3, 0.22, 0.9), M.platform);
  steps.position.set(0, 0.11, STAGE_Z + 2.85); root.add(steps);

  // ---------- flowers (one InstancedMesh, re-laid out per stage variant & palette) ----------
  const flowerGeo = track(new THREE.IcosahedronGeometry(1, 1));
  const flowers = new THREE.InstancedMesh(flowerGeo, M.flower, N.flowers);
  flowers.castShadow = false; flowers.frustumCulled = false;

  const stageGroup = new THREE.Group(); stageGroup.position.set(0, STAGE_Y, STAGE_Z);
  const frameGroups = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
  frameGroups.forEach((g) => stageGroup.add(g));
  stageGroup.add(flowers);
  root.add(stageGroup);

  // Frame variant 0 — arch
  const archCurve = (() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = Math.PI * (i / 40);
      pts.push(new THREE.Vector3(-Math.cos(a) * 2.7, 2.3 + Math.sin(a) * 2.2, 0));
    }
    return new THREE.CatmullRomCurve3([new THREE.Vector3(-2.7, 0, 0), new THREE.Vector3(-2.7, 1.2, 0), ...pts, new THREE.Vector3(2.7, 1.2, 0), new THREE.Vector3(2.7, 0, 0)]);
  })();
  frameGroups[0].add(new THREE.Mesh(track(new THREE.TubeGeometry(archCurve, 80, 0.07, 8)), M.gold));
  // Frame variant 1 — ring
  const ring = new THREE.Mesh(track(new THREE.TorusGeometry(2.5, 0.06, 8, 72)), M.gold); ring.position.y = 3.1;
  frameGroups[1].add(ring);
  // Frame variant 2 — mandap
  const mandap = frameGroups[2];
  for (const x of [-2.6, 2.6]) for (const z of [-1.4, 1.2]) {
    const col = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.12, 3.8, 16)), M.gold); col.position.set(x, 1.9, z); mandap.add(col);
  }
  const canopy = new THREE.Mesh(track(new THREE.ConeGeometry(4.3, 1.5, 4, 1)), M.cloth);
  canopy.rotation.y = Math.PI / 4; canopy.position.set(0, 4.55, -0.1); mandap.add(canopy);
  const rim = new THREE.Mesh(track(new THREE.BoxGeometry(5.5, 0.12, 3.1)), M.gold); rim.position.set(0, 3.82, -0.1); mandap.add(rim);

  /** Flower anchor points for each stage variant (local to stageGroup). */
  function stagePoints(variant, n) {
    const r = rng(7 + variant), out = [];
    const jitter = (s) => (r() - 0.5) * s;
    if (variant === 0) {
      for (let i = 0; i < n; i++) {
        const along = r(), a = Math.PI * along, dense = 1 - Math.abs(along - 0.5) * 0.6; // heavier at the crown
        if (r() < 0.78) out.push([-Math.cos(a) * 2.7 + jitter(0.5 * dense + 0.2), 2.3 + Math.sin(a) * 2.2 + jitter(0.5), jitter(0.5), 0.12 + r() * 0.12 * dense]);
        else out.push([(r() < 0.5 ? -2.7 : 2.7) + jitter(0.5), r() * 2.3, jitter(0.4), 0.1 + r() * 0.1]); // pillar bases
      }
    } else if (variant === 1) {
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, heavy = a > Math.PI * 0.9 && a < Math.PI * 1.9 ? 1.6 : 0.8; // fuller lower-left sweep
        out.push([Math.cos(a) * 2.5 + jitter(0.4 * heavy), 3.1 + Math.sin(a) * 2.5 + jitter(0.4 * heavy), jitter(0.5), 0.1 + r() * 0.13]);
      }
    } else {
      for (let i = 0; i < n; i++) {
        const k = r();
        if (k < 0.45) { const px = r() < 0.5 ? -2.6 : 2.6, pz = r() < 0.5 ? -1.4 : 1.2; out.push([px + jitter(0.4), r() * 3.7, pz + jitter(0.4), 0.1 + r() * 0.1]); }        // pillar garlands
        else if (k < 0.8) { const t = r() * 4, side = Math.floor(t), f = t - side; const cx = side < 2 ? (side ? 2.75 : -2.75) : (f - 0.5) * 5.5; const cz = side < 2 ? (f - 0.5) * 3.1 - 0.1 : (side === 2 ? 1.45 : -1.65); out.push([cx + jitter(0.2), 3.75 - r() * 0.6, cz + jitter(0.2), 0.1 + r() * 0.1]); } // fringe
        else out.push([jitter(8), r() * 0.5, 1.6 + r() * 0.6, 0.12 + r() * 0.1]);                                                                                                         // floor arrangements
      }
    }
    return out;
  }

  let palette = 0, stageVariant = 0;
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler(), _c = new THREE.Color();
  function layoutFlowers() {
    const pts = stagePoints(stageVariant, N.flowers), pal = PALETTES[palette], r = rng(99);
    frameGroups.forEach((g, i) => (g.visible = i === stageVariant));
    pts.forEach(([x, y, z, sz], i) => {
      const leaf = r() < 0.3;
      _p.set(x, y, z);
      _e.set(r() * 3, r() * 3, r() * 3); _q.setFromEuler(_e);
      leaf ? _s.set(sz * 1.05, sz * 0.4, sz * 0.8) : _s.setScalar(sz * 0.82);
      _m.compose(_p, _q, _s); flowers.setMatrixAt(i, _m);
      leaf ? _c.setHex(pal.green) : _c.setHex(pal.colors[Math.floor(r() * pal.colors.length)]);
      _c.multiplyScalar(0.85 + r() * 0.3);
      flowers.setColorAt(i, _c);
    });
    flowers.instanceMatrix.needsUpdate = true; flowers.instanceColor.needsUpdate = true;
  }

  // ---------- hanging flowers & string lights ----------
  const hangA = new THREE.Group(), hangB = new THREE.Group();
  hangA.position.y = hangB.position.y = 7.5; root.add(hangA, hangB);
  const hangFlowers = new THREE.InstancedMesh(flowerGeo, M.hang, N.hanging * 5); hangFlowers.frustumCulled = false;
  {
    const linePts = [], r = rng(5); let k = 0;
    for (let i = 0; i < N.hanging; i++) {
      const x = (r() - 0.5) * 18, z = -5 + r() * 12, len = 1.6 + r() * 3.2, g = i % 2 ? hangA : hangB;
      linePts.push(x, 0, z, x, -len, z);
      for (let j = 0; j < 5; j++) {
        const y = -len + j * 0.17 + (r() - 0.5) * 0.06, s = 0.05 + r() * 0.05;
        _m.compose(_p.set(x + (r() - 0.5) * 0.15, y, z + (r() - 0.5) * 0.15), _q.identity(), _s.setScalar(s)); hangFlowers.setMatrixAt(k, _m);
        _c.setHex(PALETTES[0].colors[j % 4]); hangFlowers.setColorAt(k++, _c);
      }
    }
    const lg = track(new THREE.BufferGeometry()); lg.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    hangA.add(new THREE.LineSegments(lg, M.strand)); hangA.add(hangFlowers);
  }
  function recolorHanging() {
    const pal = PALETTES[palette];
    for (let i = 0; i < hangFlowers.count; i++) { _c.setHex(pal.colors[i % pal.colors.length]); hangFlowers.setColorAt(i, _c); }
    hangFlowers.instanceColor.needsUpdate = true;
  }

  // string lights: catenary lines across the hall + glow points
  const stringPositions = [];
  for (let s = 0; s < N.strings; s++) {
    const z = -6 + (s / (N.strings - 1)) * 13;
    for (let i = 0; i <= N.stringPts; i++) {
      const u = i / N.stringPts, x = -12 + u * 24, sag = Math.sin(u * Math.PI * 6) * 0.0; // straight spans with swags below
      const swag = Math.abs(Math.sin(u * Math.PI * 4)) * 0.9;
      stringPositions.push(x, 6.9 - swag + sag, z);
    }
  }
  const stringGeo = track(new THREE.BufferGeometry()); stringGeo.setAttribute('position', new THREE.Float32BufferAttribute(stringPositions, 3));
  const stringPoints = new THREE.Points(stringGeo, stringMat); stringPoints.frustumCulled = false; root.add(stringPoints);

  // ---------- tables / chairs (all instanced, re-laid out per variant) ----------
  const MAXT = 14, MAXC = 96;
  const clothGeo = track(new THREE.CylinderGeometry(0.85, 0.95, 0.76, 28));
  const longGeo = track(new THREE.BoxGeometry(1, 0.76, 1));
  const loungeTopGeo = track(new THREE.CylinderGeometry(0.55, 0.55, 0.38, 24));
  const seatGeo = track(new THREE.BoxGeometry(1, 0.09, 1));
  const backGeo = track(new THREE.BoxGeometry(1, 1, 0.08));
  const legGeo = track(new THREE.CylinderGeometry(0.025, 0.025, 0.46, 6));
  const centerGeo = flowerGeo, candleGeo = track(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8));
  const mk = (geo, mat, n, shadow = high) => { const m = new THREE.InstancedMesh(geo, mat, n); m.castShadow = shadow; m.receiveShadow = high; m.frustumCulled = false; m.count = 0; root.add(m); return m; };
  const roundT = mk(clothGeo, M.cloth, MAXT), longT = mk(longGeo, M.cloth, 4), loungeT = mk(loungeTopGeo, M.gold, MAXT);
  const seats = mk(seatGeo, M.chair, MAXC), backs = mk(backGeo, M.chair, MAXC), legs = mk(legGeo, M.chair, MAXC * 4, false);
  const sofaSeats = mk(seatGeo, M.sofa, 24), sofaBacks = mk(backGeo, M.sofa, 24);
  const centers = mk(centerGeo, M.hang, MAXT * 4, false);
  const candles = mk(candleGeo, M.candle, MAXT * 2, false);
  const candleGlowGeo = track(new THREE.BufferGeometry());
  candleGlowGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAXT * 2 * 3), 3));
  const candleGlow = new THREE.Points(candleGlowGeo, candleMat); candleGlow.frustumCulled = false; root.add(candleGlow);

  const mat4 = (x, y, z, sx = 1, sy = 1, sz = 1, ry = 0) => { _e.set(0, ry, 0); _q.setFromEuler(_e); return _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz)); };

  function layoutTables(variant) {
    // reset counts
    [roundT, longT, loungeT, seats, backs, legs, sofaSeats, sofaBacks, centers, candles].forEach((m) => (m.count = 0));
    const add = (mesh, m4) => mesh.setMatrixAt(mesh.count++, m4);
    const chair = (x, z, ry) => {
      add(seats, mat4(x, 0.48, z, 0.46, 1, 0.46, ry));
      // back sits on the side facing away from the table: local -z after rotation
      const bx = x - Math.sin(ry) * 0.21, bz = z - Math.cos(ry) * 0.21;
      add(backs, mat4(bx, 0.75, bz, 0.46, 0.5, 1, ry));
      for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const ox = lx * 0.19, oz = lz * 0.19, c = Math.cos(ry), s = Math.sin(ry);
        add(legs, mat4(x + ox * c + oz * s, 0.23, z - ox * s + oz * c));
      }
    };
    const centerpiece = (x, z, y = 0.76) => {
      const pal = PALETTES[palette];
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * 6.28, c = centers.count;
        centers.setMatrixAt(centers.count++, mat4(x + Math.cos(a) * 0.07, y + 0.12 + (i % 2) * 0.05, z + Math.sin(a) * 0.07, 0.075, 0.075, 0.075));
        _c.setHex(pal.colors[(i + c) % pal.colors.length]); centers.setColorAt(c, _c);
      }
    };
    const glowPos = candleGlowGeo.attributes.position; let gc = 0;
    const candle = (x, z, y = 0.76) => { add(candles, mat4(x, y + 0.11, z)); glowPos.setXYZ(gc++, x, y + 0.27, z); };

    if (variant === 0) {                                        // round tables, 6 chairs each
      const xs = high ? [-3.9, -7.5, 3.9, 7.5] : [-4.4, 4.4], zs = [-2, 2, 6];
      for (const x of xs) for (const z of zs) {
        add(roundT, mat4(x, 0.38, z)); centerpiece(x, z); candle(x + 0.35, z + 0.2); candle(x - 0.35, z - 0.2);
        for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; chair(x + Math.sin(a) * 1.3, z + Math.cos(a) * 1.3, a + Math.PI); }
      }
    } else if (variant === 1) {                                 // long banquet tables, chairs both sides
      for (const x of [-4.6, 4.6]) {
        add(longT, mat4(x, 0.38, 1, 1.3, 1, 12));
        for (let i = 0; i < 6; i++) {
          const z = -3.9 + i * 2; centerpiece(x, z); candle(x + 0.3, z + 0.9); candle(x - 0.3, z + 0.9);
          chair(x - 0.95, z, Math.PI / 2); chair(x + 0.95, z, -Math.PI / 2);
          chair(x - 0.95, z + 1, Math.PI / 2); chair(x + 0.95, z + 1, -Math.PI / 2);
        }
      }
    } else {                                                    // lounge clusters: sofas around a low gold table
      const spots = high ? [[-4.6, -2], [-4.6, 3.5], [4.6, -2], [4.6, 3.5], [-8.2, 0.7], [8.2, 0.7]] : [[-4.6, -1], [4.6, -1], [-4.6, 4], [4.6, 4]];
      for (const [x, z] of spots) {
        add(loungeT, mat4(x, 0.19, z)); centerpiece(x, z, 0.38); candle(x + 0.2, z, 0.38);
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 + Math.PI / 6, sx = x + Math.sin(a) * 1.55, sz = z + Math.cos(a) * 1.55, ry = a + Math.PI;
          add(sofaSeats, mat4(sx, 0.32, sz, 1.7, 4, 0.85, ry));
          add(sofaBacks, mat4(sx - Math.sin(ry) * 0.4, 0.62, sz - Math.cos(ry) * 0.4, 1.7, 0.6, 1, ry));
        }
      }
    }
    for (const m of [roundT, longT, loungeT, seats, backs, legs, sofaSeats, sofaBacks, centers, candles]) {
      m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    candleGlowGeo.setDrawRange(0, gc); glowPos.needsUpdate = true;
  }
  const tableMeshes = [roundT, longT, loungeT, seats, backs, legs, sofaSeats, sofaBacks, centers, candles, candleGlow];

  // ---------- petals ----------
  const petalTex = track(glowTexture('rgba(255,225,225,1)', 'rgba(240,190,190,.5)'));
  const petalGeo = track(new THREE.BufferGeometry());
  const petalPos = new Float32Array(N.petals * 3), petalSeed = [];
  for (let i = 0; i < N.petals; i++) { petalPos.set([(rand() - 0.5) * 20, rand() * 7, -8 + rand() * 18], i * 3); petalSeed.push(rand() * 6.28); }
  petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
  const petals = new THREE.Points(petalGeo, track(new THREE.PointsMaterial({
    map: petalTex, size: 0.14, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false, color: 0xf4cfcf,
  })));
  petals.frustumCulled = false; root.add(petals);

  // ---------- public API ----------
  function pop(obj, from = 0.9) {                               // gentle scale-in when a variant changes
    if (still) return;
    obj.userData.tween = true;
    obj.userData.pop = 0;
    obj.userData.popFrom = from;
  }
  layoutFlowers(); recolorHanging(); layoutTables(0);

  const api = {
    root, options: { flowers: PALETTES.map((p) => p.name), stage: STAGES, tables: TABLES },
    /** Per-frame animation: sway, petals, twinkle, pops. */
    update(dt, t) {
      hangA.rotation.z = Math.sin(t * 0.35) * 0.012; hangA.rotation.x = Math.sin(t * 0.27) * 0.01;
      hangB.rotation.z = Math.sin(t * 0.3 + 2) * 0.012;
      back.position.x = Math.sin(t * 0.2) * 0.04;                       // curtains breathe very slightly
      flowers.rotation.z = Math.sin(t * 0.4) * 0.003;
      stringMat.size = 0.5 * (1 + Math.sin(t * 2.3) * 0.06);
      const a = petalGeo.attributes.position;
      for (let i = 0; i < N.petals; i++) {
        let y = a.getY(i) - dt * (0.22 + (i % 5) * 0.03);
        if (y < 0) y = 7;
        a.setXYZ(i, a.getX(i) + Math.sin(t * 0.5 + petalSeed[i]) * dt * 0.18, y, a.getZ(i));
      }
      a.needsUpdate = true;
      for (const o of [stageGroup, ...tableMeshes]) {
        if (!o.userData.tween) continue;
        o.userData.pop = Math.min(1, o.userData.pop + dt / 0.7);
        const s = o.userData.popFrom + (1 - o.userData.popFrom) * ease.outCubic(o.userData.pop);
        o.scale.set(s, s, s);
        if (o.userData.pop >= 1) { o.userData.tween = false; o.scale.set(1, 1, 1); }
      }
    },
    setFlowers(i) {
      palette = ((i % PALETTES.length) + PALETTES.length) % PALETTES.length;
      layoutFlowers(); recolorHanging(); layoutTables(api._tables); pop(stageGroup, 0.94);
    },
    setStage(i) { stageVariant = ((i % STAGES.length) + STAGES.length) % STAGES.length; layoutFlowers(); pop(stageGroup, 0.82); },
    setTables(i) {
      api._tables = ((i % TABLES.length) + TABLES.length) % TABLES.length; layoutTables(api._tables);
      // pop the table instances from their own origin (floor level) so they appear to settle in
      tableMeshes.forEach((m) => pop(m, 0.96));
    },
    _tables: 0,
    dispose() { disposables.forEach((d) => d.dispose && d.dispose()); },
  };
  return api;
}

/**
 * Optional authored assets. If assets/3d/manifest.json sets "enabled": true and lists models, they are
 * loaded (Draco/KTX2 aware) and added to the venue. Missing files never break the page.
 */
export async function loadOptionalModels(THREE_, venue, { tier, onProgress = () => {} }) {
  let manifest;
  try {
    const res = await fetch('assets/3d/manifest.json', { cache: 'no-cache' });
    if (!res.ok) return;
    manifest = await res.json();
  } catch (_) { return; }
  if (!manifest.enabled || !manifest.models) return;

  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
  const loader = new GLTFLoader();
  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
  loader.setDRACOLoader(draco);

  const entries = Object.entries(manifest.models);
  let done = 0;
  for (const [name, def] of entries) {
    const file = tier === 'high' ? def.file : (def.mobileFile || def.file);
    try {
      const gltf = await loader.loadAsync('assets/3d/' + file);
      const o = gltf.scene;
      o.position.set(...(def.position || [0, 0, 0])); o.scale.setScalar(def.scale || 1);
      o.name = name; venue.root.add(o);
    } catch (err) { console.warn('[wedora] optional model skipped:', file, err.message); }
    onProgress(++done / entries.length);
  }
  draco.dispose();
}
