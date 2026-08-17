# 📋 Instrucciones para Claude Code: Netflix Clone Personal — Full Stack

> **Documento de instrucciones paso a paso**
> Propósito: Que Claude Code construya un clon de Netflix personal con Next.js 16, TypeScript, TMDB API, múltiples fuentes de streaming embed (VidSrc, SuperEmbed, Embed.su), MongoDB, NextAuth y Tailwind CSS.
> Uso: Estrictamente personal. No comercial. Para aprendizaje y disfrute.

---

## ⚙️ CÓMO USAR ESTE DOCUMENTO

Entrega estas instrucciones a Claude Code **una a una**, en el orden indicado. Cada paso tiene su número. Claude puede y debe hacer preguntas de aclaración antes de avanzar al siguiente paso. **No ejecutes el siguiente paso hasta que el anterior esté completo y aprobado.**

---

## PASO 1 — Contexto General del Proyecto

**[Entregar esto primero]**

Necesito que construyas un clon de Netflix personal con las siguientes características:

- Catálogo completo de películas y series usando **TMDB API** (metadatos en español latino `es-419`).
- Reproducción mediante **iframes embed** de múltiples proveedores: VidSrc, SuperEmbed, Embed.su — el usuario puede cambiar de server si uno falla.
- UI idéntica en experiencia a Netflix: hero banner, filas horizontales por categoría, hover con preview, modal de detalle, player en modal.
- Autenticación con **NextAuth** (Google OAuth o credenciales simples).
- **MongoDB** para guardar: watchlist personal, historial de visualización, calificaciones personales.
- Soporte completo de **subtítulos en español latino** inyectables al player.

Antes de continuar, si tienes dudas sobre el stack, la estructura o el entorno de desarrollo, pregúntame ahora.

---

## PASO 2 — Stack Tecnológico y Versiones

**[Entregar después de confirmar el paso 1]**

Usa exactamente este stack. No propongas alternativas a menos que haya un problema técnico grave:

### Frontend
- **Next.js 15** con App Router
- **TypeScript** (estricto)
- **Tailwind CSS v4**
- **Framer Motion** — animaciones de hover, transiciones de página, aparición de modales

### Base de datos y autenticación
- **MongoDB** con **Mongoose** como ODM
- **NextAuth.js v5** — proveedor Google OAuth + opción de credenciales (email/password)

### APIs externas
- **TMDB API** (gratuita) — todo el catálogo, imágenes, trailers, metadatos
- **VidSrc** — `https://vidsrc.ru/embed/`
- **SuperEmbed** — `https://multiembed.mov/`
- **Embed.su** — `https://embed.su/embed/`
- **OpenSubtitles API** (gratuita, tier básico) — subtítulos en español latino

### Herramientas de desarrollo
- **ESLint + Prettier** configurados
- **Variables de entorno** con `.env.local`

Presenta confirmación del stack antes de continuar. No escribas código aún.

---

## PASO 3 — APIs, Keys y Accesos Necesarios

**[Entregar después de confirmar el stack]**

Antes de escribir una sola línea de código, genera una lista completa de todo lo que necesito configurar:

### 3.1 — Tabla de APIs requeridas

Genera una tabla con columnas: **Servicio | Para qué se usa | URL para obtenerla | Plan gratuito (Sí/No) | Límites del plan gratuito**

Incluye como mínimo:
- TMDB API
- NextAuth (Google OAuth — Google Cloud Console)
- MongoDB Atlas (base de datos cloud gratuita)
- OpenSubtitles API
- VidSrc / SuperEmbed / Embed.su (sin API key, solo URL de embed)

### 3.2 — Variables de entorno necesarias

Lista todas las variables que irán en `.env.local`, organizadas por sección, con comentario de para qué sirve cada una. No incluyas valores reales, solo los nombres de las variables.

### 3.3 — Configuración de MongoDB Atlas

Explica paso a paso cómo crear la base de datos gratuita en MongoDB Atlas y obtener el connection string.

### 3.4 — Configuración de Google OAuth

