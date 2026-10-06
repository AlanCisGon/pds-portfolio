# alancisneros.design

I'm Alan Cisneros, a Senior Product Designer based in Culiacán, Mexico. At Coppel I'm the Design Lead for Purchase & Payments, and over the last eight years I've worked across e-commerce, financial services and telecom.

This repo is my portfolio, live at **[alancisneros.design](https://alancisneros.design)**.

## Why it exists

I believe good product design balances business, technology, product and design, instead of just checking off requirements. Most of my work so far has been on other companies' products, with other teams. This site is the first one where I'm the client, the designer and the material at the same time, so I'm building it the way I'd want any product to be built: understand the real problem first, then ship small and learn from it.

## How it's built

- **Next.js 16** (App Router), **React 19** and strict **TypeScript**, deployed on **Vercel**.
- **Its own design system** in `src/ui`: components written with CSS Modules on top of design tokens (`src/styles/tokens.css`). Dark mode only.
- **Figma is the source of truth for visuals; code is the source of truth for behavior.** Figma variables use the same names as the CSS custom properties, so a token means the same thing in both places.
- **Type:** Geist Sans and Geist Mono for the system, Newsreader for editorial headlines and quotes. **Icons:** Iconoir, plus Simple Icons for tool logos.
- **Content:** case studies are MDX files in `src/app/work/projects/`; the rest of the copy lives in `src/resources/content.tsx`.
- **SEO:** Next.js Metadata API, JSON-LD, a generated sitemap and a branded Open Graph image (`/api/og/generate`).

### How I work on it

Every change is a small bet. Before building anything non-trivial, I write the hypothesis in the pull request: what I'm changing, for whom, and how I'll know it worked. Each change gets its own branch and Vercel preview, and after it ships I check Vercel Web Analytics and Speed Insights to decide whether to keep it, iterate or revert it.

The design system migration followed the same idea: I replaced the original template piece by piece while the site stayed live, with no big-bang rewrite.

I built this portfolio with the help of AI: a small team of AI agents I designed and direct, while every decision and every merge stays mine.

## Run it locally

You need Node.js 20.9 or newer (required by Next.js 16).

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Other scripts:

```bash
npm run build          # production build
npm run start          # serve the production build
npm run lint           # ESLint
npm run biome-write    # format with Biome
```

`npm install` also turns on a pre-commit hook (`.githooks/pre-commit`) that runs Biome on staged files through `lint-staged`: it fixes formatting and blocks the commit if errors remain. To skip it once, use `git commit --no-verify`.

`/lab` is a private section behind HTTP Basic Auth. To open it locally, set `LAB_USER` and `LAB_PASSWORD` in `.env.local`. If either one is empty, `/lab` stays closed and returns a 503. Everything else works without environment variables.

## Credits

This project started as a fork of [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) by Lorant One ([Threads](https://www.threads.net/@lorant.one) · [LinkedIn](https://www.linkedin.com/in/lorant-one/)), built with Once UI. Thank you for the starting point. On October 2–3, 2026 I finished migrating it to my own design system, and it no longer depends on Once UI.

## License

- **Code** is under the [MIT License](LICENSE): use it, adapt it and build on it freely, as long as you keep the copyright notice.
- **Content** (case studies, copy, images, my photo and brand) is © Alan Cisneros, all rights reserved. Case study screenshots and logos belong to their respective companies.
