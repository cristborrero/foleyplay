# Task: Auth UI (Login & Register)

## Login Page
- **Layout**: Full-screen with cinematic background (blurred content backdrop). Centered card.
- **Card**: `bg-black/80 backdrop-blur-md rounded-xl p-8 w-full max-w-sm`.
- **Fields**: Email, Password. Show/hide toggle on password.
- **CTA**: "Iniciar sesión" (full-width, red).
- **Social**: "Continuar con Google" (full-width, outlined, white icon).
- **Links**: "¿Olvidaste tu contraseña?" | "¿Primera vez? Crear cuenta".
- **Errors**: Inline below the field. Form-level error above the submit button.

## Register Page
- Same layout as login.
- **Fields**: Name (optional), Email, Password, Confirm Password.
- **Validation**: Real-time. Show password strength indicator.
- **Post-registration**: "Tu cuenta fue creada. Revisá tu email." or redirect to onboarding.

## States
- Loading: button disabled, spinner inside.
- Success: redirect (no flash).
- Error: shake animation on card (`animate-shake`).

## Accessibility
- autofocus on first field.
- `aria-invalid` + `aria-describedby` on error fields.
- Form submitted on Enter from any field.
