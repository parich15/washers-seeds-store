// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'reka-ui',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-directus'
  ],

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/main.css',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ]

})
