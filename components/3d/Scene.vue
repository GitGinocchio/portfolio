<template>
  <div class="hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, inject, provide, onMounted, onBeforeUnmount, watch, type Ref, type ShallowRef } from 'vue'
import { Scene, Camera } from 'three'

const props = withDefaults(defineProps<{ active?: boolean }>(), { active: true })
const emit = defineEmits<{
  (e: 'update', delta: number): void
}>()

const scene = new Scene()
const activeCamera = shallowRef<Camera | null>(null)

provide('sceneContext', { scene, activeCamera })
const viewerContext = inject<{ activeScene: Ref<Scene | null>, activeCamera: Ref<Camera | null> } | null>('viewerContext', null)

useUpdate((delta) => {
  if (viewerContext?.activeScene.value == scene) {
    emit("update", delta)
  }
})

const syncWithViewer = () => {
  if (!viewerContext) return

  if (props.active && viewerContext.activeScene) {
    viewerContext.activeScene.value = scene
    if (activeCamera.value) {
      viewerContext.activeCamera.value = activeCamera.value
    }
  }
}

watch(activeCamera, (newCam) => {
  if (props.active && viewerContext && newCam) {
    viewerContext.activeCamera.value = newCam
  }
})

watch(() => props.active, syncWithViewer)

onMounted(syncWithViewer)

onBeforeUnmount(() => {
  if (viewerContext && viewerContext.activeScene.value === scene) {
    viewerContext.activeScene.value = null
    viewerContext.activeCamera.value = null
  }
})
</script>