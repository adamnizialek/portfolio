# Stack Matcher Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fullstack SaaS app where users describe a project and AI recommends a tech stack, with a public feed and upvoting.

**Architecture:** Next.js 14 App Router handles both frontend and backend (API Routes). PostgreSQL via Prisma stores recommendations and votes. OpenAI GPT-4o-mini generates stack recommendations as structured JSON. NextAuth with GitHub provider handles optional auth (required only for voting).

**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL (Supabase), OpenAI SDK, NextAuth v5, Tailwind CSS, Vitest

---

## Pre-requisites (manual, before starting)

1. Create a new GitHub repository: `stack-matcher`
2. Create a Supabase project at https://supabase.com — note the `DATABASE_URL` (connection string, pooling mode)
3. Register a GitHub OAuth App at https://github.com/settings/developers:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/github`
   - Note `GITHUB_ID` and `GITHUB_SECRET`
4. Get an OpenAI API key at https://platform.openai.com

---

## Task 1: Project Scaffolding

**Files:**
- Create: `stack-matcher/` (new project directory, NOT inside Portfolio)
- Create: `stack-matcher/.env.local`
- Create: `stack-matcher/src/lib/prisma.ts`

**Step 1: Bootstrap Next.js project**

```bash
npx create-next-app@latest stack-matcher \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd stack-matcher
```

**Step 2: Install dependencies**

```bash
npm install prisma @prisma/client next-auth@beta openai
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Step 3: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

**Step 4: Create `.env.local`**

```env
DATABASE_URL="postgresql://..." # from Supabase (Transaction mode, port 6543)
DIRECT_URL="postgresql://..."   # from Supabase (Session mode, port 5432)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"
OPENAI_API_KEY="sk-..."
```

**Step 5: Create Prisma singleton `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Step 6: Configure Vitest — create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Step 7: Create test setup `src/test/setup.ts`**

```typescript
import "@testing-library/jest-dom";
```

**Step 8: Add test script to `package.json`**

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

**Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Prisma, NextAuth, Vitest"
```

---

## Task 2: Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Write the schema**

Replace contents of `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id              String           @id @default(cuid())
  name            String?
  email           String?          @unique
  image           String?
  recommendations Recommendation[]
  votes           Vote[]
  accounts        Account[]
  sessions        Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  access_token      String? @db.Text
  token_type        String?
  scope             String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Recommendation {
  id          String   @id @default(cuid())
  description String
  aiResponse  Json
  voteCount   Int      @default(0)
  createdAt   DateTime @default(now())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  votes       Vote[]
}

model Vote {
  id               String         @id @default(cuid())
  type             String         // "up" | "down"
  userId           String
  recommendationId String
  user             User           @relation(fields: [userId], references: [id])
  recommendation   Recommendation @relation(fields: [recommendationId], references: [id], onDelete: Cascade)

  @@unique([userId, recommendationId])
}
```

**Step 2: Push schema to database**

```bash
npx prisma db push
```

Expected: `Your database is now in sync with your Prisma schema.`

**Step 3: Generate Prisma client**

```bash
npx prisma generate
```

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma schema for recommendations, votes, auth"
```

---

## Task 3: NextAuth Setup

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

**Step 1: Create `src/lib/auth.ts`**

```typescript
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
```

**Step 2: Install PrismaAdapter**

```bash
npm install @auth/prisma-adapter
```

**Step 3: Create API route `src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

**Step 4: Extend session type — create `src/types/next-auth.d.ts`**

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
```

**Step 5: Test auth routes work**

```bash
npm run dev
```

Visit `http://localhost:3000/api/auth/signin` — should see GitHub sign-in button.

