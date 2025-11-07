import type { MenuResponse, DirectusResponse } from '~~/types'

/**
 * Server API route to fetch menus from Directus
 * Endpoint: /api/menus
 * Returns array with Navbar and Footer menus
 */
export default defineEventHandler(async (event) => {
  try {
    // Directus URL - hardcoded hasta tener dominio
    const directusUrl = 'http://161.35.46.209:8055'
    
    // Fetch menus collection from Directus
    const response = await $fetch<DirectusResponse<MenuResponse[]>>(
      `${directusUrl}/items/menus`,
      {
        method: 'GET'
      }
    )

    // Extract data from Directus response
    return response.data
  } catch (error) {
    console.error('Error fetching menus:', error)
    
    // Return error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los menús'
    })
  }
})
