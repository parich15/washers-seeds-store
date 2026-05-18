# Frontend Modernization

## Objetivo
Modernizar sobre una base tipada y estable: Nuxt 4.2, Pinia, Tailwind, Reka UI, Directus vía Nitro APIs y AnimeJS cliente.

## Principios UI
- Interfaz premium sutil, más editorial en home y más densa en flujos de compra.
- Radios máximos de 8px salvo elementos circulares o casos justificados.
- Menos gradiente dominante; usar color como acento.
- Estados completos: loading, error, vacío, hover, focus, disabled.
- Responsive sin textos solapados.
- Descripciones HTML desde Directus solo con sanitización.

## Reka UI
Usar primitivas Reka para:
- Modal/dialog.
- Menú móvil.
- Dropdown nav.
- Filtros de listado.
- Selects.
- Checkbox.
- Radio/toggle groups.
- Accordions.

Mantener `BaseButton`, `BaseBadge` y similares solo como wrappers visuales.

## Motion
- AnimeJS está expuesto por plugin cliente como `$anime`.
- `useMotion()` centraliza reduced motion, cleanup y helpers `fadeIn`/`fadeOut`.
- Para transiciones Vue nuevas, usar `<Transition :css="false">` con hooks JS.
- Evitar nuevas `@keyframes` y nuevas clases `animate-*` para microinteracciones.
- WAAPI puede usarse solo para transform/opacity simples si mejora rendimiento.

## Orden Sugerido
1. Header y navegación CMS con Reka.
2. Home sin hero de gradiente dominante.
3. Listados de `semillas` y `ropa`, incluyendo filtros móviles accesibles.
4. Detalle con galería más sólida y selectores Reka.
5. Auth/contact.
6. Carrito y checkout mock.

## Criterios
- `npx nuxi typecheck` pasa.
- `npm run build` pasa.
- Rutas legacy `/categories/*` redirigen.
- Carrito acepta `semillas` y `ropa`.
- Reduced motion evita desplazamientos y stagger.
