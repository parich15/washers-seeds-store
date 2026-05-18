const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env || {}
const directusUrl = env.NUXT_DIRECTUS_URL
  || env.NUXT_PUBLIC_DIRECTUS_URL
  || 'http://161.35.46.209:8055'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'reka-ui/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-directus'
  ],

  runtimeConfig: {
    directusUrl,
    public: {
      directus: {
        url: directusUrl
      }
    }
  },

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
  ],

  directus: {
    url: directusUrl
  }

})
