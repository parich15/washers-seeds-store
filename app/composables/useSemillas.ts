import type { DirectusResponse, Semilla, getSemillaPrecio, getImagenPrincipalUrl, getGaleriaUrls } from '~~/types'

/**
 * Composable para obtener y gestionar las semillas desde Directus
 */
export const useSemillas = () => {
  const directusUrl = 'http://161.35.46.209:8055'

  /**
   * Obtiene todas las semillas desde la API
   */
  const fetchSemillas = async () => {
    const { data, pending, error, refresh } = await useFetch(
      '/api/semillas',
      {
        // Transform extrae automáticamente 'data' del DirectusResponse
        transform: (response: DirectusResponse<Semilla[]>): Semilla[] => response.data,
        // Cache the response
        key: 'semillas'
      }
    )

    return {
      semillas: data,
      pending,
      error,
      refresh
    }
  }

  /**
   * Obtiene una semilla por su slug
   */
  const fetchSemillaBySlug = async (slug: string) => {
    const { semillas, pending, error } = await fetchSemillas()
    
    const semilla = computed(() => 
      semillas.value?.find(s => s.producto.slug === slug) || null
    )

    return {
      semilla,
      pending,
      error
    }
  }

  /**
   * Obtiene la URL de la imagen principal de un producto
   */
  const getImageUrl = (uuid: string | null): string => {
    return `${directusUrl}/assets/${uuid}`
  }

  /**
   * Obtiene las URLs de la galería de un producto
   */
  const getGalleryUrls = (galeria: any[]): string[] => {
    if (!galeria || galeria.length === 0) return []
    return galeria.map(id => `${directusUrl}/assets/${id}`)
  }

  return {
    fetchSemillas,
    fetchSemillaBySlug,
    getImageUrl,
    getGalleryUrls,
    directusUrl
  }
}
