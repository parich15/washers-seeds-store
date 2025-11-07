import type { CollectionItem, CollectionType, DirectusResponse, getPrecioItem } from '~/types'

/**
 * Composable genérico para obtener productos de cualquier colección de Directus
 * Soporta: semillas, ropa, y futuras colecciones
 */
export const useProducts = () => {
  const directusUrl = 'http://161.35.46.209:8055'

  /**
   * Obtiene todos los items de una colección
   * @param collection - Nombre de la colección ('semillas', 'ropa', etc.)
   */
  const fetchCollection = async <T = CollectionItem>(collection: CollectionType) => {
    const { data, pending, error, refresh } = await useFetch<T[]>(
      `/api/${collection}`,
      {
        transform: (response: DirectusResponse<T[]>) => response.data,
        key: `collection-${collection}`
      }
    )

    return {
      items: data,
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
    const { data, pending, error, refresh } = await useFetch<T | null>(
      `/api/${collection}/${slug}`,
      {
        transform: (response: DirectusResponse<T[]>) => {
          return response.data?.[0] || null
        },
        key: `item-${collection}-${slug}`
      }
    )

    return {
      item: data,
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
