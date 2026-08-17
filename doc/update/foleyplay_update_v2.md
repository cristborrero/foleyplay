# ROLE

Act as a multidisciplinary senior digital product team composed of:

* Product Design Director
* Senior UX Designer
* Senior UI Designer
* Design Systems Architect
* Product Manager
* Senior Frontend Engineer
* Technical SEO Specialist
* CRO Specialist
* Accessibility Specialist
* Performance Engineer
* QA Engineer

Your mission is to substantially redesign and elevate the existing entertainment/streaming website into a premium, modern, editorially driven digital product.

This is NOT a greenfield project.

The existing application already contains working architecture, routes, components, APIs, movie/series data and business logic.

Your job is to **evolve the existing product without unnecessarily destroying or rewriting working functionality**.

---

# 1. CORE PRODUCT PRINCIPLE

The current experience is primarily:

> “A website that displays a large catalogue of movies and series.”

Transform it into:

> “A premium entertainment discovery platform that helps users quickly decide what to watch.”

The redesign must improve:

* perceived quality
* content discovery
* information hierarchy
* navigation
* readability
* engagement
* trust
* responsiveness
* accessibility
* performance
* technical SEO

without introducing unnecessary complexity.

---

# 2. DO NOT START CODING IMMEDIATELY

Before changing anything:

1. Inspect the repository.
2. Understand the current stack.
3. Identify routes.
4. Identify shared components.
5. Identify API/data dependencies.
6. Identify existing design tokens.
7. Identify card components.
8. Identify movie/series detail pages.
9. Identify search functionality.
10. Identify responsive behaviour.
11. Identify existing SEO implementation.
12. Identify loading/image strategy.
13. Identify reusable components.
14. Identify fragile areas that should not be changed unnecessarily.

Create a concise internal implementation plan.

Prefer refactoring and composition over rebuilding.

Do not replace working infrastructure merely to implement a visual redesign.

---

# 3. PRESERVE

Unless technically necessary, preserve:

* APIs
* content database
* movie metadata
* routes
* authentication
* user state
* player functionality
* favourites/watchlist functionality
* backend services
* search infrastructure
* existing business rules

Improve their presentation and usability rather than rebuilding them.

---

# 4. VISUAL DIRECTION

Create an original premium entertainment identity.

Do NOT produce a direct Netflix, Disney+, Prime Video, Max or Apple TV clone.

Reference their level of refinement, not their visual identity.

The desired feeling is:

* cinematic
* editorial
* sophisticated
* calm
* modern
* high-end
* content-first
* immersive
* trustworthy

Avoid visual gimmicks.

---

# 5. BASE DESIGN SYSTEM

Use a restrained dark system.

Suggested foundation:

Background:
`#080A09`

Primary surface:
`#101310`

Secondary surface:
`#151815`

Primary text:
`#F4F6F4`

Secondary text:
`#9CA39D`

Borders:
`rgba(255,255,255,0.08)`

Continue using the existing brand green as the primary accent unless inspection reveals accessibility problems.

Use green primarily for:

* primary CTA
* active navigation
* selected states
* progress
* focus states
* important interaction feedback

Do not decorate the entire interface with green.

---

# 6. SPACING SYSTEM

