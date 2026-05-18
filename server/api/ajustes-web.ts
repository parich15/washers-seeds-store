import type { DirectusResponse, AjustesWeb } from '~~/types'

/**
 * Server API route to fetch website settings from Directus
 * Endpoint: /api/ajustes-web
 */
export default defineEventHandler(async (event) => {
  try {
    // Fetch datos_web collection from Directus
    const response = await directusFetch<DirectusResponse<AjustesWeb>>('/items/datos_web/1', {
      method: 'GET'
    })

    return response
  } catch (error) {
    console.error('Error fetching ajustes web:', error)
    
    // Return error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener la configuración del sitio web'
    })
  }
})
