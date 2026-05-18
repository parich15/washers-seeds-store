# Directus Contract

## Base URL
Configurada en `runtimeConfig.directusUrl` y `runtimeConfig.public.directus.url`.

Default actual:
`http://161.35.46.209:8055`

## Nitro Endpoints
- `GET /api/menus` devuelve `MenuResponse[]`.
- `GET /api/ajustes-web` devuelve `DirectusResponse<AjustesWeb>`.
- `GET /api/semillas` devuelve `DirectusResponse<Semilla[]>`.
- `GET /api/ropa` devuelve `DirectusResponse<Ropa[]>`.
- `GET /api/semillas/:slug` devuelve `DirectusResponse<Semilla[]>` filtrado por `producto.slug`.
- `GET /api/ropa/:slug` devuelve `DirectusResponse<Ropa[]>` filtrado por `producto.slug`.

## Colecciones
`semillas`:
- Relación principal: `producto`.
- Precio real: `cantidades[]`, no `producto.precio`.
- Campos relevantes: `categoria`, `cantidades`, `thc`, `cbd`, `linaje`, `dominancia`, `dias_floracion`, `dificultad`, `zonas_climaticas`, `efectos`, `sabores`, `aromas`, `medicinales`.

`ropa`:
- Relación principal: `producto`.
- Precio: `producto.precio` y opcional `producto.precio_descuento`.
- Campos relevantes: `tallas[]`, `colores[]`, `categoria`.

`producto` relacionado:
- `id`, `nombre`, `slug`, `sku`, `imagen_principal`, `galeria`, `descripcion_corta`, `descripcion`, `disponible`, `stock`, `nuevo`, `descuento`, `precio`, `precio_descuento`, metadatos SEO, `relacionados`.

`menus`:
- `nombre`.
- `menu[]` con `texto`, `pagina`, `hijos`.
- Normalizar `pagina` con `normalizeCmsPath()`.

`datos_web`:
- Logos, dirección, teléfonos, email y redes sociales.

## Assets
Assets públicos:
`/assets/:uuid`

Usar `runtimeConfig.public.directus.url` en cliente para construir URL completa.

## Nullable
Normalizar antes de renderizar:
- `producto.nuevo`: boolean false si viene null.
- `producto.descuento`: boolean false si viene null.
- `producto.precio_descuento`: `string | null`.
- `producto.galeria`: array vacío si viene null.
- `producto.relacionados`: array vacío si viene null.
- `semillas.medicinales`, `efectos`, `sabores`, `aromas`, `zonas_climaticas`: array vacío si viene null.
- `ropa.tallas`, `ropa.colores`: array vacío si viene null.

## Auth
Los endpoints `server/api/auth/*` llaman Directus:
- `/auth/login`
- `/users/me`
- `/auth/refresh`
- `/users` para registro

El rol cliente actual está fijado en `server/api/auth/register.post.ts`.
