<template>
  <div class="hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, inject, watch, onMounted, onBeforeUnmount, type Ref, type ShallowRef } from 'vue'
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

const updateCamera = () => {
  const cam = camera.value
  cam.fov = props.fov
  cam.near = props.near
  cam.far = props.far
  cam.position.set(...props.position)
  cam.lookAt(...props.lookAt)

  const width = context?.viewportSize.width.value || 0
  const height = context?.viewportSize.height.value || 0

  if (width > 0 && height > 0) {
    cam.aspect = width / height
    cam.updateProjectionMatrix()
  }
}

const syncActiveState = () => {
  if (!context) return

  if (props.active) {
    context.activeCamera.value = camera.value
  } else if (context.activeCamera.value === camera.value) {
    context.activeCamera.value = null
  }
}

onMounted(() => {
  updateCamera()
  syncActiveState()
})

watch(
  () => [props.fov, props.near, props.far, props.position, props.lookAt],
  updateCamera,
  { deep: true }
)

watch(
  () => [context?.viewportSize.width.value, context?.viewportSize.height.value],
  updateCamera
)

watch(() => props.active, syncActiveState)

onBeforeUnmount(() => {
  if (context?.activeCamera.value === camera.value) {
    context.activeCamera.value = null
  }
})
</script>