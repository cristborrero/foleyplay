# 🔑 Guía para Obtener las Variables de Entorno — Netflix Clone

> Sigue esta guía paso a paso para completar tu archivo `.env.local`.
> Tiempo estimado total: **20-30 minutos**.

---

## Variables que NO necesitas obtener en ningún lado

Estas ya tienen su valor fijo — cópialas tal cual:

```env
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Mi Netflix"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Las demás sí requieren registro. Sigue el orden de esta guía.

---

## 1. `TMDB_API_KEY` — The Movie Database

**Tiempo:** ~5 minutos | **Costo:** Gratis

### Pasos:

1. Ve a [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Crea tu cuenta con email y contraseña. Verifica tu correo.
3. Una vez logueado, ve a tu perfil → **Configuración** (ícono arriba a la derecha).
4. En el menú lateral izquierdo, haz clic en **"API"**.
5. En la sección "Clave API (v3 auth)", haz clic en **"Solicitar una API Key"**.
6. Elige **"Developer"** (uso personal/no comercial).
7. Completa el formulario:
   - **Nombre de la aplicación**: `Mi Netflix Clone`
   - **URL de la aplicación**: `http://localhost:3000`
   - **Descripción**: `Proyecto personal de aprendizaje - clon de Netflix`
   - **Tipo de uso**: Personal
8. Acepta los términos y confirma.
9. Tu API Key aparecerá inmediatamente en la misma página.

```env
TMDB_API_KEY=tu_api_key_aqui  # Luce así: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

> ⚠️ **Límite gratuito**: 40 peticiones por segundo — más que suficiente para uso personal.

---

## 2. `MONGODB_URI` — MongoDB Atlas

**Tiempo:** ~10 minutos | **Costo:** Gratis (512 MB en tier M0)

### Pasos:

1. Ve a [https://cloud.mongodb.com](https://cloud.mongodb.com) y crea una cuenta gratuita.
2. Una vez dentro, haz clic en **"Build a Database"** (o "Create").
3. Selecciona **"M0 FREE"** (el tier gratuito).
4. Elige un proveedor de nube: **AWS** es suficiente. Región: la más cercana a ti (ej: `eu-west-1` para Europa).
5. Dale un nombre al cluster: `netflix-clone-db`. Haz clic en **"Create"**.

**Crear usuario de base de datos:**

6. Se abrirá un asistente. En **"Username and Password"**, crea un usuario:
   - Username: `netflix_user` (o el que quieras)
   - Password: haz clic en **"Autogenerate Secure Password"** y guárdala.
   - Haz clic en **"Create User"**.

**Configurar acceso de red:**

7. En la sección **"Where would you like to connect from?"**, haz clic en **"Add My Current IP Address"** para desarrollo local.
8. Para producción en Vercel/servidor, agrega `0.0.0.0/0` (permite cualquier IP) o las IPs específicas de Vercel.
9. Haz clic en **"Finish and Close"** → **"Go to Databases"**.

**Obtener el connection string:**

10. En tu cluster, haz clic en **"Connect"**.
11. Selecciona **"Drivers"**.
12. Elige **Node.js** como driver.
13. Copia el connection string. Se ve así:
```
mongodb+srv://netflix_user:<password>@netflix-clone-db.abc123.mongodb.net/?retryWrites=true&w=majority
```
14. Reemplaza `<password>` con la contraseña que guardaste en el paso 6.
15. Agrega el nombre de tu base de datos antes del `?`:
```
mongodb+srv://netflix_user:TU_PASSWORD@netflix-clone-db.abc123.mongodb.net/netflix_db?retryWrites=true&w=majority
```

```env
MONGODB_URI=mongodb+srv://netflix_user:TU_PASSWORD@netflix-clone-db.abc123.mongodb.net/netflix_db?retryWrites=true&w=majority
```

> ⚠️ **Nunca** pongas la URI directamente en el código. Solo en `.env.local`.

---

## 3. `NEXTAUTH_SECRET` — Clave secreta de NextAuth

**Tiempo:** 30 segundos | **Costo:** Gratis

Esta es una clave aleatoria que usa NextAuth para cifrar cookies y tokens JWT. **No se obtiene de ningún servicio externo** — la generas tú mismo.

### Opción A — Desde tu terminal (recomendado):

```bash
openssl rand -base64 32
```

Copia el resultado. Se verá algo así: `K7mN2pQ8vR3xL9wE4yH1uJ6tI5oA0bC=`

### Opción B — Desde el CLI de NextAuth (genera y guarda automáticamente en `.env.local`):

```bash
npx auth secret
```

### Opción C — Online (si no tienes openssl):

Ve a [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) y copia el valor generado.

```env
NEXTAUTH_SECRET=el_valor_generado_aqui
```

> ⚠️ Esta clave debe ser única por proyecto y entorno. Genera una diferente para producción.

---

## 4. `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` — Google OAuth

**Tiempo:** ~10 minutos | **Costo:** Gratis

### Pasos:

**Crear proyecto en Google Cloud:**

1. Ve a [https://console.cloud.google.com](https://console.cloud.google.com)
2. Si es tu primera vez, crea una cuenta o inicia sesión con tu cuenta de Google.
3. En la barra superior, haz clic en el selector de proyectos → **"Nuevo Proyecto"**.
4. Nombre del proyecto: `Netflix Clone`. Haz clic en **"Crear"**.
5. Asegúrate de que el proyecto nuevo esté seleccionado en el selector superior.

**Configurar la pantalla de consentimiento OAuth:**

6. En el menú lateral (☰), ve a **"APIs y servicios"** → **"Pantalla de consentimiento de OAuth"**.
7. Selecciona **"Externo"** y haz clic en **"Crear"**.
8. Completa los campos obligatorios:
   - **Nombre de la app**: `Mi Netflix Clone`
   - **Correo de soporte del usuario**: tu correo de Gmail
   - **Correo de contacto del desarrollador**: tu correo de Gmail
9. Haz clic en **"Guardar y continuar"** en todas las pantallas hasta finalizar (los campos opcionales los puedes dejar vacíos).
10. En la pantalla final, haz clic en **"Volver al panel"**.

**Crear las credenciales OAuth:**

11. En el menú lateral, ve a **"APIs y servicios"** → **"Credenciales"**.
12. Haz clic en **"+ Crear credenciales"** → **"ID de cliente de OAuth"**.
13. Tipo de aplicación: **"Aplicación web"**.
14. Nombre: `Netflix Clone Web`.
15. En **"Orígenes de JavaScript autorizados"**, agrega:
    - `http://localhost:3000`
    - `http://localhost` (por si acaso)
