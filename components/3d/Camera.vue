<template>
  <div class="hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, inject, watch, watchEffect, onBeforeUnmount, type Ref, type ShallowRef } from 'vue'
import { PerspectiveCamera, type Camera } from 'three'

const props = withDefaults(
  defineProps<{
    active?: boolean
    fov?: number
    near?: number
    far?: number
    position?: [number, number, number]
    lookAt?: [number, number, number]
  }>(),
  {
    active: true,
    fov: 75,
    near: 0.1,
    far: 1000,
    position: () => [0, 0, 5],
    lookAt: () => [0, 0, 0]
  }
)

const context = inject<{
  activeCamera: ShallowRef<Camera | null>
  viewportSize: {
    width: Ref<number>
    height: Ref<number>
  }
}>('viewerContext')

const camera = shallowRef(new PerspectiveCamera(props.fov, 1, props.near, props.far))

// Update delle proprietà fisiche/trasformazioni
const updateCameraParams = () => {
  const cam = camera.value
  cam.fov = props.fov
  cam.near = props.near
  cam.far = props.far
  cam.position.set(...props.position)
  cam.lookAt(...props.lookAt)
  cam.updateProjectionMatrix()
}

// Update dell'aspect ratio isolato (evita di ri-chiamare lookAt se ridimensioni la finestra)
const updateAspectRatio = () => {
  const width = context?.viewportSize.width.value || 0
  const height = context?.viewportSize.height.value || 0

  if (width > 0 && height > 0) {
    const cam = camera.value
    cam.aspect = width / height
    cam.updateProjectionMatrix()
  }
}

// 1. Sincronizza parametri e aspect ratio al cambio props
watch(
  () => [props.fov, props.near, props.far, props.position, props.lookAt],
  () => {
    updateCameraParams()
    updateAspectRatio()
  },
  { deep: true, immediate: true }
)

// 2. Reagisce ai cambiamenti di dimensione del viewport (senza re-invocare lookAt)
watch(
  () => [context?.viewportSize.width.value, context?.viewportSize.height.value],
  updateAspectRatio,
  { immediate: true }
)

// 3. Sincronizzazione automatica dello stato active
watchEffect(() => {
  if (!context) return

  if (props.active) {
    context.activeCamera.value = camera.value
  } else if (context.activeCamera.value === camera.value) {
    context.activeCamera.value = null
  }
})

onBeforeUnmount(() => {
  if (context?.activeCamera.value === camera.value) {
    context.activeCamera.value = null
  }
})
</script>