Explica paso a paso cómo configurar el proyecto en Google Cloud Console para NextAuth con Google.

Presenta toda esta información. Espera mi confirmación de que tengo todos los accesos antes de continuar.

---

## PASO 4 — Estructura del Proyecto

**[Entregar después de confirmar los accesos]**

Crea la estructura completa de carpetas y archivos. Usa esta base y mejórala si es necesario:

```
netflix-clone/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── browse/
│   │   │   └── page.tsx          ← Home principal tipo Netflix
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Detalle de película
│   │   ├── tv/
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Detalle de serie
│   │   ├── search/
│   │   │   └── page.tsx          ← Resultados de búsqueda
│   │   ├── watchlist/
│   │   │   └── page.tsx          ← Mi lista personal
│   │   └── history/
│   │       └── page.tsx          ← Historial de vistos
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── tmdb/
│   │   │   └── [...slug]/
│   │   │       └── route.ts      ← Proxy de TMDB (oculta API key)
│   │   ├── watchlist/
│   │   │   └── route.ts
│   │   ├── history/
│   │   │   └── route.ts
│   │   └── ratings/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx                  ← Redirect a /browse si logueado, si no a /login
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            ← Barra superior tipo Netflix
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx        ← Banner grande con backdrop y trailer
│   │   └── ContentRow.tsx        ← Fila horizontal de posters con scroll
│   ├── cards/
│   │   ├── MovieCard.tsx         ← Card con hover expandido tipo Netflix
│   │   └── EpisodeCard.tsx       ← Card para episodios de series
│   ├── detail/
│   │   ├── DetailModal.tsx       ← Modal con info completa del título
│   │   ├── CastRow.tsx           ← Fila de actores
│   │   ├── SimilarRow.tsx        ← Títulos similares
│   │   └── SeasonSelector.tsx    ← Selector de temporada y episodio
│   ├── player/
│   │   ├── PlayerModal.tsx       ← Modal del reproductor embed
│   │   ├── ServerSelector.tsx    ← Botones para cambiar server
│   │   └── SubtitleInjector.tsx  ← Inyección de subtítulos al iframe
│   ├── search/
│   │   └── SearchBar.tsx
│   └── ui/
│       ├── LoadingSpinner.tsx
│       ├── SkeletonCard.tsx
│       └── StarRating.tsx        ← Calificación personal
├── lib/
│   ├── tmdb.ts                   ← Todas las funciones de TMDB API
│   ├── streams.ts                ← URLs de embed de todos los providers
│   ├── subtitles.ts              ← Integración OpenSubtitles
│   ├── mongodb.ts                ← Conexión a MongoDB
│   └── auth.ts                   ← Configuración NextAuth
├── models/
│   ├── User.ts
│   ├── Watchlist.ts
│   ├── History.ts
│   └── Rating.ts
├── .env.local.example
├── .env.local                    ← (en .gitignore)
├── .gitignore
├── package.json
└── README.md
```

Crea todos los archivos con su estructura base (imports, exports, sin lógica aún). Luego espera aprobación.

---

## PASO 5 — Modelos de Base de Datos (MongoDB)

**[Entregar después de aprobar la estructura]**

Construye los 4 modelos de Mongoose con sus tipos TypeScript:

### 5.1 — `User`
```
- _id
- name: string
- email: string (único)
- image: string (avatar, de Google OAuth)
- password: string (hasheada, solo si usa credenciales)
- createdAt: Date
```

### 5.2 — `Watchlist`
```
- _id
- userId: ObjectId → ref User
- tmdbId: number
- mediaType: 'movie' | 'tv'
- title: string
- posterPath: string
- addedAt: Date
```

### 5.3 — `History`
```
- _id
- userId: ObjectId → ref User
- tmdbId: number
- mediaType: 'movie' | 'tv'
- title: string
- posterPath: string
- season?: number       ← solo para series
- episode?: number      ← solo para series
- watchedAt: Date
- progress: number      ← porcentaje visto (0-100), para "continuar viendo"
```

