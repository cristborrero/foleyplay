# FoleyPlay — Estado del Proyecto

> Última actualización: mayo 2026

---

## Resumen ejecutivo

**FoleyPlay** es una plataforma de streaming educativa y no comercial con una identidad visual moderna y disruptiva en verde lima (#CEFF00). Replica la experiencia de Netflix con autenticación real, catálogo desde TMDB, reproductores embebidos con ad-blocking proxy, subtítulos sincronizados, panel de administración con control de acceso por roles, y una arquitectura 100% web optimizada para producción en Vercel.

---

## Stack tecnológico

| Capa          | Tecnología                      | Versión       |
| ------------- | ------------------------------- | ------------- |
| Framework     | Next.js (App Router, Turbopack) | 16.2.4        |
| UI            | React                           | 19.2.4        |
| Lenguaje      | TypeScript                      | 5             |
| Estilos       | Tailwind CSS v4                 | 4.x           |
| Animaciones   | Framer Motion                   | 12.38.0       |
| Iconos        | Lucide React                    | 1.11.0        |
| Auth          | NextAuth v5 beta                | 5.0.0-beta.31 |
| Base de datos | MongoDB + Mongoose              | 9.5.0         |
| Contraseñas   | bcryptjs                        | 3.0.3         |
| HLS           | hls.js                          | 1.6.16        |
| Consumet      | @consumet/extensions            | 1.8.8         |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
│                                                             │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  (auth)     │  │     (main)       │  │   api/        │  │
│  │  /login     │  │  /browse         │  │  /tmdb/...    │  │
│  │  /register  │  │  /movie/[id]     │  │  /history     │  │
│  └─────────────┘  │  /tv/[id]        │  │  /watchlist   │  │
│                   │  /movies         │  │  /tv          │  │
│                   │  /tv             │  │  /search       │  │
│                   │  /search         │  │  /subtitles   │  │
│                   │  /watchlist      │  │  /proxy/player│  │
│                   │  /history        │  │  /admin/...   │  │
│                   │  /profile        │  │  /auth/*      │  │
│                   │  /admin/users    │  └───────────────┘  │
│                   │  /legal/*        │                      │
│                   └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
         │                    │                │
         ▼                    ▼                ▼
    NextAuth JWT          MongoDB           TMDB API
    Google OAuth          Atlas             (cacheado 1h)
    Credentials           4 modelos         es-ES default
    Roles: user/admin     approved flag
    /superadmin
```

---

## Rutas de la aplicación

### Páginas

| Ruta             | Descripción                                        | Acceso             |
| ---------------- | -------------------------------------------------- | ------------------ |
| `/`              | Redirect a `/browse` (autenticado) o `/login`      | Público            |
| `/login`         | Login email/password + Google OAuth                | Público            |
| `/register`      | Registro de cuenta nueva                           | Público            |
| `/browse`        | Home principal — Hero + carruseles                 | Autenticado        |
| `/movies`        | Catálogo de películas por género                   | Autenticado        |
| `/tv`            | Catálogo de series por género                      | Autenticado        |
| `/movie/[id]`    | Página completa de película con player             | Autenticado        |
| `/tv/[id]`       | Página de serie con selector de temporada/episodio | Autenticado        |
| `/search`        | Búsqueda con debounce y filtros                    | Autenticado        |
| `/watchlist`     | Mi lista personal                                  | Autenticado        |
| `/history`       | Continuar viendo                                   | Autenticado        |
| `/profile`       | Edición de nombre, avatar por iniciales            | Autenticado        |
| `/admin/users`   | Panel de gestión de usuarios                       | admin / superadmin |
| `/legal/terms`   | Términos de uso                                    | Público            |
| `/legal/privacy` | Política de privacidad                             | Público            |

---

## Componentes principales

### Layout

| Archivo                                | Descripción                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `components/layout/Navbar.tsx`         | Barra superior con logo, menú, búsqueda, dropdown usuario. Scroll-to-solid effect. |
| `components/layout/Footer.tsx`         | Logo FoleyPlay, links legales, disclaimer educativo, atribución TMDB obligatoria.  |
| `components/layout/Providers.tsx`      | Wrapper `SessionProvider` de NextAuth para toda la app.                            |
| `components/layout/PageTransition.tsx` | Fade+slide entre rutas usando `AnimatePresence` + `usePathname()`.                 |

### Carruseles y home

| Archivo                              | Descripción                                                    |
| ------------------------------------ | -------------------------------------------------------------- |
| `components/home/HeroBanner.tsx`     | Hero rotativo cada 8s. Cross-fade de imágenes (Framer Motion). |
| `components/home/ContentRow.tsx`     | Fila scrolleable con lazy load via IntersectionObserver.       |
| `components/home/UserContentRow.tsx` | Fila para datos del usuario (historial, watchlist).            |

### Cards

| Archivo                          | Descripción                                                             |
| -------------------------------- | ----------------------------------------------------------------------- |
| `components/cards/MovieCard.tsx` | Card con hover panel. Usa `resolvedMediaType` para navegación correcta. |

### Modales

| Archivo                             | Descripción                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `components/detail/DetailModal.tsx` | Modal overlay con hero, metadata, cast, trailers y tabs. |
| `components/player/PlayerModal.tsx` | Modal fullscreen para reproducción.                      |

---

## Modelos de base de datos

### User

```typescript
{
  name: string,
  email: string (unique),
  image?: string,
  password?: string,
  approved: boolean,
  role: 'user' | 'admin' | 'superadmin',
  createdAt: Date
}
```

### Watchlist

```typescript
{ userId, tmdbId, mediaType: 'movie'|'tv', title, posterPath, addedAt }
```

### History

```typescript
{ userId, tmdbId, mediaType, title, posterPath, season?, episode?, watchedAt, progress: 0-100 }
```

---

## Estructura de carpetas

```
09-netflix-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── browse/page.tsx
│   │   ├── movies/page.tsx
│   │   ├── tv/page.tsx
│   │   ├── movie/[id]/page.tsx
│   │   ├── tv/[id]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── admin/users/
│   │   └── legal/
│   ├── api/
│   │   ├── auth/
│   │   ├── tmdb/
│   │   ├── history/
│   │   ├── watchlist/
│   │   ├── ratings/
│   │   ├── profile/
│   │   ├── subtitles/
│   │   ├── proxy/player/
│   │   └── admin/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cards/
│   ├── detail/
│   ├── home/
│   ├── layout/
│   ├── player/
│   ├── search/
│   └── ui/
├── hooks/
│   ├── useHistory.ts
│   └── useWatchlist.ts
├── lib/
│   ├── auth.config.ts
│   ├── auth.ts
│   ├── avatar.ts
│   ├── modal-context.tsx
│   ├── mongodb.ts
│   ├── streams.ts
│   ├── subtitles.ts
│   └── tmdb.ts
├── models/
├── public/
├── types/
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Estado actual — qué funciona

| Feature                         | Estado      |
| ------------------------------- | ----------- |
| Login / Registro / OAuth        | ✅ Completo |
| Sistema de aprobación           | ✅ Completo |
| Roles y permisos                | ✅ Completo |
| HeroBanner rotativo             | ✅ Completo |
| Carruseles lazy-load            | ✅ Completo |
| Catálogos (/movies, /tv)        | ✅ Completo |
| PlayerModal con servers         | ✅ Completo |
| Ad-blocking proxy               | ✅ Completo |
| Subtítulos overlay              | ✅ Completo |
| Watchlist e Historial           | ✅ Completo |
| Búsqueda con filtros            | ✅ Completo |
| PWA (Installable)               | ✅ Completo |
| Rebranding (Verde Lima)         | ✅ Completo |
| Calificación de contenido (G-R) | ✅ Completo |
| Normalización de Media          | ✅ Completo |

---

## Decisiones técnicas relevantes

- **Eliminación de soporte TV**: El proyecto fue simplificado eliminando Capacitor, Android SDK y componentes específicos de TV para enfocarse en una experiencia web premium.
- **Middleware Edge-safe**: Autenticación desacoplada para funcionar en el Edge Runtime de Vercel.
- **Proxy ad-blocker**: Inyección de scripts para bloquear popups en los iframes de streaming.
- **Pure Web Implementation**: Rutas como `/movies` y `/tv` usan componentes web nativos en lugar de shims para TV.
- **Identidad Visual FoleyPlay**: Rebranding total alejándose de la estética de Netflix para adoptar un diseño "Lime Green" (#CEFF00) consistente en toda la interfaz.
- **Normalización de Datos de Imagen**: Implementación de un sistema de fallback visual y normalización de campos (`poster_path` vs `posterPath`) para garantizar la carga de carátulas independientemente de la fuente de datos.
- **Inyección Dinámica de Media Type**: El proxy API inyecta automáticamente metadatos de `media_type` en respuestas de descubrimiento, eliminando fallas de navegación en listas filtradas.
