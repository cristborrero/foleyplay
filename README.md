# FoleyPlay 2.0

Plataforma premium de descubrimiento y streaming de entretenimiento, diseñada con un enfoque editorial y moderno. Permite explorar películas, series aclamadas y canales de TV en vivo con acceso abierto inmediato, reproductores multi-servidor con soporte de audio latino y multi-audio, búsqueda reactiva en tiempo real y persistencia local (`localStorage`) para Mi Lista e Historial.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript 5 |
| Estilos | Tailwind CSS v4 + Diseño Editorial Personalizado |
| Animaciones | Framer Motion |
| Persistencia | Almacenamiento Local Reactivo (`localStorage` + eventos personalizados) |
| Metadatos & SEO | TMDB API + JSON-LD (Schema.org) |

## Requisitos previos

- Node.js >= 20
- TMDB API key
- OpenSubtitles API key (opcional, para subtítulos)

## Instalación y ejecución

```bash
git clone <repo-url>
cd 09-netflix-clone
npm install
cp .env.local.example .env.local
# Configurá tu TMDB_API_KEY en .env.local

npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## Variables de entorno

```env
# TMDB
TMDB_API_KEY=tu_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# OpenSubtitles (opcional)
OPENSUBTITLES_API_KEY=
OPENSUBTITLES_USER_AGENT=FoleyPlayApp v1.0

# App pública
NEXT_PUBLIC_APP_NAME="FoleyPlay"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features principales (v2.0)

- **Diseño Editorial & Cinemático**: Paleta oscura refinada (`#080A09`), HeroBanner con degradados suaves y módulo Top 10 numerado de gran escala.
- **Descubrimiento Activo**: Barra interactiva de géneros (`DiscoverySection`) que filtra instantáneamente el catálogo en tiempo real.
- **Acceso Abierto (Zero-Auth)**: Sin pantallas de login ni barreras de registro; acceso directo a todo el catálogo.
- **Buscador en Vivo**: Componente `HeaderSearch` en barra superior con vista previa de resultados y atajos.
- **Biblioteca Personal en LocalStorage**: Mi Lista, Continuar Viendo y Calificaciones sincronizados entre componentes y pestañas del navegador sin requerir base de datos de usuarios.
- **Streaming Multi-Servidor**:
  1. **UnlimPlay** (Predeterminado — Catálogo completo + Multi-audio)
  2. **Latino Directo (HLS)** (Streams HLS directos en audio español latino vía ZonaAPI)
  3. **VidLink** (Multi-audio)
  4. **VidSrc.to**
  5. **MultiEmbed**
  6. **VidSrc.su**
- **Optimización & SEO**: Renderizado dinámico, `generateMetadata` y datos estructurados Schema.org (`Movie` y `TVSeries`).

## Créditos y Atribución

- [TMDB](https://developer.themoviedb.org/docs) — Metadatos de películas y series
- [OpenSubtitles](https://opensubtitles.com) — Subtítulos
- [Next.js](https://nextjs.org/) / [Tailwind CSS](https://tailwindcss.com/)
