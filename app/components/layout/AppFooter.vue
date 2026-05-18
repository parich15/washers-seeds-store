<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()

// Obtener ajustes web desde Directus
const { fetchAjustesWeb, getAssetUrl, formatPhoneHref, formatEmailHref, getValidSocialLinks } = useAjustesWeb()
const { ajustes, pending } = await fetchAjustesWeb()

// Obtener menús desde Directus
const { fetchMenus, getFooterMenu } = useMenus()
const { menus } = await fetchMenus()

// Computed para obtener el menú del footer
const footerMenu = computed(() => getFooterMenu(menus.value || []))

// Computed para redes sociales válidas
const validSocialLinks = computed(() => getValidSocialLinks(ajustes.value!))

// Newsletter
const newsletterEmail = ref('')
const newsletterError = ref('')
const newsletterSuccess = ref(false)
const isSubmittingNewsletter = ref(false)

const handleNewsletterSubmit = async () => {
  newsletterError.value = ''
  newsletterSuccess.value = false
  
  // Validar email
  if (!newsletterEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)) {
    newsletterError.value = 'Por favor ingresa un email válido'
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
    newsletterError.value = error.data?.statusMessage || 'Error al suscribirse. Inténtalo de nuevo.'
  } finally {
    isSubmittingNewsletter.value = false
  }
}

const footerLinksLegal = [
  { name: 'Aviso Legal', to: '/legal' },
  { name: 'Política de Privacidad', to: '/privacy' },
  { name: 'Política de Cookies', to: '/cookies' },
  { name: 'Términos y Condiciones', to: '/terms' }
]

const paymentMethods = [
  { icon: 'mdi:credit-card', name: 'Tarjeta' },
  { icon: 'mdi:paypal', name: 'PayPal' },
  { icon: 'mdi:bank-transfer', name: 'Transferencia' }
]
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 mt-auto">
    <!-- Main footer content -->
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- About section -->
        <div>
          <div class="mb-4">
            <img 
              v-if="ajustes?.logo_footer"
              :src="getAssetUrl(ajustes.logo_footer)" 
              alt="Washer Seeds"
              class="h-12 w-auto object-contain"
            />
            <h3 v-else class="text-xl font-bold text-gradient">
              Washer Seeds
            </h3>
          </div>
          <p class="text-sm mb-4">
            Tu tienda de confianza para semillas de calidad y productos cannábicos. 
            Más de 10 años de experiencia en el sector.
          </p>
          
          <!-- Teléfonos -->
          <div v-if="ajustes?.telefono_1" class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:phone" class="text-xl text-main" />
            <a :href="formatPhoneHref(ajustes.telefono_1)" class="hover:text-white transition-colors">
              {{ ajustes.telefono_1 }}
            </a>
          </div>
          <div v-if="ajustes?.telefono_2" class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:phone" class="text-xl text-main" />
            <a :href="formatPhoneHref(ajustes.telefono_2)" class="hover:text-white transition-colors">
              {{ ajustes.telefono_2 }}
            </a>
          </div>
          
          <!-- Email -->
          <div v-if="ajustes?.email" class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:email" class="text-xl text-main" />
            <a :href="formatEmailHref(ajustes.email)" class="hover:text-white transition-colors">
              {{ ajustes.email }}
            </a>
          </div>
          
          <!-- Dirección -->
          <div v-if="ajustes?.direccion_1" class="flex items-start gap-2 mt-4">
            <Icon icon="mdi:map-marker" class="text-xl text-main mt-0.5 flex-shrink-0" />
            <div class="text-sm">
              <p>{{ ajustes.direccion_1 }}</p>
              <p v-if="ajustes.direccion_2">{{ ajustes.direccion_2 }}</p>
            </div>
          </div>
        </div>

        <!-- Dynamic Footer Menu Sections -->
        <div v-for="section in footerMenu?.menu" :key="section.texto">
          <h4 class="font-footer-display text-2xl text-white mb-4">
            {{ section.texto }}
          </h4>
          <ul v-if="section.hijos && section.hijos.length > 0" class="space-y-2">
            <li v-for="link in section.hijos" :key="link.texto">
              <NuxtLink
                :to="normalizeCmsPath(link.pagina)"
                class="text-sm hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="mdi:chevron-right" class="text-xs" />
                {{ link.texto }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-lg font-bold text-white mb-4">
            Newsletter
          </h4>
          <p class="text-sm mb-4">
            Suscríbete para recibir ofertas exclusivas y novedades
          </p>
          
          <!-- Success Message -->
          <div v-if="newsletterSuccess" class="mb-3 p-3 bg-green-500/20 border border-green-500 rounded-lg text-sm text-green-400">
            ¡Suscripción exitosa!
          </div>
          
          <!-- Error Message -->
          <div v-if="newsletterError" class="mb-3 p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-red-400">
            {{ newsletterError }}
          </div>
          
          <form class="space-y-2" @submit.prevent="handleNewsletterSubmit">
            <input
              v-model="newsletterEmail"
              type="email"
              placeholder="Tu email"
              :disabled="isSubmittingNewsletter"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all text-white placeholder-gray-500 disabled:opacity-50"
            >
            <BaseButton 
              variant="gradient" 
              size="sm" 
              full-width
              type="submit"
              :disabled="isSubmittingNewsletter"
            >
              {{ isSubmittingNewsletter ? 'Enviando...' : 'Suscribirse' }}
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 my-8" />

      <!-- Social links & payments -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Social media -->
        <div v-if="validSocialLinks.length > 0">
          <p class="text-sm mb-3 text-center md:text-left">
            Síguenos en redes sociales
          </p>
          <div class="flex items-center justify-center md:justify-start gap-3">
            <a
              v-for="social in validSocialLinks"
              :key="social.name"
              :href="social.url"
              :title="social.name"
              class="p-2 rounded-lg bg-gray-800 hover:bg-gradient transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon :icon="social.icon" class="text-2xl" />
            </a>
          </div>
        </div>

        <!-- Payment methods -->
        <div>
          <p class="text-sm mb-3 text-center md:text-right">
            Métodos de pago
          </p>
          <div class="flex items-center justify-center md:justify-end gap-4">
            <div
              v-for="payment in paymentMethods"
              :key="payment.name"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800"
            >
              <Icon :icon="payment.icon" class="text-2xl" />
              <span class="text-xs">{{ payment.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-gray-950 border-t border-gray-800">
      <div class="container-custom py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <p class="text-sm text-gray-500 text-center md:text-left">
            © {{ currentYear }} Washer Seeds. Todos los derechos reservados.
          </p>

          <!-- Legal links -->
          <div class="flex flex-wrap items-center justify-center gap-4">
            <NuxtLink
              v-for="link in footerLinksLegal"
              :key="link.to"
              :to="link.to"
              class="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
