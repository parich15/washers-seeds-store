export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Si no está en cliente, no validar (SSR)
  if (import.meta.server) {
    return
  }

  // Verificar autenticación desde localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      // No hay sesión, redirigir a login
      return navigateTo('/auth/login')
    }

    // Si el store no tiene la info, restaurarla
    if (!authStore.isAuthenticated) {
      try {
        const user = JSON.parse(userStr)
        authStore.user = user
        authStore.token = token
        authStore.refreshToken = localStorage.getItem('refresh_token')
        authStore.isAuthenticated = true
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        return navigateTo('/auth/login')
      }
    }
  }
})
