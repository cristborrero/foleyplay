# Task: Mobile UI

## Principles
- Touch targets: minimum 44×44px for all interactive elements.
- Thumb zone: primary actions in the bottom 60% of screen.
- No hover-only interactions — all hover behaviors need a tap equivalent.

## Navigation
- Bottom tab bar: Home | Buscar | Mi lista | Perfil
- Max 4 tabs. Labels required (no icon-only tabs).
- Active tab: lime accent color.

## Gestures
- Horizontal swipe on content rows.
- Pull-to-refresh on browse page.
- Swipe down to dismiss modals (with visual handle).
- Long-press on card for quick action menu.

## Typography on Mobile
- Minimum 14px for body text.
- Headings: reduce 20–30% from desktop sizes.
- Never truncate with ellipsis at <2 lines — use line-clamp-2 minimum.

## Performance
- Images: `loading="lazy"` below fold. `priority` only for hero.
- Avoid `backdrop-filter` on large areas on low-end devices.
- Animations: reduce motion on `prefers-reduced-motion`.

## Safe Areas
- `pb-safe` / `padding-bottom: env(safe-area-inset-bottom)` for bottom nav.
- `pt-safe` for top content if going edge-to-edge.
