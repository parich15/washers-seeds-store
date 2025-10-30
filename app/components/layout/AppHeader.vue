<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const cartItemsCount = ref(0) // Temporalmente hardcodeado, lo conectaremos con Pinia luego
const isAuthenticated = ref(false) // Temporalmente hardcodeado

const categories = [
  {
    name: 'Semillas',
    slug: 'semillas',
    children: [
      { name: 'Feminizadas', slug: 'feminizadas' },
      { name: 'Autoflorecientes', slug: 'autoflorecientes' },
      { name: 'CBD', slug: 'cbd' },
      { name: 'Regulares', slug: 'regulares' }
    ]
  },
  {
    name: 'Parafernalia',
    slug: 'parafernalia',
    children: [
      { name: 'Grinders', slug: 'grinders' },
      { name: 'Papel de Liar', slug: 'papel' },
      { name: 'Bongs', slug: 'bongs' },
      { name: 'Pipas', slug: 'pipas' }
    ]
  },
  { name: 'Ofertas', slug: 'ofertas' },
  { name: 'Novedades', slug: 'novedades' }
]

const toggleMobileMenu = () => {
  console.log("test");
  
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-md">
    <!-- Top bar -->
    <div class="bg-gradient border-b border-gray-200">
      <div class="container-custom">
        <div class="flex items-center justify-between py-2 text-sm text-white">
          <div class="flex items-center gap-4">
            <a href="tel:+34962066298" class="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Icon icon="mdi:phone" class="text-lg" />
              <span class="hidden sm:inline">96 206 62 98</span>
            </a>
            <span class="md:inline animate-pulse">Work in progress</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="mdi:shield-check" class="text-lg" />
            <span class="hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main header -->
    <div class="container-custom">
      <div class="flex items-center justify-between py-4 gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0">
          <h1 class="text-2xl md:text-3xl font-bold text-gradient">
            Washer Seeds
          </h1>
        </NuxtLink>

        <!-- Search bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-2xl mx-8">
          <form @submit.prevent="handleSearch" class="w-full relative">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Buscar productos..."
              class="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
            >
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon icon="mdi:magnify" class="text-2xl text-gray-600" />
            </button>
          </form>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Search (Mobile) -->
          <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Icon icon="mdi:magnify" class="text-2xl text-gray-700" />
          </button>

          <!-- User -->
          <NuxtLink
            :to="isAuthenticated ? '/user/profile' : '/auth/login'"
            class="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon icon="mdi:account-circle" class="text-2xl text-gray-700" />
            <span class="hidden lg:inline text-sm font-medium text-gray-700">
              {{ isAuthenticated ? 'Mi Cuenta' : 'Iniciar Sesión' }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon icon="mdi:cart" class="text-2xl text-gray-700" />
            <span
              v-if="cartItemsCount > 0"
              class="absolute -top-1 -right-1 bg-gradient text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartItemsCount > 9 ? '9+' : cartItemsCount }}
            </span>
          </NuxtLink>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            @click="toggleMobileMenu"
          >
            <Icon :icon="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl text-gray-700" />
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation (Desktop) -->
    <nav class="hidden md:block border-t border-gray-200 bg-gray-50">
      <div class="container-custom">
        <ul class="flex items-center justify-center gap-8 py-3">
          <li v-for="category in categories" :key="category.slug" class="relative group">
            <NuxtLink
              :to="`/categories/${category.slug}`"
              class="nav-link flex items-center gap-1 py-2"
            >
              {{ category.name }}
              <Icon v-if="category.children" icon="mdi:chevron-down" class="text-lg transition-transform group-hover:rotate-180" />
            </NuxtLink>

            <!-- Dropdown -->
            <div
              v-if="category.children"
              class="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <ul class="py-2">
                <li v-for="child in category.children" :key="child.slug">
                  <NuxtLink
                    :to="`/categories/${category.slug}/${child.slug}`"
                    class="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    {{ child.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
        <div class="container-custom py-4">
          <!-- Mobile search -->
          <form @submit.prevent="handleSearch" class="mb-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Buscar productos..."
                class="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20 outline-none"
              >
              <button
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 p-2"
              >
                <Icon icon="mdi:magnify" class="text-2xl text-gray-600" />
              </button>
            </div>
          </form>

          <!-- Mobile navigation -->
          <nav>
            <ul class="space-y-2">
              <li v-for="category in categories" :key="category.slug">
                <NuxtLink
                  :to="`/categories/${category.slug}`"
                  class="block py-3 px-4 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  @click="mobileMenuOpen = false"
                >
                  {{ category.name }}
                </NuxtLink>
                <ul v-if="category.children" class="ml-4 mt-2 space-y-1">
                  <li v-for="child in category.children" :key="child.slug">
                    <NuxtLink
                      :to="`/categories/${category.slug}/${child.slug}`"
                      class="block py-2 px-4 rounded-lg hover:bg-gray-100 text-sm transition-colors"
                      @click="mobileMenuOpen = false"
                    >
                      {{ child.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          <div class="divider" />

          <!-- Mobile user actions -->
          <div class="space-y-2">
            <NuxtLink
              :to="isAuthenticated ? '/user/profile' : '/auth/login'"
              class="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              @click="mobileMenuOpen = false"
            >
              <Icon icon="mdi:account-circle" class="text-2xl" />
              <span class="font-medium">{{ isAuthenticated ? 'Mi Cuenta' : 'Iniciar Sesión' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
