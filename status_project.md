# FoleyPlay — Estado del Proyecto
> Última actualización: abril 2026

---

## Resumen ejecutivo

**FoleyPlay** es una plataforma de streaming educativa y no comercial construida como demostración técnica de habilidades full-stack. Replica la experiencia de Netflix con autenticación real, catálogo desde TMDB, reproductores embebidos con ad-blocking proxy, subtítulos sincronizados, panel de administración con control de acceso por roles, y soporte Android TV vía Capacitor.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.4 |
| UI | React | 19.2.4 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS v4 | 4.x |
| Animaciones | Framer Motion | 12.38.0 |
| Iconos | Lucide React | 1.11.0 |
| Auth | NextAuth v5 beta | 5.0.0-beta.31 |
| Base de datos | MongoDB + Mongoose | 9.5.0 |
| Contraseñas | bcryptjs | 3.0.3 |
| Mobile/TV | Capacitor Android | 8.3.1 |
| HLS | hls.js | 1.6.16 |
| Consumet | @consumet/extensions | 1.8.8 |

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
│                   │  /movies         │  │  /ratings     │  │
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

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Redirect a `/browse` (autenticado) o `/login` | Público |
| `/login` | Login email/password + Google OAuth | Público |
| `/register` | Registro de cuenta nueva | Público |
| `/browse` | Home principal — Hero + carruseles | Autenticado |
| `/movies` | Catálogo de películas por género | Autenticado |
| `/movie/[id]` | Página completa de película con player | Autenticado |
| `/tv/[id]` | Página de serie con selector de temporada/episodio | Autenticado |
| `/search` | Búsqueda con debounce y filtros | Autenticado |
| `/watchlist` | Mi lista personal | Autenticado |
| `/history` | Continuar viendo | Autenticado |
| `/profile` | Edición de nombre, avatar por iniciales | Autenticado |
| `/admin/users` | Panel de gestión de usuarios | admin / superadmin |
| `/legal/terms` | Términos de uso | Público |
| `/legal/privacy` | Política de privacidad | Público |

### API Routes

| Endpoint | Método | Función | Acceso |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | Handler NextAuth (session, OAuth) | Público |
| `/api/auth/register` | POST | Crear cuenta (bcrypt hash) | Público |
| `/api/tmdb/[...slug]` | GET | Proxy TMDB API con cache 1h | Autenticado |
| `/api/history` | GET/POST | Historial de reproducción | Autenticado |
| `/api/watchlist` | GET/POST | Mi lista (toggle add/remove) | Autenticado |
| `/api/ratings` | GET/POST/DELETE | Calificaciones (like=5/dislike=1, toggle) | Autenticado |
| `/api/profile` | GET/PATCH | Perfil de usuario (nombre) | Autenticado |
| `/api/subtitles` | GET | Busca subtítulos en OpenSubtitles | Autenticado |
| `/api/subtitles/download` | GET | Descarga y convierte SRT → VTT | Autenticado |
| `/api/proxy/player` | GET | Proxy iframe con ad-blocking | Autenticado |
| `/api/admin/users` | GET | Listar todos los usuarios | admin/superadmin |
| `/api/admin/users` | DELETE | Eliminar usuario | admin/superadmin† |
| `/api/admin/approve` | POST | Aprobar/rechazar acceso de usuario | admin/superadmin |
| `/api/admin/designate` | POST | Promover/degradar rol admin | superadmin |

† Los admins no pueden eliminar a otros admins; solo el superadmin puede.

---

## Componentes

### Layout

| Archivo | Descripción |
|---|---|
| `components/layout/Navbar.tsx` | Barra superior con logo, menú, búsqueda, dropdown usuario. Scroll-to-solid effect. |
| `components/layout/Footer.tsx` | Logo FoleyPlay, links legales, disclaimer educativo, atribución TMDB obligatoria. |
| `components/layout/Providers.tsx` | Wrapper `SessionProvider` de NextAuth para toda la app. |
| `components/layout/PageTransition.tsx` | Fade+slide entre rutas usando `AnimatePresence` + `usePathname()`. |
| `components/layout/TVBackHandler.tsx` | Escucha Escape/Back en TV y ejecuta `router.back()`. |

