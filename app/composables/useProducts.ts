import type { CollectionItem, CollectionType, DirectusResponse } from '~~/types'

/**
 * Composable genérico para obtener productos de cualquier colección de Directus
 * Soporta: semillas, ropa, y futuras colecciones
 */
export const useProducts = () => {
  const config = useRuntimeConfig()
  const directusUrl = config.public.directus.url

  /**
   * Obtiene todos los items de una colección
   * @param collection - Nombre de la colección ('semillas', 'ropa', etc.)
   */
  const fetchCollection = async <T = CollectionItem>(collection: CollectionType) => {
    const { data, pending, error, refresh } = await useFetch<DirectusResponse<T[]>>(
      `/api/${collection}`,
      {
        key: `collection-${collection}`
      }
    )
    const items = computed<T[]>(() => data.value?.data || [])

    return {
      items,
      pending,
      error,
      refresh
    }
  }

  /**
   * Obtiene un item específico por slug del producto
   * @param collection - Nombre de la colección
   * @param slug - Slug del producto
   */
  const fetchItemBySlug = async <T = CollectionItem>(
    collection: CollectionType, 
    slug: string
  ) => {
    const { data, pending, error, refresh } = await useFetch<DirectusResponse<T[]>>(
      `/api/${collection}/${slug}`,
      {
        key: `item-${collection}-${slug}`
      }
    )
    const item = computed<T | null>(() => data.value?.data?.[0] || null)

    return {
      item,
      pending,
      error,
      refresh
    }
  }

  /**
   * Obtiene la URL de una imagen desde Directus
   */
  const getImageUrl = (uuid: string | null): string => {
    if (!uuid) {
      return 'https://placehold.co/600x600/36A9E1/FFF?text=Sin+Imagen'
    }
    return `${directusUrl}/assets/${uuid}`
  }

  /**
   * Obtiene las URLs de una galería de imágenes
   */
  const getGalleryUrls = (galeria: any[]): string[] => {
    if (!galeria || galeria.length === 0) return []
    return galeria.map(id => `${directusUrl}/assets/${id}`)
  }

  return {
    fetchCollection,
    fetchItemBySlug,
    getImageUrl,
    getGalleryUrls,
    directusUrl
  }
}
