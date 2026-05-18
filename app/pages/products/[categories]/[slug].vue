<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { getPrecioItem } from '~~/types/product'
import { useCartStore } from '~/stores/cart'
import type {
  Cantidad,
  CollectionItem,
  CollectionType,
  Ropa,
  Semilla
} from '~~/types'

definePageMeta({
  key: route => route.fullPath
})

const route = useRoute()
const cartStore = useCartStore()
const config = useRuntimeConfig()
const { animate, fadeIn, fadeOut } = useMotion()
const { fetchItemBySlug } = useProducts()

const collection = computed(() => route.params.categories as CollectionType)
const slug = computed(() => route.params.slug as string)

const item = ref<CollectionItem | null>(null)
const pending = ref(true)
const error = ref<any>(null)
const selectedImageIndex = ref(0)
const quantity = ref(1)
const selectedPack = ref<Cantidad | null>(null)
const selectedTalla = ref('')
const selectedColor = ref('')
const addedToCart = ref(false)
const productImageRef = ref<HTMLElement | null>(null)

const directusAssetUrl = (uuid: string | null | undefined): string => {
  if (!uuid) return ''
  return `${config.public.directus.url}/assets/${uuid}`
}

const loadItem = async () => {
  if (!collection.value || !slug.value) return

  pending.value = true
  error.value = null

  try {
    const result = await fetchItemBySlug(collection.value, slug.value)
    item.value = result.item.value || null
    error.value = result.error.value
  } catch (e) {
    error.value = e
    item.value = null
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadItem()
})

watch([collection, slug], async () => {
  await loadItem()
}, { immediate: false })

watch(item, async newItem => {
  if (!newItem) return

  selectedImageIndex.value = 0
  quantity.value = 1

  if (collection.value === 'semillas') {
    const semilla = newItem as Semilla
    selectedPack.value = semilla.cantidades?.[0] || null
  }

  if (collection.value === 'ropa') {
    const ropa = newItem as Ropa
    selectedTalla.value = ropa.tallas?.[0]?.talla || ''
    selectedColor.value = ropa.colores?.[0]?.color || ''
  }

  await nextTick()
  animate('.product-reveal', {
    opacity: [0, 1],
    y: [18, 0],
    duration: 440,
    delay: (_el: unknown, index: number) => index * 55,
    ease: 'outQuad'
  })
}, { immediate: true })

const isSemilla = computed(() => collection.value === 'semillas')
const isRopa = computed(() => collection.value === 'ropa')
const semilla = computed(() => (isSemilla.value && item.value) ? item.value as Semilla : null)
const ropa = computed(() => (isRopa.value && item.value) ? item.value as Ropa : null)

const collectionName = computed(() => {
  if (isSemilla.value) return 'Semillas'
  if (isRopa.value) return 'Ropa'
  return collection.value ? collection.value.charAt(0).toUpperCase() + collection.value.slice(1) : ''
})

const galleryUrls = computed(() => {
  if (!item.value?.producto.galeria?.length) return []
  return item.value.producto.galeria.map(id => directusAssetUrl(id)).filter(Boolean)
})

const allImages = computed(() => {
  if (!item.value) return []

  const images = [
    directusAssetUrl(item.value.producto.imagen_principal),
    ...galleryUrls.value
  ].filter(Boolean)

  return Array.from(new Set(images))
})

const currentImage = computed(() => allImages.value[selectedImageIndex.value] || '')

const precioActual = computed(() => {
  if (!item.value) return { precio: 0, precioDescuento: null, tieneDescuento: false }

  if (isSemilla.value && selectedPack.value) {
    return {
      precio: parseFloat(selectedPack.value.precio),
      precioDescuento: selectedPack.value.descuento && selectedPack.value.precio_descuento
        ? parseFloat(selectedPack.value.precio_descuento)
        : null,
      tieneDescuento: selectedPack.value.descuento,
      cantidad: selectedPack.value.cantidad
    }
  }

  return getPrecioItem(item.value)
})

