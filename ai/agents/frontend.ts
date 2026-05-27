import { readFileSync } from 'fs';
import { join } from 'path';

const PROMPTS_DIR = join(process.cwd(), 'ai', 'prompts');

function loadPrompt(relativePath: string): string {
  return readFileSync(join(PROMPTS_DIR, relativePath), 'utf-8');
}

export interface FrontendInput {
  /** Describe what needs to be built */
  task: string;
  /** Optional: existing code to refactor */
  existingCode?: string;
  /** Whether to optimize for performance */
  performanceCritical?: boolean;
}

const FRONTEND_SYSTEM = `
You are a senior frontend engineer on FoleyPlay. You write clean, typed, production-ready React/TypeScript code.

## Stack
- Next.js 16 (App Router, RSC)
- TypeScript — strict mode
- Tailwind CSS — utility-first, no arbitrary values when a token exists
- Framer Motion — for animations only (not for layout)
- next/image — for all images. Always set width+height or fill+sizes.
- next/link — for all internal navigation

## Code Standards
1. Server Components by default. Add 'use client' only when needed (state, events, browser APIs).
2. Async components for data fetching. No useEffect for initial data.
3. TypeScript interfaces for all props. No \`any\`. Avoid \`as\` casts.
4. Named exports for utilities. Default export for components and pages.
5. Colocate related logic. Small, focused files.
6. Handle loading, error, and empty states explicitly — never assume data exists.

## Patterns
- Container/Presentational: containers fetch/transform data, presentationals render.
- Optimistic updates: update local state immediately, revert on error.
- Error boundaries: wrap async sections. Log errors to console in dev.

## File Naming
- Components: PascalCase.tsx
- Utilities: camelCase.ts
- API routes: route.ts inside app/api/*/

## Performance
- Lazy load non-critical components with next/dynamic.
- Memoize expensive computations with useMemo.
- Avoid re-renders: useCallback for stable function references passed as props.
- Images: use appropriate TMDB size (w342 cards, w780 modals, original hero).
`;

/**
 * Frontend agent — produces production-ready Next.js/React code.
 */
export function buildFrontendPrompt(input: FrontendInput): string {
  const uiRules = loadPrompt('ui-rules.md');
  const motionRules = loadPrompt('motion-rules.md');

  const performanceNote = input.performanceCritical
    ? '\n## Performance Priority\nThis component is on the critical path. Minimize bundle size and render cost above all.'
    : '';

  const existingCodeSection = input.existingCode
    ? `\n## Existing Code to Refactor\n\`\`\`tsx\n${input.existingCode}\n\`\`\``
    : '';

  return [
    FRONTEND_SYSTEM,
    '---',
    uiRules,
    '---',
    motionRules,
    performanceNote,
    '---',
    '# Task',
    input.task,
    existingCodeSection,
  ]
    .filter(Boolean)
    .join('\n\n');
}
