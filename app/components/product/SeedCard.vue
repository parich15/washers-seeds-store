<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCartStore } from '../../stores/cart'
import { getSemillaPrecio } from '../../../types/product'
import type { Semilla } from '../../../types'

interface Props {
  semilla: Semilla
}

const props = defineProps<Props>()
const cartStore = useCartStore()
const { getImageUrl } = useSemillas()

const addedToCart = ref(false)
const imageError = ref(false)

// Obtener precio desde cantidades
const precioInfo = computed(() => getSemillaPrecio(props.semilla))

// URL de imagen con fallback
const imageUrl = computed(() => {
  return getImageUrl(props.semilla.producto.imagen_principal)
})

// Manejar error de carga de imagen
const handleImageError = () => {
  console.error('Error loading image for:', props.semilla.producto.nombre, 'UUID:', props.semilla.producto.imagen_principal)
  imageError.value = true
}

const priceDisplay = computed(() => {
  const info = precioInfo.value
  
  if (info.tieneDescuento && info.precioDescuento) {
    const descuentoPorcentaje = Math.round(
      ((info.precio - info.precioDescuento) / info.precio) * 100
    )
    
    return {
      current: info.precioDescuento.toFixed(2),
      old: info.precio.toFixed(2),
      discount: descuentoPorcentaje
    }
  }
  
  return {
    current: info.precio.toFixed(2)
  }
})

const handleAddToCart = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  // TODO: Adaptar addProductToCart para trabajar con Semillas
  // cartStore.addProductToCart(props.semilla, 1)
  
  // Mostrar feedback visual
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}
</script>

<template>
  <NuxtLink :to="`/products/${semilla.producto.slug}`" class="product-card group">
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="imageUrl"
        :alt="semilla.producto.nombre"
        class="product-card-image"
        @error="handleImageError"
      >
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-2 z-10">
        <BaseBadge v-if="semilla.producto.nuevo" variant="gradient" size="sm">
          Nuevo
        </BaseBadge>
        <!-- Categoría de semilla -->
        <BaseBadge variant="primary" size="sm">
          {{ semilla.categoria }}
        </BaseBadge>
        <BaseBadge v-if="precioInfo.tieneDescuento && priceDisplay.discount" variant="danger" size="sm" class="w-fit">
          -{{ priceDisplay.discount }}%
        </BaseBadge>
        <BaseBadge v-if="!semilla.producto.disponible" variant="secondary" size="sm">
          Agotado
        </BaseBadge>
      </div>

      <!-- Quick Add Button -->
      <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <BaseButton
          v-if="!addedToCart"
          variant="gradient"
          size="sm"
          icon="mdi:cart-plus"
          full-width
          :disabled="!semilla.producto.disponible"
          @click="handleAddToCart"
        >
          Añadir al carrito
        </BaseButton>
        <div
          v-else
          class="bg-secondary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Icon icon="mdi:check-circle" class="text-lg" />
          ¡Añadido!
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="card-body">
      <!-- Dominancia -->
      <div class="flex items-center gap-2 mb-1">
        <Icon 
          :icon="semilla.dominancia === 'indica' ? 'mdi:leaf' : semilla.dominancia === 'sativa' ? 'mdi:flower' : 'mdi:leaf-maple'" 
          class="text-main text-sm"
        />
        <p class="text-xs text-gray-500 capitalize">
          {{ semilla.dominancia }}
        </p>
      </div>

      <!-- Name - altura fija para estandarizar -->
      <h3 class="font-semibold text-base mb-2 line-clamp-2 group-hover:text-main transition-colors h-12" style="font-family: var(--font-text)">
        {{ semilla.producto.nombre }}
      </h3>

      <!-- Short Description -->
      <p v-if="semilla.producto.descripcion_corta" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ semilla.producto.descripcion_corta }}
      </p>

      <!-- THC/CBD -->
      <div class="flex items-center gap-3 mb-3 text-xs">
        <div class="flex items-center gap-1">
          <span class="font-semibold text-gray-700">THC:</span>
          <span class="text-gray-600">{{ semilla.thc }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-semibold text-gray-700">CBD:</span>
          <span class="text-gray-600">{{ semilla.cbd }}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="price text-gray-900">
            {{ priceDisplay.current }}
            <span class="price-currency">€</span>
          </span>
          <span v-if="priceDisplay.old" class="price-old">
            {{ priceDisplay.old }}€
          </span>
        </div>
        
        <div class="text-xs text-gray-500">
          {{ precioInfo.cantidad }} {{ precioInfo.cantidad === 1 ? 'ud' : 'uds' }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