const priceDisplay = computed(() => {
  const info = precioActual.value

  if (info.tieneDescuento && info.precioDescuento) {
    const discount = Math.round(((info.precio - info.precioDescuento) / info.precio) * 100)

    return {
      current: info.precioDescuento.toFixed(2),
      old: info.precio.toFixed(2),
      discount
    }
  }

  return {
    current: info.precio.toFixed(2)
  }
})

const relacionados = computed(() => {
  if (!item.value?.producto.relacionados) return []

  return item.value.producto.relacionados
    .map((relation: any) => {
      if (typeof relation === 'number') return null
      return relation.related_productos_id || relation
    })
    .filter(Boolean)
})

const sanitizedDescription = computed(() => {
  const html = item.value?.producto.descripcion || ''
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
})

const productBadges = computed(() => {
  if (!item.value) return []

  const badges = []

  if (item.value.producto.nuevo) badges.push({ label: 'Nuevo', variant: 'gradient' as const })
  if (priceDisplay.value.discount) badges.push({ label: `-${priceDisplay.value.discount}%`, variant: 'danger' as const })
  if (semilla.value) badges.push({ label: semilla.value.categoria, variant: 'primary' as const })
  if (ropa.value) badges.push({ label: ropa.value.categoria, variant: 'primary' as const })

  return badges
})

const seedSpecs = computed(() => {
  if (!semilla.value) return []

  return [
    { label: 'THC', value: semilla.value.thc, icon: 'mdi:molecule' },
    { label: 'CBD', value: semilla.value.cbd, icon: 'mdi:leaf' },
    { label: 'Dominancia', value: semilla.value.dominancia, icon: 'mdi:sprout-outline' },
    { label: 'Dificultad', value: semilla.value.dificultad, icon: 'mdi:school-outline' },
    { label: 'Floracion', value: `${semilla.value.dias_floracion} dias`, icon: 'mdi:clock-outline' },
    { label: 'Linaje', value: semilla.value.linaje || 'No especificado', icon: 'mdi:dna' }
  ]
})

const cultivationSpecs = computed(() => {
  if (!semilla.value) return []

  return [
    { label: 'Floracion', value: semilla.value.texto_floracion, icon: 'mdi:calendar-clock' },
    { label: 'Rendimiento interior', value: semilla.value.rendimiento_interior, icon: 'mdi:home-analytics' },
    { label: 'Rendimiento exterior', value: semilla.value.rendimiento_exterior, icon: 'mdi:white-balance-sunny' },
    { label: 'Altura interior', value: semilla.value.altura_interior, icon: 'mdi:arrow-expand-vertical' },
    { label: 'Altura exterior', value: semilla.value.altura_exterior, icon: 'mdi:arrow-up-bold-outline' }
  ].filter(spec => spec.value)
})

const ropaSpecs = computed(() => {
  if (!ropa.value) return []

  return [
    { label: 'Tallas disponibles', value: ropa.value.tallas.map(t => t.talla).join(', '), icon: 'mdi:hanger' },
    { label: 'Colores disponibles', value: ropa.value.colores.map(c => c.color).join(', '), icon: 'mdi:palette-outline' },
    { label: 'Categoria', value: ropa.value.categoria, icon: 'mdi:tag-outline' }
  ].filter(spec => spec.value)
})

const trustItems = [
  { icon: 'mdi:package-variant-closed', label: 'Embalaje discreto' },
  { icon: 'mdi:shield-check-outline', label: 'Compra segura' },
  { icon: 'mdi:message-text-outline', label: 'Asesoria directa' }
]

const selectImage = async (index: number) => {
  selectedImageIndex.value = index
  await nextTick()

  if (productImageRef.value) {
    animate(productImageRef.value, {
      opacity: [0.82, 1],
      scale: [0.985, 1],
      duration: 320,
      ease: 'outQuad'
    })
  }
}

const setPack = (pack: Cantidad, event: MouseEvent) => {
  selectedPack.value = pack
  pulseTarget(event.currentTarget)
}

const setTalla = (value: string, event: MouseEvent) => {
  selectedTalla.value = value
  pulseTarget(event.currentTarget)
}

const setColor = (value: string, event: MouseEvent) => {
  selectedColor.value = value
  pulseTarget(event.currentTarget)
}

const pulseTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return

  animate(target, {
    scale: [0.98, 1],
    duration: 220,
    ease: 'outQuad'
  })
}

