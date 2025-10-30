<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getProductBySlug, mockAllProducts } from '../../data/mock-products'
import { useCartStore } from '../../stores/cart'
import type { SeedProduct } from '../../../types'

const route = useRoute()
const cartStore = useCartStore()

const productSlug = computed(() => route.params.slug as string)
const product = computed(() => getProductBySlug(productSlug.value))

// Estado
const selectedImage = ref(0)
const quantity = ref(1)
const addedToCart = ref(false)

// Productos relacionados
const relatedProducts = computed(() => {
  if (!product.value) return []
  return mockAllProducts
    .filter(p => 
      p.id !== product.value!.id && 
      p.category.slug === product.value!.category.slug
    )
    .slice(0, 4)
})

// Check if it's a seed product for type-specific info
const isSeedProduct = computed(() => product.value?.type === 'seed')
const seedProduct = computed(() => isSeedProduct.value ? product.value as SeedProduct : null)

// Añadir al carrito
const addToCart = () => {
  if (product.value) {
    cartStore.addProductToCart(product.value, quantity.value)
    addedToCart.value = true
    setTimeout(() => {
      addedToCart.value = false
    }, 2000)
  }
}

// Incrementar/decrementar cantidad
const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div v-if="product" class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-4">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <NuxtLink to="/" class="text-gray-600 hover:text-main transition-colors">
            Inicio
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <NuxtLink 
            :to="`/categories/${product.category.slug}`"
            class="text-gray-600 hover:text-main transition-colors"
          >
            {{ product.category.name }}
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <span class="text-gray-900 font-medium">{{ product.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Product Details -->
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Images -->
        <div>
          <!-- Main Image -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <img
              :src="product.images[selectedImage]?.url"
              :alt="product.images[selectedImage]?.alt || product.name"
              class="w-full aspect-square object-cover"
            >
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-4">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = index"
              :class="[
                'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                selectedImage === index 
                  ? 'border-main shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img
                :src="image.url"
                :alt="image.alt"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <!-- Brand -->
          <p v-if="product.brand" class="text-sm text-gray-500 mb-2">
            {{ product.brand.name }}
          </p>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <div v-if="product.rating" class="flex items-center gap-2 mb-6">
            <div class="flex items-center gap-1">
              <Icon icon="mdi:star" class="text-yellow-400 text-xl" />
              <span class="text-lg font-semibold">{{ product.rating }}</span>
            </div>
            <span class="text-gray-500">({{ product.reviewsCount }} valoraciones)</span>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-6">
            <BaseBadge v-if="product.new" variant="gradient">
              Nuevo
            </BaseBadge>
            <BaseBadge v-if="product.onSale && product.price.discount" variant="danger">
              -{{ product.price.discount }}% OFF
            </BaseBadge>
            <BaseBadge v-if="product.featured" variant="primary">
              Destacado
            </BaseBadge>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-main">
                {{ product.price.amount.toFixed(2) }}€
              </span>
              <span v-if="product.price.oldPrice" class="text-2xl text-gray-400 line-through">
                {{ product.price.oldPrice.toFixed(2) }}€
              </span>
            </div>
            <p v-if="product.type === 'seed' && product.packSize" class="text-sm text-gray-600 mt-1">
              Pack de {{ product.packSize }} {{ product.packSize === 1 ? 'semilla' : 'semillas' }}
            </p>
          </div>

          <!-- Short Description -->
          <p class="text-gray-700 mb-6 leading-relaxed">
            {{ product.shortDescription }}
          </p>

          <div class="divider" />

          <!-- Quantity & Add to Cart -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  @click="decrementQuantity"
                  class="px-4 py-3 hover:bg-gray-100 transition-colors"
                  :disabled="quantity <= 1"
                >
                  <Icon icon="mdi:minus" class="text-xl" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="w-16 text-center border-x border-gray-300 py-3 outline-none"
                >
                <button
                  @click="incrementQuantity"
                  class="px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="mdi:plus" class="text-xl" />
                </button>
              </div>

              <BaseButton
                variant="gradient"
                size="lg"
                icon="mdi:cart-plus"
                full-width
                :disabled="!product.inStock"
                @click="addToCart"
              >
                {{ product.inStock ? 'Añadir al Carrito' : 'Agotado' }}
              </BaseButton>
            </div>

            <!-- Success message -->
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="addedToCart" class="mt-4 p-4 bg-secondary/10 border border-secondary rounded-lg flex items-center gap-2">
                <Icon icon="mdi:check-circle" class="text-secondary text-xl" />
                <span class="text-secondary font-medium">¡Producto añadido al carrito!</span>
              </div>
            </Transition>
          </div>

          <div class="divider" />

          <!-- Stock Status -->
          <div class="flex items-center gap-2 mb-4">
            <Icon 
              :icon="product.inStock ? 'mdi:check-circle' : 'mdi:alert-circle'" 
              :class="product.inStock ? 'text-secondary' : 'text-red-500'"
              class="text-xl"
            />
            <span :class="product.inStock ? 'text-secondary' : 'text-red-500'" class="font-medium">
              {{ product.inStock ? 'En Stock' : 'Agotado' }}
            </span>
            <span v-if="product.inStock" class="text-gray-500 text-sm">
              ({{ product.stock }} disponibles)
            </span>
          </div>

          <!-- SKU -->
          <p class="text-sm text-gray-500">
            SKU: {{ product.sku }}
          </p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
        <div class="space-y-8">
          <!-- Description -->
          <div>
            <h2 class="text-2xl font-bold mb-4">Descripción</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Seed-specific info -->
          <div v-if="isSeedProduct && seedProduct">
            <div class="divider" />

            <!-- Genetics -->
            <div v-if="seedProduct.genetics" class="mb-8">
              <h3 class="text-xl font-bold mb-4">Genética</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">THC</p>
                  <p class="text-lg font-bold text-main">{{ seedProduct.genetics.thc }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">CBD</p>
                  <p class="text-lg font-bold text-secondary">{{ seedProduct.genetics.cbd }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Dominancia</p>
                  <p class="text-lg font-bold capitalize">{{ seedProduct.genetics.dominance }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Linaje</p>
                  <p class="text-sm font-medium">{{ seedProduct.genetics.lineage }}</p>
                </div>
              </div>
            </div>

            <!-- Growing Info -->
            <div v-if="seedProduct.growing">
              <h3 class="text-xl font-bold mb-4">Información de Cultivo</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:clock-outline" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Floración</p>
                    <p class="text-gray-600">{{ seedProduct.growing.floweringTime }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:chart-line" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Producción</p>
                    <p class="text-gray-600">{{ seedProduct.growing.yield }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:arrow-expand-vertical" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Altura</p>
                    <p class="text-gray-600">{{ seedProduct.growing.height }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:school-outline" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Dificultad</p>
                    <p class="text-gray-600 capitalize">{{ seedProduct.growing.difficulty }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider" />

            <!-- Effects, Flavors, Medical -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-if="seedProduct.effects">
                <h4 class="font-bold mb-3">Efectos</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="effect in seedProduct.effects" :key="effect" variant="primary">
                    {{ effect }}
                  </BaseBadge>
                </div>
              </div>
              <div v-if="seedProduct.flavors">
                <h4 class="font-bold mb-3">Sabores</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="flavor in seedProduct.flavors" :key="flavor" variant="secondary">
                    {{ flavor }}
                  </BaseBadge>
                </div>
              </div>
              <div v-if="seedProduct.medical">
                <h4 class="font-bold mb-3">Uso Medicinal</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="use in seedProduct.medical" :key="use" variant="gradient">
                    {{ use }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Paraphernalia-specific info -->
          <div v-if="product.type === 'product' && product.specifications">
            <div class="divider" />
            <h3 class="text-xl font-bold mb-4">Especificaciones</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(value, key) in product.specifications" :key="key" class="flex items-start gap-2">
                <Icon icon="mdi:check-circle" class="text-main mt-1" />
                <div>
                  <p class="font-semibold capitalize">{{ key }}</p>
                  <p class="text-gray-600">{{ value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-if="product.type === 'product' && product.features">
            <div class="divider" />
            <h3 class="text-xl font-bold mb-4">Características</h3>
            <ul class="space-y-2">
              <li v-for="feature in product.features" :key="feature" class="flex items-start gap-2">
                <Icon icon="mdi:check-circle" class="text-secondary mt-1 flex-shrink-0" />
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0">
        <h2 class="text-2xl md:text-3xl font-bold text-gradient mb-6">
          Productos Relacionados
        </h2>
        <div class="grid-products">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <Icon icon="mdi:alert-circle" class="text-6xl text-gray-300 mb-4 mx-auto" />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Producto no encontrado
      </h1>
      <p class="text-gray-600 mb-6">
        El producto que buscas no existe o ha sido eliminado
      </p>
      <BaseButton variant="outline" @click="$router.push('/')">
        Volver al Inicio
      </BaseButton>
    </div>
  </div>
</template>
