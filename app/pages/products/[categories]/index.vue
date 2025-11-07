<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getPrecioItem } from '~~/types/product'
import type {
  CollectionType,
  CollectionItem,
  Semilla,
  Ropa,
  SeedCategory,
  SeedDominance,
  SeedDifficulty,
  RopaCategory
} from '~~/types'

const route = useRoute()

// Detectar colección desde route params
const collection = computed(() => route.params.categories as CollectionType)

// Obtener items usando composable genérico
const { fetchCollection } = useProducts()
const { items, pending, error } = await fetchCollection(collection.value)

// Estado de filtros y ordenación
const sortBy = ref('relevance')
const showFilters = ref(false)

// ===== FILTROS PARA SEMILLAS =====
const seedFilters = ref({
  categorias: [] as SeedCategory[],
  dominancias: [] as SeedDominance[],
  dificultades: [] as SeedDifficulty[],
  diasFloracionMin: 0,
  diasFloracionMax: 100,
  precioMin: 0,
  precioMax: 500
})

// ===== FILTROS PARA ROPA =====
const ropaFilters = ref({
  categorias: [] as RopaCategory[],
  tallas: [] as string[],
  colores: [] as string[],
  precioMin: 0,
  precioMax: 100
})

// Opciones de ordenación
const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'newest', label: 'Más Nuevos' },
]

// Obtener valores únicos para filtros
const uniqueValues = computed(() => {
  if (!items.value) return null

  if (collection.value === 'semillas') {
    const semillas = items.value as Semilla[]
    return {
      type: 'semillas' as const,
      categorias: [...new Set(semillas.map(s => s.categoria))] as SeedCategory[],
      dominancias: [...new Set(semillas.map(s => s.dominancia))] as SeedDominance[],
      dificultades: [...new Set(semillas.map(s => s.dificultad))] as SeedDifficulty[]
    }
  } else {
    const ropas = items.value as Ropa[]
    const allTallas = ropas.flatMap(r => r.tallas.map(t => t.talla))
    const allColores = ropas.flatMap(r => r.colores.map(c => c.color))

    return {
      type: 'ropa' as const,
      categorias: [...new Set(ropas.map(r => r.categoria))] as RopaCategory[],
      tallas: [...new Set(allTallas)] as string[],
      colores: [...new Set(allColores)] as string[]
    }
  }
})

// Aplicar filtros según tipo de colección
const filteredItems = computed(() => {
  if (!items.value) return []

  let filtered = [...items.value]

  if (collection.value === 'semillas') {
    const semillas = filtered as Semilla[]
    const filters = seedFilters.value

    filtered = semillas.filter(s => {
      // Filtro de categoría
      if (filters.categorias.length > 0 && !filters.categorias.includes(s.categoria)) {
        return false
      }

      // Filtro de dominancia
      if (filters.dominancias.length > 0 && !filters.dominancias.includes(s.dominancia)) {
        return false
      }

      // Filtro de dificultad
      if (filters.dificultades.length > 0 && !filters.dificultades.includes(s.dificultad)) {
        return false
      }

      // Filtro de días de floración
      if (s.dias_floracion < filters.diasFloracionMin || s.dias_floracion > filters.diasFloracionMax) {
        return false
      }

      // Filtro de precio
      const precio = getPrecioItem(s)
      const precioFinal = precio.precioDescuento || precio.precio
      if (precioFinal < filters.precioMin || precioFinal > filters.precioMax) {
        return false
      }

      return true
    })
  } else if (collection.value === 'ropa') {
    const ropas = filtered as Ropa[]
    const filters = ropaFilters.value

    filtered = ropas.filter(r => {
      // Filtro de categoría
      if (filters.categorias.length > 0 && !filters.categorias.includes(r.categoria)) {
        return false
      }

      // Filtro de tallas
      if (filters.tallas.length > 0) {
        const tieneTalla = r.tallas.some(t => filters.tallas.includes(t.talla))
        if (!tieneTalla) return false
      }

      // Filtro de colores
      if (filters.colores.length > 0) {
        const tieneColor = r.colores.some(c => filters.colores.includes(c.color))
        if (!tieneColor) return false
      }

      // Filtro de precio
      const precio = getPrecioItem(r)
      const precioFinal = precio.precioDescuento || precio.precio
      if (precioFinal < filters.precioMin || precioFinal > filters.precioMax) {
        return false
      }

      return true
    })
  }

  // Aplicar ordenación
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => {
        const precioA = getPrecioItem(a)
        const precioB = getPrecioItem(b)
        return (precioA.precioDescuento || precioA.precio) - (precioB.precioDescuento || precioB.precio)
      })
      break
    case 'price-desc':
      filtered.sort((a, b) => {
        const precioA = getPrecioItem(a)
        const precioB = getPrecioItem(b)
        return (precioB.precioDescuento || precioB.precio) - (precioA.precioDescuento || precioA.precio)
      })
      break
    case 'name-asc':
      filtered.sort((a, b) => a.producto.nombre.localeCompare(b.producto.nombre))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.producto.nombre.localeCompare(a.producto.nombre))
      break
    case 'newest':
      filtered.sort((a, b) => {
        if (a.producto.nuevo && !b.producto.nuevo) return -1
        if (!a.producto.nuevo && b.producto.nuevo) return 1
        return 0
      })
      break
  }

  return filtered
})

