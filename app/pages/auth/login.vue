<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const showPassword = ref(false)

const validate = () => {
  errors.value = {}
  
  if (!formData.value.email) {
    errors.value.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email no válido'
  }
  
  if (!formData.value.password) {
    errors.value.password = 'La contraseña es obligatoria'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validate()) return
  
  isLoading.value = true
  
  try {
    // Simulación de login (aquí iría la llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock login exitoso
    authStore.login({
      id: '1',
      email: formData.value.email,
      name: 'Usuario',
      lastName: 'Demo'
    })
    
    // Redirigir a la página anterior o al home
    router.push('/')
  } catch (error) {
    errors.value.general = 'Credenciales incorrectas'
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-4xl font-bold text-gradient mb-2">
            Washer Seeds
          </h1>
        </NuxtLink>
        <p class="text-gray-600">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-xl shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <BaseInput
              v-model="formData.email"
              type="email"
              placeholder="tu@email.com"
              :error="errors.email"
            >
              <template #prefix>
                <Icon icon="mdi:email" class="text-gray-400" />
              </template>
            </BaseInput>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <BaseInput
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :error="errors.password"
            >
              <template #prefix>
                <Icon icon="mdi:lock" class="text-gray-400" />
              </template>
              <template #suffix>
                <button
                  type="button"
                  @click="togglePassword"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                </button>
              </template>
            </BaseInput>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.rememberMe"
                class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
              >
              <span class="text-sm text-gray-700">Recordarme</span>
            </label>
            <NuxtLink to="/auth/forgot-password" class="text-sm text-main hover:underline">
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <div v-if="errors.general" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 flex items-center gap-2">
              <Icon icon="mdi:alert-circle" class="text-lg" />
              {{ errors.general }}
            </p>
          </div>

          <!-- Submit Button -->
          <BaseButton
            variant="gradient"
            size="lg"
            type="submit"
            :disabled="isLoading"
            full-width
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </BaseButton>
        </form>

        <div class="divider" />

        <!-- Register Link -->
        <p class="text-center text-gray-600">
          ¿No tienes cuenta?
          <NuxtLink to="/auth/register" class="text-main font-medium hover:underline">
            Regístrate aquí
          </NuxtLink>
        </p>
      </div>

      <!-- Social Login (Optional) -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">O continúa con</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="mdi:google" class="text-xl text-red-500" />
            <span class="text-sm font-medium">Google</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="mdi:facebook" class="text-xl text-blue-600" />
            <span class="text-sm font-medium">Facebook</span>
          </button>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-main transition-colors">
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
