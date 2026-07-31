// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/cat-tongue.png' }
      ]
    }
  },

  modules: [
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@tresjs/nuxt',
  ],

  colorMode: {
    preference: "system",
    fallback: "white",
    classSuffix: ''
  },

  nitro: {
    preset: "cloudflare-module"
  }
})