const liftCard = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  animate(target, {
    y: -5,
    duration: 220,
    ease: 'outQuad'
  })
}

const settleCard = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  animate(target, {
    y: 0,
    duration: 260,
    ease: 'outQuad'
  })
}

const incrementQuantity = (event?: MouseEvent) => {
  quantity.value++
  if (event) pulseTarget(event.currentTarget)
}

const decrementQuantity = (event?: MouseEvent) => {
  if (quantity.value <= 1) return
  quantity.value--
  if (event) pulseTarget(event.currentTarget)
}

const addToCart = async (event?: MouseEvent) => {
  if (!item.value) return

  cartStore.addCartLine({
    product: {
      id: String(item.value.id),
      collection: collection.value,
      slug: item.value.producto.slug,
      name: item.value.producto.nombre,
      image: currentImage.value,
      price: precioActual.value.precioDescuento || precioActual.value.precio,
      sku: item.value.producto.sku,
      category: semilla.value?.categoria || ropa.value?.categoria
    },
    quantity: quantity.value,
    selectedOptions: isSemilla.value
      ? { pack: selectedPack.value ? String(selectedPack.value.cantidad) : '1' }
      : { talla: selectedTalla.value, color: selectedColor.value }
  })

  if (event?.currentTarget instanceof HTMLElement) {
    animate(event.currentTarget, {
      scale: [0.985, 1],
      duration: 260,
      ease: 'outQuad'
    })
  }

  addedToCart.value = true
  await nextTick()

  animate('.cart-success', {
    opacity: [0, 1],
    y: [8, 0],
    duration: 260,
    ease: 'outQuad'
  })

  setTimeout(() => {
    addedToCart.value = false
  }, 2200)
}
</script>

