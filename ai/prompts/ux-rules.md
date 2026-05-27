# UX Rules

## Core Principles
1. **Clarity over cleverness** — if it needs explanation, redesign it.
2. **Speed is a feature** — perceived performance matters as much as actual performance.
3. **Every click costs attention** — reduce steps wherever possible.
4. **Feedback is mandatory** — every action must produce a visible response.

## Navigation
- Max 2 levels of navigation depth for primary flows.
- Active state must be visually unambiguous.
- Back navigation should never lose user's scroll position.
- Mobile: bottom nav for primary actions, top nav for context.

## Content Hierarchy
1. What is this? (Hero/Title)
2. Why do I care? (Value prop / description)
3. What do I do? (CTA)

## Loading & Feedback
- Optimistic updates for toggle actions (watchlist, ratings).
- Toast notifications for async actions (save, approve, etc.).
- Skeleton screens for content that takes >300ms.
- Never show a blank white/black flash during navigation.

## Empty States
Empty states are not failures — they are opportunities:
- Show what will appear here when content exists.
- Provide a clear next action.
- Use an illustration or icon, not just text.

## Onboarding
- First-time users should reach value in <60 seconds.
- Progressive disclosure: show features as they become relevant.
- Never show all options at once — guide, don't overwhelm.

## Error Handling
- Human language only — no error codes visible to end users.
- Always tell the user what to do next.
- Preserve user input on error — never clear a form on failure.
