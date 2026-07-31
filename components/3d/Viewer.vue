<template>
  <div ref="containerRef" class="relative w-full h-full flex items-center justify-center">
    <div class="hidden">
      <slot />
    </div>

    <canvas 
      ref="canvasRef" 
      class="w-full h-full pointer-events-auto transition-opacity duration-300"
      :class="isReady ? 'opacity-100' : 'opacity-0'" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, provide } from 'vue'
import { WebGLRenderer, Scene, Camera, Timer } from 'three'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isReady = ref<boolean>(false)
const timer = new Timer()

const activeScene = shallowRef<Scene | null>(null)
const activeCamera = shallowRef<Camera | null>(null)
const renderer = shallowRef<WebGLRenderer | null>(null) 
const containerWidth = ref(0)
const containerHeight = ref(0)

const updateCallbacks = new Set<(delta: number) => void>()
const resizeCallbacks = new Set<(width: number, height: number) => void>()

const registerUpdate = (fn: (delta: number) => void) => {
  updateCallbacks.add(fn)
}

const unregisterUpdate = (fn: (delta: number) => void) => {
  updateCallbacks.delete(fn)
}

const registerResize = (fn: (width: number, height: number) => void) => {
  resizeCallbacks.add(fn)
}

const unregisterResize = (fn: (width: number, height: number) => void) => {
  resizeCallbacks.delete(fn)
}

provide('viewerContext', { 
  activeScene, 
  activeCamera, 
  renderer, 
  viewportSize: { 
    width: containerWidth, 
    height: containerHeight 
  },
  registerUpdate, 
  unregisterUpdate,
  registerResize,
  unregisterResize
})

let resizeObserver: ResizeObserver | null = null
let animationFrameId: number

const defaultScene = new Scene()
const defaultCamera = new Camera()

const emit = defineEmits<{
  (e: 'update', delta: number): void
}>()

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return
  timer.connect(document)

  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  renderer.value = new WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  isReady.value = true

  handleResize()

  resizeObserver = new ResizeObserver(() => handleResize())
  resizeObserver.observe(containerRef.value)
  handleUpdate()
})

async function handleUpdate() {
  animationFrameId = requestAnimationFrame(handleUpdate)

  timer.update()
  const delta = timer.getDelta()

  const currentScene = activeScene.value || defaultScene
  const currentCamera = activeCamera.value || defaultCamera

  updateCallbacks.forEach((cb) => cb(delta))

  emit("update", delta)

  renderer.value?.render(currentScene, currentCamera)
}

async function handleResize()  {
  if (!containerRef.value) return
  isReady.value = false

  containerWidth.value = containerRef.value.clientWidth
  containerHeight.value = containerRef.value.clientHeight

  resizeCallbacks.forEach((cb) => cb(containerWidth.value, containerHeight.value))

  renderer.value?.setSize(containerWidth.value, containerHeight.value, false)

  isReady.value = true
}

onBeforeUnmount(() => {
  isReady.value = false
  cancelAnimationFrame(animationFrameId)
  renderer.value?.dispose()
})
</script>