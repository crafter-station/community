# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

A Next.js 16 application using the App Router, TypeScript, and Tailwind CSS 4.

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Library**: React 19

## Directory Structure

```
src/
└── app/                    # Next.js App Router pages and layouts
    ├── page.tsx            # Route pages (default export)
    ├── layout.tsx          # Layout components
    ├── globals.css         # Global styles
    └── [route]/            # Nested routes follow same pattern
public/                     # Static assets (images, fonts, etc.)
```

## Commands

### Package Management (Bun)

```bash
bun install                 # Install dependencies
bun add <package>           # Add a dependency
bun add -d <package>        # Add a dev dependency
bun remove <package>        # Remove a dependency
```

### Development

```bash
bun dev                     # Start development server (port 3000)
bun run build               # Production build
bun start                   # Start production server
```

### Linting

```bash
bun lint                    # Run ESLint on the codebase
bun lint --fix              # Run ESLint with auto-fix
```

### Testing

No test framework is currently configured. When adding tests:

- Recommended: Vitest for unit tests, Playwright for E2E
- Run single test: `bun test <file>` or `bunx vitest run <file>`
- Run all tests: `bun test`

## Code Style Guidelines

### TypeScript

- **Strict mode is enabled** - Do not use `any` type; properly type all values
- Use `import type` for type-only imports:
  ```typescript
  import type { Metadata } from "next";
  import { useState } from "react";
  ```
- Prefer `type` over `interface` for type definitions
- Use `Readonly<>` utility type for component props

### Imports

Order imports as follows:

1. React/framework imports (`react`, `next/*`)
2. External library imports
3. Internal imports using path alias (`@/*`)
4. Relative imports (`./`, `../`)
5. Style imports (`.css` files)

```typescript
import type { Metadata } from "next";
import { useState, useEffect } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import "./styles.css";
```

**Path alias**: Use `@/` to import from `src/`:
```typescript
import { utils } from "@/lib/utils";  // resolves to src/lib/utils
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `UserProfile`, `NavBar` |
| Files (components) | kebab-case or same as component | `user-profile.tsx` |
| Files (routes) | lowercase Next.js conventions | `page.tsx`, `layout.tsx` |
| Variables/functions | camelCase | `getUserData`, `isLoading` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Types/Interfaces | PascalCase | `UserData`, `ApiResponse` |
| CSS variables | kebab-case with `--` prefix | `--font-geist-sans` |

### React Components

- Use function components with default exports for pages/layouts:
  ```typescript
  export default function Home() {
    return <div>...</div>;
  }
  ```
- Components are **Server Components by default**
- Add `"use client"` directive only when needed (hooks, browser APIs, event handlers):
  ```typescript
  "use client";

  import { useState } from "react";

  export function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  ```
- Use named exports for non-page components

### Styling with Tailwind CSS 4

- Use utility classes directly in JSX:
  ```tsx
  <div className="flex min-h-screen items-center justify-center">
  ```
- Global styles go in `src/app/globals.css`
- Use CSS custom properties for theming:
  ```css
  :root {
    --background: #ffffff;
    --foreground: #171717;
  }
  ```
- Dark mode uses `prefers-color-scheme` or class-based approach

### Error Handling

- Use Next.js error boundaries with `error.tsx` files
- Handle async errors in Server Components with try/catch
- Use `loading.tsx` for loading states
- Use `not-found.tsx` for 404 pages

```typescript
// src/app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Data Fetching

- Fetch data in Server Components when possible
- Use React Server Actions for mutations
- Avoid `useEffect` for data fetching; prefer server-side patterns

```typescript
// Server Component - preferred
async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);
  return <UserProfile user={user} />;
}
```

## ESLint Configuration

Uses ESLint 9 flat config with:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Key rules enforced:
- React hooks rules
- Next.js best practices
- TypeScript strict checks

## File Creation Guidelines

### New Pages

Create `page.tsx` in the appropriate route directory:
```
src/app/dashboard/page.tsx     -> /dashboard
src/app/users/[id]/page.tsx    -> /users/:id
```

### New Components

- Shared components: `src/components/`
- Feature-specific: `src/app/[feature]/components/`
- UI primitives: `src/components/ui/`

### New API Routes

Create `route.ts` in `src/app/api/`:
```
src/app/api/users/route.ts     -> /api/users
```

## Common Patterns

### Metadata

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Dynamic Routes

```typescript
// src/app/posts/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

### Server Actions

```typescript
// src/app/actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  // ... database operation
}
```

## Gotchas

1. **Server vs Client Components**: Don't import client components into server components without proper boundaries
2. **Params in Next.js 16**: Route params are now Promises and must be awaited
3. **Tailwind CSS 4**: Uses `@import "tailwindcss"` syntax, not `@tailwind` directives
4. **Bun**: Use `bun` commands, not `npm` or `yarn`