// Nombre de colección para UI
const collectionName = computed(() => {
  return collection.value.charAt(0).toUpperCase() + collection.value.slice(1)
})

// Toggle filtros
const toggleArrayFilter = (array: any[], value: any) => {
  const index = array.indexOf(value)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(value)
  }
}

// Limpiar filtros
const clearFilters = () => {
  if (collection.value === 'semillas') {
    seedFilters.value = {
      categorias: [],
      dominancias: [],
      dificultades: [],
      diasFloracionMin: 0,
      diasFloracionMax: 100,
      precioMin: 0,
      precioMax: 500
    }
  } else {
    ropaFilters.value = {
      categorias: [],
      tallas: [],
      colores: [],
      precioMin: 0,
      precioMax: 100
    }
  }
  sortBy.value = 'relevance'
}

// Contar filtros activos
const activeFiltersCount = computed(() => {
  if (collection.value === 'semillas') {
    return seedFilters.value.categorias.length +
      seedFilters.value.dominancias.length +
      seedFilters.value.dificultades.length
  } else {
    return ropaFilters.value.categorias.length +
      ropaFilters.value.tallas.length +
      ropaFilters.value.colores.length
  }
})
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
          <span class="text-gray-900 font-medium capitalize">
            {{ collectionName }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Category Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2 capitalize">
              {{ collectionName }}
            </h1>
            <p class="text-gray-600">
              Explora nuestra colección de {{ collection }}
            </p>
          </div>
          <div class="text-sm text-gray-600">
            {{ filteredItems.length }} producto{{ filteredItems.length !== 1 ? 's' : '' }} encontrado{{
              filteredItems.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="container-custom py-16">
      <div class="flex justify-center items-center">
        <Icon icon="mdi:loading" class="text-6xl text-main animate-spin" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container-custom py-16">
      <div class="text-center">
        <Icon icon="mdi:alert-circle" class="text-6xl text-red-500 mb-4 mx-auto" />
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          Error al cargar productos
        </h3>
        <p class="text-gray-600">
          Hubo un problema al obtener los productos. Por favor, intenta de nuevo.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="container-custom py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar (Desktop) -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-lg">Filtros</h3>
              <button v-if="activeFiltersCount > 0" @click="clearFilters" class="text-sm text-main hover:underline">
                Limpiar
              </button>
            </div>

            <!-- FILTROS PARA SEMILLAS -->
            <div v-if="collection === 'semillas' && uniqueValues && uniqueValues.type === 'semillas'">
              <!-- Categoría Semillas -->
              <div class="filter-section">
                <h4 class="filter-title">Categoría</h4>
                <div class="space-y-2">
                  <label v-for="cat in uniqueValues.categorias" :key="cat"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" :checked="seedFilters.categorias.includes(cat)"
                      @change="toggleArrayFilter(seedFilters.categorias, cat)"
                      class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main">
                    <span class="text-sm">{{ cat }}</span>
                  </label>
                </div>
              </div>

              <!-- Dominancia -->
              <div class="filter-section">
                <h4 class="filter-title">Dominancia</h4>
                <div class="space-y-2">
                  <label v-for="dom in uniqueValues.dominancias" :key="dom"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" :checked="seedFilters.dominancias.includes(dom)"
                      @change="toggleArrayFilter(seedFilters.dominancias, dom)"
                      class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main">
                    <span class="text-sm capitalize">{{ dom }}</span>
                  </label>
                </div>
              </div>

              <!-- Dificultad -->
              <div class="filter-section">
                <h4 class="filter-title">Dificultad</h4>
                <div class="space-y-2">
                  <label v-for="dif in uniqueValues.dificultades" :key="dif"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" :checked="seedFilters.dificultades.includes(dif)"
                      @change="toggleArrayFilter(seedFilters.dificultades, dif)"
                      class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main">
                    <span class="text-sm">{{ dif }}</span>
                  </label>
                </div>
              </div>

              <!-- Días de Floración -->
              <div class="filter-section">
                <h4 class="filter-title">Días de Floración</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ seedFilters.diasFloracionMin }} días</span>
                    <span>{{ seedFilters.diasFloracionMax }} días</span>
                  </div>
                  <input v-model.number="seedFilters.diasFloracionMin" type="range" min="0" max="100" class="w-full">
                  <input v-model.number="seedFilters.diasFloracionMax" type="range" min="0" max="100" class="w-full">
                </div>
              </div>

              <!-- Precio Semillas -->
              <div class="filter-section">
                <h4 class="filter-title">Precio</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ seedFilters.precioMin }}€</span>
                    <span>{{ seedFilters.precioMax }}€</span>
                  </div>
                  <input v-model.number="seedFilters.precioMin" type="range" min="0" max="500" class="w-full">
                  <input v-model.number="seedFilters.precioMax" type="range" min="0" max="500" class="w-full">
                </div>
              </div>
            </div>

            <!-- FILTROS PARA ROPA -->
            <div v-else-if="collection === 'ropa' && uniqueValues && uniqueValues.type === 'ropa'">
              <!-- Categoría Ropa -->
              <div class="filter-section">
                <h4 class="filter-title">Categoría</h4>
                <div class="space-y-2">
                  <label v-for="cat in uniqueValues.categorias" :key="cat"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" :checked="ropaFilters.categorias.includes(cat)"
                      @change="toggleArrayFilter(ropaFilters.categorias, cat)"
                      class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main">
                    <span class="text-sm">{{ cat }}</span>
                  </label>
                </div>
              </div>

              <!-- Tallas -->
              <div class="filter-section">
                <h4 class="filter-title">Tallas</h4>
                <div class="flex flex-wrap gap-2">
                  <button v-for="talla in uniqueValues.tallas" :key="talla"
                    @click="toggleArrayFilter(ropaFilters.tallas, talla)" :class="[
                      'px-3 py-1 text-sm rounded-lg border-2 transition-colors',
                      ropaFilters.tallas.includes(talla)
                        ? 'border-main bg-main text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    ]">
                    {{ talla }}
                  </button>
                </div>
              </div>

              <!-- Colores -->
              <div class="filter-section">
                <h4 class="filter-title">Colores</h4>
                <div class="space-y-2">
                  <label v-for="color in uniqueValues.colores" :key="color"
                    class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" :checked="ropaFilters.colores.includes(color)"
                      @change="toggleArrayFilter(ropaFilters.colores, color)"
                      class="w-4 h-4 rounded border-gray-300 text-main focus:ring-main">
                    <span class="text-sm">{{ color }}</span>
                  </label>
                </div>
              </div>

              <!-- Precio Ropa -->
              <div class="filter-section">
                <h4 class="filter-title">Precio</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ ropaFilters.precioMin }}€</span>
                    <span>{{ ropaFilters.precioMax }}€</span>
                  </div>
                  <input v-model.number="ropaFilters.precioMin" type="range" min="0" max="100" class="w-full">
                  <input v-model.number="ropaFilters.precioMax" type="range" min="0" max="100" class="w-full">
                </div>
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
              @click="showFilters = !showFilters">
              <Icon icon="mdi:filter-variant" class="text-xl" />
              <span>Filtros</span>
              <BaseBadge v-if="activeFiltersCount > 0" variant="primary" size="sm">
                {{ activeFiltersCount }}
              </BaseBadge>
            </button>

            <!-- Sort Dropdown -->
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <span class="hidden sm:inline text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
              <select v-model="sortBy"
                class="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="filteredItems.length > 0" class="grid-products">
            <template v-if="collection === 'semillas'">
              <SeedCard v-for="item in filteredItems" :key="`seed-${item.id}`" :semilla="item as Semilla" />
            </template>
            <template v-else-if="collection === 'ropa'">
              <RopaCard v-for="item in filteredItems" :key="`ropa-${item.id}`" :ropa="item as Ropa" />
            </template>
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
