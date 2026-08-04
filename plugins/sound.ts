
import { useSound, type SoundEffect } from '~/composables/useSound'

export default defineNuxtPlugin((nuxtApp) => {
  const { playSound } = useSound()

  nuxtApp.vueApp.directive('sound', {
    mounted(el: HTMLElement, binding) {
      const effect: SoundEffect = binding.value || 'click'

      const handler = (event: MouseEvent) => {
        playSound(effect)
      }

      (el as any)._soundHandler = handler

      el.addEventListener('click', handler, { capture: true })
    },
    unmounted(el: HTMLElement) {
      const handler = (el as any)._soundHandler
      if (handler) {
        el.removeEventListener('click', handler, { capture: true })
      }
    }
  })
})