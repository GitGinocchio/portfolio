<template>
  <div class="hidden"></div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, watch, ref, type ShallowRef } from 'vue'
import type { Camera, WebGLRenderer, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'

const props = withDefaults(
  defineProps<{
    target?: [number, number, number]
    enableZoom?: boolean
    enableDamping?: boolean
    maxPolarAngle?: number
    minPolarAngle?: number
    idleTimeout?: number
    resetSpeed?: number
  }>(),
  {
    target: () => [0, -0.2, 0],
    enableZoom: false,
    enableDamping: true,
    maxPolarAngle: -Math.PI,
    minPolarAngle: Math.PI,
    idleTimeout: 3000,
    resetSpeed: 0.05
  }
)

// Usa sceneContext se ti sei allineato a quell'injection key o mantieni viewerContext
const context = inject<{
  scene?: Scene
  activeCamera: ShallowRef<Camera | null>
  renderer?: ShallowRef<WebGLRenderer | null>
} | null>('viewerContext', null)

let controls: OrbitControls | null = null
let idleTimer: ReturnType<typeof setTimeout> | null = null

const isResetting = ref(false)
const initialCameraPosition = new Vector3()
const initialTarget = new Vector3(...props.target)

const resetIdleTimer = () => {
  isResetting.value = false
  
  if (idleTimer) clearTimeout(idleTimer)
  
  idleTimer = setTimeout(() => {
    isResetting.value = true
  }, props.idleTimeout)
}

const cleanupControls = () => {
  if (idleTimer) clearTimeout(idleTimer)
  if (controls) {
    controls.removeEventListener('start', resetIdleTimer)
    controls.dispose()
    controls = null
  }
}

const initControls = () => {
  cleanupControls()

  const camera = context?.activeCamera.value
  const domElement = context?.renderer?.value?.domElement

  if (!camera || !domElement) return

  initialCameraPosition.copy(camera.position)

  controls = new OrbitControls(camera, domElement)
  controls.target.set(...props.target)
  controls.enableZoom = props.enableZoom
  controls.enableDamping = props.enableDamping
  controls.maxPolarAngle = props.maxPolarAngle
  controls.minPolarAngle = props.minPolarAngle

  controls.addEventListener('start', resetIdleTimer)
  controls.addEventListener('change', () => {
    if (!isResetting.value) resetIdleTimer()
  })

  resetIdleTimer()
}

const update = () => {
  if (!controls || !context?.activeCamera.value) return

  if (isResetting.value) {
    const camera = context.activeCamera.value

    camera.position.lerp(initialCameraPosition, props.resetSpeed)
    controls.target.lerp(initialTarget, props.resetSpeed)
    
    controls.update()

    if (
      camera.position.distanceTo(initialCameraPosition) < 0.01 &&
      controls.target.distanceTo(initialTarget) < 0.01
    ) {
      camera.position.copy(initialCameraPosition)
      controls.target.copy(initialTarget)
      isResetting.value = false
    }
  } else {
    controls.update()
  }
}

defineExpose({ update })

// Watcher reattivo: tenta l'inizializzazione ogni volta che la fotocamera o il renderer diventano disponibili/cambiano
watch(
  () => [context?.activeCamera.value, context?.renderer?.value] as const,
  ([camera, renderer]) => {
    if (camera && renderer) {
      initControls()
    } else {
      cleanupControls()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  cleanupControls()
})
</script>