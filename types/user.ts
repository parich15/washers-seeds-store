// ==================== USER TYPES ====================

import type { Address } from './common'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role?: string
  address?: Address
  addresses?: Address[]
  createdAt?: string
  updatedAt?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData extends AuthCredentials {
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
