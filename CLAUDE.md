# VidMetrics — Coding Guidelines

## Project Overview
YouTube competitor analysis tool built with Next.js, Tailwind CSS, and YouTube Data API v3.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **API:** YouTube Data API v3
- **Deployment:** Vercel

## Project Structure
```
src/
  app/            # Next.js App Router pages and API routes
    api/          # Server-side API routes
  components/     # Reusable React components
  lib/            # Utilities and API helpers
docs/
  specs/          # Implementation spec docs for complex features
  CHALLENGE_BRIEF.md  # Original challenge requirements
```

## Coding Conventions

### TypeScript
- Use strict mode — no `any` unless absolutely necessary
- Define interfaces/types in the file where they're primarily used
- Export shared types from `src/lib/` files

### Components
- Use `"use client"` directive only when the component needs client-side interactivity
- Keep components focused — one responsibility per component
- Props should be typed inline or with a named interface for complex cases

### Styling
- Use Tailwind utility classes exclusively — no custom CSS unless unavoidable
- Dark theme: `bg-gray-950` base, `bg-gray-900` cards, `border-gray-800` borders
- Accent color: indigo (`indigo-500`, `indigo-600`)
- Use consistent spacing and rounded corners (`rounded-xl`, `rounded-2xl`)

### API Routes
- All YouTube API calls go through server-side routes (to protect API key)
- Return consistent JSON: `{ channel, videos }` on success, `{ error }` on failure

### Git Workflow
- Commit after every significant change
- Commit messages: imperative mood, concise subject line, body with bullet points for details
- Co-author tag: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

### File Naming
- Components: PascalCase (`ChannelCard.tsx`)
- Utilities: camelCase (`utils.ts`)
- API routes: `route.ts` inside descriptive folders

## Environment Variables
- `YOUTUBE_API_KEY` — stored in `.env.local`, never committed
