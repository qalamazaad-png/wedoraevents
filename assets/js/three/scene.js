import * as THREE from 'three';
import { AnimationManager } from './animation.js';
import { pixelRatioFor, FrameMonitor } from './performance.js';

/**
 * Creates renderer + scene + camera + clock + animation manager around a canvas.
 * Rendering only runs while the canvas is on screen and the tab is visible.
 */
export function createStage(canvas, { tier, still = false, fov = 46, onFail = () => {}, onDegrade = () => {} }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas, antialias: tier !== 'low', alpha: false, powerPreference: 'high-performance', stencil: false,
    });
  } catch (err) { onFail(err); return null; }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = tier === 'high';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(pixelRatioFor(tier));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 80);
  const clock = new THREE.Clock();
  const animation = new AnimationManager();
  const frameUpdaters = [];

  let running = false, onScreen = true, rafId = 0, disposed = false, elapsed = 0;

  const stage = {
    renderer, scene, camera, clock, animation, tier,
    /** Register fn(dt, elapsed) called each frame before render. */
    onFrame(fn) { frameUpdaters.push(fn); },
  };

  function resize() {
    const host = canvas.parentElement;
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole venue in frame on portrait screens
    camera.userData.baseFov = camera.userData.baseFov || camera.fov;
    camera.updateProjectionMatrix();
    renderOnce();
  }

  function frame() {
    if (!running || disposed) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1);
    elapsed += dt;
    animation.update(dt, elapsed);
    for (const fn of frameUpdaters) fn(dt, elapsed);
    renderer.render(scene, camera);
    monitor.tick(dt);
  }

  /** Render a single frame (reduced-motion mode and after resizes). */
  function renderOnce() {
    if (disposed) return;
    const dt = 1 / 60;
    if (!running) { elapsed += still ? 0 : dt; animation.update(still ? 1 : dt, elapsed); frameUpdaters.forEach((fn) => fn(still ? 1 : dt, elapsed)); }
    renderer.render(scene, camera);
  }

  const monitor = new FrameMonitor((level) => {
    if (level === 1) { renderer.setPixelRatio(1); renderer.shadowMap.enabled = false; resize(); onDegrade(1); }
    else { onFail(new Error('Frame rate too low')); }
  });

  function start() {
    if (still || running || disposed || !onScreen || document.hidden) return;
    running = true; clock.start(); clock.getDelta(); rafId = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(rafId); }

  const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement);
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? start() : stop(); }, { rootMargin: '80px' });
  io.observe(canvas.parentElement);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); onFail(new Error('WebGL context lost')); });

  Object.assign(stage, {
    start, stop, resize, renderOnce,
    /** Release GPU memory and observers (important when falling back or leaving the page). */
    dispose() {
      disposed = true; stop(); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      animation.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map && m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
    },
  });
  return stage;
}
