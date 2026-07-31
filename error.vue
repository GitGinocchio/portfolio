<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <Logo size="xl" />
      <p class="text-6xl font-black text-primary-500 font-mono mb-2">
        {{ error?.statusCode || 404 }}
      </p>

      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
        {{ error?.statusCode === 404 ? 'Pagina non trovata' : 'Si è verificato un errore' }}
      </h1>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ error?.message || 'Spiacenti, la risorsa richiesta non è disponibile.' }}
      </p>

      <UButton color="primary" size="lg" class="rounded-xl" @click="handleError" to="/">
        Ritorna alla Home
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>