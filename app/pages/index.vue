<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

// Obtener semillas desde Directus
const { fetchSemillas } = useSemillas()
const { semillas, pending } = await fetchSemillas()

// Productos destacados (primeras 10 semillas)
const featuredSeeds = computed(() => semillas.value?.slice(0, 10) || [])

// Newsletter
const newsletterEmail = ref('')
const newsletterError = ref('')
const newsletterSuccess = ref(false)
const isSubmittingNewsletter = ref(false)

const handleNewsletterSubmit = async () => {
  // Limpiar mensajes previos
  newsletterError.value = ''
  newsletterSuccess.value = false

  // Validación básica
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    newsletterError.value = 'Por favor, introduce un email válido'
    return
  }

  isSubmittingNewsletter.value = true

  try {
    const response = await $fetch('/api/newsletter', {
      method: 'POST',
      body: {
        email: newsletterEmail.value
      }
    })

    newsletterSuccess.value = true
    newsletterEmail.value = ''
    
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      newsletterSuccess.value = false
    }, 5000)
  } catch (error: any) {
    if (error.statusCode === 400) {
      newsletterError.value = 'Este email ya está suscrito a nuestro newsletter'
    } else {
      newsletterError.value = 'Hubo un error al procesar tu suscripción. Por favor, intenta de nuevo.'
    }
  } finally {
    isSubmittingNewsletter.value = false
  }
}

// Configuración del carousel
const carouselSettings = {
  itemsToShow: 1,
  snapAlign: 'center' as const,
  wrapAround: true,
  autoplay: 3000,
  breakpoints: {
    640: {
      itemsToShow: 2,
      snapAlign: 'start' as const,
    },
    768: {
      itemsToShow: 3,
      snapAlign: 'start' as const,
    },
    1024: {
      itemsToShow: 4,
      snapAlign: 'start' as const,
    },
    1280: {
      itemsToShow: 5,
      snapAlign: 'start' as const,
    },
  },
}

// Características de la tienda
const features = [
  {
    icon: 'mdi:truck-fast',
    title: 'Envío Gratis',
    description: 'En pedidos superiores a 30€'
  },
  {
    icon: 'mdi:shield-check',
    title: 'Pago Seguro',
    description: 'Múltiples métodos de pago'
  },
  {
    icon: 'mdi:package-variant',
    title: 'Embalaje Discreto',
    description: 'Tu privacidad es importante'
  },
  {
    icon: 'mdi:headset',
    title: 'Soporte 24/7',
    description: 'Estamos aquí para ayudarte'
  }
]

