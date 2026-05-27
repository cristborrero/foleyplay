# Reference: Apple Design Language (HIG)

## Core Principles
1. **Clarity**: text is legible, icons precise, decorations add value.
2. **Deference**: UI recedes, content leads.
3. **Depth**: visual layers and motion convey hierarchy.

## What to steal from Apple
- **Typography**: SF Pro precision. Substitute: Inter. Letter-spacing on large headings: -0.02em.
- **Iconography**: SF Symbols style — consistent weight, optical balance.
- **Modals**: sheets from bottom on iOS. Centered dialogs on macOS.
- **Navigation**: clear back path, no dead ends.
- **Empty states**: illustrated, friendly, actionable.

## Key Patterns
- Borders: often none — depth through background color difference alone.
- Blur: heavy `backdrop-filter: blur(20px)` for navigation bars, modals.
- Animation: spring physics everywhere. Nothing is linear.
- Dark mode: automatic, system-aware. Two dark surfaces: primary + secondary.
- Haptics: (web equivalent: micro-animation + visual pop on tap).

## Typography
- Display: -0.025em tracking, 700–800 weight.
- Body: 17px on iOS, 13–14px on macOS.
- Caption: 12px, slightly lighter color, no tracking adjustment.

## Color (Dark Mode)
| Role | Value |
|------|-------|
| Background | `#000000` |
| Secondary | `#1c1c1e` |
| Tertiary | `#2c2c2e` |
| Separator | `rgba(255,255,255,0.15)` |
| Label | `#ffffff` |
| Secondary Label | `rgba(235,235,245,0.6)` |
