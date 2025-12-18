# Riftbound Card Price Search

A Next.js app for searching Riftbound cards, viewing card details, and jumping to card pages directly from typeahead suggestions. The app supports light/dark themes, keyboard navigation for search suggestions, and a global header search. Tailwind (v4) and shadcn/ui are set up for rapid styling.

## Features
- Card search with debounced suggestions, keyboard navigation, and click/outside-to-close behavior
- Card detail pages per set/collector number
- Theme toggle (light/dark) with persisted preference
- Shared search bar in the global header and home page
- Tailwind CSS v4 with custom design tokens, plus shadcn/ui (neutral base) ready for components

## Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui with class-variance-authority, radix slot, tailwind-merge
- TypeScript

## Scripts
- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm start` – start the production server
- `npm run lint` – lint the project

## Setup
1) Install dependencies:
```bash
npm install
```
2) Run the dev server:
```bash
npm run dev
```
3) Open http://localhost:3000.

## Project Structure (high level)
- `app/` – routes and UI
  - `page.tsx` – home search page
  - `cards/[slug]/page.tsx` – card detail page
  - `components/` – shared UI (search form, header, etc.)
- `components/ui/` – shadcn/ui components (e.g., `button.tsx`)
- `lib/utils.ts` – `cn` helper for class merging
- `app/globals.css` – Tailwind + design tokens, background styles

## Styling & Theming
- Tailwind v4 with custom CSS variables (`--bg`, `--panel`, etc.) for light/dark themes
- shadcn/ui initialized with neutral base color; uses updated tokens in `globals.css`
- Use `cn` from `lib/utils` to merge class names

## Using shadcn/ui
- Example button: `import { Button } from "@/components/ui/button";`
- Generate components: `npx shadcn@latest add <component>` (see `components.json` for config)

## Notes
- Search suggestions close on selection and on outside click
- Selecting a card navigates to `/cards/{set}-{collector}` and clears the search box
- Background imagery and gradients come from `globals.css`
