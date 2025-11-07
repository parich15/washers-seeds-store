<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getPrecioItem } from '~~/types/product'
import type { 
  CollectionType,
  CollectionItem,
  Semilla, 
  Ropa,
  Cantidad,
  ProductoBase,
  RelacionProducto
} from '~~/types'

// Asegurar que cada producto se trate como una página única
definePageMeta({
  key: route => route.fullPath
})

const route = useRoute()

// Detectar colección y slug desde route params
const collection = computed(() => route.params.categories as CollectionType)
const slug = computed(() => route.params.slug as string)

// Obtener item usando composable genérico
const { fetchItemBySlug, getImageUrl, getGalleryUrls } = useProducts()

// Estado reactivo para el item
const item = ref<CollectionItem | null>(null)
const pending = ref<boolean>(true)
const error = ref<any>(null)

// Función para cargar el item
const loadItem = async () => {
  if (!collection.value || !slug.value) return
  
  pending.value = true
  error.value = null
  
  try {
    const result = await fetchItemBySlug(collection.value, slug.value)
    item.value = result.item.value
    error.value = result.error.value
  } catch (e) {
    error.value = e
    item.value = null
  } finally {
    pending.value = false
  }
}

// Cargar item inicial en onMounted
onMounted(() => {
  loadItem()
})

// Watch para recargar cuando cambien los parámetros de la ruta
watch([collection, slug], async () => {
  await loadItem()
}, { immediate: false })

// Estado de galería
const selectedImageIndex = ref(0)

// Estado de selección (para añadir al carrito)
const quantity = ref(1)
const selectedPack = ref<Cantidad | null>(null) // Para semillas
const selectedTalla = ref<string>('') // Para ropa
const selectedColor = ref<string>('') // Para ropa
const addedToCart = ref(false)

// Watch para reinicializar selecciones cuando cambia el item
watch(item, (newItem) => {
  if (newItem) {
    // Reset selections
    selectedImageIndex.value = 0
    quantity.value = 1
    
    if (collection.value === 'semillas') {
      const semilla = newItem as Semilla
      if (semilla.cantidades && semilla.cantidades.length > 0 && semilla.cantidades[0]) {
        selectedPack.value = semilla.cantidades[0]
      }
    } else if (collection.value === 'ropa') {
      const ropa = newItem as Ropa
      if (ropa.tallas && ropa.tallas.length > 0 && ropa.tallas[0]) {
        selectedTalla.value = ropa.tallas[0].talla
      }
      if (ropa.colores && ropa.colores.length > 0 && ropa.colores[0]) {
        selectedColor.value = ropa.colores[0].color
      }
    }
  }
}, { immediate: true })

// Obtener galería de imágenes
const galleryUrls = computed(() => {
  if (!item.value?.producto.galeria) return []
  return getGalleryUrls(item.value.producto.galeria)
})

// Todas las imágenes (principal + galería)
const allImages = computed(() => {
  if (!item.value) return []
  
  const images = []
  
  // Imagen principal
  if (item.value.producto.imagen_principal) {
    images.push(getImageUrl(item.value.producto.imagen_principal))
  }
  
  // Galería
  images.push(...galleryUrls.value)
  
  return images
})

// Imagen seleccionada actual
const currentImage = computed(() => {
  return allImages.value[selectedImageIndex.value] || getImageUrl(null)
})

// Obtener precio actual según selección
const precioActual = computed(() => {
  if (!item.value) return { precio: 0, precioDescuento: null, tieneDescuento: false }
  
  if (collection.value === 'semillas' && selectedPack.value) {
    return {
      precio: parseFloat(selectedPack.value.precio),
      precioDescuento: selectedPack.value.descuento 
        ? parseFloat(selectedPack.value.precio_descuento)
        : null,
      tieneDescuento: selectedPack.value.descuento,
      cantidad: selectedPack.value.cantidad
    }
  }
  
  return getPrecioItem(item.value)
})

