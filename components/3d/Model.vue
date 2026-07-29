<template>
  <div class="hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, inject, watch, onMounted, onBeforeUnmount, type ShallowRef } from 'vue'
import { Timer, Scene, Camera, AnimationClip, AnimationAction, AnimationMixer, LoopOnce, LoopRepeat } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

const sceneContext = inject<{ scene: Scene, activeCamera: ShallowRef<Camera | null> } | null>('sceneContext', null)

const props = withDefaults(
  defineProps<{
    path: string
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: number | [number, number, number]
    animation?: string
    loopAnimation?: boolean
  }>(),
  {
    position: () => [0, 0, 0],
    rotation: () => [0, 0, 0],
    scale: 1,
    loopAnimation: true
  }
)

const isLoaded = defineModel<boolean>('loaded', { default: false })
const emit = defineEmits<{
  (e: 'load', gltf: GLTF): void
  (e: 'progress', event: ProgressEvent<EventTarget>): void
  (e: 'error', error: unknown): void
  (e: 'anim-start', name: string): void
  (e: 'anim-finish', name: string): void
  (e: 'anim-loop', payload: { name: string; count: number }): void
  (e: 'anim-change', payload: { from: string | null; to: string }): void
}>()

const { loadModel, releaseModel } = useModelLoader()
const model = shallowRef<GLTF | null>(null)

// --- Gestione Animazioni ---
let mixer: AnimationMixer | null = null
let currentAction: AnimationAction | null = null
let animFrameId: number | null = null
const timer = new Timer()

const loopCount = ref(0)

const updateAnimation = () => {
  if (!mixer) return

  timer.update()
  const delta = timer.getDelta()
  mixer.update(delta)

  animFrameId = requestAnimationFrame(updateAnimation)
}

const setupMixerListeners = () => {
  if (!mixer) return

  mixer.addEventListener('finished', (e: any) => {
    const actionName = e.action.getClip().name
    emit('anim-finish', actionName)
  })

  mixer.addEventListener('loop', (e: any) => {
    const actionName = e.action.getClip().name
    
    loopCount.value++
    emit('anim-loop', { name: actionName, count: loopCount.value })
  })
}



const playAnimation = (name?: string) => {
  if (!mixer || !model.value?.animations.length) return

  const animations = model.value.animations
  const clip = name 
    ? AnimationClip.findByName(animations, name) 
    : animations[0]

  if (!clip) return

  const newAction = mixer.clipAction(clip)

  if (currentAction === newAction && newAction.isRunning()) return

  const previousName = currentAction ? currentAction.getClip().name : null
  const currentName = clip.name

  loopCount.value = 0

  if (currentAction && currentAction !== newAction) {
    currentAction.fadeOut(0.3)
  }

  if (props.loopAnimation) {
    newAction.setLoop(LoopRepeat, Infinity)
    newAction.clampWhenFinished = false
  } else {
    newAction.setLoop(LoopOnce, 1)
    newAction.clampWhenFinished = true
  }

  newAction
    .reset()
    .fadeIn(0.3)
    .play()

  currentAction = newAction

  emit('anim-start', currentName)
  if (previousName !== currentName) {
    emit('anim-change', { from: previousName, to: currentName })
  }
}

const applyTransformations = () => {
  if (!model.value?.scene) return

  const obj = model.value.scene
  obj.position.set(...props.position)
  obj.rotation.set(...props.rotation)

  if (typeof props.scale === 'number') {
    obj.scale.setScalar(props.scale)
  } else {
    obj.scale.set(...props.scale)
  }
}

const initModel = async () => {
  isLoaded.value = false
  if (!props.path) return

  const gltf = await loadModel({
    path: props.path,
    onProgress: (event) => emit('progress', event),
    onError: (err) => {
      isLoaded.value = false
      emit('error', err)
    }
  })

  if (gltf) {
    model.value = gltf
    applyTransformations()

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new AnimationMixer(gltf.scene)
      setupMixerListeners()
      playAnimation(props.animation)
      updateAnimation()
    }

    if (sceneContext?.scene && !sceneContext.scene.children.includes(gltf.scene)) {
      sceneContext.scene.add(gltf.scene)
    }

    isLoaded.value = true
    emit('load', gltf)
  }
}

const cleanupModel = () => {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  if (mixer) {
    mixer.stopAllAction()
    if (model.value?.scene) {
      mixer.uncacheRoot(model.value.scene)
    }
    mixer = null
  }

  if (model.value?.scene && sceneContext?.scene) {
    sceneContext.scene.remove(model.value.scene)
  }

  if (props.path && model.value?.scene) {
    releaseModel(props.path, model.value?.scene)
  }

  isLoaded.value = false
  model.value = null
  loopCount.value = 0
}

watch(() => props.animation, (newAnimName) => playAnimation(newAnimName))
watch(() => props.loopAnimation, () => playAnimation(props.animation))
watch(() => [props.position, props.rotation, props.scale], applyTransformations, { deep: true })
watch(() => props.path,
  async (newPath, oldPath) => {
    if (oldPath) cleanupModel()
    await initModel()
  }
)

onMounted(initModel)
onBeforeUnmount(cleanupModel)
</script>