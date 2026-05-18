# Development Playbook

## Setup
```bash
npm install
npm run dev
```

## Validación
```bash
npx nuxi typecheck
npm run build
```

## Smoke Endpoints
Con dev server activo:
```bash
curl http://localhost:3000/api/menus
curl http://localhost:3000/api/ajustes-web
curl http://localhost:3000/api/semillas
curl http://localhost:3000/api/ropa
curl http://localhost:3000/api/semillas/northern-lights
```

## Smoke Manual
- Home.
- `/products/semillas`.
- `/products/ropa`.
- Detalle de semilla.
- Detalle de ropa.
- Login/register.
- Cart.
- Checkout mock.

## Directus
- Añadir colecciones nuevas requiere actualizar `CollectionType`, `assertCollectionType()` y normalizadores.
- Para productos nuevos, `producto.slug` debe ser único por colección.
- Para semillas, completar `cantidades[]`; el listado toma la primera cantidad como referencia.
- Para ropa, completar `producto.precio`, `tallas[]` y `colores[]`.

## Antes de PR
- Sin hardcodes nuevos de Directus.
- Sin enlaces nuevos a `/categories/*`.
- `npx nuxi typecheck` limpio.
- `npm run build` limpio.
- Estados loading/error/vacío revisados.
- Motion nuevo mediante `useMotion()` o justificación técnica.
- HTML CMS sanitizado antes de `v-html`.
