/**
 * Server API route to subscribe to newsletter
 * Endpoint: POST /api/newsletter
 * Body: { email: string }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email no válido'
      })
    }

    // Directus URL
    const directusUrl = 'http://161.35.46.209:8055'
    
    // Enviar a Directus
    const response = await $fetch(
      `${directusUrl}/items/newsletter`,
      {
        method: 'POST',
        body: {
          email
        }
      }
    )

    return {
      success: true,
      message: '¡Suscripción exitosa!'
    }
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error)
    
    // Si el error es de Directus (email duplicado)
    if (error.response?.status === 400 || error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Este email ya está suscrito'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al suscribirse. Inténtalo de nuevo.'
    })
  }
})
