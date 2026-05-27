# UI Rules

## Component Architecture
- Every component is either a container or a presentational element — never both.
- State lives as high as needed, no higher.
- Components receive data via props; they never fetch data themselves (unless they are page-level).

## Dark Theme Palette
| Token | Value | Usage |
|-------|-------|-------|
| `fp-black` | `#0a0a0a` | Page background |
| `fp-surface` | `#111111` | Card surfaces |
| `fp-elevated` | `#1a1a1a` | Hover states, inputs |
| `fp-border` | `rgba(255,255,255,0.08)` | Borders |
| `fp-lime` | `#e5e000` | Primary accent |
| `fp-red` | `#e50914` | Danger, Netflix-style CTA |
| `text-primary` | `#ffffff` | Headings |
| `text-secondary` | `rgba(255,255,255,0.6)` | Body text |
| `text-muted` | `rgba(255,255,255,0.35)` | Labels, captions |

## Interactive States
All interactive elements MUST define:
1. Default
2. Hover (150ms ease transition)
3. Active / Pressed (scale 0.97)
4. Focus (2px ring, offset 2px)
5. Disabled (opacity 0.4, cursor-not-allowed)

## Image Handling
- Always provide a fallback for missing images.
- Use `loading="lazy"` for below-the-fold images.
- Use `priority` only for LCP images (hero, first card in row).
- TMDB images: use `w342` for cards, `w780` for modals, `original` for hero backgrounds.

## Forms
- Label every input — never use placeholder as label.
- Show validation errors inline, below the field.
- Disable submit while loading; show spinner inside button.

## Error States
Every data-fetching component must handle:
- Loading skeleton (not spinner, unless <500ms)
- Empty state (icon + message + CTA if applicable)
- Error state (message + retry button)
