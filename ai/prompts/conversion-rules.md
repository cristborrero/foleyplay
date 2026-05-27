# Conversion Rules

## Goal Hierarchy
Every page has one primary goal. Design ruthlessly toward it.

| Page | Primary Goal |
|------|-------------|
| Landing | Sign up / Start trial |
| Login | Authenticate |
| Browse | Start watching |
| Movie/TV detail | Play content |
| Pricing | Select plan |
| Onboarding | Complete profile |

## CTA Principles
1. **One primary CTA per section** — never two equal-weight buttons side by side.
2. **Action verbs**: "Empezar", "Ver ahora", "Continuar" — not "Submit" or "OK".
3. **CTA placement**: above the fold for primary conversion, repeated after long content.
4. **Visual weight**: Primary = filled, high contrast. Secondary = outlined or ghost.

## Friction Reduction
- Registration: ask for minimum info (email + password or social login). Name, avatar — later.
- Payment: show price early, hide complexity until checkout.
- Forms: auto-focus first field. Tab order must be logical. Enter submits.

## Trust Signals
Place these near conversion points:
- Social proof: user count, reviews, ratings
- Security: lock icon near payment, "no credit card required" near signup
- Guarantees: free trial, cancel anytime
- Logos: known brands using the product (for B2B)

## Urgency & Scarcity
Use sparingly and only when real:
- "X spots left" (if true)
- "Limited time offer" (with actual expiry)
- Recently watched / trending (social proof)

## A/B Testing Hooks
All primary CTAs should have a `data-cta` attribute for tracking:
```html
<button data-cta="hero-primary" data-variant="A">Empezar gratis</button>
```
