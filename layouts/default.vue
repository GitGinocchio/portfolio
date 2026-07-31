<template>
  <Header />

  <UMain>
    <slot />
  </UMain>

  <Footer />
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue';
</script>

<style>

</style>