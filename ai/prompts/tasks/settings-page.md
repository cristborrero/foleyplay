# Task: Settings Page

## Goal
Allow users to manage their account, preferences, and subscriptions.

## Sections
1. **Preferences**: Language, content maturity rating, autoplay settings.
2. **Notifications**: Email preferences (weekly digest, new releases).
3. **Subscription**: Current plan, renewal date, upgrade/downgrade CTA.
4. **Devices**: List of active sessions with logout option.
5. **Danger Zone**: Delete account (destructive, requires confirmation modal).

## UX Rules
- Changes auto-save or have explicit save button per section — never both.
- Destructive actions require a confirm step ("Escribí DELETE para confirmar").
- Show success toast after each save.
- Loading state: disable form + show inline spinner on the save button.

## Design
- Sidebar navigation on desktop (sections listed vertically).
- Single-page scroll on mobile with anchor links.
- Section cards: `bg-fp-surface rounded-xl p-6 border border-fp-border`.
