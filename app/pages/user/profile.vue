<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

// Aplicar middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

// Estado del formulario
const formData = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  street: user.value?.address?.street || '',
  city: user.value?.address?.city || '',
  postalCode: user.value?.address?.postalCode || '',
  country: user.value?.address?.country || 'España'
})

const isEditing = ref(false)
const isSaving = ref(false)
const errors = ref<Record<string, string>>({})
const saveSuccess = ref(false)

const enableEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Restaurar datos originales
  formData.value = {
    firstName: user.value?.firstName || '',
    lastName: user.value?.lastName || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    street: user.value?.address?.street || '',
    city: user.value?.address?.city || '',
    postalCode: user.value?.address?.postalCode || '',
    country: user.value?.address?.country || 'España'
  }
  errors.value = {}
}

const validate = () => {
  errors.value = {}
  
  if (!formData.value.firstName) errors.value.firstName = 'El nombre es obligatorio'
  if (!formData.value.lastName) errors.value.lastName = 'Los apellidos son obligatorios'
  if (!formData.value.email) errors.value.email = 'El email es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email no válido'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveProfile = async () => {
  if (!validate()) return
  
  isSaving.value = true
  
  try {
    const result = await authStore.updateProfile({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phone: formData.value.phone,
      address: {
        street: formData.value.street,
        city: formData.value.city,
        postalCode: formData.value.postalCode,
        country: formData.value.country,
        province: formData.value.city // Usar city como province por ahora
      }
    })
    
    if (result.success) {
      isEditing.value = false
      saveSuccess.value = true
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    } else {
      errors.value.general = result.error || 'Error al guardar los cambios'
    }
  } catch (error: any) {
    errors.value.general = error.message || 'Error al guardar los cambios'
  } finally {
    isSaving.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-4">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-main transition-colors">
            Inicio
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <span class="text-gray-900 font-medium">Mi Perfil</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
              Mi Perfil
            </h1>
            <p class="text-gray-600">
              Gestiona tu información personal
            </p>
          </div>
          <BaseButton
            variant="outline"
            icon="mdi:logout"
            @click="handleLogout"
          >
            Cerrar Sesión
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-4">
            <nav class="space-y-2">
              <NuxtLink
                to="/user/profile"
                class="flex items-center gap-3 px-4 py-3 rounded-lg bg-main/10 text-main font-medium"
              >
                <Icon icon="mdi:account" class="text-xl" />
                <span>Mi Perfil</span>
              </NuxtLink>
              <NuxtLink
                to="/user/orders"
                class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon icon="mdi:package-variant" class="text-xl" />
                <span>Mis Pedidos</span>
              </NuxtLink>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <Icon icon="mdi:logout" class="text-xl" />
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Profile Content -->
        <div class="lg:col-span-3">
          <!-- Success Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <div v-if="saveSuccess" class="mb-6 p-4 bg-secondary/10 border border-secondary rounded-lg flex items-center gap-3">
              <Icon icon="mdi:check-circle" class="text-secondary text-2xl" />
              <span class="text-secondary font-medium">¡Cambios guardados correctamente!</span>
            </div>
          </Transition>

          <!-- Profile Form -->
          <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">Información Personal</h2>
              <BaseButton
                v-if="!isEditing"
                variant="outline"
                size="sm"
                icon="mdi:pencil"
                @click="enableEdit"
              >
                Editar
              </BaseButton>
            </div>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <!-- Avatar Section -->
              <div class="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div class="w-24 h-24 rounded-full bg-gradient flex items-center justify-center text-white text-3xl font-bold">
                  {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-lg font-bold">{{ user?.firstName }} {{ user?.lastName }}</h3>
                  <p class="text-gray-600">{{ user?.email }}</p>
                  <p class="text-sm text-gray-500 mt-1">
                    Miembro desde {{ new Date(user?.createdAt || '').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) }}
                  </p>
                </div>
              </div>

              <!-- Personal Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <BaseInput
                    v-model="formData.firstName"
                    :disabled="!isEditing"
                    :error="errors.firstName"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <BaseInput
                    v-model="formData.lastName"
                    :disabled="!isEditing"
                    :error="errors.lastName"
                  />
                </div>
              </div>

              <!-- Contact Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <BaseInput
                    v-model="formData.email"
                    type="email"
                    :disabled="!isEditing"
                    :error="errors.email"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <BaseInput
                    v-model="formData.phone"
                    type="tel"
                    :disabled="!isEditing"
                  />
                </div>
              </div>

              <!-- Address Section -->
              <div class="pt-6 border-t border-gray-200">
                <h3 class="text-lg font-bold mb-4">Dirección de Envío</h3>
                
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <BaseInput
                      v-model="formData.street"
                      :disabled="!isEditing"
                      placeholder="Calle, número, piso..."
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <BaseInput
                        v-model="formData.city"
                        :disabled="!isEditing"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <BaseInput
                        v-model="formData.postalCode"
                        :disabled="!isEditing"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <BaseInput
                        v-model="formData.country"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="isEditing" class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <BaseButton
                  variant="outline"
                  type="button"
                  @click="cancelEdit"
                  class="flex-1"
                >
                  Cancelar
                </BaseButton>
                <BaseButton
                  variant="gradient"
                  type="submit"
                  :disabled="isSaving"
                  class="flex-1"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Change Password Section -->
          <div class="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
            <h2 class="text-2xl font-bold mb-4">Cambiar Contraseña</h2>
            <p class="text-gray-600 mb-6">
              Actualiza tu contraseña regularmente para mantener tu cuenta segura
            </p>
            <BaseButton
              variant="outline"
              icon="mdi:lock-reset"
            >
              Cambiar Contraseña
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
