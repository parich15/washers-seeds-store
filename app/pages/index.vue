<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { getSemillaPrecio } from '~~/types/product'
import type { SeedCategory, Semilla } from '~~/types'

const { animate, fadeIn, fadeOut } = useMotion()
const config = useRuntimeConfig()

const { fetchSemillas } = useSemillas()
const { semillas, pending } = await fetchSemillas()

const newsletterEmail = ref('')
const newsletterError = ref('')
const newsletterSuccess = ref(false)
const isSubmittingNewsletter = ref(false)

const directusAssetUrl = (uuid: string | null | undefined): string => {
  if (!uuid) return ''
  return `${config.public.directus.url}/assets/${uuid}`
}

const availableSeeds = computed(() =>
  (semillas.value || []).filter(seed => seed.producto.disponible)
)

const featuredSeeds = computed(() =>
  availableSeeds.value.slice(0, 10)
)

const heroSeed = computed(() =>
  availableSeeds.value.find(seed => seed.producto.imagen_principal) || availableSeeds.value[0] || null
)

const heroImage = computed(() =>
  directusAssetUrl(heroSeed.value?.producto.imagen_principal)
)

const formatSeedPrice = (seed: Semilla): string => {
  const price = getSemillaPrecio(seed)
  const value = price.precioDescuento || price.precio
  return value > 0 ? `${value.toFixed(2)}€` : 'Consultar'
}

const categoriesCount = computed(() =>
  new Set((semillas.value || []).map(seed => seed.categoria).filter(Boolean)).size
)

const heroStats = computed(() => [
  {
    value: `${availableSeeds.value.length}`,
    label: 'referencias disponibles'
  },
  {
    value: `${categoriesCount.value}`,
    label: 'familias de semillas'
  },
  {
    value: '24/48h',
    label: 'preparacion habitual'
  }
])

const categoryMeta: Array<{
  name: string
  category?: SeedCategory
  description: string
  to: string
  icon: string
}> = [
  {
    name: 'Feminizadas',
    category: 'Feminizadas',
    description: 'Geneticas estables para seleccionar con criterio.',
    to: '/products/semillas',
    icon: 'mdi:gender-female'
  },
  {
    name: 'Autoflorecientes',
    category: 'Autoflorecientes',
    description: 'Variedades rapidas para ciclos simples y eficientes.',
    to: '/products/semillas',
    icon: 'mdi:timer-sand'
  },
  {
    name: 'CBD Premium',
    category: 'CBD',
    description: 'Opciones enfocadas en perfiles suaves y equilibrados.',
    to: '/products/semillas',
    icon: 'mdi:leaf'
  },
  {
    name: 'Ropa y accesorios',
    description: 'Piezas de marca y complementos para el dia a dia.',
    to: '/products/ropa',
    icon: 'mdi:tshirt-crew-outline'
  }
]

const categoryCards = computed(() =>
  categoryMeta.map(item => {
    const seed = item.category
      ? availableSeeds.value.find(seed => seed.categoria === item.category && seed.producto.imagen_principal)
      : null

    return {
      ...item,
      image: directusAssetUrl(seed?.producto.imagen_principal),
      productName: seed?.producto.nombre
    }
  })
)

const benefits = [
  {
    icon: 'mdi:seed-outline',
    title: 'Catalogo curado',
    description: 'Semillas organizadas por categoria, dominancia y dificultad.'
  },
  {
    icon: 'mdi:package-variant-closed',
    title: 'Envio discreto',
    description: 'Preparacion cuidada y embalaje sobrio para cada pedido.'
  },
  {
    icon: 'mdi:shield-check-outline',
    title: 'Compra segura',
    description: 'Checkout protegido y datos tratados con cuidado.'
  },
  {
    icon: 'mdi:message-text-outline',
    title: 'Asesoria clara',
    description: 'Te ayudamos a elegir sin ruido ni promesas vacias.'
  }
]

const editorialNotes = [
  'Seleccion premium de geneticas de bancos reconocidos.',
  'Informacion directa sobre THC, CBD, floracion, sabor y dificultad.',
  'Navegacion canonica por semillas y ropa, sin rutas legacy visibles.'
]

