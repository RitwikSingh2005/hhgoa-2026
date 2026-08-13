# HH Goa 2026 — Builder Identity Generator

Upload one photo → generate an HH Goa 2026 PFP frame or a full Builder Identity
Card (poster-style, with name/role/stack) → download a real PNG → share to X
with a link that unfurls a proper OG image. No login, no backend/database.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Requires internet access on first build (Google
Fonts: Archivo Black, Space Mono, Inter, loaded via `next/font/google` and
self-hosted at build time — no runtime font requests).

## Deploy

Push to a GitHub repo and import into Vercel — zero config needed. Update
`SITE_URL` in `app/layout.tsx`, `app/s/[data]/page.tsx`, and
`components/ResultPanel.tsx` to your real production domain before shipping
(currently a placeholder `hhgoa2026-identity.vercel.app`).

## How it works

- **Upload → editor → generate** is entirely client-side. Photos never leave
  the browser; nothing is uploaded to a server.
- **Canvas export** (`lib/canvasRender.ts`) draws the actual PNG — frame,
  photo, typography, halftone treatment, registration marks — so the
  download is a real generated image, not a screenshot.
- **Crop math** (`lib/imageUtils.ts`) stores pan offsets as *fractions* of
  the frame size, so the same crop reproduces identically in the small
  on-screen editor and the large export canvas.
- **Sharing without a database**: card data (name/role/title/builder number)
  is small, so it's base64url-encoded directly into the `/s/[data]` URL.
  `generateMetadata` decodes it server-side and points `og:image` at
  `/api/og`, an Edge route that renders a matching OG image on the fly with
  `next/og` — so link unfurls work in production with zero storage.
- **Builder titles** (`lib/builderTitles.ts`) are keyword-matched against the
  role field (extensible rule table + deterministic fallback), and a
  deterministic builder number is derived from name+role so the same input
  always yields the same collectible ID.

## What's implemented

Phases 1–9 from the brief: visual system, upload with status-sequence
feedback, crop/zoom/reset editor, PFP frame, Builder Identity Card (with
4 role-based composition variants), canvas PNG export, `/s/[data]` share
pages with working OG metadata, and a mobile-first responsive layout
(Tailwind breakpoints throughout, tested down to 375px logic — verify
visually once deployed, this sandbox has no browser).

## Known gaps / next steps (phases 10–12)

- **HEIC**: decoded via `createImageBitmap`, which covers most Android/desktop
  browsers; Safari handles HEIC natively. If a browser truly can't decode it,
  the UI asks the user to export as JPG/PNG rather than failing silently.
- **Motion polish**: `prefers-reduced-motion` is respected globally in
  `globals.css`; a final pass with real users on real devices (cursor
  magnetics, scroll-triggered reveals beyond the hero) is worth doing before
  a judged demo.
- **Card composition variants**: currently share one grid with accent-color
  and label shifts per role category (`grid` / `data` / `editorial` /
  `systems`); a deeper structural variation per variant is a good next
  iteration if time allows.
- **Lighthouse/perf & a11y audit**: not run in this environment (no browser
  available) — run `npm run build && npx serve out` or deploy a preview and
  check with real tooling before submission.
- Update the placeholder `SITE_URL` and OG defaults before you ship.
