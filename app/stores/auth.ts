import { defineStore } from 'pinia'
import type { User, AuthCredentials, RegisterData, AuthState } from '../types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userFullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    }
  },

  actions: {
    async login(credentials: AuthCredentials) {
      this.loading = true
      this.error = null

      try {
        // TODO: Reemplazar con llamada real a la API
        // Simulación de login
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock user data
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          firstName: 'Usuario',
          lastName: 'Demo',
          createdAt: new Date().toISOString()
        }

        const mockToken = 'mock-jwt-token-' + Date.now()

        this.user = mockUser
        this.token = mockToken
        this.isAuthenticated = true

        // Persistir en localStorage
        if (process.client) {
          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error: any) {
        this.error = error.message || 'Error al iniciar sesión'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true
      this.error = null

      try {
        // TODO: Reemplazar con llamada real a la API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock user data
        const mockUser: User = {
          id: Date.now().toString(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          createdAt: new Date().toISOString()
        }

        const mockToken = 'mock-jwt-token-' + Date.now()

        this.user = mockUser
        this.token = mockToken
        this.isAuthenticated = true

        // Persistir en localStorage
        if (process.client) {
          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error: any) {
        this.error = error.message || 'Error al registrarse'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // Limpiar localStorage
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    checkAuth() {
      // Restaurar sesión desde localStorage
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            this.user = user
            this.token = token
            this.isAuthenticated = true
          } catch (error) {
            console.error('Error al restaurar sesión:', error)
            this.logout()
          }
        }
      }
    },

    async updateProfile(data: Partial<User>) {
      if (!this.user) return { success: false, error: 'No hay usuario autenticado' }

      this.loading = true
      this.error = null

      try {
        // TODO: Reemplazar con llamada real a la API
        await new Promise(resolve => setTimeout(resolve, 500))

        this.user = { ...this.user, ...data }

        // Actualizar en localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        return { success: true, user: this.user }
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar perfil'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
