import type { AjustesWeb, DirectusResponse, SocialMediaLink } from "~~/types"

/**
 * Composable para obtener y gestionar los ajustes web desde Directus
 */
export const useAjustesWeb = () => {
  const config = useRuntimeConfig()
  const directusUrl = config.public.directus.url

  /**
   * Construye la URL completa de un asset de Directus
   */
  const getAssetUrl = (fileId: string): string => {
    if (!fileId) return ''
    return `${directusUrl}/assets/${fileId}`
  }

  /**
   * Valida si un enlace de red social es válido
   */
  const isValidSocialLink = (url: string | null): boolean => {
    return !!(url && url !== '' && url !== '#')
  }

  /**
   * Obtiene los ajustes web desde la API
   * Usa transform para extraer automáticamente el data del DirectusResponse
   */
  const fetchAjustesWeb = async () => {
    const { data, pending, error, refresh } = await useFetch(
      '/api/ajustes-web',
      {
        // Transform extrae automáticamente 'data' del DirectusResponse
        transform: (response: DirectusResponse<AjustesWeb>) => response.data,
        // Cache the response
        key: 'ajustes-web'
      }
    )

    return {
      ajustes: data,
      pending,
      error,
      refresh
    }
  }

  /**
   * Obtiene las redes sociales válidas (filtra las que están vacías o con #)
   */
  const getValidSocialLinks = (ajustes: AjustesWeb | null): SocialMediaLink[] => {
    if (!ajustes) return []

    const socialLinks: SocialMediaLink[] = [
      { name: 'Facebook', icon: 'mdi:facebook', url: ajustes.facebook },
      { name: 'Instagram', icon: 'mdi:instagram', url: ajustes.instagram },
      { name: 'WhatsApp', icon: 'mdi:whatsapp', url: ajustes.whatsapp },
      { name: 'Telegram', icon: 'mdi:telegram', url: ajustes.telegram }
    ]

    // Filtrar solo las redes sociales con URLs válidas
    return socialLinks.filter(social => isValidSocialLink(social.url))
  }

  /**
   * Formatea el número de teléfono para href
   */
  const formatPhoneHref = (phone: string | null): string => {
    if (!phone) return ''
    // Eliminar espacios y guiones para el href
    return `tel:+34${phone.replace(/\s|-/g, '')}`
  }

  /**
   * Formatea el email para href
   */
  const formatEmailHref = (email: string | null): string => {
    if (!email) return ''
    return `mailto:${email}`
  }

  return {
    fetchAjustesWeb,
    getAssetUrl,
    isValidSocialLink,
    getValidSocialLinks,
    formatPhoneHref,
    formatEmailHref
  }
}
