# Typography Rules

## Font Stack
- **Primary**: `Inter` (Google Fonts) — UI, body, labels
- **Fallback**: `system-ui, -apple-system, sans-serif`
- **Monospace**: `JetBrains Mono` — code, IDs, timestamps

## Type Scale
| Role | Size | Weight | Tailwind |
|------|------|--------|---------|
| Display | 48–72px | 800 | `text-5xl font-extrabold` |
| H1 | 32–40px | 700 | `text-4xl font-bold` |
| H2 | 24–28px | 700 | `text-2xl font-bold` |
| H3 | 18–20px | 600 | `text-xl font-semibold` |
| Body L | 16px | 400 | `text-base` |
| Body | 14px | 400 | `text-sm` |
| Caption | 12px | 400–500 | `text-xs` |
| Micro | 10px | 500 | `text-[10px] font-medium` |

## Rules
1. **One H1 per page** — always.
2. **Never go below 10px** for any text a user is expected to read.
3. **Contrast minimum**: 4.5:1 for body text, 3:1 for large text (WCAG AA).
4. **Truncation**: use `truncate` for single-line overflow, `line-clamp-{n}` for multiline.
5. **Uppercase**: only for labels/badges/categories — never for body or headings.
6. **Numbers**: use tabular nums (`font-variant-numeric: tabular-nums`) for data tables.

## Hierarchy Enforcement
- Size difference between adjacent levels: minimum 2px.
- Never use color alone to create hierarchy — always back it up with size or weight.
- Bold is for emphasis of meaning, not visual decoration.