### 5.4 — `Rating`
```
- _id
- userId: ObjectId → ref User
- tmdbId: number
- mediaType: 'movie' | 'tv'
- score: number (1-5 estrellas)
- ratedAt: Date
```

Construye los modelos completos con validaciones. Espera aprobación.

---

## PASO 6 — Integración TMDB API (`lib/tmdb.ts`)

**[Entregar después de aprobar los modelos]**

Construye el módulo completo de TMDB con todas las funciones necesarias. Todas las llamadas deben usar `language=es-419` para español latino como default:

### Funciones requeridas:

**Películas:**
- `getTrending(timeWindow: 'day' | 'week')` — en tendencia
- `getPopularMovies(page?)` — populares
- `getTopRatedMovies(page?)` — mejor valoradas
- `getUpcomingMovies()` — próximamente
- `getMoviesByGenre(genreId, page?)` — por género
- `getMovieDetails(id)` — detalle completo con `append_to_response=videos,credits,similar,recommendations,images`
- `getMovieVideos(id)` — trailers (filtrar type === 'Trailer' site === 'YouTube')
- `searchMovies(query, page?)` — búsqueda

**Series:**
- `getPopularTV(page?)` — series populares
- `getTopRatedTV(page?)` — mejor valoradas
- `getTVDetails(id)` — detalle completo
- `getTVSeason(id, seasonNumber)` — episodios de una temporada
- `getTVEpisode(id, season, episode)` — detalle de un episodio
- `searchTV(query, page?)` — búsqueda

**General:**
- `searchMulti(query, page?)` — búsqueda global (películas + series + personas)
- `getGenres(mediaType: 'movie' | 'tv')` — lista de géneros
- `getImageUrl(path, size?)` — construye URL completa de imagen desde CDN TMDB

### Importante:
- Todas las funciones deben manejar errores con try/catch y retornar null en caso de error.
- Construye una función base `fetchTMDB(endpoint, params?)` que centralice headers y base URL.
- Las llamadas a TMDB deben hacerse SOLO desde API Routes de Next.js (server-side), nunca expongas la API key en el cliente.

Construye el módulo completo. Espera aprobación.

---

## PASO 7 — Módulo de Streams (`lib/streams.ts`)

**[Entregar después de aprobar TMDB]**

Construye el módulo que genera las URLs de embed para cada proveedor. La app mostrará el player en un `<iframe>` con estas URLs:

### Proveedores a implementar:

```typescript
// PELÍCULAS — reciben TMDB ID o IMDB ID
VidSrc:     `https://vidsrc.ru/embed/movie/${tmdbId}`
SuperEmbed: `https://multiembed.mov/?video_id=${imdbId}&tmdb=1`
EmbedSu:    `https://embed.su/embed/movie/${tmdbId}`
VidSrcTo:   `https://vidsrc.to/embed/movie/${imdbId}`

// SERIES — reciben ID + season + episode
VidSrc:     `https://vidsrc.ru/embed/tv/${tmdbId}/${season}/${episode}`
SuperEmbed: `https://multiembed.mov/?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`
EmbedSu:    `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
VidSrcTo:   `https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`
```

### Estructura del módulo:
```typescript
export type StreamProvider = 'vidsrc' | 'superembed' | 'embedsu' | 'vidsrcto';

export interface StreamSource {
  name: string;
  provider: StreamProvider;
  url: string;
  badge?: string; // ej: "HD", "Multi"
}

// Retorna array con todos los servers disponibles para un título
export function getMovieStreams(tmdbId: number, imdbId: string): StreamSource[]
export function getTVStreams(tmdbId: number, imdbId: string, season: number, episode: number): StreamSource[]
```

Construye el módulo completo con tipos TypeScript. Espera aprobación.

---

## PASO 8 — Autenticación con NextAuth (`lib/auth.ts`)

**[Entregar después de aprobar Streams]**

Configura NextAuth v5 con dos proveedores:

### 8.1 — Google OAuth
- Configurar el provider de Google con `clientId` y `clientSecret` desde variables de entorno.
- Al hacer login con Google, crear el usuario en MongoDB si no existe (upsert).
- Guardar en sesión: `id`, `name`, `email`, `image`.

