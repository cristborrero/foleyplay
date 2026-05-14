# Skill Registry

## Project Standards (auto-resolved)

### Next.js Best Practices
- **Middleware**: In Next.js 16, `middleware.ts` is renamed to `proxy.ts`.
- **Async APIs**: `params`, `searchParams`, `cookies()`, and `headers()` are async in Next.js 15+.
- **Images**: Always use `next/image` with proper `remotePatterns` in `next.config.ts`.
- **Error Handling**: Use `error.tsx` and `notFound()` for routing errors.

### Tailwind CSS v4
- **Engine**: Uses Lightning CSS.
- **Config**: Configured via CSS variables or `tailwind.config.js` (if legacy).
- **Utilities**: Prefers standardized theme utilities (e.g., `bg-accent`).

### MongoDB / Mongoose
- **Naming**: Use `snake_case` for database fields (matching TMDB) or normalize in models.
- **Connection**: Ensure singleton pattern for Mongoose connections in Next.js.

## User Skills

| Skill | Trigger |
|-------|---------|
| accessibility | "improve accessibility", "a11y audit", "WCAG compliance" |
| next-best-practices | Writing Next.js components, route handlers, or layouts |
| tailwind-css-patterns | Styling with Tailwind CSS v4 |
| nodejs-best-practices | Backend logic, API design, async patterns |
| seo | "improve SEO", "fix meta tags", "structured data" |
| next-cache-components | Using `use cache`, PPR, or `cacheLife` |

## Compact Rules

### nextjs-16-conventions
- Use `proxy.ts` for middleware.
- Await `params` and `searchParams` in Pages and Layouts.
- Use `use cache` directive for fine-grained caching.

### tailwind-v4-styling
- Use theme variables: `var(--color-*)`.
- Avoid arbitrary values if a theme token exists.
- Leverage `@theme` block in CSS for custom tokens.

### foleyplay-image-normalization
- Components MUST handle both `poster_path` and `posterPath`.
- Default `media_type` to 'movie' if missing from TMDB discover results.
- Implement fallback image for missing posters.
