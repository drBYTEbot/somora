# AGENTS.md

Guidance for AI agents (and humans) working on Somora.

## Essential commands

Run these before considering any task complete:

```bash
npm install        # install dependencies
npm run typecheck  # tsc --noEmit  (must pass)
npm run lint       # next lint     (must pass)
npm run build      # production build (must pass)
npm run dev        # dev server at http://localhost:3000
```

If a command fails, fix it before committing. Do not commit broken builds.

## Architecture

- **Next.js 14 App Router**, React 18, TypeScript, Tailwind, Framer Motion.
- All client interactivity (motion, `usePathname`, state) lives in components
  marked `"use client"`. Pages stay server components by default; module pages
  import the shared `ModuleOverview` client component.
- Route group `src/app/(app)` wraps every module route in the responsive
  `AppShell` (sidebar + mobile drawer). The landing page `/` is standalone.

## Single sources of truth

- **Modules** &rarr; `src/config/modules.ts` (`modules`, `moduleMap`, `getModule`).
  Each module has a stable `id`, route `href`, emoji, Tailwind gradient/text/glow
  class strings, status, and feature list. **Keep naming consistent here.**
- **Worlds** &rarr; `src/config/worlds.ts` (`worlds`). Each has `x`/`y` map
  position (percent), `order`, and `unlocked` state.
- **Site** &rarr; `src/config/site.ts`.

To add a module/world, edit the config first, then add the route page.

## Conventions

- Use the `cn()` helper from `@/lib/utils` (clsx + tailwind-merge) for classes.
- Tailwind gradient/color classes for a module come from its config entry as
  **literal strings** so the JIT compiler sees them. Do not build class names
  dynamically (e.g. `bg-${color}-400`) &mdash; they will be purged.
- Design tokens live in `tailwind.config.ts` (`night`, `cloud`, `aurora`) and
  `src/app/globals.css` (`.glass`, `.text-gradient`, `.container-page`,
  reduced-motion handling).
- Animations: prefer Framer Motion `whileInView` with `viewport={{ once: true }}`.
  Respect `prefers-reduced-motion` (already handled globally in CSS).
- Accessibility: every interactive element needs a visible focus ring; icons
  are `aria-hidden`; emoji are decorative (`aria-hidden` on their span).
- **Never commit secrets.** Use environment variables; on Build.io set them as
  Config Vars in the app Settings tab.

## Deployment

Deploy target is [Build.io](https://build.io) (Heroku-style PaaS).

- `Procfile` &rarr; `web: npm start` &rarr; runs `next start` (honors `PORT`).
- `package.json` `engines.node` tells the buildpack which Node to install.
- `npm run build` runs during the build phase; `npm start` runs at runtime.
- Connect the repo and enable automatic deploys from `main` in the Build.io
  dashboard Deploy tab. See README for full steps.
