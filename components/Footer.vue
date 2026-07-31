<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }} Giulio Tognetto. All rights reserved.
      </p>
    </template>

    <!-- <UNavigationMenu :items="items" variant="link" /> -->

    <template #right>
      <UButton
        icon="i-simple-icons-discord"
        color="primary"
        variant="ghost"
        to="https://discord.com/users/778017089230209045"
        target="_blank"
        aria-label="Discord"
      />
      <UButton
        icon="i-simple-icons-instagram"
        color="primary"
        variant="ghost"
        to="https://www.instagram.com/giulio.tognetto"
        target="_blank"
        aria-label="Instagram"
      />
      <UButton
        icon="i-simple-icons-github"
        color="primary"
        variant="ghost"
        to="https://github.com/GitGinocchio"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  }, 
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  }, 
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }
]
</script>

<style>

</style>