// ==================== PRODUCT TYPES - DIRECTUS ====================
// Tipos que reflejan la estructura de Directus

// ========== PRODUCTO BASE (Colección principal) ==========
export interface ProductoBase {
  id: number
  nombre: string
  imagen_principal: string | null
  disponible: boolean
  descripcion_corta: string
  precio: string  // Usado en Ropa, no en Semillas
  stock: number
  sku: string
  slug: string
  descripcion: string
  nuevo: boolean
  descuento: boolean
  precio_descuento: string | null
  meta_titulo: string | null
  meta_descripcion: string | null
  meta_keywords: string | null
  galeria: any[]  // Array de IDs/UUIDs de assets de Directus
  relacionados: RelacionProducto[]  // Productos relacionados
}

export interface RelacionProducto {
  related_productos_id: ProductoBase
}

// ========== CANTIDAD (Para precios por cantidad en Semillas) ==========
export interface Cantidad {
  cantidad: number
  precio: string
  descuento: boolean
  precio_descuento: string
}

// ========== SEMILLA (Colección semillas) ==========
export interface Semilla {
  id: number
  categoria: SeedCategory
  cantidades: Cantidad[]  // ⚠️ IMPORTANTE: El precio real está aquí, no en producto.precio
  thc: string
  cbd: string
  linaje: string
  dominancia: SeedDominance
  dias_floracion: number
  texto_floracion: string
  rendimiento_interior: string
  rendimiento_exterior: string
  altura_interior: string
  altura_exterior: string
  dificultad: SeedDifficulty
  zonas_climaticas: string[]
  efectos: string[]
  sabores: string[]
  aromas: string[]
  medicinales: string[] | null
  producto: ProductoBase  // Relación con producto base
}

// ========== ENUMS Y TYPES ==========

export type SeedCategory = 
  | 'Feminizadas' 
  | 'Autoflorecientes' 
  | 'Regulares' 
  | 'CBD'

export type SeedDominance = 
  | 'indica' 
  | 'sativa' 
  | 'hibrida'

export type SeedDifficulty = 
  | 'Fácil' 
  | 'Medio' 
  | 'Difícil'

// ========== ROPA (Colección ropa) ==========
export interface Ropa {
  id: number
  tallas: Talla[]
  colores: Color[]
  categoria: RopaCategory
  producto: ProductoBase  // Relación con producto base
}

export interface Talla {
  talla: string  // 'S', 'M', 'L', 'XL', 'XXL'
}

export interface Color {
  color: string
}

export type RopaCategory = 
  | 'Sudadera' 
  | 'Camiseta' 
  | 'Gorra' 
  | 'Pantalon' 
  | 'Accesorios'

// ========== TIPOS AUXILIARES ==========

// Union type para items de colección
export type CollectionItem = Semilla | Ropa

// Tipo de colección
export type CollectionType = 'semillas' | 'ropa'

// ========== FILTROS DE SEMILLAS ==========

export interface SemillaFilters {
  categoria?: SeedCategory[]
  dominancia?: SeedDominance[]
  dificultad?: SeedDifficulty[]
  diasFloracionMin?: number
  diasFloracionMax?: number
  precioMin?: number
  precioMax?: number
  disponible?: boolean
  nuevo?: boolean
  descuento?: boolean
  search?: string
}

// ========== FILTROS DE ROPA ==========

export interface RopaFilters {
  categoria?: RopaCategory[]
  tallas?: string[]
  colores?: string[]
  precioMin?: number
  precioMax?: number
  disponible?: boolean
  nuevo?: boolean
  descuento?: boolean
  search?: string
}

// ========== HELPERS ==========

/**
 * Obtiene el precio de una semilla desde el array de cantidades
 * Usa la primera cantidad como referencia
 */
export function getSemillaPrecio(semilla: Semilla): {
  precio: number
  precioDescuento: number | null
  tieneDescuento: boolean
  cantidad: number
} {
  if (!semilla.cantidades || semilla.cantidades.length === 0) {
    return {
      precio: 0,
      precioDescuento: null,
      tieneDescuento: false,
      cantidad: 1
    }
  }
  
  const primeraCantidad = semilla.cantidades[0]!
  
  return {
    precio: parseFloat(primeraCantidad.precio),
    precioDescuento: primeraCantidad.descuento 
      ? parseFloat(primeraCantidad.precio_descuento) 
      : null,
    tieneDescuento: primeraCantidad.descuento,
    cantidad: primeraCantidad.cantidad
  }
}

/**
 * Convierte array de galería a URLs de assets de Directus
 */
export function getGaleriaUrls(galeria: any[], directusUrl: string): string[] {
  if (!galeria || galeria.length === 0) return []
  return galeria.map(id => `${directusUrl}/assets/${id}`)
}

/**
 * Obtiene la URL de la imagen principal
 */
export function getImagenPrincipalUrl(uuid: string | null, directusUrl: string): string {
  if (!uuid) return '/placeholder.jpg'
  return `${directusUrl}/assets/${uuid}`
}

/**
 * Obtiene el precio de cualquier item de colección (Semilla o Ropa)
 */
export function getPrecioItem(item: CollectionItem): {
  precio: number
  precioDescuento: number | null
  tieneDescuento: boolean
  cantidad?: number
} {
  // Si es Semilla, precio desde cantidades[0]
  if ('cantidades' in item) {
    return getSemillaPrecio(item)
  }
  
  // Si es Ropa, precio desde producto
  return {
    precio: parseFloat(item.producto.precio),
    precioDescuento: item.producto.descuento 
      ? parseFloat(item.producto.precio_descuento!) 
      : null,
    tieneDescuento: item.producto.descuento
  }
}
