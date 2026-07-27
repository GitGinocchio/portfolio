<template>
  <section class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300 flex items-center">
    
    <!-- Background Glow Effects -->
    <div class="absolute -top-40 -left-40 w-500px h-500px bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-[128px] pointer-events-none z-0"></div>
    <div class="absolute -bottom-40 -right-40 w-500px h-500px bg-secondary-400/20 dark:bg-secondary-600/20 rounded-full blur-[128px] pointer-events-none z-0"></div>

    <!-- 1. CANVAS 3D (Nella metà destra su Desktop) -->
    <div class="absolute bottom-0 right-0 w-full lg:w-1/2 h-full lg:h-full z-0 pointer-events-auto">
      <ClientOnly>
        <Viewer>
          <Scene>
            <Camera 
              active 
              :look-at="[0, -0.2, 0]" 
              :position="[0, 1.2, 5.5]" 
            />
            <Controls 
              :target="[0, -0.2, 0]" 
              :enable-zoom="false" 
              :max-polar-angle="Math.PI / 1.5" 
              :min-polar-angle="Math.PI / 4"
              :idle-timeout="2000"
              :reset-speed="0.05"
            />
            <Model 
              path="/models/lego.glb"
              :position="[0, -2.5, 0]" 
              :scale="2.7" 
              animation="Idle" 
              @anim-loop="(animation) => console.log(animation)" 
            />
          </Scene>
        </Viewer>
      </ClientOnly>
    </div>

    <!-- 2. CONTENUTO TEXT / HERO -->
    <div class="w-full px-6 sm:px-12 lg:px-16 relative z-10 pointer-events-none my-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 flex flex-col items-start text-left select-none pointer-events-auto">
          <span class="px-3.5 py-1 text-xs font-mono bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20 rounded-full mb-4 shadow-xs">
            Portfolio
          </span>
          
          <h1 class="text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
            Giulio Tognetto
          </h1>
          
          <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-linear-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent mt-4">
            Software Developer
          </h2>

          <p class="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, sistemi web reattivi ed esperienze 3D interattive.
          </p>

          <!-- CTA Buttons -->
          <div class="mt-8 flex flex-wrap gap-4">
            <a href="#projects" class="px-6 py-3 rounded-xl font-medium bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-lg shadow-primary-500/25">
              Vedi Progetti
            </a>
            <a href="#contact" class="px-6 py-3 rounded-xl font-medium bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">
              Contattami
            </a>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import Viewer from './3d/Viewer.vue'
import Scene from './3d/Scene.vue'
import Model from './3d/Model.vue'
import Camera from './3d/Camera.vue'
import Controls from './3d/Controls.vue'
</script>