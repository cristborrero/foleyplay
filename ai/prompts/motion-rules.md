# Motion Rules

## Philosophy
Motion communicates state changes — it does not decorate them.
Every animation must answer: "What is this telling the user?"

## Timing Scale
| Name | Duration | Use case |
|------|----------|----------|
| instant | 0ms | State changes with no transition |
| fast | 100ms | Button active states, toggles |
| normal | 200ms | Hover transitions, fade-ins |
| slow | 300ms | Panel slides, modals entering |
| deliberate | 500ms | Page transitions, hero animations |

## Easing
- **ease-out** for elements entering the screen (decelerate into place)
- **ease-in** for elements leaving the screen (accelerate out)
- **ease-in-out** for elements that stay on screen and transform
- **spring** (stiffness: 400, damping: 30) for playful, physical interactions

## Standard Animations

### Fade In
```
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: { duration: 0.2 }
```

### Slide Up (modal, drawer)
```
initial: { y: 20, opacity: 0 }
animate: { y: 0, opacity: 1 }
transition: { duration: 0.3, ease: 'easeOut' }
```

### Scale on Hover (card)
```
whileHover: { scale: 1.04 }
transition: { duration: 0.25, ease: 'easeOut' }
```

### Stagger Children (list)
```
parent: { transition: { staggerChildren: 0.05 } }
child: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }
```

## Rules
- Never animate more than 3 properties simultaneously.
- Always respect `prefers-reduced-motion` media query.
- No looping animations on page content (only loading states).
- Layout animations (Framer's `layoutId`) for shared element transitions.
