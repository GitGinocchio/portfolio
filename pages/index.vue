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

useSeoMeta({
  title: 'Home',
  description: 'Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, Rust, Vue/Nuxt e soluzioni cloud.',
  
  ogTitle: 'Giulio Tognetto - Full-Stack Developer',
  ogDescription: 'Scopri i miei progetti open-source, software desktop e applicazioni web.',
  ogImage: 'https://giuliotognetto.dev/og-image.png',
  ogUrl: 'https://giuliotognetto.dev',
  ogType: 'website',

  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: 'Giulio Tognetto - Full-Stack Developer',
  twitterDescription: 'Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, Rust, Vue/Nuxt e soluzioni cloud.',
  twitterImage: 'https://giuliotognetto.dev/og-image.png',
})
</script>