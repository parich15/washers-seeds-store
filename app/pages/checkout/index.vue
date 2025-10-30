<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Verificar si el carrito está vacío y redirigir
if (cartStore.isEmpty) {
  router.push('/cart')
}

// Estado del formulario
const step = ref(1) // 1: Envío, 2: Pago, 3: Confirmación
const formData = ref({
  // Datos de envío
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'España',
  notes: '',
  // Método de pago
  paymentMethod: 'card',
  // Términos
  acceptTerms: false,
  newsletter: false
})

const errors = ref<Record<string, string>>({})
const isProcessing = ref(false)

// Métodos de pago disponibles
const paymentMethods = [
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    icon: 'mdi:credit-card',
    description: 'Visa, Mastercard, American Express'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'mdi:paypal',
    description: 'Paga de forma segura con PayPal'
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    icon: 'mdi:bank-transfer',
    description: 'Recibirás instrucciones por email'
  }
]

const cartSummary = computed(() => cartStore.cartSummary)
const cartItems = computed(() => cartStore.cartItems)

// Validación del formulario
const validateStep1 = () => {
  errors.value = {}
  
  if (!formData.value.firstName) errors.value.firstName = 'El nombre es obligatorio'
  if (!formData.value.lastName) errors.value.lastName = 'Los apellidos son obligatorios'
  if (!formData.value.email) errors.value.email = 'El email es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email no válido'
  }
  if (!formData.value.phone) errors.value.phone = 'El teléfono es obligatorio'
  if (!formData.value.address) errors.value.address = 'La dirección es obligatoria'
  if (!formData.value.city) errors.value.city = 'La ciudad es obligatoria'
  if (!formData.value.postalCode) errors.value.postalCode = 'El código postal es obligatorio'
  
  return Object.keys(errors.value).length === 0
}

const validateStep2 = () => {
  errors.value = {}
  
  if (!formData.value.paymentMethod) {
    errors.value.paymentMethod = 'Selecciona un método de pago'
  }
  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = 'Debes aceptar los términos y condiciones'
  }
  
  return Object.keys(errors.value).length === 0
}

