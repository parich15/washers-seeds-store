<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Product } from '../../../types'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const priceDisplay = computed(() => {
  if (props.product.price.oldPrice) {
    return {
      current: props.product.price.amount.toFixed(2),
      old: props.product.price.oldPrice.toFixed(2),
      discount: props.product.price.discount
    }
  }
  return {
    current: props.product.price.amount.toFixed(2)
  }
})

const handleAddToCart = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  // TODO: Implementar lógica de añadir al carrito con Pinia
  console.log('Añadir al carrito:', props.product.id)
}
</script>

<template>
  <NuxtLink :to="`/products/${product.slug}`" class="product-card group">
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="product.images[0]?.url"
        :alt="product.images[0]?.alt || product.name"
        class="product-card-image"
      >
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-2 z-10">
        <BaseBadge v-if="product.new" variant="gradient" size="sm">
          Nuevo
        </BaseBadge>
        <BaseBadge v-if="product.onSale && product.price.discount" variant="danger" size="sm">
          -{{ product.price.discount }}%
        </BaseBadge>
        <BaseBadge v-if="!product.inStock" variant="secondary" size="sm">
          Agotado
        </BaseBadge>
      </div>

      <!-- Quick Add Button -->
      <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <BaseButton
          variant="gradient"
          size="sm"
          icon="mdi:cart-plus"
          full-width
          :disabled="!product.inStock"
          @click="handleAddToCart"
        >
          Añadir al carrito
        </BaseButton>
      </div>
    </div>

    <!-- Product Info -->
    <div class="card-body">
      <!-- Brand -->
      <p v-if="product.brand" class="text-xs text-gray-500 mb-1">
        {{ product.brand.name }}
      </p>

      <!-- Name -->
      <h3 class="font-bold text-base mb-2 line-clamp-2 group-hover:text-main transition-colors">
        {{ product.name }}
      </h3>

      <!-- Short Description -->
      <p v-if="product.shortDescription" class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ product.shortDescription }}
      </p>

      <!-- Rating -->
      <div v-if="product.rating" class="flex items-center gap-1 mb-3">
        <Icon icon="mdi:star" class="text-yellow-400" />
        <span class="text-sm font-semibold">{{ product.rating }}</span>
        <span class="text-xs text-gray-500">({{ product.reviewsCount }})</span>
      </div>

      <!-- Tags (for seeds) -->
      <div v-if="product.type === 'seed' && product.tags" class="flex flex-wrap gap-1 mb-3">
        <BaseBadge
          v-for="tag in product.tags.slice(0, 3)"
          :key="tag"
          variant="primary"
          size="sm"
        >
          {{ tag }}
        </BaseBadge>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="price text-main">
            {{ priceDisplay.current }}
            <span class="price-currency">€</span>
          </span>
          <span v-if="priceDisplay.old" class="price-old">
            {{ priceDisplay.old }}€
          </span>
        </div>
        
        <div v-if="product.type === 'seed' && product.packSize" class="text-xs text-gray-500">
          {{ product.packSize }} {{ product.packSize === 1 ? 'ud' : 'uds' }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