// Display del precio
const priceDisplay = computed(() => {
  const info = precioActual.value
  
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

// Productos relacionados
const relacionados = computed(() => {
  if (!item.value?.producto.relacionados) return []
  return item.value.producto.relacionados.map((r: RelacionProducto) => r.related_productos_id)
})

// Nombre de colección para UI
const collectionName = computed(() => {
  if (!collection.value) return ''
  return collection.value.charAt(0).toUpperCase() + collection.value.slice(1)
})

// Cambiar imagen seleccionada
const selectImage = (index: number) => {
  selectedImageIndex.value = index
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

// Añadir al carrito (TODO: implementar cuando se adapte el store)
const addToCart = () => {
  // TODO: Adaptar cartStore para trabajar con Semilla/Ropa
  // Necesita guardar: selectedPack, selectedTalla, selectedColor
  
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}

// Type guards
const isSemilla = computed(() => collection.value === 'semillas')
const isRopa = computed(() => collection.value === 'ropa')

const semilla = computed(() => (isSemilla.value && item.value) ? item.value as Semilla : null)
const ropa = computed(() => (isRopa.value && item.value) ? item.value as Ropa : null)
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <Icon icon="mdi:loading" class="text-6xl text-main animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error || !item" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <Icon icon="mdi:alert-circle" class="text-6xl text-red-500 mb-4 mx-auto" />
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

    <!-- Product Details -->
    <div v-else class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-4">
        <nav class="flex items-center gap-2 text-sm flex-wrap">
          <NuxtLink to="/" class="text-gray-600 hover:text-main transition-colors">
            Inicio
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <NuxtLink 
            :to="`/products/${collection}`"
            class="text-gray-600 hover:text-main transition-colors capitalize"
          >
            {{ collectionName }}
          </NuxtLink>
          <Icon icon="mdi:chevron-right" class="text-gray-400" />
          <span class="text-gray-900 font-medium">{{ item.producto.nombre }}</span>
        </nav>
      </div>
    </div>

    <!-- Product Content -->
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Galería de Imágenes -->
        <div>
          <!-- Imagen Principal -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <img
              :src="currentImage"
              :alt="item.producto.nombre"
              class="w-full aspect-square object-cover"
            >
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="grid grid-cols-4 gap-4">
            <button
              v-for="(imageUrl, index) in allImages"
              :key="index"
              @click="selectImage(index)"
              :class="[
                'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                selectedImageIndex === index 
                  ? 'border-main shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img
                :src="imageUrl"
                :alt="`${item.producto.nombre} - Imagen ${index + 1}`"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Info del Producto -->
        <div class="bg-white rounded-xl shadow-md p-6 lg:p-8">
          <!-- Título -->
          <h1 class="text-3xl md:text-4xl font-semibold mb-4" style="font-family: var(--font-text)">
            {{ item.producto.nombre }}
          </h1>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-6">
            <BaseBadge v-if="item.producto.nuevo" variant="gradient">
              Nuevo
            </BaseBadge>
            <BaseBadge v-if="priceDisplay.discount" variant="danger">
              -{{ priceDisplay.discount }}% OFF
            </BaseBadge>
            <BaseBadge v-if="isSemilla && semilla" variant="primary">
              {{ semilla.categoria }}
            </BaseBadge>
            <BaseBadge v-if="isRopa && ropa" variant="primary">
              {{ ropa.categoria }}
            </BaseBadge>
          </div>

          <!-- Precio -->
          <div class="mb-6">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-bold text-gray-900">
                {{ priceDisplay.current }}€
              </span>
              <span v-if="priceDisplay.old" class="text-2xl text-gray-400 line-through">
                {{ priceDisplay.old }}€
              </span>
            </div>
            <p v-if="isSemilla && selectedPack" class="text-sm text-gray-600 mt-1">
              Pack de {{ selectedPack.cantidad }} {{ selectedPack.cantidad === 1 ? 'semilla' : 'semillas' }}
            </p>
          </div>

          <!-- Descripción Corta -->
          <p class="text-gray-700 mb-6 leading-relaxed">
            {{ item.producto.descripcion_corta }}
          </p>

          <div class="divider" />

          <!-- SELECTOR DE PACK (Solo para Semillas) -->
          <div v-if="isSemilla && semilla && semilla.cantidades.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Selecciona Pack
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="pack in semilla.cantidades"
                :key="pack.cantidad"
                @click="selectedPack = pack"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-left',
                  selectedPack?.cantidad === pack.cantidad
                    ? 'border-main bg-main/5'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold">{{ pack.cantidad }} ud{{ pack.cantidad > 1 ? 's' : '' }}</span>
                  <BaseBadge v-if="pack.descuento" variant="danger" size="sm">
                    -{{ Math.round(((parseFloat(pack.precio) - parseFloat(pack.precio_descuento)) / parseFloat(pack.precio)) * 100) }}%
                  </BaseBadge>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl font-bold">
                    {{ pack.descuento ? parseFloat(pack.precio_descuento).toFixed(2) : parseFloat(pack.precio).toFixed(2) }}€
                  </span>
                  <span v-if="pack.descuento" class="text-sm text-gray-400 line-through">
                    {{ parseFloat(pack.precio).toFixed(2) }}€
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- SELECTOR DE TALLA Y COLOR (Solo para Ropa) -->
          <div v-if="isRopa && ropa">
            <!-- Tallas -->
            <div v-if="ropa.tallas.length > 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Talla
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="talla in ropa.tallas"
                  :key="talla.talla"
                  @click="selectedTalla = talla.talla"
                  :class="[
                    'px-4 py-2 rounded-lg border-2 transition-all font-medium',
                    selectedTalla === talla.talla
                      ? 'border-main bg-main text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                >
                  {{ talla.talla }}
                </button>
              </div>
            </div>

            <!-- Colores -->
            <div v-if="ropa.colores.length > 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in ropa.colores"
                  :key="color.color"
                  @click="selectedColor = color.color"
                  :class="[
                    'px-4 py-2 rounded-lg border-2 transition-all',
                    selectedColor === color.color
                      ? 'border-main bg-main text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                >
                  {{ color.color }}
                </button>
              </div>
            </div>
          </div>

          <!-- Cantidad y Añadir al Carrito -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full sm:w-auto">
                <button
                  @click="decrementQuantity"
                  class="px-3 sm:px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="quantity <= 1"
                >
                  <Icon icon="mdi:minus" class="text-xl" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="flex-1 sm:w-20 text-center border-x border-gray-300 py-3 outline-none"
                >
                <button
                  @click="incrementQuantity"
                  class="px-3 sm:px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="mdi:plus" class="text-xl" />
                </button>
              </div>

              <BaseButton
                variant="gradient"
                size="lg"
                icon="mdi:cart-plus"
                full-width
                :disabled="!item.producto.disponible"
                @click="addToCart"
                class="flex-1"
              >
                {{ item.producto.disponible ? 'Añadir al Carrito' : 'Agotado' }}
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
              :icon="item.producto.disponible ? 'mdi:check-circle' : 'mdi:alert-circle'" 
              :class="item.producto.disponible ? 'text-secondary' : 'text-red-500'"
              class="text-xl"
            />
            <span :class="item.producto.disponible ? 'text-secondary' : 'text-red-500'" class="font-medium">
              {{ item.producto.disponible ? 'En Stock' : 'Agotado' }}
            </span>
            <span v-if="item.producto.disponible" class="text-gray-500 text-sm">
              ({{ item.producto.stock }} disponibles)
            </span>
          </div>

          <!-- SKU -->
          <p class="text-sm text-gray-500">
            SKU: {{ item.producto.sku }}
          </p>
        </div>
      </div>

      <!-- Descripción e Info Específica -->
      <div class="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8">
        <div class="space-y-8">
          <!-- Descripción -->
          <div>
            <h2 class="text-2xl font-bold mb-4">Descripción</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ item.producto.descripcion }}
            </p>
          </div>

          <!-- Info específica de SEMILLAS -->
          <div v-if="isSemilla && semilla">
            <div class="divider" />

            <!-- Genética -->
            <div class="mb-8">
              <h3 class="text-xl font-bold mb-4">Genética</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">THC</p>
                  <p class="text-lg font-bold text-gray-900">{{ semilla.thc }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">CBD</p>
                  <p class="text-lg font-bold text-gray-900">{{ semilla.cbd }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Dominancia</p>
                  <p class="text-lg font-bold capitalize">{{ semilla.dominancia }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Linaje</p>
                  <p class="text-sm font-medium">{{ semilla.linaje }}</p>
                </div>
              </div>
            </div>

            <!-- Info de Cultivo -->
            <div>
              <h3 class="text-xl font-bold mb-4">Información de Cultivo</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:clock-outline" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Floración</p>
                    <p class="text-gray-600">{{ semilla.dias_floracion }} días - {{ semilla.texto_floracion }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:chart-line" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Rendimiento Interior</p>
                    <p class="text-gray-600">{{ semilla.rendimiento_interior }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:chart-line" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Rendimiento Exterior</p>
                    <p class="text-gray-600">{{ semilla.rendimiento_exterior }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon icon="mdi:school-outline" class="text-2xl text-main mt-1" />
                  <div>
                    <p class="font-semibold">Dificultad</p>
                    <p class="text-gray-600">{{ semilla.dificultad }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider" />

            <!-- Efectos, Sabores, Aromas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-if="semilla.efectos && semilla.efectos.length > 0">
                <h4 class="font-bold mb-3">Efectos</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="efecto in semilla.efectos" :key="efecto" variant="primary">
                    {{ efecto }}
                  </BaseBadge>
                </div>
              </div>
              <div v-if="semilla.sabores && semilla.sabores.length > 0">
                <h4 class="font-bold mb-3">Sabores</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="sabor in semilla.sabores" :key="sabor" variant="secondary">
                    {{ sabor }}
                  </BaseBadge>
                </div>
              </div>
              <div v-if="semilla.aromas && semilla.aromas.length > 0">
                <h4 class="font-bold mb-3">Aromas</h4>
                <div class="flex flex-wrap gap-2">
                  <BaseBadge v-for="aroma in semilla.aromas" :key="aroma" variant="gradient">
                    {{ aroma }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Info específica de ROPA -->
          <div v-if="isRopa && ropa">
            <div class="divider" />
            <h3 class="text-xl font-bold mb-4">Detalles del Producto</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Icon icon="mdi:hanger" class="text-2xl text-main" />
                <div>
                  <p class="font-semibold">Tallas Disponibles</p>
                  <p class="text-gray-600">{{ ropa.tallas.map(t => t.talla).join(', ') }}</p>
                </div>
              </div>
              <div v-if="ropa.colores.length > 0" class="flex items-center gap-3">
                <Icon icon="mdi:palette" class="text-2xl text-main" />
                <div>
                  <p class="font-semibold">Colores Disponibles</p>
                  <p class="text-gray-600">{{ ropa.colores.map(c => c.color).join(', ') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Icon icon="mdi:tag" class="text-2xl text-main" />
                <div>
                  <p class="font-semibold">Categoría</p>
                  <p class="text-gray-600">{{ ropa.categoria }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos Relacionados -->
      <div v-if="relacionados.length > 0">
        <h2 class="text-2xl md:text-3xl font-bold text-gradient mb-6">
          Productos Relacionados
        </h2>
        <div class="grid-products">
          <!-- TODO: Crear componente genérico o detectar tipo -->
          <div v-for="prod in relacionados" :key="prod.id" class="text-center p-4 bg-white rounded-lg">
            <p>{{ prod.nombre }}</p>
            <p class="text-sm text-gray-500">SKU: {{ prod.sku }}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