16. En **"URIs de redirección autorizados"**, agrega:
    - `http://localhost:3000/api/auth/callback/google`
    - *(Cuando tengas dominio de producción, agrega también: `https://tu-dominio.com/api/auth/callback/google`)*
17. Haz clic en **"Crear"**.
18. Aparecerá una ventana con tu **Client ID** y **Client Secret**. Cópialos.

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789
```

> ⚠️ El Client Secret **solo se muestra una vez** en esa ventana. Si lo cierras sin copiarlo, tendrás que generar uno nuevo desde la misma pantalla de credenciales.

---

## 5. `OPENSUBTITLES_API_KEY` y `OPENSUBTITLES_USER_AGENT` — OpenSubtitles

**Tiempo:** ~5 minutos | **Costo:** Gratis (20 descargas/día en tier gratuito)

> **Nota importante**: OpenSubtitles tiene dos sitios: `.org` (API antigua, **discontinuada**) y `.com` (REST API nueva, la que usaremos). Asegúrate de registrarte en `.com`.

### Pasos:

1. Ve a [https://www.opensubtitles.com/en/register](https://www.opensubtitles.com/en/register)
2. Crea una cuenta gratuita con email y contraseña. Verifica tu correo.
3. Una vez logueado, ve a tu perfil → haz clic en tu nombre de usuario arriba a la derecha.
4. Ve a **"API"** o directamente a [https://www.opensubtitles.com/en/consumer](https://www.opensubtitles.com/en/consumer)
5. En la sección de API, completa el formulario para solicitar una API Key:
   - **Application name**: `Mi Netflix Clone`
   - **Application description**: `Proyecto personal para mostrar subtítulos en español`
6. Haz clic en **"Register"** o **"Submit"**.
7. Tu API Key aparecerá en la misma página. Se ve así: `abc123def456ghi789`

**Para el `OPENSUBTITLES_USER_AGENT`:**

8. Este es simplemente el nombre y versión de tu app en formato estándar. No lo obtienes de ningún lado — lo defines tú:

```env
OPENSUBTITLES_API_KEY=tu_api_key_aqui
OPENSUBTITLES_USER_AGENT=MiNetflixClone v1.0
```

> 📋 **Límites del plan gratuito**: 20 descargas de subtítulos por día, 200 búsquedas por día. Para uso personal es más que suficiente.

---

## Resultado Final — Tu `.env.local` completo

Una vez que hayas obtenido todos los valores, tu archivo `.env.local` debe verse así:

```env
# ============================================================
# NETFLIX CLONE — Variables de Entorno
# ============================================================

# --- TMDB ---
TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# --- MongoDB ---
MONGODB_URI=mongodb+srv://netflix_user:TU_PASSWORD@netflix-clone-db.abc123.mongodb.net/netflix_db?retryWrites=true&w=majority

# --- NextAuth ---
NEXTAUTH_SECRET=K7mN2pQ8vR3xL9wE4yH1uJ6tI5oA0bC=
NEXTAUTH_URL=http://localhost:3000

# --- Google OAuth ---
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789

# --- OpenSubtitles ---
OPENSUBTITLES_API_KEY=tu_api_key_aqui
OPENSUBTITLES_USER_AGENT=MiNetflixClone v1.0

# --- App Config ---
NEXT_PUBLIC_APP_NAME="Mi Netflix"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ⚠️ Cuando despliegues a producción (Vercel o tu servidor)

Recuerda actualizar estas variables para producción:

| Variable | En desarrollo | En producción |
|---|---|---|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://tu-dominio.com` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://tu-dominio.com` |
| `NEXTAUTH_SECRET` | el que generaste | genera uno **nuevo** con `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID/SECRET` | mismo valor | mismo valor, pero agregar URL de producción en Google Cloud Console |
| `MONGODB_URI` | mismo valor | mismo valor (Atlas es cloud, funciona igual) |

En **Vercel**, añades las variables directamente desde el dashboard: Proyecto → Settings → Environment Variables. No se sube el `.env.local` — se configura desde la UI.

En **tu servidor Contabo/CyberPanel**, creas el archivo `.env.local` directamente en el servidor o usas variables de entorno del sistema.

---

## 🔒 Regla de oro de seguridad

```
✅ .env.local  → en tu máquina local únicamente
✅ Variables en Vercel dashboard → para producción
❌ NUNCA en GitHub (verifica que .gitignore incluye .env.local)
❌ NUNCA en el código fuente
❌ NUNCA en mensajes de chat o commits
```

---

*Guía de configuración — Netflix Clone Personal v1.0*