### Carruseles y home

| Archivo | Descripción |
|---|---|
| `components/home/HeroBanner.tsx` | Hero rotativo cada 8s. Cross-fade de imágenes (Framer Motion). Botones Reproducir + Más información. Dots de navegación. |
| `components/home/ContentRow.tsx` | Fila scrolleable con lazy load via IntersectionObserver. Acepta `mediaType` prop para resolver TV vs Movie correctamente. |
| `components/home/UserContentRow.tsx` | Fila para datos del usuario (historial, watchlist). Oculto automáticamente si vacío. Barra de progreso opcional. |

### Cards

| Archivo | Descripción |
|---|---|
| `components/cards/MovieCard.tsx` | Card con hover panel (slide desde abajo). Score%, año, tipo, overview, botones Play/Info. Usa `resolvedMediaType = mediaType prop || media.media_type || 'movie'`. |

### Modales

| Archivo | Descripción |
|---|---|
| `components/detail/DetailModal.tsx` | Modal overlay con hero (trailer YT o backdrop), metadata bar, sinopsis expandible, cast row, tab Trailers. Botones: Reproducir, Mi Lista, Like, Dislike, Compartir, **Más información**. Mute/unmute en trailer. Para series: Reproducir y Más información van a `/tv/[id]`. |
| `components/player/PlayerModal.tsx` | Modal fullscreen para reproducción. Header con título y temporada/episodio. Hint a los 30s si no carga. ESC cierra. Registra en historial al abrir. |

### Player

| Archivo | Descripción |
|---|---|
| `components/player/ServerSelector.tsx` | Tabs de servidores. Badge "Multi-audio" en UnlimPlay y VidLink. Reload iframe via `key` al cambiar servidor. Modo fullscreen (`flex-1 min-h-0`). |
| `components/player/SubtitleInjector.tsx` | Subtítulos overlay sobre iframe. Timer manual (`performance.now()`). Offset ±0.5s para sincronización. Parser VTT client-side. Toggle CC. |

### Search

| Archivo | Descripción |
|---|---|
| `components/search/SearchBar.tsx` | Componente de barra de búsqueda (en desarrollo). |

### UI

| Archivo | Descripción |
|---|---|
| `components/ui/SkeletonCard.tsx` | Placeholder shimmer mientras carga ContentRow. |
| `components/ui/LoadingSpinner.tsx` | Spinner de carga genérico. |
| `components/ui/StarRating.tsx` | Componente de rating por estrellas. |

### Admin

| Archivo | Descripción |
|---|---|
| `app/(main)/admin/users/AdminUsersClient.tsx` | Client component del panel de admin. Lista usuarios, permite aprobar/rechazar y promover/degradar. Solo accesible para `admin` y `superadmin`. |

---

## Modelos de base de datos

### User
```typescript
{
  name: string,
  email: string (unique),
  image?: string,
  password?: string,     // bcrypt hash, ausente en OAuth
  approved: boolean,     // default: false — requiere aprobación manual
  role: 'user' | 'admin' | 'superadmin',  // default: 'user'
  createdAt: Date
}
```

### Watchlist
```typescript
{ userId, tmdbId, mediaType: 'movie'|'tv', title, posterPath, addedAt }
// index: (userId, tmdbId, mediaType) unique
```

### History
```typescript
{ userId, tmdbId, mediaType, title, posterPath, season?, episode?, watchedAt, progress: 0-100 }
// index: (userId, tmdbId, mediaType) unique — upsert al reproducir
```

