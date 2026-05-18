export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { refresh_token } = body

    if (!refresh_token) {
      throw createError({
        statusCode: 400,
        message: 'Refresh token no proporcionado'
      })
    }

    // Refrescar el token con Directus
    const refreshResponse = await directusFetch<{
      data: {
        access_token: string
        refresh_token: string
        expires: number
      }
    }>('/auth/refresh', {
      method: 'POST',
      body: {
        refresh_token,
        mode: 'json'
      }
    })

    return {
      success: true,
      data: {
        access_token: refreshResponse.data.access_token,
        refresh_token: refreshResponse.data.refresh_token,
        expires: refreshResponse.data.expires
      }
    }
  } catch (error: any) {
    console.error('Error al refrescar token:', error)
    
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: 'Refresh token inválido o expirado'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al refrescar token'
    })
  }
})
