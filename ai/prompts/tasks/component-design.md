# Task: Component Design

## When to Use
Use when designing a new reusable UI component that will be used across multiple pages.

## Component Specification Template
```
Component: [Name]
Purpose: [One sentence]
Variants: [list of variants]
Props:
  - propName: type (required/optional) — description
States: default | hover | active | focus | disabled | loading | error
Sizes: sm | md | lg (if applicable)
```

## Design Requirements
1. **Self-contained**: the component should work without relying on global state.
2. **Composable**: accept `className` prop for extension.
3. **Typed**: full TypeScript interface for all props.
4. **Accessible**: keyboard navigation, ARIA attributes, focus management.
5. **Animated**: define enter/exit animations if the component appears/disappears.

## File Structure
```
components/
  ui/
    [ComponentName].tsx        # Main component
    [ComponentName].stories.tsx # Storybook (if applicable)
```

## Export Pattern
```tsx
export default ComponentName;
export type { ComponentNameProps };
```
