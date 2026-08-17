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

## 4. Estado de Despliegues en GitHub (Deployments Badge)

Si la sección lateral de **Deployments** en GitHub muestra una `❌` roja debido a webhooks de servicios anteriores (como Vercel o Cloudflare Pages CI desconfigurados), podés registrar el estado de éxito activo en GitHub usando GitHub CLI (`gh`):

```bash
# Crear y marcar el despliegue de Producción como exitoso
DEPLOY_ID=$(gh api --method POST repos/cristborrero/foleyplay/deployments -f ref=main -f environment=Production -f description="Cloudflare Workers OpenNext" -F auto_merge=false --jq '.id')
gh api --method POST repos/cristborrero/foleyplay/deployments/$DEPLOY_ID/statuses -f state=success -f environment_url="https://foleyplay.cristborrero.workers.dev" -f description="FoleyPlay Cloudflare Active"
```
