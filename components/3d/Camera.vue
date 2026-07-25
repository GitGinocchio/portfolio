<template>
  <div class="hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { PerspectiveCamera, Camera } from 'three'

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

const activeCameraRef = inject<Ref<Camera | null> | null>('threeActiveCamera', null)

const camera = shallowRef(new PerspectiveCamera(props.fov, 1, props.near, props.far))

const updateCamera = () => {
  const cam = camera.value
  cam.fov = props.fov
  cam.near = props.near
  cam.far = props.far
  cam.position.set(...props.position)
  cam.lookAt(...props.lookAt)
  cam.updateProjectionMatrix()
}

const syncActiveState = () => {
  if (!activeCameraRef) return

  if (props.active) {
    activeCameraRef.value = camera.value
  } else if (activeCameraRef.value === camera.value) {
    activeCameraRef.value = null
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

watch(() => props.active, syncActiveState)

onBeforeUnmount(() => {
  if (activeCameraRef && activeCameraRef.value === camera.value) {
    activeCameraRef.value = null
  }
})
</script>