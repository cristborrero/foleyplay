# Reference: Vercel Design System

## What to steal from Vercel
- **Dashboard**: deployment cards with status indicators, clean timeline.
- **Navigation**: top nav + sidebar combo. Breadcrumbs for deep navigation.
- **Status indicators**: colored dots (green/yellow/red) with animation for active state.
- **Code blocks**: dark syntax highlighting, copy button on hover, language badge.
- **Empty states**: "Deploy your first project" style — action-oriented.

## Key Patterns
- True black (`#000`) with white text. Maximum contrast.
- Geist font family (their own). Substitute: Inter.
- Borders: `1px solid rgba(255,255,255,0.1)`.
- Cards: no shadow — border + bg color for depth.
- Tabs: underline style, not pill/filled.

## Deployment Card Anatomy
- Status dot + label (top right)
- Project name (H3)
- Branch + commit hash (caption)
- Domain link
- Time ago (timestamp)

## Links
- https://vercel.com/design
- https://geist-ui.dev
