/**
 * Server API route to send contact form
 * Endpoint: POST /api/contacto
 * Body: { nombre, email, telefono, asunto, mensaje }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nombre, email, telefono, asunto, mensaje } = body

    // Validaciones básicas
    if (!nombre || !email || !asunto || !mensaje) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan campos obligatorios'
      })
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email no válido'
      })
    }

    // Enviar a Directus
    await directusFetch('/items/contacto', {
      method: 'POST',
      body: {
        nombre,
        email,
        telefono: telefono || null,
        asunto,
        mensaje
      }
    })

    return {
      success: true,
      message: 'Mensaje enviado correctamente'
    }
  } catch (error: any) {
    console.error('Error sending contact form:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al enviar el mensaje. Inténtalo de nuevo.'
    })
  }
})
