<script setup lang="ts">
const lastUpdate = '15 de Enero de 2025'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="container-custom py-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Política de Privacidad
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
              <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Washer Seeds S.L. es el responsable del tratamiento de tus datos personales.
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>NIF: B-12345678</li>
                <li>Dirección: Calle Example, 123, 28001 Madrid</li>
                <li>Email: privacy@washerseeds.com</li>
                <li>Teléfono: 96 206 62 98</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Datos que Recopilamos</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Recopilamos y tratamos los siguientes datos personales:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Datos de identificación:</strong> nombre, apellidos, DNI</li>
                <li><strong>Datos de contacto:</strong> email, teléfono, dirección postal</li>
                <li><strong>Datos de navegación:</strong> cookies, dirección IP, datos del navegador</li>
                <li><strong>Datos de pago:</strong> información necesaria para procesar pagos (no almacenamos datos de tarjetas)</li>
                <li><strong>Historial de compras:</strong> productos adquiridos, preferencias</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Finalidad del Tratamiento</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Utilizamos tus datos para:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Gestionar tu cuenta de usuario</li>
                <li>Procesar tus pedidos y pagos</li>
                <li>Gestionar envíos y entregas</li>
                <li>Comunicaciones comerciales (con tu consentimiento)</li>
                <li>Atención al cliente</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Mejorar nuestros servicios</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                El tratamiento de tus datos se basa en:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Ejecución del contrato:</strong> para procesar tus pedidos</li>
                <li><strong>Consentimiento:</strong> para comunicaciones comerciales</li>
                <li><strong>Interés legítimo:</strong> para mejorar nuestros servicios</li>
                <li><strong>Obligación legal:</strong> para cumplir con la normativa fiscal y mercantil</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Conservación de Datos</h2>
              <p class="text-gray-700 leading-relaxed">
                Conservaremos tus datos personales durante el tiempo necesario para cumplir con las finalidades para las que fueron recogidos. Los datos relacionados con obligaciones fiscales se conservarán durante los plazos legalmente establecidos.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Destinatarios de los Datos</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Tus datos pueden ser comunicados a:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Empresas de transporte para realizar envíos</li>
                <li>Entidades bancarias para procesar pagos</li>
                <li>Administraciones públicas cuando exista obligación legal</li>
                <li>Proveedores de servicios tecnológicos</li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Tus Derechos</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Puedes ejercer los siguientes derechos:
              </p>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de tus datos</li>
                <li><strong>Oposición:</strong> oponerte al tratamiento</li>
                <li><strong>Limitación:</strong> limitar el tratamiento</li>
                <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              </ul>
              <p class="text-gray-700 leading-relaxed mt-4">
                Para ejercer tus derechos, escríbenos a privacy@washerseeds.com
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
              <p class="text-gray-700 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia de navegación. Para más información, consulta nuestra 
                <NuxtLink to="/cookies" class="text-main hover:underline">Política de Cookies</NuxtLink>.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Seguridad</h2>
              <p class="text-gray-700 leading-relaxed">
                Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Cambios en la Política</h2>
              <p class="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de modificar esta política de privacidad. Te notificaremos cualquier cambio significativo a través de nuestro sitio web o por email.
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
