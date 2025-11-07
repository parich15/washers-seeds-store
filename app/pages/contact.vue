<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

// Obtener ajustes web desde Directus
const { fetchAjustesWeb, formatPhoneHref, formatEmailHref, getValidSocialLinks } = useAjustesWeb()
const { ajustes, pending } = await fetchAjustesWeb()

// Computed para redes sociales válidas
const validSocialLinks = computed(() => getValidSocialLinks(ajustes.value!))

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const validate = () => {
  errors.value = {}
  
  if (!formData.value.name) errors.value.name = 'El nombre es obligatorio'
  if (!formData.value.email) errors.value.email = 'El email es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email no válido'
  }
  if (!formData.value.subject) errors.value.subject = 'El asunto es obligatorio'
  if (!formData.value.message) errors.value.message = 'El mensaje es obligatorio'
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  
  isSubmitting.value = true
  errors.value = {}
  
  try {
    // Enviar a la API
    await $fetch('/api/contacto', {
      method: 'POST',
      body: {
        nombre: formData.value.name,
        email: formData.value.email,
        telefono: formData.value.phone,
        asunto: formData.value.subject,
        mensaje: formData.value.message
      }
    })
    
    submitSuccess.value = true
    
    // Limpiar formulario
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error: any) {
    errors.value.general = error.data?.statusMessage || 'Error al enviar el mensaje. Inténtalo de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}

// Computed para información de contacto dinámica
const contactInfo = computed(() => {
  const info = []
  
  // Dirección
  if (ajustes.value?.direccion_1) {
    info.push({
      icon: 'mdi:map-marker',
      title: 'Dirección',
      value: ajustes.value.direccion_1,
      subvalue: ajustes.value.direccion_2 || '',
      href: null
    })
  }
  
  // Teléfono 1
  if (ajustes.value?.telefono_1) {
    info.push({
      icon: 'mdi:phone',
      title: 'Teléfono',
      value: ajustes.value.telefono_1,
      subvalue: ajustes.value.telefono_2 || 'L-V: 9:00 - 19:00h',
      href: formatPhoneHref(ajustes.value.telefono_1)
    })
  }
  
  // Email
  if (ajustes.value?.email) {
    info.push({
      icon: 'mdi:email',
      title: 'Email',
      value: ajustes.value.email,
      subvalue: 'Respuesta en 24h',
      href: formatEmailHref(ajustes.value.email)
    })
  }
  
  // Horario (estático por ahora)
  info.push({
    icon: 'mdi:clock',
    title: 'Horario',
    value: 'Lun - Vie: 9:00 - 19:00',
    subvalue: 'Sáb: 10:00 - 14:00',
    href: null
  })
  
  return info
})

const faqs = [
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'Los envíos se procesan en 24-48h laborables. El tiempo de entrega depende de tu ubicación.'
  },
  {
    question: '¿Los envíos son discretos?',
    answer: 'Sí, todos nuestros envíos son completamente discretos sin ninguna referencia a nuestro contenido.'
  },
  {
    question: '¿Puedo recoger mi pedido?',
    answer: 'Actualmente solo realizamos envíos. No disponemos de punto de recogida físico.'
  },
  {
    question: '¿Aceptáis devoluciones?',
    answer: 'Sí, aceptamos devoluciones en los primeros 14 días siguiendo nuestra política de devoluciones.'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient text-white">
      <div class="container-custom py-16 md:py-24">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Contacta con Nosotros
          </h1>
          <p class="text-xl md:text-2xl opacity-90">
            Estamos aquí para ayudarte. No dudes en consultarnos cualquier duda
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 class="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>

              <!-- Success Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
              >
                <div v-if="submitSuccess" class="mb-6 p-4 bg-secondary/10 border border-secondary rounded-lg flex items-center gap-3">
                  <Icon icon="mdi:check-circle" class="text-secondary text-2xl" />
                  <span class="text-secondary font-medium">¡Mensaje enviado correctamente! Te responderemos pronto.</span>
                </div>
              </Transition>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Name & Email -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <BaseInput
                      v-model="formData.name"
                      placeholder="Tu nombre"
                      :error="errors.name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <BaseInput
                      v-model="formData.email"
                      type="email"
                      placeholder="tu@email.com"
                      :error="errors.email"
                    />
                  </div>
                </div>

                <!-- Phone & Subject -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono (opcional)
                    </label>
                    <BaseInput
                      v-model="formData.phone"
                      type="tel"
                      placeholder="600 123 456"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Asunto *
                    </label>
                    <select
                      v-model="formData.subject"
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
                      :class="errors.subject ? 'border-red-500' : ''"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="info">Información General</option>
                      <option value="pedido">Consulta sobre Pedido</option>
                      <option value="producto">Consulta sobre Producto</option>
                      <option value="envio">Envíos</option>
                      <option value="devolucion">Devoluciones</option>
                      <option value="otro">Otro</option>
                    </select>
                    <p v-if="errors.subject" class="text-red-500 text-sm mt-1">
                      {{ errors.subject }}
                    </p>
                  </div>
                </div>

                <!-- Message -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    v-model="formData.message"
                    rows="6"
                    placeholder="Escribe tu mensaje aquí..."
                    class="w-full px-4 py-3 rounded-lg border focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all resize-none"
                    :class="errors.message ? 'border-red-500' : 'border-gray-300'"
                  />
                  <p v-if="errors.message" class="text-red-500 text-sm mt-1">
                    {{ errors.message }}
                  </p>
                </div>

                <!-- Error Message -->
                <div v-if="errors.general" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-600 flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" class="text-lg" />
                    {{ errors.general }}
                  </p>
                </div>

                <!-- Submit Button -->
                <BaseButton
                  variant="gradient"
                  size="lg"
                  type="submit"
                  :disabled="isSubmitting"
                  full-width
                  icon="mdi:send"
                >
                  {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
                </BaseButton>
              </form>
            </div>
          </div>

          <!-- Contact Info Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Contact Cards -->
            <div
              v-for="info in contactInfo"
              :key="info.title"
              class="bg-white rounded-xl shadow-md p-6"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon :icon="info.icon" class="text-2xl text-white" />
                </div>
                <div>
                  <h3 class="font-bold mb-1">{{ info.title }}</h3>
                  <p class="text-gray-700">{{ info.value }}</p>
                  <p class="text-sm text-gray-500">{{ info.subvalue }}</p>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div v-if="validSocialLinks.length > 0" class="bg-white rounded-xl shadow-md p-6">
              <h3 class="font-bold mb-4">Síguenos</h3>
              <div class="flex gap-3 flex-wrap">
                <a
                  v-for="social in validSocialLinks"
                  :key="social.name"
                  :href="social.url"
                  :title="social.name"
                  class="w-10 h-10 bg-gray-100 hover:bg-gradient rounded-lg flex items-center justify-center transition-all hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon :icon="social.icon" class="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Preguntas Frecuentes
            </h2>
            <p class="text-gray-600 text-lg">
              Encuentra respuestas rápidas a las preguntas más comunes
            </p>
          </div>

          <div class="space-y-4">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="bg-gray-50 rounded-xl p-6"
            >
              <h3 class="font-bold text-lg mb-2 flex items-start gap-2">
                <Icon icon="mdi:help-circle" class="text-main text-xl mt-0.5 flex-shrink-0" />
                {{ faq.question }}
              </h3>
              <p class="text-gray-700 pl-7">
                {{ faq.answer }}
              </p>
            </div>
          </div>

          <div class="text-center mt-8">
            <p class="text-gray-600 mb-4">
              ¿No encuentras lo que buscas?
            </p>
            <NuxtLink to="/faq" class="text-main font-medium hover:underline">
              Ver todas las preguntas frecuentes →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
