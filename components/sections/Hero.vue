<template>
  <!-- 🎯 section relative per fare da contenitore al posizionamento absolute dello ScrollIndicator -->
  <section id="hero" class="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300 flex items-center justify-center z-0 pt-16 lg:pt-0">
    
    <!-- Background Accents -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-500/30 dark:bg-primary-500/20 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-300" />
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary-500/30 dark:bg-primary-500/20 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-300" />
    <div class="absolute inset-0 bg-[radial-gradient(var(--color-primary-400)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-primary-600)_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

    <!-- Viewport 3D -->
    <div class="absolute top-17.5 left-0 w-full h-[40vh] lg:top-0 lg:w-1/2 lg:h-full lg:left-auto lg:right-0 z-0 pointer-events-auto">
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
              :fade-duration="modelFadeConfig"
              @anim-loop="(payload) => onAnimationLoop(payload)"
              @anim-finish="(animation) => onAnimationFinished(animation)"
              :scale="modelScale"
            />
          </Scene>
        </Viewer>
      </ClientOnly>
    </div>
    <UContainer class="w-full relative z-10 pointer-events-none pt-[38vh] lg:pt-0 pb-24 lg:pb-0 my-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div class="lg:col-span-7 flex flex-col items-start text-left select-none pointer-events-auto">
          
          <UBadge 
            color="neutral"
            variant="outline" 
            size="lg"
            class="mb-3 sm:mb-6 rounded-full px-3.5 py-1.5 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 gap-2.5 font-mono font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Disponibile per nuovi progetti
          </UBadge>
          
          <h1 class="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-gray-900 dark:text-white leading-[0.95]">
            Giulio Tognetto
          </h1>
          
          <h2 class="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-linear-to-r from-primary-500 via-primary-400 to-secondary-500 bg-clip-text text-transparent mt-2 sm:mt-4">
            Software Developer
          </h2>

          <p class="mt-3 sm:mt-6 text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
            Sviluppatore Full-Stack specializzato in architetture ad alte prestazioni, sistemi web reattivi ed esperienze 3D interattive.
          </p>

          <div class="mt-3 sm:mt-6 flex flex-wrap gap-2">
            <UBadge
              v-for="tech in ['Vue.js / Nuxt', 'TypeScript', 'Rust', 'Three.js', 'Cloudflare']" 
              :key="tech"
              color="primary"
              variant="subtle"
              :size="isMobile ? 'sm' : 'md'"
              class="font-mono rounded-lg px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300/40 dark:border-gray-700/40 backdrop-blur-xs text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              {{ tech }}
            </UBadge>
          </div>

          <div class="mt-5 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <UButton
              to="#projects"
              @click="playSound()"
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
              @click="playSound()"
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
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Viewer from '~/components/3d/Viewer.vue'
import Scene from '~/components/3d/Scene.vue'
import Model from '~/components/3d/Model.vue'
import Camera from '~/components/3d/Camera.vue'
import Controls from '~/components/3d/Controls.vue'

const { playSound } = useSound()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  impactType.value = Math.random() < 0.5 ? 'landing' : 'flat'
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

const modelScale = computed(() => isMobile.value ? 3.0 : 2.7)
const targetY = computed(() => isMobile.value ? -2.5 : -2.5)

const startY = 10
const duration = 1.0
let elapsedTime = 0

type ImpactType = 'landing' | 'flat'
const impactType = ref<ImpactType>('landing')

const modelPosition = ref<[number, number, number]>([0, startY, 0])
const modelAnimation = ref<string>("FallingIdle")
const modelAnimationLoop = ref<boolean>(true)
const isModelLoaded = ref<boolean>(false)

let hasImpacted = false

// --- GESTIONE ANIMAZIONE WAVING CASUALE ---
const targetWaves = ref(0)

const modelFadeConfig = {
  default: 0.25,

  'FallingIdle->FallingToLanding': { duration: 0.15, fadeOut: 0.35 },
  'FallingToLanding->Idle': { duration: 0.25, fadeOut: 0.65, warp: true },

  'FallingIdle->FlatImpact': { duration: 0.05, fadeOut: 0.20 },
  'FlatImpact->ImpactStandup': { duration: 0.15, fadeOut: 0.30 },
  'ImpactStandup->Idle': { duration: 0.35, fadeOut: 0.50, warp: true },

  // Transizioni per Waving
  'Idle->Waving': { duration: 0.2, fadeOut: 0.3 },
  'Waving->Idle': { duration: 0.25, fadeOut: 0.4, warp: true }
}

function setIdleAnimation() {
  modelAnimationLoop.value = true
  modelAnimation.value = 'Idle'
}

function onSceneUpdate(delta: number) {
  if (!isModelLoaded.value || hasImpacted) return

  if (elapsedTime < duration) {
    const safeDelta = Math.min(delta, 0.05)
    elapsedTime += safeDelta
    const progress = Math.min(elapsedTime / duration, 1)
    
    const easeInQuad = Math.pow(progress, 2)
    const currentY = startY + (targetY.value - startY) * easeInQuad
    modelPosition.value = [0, currentY, 0]

    if (progress >= 1) {
      hasImpacted = true
      modelPosition.value = [0, targetY.value, 0]
      modelAnimationLoop.value = false
      
      if (impactType.value === 'flat') {
        modelAnimation.value = "FlatImpact"
      } else {
        modelAnimation.value = "FallingToLanding"
      }
    }
  }
}

// Gestione dell'impatto iniziale (animazioni non in loop)
function onAnimationFinished(animation: string) {
  if (animation === 'FlatImpact') {
    modelAnimationLoop.value = false
    modelAnimation.value = 'ImpactStandup'
  } else if (animation === 'ImpactStandup' || animation === 'FallingToLanding') {
    setIdleAnimation()
  }
}

// Gestione dei cicli per le animazioni in loop (Idle e Waving)
function onAnimationLoop(payload: { name: string; count: number }) {
  if (payload.name === 'Idle') {
    // Ad ogni ciclo di Idle, 40% di probabilità di far partire i saluti
    if (Math.random() < 0.4) {
      targetWaves.value = Math.floor(Math.random() * 5) + 1 // Da 1 a 5 volte
      modelAnimationLoop.value = true
      modelAnimation.value = 'Waving'
    }
  } else if (payload.name === 'Waving') {
    // Quando Waving ha completato il numero N di ripetizioni stabilite
    if (payload.count >= targetWaves.value) {
      setIdleAnimation()
    }
  }
}
</script>