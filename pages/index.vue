<template>
  <main class="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
    <Hero />
    <About />
    <Projects />
    <Contact />
  </main>
</template>

<script lang="ts" setup>
import Hero from '~/components/sections/Hero.vue'
import About from '~/components/sections/About.vue';
import Projects from '~/components/sections/Projects.vue';
import Contact from '~/components/sections/Contact.vue';

const { initObserver } = useSectionObserver()
initObserver(['hero', 'about', 'projects', 'contact'])

useHead({
  title: 'Giulio Tognetto - Portfolio',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { name: 'description', content: 'Portfolio di Giulio Tognetto, Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, Rust, Vue/Nuxt e soluzioni 3D.' }
  ]
})
</script>