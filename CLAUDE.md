# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read Next.js docs before writing code

This project uses Next.js 16, which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code, and heed deprecation notices.

## Commands

```bash
npm run dev       # start dev server on http://localhost:3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # run ESLint
npx tsc --noEmit  # type-check without building
```

No test runner is configured yet.

## Architecture

This is a **Next.js 16 App Router** project with TypeScript, Tailwind CSS v4, and ESLint.

- All source code lives under `src/`
- The `@/*` path alias maps to `src/*`
- `src/app/` is the App Router root — `layout.tsx` wraps every page, `page.tsx` is the index route
- Tailwind is configured via CSS (`src/app/globals.css` uses `@import "tailwindcss"` and `@theme inline`) rather than a JS config file — this is the Tailwind v4 approach
- Fonts (Geist Sans and Geist Mono) are loaded via `next/font/google` and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`) on `<html>`
- ESLint uses the flat config format (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- All components are React Server Components by default; add `"use client"` only when browser APIs or interactivity are needed
