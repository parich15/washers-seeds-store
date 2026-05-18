import type { CollectionItem, CollectionType, ProductoBase, Ropa, Semilla } from '~~/types'

const ALLOWED_COLLECTIONS = ['semillas', 'ropa'] as const

const asArray = <T>(value: T[] | null | undefined): T[] => Array.isArray(value) ? value : []

const asBoolean = (value: unknown): boolean => value === true

const normalizeAssetId = (value: unknown): string | null => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'directus_files_id' in value) {
    const file = (value as { directus_files_id?: unknown }).directus_files_id
    if (typeof file === 'string') return file
    if (file && typeof file === 'object' && 'id' in file) {
      return String((file as { id: unknown }).id)
    }
  }
  if (typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return null
}

export const getDirectusUrl = () => {
  const config = useRuntimeConfig()
  return config.directusUrl || config.public.directus.url
}

export const assertCollectionType = (collection: string | undefined): CollectionType => {
  if (!collection || !ALLOWED_COLLECTIONS.includes(collection as CollectionType)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Colección no soportada'
    })
  }

  return collection as CollectionType
}

export const directusFetch = <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
  const baseUrl = getDirectusUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return $fetch<T>(`${baseUrl}${normalizedPath}`, options)
}

export const getDirectusAssetUrl = (fileId: string | null | undefined): string => {
  if (!fileId) return 'https://placehold.co/600x600/36A9E1/FFF?text=Sin+Imagen'
  return `${getDirectusUrl()}/assets/${fileId}`
}

export const normalizeProductoBase = (producto: ProductoBase | null | undefined): ProductoBase => {
  const source = (producto || {}) as Partial<ProductoBase>

  return {
    id: Number(source.id || 0),
    nombre: source.nombre || '',
    imagen_principal: source.imagen_principal || null,
    disponible: source.disponible !== false,
    descripcion_corta: source.descripcion_corta || '',
    precio: source.precio || '0',
    stock: Number(source.stock || 0),
    sku: source.sku || '',
    slug: source.slug || '',
    descripcion: source.descripcion || '',
    nuevo: asBoolean(source.nuevo),
    descuento: asBoolean(source.descuento),
    precio_descuento: source.precio_descuento || null,
    meta_titulo: source.meta_titulo || null,
    meta_descripcion: source.meta_descripcion || null,
    meta_keywords: source.meta_keywords || null,
    galeria: asArray(source.galeria).map(normalizeAssetId).filter((id): id is string => Boolean(id)),
    relacionados: asArray(source.relacionados)
  }
}

export const normalizeCollectionItem = <T extends CollectionItem>(item: T, collection: CollectionType): T => {
  const normalized = {
    ...item,
    producto: normalizeProductoBase(item.producto)
  }

  if (collection === 'semillas') {
    const semilla = normalized as Semilla
    return {
      ...semilla,
      categoria: semilla.categoria || 'Feminizadas',
      cantidades: asArray(semilla.cantidades).map(cantidad => ({
        ...cantidad,
        descuento: asBoolean(cantidad.descuento),
        precio_descuento: cantidad.precio_descuento || cantidad.precio
      })),
      zonas_climaticas: asArray(semilla.zonas_climaticas),
      efectos: asArray(semilla.efectos),
      sabores: asArray(semilla.sabores),
      aromas: asArray(semilla.aromas),
      medicinales: asArray(semilla.medicinales)
    } as T
  }

  const ropa = normalized as Ropa
  return {
    ...ropa,
    categoria: ropa.categoria || 'Accesorios',
    tallas: asArray(ropa.tallas),
    colores: asArray(ropa.colores)
  } as T
}
