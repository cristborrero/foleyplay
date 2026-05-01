# FoleyPlay

Plataforma de streaming educativa y no comercial construida como demostración técnica full-stack. Replica la experiencia de Netflix con autenticación real, catálogo desde TMDB, reproductores embebidos con ad-blocking proxy, subtítulos sincronizados, panel de administración con control de acceso por roles, y una interfaz web optimizada y responsiva.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Auth | NextAuth v5 beta (Credentials + Google OAuth) |
| Base de datos | MongoDB Atlas + Mongoose |

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

# OpenSubtitles (opcional)
OPENSUBTITLES_API_KEY=
OPENSUBTITLES_USER_AGENT=FoleyPlayApp v1.0

# Admin
ADMIN_EMAIL=tu_email_de_superadmin@ejemplo.com
ADMIN_SECRET=secreto_para_scripts_de_admin

# App pública
NEXT_PUBLIC_APP_NAME="FoleyPlay"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features principales

- Autenticación email/password y Google OAuth
- Sistema de aprobación de usuarios — el registro está abierto, el acceso lo aprueba el admin
- Roles jerárquicos: `user` / `admin` / `superadmin`
- Panel de administración en `/admin/users` — listar, aprobar, eliminar y promover usuarios
- Catálogo TMDB con carruseles lazy-load y HeroBanner rotativo
- Páginas `/movies` y `/tv` con catálogo de películas y series por género
- Búsqueda con filtros por tipo, género y año
- Reproductores embebidos con ad-blocking proxy server-side
- Multi-audio vía UnlimPlay y VidLink
- Subtítulos overlay sincronizados manualmente
- Watchlist, historial de reproducción y calificaciones (like/dislike)
- Perfil de usuario con avatar generado por iniciales

## Proveedores de stream

| Proveedor | Modo | Multi-audio |
|---|---|---|
| UnlimPlay | Direct | ✅ |
| VidLink | Direct | ✅ |
| 2Embed | Proxied (ad-blocked) | ❌ |
| StreamIMDb | Proxied (ad-blocked) | ❌ |
| Embed.su | Direct | ❌ |

## Sistema de acceso

El registro es público pero el acceso requiere aprobación. Flujo:

1. Usuario se registra → cuenta creada con `approved: false`
2. Superadmin (o admin) aprueba desde `/admin/users`
3. Usuario puede iniciar sesión y usar la plataforma

Para definir el superadmin inicial, configurar `ADMIN_EMAIL` en `.env.local`.

## Créditos

- [TMDB](https://developer.themoviedb.org/docs) — catálogo de películas y series
- [OpenSubtitles](https://opensubtitles.com) — subtítulos
- [Next.js](https://nextjs.org/) / [Tailwind CSS](https://tailwindcss.com/)
