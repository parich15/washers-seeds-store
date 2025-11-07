import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  // Verificar autenticación al montar
  onMounted(() => {
    authStore.checkAuth()
  })

  // Utilidades
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.currentUser)
  const isLoading = computed(() => authStore.loading)
  const authError = computed(() => authStore.error)

  // Login
  const login = async (email: string, password: string, rememberMe = false) => {
    const result = await authStore.login({ email, password, rememberMe })
    return result
  }

  // Register
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    acceptTerms: boolean
  }) => {
    const result = await authStore.register(data)
    return result
  }

  // Logout
  const logout = () => {
    authStore.logout()
    router.push('/auth/login')
  }

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string) => {
    return authStore.user?.role === role
  }

  // Proteger ruta - redirigir si no está autenticado
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push('/auth/login')
      return false
    }
    return true
  }

  return {
    // Estado
    isAuthenticated,
    currentUser,
    isLoading,
    authError,
    
    // Acciones
    login,
    register,
    logout,
    
    // Utilidades
    hasRole,
    requireAuth
  }
}
