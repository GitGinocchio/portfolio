<template>
  <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <!-- Renderizza tutti i cursori remoti -->
    <div
      v-for="(cursor, id) in remoteCursors"
      :key="id"
      class="absolute left-0 top-0 transition-transform duration-75 ease-out"
      :style="{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }"
    >
      <!-- Icona Cursore Mouse SVG -->
      <svg
        class="h-5 w-5 -rotate-45 drop-shadow"
        :style="{ fill: cursor.color }"
        viewBox="0 0 24 24"
      >
        <path d="M3 3l7 18 3-7 7-3L3 3z" />
      </svg>
      
      <!-- Label con l'ID dell'utente -->
      <span
        class="ml-3 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white shadow"
        :style="{ backgroundColor: cursor.color }"
      >
        {{ id }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RemoteCursor {
  x: number
  y: number
  color: string
}

const remoteCursors = ref<Record<string, RemoteCursor>>({})
let ws: WebSocket | null = null
let myColor = '#ffffff'

// Invia le coordinate al Durable Object via WebSocket
const handleMouseMove = (e: MouseEvent) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'move',
        x: e.clientX,
        y: e.clientY,
        color: myColor,
      })
    )
  }
}

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/api/cursors`

  ws = new WebSocket(wsUrl)

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'init') {
        myColor = data.color
      } else if (data.type === 'update') {
        // Aggiorna o crea il cursore dell'altro utente
        remoteCursors.value[data.id] = {
          x: data.x,
          y: data.y,
          color: data.color,
        }
      } else if (data.type === 'leave') {
        // Rimuove il cursore quando l'utente si disconnette
        delete remoteCursors.value[data.id]
      }
    } catch (e) {
      console.error('Errore nella lettura del messaggio dal Durable Object:', e)
    }
  }

  // Registra il listener del mouse globale
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (ws) ws.close()
})
</script>