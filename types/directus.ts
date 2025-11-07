// ==================== DIRECTUS TYPES ====================

/**
 * Generic Directus API Response wrapper
 * All Directus API responses wrap the actual data in a 'data' property
 */
export interface DirectusResponse<T> {
  data: T
}

/**
 * Ajustes Web - Configuración global del sitio web
 * Colección: datos_web
 */
export interface AjustesWeb {
  id: number
  logo_navbar: string // UUID del asset en Directus
  logo_footer: string // UUID del asset en Directus
  direccion_1: string
  direccion_2: string | null
  telefono_1: string
  telefono_2: string | null
  email: string
  facebook: string
  instagram: string
  whatsapp: string
  telegram: string
}

/**
 * Social media link with icon
 */
export interface SocialMediaLink {
  name: string
  icon: string
  url: string
}
