# Task: Redesign

## When to Use This
Use this task prompt when redesigning an existing page or component that already exists in the codebase.

## Process
1. **Audit**: Review the existing implementation. List what works and what fails against the design system.
2. **Identify root cause**: Is the problem visual (spacing, color, type), structural (layout, hierarchy), or behavioral (UX, interactions)?
3. **Redesign with constraints**: Preserve existing functionality. Change only what's broken.
4. **Before/After documentation**: Show a diff of what changed and why.

## Checklist
- [ ] Existing functionality preserved
- [ ] Consistent with design system tokens
- [ ] Responsive (mobile + desktop tested)
- [ ] Accessibility maintained or improved
- [ ] Animations consistent with motion rules
- [ ] Code reviewed against UI rules

## Output Format
Provide:
1. What changed (bulleted list)
2. Why each change was made
3. The new implementation code