// Categorías destacadas
const featuredCategories = [
  {
    name: 'Semillas Feminizadas',
    slug: 'feminizadas',
    image: 'https://placehold.co/600x400/36A9E1/FFF?text=Semillas+Feminizadas',
    description: '100% hembras garantizadas'
  },
  {
    name: 'Autoflorecientes',
    slug: 'autoflorecientes',
    image: 'https://placehold.co/600x400/3AAA35/FFF?text=Autoflorecientes',
    description: 'Cultivo rápido y sencillo'
  },
  {
    name: 'CBD Premium',
    slug: 'cbd',
    image: 'https://placehold.co/600x400/936037/FFF?text=CBD+Premium',
    description: 'Alto contenido en CBD'
  },
  {
    name: 'Parafernalia',
    slug: 'parafernalia',
    image: 'https://placehold.co/600x400/36A9E1/FFF?text=Parafernalia',
    description: 'Accesorios de calidad'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section bg-gradient-main text-white">
      <div class="container-custom text-center py-16 md:py-24">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Bienvenido a Washer Seeds
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
          Tu tienda de confianza para semillas de calidad premium y productos cannábicos
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-in">
          <BaseButton
            variant="secondary"
            size="lg"
            icon="mdi:seedling"
            @click="$router.push('/categories/semillas')"
          >
            Ver Semillas
          </BaseButton>
          <BaseButton
            variant="outline"
            size="lg"
            icon="mdi:shopping"
            class="!text-white !border-white hover:!bg-white hover:!text-main"
            @click="$router.push('/categories/parafernalia')"
          >
            Ver Productos
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 rounded-full bg-gradient flex items-center justify-center mb-4">
              <Icon :icon="feature.icon" class="text-3xl text-white" />
            </div>
            <h3 class="font-bold text-lg mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Categorías Destacadas
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos premium
          </p>
        </div>

        <div class="grid-categories">
          <NuxtLink
            v-for="category in featuredCategories"
            :key="category.slug"
            :to="`/categories/${category.slug}`"
            class="category-card group"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover"
            >
            <div class="category-card-overlay" />
            <div class="category-card-content">
              <h3 class="text-2xl font-bold mb-2">{{ category.name }}</h3>
              <p class="text-sm opacity-90">{{ category.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="py-16 bg-gray-900 text-white">
      <div class="container-custom text-center">
        <Icon icon="mdi:leaf" class="text-6xl text-gradient mb-6 mx-auto" />
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿Necesitas Ayuda?
        </h2>
        <p class="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
          Nuestro equipo de expertos está disponible para asesorarte en tu cultivo
        </p>
        <BaseButton
          variant="gradient"
          size="lg"
          icon="mdi:phone"
          @click="$router.push('/contact')"
        >
          Contactar Ahora
        </BaseButton>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Productos Destacados
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Nuestra selección de semillas y productos más populares
          </p>
        </div>

        <Carousel v-if="!pending && featuredSeeds.length > 0" v-bind="carouselSettings">
          <Slide v-for="semilla in featuredSeeds" :key="semilla.id">
            <div class="px-2">
              <SeedCard :semilla="semilla" />
            </div>
          </Slide>

          <template #addons>
            <Navigation />
          </template>
        </Carousel>
        
        <!-- Loading state -->
        <div v-else-if="pending" class="flex justify-center items-center py-12">
          <Icon icon="mdi:loading" class="text-4xl text-main animate-spin" />
        </div>
        
        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600">No hay productos disponibles en este momento</p>
        </div>

        <div class="text-center mt-12">
          <BaseButton
            variant="outline"
            size="lg"
            icon="mdi:arrow-right"
            icon-position="right"
            @click="$router.push('/categories/semillas')"
          >
            Ver Todos los Productos
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 bg-gradient-main text-white">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            Suscríbete a Nuestro Newsletter
          </h2>
          <p class="text-lg mb-8 opacity-90">
            Recibe ofertas exclusivas, consejos de cultivo y las últimas novedades
          </p>
          <form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" @submit.prevent="handleNewsletterSubmit">
            <input
              v-model="newsletterEmail"
              type="email"
              placeholder="Tu email"
              required
              :disabled="isSubmittingNewsletter"
              class="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <BaseButton 
              variant="secondary" 
              size="lg" 
              type="submit"
              :disabled="isSubmittingNewsletter"
            >
              {{ isSubmittingNewsletter ? 'Enviando...' : 'Suscribirse' }}
            </BaseButton>
          </form>

          <!-- Success Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div v-if="newsletterSuccess" class="mt-4 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
              <Icon icon="mdi:check-circle" class="inline text-xl mr-2" />
              <span class="font-medium">¡Gracias por suscribirte! Pronto recibirás nuestras novedades.</span>
            </div>
          </Transition>

          <!-- Error Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div v-if="newsletterError" class="mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-lg">
              <Icon icon="mdi:alert-circle" class="inline text-xl mr-2" />
              <span class="font-medium">{{ newsletterError }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Estilos personalizados para vue3-carousel */
.carousel__prev,
.carousel__next {
  @apply text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity;
  background-image: linear-gradient(120deg, rgb(54, 169, 225), rgb(58, 170, 53));
}

.carousel__prev:disabled,
.carousel__next:disabled {
  @apply opacity-30 cursor-not-allowed;
}

.carousel__pagination {
  @apply mt-6;
}

.carousel__pagination-button {
  @apply w-3 h-3 rounded-full bg-gray-300 transition-colors;
}

.carousel__pagination-button:hover {
  background-color: rgb(54, 169, 225);
}

.carousel__pagination-button--active {
  @apply scale-125;
  background-image: linear-gradient(120deg, rgb(54, 169, 225), rgb(58, 170, 53));
}
</style>
