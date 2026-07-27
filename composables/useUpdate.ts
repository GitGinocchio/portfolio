import { inject, onUnmounted } from 'vue'

type FrameCallback = (delta: number) => void

interface ViewerContext {
  registerUpdate: (cb: FrameCallback) => void
  unregisterUpdate: (cb: FrameCallback) => void
}

export function useUpdate(callback: FrameCallback) {
  const context = inject<ViewerContext | null>('viewerContext', null)

  if (!context) {
    console.warn('[useFrame] viewerContext non trovato.')
    return
  }

  context.registerUpdate(callback)

  onUnmounted(() => {
    context.unregisterUpdate(callback)
  })
}