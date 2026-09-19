# Launchpad Studio — Freelance Portfolio (deploy-ready)

**Rebuilt from scratch**: new styling method (Tailwind Play CDN + launch design system — Orbitron display, space navy + flare orange, glass chips), new brand, far more interactive. No Template, no leftover Origami/Alchemists copy.

## Run / Deploy (zero build step)
- VS Code → open `D:\portfolio-freelance\` → Live Server on `index.html`, or `npx serve .`
- Vercel: `npx vercel --prod` (uses `vercel.json`); Netlify: drag folder or `npx netlify deploy --prod --dir .`
- Static hosts: upload everything. Update domain `launchpadstudio.example` → yours in: canonical (index.html), `sitemap.xml`, `robots.txt`.
- Needs internet for Tailwind CDN + Google Fonts; all JS is vanilla, no deps.

## Interactive systems (all vanilla JS)
1. **Theme** — dark default (night launch) ↔ light, `lp-theme` localStorage, pre-paint, toast confirms
2. **Starfield** — canvas stars + shooting stars (dark only), pauses when tab hidden, off on reduced-motion
3. **Scroll chrome** — top gradient progress bar + 🚀 rail ship that climbs as you scroll
4. **Countdown** — live T-minus to next Monday 09:00 launch window
5. **15s scroll film** — sticky stage, 4 chapters (Ignition/Liftoff/Orbit/Touchdown), route buttons, video scrub if MP4s deployed else canvas rocket fallback. Reduced-motion = static chapters, zero fetch
6. **Mission builder** — 3-step picker (craft single → modules multi → window) → mission class Scout/Orbital/Interstellar + timeline → WhatsApp send. No prices anywhere
7. **Work filters** — All / Cafés / Fitness across 5 REAL missions (all links verified)
8. **Testimonial slider** — auto 6s, arrows + dots, pause on hover
9. **FAQ accordion** — native details (timeline, hidden prices, Figma, white-label, support)
10. **Magnetic buttons + tilt cards + count-ups + ignition submit** (3-2-1 delay → WhatsApp → toast)

## Live missions (wired + verified)
- Escape by the Portal — https://escape-by-the-portal.vercel.app/
- Octane Fitness — https://octane-fitness.vercel.app/
- Project Fitness Gym — https://project-fitness-one.vercel.app
- Blue Door Café — https://the-blue-door-cafe.vercel.app/
- Crackpot Café & Bistro — https://crackpot.vercel.app/

## Fonts
- Display: Orbitron 500–900 (headings, tighter tracking, balanced wrap) · Body: DM Sans 400–700 (1.65 line-height, antialiased) · Mono: JetBrains Mono (kickers, meta, chips). `display=swap`, system fallbacks. Selection color = flare orange.

## Photography (local stock, no hotlinks)
- `assets/img/hero-launch.jpg` — night rocket launch (hero) · `work-portal/bluedoor/crackpot.jpg` — café interiors/coffee · `work-octane/pfitness.jpg` — gym floors · `team-code.jpg` — dev workstation (process) · `film-earth.jpg` — earth backdrop (testimonials)
- `assets/film-poster.png` + `og-cover.png` — generated from hero shot (real files, no broken slots). Credit: Unsplash CDN downloads. Swap any with Higgsfield renders when credits land.

## Icons (zero emojis, verified by grep)
- All pictograms are inline SVG (stroke = currentColor): rocket rail, sun/moon toggle, monitor/code/chart service marks, 13 builder glyphs. Chips, badges, countdown are type + CSS.
- Film: ONE `seedance_2_5` ~15s liftoff take → `assets/film-desktop.mp4` + `film-mobile.mp4` + `film-poster.png` (see `assets/README-film.md`)
- 3D: `assets/hero-launch.png`, `og-cover.png` via `gpt_image_2_5` (rocket liftoff, flare orange + ion teal, no text except OG)

## Checklist
- [x] Rebrand complete (verified: no Alchemists/Origami/transmute left)
- [x] No prices on site (budget bands only)
- [x] `node --check script.js`, all pages 200 locally
- [ ] Replace testimonial placeholders, set real domain
- [ ] Top up Higgsfield → generate film + hero PNG
