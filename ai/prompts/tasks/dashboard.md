# Task: Dashboard / Browse Page

## Goal
Help authenticated users find something to watch immediately.

## Layout
- **Above fold**: Hero banner (full-width, 50–60vh) with title, description, ratings, and action buttons.
- **Below fold**: Horizontal scrolling rows of content cards.
  - "Continuar viendo" (if applicable)
  - "Tendencias ahora"
  - "Películas populares"
  - "Series recomendadas"
  - "Mejor valoradas"
  - Genre-specific rows

## Card Behavior
- Hover: scale 1.04, show overlay with title + score + action buttons.
- Click: open detail modal.
- Row arrows: appear on hover for desktop. Touch-scroll on mobile.

## Performance
- First row: eager loaded.
- Remaining rows: lazy loaded on scroll (Intersection Observer).
- Hero: preload LCP image.

## Empty / Loading States
- Hero: full-width skeleton with gradient animation.
- Cards: 6 skeleton cards per row while loading.