const carouselSettings = {
  itemsToShow: 1.12,
  snapAlign: 'start' as const,
  wrapAround: false,
  breakpoints: {
    640: {
      itemsToShow: 2.1,
      snapAlign: 'start' as const
    },
    768: {
      itemsToShow: 3,
      snapAlign: 'start' as const
    },
    1024: {
      itemsToShow: 4,
      snapAlign: 'start' as const
    }
  }
}

const handleNewsletterSubmit = async () => {
  newsletterError.value = ''
  newsletterSuccess.value = false

  if (!newsletterEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
    newsletterError.value = 'Introduce un email valido'
    return
  }

  isSubmittingNewsletter.value = true

  try {
    await $fetch('/api/newsletter', {
      method: 'POST',
      body: {
        email: newsletterEmail.value
      }
    })

    newsletterSuccess.value = true
    newsletterEmail.value = ''

    setTimeout(() => {
      newsletterSuccess.value = false
    }, 5000)
  } catch (error: any) {
    newsletterError.value = error.data?.statusMessage || 'No hemos podido procesar la suscripcion'
  } finally {
    isSubmittingNewsletter.value = false
  }
}

const liftCard = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  animate(target, {
    y: -6,
    scale: 1.01,
    duration: 240,
    ease: 'outQuad'
  })
}

const settleCard = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  animate(target, {
    y: 0,
    scale: 1,
    duration: 260,
    ease: 'outQuad'
  })
}

const revealImage = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  const image = target.querySelector('[data-motion-image]')
  if (!image) return

  animate(image, {
    scale: 1.035,
    duration: 420,
    ease: 'outQuad'
  })
}

const settleImage = (event: MouseEvent) => {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement)) return

  const image = target.querySelector('[data-motion-image]')
  if (!image) return

  animate(image, {
    scale: 1,
    duration: 520,
    ease: 'outQuad'
  })
}

onMounted(() => {
  animate('.home-reveal', {
    opacity: [0, 1],
    y: [16, 0],
    duration: 420,
    delay: (_el: unknown, index: number) => index * 65,
    ease: 'outQuad'
  })
})
</script>