// Navegación entre pasos
const goToStep = (newStep: number) => {
  if (newStep === 2 && !validateStep1()) {
    return
  }
  if (newStep === 3 && !validateStep2()) {
    return
  }
  step.value = newStep
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Procesar pedido
const processOrder = async () => {
  if (!validateStep2()) return
  
  isProcessing.value = true
  
  // Simulación de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Aquí iría la llamada a la API para crear el pedido
  console.log('Pedido procesado:', {
    formData: formData.value,
    cart: cartItems.value,
    total: cartSummary.value.total
  })
  
  // Limpiar carrito
  cartStore.clearCart()
  
  // Ir a paso 3 (confirmación)
  step.value = 3
  isProcessing.value = false
}

// Volver al carrito
const goBackToCart = () => {
  router.push('/cart')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-4">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <NuxtLink to="/" class="text-gray-600 hover:text-main transition-colors">
            Inicio
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <NuxtLink to="/cart" class="text-gray-600 hover:text-main transition-colors">
            Carrito
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <span class="text-gray-900 font-medium">Checkout</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-6">
          Finalizar Compra
        </h1>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-4 md:gap-8">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors',
                step >= 1 ? 'bg-gradient text-white' : 'bg-gray-300 text-gray-600'
              ]"
            >
              1
            </div>
            <span :class="step >= 1 ? 'text-main font-medium' : 'text-gray-500'">
              Envío
            </span>
          </div>
          
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors',
                step >= 2 ? 'bg-gradient text-white' : 'bg-gray-300 text-gray-600'
              ]"
            >
              2
            </div>
            <span :class="step >= 2 ? 'text-main font-medium' : 'text-gray-500'">
              Pago
            </span>
          </div>
          
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors',
                step >= 3 ? 'bg-gradient text-white' : 'bg-gray-300 text-gray-600'
              ]"
            >
              3
            </div>
            <span :class="step >= 3 ? 'text-main font-medium' : 'text-gray-500'" class="hidden sm:inline">
              Confirmación
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2">
          <!-- Step 1: Shipping Information -->
          <div v-if="step === 1" class="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 class="text-2xl font-bold mb-6">Datos de Envío</h2>

            <form @submit.prevent="goToStep(2)" class="space-y-6">
              <!-- Name Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <BaseInput
                    v-model="formData.firstName"
                    placeholder="Tu nombre"
                    :error="errors.firstName"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <BaseInput
                    v-model="formData.lastName"
                    placeholder="Tus apellidos"
                    :error="errors.lastName"
                  />
                </div>
              </div>

              <!-- Contact Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <BaseInput
                    v-model="formData.email"
                    type="email"
                    placeholder="tu@email.com"
                    :error="errors.email"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <BaseInput
                    v-model="formData.phone"
                    type="tel"
                    placeholder="600 123 456"
                    :error="errors.phone"
                  />
                </div>
              </div>

              <!-- Address Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <BaseInput
                  v-model="formData.address"
                  placeholder="Calle, número, piso, puerta..."
                  :error="errors.address"
                />
              </div>

              <!-- City, Postal Code, Country -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <BaseInput
                    v-model="formData.city"
                    placeholder="Ciudad"
                    :error="errors.city"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    C.P. *
                  </label>
                  <BaseInput
                    v-model="formData.postalCode"
                    placeholder="28001"
                    :error="errors.postalCode"
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

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Notas del pedido (opcional)
                </label>
                <textarea
                  v-model="formData.notes"
                  rows="4"
                  placeholder="Instrucciones especiales para la entrega..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all resize-none"
                />
              </div>

              <!-- Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <BaseButton
                  variant="outline"
                  icon="mdi:arrow-left"
                  @click="goBackToCart"
                >
                  Volver al Carrito
                </BaseButton>
                <BaseButton
                  variant="gradient"
                  icon="mdi:arrow-right"
                  icon-position="right"
                  type="submit"
                  class="flex-1"
                >
                  Continuar al Pago
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Method -->
          <div v-if="step === 2" class="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 class="text-2xl font-bold mb-6">Método de Pago</h2>

            <form @submit.prevent="processOrder" class="space-y-6">
              <!-- Payment Methods -->
              <div class="space-y-3">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                  :class="formData.paymentMethod === method.id ? 'border-main bg-main/5' : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    :value="method.id"
                    v-model="formData.paymentMethod"
                    class="mt-1"
                  >
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <Icon :icon="method.icon" class="text-2xl text-main" />
                      <span class="font-semibold">{{ method.name }}</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ method.description }}</p>
                  </div>
                </label>
              </div>

              <div v-if="errors.paymentMethod" class="text-red-500 text-sm">
                {{ errors.paymentMethod }}
              </div>

              <div class="divider" />

              <!-- Terms and Conditions -->
              <div class="space-y-4">
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

              <div v-if="errors.acceptTerms" class="text-red-500 text-sm">
                {{ errors.acceptTerms }}
              </div>

              <!-- Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <BaseButton
                  variant="outline"
                  icon="mdi:arrow-left"
                  @click="goToStep(1)"
                >
                  Volver
                </BaseButton>
                <BaseButton
                  variant="gradient"
                  icon="mdi:lock"
                  type="submit"
                  :disabled="isProcessing"
                  class="flex-1"
                >
                  {{ isProcessing ? 'Procesando...' : 'Confirmar Pedido' }}
                </BaseButton>
              </div>
            </form>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="step === 3" class="bg-white rounded-xl shadow-md p-6 md:p-8 text-center">
            <div class="max-w-md mx-auto">
              <div class="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:check-circle" class="text-5xl text-secondary" />
              </div>
              
              <h2 class="text-3xl font-bold text-gradient mb-4">
                ¡Pedido Confirmado!
              </h2>
              
              <p class="text-gray-600 mb-2">
                Gracias por tu compra. Hemos enviado un email de confirmación a
              </p>
              <p class="text-main font-medium mb-8">
                {{ formData.email }}
              </p>

              <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 class="font-bold mb-3">Número de Pedido</h3>
                <p class="text-2xl font-bold text-gradient">
                  #{{ Date.now().toString().slice(-8) }}
                </p>
              </div>

              <div class="space-y-3">
                <BaseButton
                  variant="gradient"
                  icon="mdi:home"
                  full-width
                  @click="$router.push('/')"
                >
                  Volver al Inicio
                </BaseButton>
                <BaseButton
                  variant="outline"
                  icon="mdi:shopping"
                  full-width
                  @click="$router.push('/categories/semillas')"
                >
                  Seguir Comprando
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 class="text-xl font-bold mb-4">Resumen del Pedido</h3>

            <!-- Products List -->
            <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-3"
              >
                <img
                  :src="item.product.images[0]?.url"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium line-clamp-2">{{ item.product.name }}</p>
                  <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-bold whitespace-nowrap">
                  {{ (item.product.price.amount * item.quantity).toFixed(2) }}€
                </p>
              </div>
            </div>

            <div class="divider" />

            <!-- Summary -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{ cartSummary.subtotal.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">IVA (21%)</span>
                <span class="font-medium">{{ cartSummary.tax.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span
                  :class="cartSummary.shipping === 0 ? 'text-secondary font-medium' : 'font-medium'"
                >
                  {{ cartSummary.shipping === 0 ? 'GRATIS' : `${cartSummary.shipping.toFixed(2)}€` }}
                </span>
              </div>
            </div>

            <div class="divider" />

            <div class="flex justify-between items-center">
              <span class="text-lg font-bold">Total</span>
              <span class="text-2xl font-bold text-gray-900">
                {{ cartSummary.total.toFixed(2) }}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
