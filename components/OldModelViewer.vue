<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <ClientOnly>
      <!-- Overlay Loader -->
      <div
        v-if="loading"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 font-mono text-sm z-20 pointer-events-none"
      >
        <span class="animate-pulse">Caricamento 3D... {{ progress }}%</span>
        <!-- Progress Bar semplice -->
        <div class="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-500 transition-all duration-200"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Container Canvas -->
      <div
        ref="canvasContainer"
        class="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <canvas ref="canvas" class="w-full h-full block" />
      </div>

      <!-- Fallback SSR -->
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center text-slate-600 font-mono text-sm">
          Inizializzazione vista 3D...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Props {
  modelPath: string
  autoCenter?: boolean
  enableZoom?: boolean
  scale?: number
  positionY?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoCenter: true,
  enableZoom: true,
  scale: 1,
  positionY: -1
})

const canvasContainer = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const loading = ref<boolean>(true)
const progress = ref<number>(0)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let mixer: THREE.AnimationMixer | undefined
let currentModel: THREE.Group | THREE.Object3D | null = null
let clock: THREE.Timer
let controls: OrbitControls
let animationFrameId: number

onMounted(async () => {
  await nextTick()
  if (initThree()) {
    loadModel(props.modelPath)
    animate()
    window.addEventListener('resize', onWindowResize)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  renderer?.dispose()
})

// Ricarica il modello se la prop `modelPath` cambia dinamicamente
watch(() => props.modelPath, (newPath) => {
  if (newPath && scene) {
    loadModel(newPath)
  }
})

function initThree(): boolean {
  const container = canvasContainer.value
  const canvasEl = canvas.value

  if (!container || !canvasEl) return false

  const width = container.clientWidth || 300
  const height = container.clientHeight || 300

  scene = new THREE.Scene()
  clock = new THREE.Timer();

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 1.5, 4.5)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  controls = new OrbitControls(camera, canvasEl)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.maxPolarAngle = Math.PI / 2

  // Luci
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 2)
  dirLight.position.set(5, 8, 5)
  dirLight.castShadow = true
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0x6366f1, 3, 10)
  pointLight.position.set(-3, 2, -1)
  scene.add(pointLight)

  return true
}

function loadModel(path: string) {
  if (!scene) return

  if (currentModel) {
    scene.remove(currentModel)
    currentModel = null
    mixer = undefined
  }

  loading.value = true
  progress.value = 0

  const loader = new GLTFLoader()

  loader.load(
    path,
    (gltf) => {
      currentModel = gltf.scene

      currentModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      if (props.autoCenter) {
        const box = new THREE.Box3().setFromObject(currentModel)
        const center = box.getCenter(new THREE.Vector3())
        currentModel.position.x += (currentModel.position.x - center.x)
        currentModel.position.y += (currentModel.position.y - center.y) + props.positionY
        currentModel.position.z += (currentModel.position.z - center.z)
      } else {
        currentModel.position.set(0, props.positionY, 0)
      }

      currentModel.scale.set(props.scale, props.scale, props.scale)
      scene.add(currentModel)

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel)
        const action = mixer.clipAction(gltf.animations[0]!)
        action.play()
      }

      loading.value = false
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        progress.value = Math.round((xhr.loaded / xhr.total) * 100)
      }
    },
    (error) => {
      console.error(`Errore caricamento modello [${path}]:`, error)
      loading.value = false
    }
  )
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)

  if (clock) {
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
  }

  controls?.update()
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function onWindowResize() {
  if (!canvasContainer.value) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  if (camera && renderer && width && height) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
}
</script>