<template>
  <main class="overflow-hidden bg-[#fafbf7]">
    <section class="relative border-b border-[#dde6dc] bg-[#f6f8f1]">
      <div class="container-custom grid min-h-[calc(100vh-164px)] items-center gap-10 py-12 md:grid-cols-[1.02fr_0.98fr] md:py-16 lg:min-h-[680px]">
        <div class="home-reveal max-w-3xl opacity-0">
          <p class="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#d4dfd2] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#647067]">
            <Icon icon="mdi:sprout-outline" class="text-base text-secondary" />
            PREMIUM SEED STORE
          </p>
          <h1 class="max-w-4xl text-[2.55rem] font-extrabold leading-[0.98] tracking-normal text-[#111513] sm:text-5xl lg:text-7xl">
            Geneticas premium, compra simple y criterio experto.
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-7 text-[#4c574f] sm:text-lg">
            Washer Seeds ordena semillas y productos cannabicos en una experiencia mas limpia, directa y pensada para elegir rapido sin perder informacion tecnica.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <BaseButton
              variant="gradient"
              size="lg"
              icon="mdi:seed-outline"
              @click="$router.push('/products/semillas')"
            >
              Ver semillas
            </BaseButton>
            <BaseButton
              variant="outline"
              size="lg"
              icon="mdi:tshirt-crew-outline"
              @click="$router.push('/products/ropa')"
            >
              Ver ropa
            </BaseButton>
          </div>

          <dl class="mt-10 grid max-w-2xl grid-cols-3 border-y border-[#dde6dc]">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="py-4 pr-4 first:pl-0"
            >
              <dt class="text-2xl font-extrabold text-[#111513] md:text-3xl">{{ stat.value }}</dt>
              <dd class="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#647067]">{{ stat.label }}</dd>
            </div>
          </dl>
        </div>

        <div class="home-reveal opacity-0">
          <NuxtLink
            v-if="heroSeed"
            :to="`/products/semillas/${heroSeed.producto.slug}`"
            class="group block overflow-hidden rounded-lg border border-[#dde6dc] bg-white"
            @mouseenter="revealImage"
            @mouseleave="settleImage"
          >
            <div class="relative aspect-[4/5] bg-[#e8efe4]">
              <img
                v-if="heroImage"
                :src="heroImage"
                :alt="heroSeed.producto.nombre"
                class="h-full w-full object-cover will-change-transform"
                data-motion-image
              >
              <div v-else class="flex h-full w-full items-center justify-center text-[#647067]">
                <Icon icon="mdi:image-off-outline" class="text-5xl" />
              </div>
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 text-white">
                <p class="text-xs font-bold uppercase tracking-[0.14em] text-white/75">Producto destacado</p>
                <h2 class="mt-2 text-2xl font-extrabold">{{ heroSeed.producto.nombre }}</h2>
                <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span class="rounded-lg bg-white/16 px-3 py-1 font-semibold backdrop-blur">{{ heroSeed.categoria }}</span>
                  <span class="rounded-lg bg-white/16 px-3 py-1 font-semibold backdrop-blur">{{ heroSeed.dominancia }}</span>
                  <span class="rounded-lg bg-white px-3 py-1 font-extrabold text-[#111513]">Desde {{ formatSeedPrice(heroSeed) }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
          <div v-else class="flex aspect-[4/5] items-center justify-center rounded-lg border border-[#dde6dc] bg-white text-[#647067]">
            <Icon icon="mdi:loading" class="text-4xl text-main" />
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-[#dde6dc] bg-white">
      <div class="container-custom grid gap-px py-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="benefit in benefits"
          :key="benefit.title"
          class="home-reveal flex gap-4 px-0 py-5 opacity-0 sm:px-4"
          @mouseenter="liftCard"
          @mouseleave="settleCard"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#edf6ed] text-secondary">
            <Icon :icon="benefit.icon" class="text-2xl" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-[#111513]">{{ benefit.title }}</h2>
            <p class="mt-1 text-sm leading-6 text-[#647067]">{{ benefit.description }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="py-14 md:py-20">
      <div class="container-custom">
        <div class="home-reveal mb-8 flex flex-col justify-between gap-4 opacity-0 md:mb-10 md:flex-row md:items-end">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.14em] text-[#936037]">Comprar por categoria</p>
            <h2 class="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-[#111513] md:text-5xl">
              El catalogo empieza por lo que necesitas encontrar.
            </h2>
          </div>
          <BaseButton
            variant="outline"
            icon="mdi:arrow-right"
            icon-position="right"
            @click="$router.push('/products/semillas')"
          >
            Todo el catalogo
          </BaseButton>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="category in categoryCards"
            :key="category.name"
            :to="category.to"
            class="home-reveal group min-h-[320px] overflow-hidden rounded-lg border border-[#dde6dc] bg-white opacity-0"
            @mouseenter="(event) => { liftCard(event); revealImage(event) }"
            @mouseleave="(event) => { settleCard(event); settleImage(event) }"
          >
            <div class="relative h-48 overflow-hidden bg-[#edf3e8]">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.productName || category.name"
                class="h-full w-full object-cover will-change-transform"
                data-motion-image
              >
              <div v-else class="flex h-full w-full items-center justify-center text-[#936037]">
                <Icon :icon="category.icon" class="text-6xl" />
              </div>
            </div>
            <div class="p-5">
              <div class="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f6f0] text-[#111513]">
                <Icon :icon="category.icon" class="text-xl" />
              </div>
              <h3 class="text-xl font-extrabold text-[#111513]">{{ category.name }}</h3>
              <p class="mt-2 text-sm leading-6 text-[#647067]">{{ category.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-white py-14 md:py-20">
      <div class="container-custom">
        <div class="home-reveal mb-8 flex flex-col justify-between gap-4 opacity-0 md:flex-row md:items-end">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.14em] text-main">Seleccion destacada</p>
            <h2 class="mt-3 text-3xl font-extrabold text-[#111513] md:text-5xl">
              Productos para empezar por lo esencial.
            </h2>
          </div>
          <BaseButton
            variant="gradient"
            icon="mdi:arrow-right"
            icon-position="right"
            @click="$router.push('/products/semillas')"
          >
            Ver semillas
          </BaseButton>
        </div>

        <Carousel v-if="!pending && featuredSeeds.length > 0" v-bind="carouselSettings" class="home-carousel">
          <Slide v-for="semilla in featuredSeeds" :key="semilla.id">
            <div class="h-full px-2">
              <SeedCard :semilla="semilla" />
            </div>
          </Slide>

          <template #addons>
            <Navigation />
          </template>
        </Carousel>

        <div v-else-if="pending" class="flex items-center justify-center py-16">
          <Icon icon="mdi:loading" class="text-4xl text-main animate-spin" />
        </div>

        <div v-else class="rounded-lg border border-[#dde6dc] bg-[#fafbf7] p-10 text-center text-[#647067]">
          No hay productos disponibles en este momento.
        </div>
      </div>
    </section>

    <section class="border-y border-[#dde6dc] bg-[#111513] py-14 text-white md:py-20">
      <div class="container-custom grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div class="home-reveal opacity-0">
          <p class="text-sm font-bold uppercase tracking-[0.14em] text-secondary">Compra informada</p>
          <h2 class="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            Menos ruido visual, mas informacion util antes de comprar.
          </h2>
        </div>
        <div class="home-reveal grid gap-3 opacity-0">
          <div
            v-for="note in editorialNotes"
            :key="note"
            class="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
            @mouseenter="liftCard"
            @mouseleave="settleCard"
          >
            <Icon icon="mdi:check-circle-outline" class="mt-0.5 text-2xl text-secondary" />
            <p class="leading-7 text-white/78">{{ note }}</p>
          </div>
          <p class="mt-2 text-sm leading-6 text-white/55">
            Recuerda revisar la legislacion aplicable en tu lugar de residencia antes de comprar o usar cualquier producto.
          </p>
        </div>
      </div>
    </section>

    <section class="py-14 md:py-20">
      <div class="container-custom">
        <div class="home-reveal grid gap-8 rounded-lg border border-[#dde6dc] bg-white p-6 opacity-0 md:grid-cols-[0.85fr_1.15fr] md:p-8 lg:p-10">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.14em] text-[#936037]">Newsletter</p>
            <h2 class="mt-3 text-3xl font-extrabold leading-tight text-[#111513] md:text-4xl">
              Novedades y ofertas sin saturar tu bandeja.
            </h2>
            <p class="mt-4 text-sm leading-6 text-[#647067]">
              Recibe lanzamientos, reposiciones y seleccion editorial de productos.
            </p>
          </div>

          <div>
            <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="handleNewsletterSubmit">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="tu@email.com"
                required
                :disabled="isSubmittingNewsletter"
                class="min-h-12 flex-1 rounded-lg border border-[#cfdace] bg-[#fafbf7] px-4 text-[#111513] outline-none focus:border-main focus:ring-2 focus:ring-main/20 disabled:opacity-50"
              >
              <BaseButton
                variant="gradient"
                size="lg"
                type="submit"
                :disabled="isSubmittingNewsletter"
              >
                {{ isSubmittingNewsletter ? 'Enviando...' : 'Suscribirse' }}
              </BaseButton>
            </form>

            <Transition :css="false" @enter="fadeIn" @leave="fadeOut">
              <div v-if="newsletterSuccess" class="mt-4 rounded-lg border border-secondary/30 bg-secondary/10 p-4 text-sm font-semibold text-[#20622f]">
                Suscripcion completada. Te avisaremos cuando haya novedades.
              </div>
            </Transition>

            <Transition :css="false" @enter="fadeIn" @leave="fadeOut">
              <div v-if="newsletterError" class="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {{ newsletterError }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.home-carousel .carousel__viewport {
  overflow: visible;
}

.home-carousel .carousel__slide {
  align-items: stretch;
}

.home-carousel .carousel__prev,
.home-carousel .carousel__next {
  width: 44px;
  height: 44px;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  background: #ffffff;
  color: #111513;
  box-shadow: 0 8px 22px rgb(17 21 19 / 8%);
}

.home-carousel .carousel__prev:hover,
.home-carousel .carousel__next:hover {
  background: #111513;
  color: #ffffff;
}

.home-carousel .carousel__prev:disabled,
.home-carousel .carousel__next:disabled {
  opacity: 0.32;
  cursor: not-allowed;
}
</style>