**Step 6: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth src/types
git commit -m "feat: add NextAuth with GitHub provider and Prisma adapter"
```

---

## Task 4: AI Recommendation API

**Files:**
- Create: `src/app/api/recommend/route.ts`
- Create: `src/lib/openai.ts`
- Create: `src/test/api/recommend.test.ts`

**Step 1: Write failing test `src/test/api/recommend.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before import
vi.mock("@/lib/prisma", () => ({
  prisma: {
    recommendation: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/openai", () => ({
  generateStackRecommendation: vi.fn(),
}));

import { POST } from "@/app/api/recommend/route";
import { prisma } from "@/lib/prisma";
import { generateStackRecommendation } from "@/lib/openai";

const mockAiResponse = {
  stack: [{ name: "Next.js", role: "Frontend", reason: "Great for SSR" }],
  summary: "A solid modern stack",
  alternatives: ["Remix"],
};

describe("POST /api/recommend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if description is missing", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 if description is too short", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ description: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns recommendation on valid input", async () => {
    vi.mocked(generateStackRecommendation).mockResolvedValue(mockAiResponse);
    vi.mocked(prisma.recommendation.create).mockResolvedValue({
      id: "rec-123",
      description: "A todo app",
      aiResponse: mockAiResponse,
      voteCount: 0,
      createdAt: new Date(),
      userId: null,
    } as any);

    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ description: "A todo app with reminders" }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toBe("rec-123");
    expect(data.aiResponse).toEqual(mockAiResponse);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run src/test/api/recommend.test.ts
```

Expected: FAIL — `Cannot find module '@/app/api/recommend/route'`

**Step 3: Create `src/lib/openai.ts`**

```typescript
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface StackItem {
  name: string;
  role: string;
  reason: string;
}

export interface AiResponse {
  stack: StackItem[];
  summary: string;
  alternatives: string[];
}

const SYSTEM_PROMPT = `You are a senior software architect. Given a project description, recommend the best tech stack.
Respond ONLY with valid JSON in this exact format:
{
  "stack": [
    { "name": "Technology", "role": "What it does in this project", "reason": "Why it's the best choice" }
  ],
  "summary": "One paragraph explaining why this stack works well together for this project",
  "alternatives": ["Alternative1", "Alternative2"]
}
Include 3-6 technologies in the stack. Keep reasons concise (1-2 sentences).`;

export async function generateStackRecommendation(
  description: string
): Promise<AiResponse> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Project: ${description}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty AI response");

  return JSON.parse(content) as AiResponse;
}
```

**Step 4: Create `src/app/api/recommend/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateStackRecommendation } from "@/lib/openai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const description: string = body?.description ?? "";

  if (!description || description.trim().length < 10) {
    return NextResponse.json(
      { error: "Description must be at least 10 characters" },
      { status: 400 }
    );
  }

  const session = await auth();

  try {
    const aiResponse = await generateStackRecommendation(description.trim());

    const recommendation = await prisma.recommendation.create({
      data: {
        description: description.trim(),
        aiResponse,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
```

**Step 5: Run tests to verify they pass**

```bash
npm run test:run src/test/api/recommend.test.ts
```

Expected: PASS (3 tests)

**Step 6: Commit**

```bash
git add src/lib/openai.ts src/app/api/recommend src/test/api/recommend.test.ts
git commit -m "feat: add AI recommendation API with OpenAI integration"
```

---

## Task 5: Feed and Single Recommendation APIs

**Files:**
- Create: `src/app/api/recommendations/route.ts`
- Create: `src/app/api/recommendations/[id]/route.ts`
- Create: `src/test/api/recommendations.test.ts`

**Step 1: Write failing tests `src/test/api/recommendations.test.ts`**

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recommendation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { GET as getFeed } from "@/app/api/recommendations/route";
import { GET as getOne } from "@/app/api/recommendations/[id]/route";
import { prisma } from "@/lib/prisma";

const mockRec = {
  id: "rec-1",
  description: "A habit tracker",
  aiResponse: { stack: [], summary: "test", alternatives: [] },
  voteCount: 3,
  createdAt: new Date(),
  userId: null,
  user: null,
  votes: [],
};

describe("GET /api/recommendations", () => {
  it("returns list of recommendations", async () => {
    vi.mocked(prisma.recommendation.findMany).mockResolvedValue([mockRec] as any);
    const req = new Request("http://localhost/api/recommendations");
    const res = await getFeed(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("accepts sort=top query param", async () => {
    vi.mocked(prisma.recommendation.findMany).mockResolvedValue([mockRec] as any);
    const req = new Request("http://localhost/api/recommendations?sort=top");
    await getFeed(req);
    expect(prisma.recommendation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { voteCount: "desc" },
      })
    );
  });
});

describe("GET /api/recommendations/[id]", () => {
  it("returns 404 for unknown id", async () => {
    vi.mocked(prisma.recommendation.findUnique).mockResolvedValue(null);
    const req = new Request("http://localhost/api/recommendations/unknown");
    const res = await getOne(req, { params: { id: "unknown" } });
    expect(res.status).toBe(404);
  });

  it("returns recommendation for valid id", async () => {
    vi.mocked(prisma.recommendation.findUnique).mockResolvedValue(mockRec as any);
    const req = new Request("http://localhost/api/recommendations/rec-1");
    const res = await getOne(req, { params: { id: "rec-1" } });
    expect(res.status).toBe(200);
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm run test:run src/test/api/recommendations.test.ts
```

Expected: FAIL — modules not found

**Step 3: Create `src/app/api/recommendations/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 20;

  const recommendations = await prisma.recommendation.findMany({
    orderBy: sort === "top" ? { voteCount: "desc" } : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(recommendations);
}
```

**Step 4: Create `src/app/api/recommendations/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const recommendation = await prisma.recommendation.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, image: true } },
      votes: true,
    },
  });

  if (!recommendation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recommendation);
}
```

**Step 5: Run tests to verify they pass**

```bash
npm run test:run src/test/api/recommendations.test.ts
```

Expected: PASS (4 tests)

**Step 6: Commit**

```bash
git add src/app/api/recommendations src/test/api/recommendations.test.ts
git commit -m "feat: add feed and single recommendation API endpoints"
```

---

## Task 6: Vote API

**Files:**
- Create: `src/app/api/vote/route.ts`
- Create: `src/test/api/vote.test.ts`

**Step 1: Write failing test `src/test/api/vote.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    vote: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
    recommendation: {
      update: vi.fn(),
    },
    $transaction: vi.fn((fn: Function) => fn({ vote: { findUnique: vi.fn(), delete: vi.fn(), create: vi.fn() }, recommendation: { update: vi.fn() } })),
  },
}));

import { POST } from "@/app/api/vote/route";
import { auth } from "@/lib/auth";

describe("POST /api/vote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ recommendationId: "rec-1", type: "up" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 if recommendationId is missing", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as any);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ type: "up" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
npm run test:run src/test/api/vote.test.ts
```

Expected: FAIL

**Step 3: Create `src/app/api/vote/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { recommendationId, type } = body;

  if (!recommendationId || !["up", "down"].includes(type)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = session.user.id;

  const existingVote = await prisma.vote.findUnique({
    where: { userId_recommendationId: { userId, recommendationId } },
  });

  if (existingVote) {
    // Toggle: remove vote if same type
    await prisma.vote.delete({ where: { id: existingVote.id } });
    const delta = existingVote.type === "up" ? -1 : 1;
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { voteCount: { increment: delta } },
    });
    return NextResponse.json({ removed: true });
  }

  await prisma.vote.create({ data: { userId, recommendationId, type } });
  await prisma.recommendation.update({
    where: { id: recommendationId },
    data: { voteCount: { increment: type === "up" ? 1 : -1 } },
  });

  return NextResponse.json({ success: true });
}
```

**Step 4: Run tests to verify they pass**

```bash
npm run test:run src/test/api/vote.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/app/api/vote src/test/api/vote.test.ts
git commit -m "feat: add vote API with toggle behavior"
```

---

## Task 7: Home Page — Form + Generate

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/StackCard.tsx`
- Create: `src/components/RecommendForm.tsx`

**Step 1: Create `src/components/StackCard.tsx`**

```typescript
import { StackItem } from "@/lib/openai";

interface Props {
  item: StackItem;
}

export function StackCard({ item }: Props) {
  return (
    <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-white">{item.name}</h3>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
          {item.role}
        </span>
      </div>
      <p className="text-sm text-zinc-400">{item.reason}</p>
    </div>
  );
}
```

**Step 2: Create `src/components/RecommendForm.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StackCard } from "./StackCard";
import { AiResponse } from "@/lib/openai";

export function RecommendForm() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; aiResponse: AiResponse } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Describe your project in a few sentences... e.g. 'A real-time chat app for remote teams with file sharing and search'"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading || description.trim().length < 10}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Matching your stack..." : "Match my stack →"}
        </button>
      </form>

      {result && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(result.aiResponse.stack ?? []).map((item) => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            {result.aiResponse.summary}
          </p>
          {result.aiResponse.alternatives?.length > 0 && (
            <p className="text-zinc-500 text-xs">
              Alternatives: {result.aiResponse.alternatives.join(", ")}
            </p>
          )}
          <button
            onClick={() => router.push(`/r/${result.id}`)}
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline"
          >
            View shareable link →
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Update `src/app/page.tsx`**

```typescript
import { RecommendForm } from "@/components/RecommendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 pt-20 pb-16">
      <h1 className="text-4xl font-bold mb-3 tracking-tight">Stack Matcher</h1>
      <p className="text-zinc-400 text-center mb-10 max-w-md">
        Describe your project. Get the perfect tech stack — recommended by AI, validated by developers.
      </p>
      <RecommendForm />
      <a href="/feed" className="mt-12 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
        Browse community stacks →
      </a>
    </main>
  );
}
```

**Step 4: Test in browser**

```bash
npm run dev
```

Visit `http://localhost:3000`, type a project description, click generate. Verify stack cards render.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/RecommendForm.tsx src/components/StackCard.tsx
git commit -m "feat: add home page with recommendation form and result display"
```

---

## Task 8: Recommendation Detail Page `/r/[id]`

**Files:**
- Create: `src/app/r/[id]/page.tsx`
- Create: `src/components/VoteButtons.tsx`

**Step 1: Create `src/components/VoteButtons.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  recommendationId: string;
  initialVotes: number;
  userVote: "up" | "down" | null;
}

export function VoteButtons({ recommendationId, initialVotes, userVote }: Props) {
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function vote(type: "up" | "down") {
    setLoading(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, type }),
      });

      if (res.status === 401) {
        router.push("/api/auth/signin");
        return;
      }

      const data = await res.json();
      if (data.removed) {
        setVotes((v) => v + (currentVote === "up" ? -1 : 1));
        setCurrentVote(null);
      } else {
        setVotes((v) => v + (type === "up" ? 1 : -1));
        setCurrentVote(type);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => vote("up")}
        disabled={loading}
        className={`text-2xl transition-opacity ${currentVote === "up" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        ▲
      </button>
      <span className="text-lg font-semibold text-white">{votes}</span>
      <button
        onClick={() => vote("down")}
        disabled={loading}
        className={`text-2xl transition-opacity ${currentVote === "down" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        ▼
      </button>
    </div>
  );
}
```

**Step 2: Create `src/app/r/[id]/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StackCard } from "@/components/StackCard";
import { VoteButtons } from "@/components/VoteButtons";
import { AiResponse } from "@/lib/openai";
import { CopyLinkButton } from "@/components/CopyLinkButton";

