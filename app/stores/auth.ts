import { defineStore } from 'pinia'
import type { User, AuthCredentials, RegisterData, AuthState } from '../types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
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
    async login(credentials: AuthCredentials & { rememberMe?: boolean }) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          success: boolean
          data: {
            user: User
            access_token: string
            refresh_token: string
            expires: number
          }
        }>('/api/auth/login', {
          method: 'POST',
          body: {
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe || false
          }
        })

        if (response.success && response.data) {
          this.user = response.data.user
          this.token = response.data.access_token
          this.refreshToken = response.data.refresh_token
          this.isAuthenticated = true

          // Persistir en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }

          return { success: true, user: response.data.user }
        }

        throw new Error('Respuesta inválida del servidor')
      } catch (error: any) {
        this.error = error.data?.message || error.message || 'Error al iniciar sesión'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          success: boolean
          message: string
          data: {
            user: User
            access_token: string
            refresh_token: string
            expires: number
          }
        }>('/api/auth/register', {
          method: 'POST',
          body: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            acceptTerms: data.acceptTerms
          }
        })

        if (response.success && response.data) {
          this.user = response.data.user
          this.token = response.data.access_token
          this.refreshToken = response.data.refresh_token
          this.isAuthenticated = true

          // Persistir en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }

          return { success: true, user: response.data.user }
        }

        throw new Error('Respuesta inválida del servidor')
      } catch (error: any) {
        this.error = error.data?.message || error.message || 'Error al registrarse'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false

      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    },

    async checkAuth() {
      // Restaurar sesión desde localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('refresh_token')
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            this.user = user
            this.token = token
            this.refreshToken = refreshToken
            this.isAuthenticated = true

            // Verificar si el token es válido
            await this.verifyToken()
          } catch (error) {
            console.error('Error al restaurar sesión:', error)
            this.logout()
          }
        }
      }
    },

    async verifyToken() {
      if (!this.token) return

      try {
        await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (error) {
        // Si el token no es válido, intentar refrescarlo
        if (this.refreshToken) {
          await this.refreshAccessToken()
        } else {
          this.logout()
        }
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }

      try {
        const response = await $fetch<{
          success: boolean
          data: {
            access_token: string
            refresh_token: string
            expires: number
          }
        }>('/api/auth/refresh', {
          method: 'POST',
          body: {
            refresh_token: this.refreshToken
          }
        })

        if (response.success && response.data) {
          this.token = response.data.access_token
          this.refreshToken = response.data.refresh_token

          // Actualizar en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
          }

          return true
        }

        this.logout()
        return false
      } catch (error) {
        console.error('Error al refrescar token:', error)
        this.logout()
        return false
      }
    },

    async updateProfile(data: Partial<User>) {
      if (!this.user) return { success: false, error: 'No hay usuario autenticado' }

      this.loading = true
      this.error = null

      try {
        // TODO: Implementar actualización de perfil con Directus
        this.user = { ...this.user, ...data }

        // Actualizar en localStorage
        if (typeof window !== 'undefined') {
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
