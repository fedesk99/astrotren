# Astrotrén — Panel de administración

Esta implementación separa **código** y **contenido**:

- GitHub/Vercel contiene el código y el diseño.
- Supabase contiene Música, Shows, Galería, Tienda y las fotos.
- Los cambios hechos desde `/admin` **no generan commits ni modifican el repositorio**.
- Un `git push` posterior **no borra el contenido de Supabase**.

## 1. Crear Supabase

1. Crear un proyecto en Supabase.
2. Abrir **SQL Editor** y ejecutar `supabase/schema.sql`.
3. En **Authentication > Users**, crear manualmente el usuario administrador con:
   - Email: `astrotrengdln@gmail.com`
   - Una contraseña larga y única.
4. Desactivar el registro público de usuarios en Authentication.
5. Copiar la URL del proyecto y la clave pública `anon`.

> La política RLS usa ese email. Si cambiás el email administrador, cambiá también el email en `supabase/schema.sql` y en `src/pages/admin/Admin.jsx`.

## 2. Variables de entorno

Copiar `.env.example` como `.env` y completar:

```text
REACT_APP_SUPABASE_URL=https://TU_PROYECTO.supabase.co
REACT_APP_SUPABASE_ANON_KEY=TU_ANON_KEY
```

En Vercel, cargar esas mismas dos variables en **Settings > Environment Variables**.

**Nunca** poner `SUPABASE_SERVICE_ROLE_KEY` en el frontend ni en Vercel como variable `REACT_APP_*`.

## 3. Instalar dependencias

Desde `frontend/`:

```bash
npm install
```

El proyecto agrega:

- `@supabase/supabase-js`
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

## 4. Migración inicial

La migración copia los datos actuales de `mockData.js` y sube las imágenes de `public/Images` al bucket `media`.

Usar la **service role key solamente en tu PC**, nunca en el navegador:

```bash
SUPABASE_URL="https://TU_PROYECTO.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="TU_SERVICE_ROLE_KEY" \
node scripts/migrate-to-supabase.js
```

El script reemplaza el contenido de las cuatro tablas, por lo que debe ejecutarse **una sola vez** sobre una base nueva/vacía.

## 5. Ejecutar y comprobar

```bash
npm start
```

Probar:

- `/music`
- `/shows`
- `/gallery`
- `/shop`
- `/admin`

En `/admin` se puede iniciar sesión y modificar el contenido.

## 6. Vercel y `/admin`

`vercel.json` incluye rewrites para que una entrada directa a `/admin` no produzca un 404 con React Router.

El panel no aparece en el menú público y agrega `noindex,nofollow,noarchive`. Eso evita que los buscadores lo indexen normalmente, pero **la URL no se considera un secreto**. La protección real es Supabase Auth + RLS.

## 7. Flujo posterior

Después de la migración:

```text
Cambio de contenido → /admin → Supabase → sitio actualizado

Cambio de código → PC → git commit → git push → Vercel
```

Los dos flujos son independientes.
