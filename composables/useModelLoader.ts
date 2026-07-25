import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export interface LoadModelOptions {
  path: string
  onLoad?: (gltf: GLTF) => void
  onProgress?: (event: ProgressEvent<EventTarget>) => void
  onError?: (error: unknown) => void
}

export interface UseModelLoaderReturn {
  loadedModels: Map<string, GLTF>
  loadModel: (options: LoadModelOptions) => Promise<GLTF | null>
  clearModel: (path: string) => void
  clearAll: () => void
}

const loadedModels = new Map<string, GLTF>()
const loader = new GLTFLoader()

export const useModelLoader = (): UseModelLoaderReturn=> {
  /**
   * Dispone geometrie e materiali per liberare memoria WebGL
   */
  const disposeGLTF = (gltf: GLTF) => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.geometry?.dispose()

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose())
        } else {
          mesh.material?.dispose()
        }
      }
    })
  }

  /**
   * Carica un modello GLTF/GLB fornendo callback per completamento, progresso ed errore
   */
  const loadModel = ({ path, onLoad, onProgress, onError }: LoadModelOptions): Promise<GLTF | null> => {
    if (loadedModels.has(path)) {
      clearModel(path)
    }

    return new Promise((resolve) => {
      loader.load(
        path,
        (gltf) => {
          loadedModels.set(path, gltf)
          onLoad?.(gltf)
          resolve(gltf)
        },
        (event) => {
          onProgress?.(event)
        },
        (error) => {
          console.error(`[useModelLoader] Errore durante il caricamento di: ${path}`, error)
          onError?.(error)
          resolve(null)
        }
      )
    })
  }

  /**
   * Rimuove un singolo modello e libera la memoria GPU
   */
  const clearModel = (path: string) => {
    const gltf = loadedModels.get(path)
    if (!gltf) return

    if (gltf.scene.parent) {
      gltf.scene.parent.remove(gltf.scene)
    }

    disposeGLTF(gltf)
    loadedModels.delete(path)
  }

  /**
   * Svuota e libera la memoria di tutti i modelli tracciati
   */
  const clearAll = () => {
    for (const path of loadedModels.keys()) {
      clearModel(path)
    }
  }

  return {
    loadedModels,
    loadModel,
    clearModel,
    clearAll
  }
}