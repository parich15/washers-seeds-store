export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, rememberMe } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email y contraseña son requeridos'
      })
    }

    // Autenticar con Directus
    const authResponse = await directusFetch<{
      data: {
        access_token: string
        refresh_token: string
        expires: number
      }
    }>('/auth/login', {
      method: 'POST',
      body: {
        email,
        password,
        // Si rememberMe está activo, usar modo de sesión más largo
        mode: rememberMe ? 'session' : 'cookie'
      }
    })

    // Obtener datos completos del usuario
    const userResponse = await directusFetch<{
      data: {
        id: string
        email: string
        first_name: string
        last_name: string
        avatar?: string
        role: string
      }
    }>('/users/me', {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`
      }
    })

    return {
      success: true,
      data: {
        user: {
          id: userResponse.data.id,
          email: userResponse.data.email,
          firstName: userResponse.data.first_name,
          lastName: userResponse.data.last_name,
          avatar: userResponse.data.avatar,
          role: userResponse.data.role
        },
        access_token: authResponse.data.access_token,
        refresh_token: authResponse.data.refresh_token,
        expires: authResponse.data.expires
      }
    }
  } catch (error: any) {
    console.error('Error en login:', error)
    
    // Manejar errores específicos de Directus
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: 'Credenciales incorrectas'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al iniciar sesión'
    })
  }
})
