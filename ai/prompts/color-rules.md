# Color Rules

## Palette

### Neutral (Dark Base)
| Name | Hex | Usage |
|------|-----|-------|
| Black | `#0a0a0a` | Page bg |
| Surface | `#111111` | Card bg |
| Elevated | `#1a1a1a` | Hover, input bg |
| Border | `rgba(255,255,255,0.08)` | Dividers, card borders |
| Muted bg | `rgba(255,255,255,0.04)` | Subtle fills |

### Text
| Name | Value | Usage |
|------|-------|-------|
| Primary | `#ffffff` | Headings, important content |
| Secondary | `rgba(255,255,255,0.6)` | Body, descriptions |
| Muted | `rgba(255,255,255,0.35)` | Labels, placeholders, timestamps |
| Disabled | `rgba(255,255,255,0.2)` | Disabled text |

### Accent
| Name | Hex | Usage |
|------|-----|-------|
| FoleyPlay Lime | `#e5e000` | Primary brand, highlights |
| Red | `#e50914` | Danger, Netflix-style CTA |
| Green | `#22c55e` | Success, approved states |
| Yellow | `#eab308` | Warning, pending states |
| Blue | `#3b82f6` | Info, links |

## Color Application Rules

1. **Backgrounds**: Always dark. Never use white/light backgrounds except for specific inversion patterns.
2. **Borders**: Always use opacity-based white (`rgba(255,255,255,0.08)`) — never hard borders.
3. **Accents sparingly**: The lime accent should appear in <20% of elements. It loses power when overused.
4. **Status colors**: Green for success/approved, yellow for pending/warning, red for error/danger.
5. **Gradients**: Allowed for backgrounds and image overlays. Linear, max 2 stops. Direction: top-to-bottom or bottom-to-top.
6. **Glassmorphism**: `backdrop-blur-md` + `bg-white/10` + `border border-white/10` — use for floating panels over media.

## Contrast Requirements (WCAG AA)
- Body text on `#0a0a0a`: minimum `rgba(255,255,255,0.6)` ✓
- Labels/captions: minimum `rgba(255,255,255,0.35)` ✓ (at 14px+)
- CTA buttons: white text on red/lime always passes ✓
