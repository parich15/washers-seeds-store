<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCartStore } from '../../stores/cart'
import { getPrecioItem } from '~~/types/product'
import type { Ropa } from '~~/types'

interface Props {
  ropa: Ropa
}

const props = defineProps<Props>()
const cartStore = useCartStore()
const { getImageUrl } = useProducts()

const addedToCart = ref(false)
const imageError = ref(false)

// Obtener precio desde producto
const precioInfo = computed(() => getPrecioItem(props.ropa))

// URL de imagen con fallback
const imageUrl = computed(() => {
  if (imageError.value) {
    return 'https://placehold.co/600x600/36A9E1/FFF?text=Sin+Imagen'
  }
  return getImageUrl(props.ropa.producto.imagen_principal)
})

// Manejar error de carga de imagen
const handleImageError = () => {
  console.error('Error loading image for:', props.ropa.producto.nombre, 'UUID:', props.ropa.producto.imagen_principal)
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
  
  cartStore.addCartLine({
    product: {
      id: String(props.ropa.id),
      collection: 'ropa',
      slug: props.ropa.producto.slug,
      name: props.ropa.producto.nombre,
      image: imageUrl.value,
      price: precioInfo.value.precioDescuento || precioInfo.value.precio,
      sku: props.ropa.producto.sku,
      category: props.ropa.categoria
    },
    quantity: 1,
    selectedOptions: {
      talla: props.ropa.tallas[0]?.talla || '',
      color: props.ropa.colores[0]?.color || ''
    }
  })
  
  // Mostrar feedback visual
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}
</script>

<template>
  <NuxtLink :to="`/products/ropa/${ropa.producto.slug}`" class="product-card group">
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="imageUrl"
        :alt="ropa.producto.nombre"
        class="product-card-image"
        @error="handleImageError"
      >
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-2 z-10">
        <BaseBadge v-if="ropa.producto.nuevo" variant="gradient" size="sm">
          Nuevo
        </BaseBadge>
        <BaseBadge v-if="precioInfo.tieneDescuento && priceDisplay.discount" variant="danger" size="sm">
          -{{ priceDisplay.discount }}%
        </BaseBadge>
        <BaseBadge v-if="!ropa.producto.disponible" variant="secondary" size="sm">
          Agotado
        </BaseBadge>
        <!-- Categoría de ropa -->
        <BaseBadge variant="primary" size="sm">
          {{ ropa.categoria }}
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
          :disabled="!ropa.producto.disponible"
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
      <!-- Tallas disponibles -->
      <div class="flex items-center gap-2 mb-1 flex-wrap">
        <Icon icon="mdi:hanger" class="text-main text-sm" />
        <div class="flex gap-1">
          <span 
            v-for="talla in ropa.tallas.slice(0, 4)" 
            :key="talla.talla"
            class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
          >
            {{ talla.talla }}
          </span>
          <span v-if="ropa.tallas.length > 4" class="text-xs text-gray-500">
            +{{ ropa.tallas.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Name - altura fija para estandarizar -->
      <h3 class="font-semibold text-base mb-2 line-clamp-2 group-hover:text-main transition-colors h-12" style="font-family: var(--font-text)">
        {{ ropa.producto.nombre }}
      </h3>

      <!-- Short Description -->
      <p v-if="ropa.producto.descripcion_corta" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ ropa.producto.descripcion_corta }}
      </p>

      <!-- Colores disponibles (si hay) -->
      <div v-if="ropa.colores && ropa.colores.length > 0" class="flex items-center gap-2 mb-3">
        <Icon icon="mdi:palette" class="text-sm text-gray-500" />
        <div class="flex gap-1">
          <span 
            v-for="color in ropa.colores.slice(0, 3)" 
            :key="color.color"
            class="text-xs text-gray-600"
          >
            {{ color.color }}
          </span>
          <span v-if="ropa.colores.length > 3" class="text-xs text-gray-500">
            +{{ ropa.colores.length - 3 }}
          </span>
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
        
        <div v-if="ropa.producto.stock > 0" class="text-xs text-gray-500">
          Stock: {{ ropa.producto.stock }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