interface Props {
  params: { id: string };
}

export default async function RecommendationPage({ params }: Props) {
  const [recommendation, session] = await Promise.all([
    prisma.recommendation.findUnique({
      where: { id: params.id },
      include: { votes: true, user: { select: { name: true } } },
    }),
    auth(),
  ]);

  if (!recommendation) notFound();

  const aiResponse = recommendation.aiResponse as AiResponse;
  const userVote = session?.user?.id
    ? recommendation.votes.find((v) => v.userId === session.user.id)?.type as "up" | "down" | undefined
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 pt-16 pb-20">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block">
          ← Back to home
        </a>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <p className="text-zinc-300 text-sm mb-4 italic">"{recommendation.description}"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {aiResponse.stack.map((item) => (
              <StackCard key={item.name} item={item} />
            ))}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{aiResponse.summary}</p>
          {aiResponse.alternatives?.length > 0 && (
            <p className="text-zinc-600 text-xs mb-4">
              Alternatives: {aiResponse.alternatives.join(", ")}
            </p>
          )}
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <VoteButtons
              recommendationId={recommendation.id}
              initialVotes={recommendation.voteCount}
              userVote={userVote ?? null}
            />
            <CopyLinkButton />
          </div>
        </div>
      </div>
    </main>
  );
}
```

**Step 3: Create `src/components/CopyLinkButton.tsx`**

```typescript
"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="text-sm text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
```

**Step 4: Test in browser**

Navigate to a generated recommendation link. Verify stack cards and vote buttons appear.

**Step 5: Commit**

```bash
git add src/app/r src/components/VoteButtons.tsx src/components/CopyLinkButton.tsx
git commit -m "feat: add recommendation detail page with voting and copy link"
```

---

## Task 9: Feed Page `/feed`

**Files:**
- Create: `src/app/feed/page.tsx`
- Create: `src/components/FeedCard.tsx`

**Step 1: Create `src/components/FeedCard.tsx`**

```typescript
import { AiResponse } from "@/lib/openai";
import Link from "next/link";

