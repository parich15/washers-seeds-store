---
name: Washer Seeds Editorial Premium
description: Minimal ecommerce design system for a cannabis seed and product store.
colors:
  brand-blue: "#36A9E1"
  brand-green: "#3AAA35"
  brand-earth: "#936037"
  ink: "#111513"
  muted: "#647067"
  canvas: "#FAFBF7"
  surface: "#FFFFFF"
  surface-alt: "#F1F6F0"
  border: "#DDE6DC"
  success: "#2F8F46"
  warning: "#B7791F"
  danger: "#C2413D"
typography:
  body:
    fontFamily: Nunito
    fontWeight: 400
  heading:
    fontFamily: Nunito
    fontWeight: 700
  footer-display:
    fontFamily: Walking in the street
    fontWeight: 400
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
rounded:
  sm: 4px
  md: 8px
  lg: 8px
---

# Washer Seeds Editorial Premium

## Overview
Washer Seeds debe sentirse como una tienda ecommerce premium, clara y confiable, no como una landing generica. La interfaz usa fondos calidos casi blancos, tipografia limpia, layouts editoriales, producto real y acentos de marca en dosis pequenas.

## Typography
- Usar Nunito para body, navegacion, botones, cards, formularios, headings y precios.
- `Walking in the street` solo puede aparecer en el footer como titulo de encabezado de listas de links.
- H1: 48-64px desktop, 36-42px mobile, weight 800, line-height 0.95-1.05.
- H2: 32-42px desktop, 28-34px mobile, weight 800.
- Body: 16px, line-height 1.55. Texto secundario: 14-15px.

## Colors
- El fondo principal es `canvas`, no blanco puro en todas partes.
- `brand-blue` y `brand-green` se usan como acentos, links activos, iconos y CTAs puntuales.
- Evitar gradientes dominantes. Si se usa gradiente, debe ser sutil y localizado.
- `brand-earth` se reserva para detalles editoriales, badges premium o separadores finos.
- Mantener contraste WCAG AA en texto y controles.

## Layout
- Home con ritmo editorial: hero fuerte, beneficios compactos, categorias con imagenes reales, productos destacados, bloque de confianza/legalidad y newsletter.
- No usar placeholders externos en UI final. Prioridad: imagenes de Directus; si faltan, usar fallback local controlado.
- Cards con radio maximo 8px, borde de 1px y sombra minima o inexistente.
- Evitar cards dentro de cards, orbes decorativos, blobs, fondos con gradientes grandes y secciones flotantes.
- Mantener navegacion clara hacia `/products/semillas` y `/products/ropa`; no usar rutas legacy `/categories/*`.

## Components
- Buttons: 8px radius, altura 44-48px, texto Nunito semibold. CTA principal solido en `ink` o `brand-green`; secundario outline con borde `border`.
- Product cards: imagen cuadrada o 4:5, nombre claro, precio visible, badges discretos, hover con micro-movimiento usando `useMotion()`.
- Category tiles: imagen real, overlay muy leve, titulo legible, sin degradados pesados.
- Newsletter: formulario sobrio, estados de error/success accesibles, sin duplicar estilos visuales del footer.
- Header/footer deben parecer parte del nuevo sistema; footer mantiene `Walking in the street` solo en encabezados de listas.

## Motion
- Usar `useMotion()` / AnimeJS para entradas suaves, hover de cards y feedback de formulario.
- Respetar `prefers-reduced-motion`.
- No crear nuevas clases `transition-*` como patron principal; migrar gradualmente.

## Do
- Usar producto, genetica, confianza y compra discreta como mensajes principales.
- Priorizar claridad ecommerce sobre decoracion.
- Mantener una paleta contenida con acentos azul/verde.
- Probar mobile primero.

## Don't
- No usar `Walking in the street` en headings de paginas, hero, cards o botones.
- No usar placeholders `placehold.co` en la home final.
- No convertir toda la pagina en gradientes azul/verde.
- No usar radios mayores a 8px en nuevas superficies.
