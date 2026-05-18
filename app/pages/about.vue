<script setup lang="ts">
import { Icon } from '@iconify/vue'

const stats = [
  { number: '10+', label: 'Años de Experiencia' },
  { number: '5000+', label: 'Clientes Satisfechos' },
  { number: '200+', label: 'Variedades Disponibles' },
  { number: '100%', label: 'Calidad Garantizada' }
]

const values = [
  {
    icon: 'mdi:leaf',
    title: 'Calidad Premium',
    description: 'Seleccionamos únicamente las mejores genéticas de bancos reconocidos mundialmente.'
  },
  {
    icon: 'mdi:shield-check',
    title: 'Compra Segura',
    description: 'Tu privacidad y seguridad son nuestra prioridad. Envíos discretos y pagos seguros.'
  },
  {
    icon: 'mdi:hand-heart',
    title: 'Atención Personalizada',
    description: 'Nuestro equipo de expertos está disponible para ayudarte en tu cultivo.'
  },
  {
    icon: 'mdi:truck-fast',
    title: 'Envío Rápido',
    description: 'Envíos en 24-48h con embalaje discreto y tracking incluido.'
  }
]

const team = [
  {
    name: 'Carlos Mendoza',
    role: 'Fundador & CEO',
    image: 'https://placehold.co/300x300/36A9E1/FFF?text=CM',
    description: 'Cultivador con más de 15 años de experiencia'
  },
  {
    name: 'Laura García',
    role: 'Directora Comercial',
    image: 'https://placehold.co/300x300/3AAA35/FFF?text=LG',
    description: 'Especialista en genética cannabica'
  },
  {
    name: 'Miguel Ruiz',
    role: 'Responsable Técnico',
    image: 'https://placehold.co/300x300/936037/FFF?text=MR',
    description: 'Experto en cultivo y nutrición'
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
            Sobre Washer Seeds
          </h1>
          <p class="text-xl md:text-2xl opacity-90">
            Tu tienda de confianza para semillas de cannabis y productos cannábicos desde 2015
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <p class="text-4xl md:text-5xl font-bold text-gradient mb-2">
              {{ stat.number }}
            </p>
            <p class="text-gray-600">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-16">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-6">
              Nuestra Historia
            </h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Washer Seeds nació en 2015 de la pasión de un grupo de cultivadores 
                que buscaban ofrecer semillas de la más alta calidad al mercado español.
              </p>
              <p>
                Comenzamos como una pequeña tienda local y, gracias a la confianza de 
                nuestros clientes, hemos crecido hasta convertirnos en una de las tiendas 
                online de referencia en España.
              </p>
              <p>
                Trabajamos directamente con los mejores bancos de semillas del mundo, 
                garantizando la autenticidad y calidad de cada producto que vendemos.
              </p>
              <p>
                Hoy, más de 10 años después, seguimos comprometidos con nuestra misión: 
                proporcionar productos de calidad, asesoramiento experto y un servicio 
                excepcional a todos nuestros clientes.
              </p>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://placehold.co/600x600/36A9E1/FFF?text=Washer+Seeds+Store"
                alt="Washer Seeds Store"
                class="w-full h-full object-cover"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Nuestros Valores
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Principios que guían nuestro trabajo día a día
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="value in values"
            :key="value.title"
            class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 bg-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon :icon="value.icon" class="text-3xl text-white" />
            </div>
            <h3 class="text-xl font-bold mb-3">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-16">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Nuestro Equipo
          </h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Expertos apasionados por el cannabis
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="member in team"
            :key="member.name"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              :src="member.image"
              :alt="member.name"
              class="w-full aspect-square object-cover"
            >
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold mb-1">{{ member.name }}</h3>
              <p class="text-main font-medium mb-2">{{ member.role }}</p>
              <p class="text-gray-600 text-sm">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          ¿Listo para empezar tu cultivo?
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Descubre nuestra selección de semillas premium
        </p>
        <BaseButton
          variant="secondary"
          size="lg"
          icon="mdi:shopping"
          @click="$router.push('/products/semillas')"
        >
          Ver Catálogo
        </BaseButton>
      </div>
    </section>
  </div>
</template>
