<template>
  <canvas id="canvas"></canvas>
</template>

<script setup lang="ts">
import { useGodot } from '~/composables/useGodot';

const { loadGodot } = useGodot();

onMounted(async () => {
  // 1. Recuperiamo la config che avevi salvato nel JSON
  const response = await fetch('/game-meta.json');
  const GODOT_CONFIG = await response.json();

  // 2. Carichiamo l'engine
  const engine = await loadGodot(GODOT_CONFIG);

  // 3. Avviamo il gioco nel canvas
  try {
    // @ts-ignore
    await engine.startGame({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      onProgress: (current: number, total: number) => {
        console.log(`Caricamento: ${Math.round((current / total) * 100)}%`);
      },
    });
    console.log('Gioco avviato!');
  } catch (err) {
    console.error('Errore avvio gioco:', err);
  }
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
</style>