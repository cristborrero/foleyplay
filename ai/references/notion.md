# Reference: Notion Design System

## What to steal from Notion
- **Editor**: block-based, minimal chrome, full focus on content.
- **Sidebar**: tree navigation, collapsible, drag-and-drop.
- **Hover menus**: appear on hover, contextual, action-dense.
- **Cover images**: full-width, adjustable position, emoji/icon support.
- **Database views**: table, kanban, gallery, calendar — same data, different lenses.

## Key Patterns
- White background for content (exception to dark-first — Notion is content-focused).
- Gray hover backgrounds (`rgba(0,0,0,0.04)` on light).
- No harsh borders — `rgba(0,0,0,0.08)` only.
- Emoji as icons — low-effort, high personality.
- Generous padding in content areas, tight in navigation.

## Interaction Patterns
- Drag handles appear on hover (⋮⋮).
- Click to select, double-click to edit.
- Slash (/) to invoke block picker.
- `@mention` for linking. `[[` for page linking.

## Adaptation for Dark Theme
- Replace white with `#111111`.
- Borders: `rgba(255,255,255,0.06)`.
- Hover: `rgba(255,255,255,0.04)`.