Establish and enforce:

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`

Desktop content container:

`max-width: 1440–1600px`

Desktop horizontal padding:

`40–64px`

Tablet and mobile must use responsive spacing tokens.

Remove arbitrary spacing values whenever feasible.

---

# 7. TYPOGRAPHY

Create strong information hierarchy.

Suggested scale:

Hero display:
48–64px desktop

H1:
40–48px

H2:
24–28px

H3:
18–20px

Body:
15–16px

Metadata:
13–14px

Caption:
12px minimum for non-critical information.

Avoid 9–11px text for important interface content.

Typography should feel confident, cinematic and highly readable.

---

# 8. HEADER REDESIGN

Replace the visually weak navigation with a premium sticky header.

Approximate desktop height:

72–80px.

Suggested structure:

LOGO

Inicio
Películas
Series
Géneros

Search

Mi lista
Profile/User controls

Search must become a first-class product capability.

Do not hide search exclusively behind a tiny icon on desktop.

Suggested search placeholder:

“Buscar películas, series, actores...”

Consider an expandable search or command-palette style interaction showing:

* live results
* trending searches
* recent searches if available

Only implement capabilities supported by existing data.

---

# 9. HERO REDESIGN

Maintain a featured-content hero but completely improve its composition.

Target desktop height:

approximately 560–650px.

Use:

* cinematic backdrop
* controlled image focal point
* strong left gradient
* bottom gradient blending naturally into the page
* readable foreground content
* restrained metadata
* clear CTA hierarchy

Suggested structure:

EYEBROW / ESTRENO DESTACADO

Title

Year • Duration • Age rating • Quality

Short description

Primary CTA:
“Ver ahora”

Secondary CTA:
“Mi lista”

Optional tertiary action:
“Ver tráiler”

Never sacrifice text legibility to expose more artwork.

Avoid hero heights near 100vh.

---

# 10. CREATE A DISCOVERY LAYER

Immediately after the hero, help users answer:

“What do I want to watch?”

Introduce a lightweight discovery strip containing categories such as:

Acción
Comedia
Terror
Ciencia ficción
Drama
Anime
Familia

Use elegant chips/buttons.

Do not turn this into an oversized navigation component.

---

# 11. HOMEPAGE CONTENT ARCHITECTURE

The existing page suffers from visual repetition caused by many identical poster rows.

Redesign the homepage rhythm.

Suggested sequence:

1. Hero
2. Discovery categories
3. Tendencias ahora
4. Estrenos
5. Editorial feature
6. Películas populares
7. Top 10
8. Genre discovery
9. Series destacadas
10. Editorial collection
11. Novedades
12. Anime
13. Browse by genre
14. Contextual SEO/internal navigation area
15. Footer

Do not blindly implement every module if the data does not support it.

Use existing data intelligently.

---

# 12. REDUCE THE “WALL OF POSTERS” EFFECT

Never allow the homepage to become:

section title
poster row
section title
poster row
section title
poster row
repeated indefinitely.

Introduce visual rhythm.

Approximately every 2–3 standard content rails, insert another editorial pattern such as:

* featured collection
* Top 10
* genre feature
* large cinematic banner
* curated editorial list

The website should feel curated, not database-generated.

---

# 13. CONTENT RAILS

Standard homepage rails should show a controlled number of titles.

Desktop target:

approximately 6–7 prominent cards visible depending on viewport.

Ultrawide:

approximately 7–8.

Do not aggressively shrink cards merely to display more content.

Provide:

“Ver todos →”

where a corresponding destination exists or can be safely created.

Favor clarity over catalogue density.

---

# 14. CARD COMPONENT

Refactor movie/series cards into a reusable production-quality component.

Normal state:

* poster
* title
* minimal metadata
* optional quality badge

Desktop hover:

* subtle elevation
* subtle scale
* richer metadata
* primary action
* secondary list/save action if supported

Suggested motion:

`scale(1.03–1.04)`

`translateY(-4px)`

Avoid extreme Netflix-style expansion that breaks surrounding layout.

Keep metadata restrained.

Do not use excessive badges.

---

# 15. EDITORIAL COLLECTIONS

Where the available data permits, create curated experiences such as:

“Perfectas para una noche de domingo”

“Historias que no podrás dejar a medias”

“Ciencia ficción para perder la noción del tiempo”

“Series para maratonear”

“Lo que todos están viendo”

These must feel intentionally curated rather than mechanically SEO-generated.

---

# 16. TOP 10 MODULE

Introduce a visually distinctive Top 10 pattern when ranking/popularity data is available.

Use oversized ranking numbers combined with posters.

Keep the typography and composition sophisticated.

Do not add fake ranking data.

---

# 17. GENRE EXPERIENCE

Create a structured genre navigation system.

Preferred URL patterns where compatible with existing architecture:

`/peliculas`

`/series`

`/genero/accion`

`/genero/terror`

`/genero/ciencia-ficcion`

`/genero/comedia`

Each genre destination should become a useful landing page rather than a simple filter state whenever technically appropriate.

---

# 18. MOVIE / SERIES DETAIL PAGE

The redesign must extend beyond the homepage.

Create a premium information hierarchy.

Suggested composition:

Backdrop

Poster

Title

Rating / Year / Runtime / Certification / Quality

Description

Primary CTA

Secondary list/save action

Then:

Trailer

Cast

Information

Genres

Director

Country

Language

Related recommendations

Do not show metadata that does not exist.

Avoid fabricated data.

---

# 19. RESPONSIVE DESIGN

Do not simply scale desktop down.

Design deliberately for:

* 360px
* 390px
* 430px
* 768px
* 1024px
* 1280px
* 1440px
* 1920px+

Mobile homepage structure:

Header

Search

Hero

Quick genre filters

Horizontal content rails

Approximately 2–3 partial poster cards should be visible where appropriate so horizontal swiping is discoverable.

Ensure touch targets are comfortable.

---

# 20. ACCESSIBILITY

Target WCAG-compliant interaction patterns.

Ensure:

* sufficient text contrast
* keyboard navigation
* visible focus states
* semantic buttons and links
* useful alt text
* accessible dialogs
* proper labels
* logical heading hierarchy
* minimum touch-target sizes
* reduced-motion support

Do not communicate important states using colour alone.

---

# 21. PERFORMANCE

This product is highly image-intensive.

Treat image performance as a first-class architectural requirement.

Implement or improve:

* responsive images
* `srcset`
* AVIF/WebP where supported
* CDN/image transformations if infrastructure allows
* explicit image dimensions
* lazy loading below the fold
* hero image priority
* loading placeholders with reserved dimensions
* JavaScript splitting
* route-level splitting
* selective prefetching
* caching

Do NOT request every homepage poster immediately.

Avoid unnecessary libraries merely for small UI effects.

Target good Core Web Vitals:

LCP < 2.5s

INP < 200ms

CLS < 0.1

Measure rather than assume.

---

# 22. SEO ARCHITECTURE

SEO must be integrated into the implementation rather than added at the end.

Ensure important content pages have crawlable URLs.

Prefer meaningful URL structures.

Each indexable title page should support:

* unique `<title>`
* useful meta description
* canonical
* exactly one logical H1
* semantic headings
* meaningful textual description
* indexable internal links
* Open Graph metadata
* social preview metadata

Do not make critical content available exclusively after client-side interaction.

Use SSR/SSG/prerendering where appropriate for the existing framework and architecture.

Do not rewrite the entire application solely to achieve SSR if a safer compatible solution already exists.

---

# 23. INTERNAL LINKING

Every important indexable title should be reachable through crawlable links.

Use descriptive anchors.

Examples:

“Películas de ciencia ficción”

instead of generic anchors such as:

“Click aquí”.

Create logical relationships between:

homepage
→ collections
→ genres
→ title pages
→ related titles.

---

# 24. STRUCTURED DATA

Implement only structured data that accurately represents visible page content and is appropriate for the page.

Evaluate:

* WebSite
* Organization
* BreadcrumbList
* Movie
* ItemList
* VideoObject for eligible video/watch pages

Prefer JSON-LD when appropriate.

Validate eligible markup with Google Rich Results Test.

Never fabricate:

* ratings
* reviews
* availability
* release dates
* cast
* offers
* video metadata

Structured data must describe actual user-visible content.

---

# 25. IMAGE SEO

Posters and backdrops are strategically important.

Ensure:

* meaningful file naming where controllable
* responsive sizes
* crawlable URLs
* useful alt text
* no unnecessary base64 images
* optimized compression
* correct intrinsic dimensions

Do not write keyword-stuffed alt text.

---

# 26. FOOTER

Transform the weak footer into a professional information architecture component.

Possible groups:

CONTENT
Películas
Series
Géneros
Novedades

COMPANY / PRODUCT
Sobre nosotros
Contacto
Ayuda

LEGAL
Privacidad
Cookies
Términos

Include only destinations that genuinely exist or are intentionally created.

Do not create dead links.

---

# 27. MOTION SYSTEM

Use restrained motion.

Suggested durations:

Hover:
160ms

Navigation/menu:
180–220ms

Dialog:
240ms

Large visual transition:
400–600ms

Suggested easing:

`cubic-bezier(.2,.8,.2,1)`

Use motion to communicate state.

Never add motion simply to make the interface look “futuristic.”

Respect `prefers-reduced-motion`.

---

# 28. SKELETON AND LOADING STATES

Create polished predictable loading states.

Skeletons must reserve the final layout dimensions to prevent layout shift.

Handle:

* initial loading
* image loading
* empty search
* no results
* failed API request
* offline/error scenarios

Do not leave blank black areas during asynchronous loading.

---

# 29. WHAT NOT TO DO

Do NOT:

* clone Netflix
* clone Disney+
* clone Prime Video
* clone Apple TV
* use glassmorphism everywhere
* introduce neon aesthetics
* add excessive gradients
* overload cards with badges
* create dozens of card variants
* add huge animated backgrounds
* use autoplay aggressively
* make the hero 100vh
* hide primary navigation unnecessarily
* shrink typography excessively
* rebuild APIs without reason
* replace working architecture for aesthetic reasons
* create functionality unsupported by data
* fabricate content
* sacrifice performance for animation
* introduce random visual effects
* use horizontal scrolling for every single module
* use infinite scrolling for the entire product

---

# 30. IMPLEMENTATION STRATEGY

Execute in controlled layers.

## Phase 1 — Audit

Understand the existing project.

Do not modify business logic yet.

## Phase 2 — Foundations

Implement/refine:

* tokens
* typography
* spacing
* colours
* radii
* buttons
* icons
* containers

## Phase 3 — Core Components

Refactor:

* header
* search
* movie card
* content rail
* genre chip
* buttons
* metadata
* skeleton states

## Phase 4 — Homepage

Implement:

* hero
* discovery
* rails
* editorial modules
* Top 10 when data permits
* footer

## Phase 5 — Interior Pages

Improve:

* movie details
* series details
* genre
* search
* collection pages

## Phase 6 — Responsive + Accessibility

Validate all important breakpoints.

## Phase 7 — SEO + Performance

Audit:

* metadata
* rendering
* internal linking
* structured data
* images
* Core Web Vitals
* sitemap
* crawlability

## Phase 8 — QA

Validate:

* functionality
* visual consistency
* responsiveness
* keyboard navigation
* accessibility
* broken links
* missing data
* console errors
* API regression
* performance

---

# 31. CHANGE CONTROL

Before deleting, replacing or fundamentally altering an existing component, determine:

1. Is it currently working?
2. Is it reused elsewhere?
3. Does another feature depend on it?
4. Can it be visually refactored instead?
5. Would replacement create unnecessary regression risk?

Prefer evolutionary refactoring.

Avoid destructive redesign.

---

# 32. FINAL QUALITY BAR

The result should no longer feel like:

“a dark website containing many movie posters.”

It should feel like:

“A carefully designed premium entertainment discovery product.”

The design should remain restrained enough to allow the content artwork to dominate.

Every design decision must answer at least one of these goals:

* Does it help discovery?
* Does it improve understanding?
* Does it increase perceived quality?
* Does it reduce friction?
* Does it strengthen the brand?
* Does it improve accessibility?
* Does it improve performance?
* Does it improve search visibility?

If it does none of these, reconsider adding it.

---

# 33. WORKING METHOD

Work incrementally.

After auditing the existing project:

1. Define the new foundations.
2. Implement the shell/header.
3. Redesign the hero.
4. Refactor one content rail and card system.
5. Validate visually and responsively.
6. Reuse that system across the remaining homepage.
7. Introduce editorial patterns.
8. Update interior pages.
9. Optimize SEO/performance.
10. Perform regression QA.

Do not execute a massive uncontrolled rewrite.

The final product must preserve the strengths of the existing implementation while delivering a clearly visible, substantial and premium transformation.
