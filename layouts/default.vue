<template>
  <UHeader title="Il mio sito">
    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} Il mio sito
      </p>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
</script>

<style>

</style>