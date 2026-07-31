<template>
  <main class="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
    <Hero />
    <Projects />
    <Contacts />
  </main>
</template>

<script lang="ts" setup>
import Hero from '~/components/sections/Hero.vue'
import Projects from '~/components/sections/Projects.vue';
import Contacts from '~/components/sections/Contacts.vue';

useHead({
  title: 'Giulio Tognetto - Portfolio',
  meta: [
    { name: 'description', content: 'Portfolio di Giulio Tognetto, Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, Rust, Vue/Nuxt e soluzioni 3D.' }
  ]
})
</script>