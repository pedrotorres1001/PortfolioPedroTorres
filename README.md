# Pedro Torres — Portfolio

Personal portfolio of **Pedro Torres**, junior software developer at **Kuehne+Nagel** with a background in computer engineering and a Master's in Digital Game Development (University of Aveiro).

🔗 **Live:** https://pedrotorres1001.github.io/PortfolioPedroTorres/

![Portfolio preview](public/og.png)

## Design

A light "system interface" aesthetic: monospaced type, bracketed labels, thin lines and archive-style record cards, with a low-poly three.js scene in the hero.

- **Palette** — ice grey `#E4E5E7`, surface `#ECECEC`, ink `#1C1C1E`, single accent `#22C55E`
- **Type** — JetBrains Mono (self-hosted via Fontsource)
- **Motion** — short boot screen, scramble text on hover, custom cursor, scroll reveals. All of it is disabled when the visitor prefers reduced motion.

## Sections

| # | Section | What's in it |
|---|---------|--------------|
| 00 | Hero | Live metadata, 3D scene with [REBUILD] + LOOP counter, telemetry, uptime at Kuehne+Nagel |
| 01 | Whoami | Day/night statement, profile text, SYSTEM_PROFILE |
| 02 | Work | Kuehne+Nagel record log + working principles |
| 03 | Projects | Filterable archive, scanline previews, dossiers with deep links (`#project/<slug>`) |
| 04 | Boot sequence | Scroll-linked timeline + education records |
| 05 | Contact | EmailJS form, socials, email |

## Things to find

- **Terminal** — press `~` (or the `>_` button): `help`, `projects`, `open <n>`, `goto <section>`, `rebuild`, `play`, `theme`, `lang`, `sound`, `achievements`…
- **CUBE_RUNNER** — a tiny canvas game. Konami code or `play` in the terminal.
- **Achievements** — five hidden ones, stored in your browser.
- **Toggles** — sound (Web Audio, off by default), light/dark theme, EN/PT.

## Editing content

**All text lives in [`src/constants/index.js`](src/constants/index.js)** — profile, about, work, education, boot sequence, projects, socials, UI copy and the EmailJS keys. Translatable strings are `{ en, pt }` objects. Search for `TODO` (information only you have) and `REVIEW` (drafts to confirm). Components only read from there, so updating the site never requires touching JSX. The page `<title>` and meta description are injected from the same file at build time.

To add a job, add an object to `work` (the first entry is the featured one). `startDate` uses `YYYY-MM-DD` and drives the tenure and uptime counters.

To add a project, add an object to `myProjects` and drop a `.webp` image in `public/assets/projects/`. Extra images go in `gallery`, a clip in `video`, and `embedUrl` takes an itch.io widget URL.

To show the CV buttons, add `public/cv.pdf` and set `profile.cvUrl` to `"cv.pdf"`.

## Stack

React 19 · Vite · Tailwind CSS 4 · three.js + React Three Fiber · Motion · EmailJS

The 3D scene is lazy-loaded after the first paint and pauses when it's off-screen. Reduced-motion visitors get a static SVG fallback.

## Development

```bash
npm install
npm run dev       # http://localhost:5173/PortfolioPedroTorres/
npm run build
npm run deploy    # builds and publishes dist/ to GitHub Pages (gh-pages branch)
```

## Structure

```
src/
├── constants/index.js   # all content
├── components/          # Frame, Scramble, Cursor, Boot, HeroScene, Terminal, CubeRunner, ...
├── lib/sfx.js           # Web Audio sound effects
├── state/AppState.jsx   # language, theme, sound, loop, achievements
├── sections/            # Navbar, Hero, About, Work, Projects, Education, Contact, Footer
├── App.jsx
└── index.css            # design tokens
```
