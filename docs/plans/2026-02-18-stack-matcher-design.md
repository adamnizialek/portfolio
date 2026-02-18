# Stack Matcher — Design Document
**Date:** 2026-02-18

## Overview

Stack Matcher is a small fullstack SaaS tool for portfolio. Users describe their project idea in plain text, and AI recommends an optimal tech stack with reasoning. Recommendations are public — others can browse and upvote them.

## Goals

- Showcase fullstack skills (Next.js, PostgreSQL, AI integration, Auth)
- Demonstrate creative use of LLMs in a developer-focused tool
- Complete in 1-2 weeks

## Scope (MVP)

**In scope:**
- Text input → AI generates stack recommendation
- Shareable link for each recommendation (`/r/[id]`)
- Public feed of recommendations (Latest / Top)
- Upvote/downvote (requires GitHub login)
- Optional GitHub login via NextAuth (needed for voting and history)

**Out of scope:**
- Comments, tags, categories, stack comparisons

## Architecture

```
Next.js 14 (App Router)
  ├── Frontend (React components)
  ├── API Routes (backend logic)
  ├── PostgreSQL via Prisma ORM
  ├── OpenAI API (GPT-4o-mini)
  └── NextAuth (GitHub OAuth)

Hosting: Vercel + Supabase (PostgreSQL)
```

## Data Model (Prisma)

```prisma
model Recommendation {
  id          String   @id @default(cuid())
  description String
  aiResponse  Json
  createdAt   DateTime @default(now())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  votes       Vote[]
}

model User {
  id              String           @id @default(cuid())
  name            String?
  image           String?
  githubId        String           @unique
  recommendations Recommendation[]
  votes           Vote[]
}

model Vote {
  id               String         @id @default(cuid())
  type             String         // "up" | "down"
  userId           String
  recommendationId String
  user             User           @relation(fields: [userId], references: [id])
  recommendation   Recommendation @relation(fields: [recommendationId], references: [id])

  @@unique([userId, recommendationId])
}
```

## AI Response Format

```json
{
  "stack": [
    {
      "name": "Next.js",
      "role": "Frontend + Backend",
      "reason": "Best for fullstack React apps with SSR and API routes built-in"
    }
  ],
  "summary": "A concise explanation of why this stack fits the project",
  "alternatives": ["Nuxt.js", "SvelteKit"]
}
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — textarea + generate button |
| `/r/[id]` | Recommendation detail (shareable link) |
| `/feed` | Public feed sorted by Latest or Top |

## UX Flow

1. User enters project description on `/`
2. Clicks "Match my stack" → loading state
3. AI response renders inline (stack cards + summary)
4. User can "Save & share" (anonymous link or logged-in saved)
5. `/r/[id]` shows: stack cards, summary, alternatives, vote buttons, copy-link button
6. `/feed` shows card previews with project description + tech tags + vote count

## Error Handling

- Empty input → client-side validation, disabled button
- AI timeout → error message with retry option
- Auth required for voting → redirect to GitHub login

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/recommend` | Generate AI recommendation |
| GET | `/api/recommendations` | Fetch feed (query: sort, page) |
| GET | `/api/recommendations/[id]` | Fetch single recommendation |
| POST | `/api/vote` | Cast or remove vote (auth required) |
