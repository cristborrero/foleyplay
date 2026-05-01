# FoleyPlay — Guía de Deploy en Producción

> Repo: `cristborrero/foleyplay`  
> Stack: Next.js 15 · NextAuth v5 · MongoDB Atlas · Vercel

---

## Índice

1. [MongoDB Atlas — Preparación](#1-mongodb-atlas--preparación)
2. [Google Cloud Console — OAuth](#2-google-cloud-console--oauth)
3. [Vercel — Deploy inicial](#3-vercel--deploy-inicial)
4. [Variables de entorno en Vercel](#4-variables-de-entorno-en-vercel)
5. [Después del primer deploy](#5-después-del-primer-deploy)
6. [Dominio personalizado (opcional)](#6-dominio-personalizado-opcional)
7. [Checklist final](#7-checklist-final)

---

## 1. MongoDB Atlas — Preparación

### 1.1 Permitir conexiones desde Vercel

Vercel usa IPs dinámicas y no fijas. Tenés que abrir el acceso a toda internet:

1. Ir a **MongoDB Atlas** → tu cluster → **Network Access**
2. Click en **Add IP Address**
3. Click en **Allow Access from Anywhere** → se completa `0.0.0.0/0`
4. Click **Confirm**

> **¿Es seguro?** Sí — la seguridad real la da el usuario/contraseña de la connection string. La whitelist de IP es una capa adicional, pero no la única.

### 1.2 Obtener la connection string

1. Ir a **Database** → **Connect** → **Drivers**
2. Copiar la connection string, reemplazando `<password>` con tu contraseña real
3. Guardarla — la vas a necesitar en el paso 4

Formato esperado:
```
mongodb+srv://usuario:TuPassword@cluster0.xxxxx.mongodb.net/foleyplay?retryWrites=true&w=majority
```

---

## 2. Google Cloud Console — OAuth

Cuando la app esté en producción, Google OAuth va a rechazar el login porque la URL de callback es diferente.

### 2.1 Agregar la URL de producción

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Click en tu OAuth 2.0 Client ID (el que ya tenés configurado)
4. En **Authorized JavaScript origins**, agregar:
   ```
   https://foleyplay.vercel.app
   ```
   *(o tu dominio personalizado si tenés uno)*

5. En **Authorized redirect URIs**, agregar:
   ```
   https://foleyplay.vercel.app/api/auth/callback/google
   ```
6. Click **Save**

> No borres las entradas de `localhost` — las necesitás para desarrollo local.

---

## 3. Vercel — Deploy inicial

### 3.1 Crear el proyecto

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Seleccionar **Import Git Repository** → conectar con GitHub si no está conectado
3. Buscar y seleccionar `cristborrero/foleyplay`
4. Vercel detecta Next.js automáticamente — **no cambiar nada** en Build & Output Settings

### 3.2 NO hacer deploy todavía

Antes de hacer click en Deploy, tenés que cargar todas las variables de entorno (paso 4). Si hacés deploy sin ellas, va a fallar.

---

## 4. Variables de entorno en Vercel

En la pantalla de configuración del proyecto (antes del primer deploy), ir a **Environment Variables** y cargar todas estas:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `MONGODB_URI` | Tu connection string de Atlas | Production, Preview, Development |
| `NEXTAUTH_SECRET` | String random largo (mínimo 32 chars) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://foleyplay.vercel.app` | **Solo Production** |
| `GOOGLE_CLIENT_ID` | Tu Client ID de Google Cloud | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | Tu Client Secret de Google Cloud | Production, Preview, Development |
| `TMDB_API_KEY` | Tu API key de TMDB | Production, Preview, Development |
| `ADMIN_EMAIL` | `cristborrero@gmail.com` | Production, Preview, Development |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `cristborrero@gmail.com` | Production, Preview, Development |
| `ADMIN_SECRET` | `8f2d5e9a4c1b7f0d3e6a9c2b5f8d1e4a7c0b3f6d9e2a5c8b1f4d7e0a3c6f9b2d` | Production, Preview, Development |

> **Importante:** `NEXTAUTH_URL` solo va en **Production**. En preview/development, NextAuth lo detecta automáticamente.

### Cómo generar un NEXTAUTH_SECRET seguro

Si necesitás generar uno nuevo:
```bash
openssl rand -base64 32
```

---

## 5. Después del primer deploy

Una vez que Vercel termine el build:

### 5.1 Primer login como superadmin

1. Ir a `https://foleyplay.vercel.app`
2. Hacer login con **Google usando `cristborrero@gmail.com`**
3. El sistema detecta que es el `ADMIN_EMAIL`, te asigna `role: superadmin` automáticamente
4. Deberías entrar directo al browse sin pasar por `/pending`

### 5.2 Verificar el panel de admin

1. Ir a `https://foleyplay.vercel.app/admin/users`
2. Deberías ver la tabla con tu cuenta marcada como **Superadmin**
3. Si aparece correctamente: todo funcionó

### 5.3 Si quedás atrapado en `/pending`

El JWT de sesión es viejo. Solución:
1. Ir a `https://foleyplay.vercel.app/pending`
2. Click en **Cerrar sesión**
3. Volver a entrar con Google
4. Ahora sí debería funcionar

### 5.4 Verificar que Google OAuth funciona en producción

1. Abrir una ventana de incógnito
2. Ir a la app e intentar login con Google
3. Si Google te muestra un error de "redirect_uri_mismatch" → volvé al paso 2 y verificá que agregaste la URL correcta en Google Cloud Console

---

## 6. Dominio personalizado (opcional)

Si querés usar `foleyplay.com` o similar en vez de `foleyplay.vercel.app`:

1. En Vercel → tu proyecto → **Settings** → **Domains**
2. Click **Add** → ingresá tu dominio
3. Vercel te da los DNS records que tenés que agregar en tu proveedor de dominio (Namecheap, GoDaddy, Cloudflare, etc.)
4. Una vez propagado el DNS, actualizar en Vercel la variable `NEXTAUTH_URL` al nuevo dominio
5. Volver a Google Cloud Console y agregar el nuevo dominio en Authorized origins y redirect URIs

---


## 7. Checklist final

Antes de compartir la URL con usuarios:

### Infraestructura
- [ ] MongoDB Atlas: IP `0.0.0.0/0` en Network Access
- [ ] Google Cloud Console: URL de producción en Authorized Origins y Redirect URIs
- [ ] Vercel: todas las variables de entorno cargadas
- [ ] Vercel: build exitoso (sin errores en los logs)

### Primer login
- [ ] Login con `cristborrero@gmail.com` → accede directo (no `/pending`)
- [ ] `/admin/users` muestra la tabla con tu cuenta como Superadmin
- [ ] Badge "Administración" visible en la navbar

### Funcionalidad básica
- [ ] Login con Google funciona en producción
- [ ] Un usuario nuevo va a `/pending`
- [ ] Desde `/admin/users` podés aprobarlo
- [ ] Usuario aprobado puede acceder después de re-login
- [ ] TMDB carga contenido (browse, búsqueda, detallas)


---

## Referencias rápidas

| Servicio | URL |
|---------|-----|
| Vercel dashboard | https://vercel.com/cristborrero/foleyplay |
| Google Cloud Console | https://console.cloud.google.com |
| MongoDB Atlas | https://cloud.mongodb.com |
| TMDB API | https://www.themoviedb.org/settings/api |
| Repo GitHub | https://github.com/cristborrero/foleyplay |
