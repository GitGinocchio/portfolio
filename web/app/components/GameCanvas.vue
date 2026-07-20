<template> 
  <div class="container">
    <canvas id="canvas" />
    <div v-show="!isReady" class="boot-screen">
      <pre v-for="(line, index) in bootLogs" :key="index">{{ line }}</pre>
      <div id="cursor">_</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGodot } from '~/composables/useGodot';
import { useBootLogger } from '~/composables/useBootLogger';

const isReady = ref<boolean>(false);
const { bootLogs, updateProgress } = useBootLogger();
const { loadGodot, ASSETS_BASE } = useGodot();

onMounted(async () => {
  await loadGodot(
    document.getElementById('canvas') as HTMLCanvasElement, 
    (current: number, total: number) => {
      const percent = Math.round((current / total) * 100);
      if (current === total) {
        isReady.value = true;
        return;
      }
      updateProgress(percent);
    }
  );
});
</script>

<style scoped>
#canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}

.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #0f0; /* Verde terminale */
  font-family: 'Courier New', monospace;
  padding: 20px;
  z-index: 10;
  overflow: hidden;
}

#cursor {
  display: inline-block;
  animation: blink 1s infinite;
}
</style>

<style>
body {
  background-color: black !important;
}
</style>