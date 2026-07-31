<template>
  <div 
    class="logo-wrapper inline-block group cursor-pointer select-none active:scale-90 transition-transform duration-150 ease-out" 
    :class="{ 'is-active': isToggled }"
    aria-label="Logo"
    @touchstart="handleTouchStart"
  >
    <div 
      class="relative logo-head"
      :class="sizeClass"
      :style="sizeStyle"
    >
      <img 
        src="/cat.png" 
        alt="Giulio Tognetto Logo"
        class="absolute inset-0 w-full h-full object-contain transition-all duration-250 group-hover:opacity-0 group-hover:scale-95 in-[.is-active]:opacity-0 in-[.is-active]:scale-95"
      />
      <img 
        src="/cat-tongue.png" 
        alt="Giulio Tognetto Logo Alt"
        class="absolute inset-0 w-full h-full object-contain opacity-0 scale-95 transition-all duration-250 group-hover:opacity-100 group-hover:scale-105 in-[.is-active]:opacity-100 in-[.is-active]:scale-105"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{ 
    size?: 'sm' | 'md' | 'lg' | 'xl' | string
  }>(), 
  {
    size: 'md'
  }
)

const presetSizes: Record<string, string> = {
  sm: 'w-8 h-8 sm:w-10 sm:h-10',
  md: 'w-12 h-12 sm:w-14 sm:h-14',
  lg: 'w-16 h-16 sm:w-20 sm:h-20',
  xl: 'w-20 h-20 sm:w-24 sm:h-24'
}

const sizeClass = computed(() => presetSizes[props.size] || '')

const sizeStyle = computed(() => {
  if (presetSizes[props.size]) return {}
  return {
    width: props.size,
    height: props.size
  }
})

const isToggled = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleTouchStart = (event: TouchEvent) => {
  if (!isToggled.value) {
    event.preventDefault()
    isToggled.value = true

    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      isToggled.value = false
    }, 1500)
  }
}
</script>

<style scoped>
@keyframes catHeadTilt {
  0% { 
    transform: rotate(0deg); 
  }
  25% { 
    transform: rotate(18deg);
  }
  50% { 
    transform: rotate(-6deg);
  }
  75% { 
    transform: rotate(4deg); 
  }
  100% { 
    transform: rotate(0deg); 
  }
}

.group:hover .logo-head,
.group.is-active .logo-head {
  animation: catHeadTilt 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom center; 
}
</style>