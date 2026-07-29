<template>
  <main class="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
    
    <Hero />

    <section id="projects" class="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto">
      <div class="flex flex-col items-start mb-16">
        <span class="text-xs font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2">
          Featured Work
        </span>
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight">
          Progetti Selezionati
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-8 transition-all hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10">
          <div class="text-xs font-mono text-gray-500 mb-4">2026 • Desktop App / Rust</div>
          <h3 class="text-2xl font-bold mb-2 group-hover:text-primary-500 transition-colors">BrickUI</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            Utility desktop estensibile per Windows che consente il rendering di layout personalizzati all'interno di WebView native.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 p-8 transition-all hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10">
          <div class="text-xs font-mono text-gray-500 mb-4">2026 • Cloudflare / TypeScript</div>
          <h3 class="text-2xl font-bold mb-2 group-hover:text-primary-500 transition-colors">Flarecord</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            Framework asincrono e modulare per Discord progettato per il deployment serverless su Cloudflare Workers e WebSocket gateway.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import Hero from '~/components/Hero.vue'

useHead({
  title: 'Giulio Tognetto - Portfolio',
  meta: [
    { name: 'description', content: 'Portfolio di Giulio Tognetto, Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, Rust, Vue/Nuxt e soluzioni 3D.' }
  ]
})
</script>