### 8.2 — Credenciales (email + password)
- Permitir registro manual con email y contraseña.
- Hashear la contraseña con `bcryptjs` antes de guardar en MongoDB.
- Validar email único en registro.
- En login, comparar hash.

### 8.3 — Middleware de protección de rutas
- Todas las rutas bajo `/(main)/` deben requerir autenticación.
- Si no hay sesión, redirigir a `/login`.
- La ruta raíz `/` redirige a `/browse` si hay sesión, a `/login` si no.

### 8.4 — API Routes de NextAuth
- Crear `app/api/auth/[...nextauth]/route.ts` con la configuración completa.

Construye la autenticación completa. Espera aprobación.

---

## PASO 9 — API Routes del Backend

**[Entregar después de aprobar la autenticación]**

Construye todas las API Routes internas de Next.js:

### 9.1 — Proxy de TMDB `app/api/tmdb/[...slug]/route.ts`
- Recibe cualquier petición y la redirige a TMDB con la API key del servidor.
- Agrega siempre `language=es-419`.
- El cliente solo llama a `/api/tmdb/...` nunca directamente a TMDB.
- Implementar caché con `revalidate` de Next.js (30 minutos para listas, 24h para detalles).

### 9.2 — Watchlist `app/api/watchlist/route.ts`
- `GET` — obtiene la watchlist del usuario autenticado.
- `POST` — agrega un título a la watchlist.
- `DELETE` — elimina un título de la watchlist (por `tmdbId` + `mediaType`).
- Verificar sesión en cada request. Retornar 401 si no hay sesión.

### 9.3 — Historial `app/api/history/route.ts`
- `GET` — obtiene el historial del usuario (ordenado por `watchedAt` desc).
- `POST` — registra un título como visto (o actualiza si ya existe).
- `PATCH` — actualiza el progreso de visualización (campo `progress`).

### 9.4 — Calificaciones `app/api/ratings/route.ts`
- `GET` — obtiene todas las calificaciones del usuario.
- `POST` — guarda o actualiza la calificación de un título.

Construye todas las rutas con manejo de errores y validación. Espera aprobación.

---

## PASO 10 — UI: Página de Login

**[Entregar después de aprobar las API Routes]**

Construye la página de login en `app/(auth)/login/page.tsx`:

### Diseño:
- Fondo: imagen de backdrop de película con overlay oscuro semitransparente.
- Centrado en pantalla: formulario con el logo de la app arriba.
- Logo: texto estilizado en rojo intenso tipo Netflix (puede variar el nombre).
- Dos opciones visibles:
  1. Botón **"Continuar con Google"** (ícono de Google + texto).
  2. Formulario con **email + contraseña** + botón de login.
- Link para ir a la página de registro.
- En móvil: el formulario ocupa todo el ancho con padding lateral.

### Comportamiento:
- Al hacer login exitoso, redirigir a `/browse`.
- Mostrar error inline si las credenciales son incorrectas.
- Mostrar spinner mientras carga.
- El botón de Google debe mostrar el estado de carga.

Construye la página completa con estilos Tailwind. Espera aprobación.

---

## PASO 11 — UI: Navbar

**[Entregar después de aprobar Login]**

Construye el Navbar en `components/layout/Navbar.tsx`:

### Diseño (idéntico en concepto a Netflix):
- **Fondo**: transparente cuando el scroll está en top, negro semitransparente con blur al hacer scroll.
- **Izquierda**: logo de la app en rojo.
- **Centro** (desktop): links de navegación: Inicio | Películas | Series | Mi Lista.
- **Derecha**: barra de búsqueda colapsable (ícono que se expande al click) + avatar del usuario con menú desplegable (Historial | Cerrar sesión).
- **Móvil/Desktop**: menú hamburguesa en móvil, links directos en desktop. Barra superior con scroll-to-solid.

### Comportamiento:
- Al hacer scroll, el fondo cambia de transparente a negro con blur.
- Barra de búsqueda colapsable funcional.
- Menú de usuario funcional.

