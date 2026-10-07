# 3D assets

The 3D venue is currently **procedural** (built from primitives in `assets/js/three/models.js`), so no model files are required.
To upgrade to authored models, export optimised GLBs (Draco-compressed geometry, KTX2/WebP textures, under ~2 MB each for desktop and ~800 KB for mobile) with these names and list them in `manifest.json`:

| File | Purpose |
|---|---|
| `wedding-stage.glb` / `wedding-stage-mobile.glb` | Main stage / backdrop |
| `floral-arch.glb`, `mandap.glb`, `reception-stage.glb` | Stage variants |
| `table-setting.glb`, `chair.glb` | Table and seating |
| `flowers.glb`, `candles.glb`, `lights.glb` | Details |

Example `manifest.json`:

```json
{ "enabled": true, "models": { "stage": { "file": "wedding-stage.glb", "mobileFile": "wedding-stage-mobile.glb", "position": [0, 0.45, -7.4], "scale": 1 } } }
```

Textures go in `textures/`, HDR environment maps in `hdr/`. Models load lazily after the first frame; a missing or broken file is skipped without affecting the page.
