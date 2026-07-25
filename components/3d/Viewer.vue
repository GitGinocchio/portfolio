<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <div class="hidden">
      <slot />
    </div>

    <canvas ref="canvasRef" class="w-full h-full pointer-events-auto" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, provide } from 'vue'
import { WebGLRenderer, Scene, Camera } from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const activeScene = shallowRef<Scene | null>(null)
const activeCamera = shallowRef<Camera | null>(null)

provide('viewerContext', {
  activeScene,
  activeCamera
})

let renderer: WebGLRenderer
let animationFrameId: number

const defaultScene = new Scene()
const defaultCamera = new Camera()

onMounted(() => {
  if (!canvasRef.value) return

  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  renderer = new WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    const currentScene = activeScene.value || defaultScene
    const currentCamera = activeCamera.value || defaultCamera
    renderer.render(currentScene, currentCamera)
  }

  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  renderer?.dispose()
})
</script>