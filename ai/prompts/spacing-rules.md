# Spacing Rules

## Base Unit
**8px** is the base unit. All spacing values are multiples of 4 (half-unit) or 8.

## Scale
| Token | Value | Tailwind |
|-------|-------|---------|
| 2xs | 2px | `p-0.5` |
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| 2xl | 48px | `p-12` |
| 3xl | 64px | `p-16` |
| 4xl | 96px | `p-24` |

## Layout Principles

### Page Container
- Max width: `max-w-7xl` (1280px)
- Horizontal padding: `px-4 sm:px-6 md:px-12`
- Vertical padding top (below navbar): `pt-20 sm:pt-24`

### Card Grid
- Gap between cards: `gap-3 sm:gap-4`
- Card internal padding: `p-4` to `p-6`
- Card border radius: `rounded-lg` (8px)

### Sections
- Between sections: `mb-12 sm:mb-16`
- Between section title and content: `mb-4 sm:mb-6`
- Between related items (list, form fields): `space-y-3` to `space-y-4`

### Modals / Panels
- Internal padding: `p-6`
- From viewport edge (mobile): `m-4` min
- Max width: `max-w-md` (forms), `max-w-2xl` (content), `max-w-4xl` (media modals)

## Typography Spacing
- Line height: `leading-tight` for headings, `leading-relaxed` for body.
- Letter spacing: `tracking-tight` for large headings (>32px).
- Paragraph gap: `mb-4`.
