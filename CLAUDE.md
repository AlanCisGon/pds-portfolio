# CLAUDE.md — AI Assistant Guide for pds-portfolio

This document provides context and conventions for AI assistants working on this codebase.

---

## Project Overview

**alancisneros.design** is a personal portfolio for Alan Cisneros, a Product Experience Strategist / UX Designer. It is built on the [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) template by Lorant One, customized with original architecture, components, styling, and content.

**Live URL:** `https://alancisneros.design/`
**License:** CC BY-NC 4.0

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI System | Once-UI (`@once-ui-system/core`) |
| Styling | SCSS + CSS Variables |
| Content | MDX via `@next/mdx` + `next-mdx-remote` |
| Front Matter | `gray-matter` |
| Fonts | Figtree (body/headings), Azeret Mono (code) |
| Analytics | Vercel Analytics + Speed Insights |
| Linting/Formatting | Biome + ESLint |
| Pre-commit Hooks | lint-staged |

---

## Repository Structure

```
pds-portfolio/
├── public/
│   ├── images/
│   │   ├── projects/       # Case study images
│   │   ├── gallery/        # Gallery portfolio images
│   │   └── og/             # Open Graph metadata images
│   └── trademarks/         # Brand assets
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout (theme, fonts, analytics, RouteGuard)
│   │   ├── not-found.tsx   # 404 page
│   │   ├── robots.ts       # SEO robots config
│   │   ├── sitemap.ts      # Dynamic XML sitemap
│   │   ├── about/          # About page
│   │   ├── work/
│   │   │   ├── page.tsx           # Work listing
│   │   │   ├── [slug]/page.tsx    # Individual project page
│   │   │   └── projects/          # MDX project files (*.mdx)
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog listing
│   │   │   ├── [slug]/page.tsx    # Individual blog post
│   │   │   └── posts/             # MDX blog post files (*.mdx)
│   │   ├── gallery/        # Portfolio gallery page
│   │   └── api/
│   │       ├── authenticate/  # Password-based auth
│   │       ├── check-auth/    # Auth cookie verification
│   │       ├── og/            # Open Graph generation, fetch, proxy
│   │       └── rss/           # RSS feed
│   ├── components/         # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── mdx.tsx         # MDX component overrides
│   │   ├── ProjectCard.tsx
│   │   ├── Mailchimp.tsx
│   │   ├── work/           # Work-section components
│   │   ├── blog/           # Blog-section components
│   │   ├── gallery/        # Gallery components
│   │   └── about/          # About page components
│   ├── resources/
│   │   ├── once-ui.config.ts  # Site-wide configuration (theme, routes, effects)
│   │   ├── content.tsx        # All portfolio content data
│   │   ├── icons.ts           # Icon definitions
│   │   └── index.ts           # Re-exports
│   ├── types/
│   │   ├── config.types.ts    # Config type definitions
│   │   ├── content.types.ts   # Content/data type definitions
│   │   └── index.ts           # Type exports
│   └── utils/
│       ├── utils.ts           # MDX reading, slug generation
│       └── formatDate.ts      # Date formatting with relative time
├── biome.json             # Biome formatter & linter config
├── next.config.mjs        # Next.js config (MDX, remote images, SASS)
├── tsconfig.json          # TypeScript config (strict, path alias @/*)
├── .eslintrc.json         # ESLint config (next/core-web-vitals)
├── .lintstagedrc.js       # Pre-commit Biome hooks
└── .env.example           # Environment variable template
```

---

## Key Configuration Files

### `src/resources/once-ui.config.ts`
The main site configuration. Controls:
- **Base URL** — used for sitemap, OG images, canonical links
- **Theme** — default theme, color tokens (brand: violet, accent: indigo, neutral: slate)
- **Routes** — enable/disable `/blog` and `/gallery` sections
- **Password protection** — which routes require a password
- **Visual effects** — background gradient, mask, dots/grid/lines
- **Mailchimp** — newsletter form integration URL

