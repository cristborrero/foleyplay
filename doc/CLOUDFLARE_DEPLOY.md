# FoleyPlay — Guía de Deploy en Cloudflare (OpenNext + Wrangler)

> Stack: Next.js 16 · OpenNext Cloudflare · Cloudflare D1 · Wrangler

---

## 1. Arquitectura de Despliegue

FoleyPlay está configurado para ejecutarse en la red global de Cloudflare mediante:
* **`@opennextjs/cloudflare`**: Compila la aplicación Next.js 16 para el entorno de ejecución `workerd`.
* **Cloudflare Workers / Pages Assets**: Distribuye los archivos estáticos (`.open-next/assets`) y la función SSR (`.open-next/worker.js`).
* **Wrangler**: CLI oficial de Cloudflare para compilar y desplegar con un solo comando.

---

## 2. Variables de Entorno en Cloudflare

Antes de desplegar, las variables de entorno deben estar configuradas en el panel de Cloudflare o en tu archivo `.env.local` / `wrangler.jsonc`:

* `TMDB_API_KEY`: Clave API de The Movie Database.
* `TMDB_BASE_URL`: `https://api.themoviedb.org/3`
* `TMDB_IMAGE_BASE_URL`: `https://image.tmdb.org/t/p`
* `NEXT_PUBLIC_APP_NAME`: `FoleyPlay`
* `NEXT_PUBLIC_APP_URL`: URL pública de tu dominio o `https://foleyplay.<tu-subdominio>.workers.dev`

---

## 3. Comandos de Despliegue

### Despliegue Directo (Recomendado vía CLI)
Compila la versión optimizada de Next.js y la publica directamente en Cloudflare:

```bash
npm run deploy
```

*(Este comando ejecuta internamente `npm run pages:build` seguido de `npx wrangler deploy`).*

### Solo Compilación (Verificación)
Para validar que el empaquetador de OpenNext genera el bundle sin errores:

```bash
npm run pages:build
```

---

## 4. ¿Por qué GitHub muestra ❌ en Deployments?

GitHub muestra alertas de despliegue cuando el repositorio está vinculado mediante un Webhook a un proveedor automático (Vercel o Cloudflare Pages CI) que intenta compilar en sus propios servidores remotos:
* Si el runner remoto de Cloudflare/Vercel no tiene cargada la variable `TMDB_API_KEY` en sus ajustes web, su intento de build falla y notifica a GitHub un error.
* Al hacer el despliegue directo con `npm run deploy`, el build se realiza en tu entorno con todas tus variables y se sube ya compilado a Cloudflare.
