# Wedora Events

Premium wedding & event decoration website — PHP + vanilla JS + Three.js.
*"We don't just decorate weddings. We create the environment in which your memories happen."*

## Run locally
```bash
php -S localhost:8080
```
Requires PHP 8.1+ with `pdo_sqlite` (default) or `pdo_mysql`. No build step.

## Project map
```
index.php about.php services.php portfolio.php contact.php   pages
includes/   config (business info, env settings) · db (PDO) · functions · content (services, portfolio, process…)
            header (SEO meta, JSON-LD, nav) · footer (WhatsApp button) · lead-form
api/lead.php            enquiry endpoint: CSRF, honeypot, min-fill-time, rate limit, validation, prepared INSERT, e-mail notification
assets/css/style.css    design system (ivory #F8F5EF / champagne #D8C3A5 / dark #171514 / accent #9A7250)
assets/js/main.js       nav, reveals, lightbox, filters, before/after, form, 3D bootstrap
assets/js/three/        performance · scene · camera · lighting · models · animation · interaction
assets/3d/              GLB/texture/HDR drop-in folders + manifest.json (see its README)
data/                   SQLite lead database (git-ignored, web access denied)
```

## Configuration (environment variables — nothing secret lives in the repo)
| Variable | Purpose |
|---|---|
| `WEDORA_SITE_URL` | canonical origin (default `https://www.weddingflowerdecoration.com`) |
| `WEDORA_NOTIFY_EMAIL` | where new-lead e-mails go (default `booking@weddingflowerdecoration.com`) |
| `WEDORA_DB_DSN` / `_USER` / `_PASS` | use MySQL instead of SQLite, e.g. `mysql:host=localhost;dbname=wedora;charset=utf8mb4` |

The `leads` table is created automatically. Update `sitemap.xml` / `robots.txt` if the domain differs.

## 3D experience
* **Hero** – tall sticky section; scroll moves the camera through four states (`hero → venue → stage → detail`), with a few-degree mouse parallax and a slow drift.
* **"Imagine Your Celebration"** – lazy-initialised when scrolled near; Flowers / Lighting / Stage / Tables buttons cycle variants.
* **Quality tiers** – `high` desktop (shadows, DPR ≤ 2) · `mid` phones (no shadows, fewer instances, DPR ≤ 1.5) · `low` / no WebGL / data-saver → static hero image. A frame-rate monitor downgrades, then falls back, if rendering is slow.
* **Reduced motion** – single static frame, no scroll journey, no drift.
* The venue is **procedural** (no model files needed). Authored GLBs can be dropped in via `assets/3d/manifest.json`.
* Three.js is loaded from jsDelivr through an import map in `includes/header.php` (pinned to 0.160.0). Self-host it there if you prefer.

## Content to replace before launch
* `assets/img/portfolio/*.svg` and `hero-fallback.svg` are **placeholders** — swap in real project photos (WebP/AVIF, responsive sizes) via `includes/content.php`.
* `$TESTIMONIALS` in `includes/content.php` is empty; the section appears once real testimonials are added.
* Add `geo`, opening hours and social profiles to the JSON-LD in `includes/header.php` once confirmed.
