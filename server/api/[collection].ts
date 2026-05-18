/**
 * Server API route dinámica para obtener items de cualquier colección
 * Endpoint: /api/[collection]
 * Ejemplos: /api/semillas, /api/ropa
 */
export default defineEventHandler(async (event) => {
  try {
    const collection = assertCollectionType(getRouterParam(event, 'collection'))
    
    // Fields para traer producto completo
    const fields = 'producto.*,*'
    
    const response = await directusFetch<{ data: any[] }>(`/items/${collection}`, {
      method: 'GET',
      query: { fields }
    })

    return {
      data: response.data.map(item => normalizeCollectionItem(item, collection))
    }
  } catch (error) {
    console.error(`Error fetching collection:`, error)
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener los items de la colección'
    })
  }
})