<template>
  <main class="min-h-screen bg-[#fafbf7]">
    <section v-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="flex flex-col items-center gap-4 text-[#647067]">
        <Icon icon="mdi:loading" class="text-5xl text-main animate-spin" />
        <p class="text-sm font-bold uppercase tracking-[0.14em]">Cargando producto</p>
      </div>
    </section>

    <section v-else-if="error || !item" class="flex min-h-screen items-center justify-center px-4">
      <div class="max-w-md rounded-lg border border-[#dde6dc] bg-white p-8 text-center">
        <Icon icon="mdi:alert-circle-outline" class="mx-auto mb-4 text-5xl text-red-500" />
        <h1 class="text-2xl font-extrabold text-[#111513]">Producto no encontrado</h1>
        <p class="mt-3 text-[#647067]">El producto que buscas no existe o ha sido eliminado.</p>
        <BaseButton variant="outline" class="mt-6" @click="$router.push('/')">
          Volver al inicio
        </BaseButton>
      </div>
    </section>

    <template v-else>
      <div class="border-b border-[#dde6dc] bg-white">
        <div class="container-custom py-4">
          <nav class="flex flex-wrap items-center gap-2 text-sm">
            <NuxtLink to="/" class="font-semibold text-[#647067] hover:text-main">
              Inicio
            </NuxtLink>
            <Icon icon="mdi:chevron-right" class="text-[#9aa79d]" />
            <NuxtLink :to="`/products/${collection}`" class="font-semibold text-[#647067] hover:text-main">
              {{ collectionName }}
            </NuxtLink>
            <Icon icon="mdi:chevron-right" class="text-[#9aa79d]" />
            <span class="font-bold text-[#111513]">{{ item.producto.nombre }}</span>
          </nav>
        </div>
      </div>

      <section class="container-custom grid gap-8 py-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.78fr)] lg:py-12">
        <div class="product-reveal opacity-0">
          <div
            class="overflow-hidden rounded-lg border border-[#dde6dc] bg-white"
            @mouseenter="liftCard"
            @mouseleave="settleCard"
          >
            <div class="relative aspect-square bg-[#edf3e8]">
              <img
                v-if="currentImage"
                ref="productImageRef"
                :src="currentImage"
                :alt="item.producto.nombre"
                class="h-full w-full object-cover"
              >
              <div v-else class="flex h-full w-full items-center justify-center text-[#936037]">
                <Icon icon="mdi:image-off-outline" class="text-6xl" />
              </div>

              <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <BaseBadge
                  v-for="badge in productBadges"
                  :key="badge.label"
                  :variant="badge.variant"
                  size="sm"
                >
                  {{ badge.label }}
                </BaseBadge>
              </div>
            </div>
          </div>

          <div v-if="allImages.length > 1" class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            <button
              v-for="(imageUrl, index) in allImages"
              :key="imageUrl"
              type="button"
              :class="[
                'aspect-square overflow-hidden rounded-lg border bg-white p-1',
                selectedImageIndex === index
                  ? 'border-[#111513]'
                  : 'border-[#dde6dc] hover:border-main'
              ]"
              @click="selectImage(index)"
            >
              <img
                :src="imageUrl"
                :alt="`${item.producto.nombre} - Imagen ${index + 1}`"
                class="h-full w-full rounded-[6px] object-cover"
              >
            </button>
          </div>
        </div>

        <aside class="product-reveal opacity-0">
          <div class="sticky top-36 rounded-lg border border-[#dde6dc] bg-white p-5 shadow-sm md:p-7">
            <p class="text-sm font-bold uppercase tracking-[0.14em] text-[#936037]">
              {{ collectionName }}
            </p>
            <h1 class="mt-3 text-3xl font-extrabold leading-tight text-[#111513] md:text-5xl">
              {{ item.producto.nombre }}
            </h1>

            <p v-if="item.producto.descripcion_corta" class="mt-4 text-base leading-7 text-[#647067]">
              {{ item.producto.descripcion_corta }}
            </p>

            <div class="mt-6 flex items-end gap-3">
              <span class="text-4xl font-extrabold tracking-normal text-[#111513] md:text-5xl">
                {{ priceDisplay.current }}€
              </span>
              <span v-if="priceDisplay.old" class="pb-1 text-xl font-bold text-[#9aa79d] line-through">
                {{ priceDisplay.old }}€
              </span>
            </div>

            <p v-if="isSemilla && selectedPack" class="mt-2 text-sm font-semibold text-[#647067]">
              Pack de {{ selectedPack.cantidad }} {{ selectedPack.cantidad === 1 ? 'semilla' : 'semillas' }}
            </p>

            <div class="my-6 h-px bg-[#dde6dc]" />

            <div v-if="isSemilla && semilla && semilla.cantidades.length > 0" class="space-y-3">
              <h2 class="text-sm font-bold uppercase tracking-[0.12em] text-[#647067]">Selecciona pack</h2>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="pack in semilla.cantidades"
                  :key="pack.cantidad"
                  type="button"
                  :class="[
                    'rounded-lg border p-4 text-left',
                    selectedPack?.cantidad === pack.cantidad
                      ? 'border-[#111513] bg-[#111513] text-white'
                      : 'border-[#dde6dc] bg-[#fafbf7] text-[#111513] hover:border-main'
                  ]"
                  @click="setPack(pack, $event)"
                >
                  <span class="block text-sm font-extrabold">{{ pack.cantidad }} ud{{ pack.cantidad > 1 ? 's' : '' }}</span>
                  <span class="mt-1 flex items-baseline gap-2">
                    <span class="text-xl font-extrabold">
                      {{ pack.descuento ? parseFloat(pack.precio_descuento || pack.precio).toFixed(2) : parseFloat(pack.precio).toFixed(2) }}€
                    </span>
                    <span v-if="pack.descuento" class="text-xs opacity-70 line-through">
                      {{ parseFloat(pack.precio).toFixed(2) }}€
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div v-if="isRopa && ropa" class="space-y-5">
              <div v-if="ropa.tallas.length > 0">
                <h2 class="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#647067]">Talla</h2>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="talla in ropa.tallas"
                    :key="talla.talla"
                    type="button"
                    :class="[
                      'min-h-11 min-w-11 rounded-lg border px-4 font-bold',
                      selectedTalla === talla.talla
                        ? 'border-[#111513] bg-[#111513] text-white'
                        : 'border-[#dde6dc] bg-[#fafbf7] text-[#111513] hover:border-main'
                    ]"
                    @click="setTalla(talla.talla, $event)"
                  >
                    {{ talla.talla }}
                  </button>
                </div>
              </div>

              <div v-if="ropa.colores.length > 0">
                <h2 class="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#647067]">Color</h2>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in ropa.colores"
                    :key="color.color"
                    type="button"
                    :class="[
                      'min-h-11 rounded-lg border px-4 font-bold',
                      selectedColor === color.color
                        ? 'border-[#111513] bg-[#111513] text-white'
                        : 'border-[#dde6dc] bg-[#fafbf7] text-[#111513] hover:border-main'
                    ]"
                    @click="setColor(color.color, $event)"
                  >
                    {{ color.color }}
                  </button>
                </div>
              </div>
            </div>

            <div class="my-6 h-px bg-[#dde6dc]" />

            <div>
              <label class="mb-3 block text-sm font-bold uppercase tracking-[0.12em] text-[#647067]">
                Cantidad
              </label>
              <div class="flex flex-col gap-3 sm:flex-row">
                <div class="flex min-h-12 overflow-hidden rounded-lg border border-[#dde6dc] bg-[#fafbf7]">
                  <button
                    type="button"
                    class="flex w-12 items-center justify-center disabled:opacity-40"
                    :disabled="quantity <= 1"
                    @click="decrementQuantity($event)"
                  >
                    <Icon icon="mdi:minus" class="text-xl" />
                  </button>
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    class="w-full min-w-16 border-x border-[#dde6dc] bg-white text-center font-bold outline-none sm:w-20"
                  >
                  <button
                    type="button"
                    class="flex w-12 items-center justify-center"
                    @click="incrementQuantity($event)"
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
                  class="flex-1"
                  @click="addToCart"
                >
                  {{ item.producto.disponible ? 'Añadir al carrito' : 'Agotado' }}
                </BaseButton>
              </div>
            </div>

            <Transition :css="false" @enter="fadeIn" @leave="fadeOut">
              <div v-if="addedToCart" class="cart-success mt-4 flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/10 p-4 text-sm font-bold text-[#20622f]">
                <Icon icon="mdi:check-circle-outline" class="text-xl text-secondary" />
                Producto añadido al carrito.
              </div>
            </Transition>

            <div class="mt-6 grid gap-2">
              <div class="flex items-center gap-2 text-sm font-bold" :class="item.producto.disponible ? 'text-[#2f8f46]' : 'text-red-600'">
                <Icon :icon="item.producto.disponible ? 'mdi:check-circle-outline' : 'mdi:alert-circle-outline'" class="text-xl" />
                {{ item.producto.disponible ? `En stock (${item.producto.stock} disponibles)` : 'Agotado' }}
              </div>
              <p class="text-sm text-[#647067]">SKU: {{ item.producto.sku }}</p>
            </div>

            <div class="mt-6 grid gap-2 border-t border-[#dde6dc] pt-5 sm:grid-cols-3">
              <div
                v-for="trust in trustItems"
                :key="trust.label"
                class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#647067]"
              >
                <Icon :icon="trust.icon" class="text-lg text-secondary" />
                {{ trust.label }}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section class="container-custom pb-16">
        <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside class="product-reveal opacity-0">
            <div class="rounded-lg border border-[#dde6dc] bg-white p-5">
              <h2 class="text-sm font-bold uppercase tracking-[0.14em] text-[#936037]">Ficha rápida</h2>
              <div class="mt-5 grid gap-3">
                <div
                  v-for="spec in (isSemilla ? seedSpecs : ropaSpecs)"
                  :key="spec.label"
                  class="flex items-start gap-3 rounded-lg bg-[#fafbf7] p-3"
                >
                  <Icon :icon="spec.icon" class="mt-0.5 text-xl text-main" />
                  <div>
                    <p class="text-xs font-bold uppercase tracking-[0.1em] text-[#647067]">{{ spec.label }}</p>
                    <p class="mt-1 font-extrabold text-[#111513]">{{ spec.value }}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div class="product-reveal rounded-lg border border-[#dde6dc] bg-white p-5 opacity-0 md:p-8">
            <div>
              <p class="text-sm font-bold uppercase tracking-[0.14em] text-main">Detalle</p>
              <h2 class="mt-3 text-3xl font-extrabold text-[#111513]">Descripción</h2>
              <div
                v-if="sanitizedDescription"
                class="prose mt-5 max-w-none text-[#4c574f] prose-headings:text-[#111513] prose-a:text-main"
                v-html="sanitizedDescription"
              />
              <p v-else class="mt-5 leading-7 text-[#647067]">
                No hay una descripción ampliada disponible para este producto.
              </p>
            </div>

            <div v-if="isSemilla && semilla" class="mt-10 border-t border-[#dde6dc] pt-8">
              <h3 class="text-2xl font-extrabold text-[#111513]">Cultivo y perfil</h3>
              <div class="mt-5 grid gap-3 md:grid-cols-2">
                <div
                  v-for="spec in cultivationSpecs"
                  :key="spec.label"
                  class="rounded-lg border border-[#dde6dc] bg-[#fafbf7] p-4"
                  @mouseenter="liftCard"
                  @mouseleave="settleCard"
                >
                  <Icon :icon="spec.icon" class="mb-3 text-2xl text-secondary" />
                  <p class="text-xs font-bold uppercase tracking-[0.1em] text-[#647067]">{{ spec.label }}</p>
                  <p class="mt-1 font-bold leading-6 text-[#111513]">{{ spec.value }}</p>
                </div>
              </div>

              <div class="mt-8 grid gap-6 md:grid-cols-3">
                <div v-if="semilla.efectos?.length">
                  <h4 class="mb-3 font-extrabold text-[#111513]">Efectos</h4>
                  <div class="flex flex-wrap gap-2">
                    <BaseBadge v-for="efecto in semilla.efectos" :key="efecto" variant="primary">
                      {{ efecto }}
                    </BaseBadge>
                  </div>
                </div>
                <div v-if="semilla.sabores?.length">
                  <h4 class="mb-3 font-extrabold text-[#111513]">Sabores</h4>
                  <div class="flex flex-wrap gap-2">
                    <BaseBadge v-for="sabor in semilla.sabores" :key="sabor" variant="secondary">
                      {{ sabor }}
                    </BaseBadge>
                  </div>
                </div>
                <div v-if="semilla.aromas?.length">
                  <h4 class="mb-3 font-extrabold text-[#111513]">Aromas</h4>
                  <div class="flex flex-wrap gap-2">
                    <BaseBadge v-for="aroma in semilla.aromas" :key="aroma" variant="info">
                      {{ aroma }}
                    </BaseBadge>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isRopa && ropa" class="mt-10 border-t border-[#dde6dc] pt-8">
              <h3 class="text-2xl font-extrabold text-[#111513]">Detalles de producto</h3>
              <div class="mt-5 grid gap-3 md:grid-cols-3">
                <div
                  v-for="spec in ropaSpecs"
                  :key="spec.label"
                  class="rounded-lg border border-[#dde6dc] bg-[#fafbf7] p-4"
                  @mouseenter="liftCard"
                  @mouseleave="settleCard"
                >
                  <Icon :icon="spec.icon" class="mb-3 text-2xl text-secondary" />
                  <p class="text-xs font-bold uppercase tracking-[0.1em] text-[#647067]">{{ spec.label }}</p>
                  <p class="mt-1 font-bold leading-6 text-[#111513]">{{ spec.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section v-if="relacionados.length > 0" class="product-reveal mt-10 opacity-0">
          <div class="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p class="text-sm font-bold uppercase tracking-[0.14em] text-[#936037]">También puede interesarte</p>
              <h2 class="mt-2 text-3xl font-extrabold text-[#111513]">Productos relacionados</h2>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <div
              v-for="prod in relacionados"
              :key="prod.id"
              class="rounded-lg border border-[#dde6dc] bg-white p-5"
              @mouseenter="liftCard"
              @mouseleave="settleCard"
            >
              <p class="font-extrabold text-[#111513]">{{ prod.nombre }}</p>
              <p class="mt-2 text-sm text-[#647067]">SKU: {{ prod.sku }}</p>
            </div>
          </div>
        </section>
      </section>
    </template>
  </main>
</template>
