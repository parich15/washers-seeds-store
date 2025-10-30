<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Verificar autenticación
if (!authStore.isAuthenticated) {
  router.push('/auth/login')
}

// Mock orders data
const orders = ref([
  {
    id: '#12345678',
    date: '2025-01-15',
    status: 'delivered',
    statusText: 'Entregado',
    total: 89.90,
    items: 3,
    products: [
      {
        name: 'Northern Lights',
        quantity: 1,
        price: 29.90,
        image: 'https://placehold.co/100x100/36A9E1/FFF?text=Northern+Lights'
      },
      {
        name: 'Grinder Aluminio',
        quantity: 2,
        price: 24.90,
        image: 'https://placehold.co/100x100/3AAA35/FFF?text=Grinder'
      }
    ]
  },
  {
    id: '#12345679',
    date: '2025-01-20',
    status: 'shipped',
    statusText: 'Enviado',
    total: 65.00,
    items: 2,
    products: [
      {
        name: 'Gorilla Glue Auto',
        quantity: 1,
        price: 35.00,
        image: 'https://placehold.co/100x100/936037/FFF?text=Gorilla+Glue'
      },
      {
        name: 'Papel RAW',
        quantity: 1,
        price: 2.50,
        image: 'https://placehold.co/100x100/36A9E1/FFF?text=Papel+RAW'
      }
    ]
  },
  {
    id: '#12345680',
    date: '2025-01-28',
    status: 'processing',
    statusText: 'Procesando',
    total: 42.00,
    items: 1,
    products: [
      {
        name: 'CBD Charlotte\'s Angel',
        quantity: 1,
        price: 42.00,
        image: 'https://placehold.co/100x100/3AAA35/FFF?text=CBD+Charlotte'
      }
    ]
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-secondary/10 text-secondary'
    case 'shipped':
      return 'bg-main/10 text-main'
    case 'processing':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status: string) => {
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
              <NuxtLink
                to="/user/addresses"
                class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon icon="mdi:map-marker" class="text-xl" />
                <span>Direcciones</span>
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
                      <h3 class="text-lg font-bold">Pedido {{ order.id }}</h3>
                      <span
                        :class="['px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1', getStatusColor(order.status)]"
                      >
                        <Icon :icon="getStatusIcon(order.status)" />
                        {{ order.statusText }}
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
                    v-for="(product, index) in order.products"
                    :key="index"
                    class="flex items-center gap-4"
                  >
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-16 h-16 object-cover rounded-lg"
                    >
                    <div class="flex-1">
                      <h4 class="font-medium">{{ product.name }}</h4>
                      <p class="text-sm text-gray-600">
                        Cantidad: {{ product.quantity }}
                      </p>
                    </div>
                    <p class="font-bold">
                      {{ (product.price * product.quantity).toFixed(2) }}€
                    </p>
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
                    v-if="order.status === 'shipped'"
                    variant="primary"
                    size="sm"
                    icon="mdi:map-marker"
                    class="flex-1"
                  >
                    Rastrear
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
