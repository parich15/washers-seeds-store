# Architecture

## Runtime
Nuxt 4.2 usa `app/` para frontend y `server/` para Nitro APIs. Directus se consume desde Nitro y se expone al cliente mediante endpoints locales.

## Frontend
- `app/app.vue`: wrapper raíz de layout y página.
- `app/layouts/default.vue`: layout global.
- `app/pages/index.vue`: home.
- `app/pages/products/[categories]/index.vue`: listado canónico de `semillas` o `ropa`.
- `app/pages/products/[categories]/[slug].vue`: detalle de producto.
- `app/pages/categories/*`: redirecciones legacy a rutas canónicas.
- `app/pages/auth/*`, `app/pages/cart`, `app/pages/checkout`, `app/pages/user/*`: flujos de cuenta y compra.

## Components
- `layout/AppHeader.vue` y `layout/AppFooter.vue` consumen `menus` y `datos_web`.
- `common/BaseButton.vue`, `BaseBadge.vue`, `BaseInput.vue`, `BaseCard.vue`, `BaseModal.vue` son wrappers visuales existentes.
- `product/SeedCard.vue` y `product/RopaCard.vue` renderizan colecciones reales de Directus.
- `product/ProductCard.vue` es legacy para mocks.

## State
- `app/stores/auth.ts`: sesión local basada en tokens Directus.
- `app/stores/cart.ts`: carrito persistido en `localStorage`; usa snapshots `CartProductSnapshot` para soportar `semillas`, `ropa` y legacy.

## Composables
- `useProducts()`: consume `/api/:collection` y `/api/:collection/:slug`.
- `useSemillas()`: compatibilidad específica para home.
- `useAjustesWeb()`: settings y assets.
- `useMenus()`: menús CMS.
- `useMotion()`: AnimeJS, reduced motion y cleanup.

## Server
- `server/utils/directus.ts`: URL, fetch, assets y normalización de colecciones.
- `server/api/[collection].ts`: listado de `semillas` y `ropa`.
- `server/api/[collection]/[slug].ts`: detalle por `producto.slug`.
- `server/api/menus.ts`: colección `menus`.
- `server/api/ajustes-web.ts`: item `datos_web/1`.
- `server/api/auth/*`: login, register, me y refresh contra Directus.
- `server/api/contacto.post.ts` y `newsletter.post.ts`: formularios.
