<template>
  <div class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-50 w-[92vw] sm:w-auto max-w-max">
    <UNavigationMenu
      :items="links"
      variant="pill"
      color="primary"
      class="bg-background/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1.5 sm:py-2 border border-muted/50 shadow-lg shadow-neutral-950/5 w-full justify-between sm:justify-start items-center"
      :ui="{
        item: 'mx-0.5 sm:mx-1',
        link: 'py-2 px-2.5 sm:px-3 text-sm sm:text-base',
        linkLeadingIcon: 'text-primary-500 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-150 size-5 sm:size-4'
      }"
    >
      <template #list-leading>
        <div class="flex items-center gap-2 pr-2">
          <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
            <span class="font-semibold text-xs sm:text-sm tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
              Home
            </span>
          </NuxtLink>
          <div class="h-4 flex items-center ml-1">
            <USeparator orientation="vertical" />
          </div>
        </div>
      </template>

      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links: NavigationMenuItem[] = [
  {
    label: 'Progetti',
    icon: 'i-heroicons-folder-open',
    to: '#projects'
  },
  {
    label: 'Su di me',
    icon: 'i-heroicons-user',
    to: '#about'
  },
  {
    label: 'Contatti',
    icon: 'i-heroicons-envelope',
    to: '#contact'
  }
]
</script>
