export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Token de autenticación no proporcionado'
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Obtener datos del usuario desde Directus
    const userResponse = await directusFetch<{
      data: {
        id: string
        email: string
        first_name: string
        last_name: string
        avatar?: string
        role: string
        phone?: string
      }
    }>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {
      success: true,
      data: {
        id: userResponse.data.id,
        email: userResponse.data.email,
        firstName: userResponse.data.first_name,
        lastName: userResponse.data.last_name,
        avatar: userResponse.data.avatar,
        role: userResponse.data.role,
        phone: userResponse.data.phone
      }
    }
  } catch (error: any) {
    console.error('Error al obtener usuario:', error)
    
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: 'Token inválido o expirado'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al obtener datos del usuario'
    })
  }
})
