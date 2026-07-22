<template>
  <div class="relative w-screen h-screen overflow-hidden bg-zinc-950 text-white" @mousemove="handleMouseMove">
    <TresCanvas window-size alpha>
      <TresPerspectiveCamera :position="cameraPosition" :look-at="[0, 0, 0]" />
      <TresAmbientLight :intensity="2" />
      <TresDirectionalLight :position="directionalLightPosition" :intensity="5" />
      <Suspense>
        <RobotAvatar :position="robotPosition" :mouse="mouse" />
      </Suspense>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { Vector3 } from 'three';
import RobotAvatar from './components/RobotAvatar.vue';
import { ref } from 'vue'

const cameraPosition = new Vector3(0, -1.5, 10)
const robotPosition = new Vector3(3, -4.0, -1)
const directionalLightPosition = new Vector3(4, 10, 5)

const mouse = ref({ x: 0, y: 0 })

const handleMouseMove = (event: MouseEvent) => {
  mouse.value = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1
  }
}
</script>