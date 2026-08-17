# FoleyPlay 2.0 — Estado del Proyecto

> Última actualización: Agosto 2026 (Versión 2.0 Editorial & Open Access)

---

## Resumen ejecutivo

**FoleyPlay 2.0** es una plataforma de streaming y descubrimiento cinematográfico premium con una identidad visual editorial oscura (`#080A09`) y acentos funcionales en verde lima (`#CEFF00`). Ofrece acceso abierto inmediato (Zero-Auth con persistencia en `localStorage`), catálogo enriquecido desde TMDB, navegación interactiva por géneros en tiempo real, búsqueda debounced en vivo, streaming multi-servidor con soporte de audio latino nativo (HLS) y multi-audio, televisión en vivo (IPTV + EPG), y una arquitectura Next.js 16 optimizada para Cloudflare Pages / Vercel.

---

## Stack tecnológico

| Capa          | Tecnología                      | Versión       |
| ------------- | ------------------------------- | ------------- |
| Framework     | Next.js (App Router, Turbopack) | 16.2.4        |
| UI            | React                           | 19.2.4        |
| Lenguaje      | TypeScript                      | 5             |
| Estilos       | Tailwind CSS v4 + Tokens v2.0   | 4.x           |
| Animaciones   | Framer Motion                   | 12.38.0       |
| Iconos        | Lucide React                    | 1.11.0        |
| Almacenamiento| localStorage reactivo           | Nativo        |
| HLS / Streams | Hls.js + HTML5 Custom Player    | 1.6.16        |
| Metadatos/SEO | TMDB API + Schema.org (JSON-LD) | v3            |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
│                                                             │
│  ┌─────────────────────────────────┐  ┌──────────────────┐  │
│  │             (main)              │  │      api/        │  │
│  │  /browse                        │  │  /tmdb/...       │  │
│  │  /movie/[id]                    │  │  /subtitles      │  │
│  │  /tv/[id]                       │  │  /proxy/player   │  │
│  │  /movies                        │  │  /proxy/stream   │  │
│  │  /tv                            │  │  /iptv/epg       │  │
│  │  /search                        │  │  /providers/latam│  │
│  │  /watchlist                     │  │  /providers/...  │  │
│  │  /history                       │  └──────────────────┘  │
│  │  /tv-en-vivo                    │                        │
│  │  /legal/*                       │                        │
│  └─────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
    localStorage (Browser)                 TMDB API
    - Watchlist (Mi Lista)                 (cacheado 1h)
    - Continuar Viendo (Historial)         es-MX default
    - Calificaciones (Like/Dislike)
```

---

## Rutas de la aplicación

### Páginas

| Ruta             | Descripción                                              | Acceso  |
| ---------------- | -------------------------------------------------------- | ------- |
| `/`              | Redirección inmediata a `/browse`                        | Público |
| `/browse`        | Home editorial — HeroBanner, DiscoveryStrip, Top 10, etc.| Público |
| `/movies`        | Catálogo interactivo de películas con filtro de género   | Público |
| `/tv`            | Catálogo interactivo de series con filtro de género      | Público |
| `/movie/[id]`    | Vista completa de película, metadatos, trailer y player  | Público |
| `/tv/[id]`       | Vista completa de serie, selector de temporadas/episodios| Público |
| `/search`        | Búsqueda debounced en vivo con filtros avanzados         | Público |
| `/watchlist`     | Mi lista personal (sincronizada en localStorage)         | Público |
| `/history`       | Historial y continuar viendo (localStorage)              | Público |
| `/tv-en-vivo`    | Guía EPG y reproductor de canales IPTV en vivo           | Público |
| `/legal/terms`   | Términos de uso                                          | Público |
| `/legal/privacy` | Política de privacidad                                   | Público |

---

## Componentes principales

### Layout
- `components/layout/Navbar.tsx`: Navbar editorial (72–80px) con navegación activa, selector móvil y buscador integrado.
- `components/layout/HeaderSearch.tsx`: Buscador interactivo en vivo con ventana emergente de resultados y atajos.
- `components/layout/Footer.tsx`: Estructura informativa multi-columna, enlaces legales y atribución de TMDB.
- `components/layout/PageTransition.tsx`: Transición suave entre páginas usando Framer Motion.

### Descubrimiento & Home
- `components/home/DiscoverySection.tsx`: Motor de filtrado reactivo por chips de género que recarga el catálogo en tiempo real sin recargar la página.
- `components/home/DiscoveryStrip.tsx`: Tira de píldoras de categorías y géneros con scroll horizontal.
- `components/home/HeroBanner.tsx`: Hero rotativo cinemático con degradados oscuros suaves y llamadas a la acción.
- `components/home/TopTenRow.tsx`: Fila Top 10 con tipografía de trazo numerada de gran escala.
- `components/home/EditorialSpotlight.tsx`: Banners de colecciones editoriales y títulos destacados.
- `components/home/ContentRow.tsx` & `UserContentRow.tsx`: Carruseles con lazy-loading y enlaces de exploración.

### Catálogo
- `components/catalog/GenreCatalog.tsx`: Sistema de filtrado reactivo por género para las vistas `/movies` y `/tv`.
- `components/cards/MovieCard.tsx`: Tarjetas de contenido con elevación contenida (`scale: 1.03`), badge de calidad y acciones rápidas.

### Reproducción y Streaming
- `components/player/ServerSelector.tsx`: Selector de servidores con distintivos claros de *Latino* y *Multi-audio*.
- `components/player/PlayerModal.tsx`: Modal cinemático de reproducción.
- `components/player/LivePlayer.tsx`: Reproductor de canales de televisión en vivo (HLS/IPTV).
- `app/api/providers/latam/route.ts` & `player/route.ts`: Extractor y reproductor directo para streams HLS en español latino (ZonaAPI).

---

## Proveedores de Streaming

| # | Proveedor | Tipo | Características |
|---|---|---|---|
| 1 | **UnlimPlay** (Predeterminado) | Direct Embed | Cobertura total de TMDB + Multi-audio |
| 2 | **Latino Directo (HLS)** | Direct HLS (`.m3u8`) | Audio Latino nativo sin anuncios invasivos |
| 3 | **VidLink** | Direct Embed | Multi-audio |
| 4 | **VidSrc.to** | Direct Embed | Alternativa directa |
| 5 | **MultiEmbed** | Direct Embed | Alternativa directa |
| 6 | **VidSrc.su** | Direct Embed | Alternativa con soporte IMDb |

---

## Decisiones técnicas v2.0

1. **Zero-Auth (Acceso Abierto)**: Se eliminó NextAuth, rutas de login/registro y base de datos de usuarios para garantizar una experiencia de consumo inmediata sin fricción de autenticación.
2. **Persistencia Local Reactiva**: Mi Lista, Historial y Calificaciones se gestionan en `localStorage` sincronizándose en tiempo real entre pestañas y componentes mediante eventos personalizados de `window`.
3. **Diseño Editorial & Tokens Oscuros**: Paleta `#080A09` con superficies `#101310` y `#151815`, bordes `rgba(255,255,255,0.08)` y acentos `#CEFF00` funcionales sin halos fluorescentes saturados.
4. **Filtrado Reactivo TMDB**: Carga dinámica bajo demanda de títulos por género en `/browse`, `/movies` y `/tv` con paginación integrada y sub-filtros de tipo.
5. **Streaming Latino HLS Directo**: Integración con ZonaAPI para extraer enlaces HLS limpios en audio latino y reproducirlos en un player HTML5/Hls.js personalizado.
6. **SEO & Datos Estructurados**: Implementación de metadatos dinámicos (`generateMetadata`) y JSON-LD (`schema.org/Movie` y `schema.org/TVSeries`).
