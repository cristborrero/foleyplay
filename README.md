# FoleyPlay

Plataforma de streaming educativa y no comercial construida como demostración técnica full-stack. Replica la experiencia de Netflix con autenticación real, catálogo desde TMDB, reproductores embebidos con ad-blocking proxy, subtítulos sincronizados, y soporte Android TV vía Capacitor.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Auth | NextAuth v5 beta (Credentials + Google OAuth) |
| Base de datos | MongoDB Atlas + Mongoose |
| Mobile/TV | Capacitor Android 8 |

## Requisitos previos

- Node.js >= 20
- Cuenta en MongoDB Atlas
- Google Cloud Console — OAuth 2.0 credentials
- TMDB API key
- OpenSubtitles API key (opcional, para subtítulos)

## Instalación

```bash
git clone <repo-url>
cd 09-netflix-clone
npm install
cp .env.local.example .env.local
# Editá .env.local con tus credenciales
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Variables de entorno

```env
TMDB_API_KEY=
TMDB_BASE_URL=https://api.themoviedb.org/3
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENSUBTITLES_API_KEY=
OPENSUBTITLES_USER_AGENT=FoleyPlayApp v1.0
```

## Features principales

- Autenticación email/password y Google OAuth
- Catálogo TMDB con carruseles lazy-load y HeroBanner rotativo
- Búsqueda con filtros por tipo, género y año
- Reproductores embebidos con ad-blocking proxy server-side
- Multi-audio vía UnlimPlay y VidLink
- Subtítulos overlay sincronizados manualmente
- Watchlist, historial de reproducción y calificaciones (like/dislike)
- Perfil de usuario con avatar generado por iniciales
- Soporte D-Pad para Android TV

## Proveedores de stream

| Proveedor | Modo | Multi-audio |
|---|---|---|
| UnlimPlay | Direct | ✅ |
| VidLink | Direct | ✅ |
| 2Embed | Proxied (ad-blocked) | ❌ |
| StreamIMDb | Proxied (ad-blocked) | ❌ |
| Embed.su | Direct | ❌ |

## Android TV (Capacitor)

```bash
# Cambiar server.url en capacitor.config.ts a la URL de producción
npm run build
npx cap sync android
# Abrir en Android Studio o instalar via ADB
```

> ⚠️ `capacitor.config.ts` tiene `server.url` apuntando a IP local para desarrollo. Cambiar a URL pública antes de distribuir el APK.

## Créditos

- [TMDB](https://developer.themoviedb.org/docs) — catálogo de películas y series
- [OpenSubtitles](https://opensubtitles.com) — subtítulos
- [Next.js](https://nextjs.org/) / [Tailwind CSS](https://tailwindcss.com/)
