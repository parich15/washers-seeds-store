<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCartStore } from '../../stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

// Cargar carrito al montar el componente
cartStore.loadCart()

// Computed properties
const cartItems = computed(() => cartStore.cartItems)
const cartSummary = computed(() => cartStore.cartSummary)
const isEmpty = computed(() => cartStore.isEmpty)

// Métodos
const updateQuantity = (itemId: string, quantity: number) => {
  cartStore.updateQuantity(itemId, quantity)
}

const removeItem = (itemId: string) => {
  cartStore.removeFromCart(itemId)
}

const goToCheckout = () => {
  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/categories/semillas')
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
          <span class="text-gray-900 font-medium">Carrito de Compras</span>
        </nav>
      </div>
    </div>

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient">
          Carrito de Compras
        </h1>
        <p v-if="!isEmpty" class="text-gray-600 mt-2">
          {{ cartStore.itemsCount }} {{ cartStore.itemsCount === 1 ? 'producto' : 'productos' }} en tu carrito
        </p>
      </div>
    </div>

    <!-- Cart Content -->
    <div class="container-custom py-8">
      <!-- Empty Cart -->
      <div v-if="isEmpty" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-md p-12 max-w-2xl mx-auto">
          <Icon icon="mdi:cart-off" class="text-6xl text-gray-300 mb-4 mx-auto" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p class="text-gray-600 mb-8">
            ¡Descubre nuestros productos y añade tus favoritos!
          </p>
          <BaseButton
            variant="gradient"
            size="lg"
            icon="mdi:shopping"
            @click="continueShopping"
          >
            Ir a la Tienda
          </BaseButton>
        </div>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="bg-white rounded-xl shadow-md p-4 md:p-6"
          >
            <div class="flex gap-4">
              <!-- Product Image -->
              <NuxtLink
                :to="`/products/${item.product.slug}`"
                class="flex-shrink-0"
              >
                <img
                  :src="item.product.images[0]?.url"
                  :alt="item.product.images[0]?.alt || item.product.name"
                  class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                >
              </NuxtLink>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <!-- Product Name & Brand -->
                <NuxtLink :to="`/products/${item.product.slug}`">
                  <p v-if="item.product.brand" class="text-sm text-gray-500 mb-1">
                    {{ item.product.brand.name }}
                  </p>
                  <h3 class="font-semibold text-lg mb-2 hover:text-main transition-colors line-clamp-2" style="font-family: var(--font-text)">
                    {{ item.product.name }}
                  </h3>
                </NuxtLink>

                <!-- Badges -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <BaseBadge
                    v-if="item.product.type === 'seed' && item.product.packSize"
                    variant="primary"
                    size="sm"
                  >
                    Pack {{ item.product.packSize }} uds
                  </BaseBadge>
                  <BaseBadge v-if="item.product.onSale" variant="danger" size="sm">
                    -{{ item.product.price.discount }}%
                  </BaseBadge>
                </div>

                <!-- Price & Quantity Controls -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600">Cantidad:</span>
                    <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon icon="mdi:minus" />
                      </button>
                      <span class="px-4 py-2 min-w-[3rem] text-center font-medium">
                        {{ item.quantity }}
                      </span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <Icon icon="mdi:plus" />
                      </button>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="flex items-center justify-between sm:justify-end gap-4">
                    <div class="text-right">
                      <p class="text-2xl font-bold text-gray-900">
                        {{ (item.product.price.amount * item.quantity).toFixed(2) }}€
                      </p>
                      <p v-if="item.quantity > 1" class="text-sm text-gray-500">
                        {{ item.product.price.amount.toFixed(2) }}€ / ud
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(item.id)"
                class="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar producto"
              >
                <Icon icon="mdi:delete" class="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold mb-6">Resumen del Pedido</h2>

            <!-- Summary Lines -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span class="font-medium">{{ cartSummary.subtotal.toFixed(2) }}€</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>IVA (21%)</span>
                <span class="font-medium">{{ cartSummary.tax.toFixed(2) }}€</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Envío</span>
                <span v-if="cartSummary.shipping === 0" class="text-secondary font-medium">
                  ¡GRATIS!
                </span>
                <span v-else class="font-medium text-gray-600">
                  {{ cartSummary.shipping.toFixed(2) }}€
                </span>
              </div>

              <div v-if="cartSummary.discount > 0" class="flex justify-between text-secondary">
                <span>Descuento</span>
                <span class="font-medium">-{{ cartSummary.discount.toFixed(2) }}€</span>
              </div>

              <!-- Free Shipping Progress -->
              <div v-if="cartSummary.shipping > 0 && cartSummary.subtotal < 30" class="pt-3 border-t border-gray-200">
                <p class="text-sm text-gray-600 mb-2">
                  Añade <span class="font-bold text-main">{{ (30 - cartSummary.subtotal).toFixed(2) }}€</span> más para envío gratis
                </p>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(cartSummary.subtotal / 30) * 100}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="divider" />

            <!-- Total -->
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-bold">Total</span>
              <span class="text-3xl font-bold text-gray-900">
                {{ cartSummary.total.toFixed(2) }}€
              </span>
            </div>

            <!-- Checkout Button -->
            <BaseButton
              variant="gradient"
              size="lg"
              icon="mdi:lock"
              full-width
              class="mb-4"
              @click="goToCheckout"
            >
              Proceder al Pago
            </BaseButton>

            <!-- Continue Shopping -->
            <BaseButton
              variant="outline"
              size="sm"
              icon="mdi:arrow-left"
              full-width
              @click="continueShopping"
            >
              Seguir Comprando
            </BaseButton>

            <!-- Security Info -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-start gap-3 text-sm text-gray-600">
                <Icon icon="mdi:shield-check" class="text-2xl text-secondary flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900 mb-1">Pago 100% Seguro</p>
                  <p>Tus datos están protegidos con encriptación SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Products Section (Optional) -->
    <div v-if="!isEmpty" class="container-custom py-16">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gradient mb-2">
          También Te Puede Interesar
        </h2>
        <p class="text-gray-600">
          Complementa tu compra con estos productos
        </p>
      </div>
      <!-- Aquí podrías agregar productos recomendados -->
    </div>
  </div>
</template>
