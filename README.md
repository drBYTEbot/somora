# Somora

> **Where Curiosity Creates Intelligence.**

Somora is an animated AI education universe where children learn Artificial
Intelligence by exploring worlds, playing games, running experiments, and
building real AI projects. Not another class &mdash; an adventure.

The mission: close the AI literacy and STEM opportunity gap by making AI
accessible to children from every background, so every learner leaves believing
_&ldquo;I can build AI.&rdquo;_

---

## Tech stack

| Layer        | Choice                                                        |
| ------------ | ------------------------------------------------------------ |
| Framework    | [Next.js 14](https://nextjs.org/) (App Router) + React 18   |
| Language     | TypeScript                                                   |
| Styling      | Tailwind CSS + custom design tokens, glassmorphism          |
| Animation    | Framer Motion                                                |
| Fonts        | Fredoka (display) + Nunito (body) via `next/font`           |
| Backend      | Supabase + PostgreSQL (planned; auth, storage, realtime)    |
| AI / ML      | Transformers.js, TensorFlow.js, MediaPipe, ONNX (planned)   |
| Deployment   | [Build.io](https://build.io) (Heroku-style PaaS, buildpacks) |

## The 12 modules

The ecosystem is defined in a single source of truth:
[`src/config/modules.ts`](src/config/modules.ts).

| Module          | Route         | Purpose                                            |
| --------------- | ------------- | ------------------------------------------------- |
| Somora Universe | `/universe`   | Interactive world map & learning journey          |
| Somora Studio   | `/studio`     | AI app builder & vibe coding environment          |
| Somora AI       | `/ai`         | Personal AI tutor & learning companion            |
| Somora Labs     | `/labs`       | Hands-on AI & ML experiments                      |
| Somora Arcade   | `/arcade`     | Educational AI mini-games                         |
| Somora Academy  | `/academy`    | Structured learning curriculum                    |
| Somora Quest    | `/quest`      | Daily quests, missions & challenges               |
| Somora Forge    | `/forge`      | Project creation & portfolio builder              |
| Somora Hub      | `/hub`        | Dashboard & progress tracking                     |
| Somora Creator  | `/creator`    | Prompt engineering & generative AI tools          |
| Somora Class    | `/class`      | Teacher dashboard                                 |
| Somora Home     | `/home`       | Parent dashboard                                  |

The 10 worlds of Somora Universe live in
[`src/config/worlds.ts`](src/config/worlds.ts).

## Project structure

```
src/
  app/
    page.tsx                 Landing / portal (hero + world map + ecosystem)
    layout.tsx               Root layout, fonts, metadata
    globals.css             Tailwind + design tokens
    (app)/                   Authenticated app shell (sidebar + topbar)
      layout.tsx             AppShell wrapper
      universe/page.tsx      Full interactive world map (special)
      hub|ai|studio|.../page.tsx  Module overview pages (shared component)
  components/
    brand/                   Logo
    icons/                   Inline SVG icon set (no icon dependency)
    visual/                  Starfield, decorative backgrounds
    ui/                      Glass card, button, status badge, module card
    shell/                   AppShell, Sidebar (responsive, mobile drawer)
    world/                   WorldMap, WorldIsland (animated floating islands)
  config/
    site.ts                  Site metadata
    modules.ts              12-module source of truth
    worlds.ts               10-world source of truth
  lib/
    utils.ts                cn() class merger
```

## Getting started

Requires Node 18.17+ (see `.nvmrc` for the recommended version).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm start`         | Run the production build             |
| `npm run lint`      | ESLint (next/core-web-vitals)        |
| `npm run typecheck` | TypeScript type check (`tsc --noEmit`) |

## Deploying to Build.io

Build.io is a Heroku-compatible PaaS that deploys straight from a GitHub repo
via Cloud Native / Heroku buildpacks &mdash; no Dockerfile required.

1. Push this repo to GitHub.
2. In [app.build.io](https://app.build.io), create an app and open the
   **Deploy** tab.
3. Under **Connection**, select the `drBYTEbot/somora` repository and click
   **Connect**.
4. Under **Automatic Deploys**, enable the `main` branch (or use
   **Deploy Branch** for manual deploys).
5. Build.io's Node buildpack runs `npm run build`, then starts the app with
   `npm start` (see [`Procfile`](Procfile)). `next start` honors the `PORT`
   environment variable automatically.
6. Add any secrets (Supabase keys, AI API keys) as **Config Vars** in the
   app's **Settings** tab &mdash; never commit them.

`engines.node` in [`package.json`](package.json) tells the buildpack which
Node version to install.

## Roadmap

This repository currently contains the **foundation**: design system, app
shell, the Somora Universe interactive world map, and consistent overview pages
for all 12 modules. Phased delivery follows the master product plan:

- **Phase 1 &ndash; 3** Discovery, product design, UX/UI (in progress)
- **Phase 4** Engineering foundation (this repo)
- **Phase 5** MVP &mdash; auth, 3 complete worlds, 5 mini-games, AI companion,
  Studio prototype, progress + parent/teacher dashboards
- **Phase 6** Testing, accessibility, performance, and the v2+ roadmap

## License

All rights reserved &copy; Somora.