### Rating
```typescript
{ userId, tmdbId, mediaType, score: 1-5, ratedAt }
// index: (userId, tmdbId, mediaType) unique
```

---

## Sistema de roles y acceso

| Rol | Descripción | Permisos |
|---|---|---|
| `user` | Usuario estándar | Acceso a toda la app (si `approved: true`) |
| `admin` | Administrador | Ver y gestionar usuarios, aprobar acceso |
| `superadmin` | Super administrador | Todo lo de admin + promover admins + eliminar admins |

**Flujo de aprobación:**
1. Usuario se registra → `approved: false`
2. Admin aprueba vía panel `/admin/users` → `approved: true`
3. Usuario puede loguearse y usar la app

**Rutas de admin protegidas:**
- Página `/admin/users`: redirige a `/` si el rol no es `admin` o `superadmin`
- API endpoints: verifican rol desde sesión JWT o `?secret=ADMIN_SECRET`

---

## Librerías y utilidades

| Archivo | Descripción |
|---|---|
| `lib/auth.ts` | NextAuth config completa. Google OAuth + Credentials (bcrypt). JWT strategy. Callbacks: inyecta `id`, `name`, `approved`, `role` en token. Soporta `update()` trigger. |
| `lib/auth.config.ts` | Configuración edge-safe de NextAuth. Sin mongoose ni bcrypt. Usada por `proxy.ts` para decodificar JWT en el middleware sin tocar la DB. |
| `lib/mongodb.ts` | Conexión Mongoose con global cache pattern. Graceful fallback en build-time. |
| `lib/tmdb.ts` | Cliente TMDB. Cache 1h server-side. `language=es-ES`. Métodos: trending, popular, top_rated, detail, season, search, discover. |
| `lib/streams.ts` | Array de proveedores de stream. Función `proxy()` apunta a `/api/proxy/player`. |
| `lib/modal-context.tsx` | Context + hook `useModal()`. Estado global para PlayerModal y DetailModal. |
| `lib/subtitles.ts` | Integración OpenSubtitles API. `searchSubtitles()` retorna tracks disponibles por idioma. |
| `lib/avatar.ts` | `avatarBg(seed)` — hash determinístico del nombre/email a paleta de 10 colores. `avatarInitials(name)` — extrae hasta 2 iniciales. Sin dependencias externas. |

---

## Hooks

| Archivo | Descripción |
|---|---|
| `hooks/useWatchlist.ts` | CRUD de watchlist. `isInWatchlist()`, `toggle()`, `refresh()`. |
| `hooks/useHistory.ts` | Historial. `logView()`, `updateProgress()`, `refresh()`. |
| `hooks/useTVNavigation.ts` | Mapeo de teclas para TV remote. `useIsTVMode()` detecta device. |

---

## Proveedores de stream

| Nombre | Modo | Multi-audio | Notas |
|---|---|---|---|
| **UnlimPlay** | Direct (browser DNS) | ✅ | Selector de idioma in-player |
| **VidLink** | Direct (browser DNS) | ✅ | Selector de idioma in-player |
| **2Embed** | Proxied (ad-blocked) | ❌ | HTML procesado server-side |
| **StreamIMDb** | Proxied (ad-blocked) | ❌ | Requiere IMDB ID, fallback a 2Embed |
| **Embed.su** | Direct (browser DNS) | ❌ | Fallback final |

**Proxy ad-blocker** (`/api/proxy/player`) inyecta:
- Redefine `window.open()` → noop
- Bloquea frame-breakout (`top`, `parent`, `location`)
- Bloquea links `_blank` / `_top`
- MutationObserver anti-overlay
- Strip de `<script>` de dominios publicitarios conocidos

---

## Variables de entorno requeridas

