# AGENTS.md

Guía operativa para agentes que trabajen en Washer Seeds Store.

## Stack
- Nuxt 4.2 con estructura `app/` y `server/`.
- Pinia para estado cliente (`app/stores`).
- Tailwind para estilos base.
- Reka UI vía módulo `reka-ui/nuxt` para primitivas accesibles.
- Directus como CMS en `http://161.35.46.209:8055`, centralizado en `runtimeConfig`.
- AnimeJS como plugin cliente en `app/plugins/anime.client.ts`; usar `useMotion()` para microinteracciones JS.

## Comandos
- `npm run dev`
- `npx nuxi typecheck`
- `npm run build`
- `npm run preview`

`npx nuxi typecheck` debe pasar antes de cambios visuales grandes. `npm run build` debe pasar antes de entregar.

## Arquitectura Rápida
- `app/pages`: rutas Nuxt. Canónicas de producto: `/products/semillas`, `/products/ropa`, `/products/:collection/:slug`.
- `app/pages/categories/*`: solo redirecciones legacy hacia `/products/*`.
- `app/components/layout`: header/footer.
- `app/components/common`: wrappers visuales.
- `app/components/product`: cards de `Semilla` y `Ropa`.
- `app/composables`: consumo de APIs Nitro y helpers cliente.
- `app/stores`: `auth` y `cart`.
- `server/api`: proxy/normalización hacia Directus.
- `server/utils/directus.ts`: helper único para Directus.
- `types`: contratos compartidos.

## Reglas Directus
- No hardcodear la URL fuera de `nuxt.config.ts`.
- En servidor, usar `directusFetch()` y `assertCollectionType()`.
- En cliente, consumir `/api/*`; no llamar Directus directamente salvo assets públicos.
- Colecciones públicas conocidas: `menus`, `datos_web`, `semillas`, `ropa`.
- Assets: `${runtimeConfig.public.directus.url}/assets/:uuid`.
- Normalizar nullable antes de renderizar: `nuevo`, `precio_descuento`, `categoria`, `relacionados`, `galeria`.

## Rutas
- Usar `/products/semillas` y `/products/ropa`.
- Normalizar enlaces CMS con `normalizeCmsPath()`.
- Los enlaces antiguos `/categories/*` no deben aparecer en UI nueva.

## Motion
- Preferir `useMotion()` con AnimeJS para enter/leave y microinteracciones.
- Respetar `prefers-reduced-motion`.
- Limpiar animaciones al desmontar.
- Las clases CSS `transition-*` existentes son deuda a migrar gradualmente, no patrón nuevo.

## Deuda Que No Se Debe Ignorar
- Checkout y pedidos siguen siendo mock.
- `ProductCard` y mocks legacy existen solo por compatibilidad.
- Migrar más controles a Reka UI: modal, dropdowns, filtros, selects, checkboxes, radios/toggles y accordions.
- Reducir gradientes dominantes y radios mayores a 8px al modernizar pantallas.
- Sanitizar HTML de Directus antes de `v-html`.
