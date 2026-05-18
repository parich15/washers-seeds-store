/**
 * Server API route dinámica para obtener un item específico por slug
 * Endpoint: /api/[collection]/[slug]
 * Ejemplos: /api/semillas/northern-lights, /api/ropa/sudadera-logo
 * 
 * ⚠️ IMPORTANTE: Incluye productos relacionados con fields especiales
 */
export default defineEventHandler(async (event) => {
  try {
    const collection = assertCollectionType(getRouterParam(event, 'collection'))
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Colección o slug no especificados'
      })
    }
    
    // ⚠️ CRÍTICO: Fields con productos relacionados anidados
    const fields = '*,producto.*,producto.relacionados.related_productos_id.*'
    
    const response = await directusFetch<{ data: any[] }>(`/items/${collection}`, {
      method: 'GET',
      query: {
        fields,
        'filter[producto][slug][_eq]': slug
      }
    })

    return {
      data: response.data.map(item => normalizeCollectionItem(item, collection))
    }
  } catch (error) {
    console.error(`Error fetching item by slug:`, error)
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener el producto'
    })
  }
})
