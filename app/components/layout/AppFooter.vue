<script setup lang="ts">
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()

const footerLinks = {
  company: [
    { name: 'Sobre Nosotros', to: '/about' },
    { name: 'Contacto', to: '/contact' },
    { name: 'Blog', to: '/blog' }
  ],
  legal: [
    { name: 'Aviso Legal', to: '/legal' },
    { name: 'Política de Privacidad', to: '/privacy' },
    { name: 'Política de Cookies', to: '/cookies' },
    { name: 'Términos y Condiciones', to: '/terms' }
  ],
  help: [
    { name: 'Preguntas Frecuentes', to: '/faq' },
    { name: 'Envíos y Devoluciones', to: '/shipping' },
    { name: 'Métodos de Pago', to: '/payment' },
    { name: 'Garantía', to: '/warranty' }
  ]
}

const socialLinks = [
  { icon: 'mdi:facebook', url: '#', name: 'Facebook' },
  { icon: 'mdi:instagram', url: '#', name: 'Instagram' },
  { icon: 'mdi:twitter', url: '#', name: 'Twitter' },
  { icon: 'mdi:youtube', url: '#', name: 'YouTube' }
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
          <h3 class="text-xl font-bold text-gradient mb-4">
            Washer Seeds
          </h3>
          <p class="text-sm mb-4">
            Tu tienda de confianza para semillas de calidad y productos cannábicos. 
            Más de 10 años de experiencia en el sector.
          </p>
          <div class="flex items-center gap-2 mb-2">
            <Icon icon="mdi:phone" class="text-xl text-main" />
            <a href="tel:+34962066298" class="hover:text-white transition-colors">
              96 206 62 98
            </a>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="mdi:email" class="text-xl text-main" />
            <a href="mailto:info@washerseeds.com" class="hover:text-white transition-colors">
              info@washerseeds.com
            </a>
          </div>
        </div>

        <!-- Company links -->
        <div>
          <h4 class="text-lg font-bold text-white mb-4">
            Empresa
          </h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.company" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="mdi:chevron-right" class="text-xs" />
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Help links -->
        <div>
          <h4 class="text-lg font-bold text-white mb-4">
            Ayuda
          </h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.help" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon icon="mdi:chevron-right" class="text-xs" />
                {{ link.name }}
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
          <form class="space-y-2" @submit.prevent>
            <input
              type="email"
              placeholder="Tu email"
              class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all text-white placeholder-gray-500"
            >
            <BaseButton variant="gradient" size="sm" full-width>
              Suscribirse
            </BaseButton>
          </form>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 my-8" />

      <!-- Social links & payments -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Social media -->
        <div>
          <p class="text-sm mb-3 text-center md:text-left">
            Síguenos en redes sociales
          </p>
          <div class="flex items-center justify-center md:justify-start gap-3">
            <a
              v-for="social in socialLinks"
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
              v-for="link in footerLinks.legal"
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
