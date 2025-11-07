export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, firstName, lastName } = body

    // Validaciones
    if (!email || !password || !firstName || !lastName) {
      throw createError({
        statusCode: 400,
        message: 'Todos los campos obligatorios deben completarse'
      })
    }

    

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    const directusUrl = 'http://161.35.46.209:8055'
    const CUSTOMER_ROLE_ID = 'a4769662-1a68-4285-bf32-9ce8023e2294'

    // Crear usuario en Directus
    const createUserResponse = await $fetch<{
      data: {
        id: string
        email: string
        first_name: string
        last_name: string
        role: string
      }
    }>(`${directusUrl}/users`, {
      method: 'POST',
      body: {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: CUSTOMER_ROLE_ID
      }
    })

    // Autenticar automáticamente después del registro
    const authResponse = await $fetch<{
      data: {
        access_token: string
        refresh_token: string
        expires: number
      }
    }>(`${directusUrl}/auth/login`, {
      method: 'POST',
      body: {
        email,
        password
      }
    })

    return {
      success: true,
      message: 'Cuenta creada exitosamente',
      data: {
        user: {
          id: createUserResponse.data.id,
          email: createUserResponse.data.email,
          firstName: createUserResponse.data.first_name,
          lastName: createUserResponse.data.last_name,
          role: createUserResponse.data.role
        },
        access_token: authResponse.data.access_token,
        refresh_token: authResponse.data.refresh_token,
        expires: authResponse.data.expires
      }
    }
  } catch (error: any) {
    console.error('Error en registro:', error)
    
    // Manejar errores específicos de Directus
    if (error.statusCode === 400) {
      throw createError({
        statusCode: 400,
        message: 'El email ya está registrado o los datos son inválidos'
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.errors?.[0]?.message || error.message || 'Error al crear la cuenta'
    })
  }
})
