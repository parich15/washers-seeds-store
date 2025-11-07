/**
 * Server API route dinámica para obtener un item específico por slug
 * Endpoint: /api/[collection]/[slug]
 * Ejemplos: /api/semillas/northern-lights, /api/ropa/sudadera-logo
 * 
 * ⚠️ IMPORTANTE: Incluye productos relacionados con fields especiales
 */
export default defineEventHandler(async (event) => {
  try {
    const collection = getRouterParam(event, 'collection')
    const slug = getRouterParam(event, 'slug')
    
    if (!collection || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Colección o slug no especificados'
      })
    }

    const directusUrl = 'http://161.35.46.209:8055'
    
    // ⚠️ CRÍTICO: Fields con productos relacionados anidados
    const fields = '*,producto.*,producto.relacionados.related_productos_id.*'
    
    const response = await $fetch(
      `${directusUrl}/items/${collection}?filter[producto][slug][_eq]=${slug}&fields=${fields}`,
      {
        method: 'GET'
      }
    )

    return response
  } catch (error) {
    console.error(`Error fetching item by slug:`, error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el producto'
    })
  }
})
