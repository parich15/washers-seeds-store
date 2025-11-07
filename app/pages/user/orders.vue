<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { getOrdersByUserId, getOrderStatusLabel, getOrderStatusColor } from '../../data/mock-orders'
import type { OrderStatus } from '../../types/common'

// Aplicar middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

// Obtener pedidos del usuario
const orders = computed(() => {
  if (!user.value?.id) return []
  return getOrdersByUserId(user.value.id)
})

const getStatusBadgeColor = (status: OrderStatus) => {
  const color = getOrderStatusColor(status)
  const colorMap = {
    'primary': 'bg-main/10 text-main',
    'secondary': 'bg-secondary/10 text-secondary',
    'success': 'bg-green-100 text-green-700',
    'warning': 'bg-yellow-100 text-yellow-700',
    'danger': 'bg-red-100 text-red-700'
  }
  return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-700'
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'delivered':
      return 'mdi:check-circle'
    case 'shipped':
      return 'mdi:truck-delivery'
    case 'processing':
      return 'mdi:clock-outline'
    case 'cancelled':
      return 'mdi:close-circle'
    default:
      return 'mdi:help-circle'
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
          <span class="text-gray-900 font-medium">Mis Pedidos</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Mis Pedidos
        </h1>
        <p class="text-gray-600">
          Historial y estado de tus compras
        </p>
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
                class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon icon="mdi:account" class="text-xl" />
                <span>Mi Perfil</span>
              </NuxtLink>
              <NuxtLink
                to="/user/orders"
                class="flex items-center gap-3 px-4 py-3 rounded-lg bg-main/10 text-main font-medium"
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

        <!-- Orders List -->
        <div class="lg:col-span-3">
          <!-- Empty State -->
          <div v-if="orders.length === 0" class="text-center py-16">
            <div class="bg-white rounded-xl shadow-md p-12">
              <Icon icon="mdi:package-variant-closed" class="text-6xl text-gray-300 mb-4 mx-auto" />
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                No tienes pedidos aún
              </h2>
              <p class="text-gray-600 mb-8">
                ¡Empieza a comprar y encuentra tus productos favoritos!
              </p>
              <BaseButton
                variant="gradient"
                size="lg"
                icon="mdi:shopping"
                @click="$router.push('/categories/semillas')"
              >
                Ir a la Tienda
              </BaseButton>
            </div>
          </div>

          <!-- Orders List -->
          <div v-else class="space-y-6">
            <div
              v-for="order in orders"
              :key="order.id"
              class="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <!-- Order Header -->
              <div class="p-6 border-b border-gray-200">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-bold">{{ order.orderNumber }}</h3>
                      <span
                        :class="['px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1', getStatusBadgeColor(order.status)]"
                      >
                        <Icon :icon="getStatusIcon(order.status)" />
                        {{ getOrderStatusLabel(order.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      <Icon icon="mdi:calendar" class="inline" />
                      {{ new Date(order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600 mb-1">Total</p>
                    <p class="text-2xl font-bold text-gradient">
                      {{ order.total.toFixed(2) }}€
                    </p>
                  </div>
                </div>
              </div>

              <!-- Order Products -->
              <div class="p-6">
                <div class="space-y-4">
                  <div
                    v-for="(item, index) in order.items"
                    :key="index"
                    class="flex items-center gap-4"
                  >
                    <img
                      :src="item.image"
                      :alt="item.productName"
                      class="w-16 h-16 object-cover rounded-lg"
                    >
                    <div class="flex-1">
                      <h4 class="font-semibold" style="font-family: var(--font-text)">{{ item.productName }}</h4>
                      <p class="text-sm text-gray-600">
                        Cantidad: {{ item.quantity }}
                      </p>
                    </div>
                    <p class="font-bold text-gray-900">
                      {{ (item.price * item.quantity).toFixed(2) }}€
                    </p>
                  </div>
                </div>

                <!-- Order Summary -->
                <div class="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{{ order.subtotal.toFixed(2) }}€</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>IVA (21%)</span>
                    <span>{{ order.tax.toFixed(2) }}€</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Envío</span>
                    <span :class="order.shipping === 0 ? 'text-secondary font-semibold' : ''">
                      {{ order.shipping === 0 ? '¡GRATIS!' : `${order.shipping.toFixed(2) }€` }}
                    </span>
                  </div>
                  <div class="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span class="text-gray-900">{{ order.total.toFixed(2) }}€</span>
                  </div>
                </div>

                <!-- Shipping Address & Payment -->
                <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-semibold mb-2 flex items-center gap-2">
                      <Icon icon="mdi:map-marker" class="text-main" />
                      Dirección de Envío
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ order.shippingAddress.street }}<br>
                      {{ order.shippingAddress.postalCode }}, {{ order.shippingAddress.city }}<br>
                      {{ order.shippingAddress.province }}, {{ order.shippingAddress.country }}
                    </p>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2 flex items-center gap-2">
                      <Icon icon="mdi:credit-card" class="text-main" />
                      Método de Pago
                    </h4>
                    <p class="text-sm text-gray-600">{{ order.paymentMethod }}</p>
                    <p class="text-sm" :class="order.paymentStatus === 'completed' ? 'text-secondary' : 'text-yellow-600'">
                      {{ order.paymentStatus === 'completed' ? 'Pagado' : 'Pendiente de pago' }}
                    </p>
                  </div>
                </div>

                <!-- Tracking Number -->
                <div v-if="order.trackingNumber" class="mt-6 p-4 bg-main/5 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-700 mb-1">Número de Seguimiento</p>
                      <p class="font-mono font-bold text-main">{{ order.trackingNumber }}</p>
                    </div>
                    <Icon icon="mdi:truck-delivery" class="text-3xl text-main" />
                  </div>
                </div>

                <!-- Order Actions -->
                <div class="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    icon="mdi:eye"
                    class="flex-1"
                  >
                    Ver Detalles
                  </BaseButton>
                  <BaseButton
                    v-if="order.status === 'delivered'"
                    variant="outline"
                    size="sm"
                    icon="mdi:refresh"
                    class="flex-1"
                  >
                    Repetir Pedido
                  </BaseButton>
                  <BaseButton
                    v-if="order.status === 'delivered'"
                    variant="primary"
                    size="sm"
                    icon="mdi:download"
                    class="flex-1"
                  >
                    Factura
                  </BaseButton>
                  <BaseButton
                    v-if="order.status === 'shipped' || order.status === 'processing'"
                    variant="primary"
                    size="sm"
                    icon="mdi:truck-delivery"
                    class="flex-1"
                    :disabled="!order.trackingNumber"
                  >
                    {{ order.trackingNumber ? 'Rastrear Envío' : 'Sin Tracking' }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
