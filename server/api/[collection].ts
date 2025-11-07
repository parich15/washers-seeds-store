/**
 * Server API route dinámica para obtener items de cualquier colección
 * Endpoint: /api/[collection]
 * Ejemplos: /api/semillas, /api/ropa
 */
export default defineEventHandler(async (event) => {
  try {
    const collection = getRouterParam(event, 'collection')
    
    if (!collection) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Colección no especificada'
      })
    }

    const directusUrl = 'http://161.35.46.209:8055'
    
    // Fields para traer producto completo
    const fields = 'producto.*,*'
    
    const response = await $fetch(
      `${directusUrl}/items/${collection}?fields=${fields}`,
      {
        method: 'GET'
      }
    )

    return response
  } catch (error) {
    console.error(`Error fetching collection:`, error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los items de la colección'
    })
  }
})
