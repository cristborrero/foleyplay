# Task: Analytics UI

## Goal
Give admins visibility into platform usage and content performance.

## Dashboard Sections

### KPI Row (top)
4 metric cards: Total Users | Active This Week | Content Played | Top Genre
- Each: icon + number + trend (↑/↓ % vs last period)

### User Growth Chart
- Line chart: 30-day rolling window.
- Two lines: new users + active users.
- Hover tooltip with exact values.

### Content Performance Table
- Columns: Title | Type | Plays | Avg Watch Time | Rating
- Sortable columns.
- Pagination or infinite scroll.

### Genre Distribution
- Donut chart.
- Clicking a segment filters the content table.

## Design
- Chart library: Recharts or Chart.js (whichever is lighter for the use case).
- Dark theme: chart backgrounds transparent, grid lines `rgba(255,255,255,0.05)`.
- Loading: skeleton for each section independently.
- Empty state: "No hay suficientes datos aún. Volvé en 7 días."
