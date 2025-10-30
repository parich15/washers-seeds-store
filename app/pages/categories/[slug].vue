<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { mockAllProducts, mockCategories } from '../../data/mock-products'
import type { Product } from '../../../types'

const route = useRoute()
const categorySlug = computed(() => route.params.slug as string)

// Encontrar categoría actual
const currentCategory = computed(() => {
  return mockCategories.find(cat => cat.slug === categorySlug.value)
})

// Estado de filtros
const sortBy = ref('relevance')
const priceRange = ref([0, 100])
const selectedBrands = ref<string[]>([])
const showFilters = ref(false)

// Opciones de ordenación
const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'newest', label: 'Más Nuevos' },
]

// Obtener productos de la categoría
const categoryProducts = computed(() => {
  let products = mockAllProducts.filter(p => {
    // Filtrar por categoría
    if (p.category.slug !== categorySlug.value && p.category.parent !== categorySlug.value) {
      return false
    }
    
    // Filtrar por precio
    if (p.price.amount < priceRange.value[0] || p.price.amount > priceRange.value[1]) {
      return false
    }
    
    // Filtrar por marcas
    if (selectedBrands.value.length > 0 && p.brand && !selectedBrands.value.includes(p.brand.slug)) {
      return false
    }
    
    return true
  })
  
  // Ordenar productos
  switch (sortBy.value) {
    case 'price-asc':
      products.sort((a, b) => a.price.amount - b.price.amount)
      break
    case 'price-desc':
      products.sort((a, b) => b.price.amount - a.price.amount)
      break
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      products.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'newest':
      products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
      break
  }
  
  return products
})

// Obtener marcas disponibles
const availableBrands = computed(() => {
  const brands = new Set<string>()
  mockAllProducts.forEach(p => {
    if ((p.category.slug === categorySlug.value || p.category.parent === categorySlug.value) && p.brand) {
      brands.add(p.brand.slug)
    }
  })
  return Array.from(brands).map(slug => {
    const product = mockAllProducts.find(p => p.brand?.slug === slug)
    return product?.brand
  }).filter((brand): brand is NonNullable<typeof brand> => brand !== undefined)
})

// Toggle marca seleccionada
const toggleBrand = (brandSlug: string) => {
  const index = selectedBrands.value.indexOf(brandSlug)
  if (index > -1) {
    selectedBrands.value.splice(index, 1)
  } else {
    selectedBrands.value.push(brandSlug)
  }
}

// Limpiar filtros
const clearFilters = () => {
  priceRange.value = [0, 100]
  selectedBrands.value = []
  sortBy.value = 'relevance'
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
          <span class="text-gray-900 font-medium">
            {{ currentCategory?.name || 'Categoría' }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Category Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
              {{ currentCategory?.name || 'Categoría' }}
            </h1>
            <p v-if="currentCategory?.description" class="text-gray-600">
              {{ currentCategory.description }}
            </p>
          </div>
          <div class="text-sm text-gray-600">
            {{ categoryProducts.length }} producto{{ categoryProducts.length !== 1 ? 's' : '' }} encontrado{{ categoryProducts.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar (Desktop) -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-lg">Filtros</h3>
              <button
                v-if="selectedBrands.length > 0 || sortBy !== 'relevance'"
                @click="clearFilters"
                class="text-sm text-main hover:underline"
              >
                Limpiar
              </button>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-section">
              <h4 class="filter-title">Precio</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span>{{ priceRange[0] }}€</span>
                  <span>{{ priceRange[1] }}€</span>
                </div>
                <input
                  v-model.number="priceRange[0]"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
                <input
                  v-model.number="priceRange[1]"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
              </div>
            </div>

            <!-- Brands Filter -->
            <div v-if="availableBrands.length > 0" class="filter-section">
              <h4 class="filter-title">Marcas</h4>
              <div class="space-y-2">
                <label
                  v-for="brand in availableBrands"
                  :key="brand?.slug"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    v-if="brand"
                    type="checkbox"
                    :value="brand.slug"
                    :checked="selectedBrands.includes(brand.slug)"
                    @change="toggleBrand(brand.slug)"
                    class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
                  >
                  <span v-if="brand" class="text-sm">{{ brand.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1">
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <!-- Mobile Filters Toggle -->
            <button
              class="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              @click="showFilters = !showFilters"
            >
              <Icon icon="mdi:filter-variant" class="text-xl" />
              <span>Filtros</span>
              <BaseBadge v-if="selectedBrands.length > 0" variant="primary" size="sm">
                {{ selectedBrands.length }}
              </BaseBadge>
            </button>

            <!-- Sort Dropdown -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <span class="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
              <select
                v-model="sortBy"
                class="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Mobile Filters -->
          <div
            v-if="showFilters"
            class="lg:hidden bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-lg">Filtros</h3>
              <button @click="showFilters = false">
                <Icon icon="mdi:close" class="text-2xl" />
              </button>
            </div>

            <!-- Price Range (Mobile) -->
            <div class="filter-section">
              <h4 class="filter-title">Precio</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span>{{ priceRange[0] }}€</span>
                  <span>{{ priceRange[1] }}€</span>
                </div>
                <input
                  v-model.number="priceRange[0]"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
                <input
                  v-model.number="priceRange[1]"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                >
              </div>
            </div>

            <!-- Brands (Mobile) -->
            <div v-if="availableBrands.length > 0" class="filter-section">
              <h4 class="filter-title">Marcas</h4>
              <div class="space-y-2">
                <label
                  v-for="brand in availableBrands"
                  :key="brand?.slug"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    v-if="brand"
                    type="checkbox"
                    :value="brand.slug"
                    :checked="selectedBrands.includes(brand.slug)"
                    @change="toggleBrand(brand.slug)"
                    class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
                  >
                  <span v-if="brand" class="text-sm">{{ brand.name }}</span>
                </label>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <BaseButton
                variant="outline"
                size="sm"
                full-width
                @click="clearFilters"
              >
                Limpiar Filtros
              </BaseButton>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="categoryProducts.length > 0" class="grid-products">
            <ProductCard
              v-for="product in categoryProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-16">
            <Icon icon="mdi:package-variant-closed" class="text-6xl text-gray-300 mb-4 mx-auto" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p class="text-gray-600 mb-6">
              Intenta ajustar los filtros para ver más resultados
            </p>
            <BaseButton variant="outline" @click="clearFilters">
              Limpiar Filtros
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
