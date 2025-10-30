<script setup lang="ts">
const lastUpdate = '15 de Enero de 2025'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Política de Cookies
        </h1>
        <p class="text-gray-600">
          Última actualización: {{ lastUpdate }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="container-custom py-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-md p-8 md:p-12">
          <div class="space-y-8">
            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Qué son las cookies?</h2>
              <p class="text-gray-700 leading-relaxed">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para hacer que los sitios web funcionen de manera más eficiente y para proporcionar información a los propietarios del sitio.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Cookies que Utilizamos</h2>
              
              <!-- Cookies Técnicas -->
              <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Cookies Técnicas (Necesarias)</h3>
                <p class="text-gray-700 mb-3">
                  Estas cookies son esenciales para el funcionamiento del sitio web y no pueden desactivarse.
                </p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-2 text-gray-700">
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">cart_session:</span>
                      <span>Mantiene tu carrito de compras activo durante la navegación</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">auth_token:</span>
                      <span>Gestiona tu sesión de usuario autenticado</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">cookie_consent:</span>
                      <span>Recuerda tus preferencias sobre cookies</span>
                    </li>
                  </ul>
                  <p class="text-sm text-gray-600 mt-3">
                    <strong>Duración:</strong> Sesión o hasta 1 año según el caso
                  </p>
                </div>
              </div>

              <!-- Cookies Analíticas -->
              <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Cookies Analíticas</h3>
                <p class="text-gray-700 mb-3">
                  Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                </p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-2 text-gray-700">
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">_ga:</span>
                      <span>Google Analytics - Distingue usuarios</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">_gid:</span>
                      <span>Google Analytics - Distingue usuarios</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">_gat:</span>
                      <span>Google Analytics - Limita el porcentaje de solicitudes</span>
                    </li>
                  </ul>
                  <p class="text-sm text-gray-600 mt-3">
                    <strong>Duración:</strong> 2 años
                  </p>
                </div>
              </div>

              <!-- Cookies de Marketing -->
              <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Cookies de Marketing (Opcional)</h3>
                <p class="text-gray-700 mb-3">
                  Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas.
                </p>
                <div class="bg-gray-50 rounded-lg p-4">
                  <ul class="space-y-2 text-gray-700">
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">_fbp:</span>
                      <span>Facebook Pixel - Rastreo de conversiones</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="font-semibold min-w-[120px]">ads_tracking:</span>
                      <span>Seguimiento de campañas publicitarias</span>
                    </li>
                  </ul>
                  <p class="text-sm text-gray-600 mt-3">
                    <strong>Duración:</strong> 3 meses
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Gestionar tus Preferencias</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Puedes gestionar tus preferencias de cookies en cualquier momento. Ten en cuenta que desactivar algunas cookies puede afectar la funcionalidad del sitio.
              </p>
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="font-bold mb-4">Configuración de Cookies</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Cookies Técnicas</p>
                      <p class="text-sm text-gray-600">Necesarias para el funcionamiento</p>
                    </div>
                    <div class="px-3 py-1 bg-gray-300 rounded text-sm">
                      Siempre activas
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Cookies Analíticas</p>
                      <p class="text-sm text-gray-600">Ayudan a mejorar el sitio</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-main"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Cookies de Marketing</p>
                      <p class="text-sm text-gray-600">Anuncios personalizados</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-main"></div>
                    </label>
                  </div>
                </div>
                <div class="mt-6">
                  <BaseButton variant="gradient" size="sm" full-width>
                    Guardar Preferencias
                  </BaseButton>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Cookies de Terceros</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Utilizamos servicios de terceros que pueden establecer sus propias cookies:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> Para análisis de tráfico web</li>
                <li><strong>Facebook Pixel:</strong> Para remarketing y seguimiento de conversiones</li>
                <li><strong>Stripe/PayPal:</strong> Para procesar pagos de forma segura</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Cómo Desactivar las Cookies</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Puedes configurar tu navegador para rechazar cookies:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Chrome:</strong> Configuración > Privacidad y seguridad > Cookies</li>
                <li><strong>Firefox:</strong> Opciones > Privacidad y seguridad > Cookies</li>
                <li><strong>Safari:</strong> Preferencias > Privacidad > Cookies</li>
                <li><strong>Edge:</strong> Configuración > Cookies y permisos del sitio</li>
              </ul>
              <p class="text-gray-700 leading-relaxed mt-4">
                Ten en cuenta que desactivar las cookies puede limitar la funcionalidad del sitio web.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Más Información</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Para más información sobre cómo tratamos tus datos personales, consulta nuestra 
                <NuxtLink to="/privacy" class="text-main hover:underline">Política de Privacidad</NuxtLink>.
              </p>
              <p class="text-gray-700 leading-relaxed">
                Si tienes preguntas sobre nuestra política de cookies, contáctanos en cookies@washerseeds.com
              </p>
            </section>
          </div>
        </div>

        <div class="mt-8 text-center">
          <BaseButton variant="outline" icon="mdi:arrow-left" @click="$router.back()">
            Volver
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