### `src/resources/content.tsx`
All portfolio content as typed data structures. Sections include:
- `person` — name, role, location, timezone, social links
- `home` — headline, featured work, newsletter toggle
- `about` — intro, work experience, education, skills, ToC, avatar
- `work` — projects listing label
- `blog` — blog listing label
- `gallery` — image list

**This is the primary file to edit for content changes.** Do not hardcode strings into page components.

### `src/types/`
TypeScript interfaces that mirror the shape of `content.tsx` and `once-ui.config.ts`. Always update types if adding new content fields.

---

## Content Authoring (MDX)

### Work / Projects
Files live in `src/app/work/projects/*.mdx`.

Required front matter:
```yaml
---
title: "Project Title"
publishedAt: "YYYY-MM-DD"
summary: "One-sentence description shown in card previews"
images:
  - "/images/projects/image.jpg"
team:
  - name: "Alan Cisneros"
    role: "UX Team Lead"
    avatar: "/images/avatar.jpg"
    linkedIn: "https://linkedin.com/in/..."
---
```

### Blog Posts
Files live in `src/app/blog/posts/*.mdx`.

Required front matter:
```yaml
---
title: "Post Title"
publishedAt: "YYYY-MM-DD"
summary: "Short description"
tag: "Category"
---
```

### Routing by Slug
Slugs are auto-generated from file names (without extension) using `getMDXFiles()` + `formatSlug()` in `src/utils/utils.ts`. File name = URL slug.

---

## Routing

| Path | Source | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page |
| `/about` | `src/app/about/` | About page |
| `/work` | `src/app/work/page.tsx` | Project listing |
| `/work/[slug]` | `src/app/work/[slug]/page.tsx` | MDX project detail |
| `/blog` | `src/app/blog/page.tsx` | Blog listing (can be disabled) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | MDX post detail |
| `/gallery` | `src/app/gallery/` | Gallery (can be disabled) |
| `/api/authenticate` | POST — sets auth cookie | Password route protection |
| `/api/check-auth` | GET — verifies cookie | Used by RouteGuard |
| `/api/og/*` | GET — returns OG image | Open Graph generation |
| `/api/rss` | GET — XML feed | RSS/Atom feed |

**Enable/disable routes** in `once-ui.config.ts` under `routes`:
```ts
routes: {
  blog: false,   // set true to enable /blog
  gallery: false // set true to enable /gallery
}
```

---

## Theme System

- Default theme: `dark` (set in `once-ui.config.ts`)
- Supported themes: `light`, `dark`, `system`
- Theme is persisted in `localStorage` and applied via CSS classes on `<html>`
- `suppressHydrationWarning` is used on `<html>` in `layout.tsx` to prevent hydration mismatch
- Color tokens are CSS variables from Once-UI; do not hardcode colors

---

## Authentication / Password Protection

- Environment variable: `PAGE_ACCESS_PASSWORD` (see `.env.example`)
- Set password-protected paths in `once-ui.config.ts` under `protectedRoutes`
- `RouteGuard` component (in `src/components/`) checks `/api/check-auth` on navigation
- Auth cookie is `httpOnly`, `secure`, `sameSite=strict`

---

## Styling Conventions

- **Do not use inline styles** for layout or theming — use Once-UI component props or CSS variables
- SCSS files use the `modern` sass compiler (configured in `next.config.mjs`)
- Custom global styles: `src/resources/custom.css`
- Spacing, typography, and color tokens come from Once-UI — prefer those over custom values
- `classnames` (imported as `cn`) is available for conditional class composition

---

## Code Conventions

### TypeScript
- Strict mode is **on** — no `any` unless unavoidable
- Path alias `@/*` maps to `src/*` — always use this for imports
- Keep types in `src/types/` — do not inline complex types in components

### Formatting
- **Biome** is the canonical formatter; run `npm run biome-write` to auto-format
- Indent: 2 spaces | Line width: 100 chars | Quotes: double
- Biome runs automatically on staged files via lint-staged (pre-commit)
- Do not mix `prettier` config — Biome is the only formatter

