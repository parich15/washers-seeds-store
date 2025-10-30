<script setup lang="ts">
const lastUpdate = '15 de Enero de 2025'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Términos y Condiciones
        </h1>
        <p class="text-gray-600">
          Última actualización: {{ lastUpdate }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="container-custom py-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-md p-8 md:p-12 prose prose-lg max-w-none">
          <!-- Introduction -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
            <p class="text-gray-700 leading-relaxed">
              Bienvenido a Washer Seeds. Al acceder y utilizar este sitio web, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio web.
            </p>
          </section>

          <!-- Company Info -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Datos de la Empresa</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Washer Seeds es una marca registrada operada por:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Razón Social: Washer Seeds S.L.</li>
              <li>CIF: B-12345678</li>
              <li>Dirección: Calle Example, 123, 28001 Madrid, España</li>
              <li>Email: info@washerseeds.com</li>
              <li>Teléfono: 96 206 62 98</li>
            </ul>
          </section>

          <!-- Products -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Productos y Servicios</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Washer Seeds comercializa semillas de cannabis y productos relacionados exclusivamente para:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Coleccionismo</li>
              <li>Preservación genética</li>
              <li>Uso decorativo</li>
              <li>Fines educativos y de investigación</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mt-4">
              <strong class="text-red-600">Advertencia:</strong> La germinación de semillas de cannabis puede ser ilegal en tu país. El cliente es responsable de conocer y cumplir con la legislación vigente en su lugar de residencia.
            </p>
          </section>

          <!-- Orders -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Pedidos y Pagos</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Al realizar un pedido en nuestra tienda:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Confirmas tener al menos 18 años de edad</li>
              <li>Aceptas proporcionar información veraz y actualizada</li>
              <li>Te comprometes a pagar el precio indicado más los gastos de envío</li>
              <li>Entiendes que nos reservamos el derecho de rechazar pedidos</li>
            </ul>
          </section>

          <!-- Shipping -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Envíos</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Los envíos se realizan únicamente dentro de España. Todos los envíos son discretos y sin referencias al contenido.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Procesamiento: 24-48 horas laborables</li>
              <li>Envío gratuito en pedidos superiores a 30€</li>
              <li>No nos hacemos responsables de retrasos ocasionados por el servicio de mensajería</li>
            </ul>
          </section>

          <!-- Returns -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Devoluciones</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Aceptamos devoluciones dentro de los 14 días siguientes a la recepción del pedido, siempre que:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Los productos estén sin abrir y en su embalaje original</li>
              <li>Se notifique la intención de devolución</li>
              <li>Los gastos de envío de la devolución corren por cuenta del cliente</li>
            </ul>
          </section>

          <!-- Warranty -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Garantía</h2>
            <p class="text-gray-700 leading-relaxed">
              Garantizamos que todas nuestras semillas son frescas y de calidad. Sin embargo, no podemos garantizar tasas de germinación específicas ya que esto depende de múltiples factores controlados por el cliente.
            </p>
          </section>

          <!-- Intellectual Property -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
            <p class="text-gray-700 leading-relaxed">
              Todos los contenidos de este sitio web, incluyendo textos, imágenes, logos y diseños, son propiedad de Washer Seeds S.L. y están protegidos por las leyes de propiedad intelectual.
            </p>
          </section>

          <!-- Privacy -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Privacidad</h2>
            <p class="text-gray-700 leading-relaxed">
              Nos comprometemos a proteger tu privacidad. Para más información, consulta nuestra 
              <NuxtLink to="/privacy" class="text-main hover:underline">Política de Privacidad</NuxtLink>.
            </p>
          </section>

          <!-- Liability -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Limitación de Responsabilidad</h2>
            <p class="text-gray-700 leading-relaxed">
              Washer Seeds no se hace responsable del uso indebido de los productos adquiridos. Es responsabilidad del cliente conocer y cumplir con la legislación vigente en su país.
            </p>
          </section>

          <!-- Changes -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">11. Modificaciones</h2>
            <p class="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio web.
            </p>
          </section>

          <!-- Contact -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Para cualquier consulta sobre estos términos y condiciones, puedes contactarnos:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Email: legal@washerseeds.com</li>
              <li>Teléfono: 96 206 62 98</li>
              <li>
                Formulario: 
                <NuxtLink to="/contact" class="text-main hover:underline">Página de contacto</NuxtLink>
              </li>
            </ul>
          </section>
        </div>

        <!-- Back Button -->
        <div class="mt-8 text-center">
          <BaseButton
            variant="outline"
            icon="mdi:arrow-left"
            @click="$router.back()"
          >
            Volver
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
