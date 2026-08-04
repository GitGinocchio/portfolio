// composables/useSectionObserver.ts
import { onMounted, onUnmounted } from 'vue'

export function useSectionObserver(sectionIds: string[], threshold: number = 0.0, rootMargin: string = '-20% 0px -60% 0px') {
  let observer: IntersectionObserver | null = null
  let isClickScrolling = false
  let clickTimeout: ReturnType<typeof setTimeout> | null = null

  // Metodo per disabilitare temporaneamente l'observer durante il click sui link
  const lockObserverTemporarily = () => {
    isClickScrolling = true
    if (clickTimeout) clearTimeout(clickTimeout)
    clickTimeout = setTimeout(() => {
      isClickScrolling = false
    }, 800) // Sblocca l'observer dopo 800ms (tempo stimato dello scroll smooth)
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        // Se lo scroll è scatenato da un click o se la pagina sta ancora caricando, ignora
        if (isClickScrolling) return

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const newHash = id && id !== 'hero' ? `#${id}` : ''
            const currentHash = window.location.hash

            if (currentHash !== newHash) {
              const newUrl = newHash 
                ? `${window.location.pathname}${newHash}`
                : window.location.pathname

              window.history.replaceState(null, '', newUrl)
            }
          }
        })
      },
      {
        // rootMargin e threshold ottimizzati per evitare falsi positivi a cavallo tra 2 sezioni
        rootMargin: rootMargin,
        threshold: threshold
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer?.observe(el)
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (clickTimeout) clearTimeout(clickTimeout)
  })

  return {
    lockObserverTemporarily
  }
}