Construye el Navbar completo con animaciones Framer Motion. Espera aprobación.

---

## PASO 12 — UI: Hero Banner

**[Entregar después de aprobar Navbar]**

Construye el Hero Banner en `components/home/HeroBanner.tsx`:

### Diseño:
- Ocupa el 80% del viewport de altura.
- Fondo: imagen backdrop de alta resolución (1280px) del título destacado, con gradiente oscuro hacia abajo y hacia la izquierda.
- **Sobre el backdrop** (posición inferior izquierda):
  - Título de la película/serie en texto grande (tipografía bold).
  - Calificación TMDB (⭐ X.X) + año + clasificación de edad + duración.
  - Sinopsis limitada a 3 líneas con truncado.
  - Dos botones grandes: **▶ Reproducir** (blanco, relleno) y **ℹ Más info** (gris semitransparente).
- El título destacado debe rotarse automáticamente cada 8 segundos entre los primeros 5 títulos de trending.
- Transición suave entre títulos con fade.

### Comportamiento:
- Al hacer click en "Reproducir", abrir el PlayerModal directamente.
- Al hacer click en "Más info", abrir el DetailModal.

Construye el HeroBanner completo. Espera aprobación.

---

## PASO 13 — UI: ContentRow (Filas de catálogo)

**[Entregar después de aprobar Hero Banner]**

Construye el ContentRow en `components/home/ContentRow.tsx` y el MovieCard en `components/cards/MovieCard.tsx`:

### ContentRow:
- Título de la fila a la izquierda (ej: "En tendencia esta semana").
- Fila de cards con scroll horizontal.
- Flechas de navegación izquierda/derecha que aparecen en hover.
- Scroll suave al hacer click en las flechas (avanza ~4 cards).


### MovieCard (hover expandido, tipo Netflix):
- **Estado normal**: poster vertical, bordes redondeados.
- **Estado hover** (después de 400ms de delay): la card se expande (scale 1.3), sube ligeramente, muestra:
  - Backdrop pequeño arriba (en lugar del poster).
  - Botones pequeños: ▶ Reproducir | ➕ Mi lista | 👍 Me gusta | ⌄ Más info.
  - Título del contenido.
  - Badges de info: calificación, año, duración, géneros.
- La card expandida no debe salirse de la pantalla (detectar si está al borde y expandir en dirección contraria).
- Animaciones con Framer Motion.

### Comportamiento:
- Al hacer click: abrir el DetailModal.

Construye ambos componentes completos. Espera aprobación.

---

## PASO 14 — UI: DetailModal

**[Entregar después de aprobar ContentRow]**

Construye el DetailModal en `components/detail/DetailModal.tsx`:

### Diseño (tipo Netflix al hacer clic en "Más info"):
- Se abre como modal fullscreen o 90% de la pantalla con scroll interno.
- Fondo oscuro semitransparente detrás.
- **Header**: backdrop grande con gradiente + trailer de YouTube autoreproducido en mute (si existe) como fondo animado + título grande encima + año, calificación, duración, géneros.
- **Botones de acción**: ▶ Reproducir | ➕/✓ Mi Lista | ⭐ Calificar.
- **Sección de info**: sinopsis completa + reparto principal (fotos + nombre + personaje).
- **Para Series**: selector de temporada (dropdown) + grid de episodios con still image, número, título y sinopsis de cada episodio.
- **Sección "Más como esto"**: fila de ContentRow con títulos similares.
- Botón X para cerrar en la esquina superior derecha.

### Comportamiento:
- Al hacer click en ▶ Reproducir, abrir el PlayerModal.
- Para series, al hacer click en un episodio, abrir el PlayerModal con esa temporada y episodio.
- Al agregar a Mi Lista, cambiar el ícono de ➕ a ✓ inmediatamente (optimistic update).
- El trailer de fondo debe pausarse si el usuario abre el PlayerModal.

Construye el DetailModal completo. Espera aprobación.

---

## PASO 15 — UI: PlayerModal

