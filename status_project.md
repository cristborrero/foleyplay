# FoleyPlay — Estado del Proyecto
> Última actualización: abril 2026

---

## Resumen ejecutivo

**FoleyPlay** es una plataforma de streaming educativa y no comercial construida como demostración técnica de habilidades full-stack. Replica la experiencia de Netflix con autenticación real, catálogo desde TMDB, reproductores embebidos con ad-blocking proxy, subtítulos sincronizados, y soporte Android TV vía Capacitor.

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

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  (auth)     │  │   (main)     │  │   api/        │  │
│  │  /login     │  │  /browse     │  │  /tmdb/...    │  │
│  │  /register  │  │  /movie/[id] │  │  /history     │  │
│  └─────────────┘  │  /tv/[id]    │  │  /watchlist   │  │
│                   │  /search     │  │  /ratings     │  │
│                   │  /watchlist  │  │  /subtitles   │  │
│                   │  /history    │  │  /proxy/player│  │
│                   │  /legal/*    │  │  /auth/*      │  │
│                   └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                    │                │
         ▼                    ▼                ▼
    NextAuth JWT          MongoDB           TMDB API
    Google OAuth          Atlas             (cacheado 1h)
    Credentials           4 modelos         es-ES default
```

---

## Rutas de la aplicación

### Páginas

| Ruta | Descripción |
|---|---|
| `/` | Redirect a `/browse` (autenticado) o `/login` |
| `/login` | Login email/password + Google OAuth |
| `/register` | Registro de cuenta nueva |
| `/browse` | Home principal — Hero + carruseles |
| `/movie/[id]` | Página completa de película con player |
| `/tv/[id]` | Página de serie con selector de temporada/episodio |
| `/search` | Búsqueda con debounce |
| `/watchlist` | Mi lista personal |
| `/history` | Continuar viendo |
| `/legal/terms` | Términos de uso |
| `/legal/privacy` | Política de privacidad |

### API Routes

| Endpoint | Método | Función |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | Handler NextAuth (session, OAuth) |
| `/api/auth/register` | POST | Crear cuenta (bcrypt hash) |
| `/api/tmdb/[...slug]` | GET | Proxy TMDB API con cache 1h |
| `/api/history` | GET/POST | Historial de reproducción |
| `/api/watchlist` | GET/POST | Mi lista (toggle add/remove) |
| `/api/ratings` | GET/POST/DELETE | Calificaciones (like=5/dislike=1, toggle) |
| `/api/profile` | GET/PATCH | Perfil de usuario (nombre) |
| `/api/subtitles` | GET | Busca subtítulos en OpenSubtitles |
| `/api/subtitles/download` | GET | Descarga y convierte SRT → VTT |
| `/api/proxy/player` | GET | Proxy iframe con ad-blocking |

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
| `components/detail/DetailModal.tsx` | Modal overlay con hero (trailer YT o backdrop), metadata bar, sinopsis expandible, cast row, tab Trailers. Botones: Reproducir, Mi Lista, Like, Dislike, Compartir, **Más información**. Mute/unmute en trailer. Para series: Reproducir y Más información van a la página `/tv/[id]`. |
| `components/player/PlayerModal.tsx` | Modal fullscreen para reproducción. Header con título y temporada/episodio. Hint a los 30s si no carga. ESC cierra. Registra en historial al abrir. |

### Player

| Archivo | Descripción |
|---|---|
| `components/player/ServerSelector.tsx` | Tabs de servidores. Badge "Multi-audio" en UnlimPlay y VidLink. Reload iframe via `key` al cambiar servidor. Modo fullscreen (`flex-1 min-h-0`). |
| `components/player/SubtitleInjector.tsx` | Subtítulos overlay sobre iframe. Timer manual (`performance.now()`). Offset ±0.5s para sincronización. Parser VTT client-side. Toggle CC. |

### UI

| Archivo | Descripción |
|---|---|
| `components/ui/SkeletonCard.tsx` | Placeholder shimmer mientras carga ContentRow. |

### Páginas adicionales

| Archivo | Descripción |
|---|---|
| `app/(main)/profile/page.tsx` | Página de perfil. Edición de nombre. Avatar generado por iniciales con color determinístico. |

---

## Modelos de base de datos

### User
```typescript
{ name, email, image?, password? (bcrypt), createdAt }
// index: email (unique)
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

## Librerías y utilidades

| Archivo | Descripción |
|---|---|
| `lib/auth.ts` | NextAuth config. Google OAuth + Credentials (bcrypt). JWT strategy. Callbacks: inyecta `user.id` y `user.name` en token. Soporta `update()` trigger para propagar cambios de nombre sin re-login. |
| `lib/mongodb.ts` | Conexión Mongoose con global cache pattern. Graceful fallback en build-time para evitar crashes de Next.js al evaluar rutas. |
| `lib/tmdb.ts` | Cliente TMDB. Cache 1h server-side. Inyecta `language=es-ES`. Métodos: trending, popular, top_rated, detail, season, search, discover. |
| `lib/streams.ts` | Array de proveedores de stream. Función `proxy()` apunta a `/api/proxy/player`. |
| `lib/modal-context.tsx` | Context + hook `useModal()`. Estado global para PlayerModal y DetailModal. `openPlayer()`, `openDetail()`, `closePlayer()`, `closeDetail()`. |
| `lib/subtitles.ts` | Integración OpenSubtitles API. `searchSubtitles()` retorna tracks disponibles por idioma. |
| `lib/avatar.ts` | `avatarBg(seed)` — hash determinístico del nombre/email a paleta de 10 colores. `avatarInitials(name)` — extrae hasta 2 iniciales en mayúscula. Sin dependencias externas. |

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
```

---

## Configuración especial

### next.config.ts
```typescript
distDir: '/tmp/netflix-clone-next'     // Build cache en SSD local, no en HDD externo
images.remotePatterns: [
  'image.tmdb.org',                    // Pósters y backdrops
  'img.youtube.com',                   // Thumbnails de trailers
  'www.themoviedb.org',                // Logo TMDB en footer
]
```

### capacitor.config.ts
```typescript
appId: 'com.foleyplay.app'
appName: 'FoleyPlay'
webDir: 'out'                          // Requiere next export
server.url: 'http://172.18.16.70:3000' // IP local para dev en emulador TV
// ⚠️ Cambiar a URL pública antes de build de producción
```

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

> **Nota crítica:** los endpoints `/tv/*` no incluyen `media_type` en cada ítem de la respuesta. El prop `mediaType` en `ContentRow` → `MovieCard` es la solución implementada para evitar que las series abran como películas.

---

## Decisiones técnicas relevantes

| Decisión | Motivo |
|---|---|
| `distDir: '/tmp/...'` | El proyecto vive en HDD externo. Compilar en HDD = lentísimo. `/tmp` en SSD local. |
| Proxy server-side para iframes | Permite inyectar bloqueador de popups y strip de ads antes de servir el HTML al browser. |
| Timer manual en SubtitleInjector | Los iframes de stream son cross-origin — imposible leer `video.currentTime`. Se usa `performance.now()` con offset manual. |
| `AnimatePresence mode="sync"` en HeroBanner | Cross-fade real: imagen entrante y saliente animan simultáneamente. |
| `mediaType` prop en ContentRow | Endpoints específicos de TV (`/tv/popular`) no devuelven `media_type` por ítem. Sin el prop, todas se abrían como películas. |
| Capacitor `server.url` hardcodeada | Para dev en emulador Android TV en red local. Recordar cambiar antes de producción. |
| `@source not` múltiples exclusiones en globals.css | Tailwind v4 escanea todos los archivos del proyecto incluyendo markdown, binarios y el `.next/` local. Se excluyen: `doc/`, `.next/`, `public/`, `**/*.md`, `**/*.log`, `**/*.txt`. El `status_project.md` mencionaba `h-[!]` como texto y Tailwind lo interpretaba como clase CSS. |
| Avatar por iniciales sin servicios externos | Se usa `lib/avatar.ts` con hash determinístico del nombre/email sobre paleta de 10 colores. Sin dependencias de `ui-avatars.com` ni imágenes cargadas por el usuario. |
| Ratings: like=5, dislike=1 | El modelo Rating usa `score: 1-5`. Se mapean los dos estados semánticos a los extremos de la escala. El toggle off llama a DELETE. |
| Filtros de búsqueda: search/multi vs discover | Con texto: `search/multi` + filtrado client-side por tipo/género/año (los resultados incluyen `genre_ids`). Sin texto con filtros: `discover/movie` o `discover/tv` con params server-side. |

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
│   │   ├── movie/[id]/page.tsx
│   │   ├── tv/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
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
│   │   └── proxy/player/route.ts
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
│   └── ui/
│       └── SkeletonCard.tsx
├── hooks/
│   ├── useHistory.ts
│   ├── useTVNavigation.ts
│   └── useWatchlist.ts
├── lib/
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
│   ├── User.ts
│   └── Watchlist.ts
├── public/
│   ├── logo-foleyplay.png
│   └── favicon.webp
├── types/
│   ├── next-auth.d.ts
│   └── tmdb.ts
├── capacitor.config.ts
├── next.config.ts
├── package.json
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
| HeroBanner rotativo | ✅ Completo con cross-fade |
| Carruseles lazy-load | ✅ Completo |
| DetailModal | ✅ Completo — hero, metadata, cast, trailers, mute, Más información |
| PlayerModal fullscreen | ✅ Completo |
| Servidores de stream (5) | ✅ Completo |
| Multi-audio (UnlimPlay/VidLink) | ✅ Completo |
| Ad-blocking proxy | ✅ Completo |
| Subtítulos overlay | ✅ Completo con offset manual |
| Watchlist | ✅ Completo |
| Historial | ✅ Completo |
| Calificaciones (like/dislike) | ✅ Completo — UI conectada, persistida en MongoDB |
| Búsqueda con filtros | ✅ Completo — tipo, género, año; discover cuando no hay texto |
| Perfil de usuario | ✅ Completo — edición de nombre, avatar por iniciales |
| Página película `/movie/[id]` | ✅ Completo |
| Página serie `/tv/[id]` | ✅ Completo con selector temporada/episodio |
| Page transitions | ✅ Completo |
| Footer con páginas legales | ✅ Completo |
| Android TV (Capacitor) | ✅ Configurado (dev: IP local) |
| D-Pad navigation (TV) | ✅ Hook implementado |

## Pendiente / Mejoras futuras

| Feature | Prioridad | Notas |
|---|---|---|
| Capacitor URL para producción | Alta | Cambiar `server.url` a dominio público antes de distribuir APK |
| PWA (manifest + service worker) | Baja | Para instalación en dispositivos sin Capacitor |
