<template>
  <section class="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden px-6 lg:px-20">
    <!-- Glow Background Effects -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>

    <div class="max-w-7xl w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
      
      <!-- Testo a sinistra -->
      <div class="flex flex-col items-start gap-4">
        <span class="px-3 py-1 text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
          Portfolio
        </span>
        <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight">
          Giulio Tognetto
        </h1>
        <h2 class="text-2xl lg:text-3xl font-semibold bg-linear-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
          Software Developer
        </h2>
        <p class="text-slate-400 text-lg max-w-lg mt-2 leading-relaxed">
          Sviluppo soluzioni software full-stack, architetture cloud performanti ed esperienze digitali interattive.
        </p>

        <!-- Buttons -->
        <div class="flex items-center gap-4 mt-6">
          <a href="#projects" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-medium rounded-xl transition duration-200 shadow-lg shadow-indigo-600/30">
            Guarda i Progetti
          </a>
          <a href="#contact" class="px-6 py-3 border border-slate-700 hover:border-slate-500 font-medium rounded-xl transition duration-200 bg-slate-900/50">
            Contattami
          </a>
        </div>
      </div>

      <!-- Canvas 3D tramite il nuovo componente -->
      <div class="w-full h-1000px">
        <ModelViewer model-path="/models/lego.glb" :scale="2.5" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ModelViewer from '~/components/ModelViewer.vue'
</script>