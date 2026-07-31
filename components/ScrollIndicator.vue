<template>
  <button 
    type="button"
    class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors z-10 pointer-events-auto cursor-pointer focus:outline-none"
    @click="smoothScrollDown"
  >
    <span class="text-[10px] font-mono uppercase tracking-widest select-none">
      {{ label }}
    </span>
    <div class="w-5 h-9 rounded-full border-2 border-current flex items-start justify-center p-1">
      <div class="w-1 h-2 bg-current rounded-full animate-bounce" />
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  /** Testo mostrato sopra la rotellina */
  label?: string
  /** Distanza di scorrimento in pixel (default: 300px) */
  distance?: number
  /** Durata dell'animazione in millisecondi (default: 800ms) */
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Scroll',
  distance: 300,
  duration: 800
})

const smoothScrollDown = () => {
  const startY = window.scrollY
  const targetY = startY + props.distance
  const startTime = performance.now()

  // Funzione di Easing (easeInOutCubic) per un movimento fluido ed elegante
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const easedProgress = easeInOutCubic(progress)

    window.scrollTo(0, startY + (props.distance * easedProgress))

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}
</script>