**[Entregar después de aprobar DetailModal]**

Construye el PlayerModal en `components/player/PlayerModal.tsx` y el ServerSelector en `components/player/ServerSelector.tsx`:

### Diseño del PlayerModal:
- Modal fullscreen oscuro.
- En el centro: `<iframe>` que ocupa el 90% del ancho y 80% del alto.
- El iframe carga la URL del server activo (VidSrc por default).
- **Sobre el iframe** (esquina superior):
  - Botón X para cerrar.
  - Título del contenido que se está reproduciendo.
  - Para series: indicador de "T1 E3 — Título del episodio".

### ServerSelector:
- Barra de botones debajo del iframe: **VidSrc | SuperEmbed | Embed.su | VidSrc.to**
- El server activo aparece resaltado.
- Al cambiar server, el iframe recarga con la nueva URL.
- Si el usuario lleva más de 30 segundos sin que el iframe cargue, mostrar un mensaje "¿El video no carga? Prueba otro server" con sugerencia de hacer click en otro.

### Registro en historial:
- Al abrir el PlayerModal, registrar el título en el historial vía `POST /api/history`.
- Al cerrar, actualizar el progreso en `PATCH /api/history`.

### Registro en historial:
- Al abrir el PlayerModal, registrar el título en el historial vía `POST /api/history`.
- Al cerrar, actualizar el progreso en `PATCH /api/history`.

Construye el PlayerModal y ServerSelector completos. Espera aprobación.

---

## PASO 16 — UI: Página Browse (Home Principal)

**[Entregar después de aprobar PlayerModal]**

Construye la página principal en `app/(main)/browse/page.tsx`:

### Composición de filas (en orden):
1. **HeroBanner** — título trending del día
2. **ContentRow**: "Continuar viendo" — historial reciente del usuario (si tiene)
3. **ContentRow**: "En tendencia esta semana" — `getTrending('week')`
4. **ContentRow**: "Películas populares" — `getPopularMovies()`
5. **ContentRow**: "Series populares" — `getPopularTV()`
6. **ContentRow**: "Mejor valoradas" — `getTopRatedMovies()`
7. **ContentRow**: "Series mejor valoradas" — `getTopRatedTV()`
8. **ContentRow**: "Acción y aventura" — `getMoviesByGenre(28)`
9. **ContentRow**: "Comedia" — `getMoviesByGenre(35)`
10. **ContentRow**: "Drama" — `getMoviesByGenre(18)`
11. **ContentRow**: "Ciencia ficción" — `getMoviesByGenre(878)`
12. **ContentRow**: "Mi Lista" — watchlist del usuario (si tiene ítems)

### Rendimiento:
- Las primeras 3 filas cargan en SSR.
- Las demás filas cargan con lazy loading (Intersection Observer) al hacer scroll.
- Skeletons mientras cargan.

Construye la página Browse completa. Espera aprobación.

---

## PASO 17 — UI: Páginas de Detalle y Búsqueda

**[Entregar después de aprobar Browse]**

Construye las páginas restantes:

### 17.1 — `app/(main)/search/page.tsx`
- Barra de búsqueda grande en el top de la página.
- Debounce de 400ms antes de hacer la búsqueda.
- Resultados en grid: películas, series y personas mezclados (búsqueda en `searchMulti`).
- Filtros: Todos | Películas | Series.
- Si no hay búsqueda activa, mostrar "Búsquedas populares" con thumbnails.

### 17.2 — `app/(main)/watchlist/page.tsx`
- Grid de todos los títulos en Mi Lista.
- Opción de eliminar cada ítem.
- Ordenar por: fecha agregada | nombre | calificación TMDB.
- Mensaje de empty state si la lista está vacía.

### 17.3 — `app/(main)/history/page.tsx`
- Lista de títulos vistos recientemente.
- Para series: mostrar qué temporada y episodio fue el último visto.
- Opción de eliminar ítems del historial.
- Barra de progreso visual por cada ítem (si tiene progreso guardado).

Construye las tres páginas. Espera aprobación.

---

---

