/**
 * Server API route to fetch semillas from Directus
 * Endpoint: /api/semillas
 * IMPORTANTE: Usa fields=producto.*,* para traer la relación completa
 */
export default defineEventHandler(async (event) => {
  try {
    // Directus URL
    const directusUrl = 'http://161.35.46.209:8055'
    
    // ⚠️ IMPORTANTE: fields=producto.*,* trae todos los campos de la relación producto
    const response = await $fetch(
      `${directusUrl}/items/semillas?fields=producto.*,*`,
      {
        method: 'GET'
      }
    )

    return response
  } catch (error) {
    console.error('Error fetching semillas:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener las semillas'
    })
  }
})
