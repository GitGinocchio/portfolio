<template>
  <section class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
    
    <!-- Background Glow Effects -->
    <div class="absolute -top-40 -left-40 w-500px h-500px bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-[128px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-500px h-500px bg-secondary-400/20 dark:bg-secondary-600/20 rounded-full blur-[128px] pointer-events-none"></div>

    <!-- Contenitore Principale -->
    <div class="max-w-7xl mx-auto w-full h-[85vh] relative flex items-center justify-center px-6 lg:px-8">

      <!-- 1. LIVELLO SFONDO (z-0): Testo Titolo a SINISTRA -->
      <div class="absolute top-1/4 -translate-y-12 left-6 lg:left-8 right-6 lg:right-8 flex flex-col items-start text-left z-0 select-none pointer-events-none">
        <span class="px-3 py-1 text-xs font-mono bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20 rounded-full mb-3">
          Portfolio
        </span>
        <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-gray-900 dark:text-white opacity-90 leading-none">
          Giulio Tognetto
        </h1>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-linear-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent mt-2">
          Software Developer
        </h2>
      </div>

      <!-- 2. LIVELLO CENTRALE (z-10): Modello 3D Centrato Verticalmente a DESTRA -->
      <div class="w-full h-full flex items-center justify-end z-10 pointer-events-auto">
        <div class="w-full lg:w-1/2 h-full flex items-center justify-center">
          <ClientOnly>
            <Viewer>
              <Scene>
                <Camera active :look-at="[0, 2, -5]" :position="[0, 2, 5]" />
                <Model 
                  path="/models/lego.glb"
                  :position="[1, 0, 0]"
                  :scale="2.7" 
                  animation="Idle" 
                  @anim-loop="(animation) => console.log(animation)" 
                />
              </Scene>
            </Viewer>
          </ClientOnly>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import Viewer from './3d/Viewer.vue';
import Scene from './3d/Scene.vue';
import Model from './3d/Model.vue';
import Camera from './3d/Camera.vue';
</script>