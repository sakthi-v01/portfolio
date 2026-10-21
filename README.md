# Sakthivel Rathinavel — Portfolio

Personal portfolio of **Sakthivel Rathinavel** — Psychology (HRDM) · Founder of Oazis · Creator.

**Live:** https://sakthi-v01.github.io/portfolio/

Plain HTML / CSS / JavaScript — no framework, no build step. Edit a file, refresh, done.

## Pages

| Page | File |
| --- | --- |
| Home (hero, about, three doors, contact) | `index.html` |
| Psychology / HR | `psychology.html` |
| Founder (Oazis) | `founder.html` |
| Creator | `creator.html` |
| Branded 404 | `404.html` |

## Run it locally

```bash
python -m http.server 5500
# then open http://localhost:5500
```

## Project layout

```
assets/
  css/style.css          all styles (design tokens at the top, mobile/tablet rules at the bottom)
  js/main.js             fade-ins, contact form, accessible mobile menu
  js/side-rays.js        WebGL hero background (pauses off-screen / when the tab is hidden)
  js/vendor/ogl.mjs      tree-shaken OGL build used by the rays (MIT)
  fonts/                 Clash Display, Inter, Sora — all self-hosted
  images/                optimised WebP/PNG + the Open Graph share cards (og-*.jpg)
```

## Things worth knowing

- **Cache-busting:** CSS/JS are linked with `?v=NN`. Bump the number in every HTML file whenever you edit
  `style.css`, `main.js` or `side-rays.js`, or visitors (and your phone) may keep the old copy.
- **Contact form:** by default it opens the visitor's mail app. To deliver messages straight to your inbox for
  every visitor, set `data-endpoint` (and `data-access-key` for Web3Forms) on `<form id="contact-form">` in
  `index.html` — the supported providers are listed in the comment above the form. If a provider is blocked or
  down for a visitor, the form falls back to the mail app automatically.
- **Intro loader:** shows once per browser session. Add `?loader` to the URL to replay it.
- **Share previews:** each page has Open Graph / Twitter tags and its own 1200×630 card in `assets/images/og-*.jpg`.
  If the site URL ever changes (renamed repo, custom domain), update the absolute URLs in each page's `<head>`,
  in `sitemap.xml`, `robots.txt` and the `<base>` tag of `404.html`.
- **Mobile layout** lives under `@media (max-width: 640px)`; the menu/tablet adjustments under `860px`.

## Credits & licences

- **Clash Display** — Indian Type Foundry, [ITF Free Font License](https://www.fontshare.com/licenses/itf-ffl).
- **Inter** and **Sora** — SIL Open Font License 1.1.
- **OGL** — MIT. The ray effect is adapted from the *SideRays* component on [React Bits](https://reactbits.dev).

© Sakthivel Rathinavel. Content and photos are not licensed for reuse.
