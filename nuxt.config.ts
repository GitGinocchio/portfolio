// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg', href: '/cat-tongue.svg' }
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
    '@nuxtjs/sitemap'
  ],

  site: {
    url: 'https://giuliotognetto.dev',
    name: 'Portfolio of Giulio Tognetto',
  },

  sitemap: {
    sitemapName: 'sitemap.xml',
    enabled: true
  },

  colorMode: {
    preference: "system",
    fallback: "white",
    classSuffix: ''
  },

  nitro: {
    preset: "cloudflare-module",
    imports: {
      dirs: ['./server/durable-objects']
    }
  }
})