### Imports
- Use `@/` prefix for all internal imports: `import { ... } from "@/components/Header"`
- Group imports: external libs → internal components → local utils/types

### Components
- Functional components with explicit `React.FC` or typed props interfaces
- Server Components by default (App Router); add `"use client"` only when needed
- Collocate page-specific components in their feature folder (e.g., `components/blog/`)

---

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env.local
# Set PAGE_ACCESS_PASSWORD if needed
npm run dev
```

### Common Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Serve production build
npm run export       # Static HTML export
npm run biome-write  # Auto-format all files
npm run lint         # Run ESLint
```

### No Test Suite
There is currently no automated test setup (no Jest, Vitest, Playwright, or Cypress). Quality is enforced via:
- TypeScript strict-mode compilation
- Biome linting + formatting
- ESLint (next/core-web-vitals rules)

---

## Adding Content

### New Project Case Study
1. Create `src/app/work/projects/my-project.mdx` with required front matter
2. Add project images to `public/images/projects/`
3. Optionally reference the project in `src/resources/content.tsx` for the home page featured work section

### New Blog Post
1. Create `src/app/blog/posts/my-post.mdx` with required front matter
2. Ensure `routes.blog = true` in `once-ui.config.ts`

### Updating Personal Info / Copy
Edit `src/resources/content.tsx`. All page text originates there.

---

## Deployment

- Deployed on **Vercel**, project `pds-portfolio-kf16`, connected to GitHub (`AlanCisGon/pds-portfolio`)
- `main` → **production** (`alancisneros.design`, `www.alancisneros.design`)
- `dev` → **preview / low-controlled environment** (`dev-alancisneros.vercel.app`, also `pds-portfolio-kf16-git-dev-alan-cisneros-projects.vercel.app`)
- Every other pushed branch / PR gets its own Vercel preview URL
- Vercel blocks deploys with known-vulnerable dependencies (e.g. CVE checks on `next-mdx-remote`); check build logs when a deploy ends in `ERROR` even though `next build` passed
- `next export` is available for static hosting
- Remote image domains allowed: `google.com` (configured in `next.config.mjs`)
- No external API keys required for core functionality

### Environment Variables
| Variable | Description | Required |
|---|---|---|
| `PAGE_ACCESS_PASSWORD` | Password for protected routes | Only if using password protection |

---

## Git Workflow

- **Main branch:** `main` — production. Every merge deploys to `alancisneros.design`; only merge via PR.
- **Development branch:** `dev` — long-lived, low-controlled environment for validating changes on a Vercel preview before production. Do not delete it.
- Feature branches: `feat/…`, `fix/…`, `docs/…`, or `claude/<description>-<id>` (for AI-assisted work). Branch from `main`, delete after merge.
- Flow: feature branch → PR (Vercel preview) → optionally merge into `dev` to test in the shared preview → PR to `main` → production.
- **Merge with squash only** (`gh pr merge <n> --squash --delete-branch`). The `Claude Protection` ruleset requires linear history on `main`, so merge commits (`--merge`) are rejected. It also requires a successful `Preview` deployment, which every PR gets from Vercel before merging.
- Keep `dev` in sync with `main` after releases (`git push origin main:dev` when `dev` has no unmerged work).
- Commits are GPG-signed via SSH; the CI environment handles signing
- Follow conventional commit format: `type(scope): description`
  - Examples: `fix(content): update project summary`, `feat(blog): add new post`

---

## Things to Avoid

- Do not modify `package-lock.json` manually
- Do not add `prettier` — Biome is the formatter
- Do not hardcode color values; use Once-UI CSS tokens
- Do not hardcode page copy in components; put it in `content.tsx`
- Do not add dependencies without checking if Once-UI already provides the functionality
- Do not commit `.env.local` — it is gitignored
- Do not enable `routes.blog` or `routes.gallery` unless intentionally making those sections public
