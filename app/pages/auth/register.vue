<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const validate = () => {
  errors.value = {}
  
  if (!formData.value.name) {
    errors.value.name = 'El nombre es obligatorio'
  }
  
  if (!formData.value.lastName) {
    errors.value.lastName = 'Los apellidos son obligatorios'
  }
  
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
  
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  
  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validate()) return
  
  isLoading.value = true
  
  try {
    // Simulación de registro (aquí iría la llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock registro exitoso - auto login
    authStore.login({
      id: Date.now().toString(),
      email: formData.value.email,
      name: formData.value.name,
      lastName: formData.value.lastName
    })
    
    // Redirigir al home
    router.push('/')
  } catch (error) {
    errors.value.general = 'Error al crear la cuenta. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
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
          Crea tu cuenta y empieza a comprar
        </p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded-xl shadow-md p-8">
        <h2 class="text-2xl font-bold mb-6">Crear Cuenta</h2>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name & Last Name -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <BaseInput
                v-model="formData.name"
                placeholder="Tu nombre"
                :error="errors.name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellidos *
              </label>
              <BaseInput
                v-model="formData.lastName"
                placeholder="Apellidos"
                :error="errors.lastName"
              />
            </div>
          </div>

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
              placeholder="Mínimo 6 caracteres"
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

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <BaseInput
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repite tu contraseña"
              :error="errors.confirmPassword"
            >
              <template #prefix>
                <Icon icon="mdi:lock-check" class="text-gray-400" />
              </template>
              <template #suffix>
                <button
                  type="button"
                  @click="toggleConfirmPassword"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <Icon :icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                </button>
              </template>
            </BaseInput>
          </div>

          <!-- Terms & Newsletter -->
          <div class="space-y-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.acceptTerms"
                class="mt-1 w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
              >
              <span class="text-sm text-gray-700">
                Acepto los
                <NuxtLink to="/legal" class="text-main hover:underline">términos y condiciones</NuxtLink>
                y la
                <NuxtLink to="/privacy" class="text-main hover:underline">política de privacidad</NuxtLink>
                *
              </span>
            </label>
            <p v-if="errors.acceptTerms" class="text-red-500 text-sm">
              {{ errors.acceptTerms }}
            </p>

            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.newsletter"
                class="mt-1 w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
              >
              <span class="text-sm text-gray-700">
                Quiero recibir ofertas y novedades por email
              </span>
            </label>
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
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </BaseButton>
        </form>

        <div class="divider" />

        <!-- Login Link -->
        <p class="text-center text-gray-600">
          ¿Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="text-main font-medium hover:underline">
            Inicia sesión
          </NuxtLink>
        </p>
      </div>

      <!-- Social Register (Optional) -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">O regístrate con</span>
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