## PASO 18 — Variables de Entorno y Archivos de Configuración



Crea los archivos de configuración finales:

### 20.1 — `.env.local.example`
Archivo con todas las variables de entorno comentadas y organizadas:
```env
# ============================================================
# NETFLIX CLONE — Variables de Entorno
# ============================================================

# --- TMDB ---
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# --- MongoDB ---
MONGODB_URI=

# --- NextAuth ---
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# --- Google OAuth ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# --- OpenSubtitles ---
OPENSUBTITLES_API_KEY=
OPENSUBTITLES_USER_AGENT=

# --- App Config ---
NEXT_PUBLIC_APP_NAME=Mi Netflix
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 20.2 — `.gitignore`
- **Git**: asegura incluir `.env.local`, `node_modules/` y `.next/` en el `.gitignore`.

### 20.3 — `README.md`
Crea un README completo con:
- Descripción del proyecto.
- Requisitos previos.
- Pasos de instalación.
- Configuración de variables de entorno.
- Cómo ejecutar en desarrollo.
- Créditos y APIs usadas.

Construye todos los archivos de configuración. Espera aprobación.

---

## PASO 21 — Pruebas y Validación Final

**[Último paso antes de entregar el proyecto]**

Antes de dar el proyecto por listo, verifica y prueba lo siguiente:

### 21.1 — Checklist funcional

**Autenticación:**
- [ ] Login con Google funciona.
- [ ] Login con email/password funciona.
- [ ] Las rutas protegidas redirigen si no hay sesión.

**Catálogo:**
- [ ] La página Browse carga correctamente con todas las filas.
- [ ] El Hero Banner muestra un título trending con backdrop.
- [ ] Las cards muestran el hover expandido correctamente.

**Detalle:**
- [ ] El DetailModal muestra toda la info: sinopsis, reparto, géneros, rating.
- [ ] Para series, muestra las temporadas y episodios.
- [ ] El trailer de YouTube se reproduce en el backdrop del modal.

**Player:**
- [ ] El PlayerModal abre con VidSrc por defecto.
- [ ] El cambio de server funciona correctamente.
- [ ] El historial se registra al abrir el player.

**Watchlist e historial:**
- [ ] Agregar y quitar de Mi Lista funciona.
- [ ] El historial muestra los títulos vistos.

**Búsqueda:**
- [ ] La búsqueda retorna resultados en tiempo real.
- [ ] Los filtros por tipo funcionan.

**Búsqueda:**
- [ ] La búsqueda retorna resultados en tiempo real.
- [ ] Los filtros por tipo funcionan.

### 21.2 — Entregable final

Al pasar todas las pruebas, entrega:
- ✅ Checklist completo de lo construido.
- 📋 Instrucciones paso a paso para correr el proyecto desde cero.

- ⚠️ Lista de limitaciones conocidas y mejoras futuras sugeridas.

---

## 📌 NOTAS ADICIONALES PARA CLAUDE CODE

- **Prioriza que funcione** sobre la perfección del código. Primero end-to-end funcionando, luego optimización.
- **TypeScript estricto**: todos los componentes y funciones deben tener tipos correctos, sin `any`.
- **Manejo de errores**: los fallos de API (TMDB caído, stream que no carga) deben mostrar mensajes amigables al usuario, nunca pantallas en blanco.
- **Experiencia de Usuario**: prioriza la fluidez de navegación y la claridad de los elementos interactivos.
- **Seguridad**: la TMDB API key y las credenciales de MongoDB NUNCA deben llegar al cliente. Siempre server-side.
- **No localStorage**: evitar localStorage para datos importantes; usar MongoDB para persistencia real. Usar estado de React o Context para datos temporales.
- **Responsive**: la app debe ser totalmente responsiva, funcionando perfectamente en desktop, tablets y dispositivos móviles.
- **Performance**: usar `next/image` para todas las imágenes, lazy loading en filas inferiores, skeleton loaders en todas las secciones que cargan datos async.

---

*Documento preparado para uso con Claude Code. Versión 1.0 — Netflix Clone Personal*