interface Props {
  id: string;
  description: string;
  aiResponse: AiResponse;
  voteCount: number;
  createdAt: string;
}

export function FeedCard({ id, description, aiResponse, voteCount, createdAt }: Props) {
  const techNames = aiResponse.stack?.map((s) => s.name) ?? [];

  return (
    <Link
      href={`/r/${id}`}
      className="block bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-colors"
    >
      <p className="text-zinc-300 text-sm mb-3 line-clamp-2">"{description}"</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {techNames.map((name) => (
          <span
            key={name}
            className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-zinc-600 text-xs">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <span>▲ {voteCount}</span>
      </div>
    </Link>
  );
}
```

**Step 2: Create `src/app/feed/page.tsx`**

```typescript
import { prisma } from "@/lib/prisma";
import { FeedCard } from "@/components/FeedCard";
import { AiResponse } from "@/lib/openai";

interface Props {
  searchParams: { sort?: string };
}

export default async function FeedPage({ searchParams }: Props) {
  const sort = searchParams.sort === "top" ? "top" : "latest";

  const recommendations = await prisma.recommendation.findMany({
    orderBy: sort === "top" ? { voteCount: "desc" } : { createdAt: "desc" },
    take: 30,
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 pt-16 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Community Stacks</h1>
          <div className="flex gap-2 text-sm">
            <a
              href="/feed"
              className={`px-3 py-1 rounded-full ${sort === "latest" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Latest
            </a>
            <a
              href="/feed?sort=top"
              className={`px-3 py-1 rounded-full ${sort === "top" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Top
            </a>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-zinc-500 text-center py-20">
            No stacks yet. <a href="/" className="text-indigo-400 hover:underline">Be the first!</a>
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <FeedCard
                key={rec.id}
                id={rec.id}
                description={rec.description}
                aiResponse={rec.aiResponse as AiResponse}
                voteCount={rec.voteCount}
                createdAt={rec.createdAt.toISOString()}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

**Step 3: Test in browser**

Visit `http://localhost:3000/feed`. Generate a few stacks from home page first. Verify cards appear with tech tags.

**Step 4: Commit**

```bash
git add src/app/feed src/components/FeedCard.tsx
git commit -m "feat: add public feed with latest/top sorting"
```

---

## Task 10: Navbar + Layout Polish

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Navbar.tsx`

**Step 1: Create `src/components/Navbar.tsx`**

```typescript
import { auth } from "@/lib/auth";
import Link from "next/link";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-white tracking-tight">
          Stack Matcher
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/feed" className="text-zinc-400 hover:text-white transition-colors">
            Feed
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
              <a
                href="/api/auth/signout"
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/signin"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              Sign in with GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Update `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Matcher — AI Tech Stack Recommender",
  description: "Describe your project, get the perfect tech stack recommended by AI and voted on by developers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-zinc-950`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Test the full flow**

1. Visit `http://localhost:3000`
2. Generate a stack recommendation
3. Click the shareable link
4. Sign in with GitHub
5. Vote on a recommendation
6. Check `/feed` — card appears with correct tech tags

**Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/app/layout.tsx
git commit -m "feat: add navbar with auth state and layout polish"
```

---

## Task 11: Deploy

**Step 1: Push to GitHub**

```bash
git push -u origin main
```

**Step 2: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Import your `stack-matcher` GitHub repo
3. Set environment variables (all from `.env.local`):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_URL` (set to your Vercel URL, e.g. `https://stack-matcher.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `OPENAI_API_KEY`
4. Click Deploy

**Step 3: Update GitHub OAuth App**

Update the callback URL in GitHub OAuth settings to:
`https://stack-matcher.vercel.app/api/auth/callback/github`

**Step 4: Test production**

Visit your Vercel URL. Generate a recommendation. Vote. Verify feed.

---

## Task 12: Add to Portfolio

**Files:**
- Modify: `C:/Users/patry/Desktop/Adam/Portfolio/src/data/projects.ts`

**Step 1: Update the placeholder third project**

Replace the "Projekt Trzeci" entry with:

```typescript
{
  id: "project-3",
  title: "Stack Matcher",
  description:
    "Narzędzie SaaS, które na podstawie opisu projektu rekomenduje optymalny tech stack z pomocą AI. Użytkownicy mogą przeglądać i głosować na rekomendacje społeczności.",
  tags: ["Next.js", "OpenAI", "PostgreSQL", "Prisma", "NextAuth"],
  liveUrl: "https://stack-matcher.vercel.app",
  githubUrl: "https://github.com/adamnizialek/stack-matcher",
},
```

**Step 2: Commit to portfolio**

```bash
cd C:/Users/patry/Desktop/Adam/Portfolio
git add src/data/projects.ts
git commit -m "feat: add Stack Matcher to portfolio projects"
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Project setup + Vitest | 30 min |
| 2 | Prisma schema + DB push | 20 min |
| 3 | NextAuth + GitHub OAuth | 20 min |
| 4 | AI recommendation API | 30 min |
| 5 | Feed + single rec APIs | 20 min |
| 6 | Vote API | 20 min |
| 7 | Home page + form | 30 min |
| 8 | Recommendation detail page | 30 min |
| 9 | Feed page | 20 min |
| 10 | Navbar + layout | 20 min |
| 11 | Deploy to Vercel | 20 min |
| 12 | Add to portfolio | 5 min |
| **Total** | | **~5 hours** |
