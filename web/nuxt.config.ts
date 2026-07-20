// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nitro-cloudflare-dev",
    '@nuxt/ui'
  ],

  nitro: {
    preset: "cloudflare-module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  ssr: true,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': {
      prerender: true,
    },
    '/**' : {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  },

  compatibilityDate: '2026-06-30'
})