```env
# TMDB
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OpenSubtitles
OPENSUBTITLES_API_KEY=
OPENSUBTITLES_USER_AGENT=FoleyPlayApp v1.0

# Admin
ADMIN_EMAIL=tu_email_de_superadmin@ejemplo.com
ADMIN_SECRET=secreto_para_llamadas_admin_sin_sesion

# App pública
NEXT_PUBLIC_APP_NAME="FoleyPlay"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `ADMIN_EMAIL` define quién es el superadmin inicial.
> `ADMIN_SECRET` permite llamar a las APIs de admin pasando `?secret=...` sin sesión activa (útil para scripts de mantenimiento).

---

## Configuración especial

### next.config.ts
```typescript
images.remotePatterns: [
  'image.tmdb.org',        // Pósters y backdrops
  'img.youtube.com',       // Thumbnails de trailers
  'www.themoviedb.org',    // Logo TMDB en footer
]
// distDir eliminado — usa .next por defecto (Vercel compatible)
```

### capacitor.config.ts
```typescript
appId: 'com.foleyplay.app'
appName: 'FoleyPlay'
webDir: 'out'                          // Requiere next export
server.url: 'http://172.18.16.70:3000' // IP local para dev en emulador TV
// ⚠️ Cambiar a URL pública antes de build de producción
```

### Favicon (app/)
```
app/favicon.ico       3.3 KB   32×32   Browsers viejos, pestaña del browser
app/icon.png         28.0 KB  192×192  Chrome, Android, PWA — Next.js file convention
app/apple-icon.png   25.4 KB  180×180  iPhone/iPad home screen — Next.js file convention
```
Fuente: `doc/assets/img/SVG/foleyplay-ico.webp` (500×500, logo oficial).

---

## Carruseles en browse

| Título | Endpoint TMDB | mediaType |
|---|---|---|
| Tendencias Actuales | `/trending/all/day` | mixto (usa `media_type` del ítem) |
| Películas Populares | `/movie/popular` | `movie` |
| Series Populares | `/tv/popular` | `tv` |
| Películas Mejor Valoradas | `/movie/top_rated` | `movie` |
| Series Mejor Valoradas | `/tv/top_rated` | `tv` |
| Acción y Aventura | `/discover/movie?with_genres=28` | `movie` |
| Comedia | `/discover/movie?with_genres=35` | `movie` |
| Drama | `/discover/movie?with_genres=18` | `movie` |
| Ciencia Ficción | `/discover/movie?with_genres=878` | `movie` |
| Series de Acción y Aventura | `/discover/tv?with_genres=10759` | `tv` |
| Series de Comedia | `/discover/tv?with_genres=35` | `tv` |
| Series de Drama | `/discover/tv?with_genres=18` | `tv` |
| Crimen y Misterio | `/discover/tv?with_genres=80` | `tv` |
| Ciencia Ficción y Fantasía | `/discover/tv?with_genres=10765` | `tv` |
| Animación | `/discover/tv?with_genres=16` | `tv` |

> **Nota crítica:** los endpoints `/tv/*` no incluyen `media_type` por ítem. El prop `mediaType` en `ContentRow` → `MovieCard` es la solución para evitar que las series abran como películas.

## Carruseles en /movies

| Título | Endpoint | Notas |
|---|---|---|
| Populares | `/movie/popular` | `isLargeRow` |
| Mejor Valoradas | `/movie/top_rated` | |
| Acción y Aventura | `/discover/movie?with_genres=28` | |
| Comedia | `/discover/movie?with_genres=35` | |
| Drama | `/discover/movie?with_genres=18` | |
| Ciencia Ficción | `/discover/movie?with_genres=878` | |
| Terror | `/discover/movie?with_genres=27` | |
| Animación | `/discover/movie?with_genres=16` | |
| Documentales | `/discover/movie?with_genres=99` | |

---

## Decisiones técnicas relevantes

| Decisión | Motivo |
|---|---|
| `distDir` eliminado de `next.config.ts` | Vercel no soporta `distDir` custom. Se usa el `.next` por defecto. |
| `lib/auth.config.ts` separado | El middleware corre en Edge Runtime. Mongoose y bcrypt no son Edge-compatibles. `auth.config.ts` contiene solo la config de callbacks sin imports pesados. |
| `approved` flag en User | Registro abierto pero acceso restringido. El admin aprueba manualmente cada cuenta nueva antes de que pueda usar la plataforma. |
| Roles `user/admin/superadmin` | Jerarquía de 3 niveles: superadmin no puede ser modificado por nadie. admin puede gestionar users pero no otros admins. |
| `ADMIN_SECRET` en query param | Permite llamadas de mantenimiento/scripts sin sesión activa. Más seguro que hardcodear credenciales en scripts. |
| Proxy server-side para iframes | Permite inyectar bloqueador de popups y strip de ads antes de servir el HTML al browser. |
| Timer manual en SubtitleInjector | Los iframes de stream son cross-origin — imposible leer `video.currentTime`. Se usa `performance.now()` con offset manual. |
| `AnimatePresence mode="sync"` en HeroBanner | Cross-fade real: imagen entrante y saliente animan simultáneamente. |
| `mediaType` prop en ContentRow | Endpoints específicos de TV no devuelven `media_type` por ítem. Sin el prop, todas las series se abrían como películas. |
| Favicon multi-formato desde WebP | El SVG original embebía un PNG en base64 (1.3MB). Se extrae el WebP fuente y se generan los tamaños correctos con `sips`. |
| Avatar por iniciales sin servicios externos | Hash determinístico del nombre/email sobre paleta de 10 colores. Sin dependencias externas. |
| Ratings: like=5, dislike=1 | El modelo Rating usa `score: 1-5`. Se mapean los dos estados semánticos a los extremos de la escala. El toggle off llama a DELETE. |
| `@source not` múltiples exclusiones en globals.css | Tailwind v4 escanea todos los archivos incluyendo markdown, binarios y `.next/`. Excluidos: `doc/`, `.next/`, `public/`, `**/*.md`, `**/*.log`, `**/*.txt`. |

---

## Estructura de carpetas completa

```
09-netflix-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── browse/page.tsx
│   │   ├── movies/page.tsx              ← nuevo
│   │   ├── movie/[id]/page.tsx
│   │   ├── tv/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── admin/                       ← nuevo
│   │   │   └── users/
│   │   │       ├── page.tsx
│   │   │       └── AdminUsersClient.tsx
│   │   └── legal/
│   │       ├── terms/page.tsx
│   │       └── privacy/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── tmdb/[...slug]/route.ts
│   │   ├── history/route.ts
│   │   ├── watchlist/route.ts
│   │   ├── ratings/route.ts
│   │   ├── profile/route.ts
│   │   ├── subtitles/
│   │   │   ├── route.ts
│   │   │   └── download/route.ts
│   │   ├── proxy/player/route.ts
│   │   └── admin/                       ← nuevo
│   │       ├── users/route.ts           (GET list, DELETE)
│   │       ├── approve/route.ts         (POST approve/reject)
│   │       └── designate/route.ts       (POST promote/demote)
│   ├── apple-icon.png                   ← nuevo (180×180)
│   ├── favicon.ico                      ← actualizado (32×32)
│   ├── icon.png                         ← nuevo (192×192)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── cards/
│   │   └── MovieCard.tsx
│   ├── detail/
│   │   └── DetailModal.tsx
│   ├── home/
│   │   ├── ContentRow.tsx
│   │   ├── HeroBanner.tsx
│   │   └── UserContentRow.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageTransition.tsx
│   │   ├── Providers.tsx
│   │   └── TVBackHandler.tsx
│   ├── player/
│   │   ├── PlayerModal.tsx
│   │   ├── ServerSelector.tsx
│   │   └── SubtitleInjector.tsx
│   ├── search/
│   │   └── SearchBar.tsx                ← nuevo (en desarrollo)
│   └── ui/
│       ├── LoadingSpinner.tsx           ← nuevo
│       ├── SkeletonCard.tsx
│       └── StarRating.tsx              ← nuevo
├── hooks/
│   ├── useHistory.ts
│   ├── useTVNavigation.ts
│   └── useWatchlist.ts
├── lib/
│   ├── auth.config.ts                   ← nuevo (edge-safe)
│   ├── auth.ts
│   ├── avatar.ts
│   ├── modal-context.tsx
│   ├── mongodb.ts
│   ├── streams.ts
│   ├── subtitles.ts
│   └── tmdb.ts
├── models/
│   ├── History.ts
│   ├── Rating.ts
│   ├── User.ts                          ← actualizado (approved, role)
│   └── Watchlist.ts
├── public/
│   ├── logo-foleyplay.png
│   ├── logo.webp
│   └── favicon.webp                     ← mantenido como asset
├── types/
│   ├── next-auth.d.ts
│   └── tmdb.ts
├── doc/
│   ├── assets/img/SVG/
│   │   ├── foleyplay-ico.svg            ← fuente original (1.3MB, PNG embebido)
│   │   └── foleyplay-ico.webp           ← fuente usada para favicons (500×500)
│   ├── VERCEL_DEPLOY.md
│   ├── guia_variables_entorno.md
│   └── netflix_clone_claude_code.md
├── capacitor.config.ts
├── next.config.ts
├── package.json
├── proxy.ts
├── tsconfig.json
├── .env.local
└── .gitignore
```

---

## Estado actual — qué funciona

| Feature | Estado |
|---|---|
| Login / Registro | ✅ Completo |
| Google OAuth | ✅ Completo |
| Sistema de aprobación de usuarios | ✅ Completo — `approved` flag en User |
| Roles (user / admin / superadmin) | ✅ Completo — JWT propagado en sesión |
| Panel admin `/admin/users` | ✅ Completo — listar, aprobar, eliminar, promover |
| HeroBanner rotativo | ✅ Completo con cross-fade |
| Carruseles lazy-load | ✅ Completo |
| Página `/movies` | ✅ Completo — 9 géneros |
| DetailModal | ✅ Completo — hero, metadata, cast, trailers, mute |
| PlayerModal fullscreen | ✅ Completo |
| Servidores de stream (5) | ✅ Completo |
| Multi-audio (UnlimPlay/VidLink) | ✅ Completo |
| Ad-blocking proxy | ✅ Completo |
| Subtítulos overlay | ✅ Completo con offset manual |
| Watchlist | ✅ Completo |
| Historial | ✅ Completo |
| Calificaciones (like/dislike) | ✅ Completo — UI conectada, persistida en MongoDB |
| Búsqueda con filtros | ✅ Completo — tipo, género, año |
| Perfil de usuario | ✅ Completo — edición de nombre, avatar por iniciales |
| Página película `/movie/[id]` | ✅ Completo |
| Página serie `/tv/[id]` | ✅ Completo con selector temporada/episodio |
| Page transitions | ✅ Completo |
| Footer con páginas legales | ✅ Completo |
| Favicon multi-formato | ✅ Completo — .ico 32px, .png 192px, apple-icon 180px |
| Android TV (Capacitor) | ✅ Configurado (dev: IP local) |
| D-Pad navigation (TV) | ✅ Hook implementado |

## Pendiente / Mejoras futuras

| Feature | Prioridad | Notas |
|---|---|---|
| SearchBar component | Media | Stub implementado en `components/search/SearchBar.tsx` |
| Capacitor URL para producción | Alta | Cambiar `server.url` a dominio público antes de distribuir APK |
| PWA (manifest + service worker) | Baja | Para instalación en dispositivos sin Capacitor |
| Página `/tv` (catálogo series) | Baja | Análoga a `/movies`, pendiente de implementar |
