<template>
  <section class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300 flex items-center justify-center z-0">
    
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-500/30 dark:bg-primary-500/20 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-300" />
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary-500/10 dark:bg-secondary-500/25 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-300" />
    <div class="absolute inset-0 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-70 dark:opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        
    <div class="absolute bottom-0 right-0 w-full lg:w-1/2 h-full z-0 pointer-events-auto">
      <ClientOnly>
        <Viewer>
          <Scene @update="(delta) => onSceneUpdate(delta)">
            <Camera :look-at="[0, 0, 0]" :position="[0, 0, 5.5]" />
            <Controls 
              :target="[0, 0, 0]" 
              :enable-zoom="false" 
              :max-polar-angle="Math.PI / 2" 
              :min-polar-angle="Math.PI / 4"
              :idle-timeout="2000"
              :reset-speed="0.05"
            />
            <Model
              path="/models/lego.glb"
              v-model:loaded="isModelLoaded"
              :position="modelPosition"
              :animation="modelAnimation"
              :loop-animation="modelAnimationLoop"
              @anim-finish="(animation) => onAnimationFinished(animation)"
              :scale="2.7"
            />
          </Scene>
        </Viewer>
      </ClientOnly>
    </div>

    <UContainer class="w-full relative z-10 pointer-events-none py-20 my-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 flex flex-col items-start text-left select-none pointer-events-auto">
          
          <UBadge 
            color="neutral"
            variant="outline" 
            size="lg"
            class="mb-6 rounded-full px-3.5 py-1.5 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 gap-2.5 font-mono font-medium text-gray-700 dark:text-gray-300"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Disponibile per nuovi progetti
          </UBadge>
          
          <h1 class="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-gray-900 dark:text-white leading-[0.95]">
            Giulio Tognetto
          </h1>
          
          <h2 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent mt-4">
            Software Developer
          </h2>

          <p class="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
            Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, sistemi web reattivi ed esperienze 3D interattive.
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <UBadge
              v-for="tech in ['Vue.js / Nuxt', 'TypeScript', 'Rust', 'Three.js', 'Cloudflare']" 
              :key="tech"
              color="primary"
              variant="subtle"
              size="md"
              class="font-mono rounded-lg px-3 py-1 bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300/40 dark:border-gray-700/40 backdrop-blur-xs text-gray-700 dark:text-gray-300"
            >
              {{ tech }}
            </UBadge>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <UButton
              to="#projects"
              color="primary"
              variant="solid"
              size="xl"
              trailing-icon="i-heroicons-arrow-right-20-solid"
              class="rounded-xl shadow-lg shadow-primary-500/25 active:scale-95 transition-all group"
            >
              Vedi Progetti
            </UButton>

            <UButton
              to="#contact"
              color="primary"
              variant="outline"
              size="xl"
              class="rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700/60 active:scale-95 transition-all shadow-xs"
            >
              Contattami
            </UButton>
          </div>

        </div>
      </div>
    </UContainer>

    <ScrollIndicator />
  </section>
</template>

<script setup lang="ts">
import Viewer from '~/components/3d/Viewer.vue'
import Scene from '~/components/3d/Scene.vue'
import Model from '~/components/3d/Model.vue'
import Camera from '~/components/3d/Camera.vue'
import Controls from '~/components/3d/Controls.vue'

const startY = 10
const targetY = -2.5
const duration = 2.5
let elapsedTime = 0

const modelPosition = ref<[number, number, number]>([0, startY, 0])
const modelAnimation = ref<string>("Falling")
const modelAnimationLoop = ref<boolean>(true)
const isModelLoaded = ref<boolean>(false)

let hasImpacted = false

function onSceneUpdate(delta: number) {
  if (!isModelLoaded.value || hasImpacted) return

  if (elapsedTime < duration) {
    const safeDelta = Math.min(delta, 0.05)
    elapsedTime += safeDelta
    const progress = Math.min(elapsedTime / duration, 1)
    
    const easeInQuad = Math.pow(progress, 2)
    const currentY = startY + (targetY - startY) * easeInQuad
    modelPosition.value = [0, currentY, 0]

    if (progress >= 1) {
      hasImpacted = true
      modelPosition.value = [0, targetY, 0]
      modelAnimationLoop.value = false
      modelAnimation.value = "FlatImpact"
    }
  }
}

function onAnimationFinished(animation: string) {
  if (animation === 'FlatImpact') {
    modelAnimation.value = 'ImpactStandup'
  } else if (animation === 'ImpactStandup') {
    modelAnimationLoop.value = true
    modelAnimation.value = 'Idle'
  }
}
</script>