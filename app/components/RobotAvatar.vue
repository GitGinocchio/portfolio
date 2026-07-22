<template>
  <primitive 
    v-if="model"
    ref="robotRef"
    :object="model.scene"
    :position="position || [0, 0, 0]" 
    :scale="[5, 5, 5]" 
  />
</template>

<script setup lang="ts">
import { useGLTF, useAnimations } from '@tresjs/cientos'
import { useLoop } from '@tresjs/core'
import { shallowRef } from 'vue'
import { Object3D, LoopRepeat, Vector3 } from 'three';

const robotRef = shallowRef<Object3D>()
const { onBeforeRender } = useLoop();
const { state: model } = useGLTF('/models/tealv2.glb')

const animations = computed(() => model.value?.animations ?? [])
const { actions, mixer } = useAnimations(animations, robotRef, { manualUpdate: true })

watch(actions, (newActions) => {
  console.log(newActions);
  const action = newActions["Idle"]
  if (action) {
    action.play()
  }
}, { deep: true, immediate: true })

const targetWorldPos = new Vector3()

const props = defineProps<{
  position?: Vector3,
  mouse?: { x: number; y: number }
}>()

onBeforeRender(({ delta, elapsed }) => {
  mixer.value.update(delta);
  
  if (robotRef.value && props.mouse) {
    const headBone = robotRef.value.getObjectByName('Head')
    if (headBone) {
      //headBone.rotation.y = props.mouse.x * 0.7
      //headBone.rotation.x = -props.mouse.y * 0.3

      targetWorldPos.set(
        1 + props.mouse.x * 3.0, 
        props.mouse.y * 2.5, 
        4 // Profondità virtuale del punto guardato davanti al robot
      )

      // 2. Forziamo l'osso a guardare il punto target nello spazio globale (World Space)
      // Nota: a seconda di come è orientato l'osso in Blender (es. asse Z o Y in avanti), 
      // potresti dover usare metodi di rotazione inversa o quaternioni.
      headBone.lookAt(targetWorldPos)
    }
  }
})

</script>