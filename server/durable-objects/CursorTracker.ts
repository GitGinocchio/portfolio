import { DurableObject } from 'cloudflare:workers'

interface CursorData {
  x: number
  y: number
  color: string
}

export class CursorTracker extends DurableObject {
  // Mappa in memoria: associa ogni WebSocket connesso al suo ID utente
  private sessions: Map<WebSocket, string> = new Map()

  async fetch(request: Request): Promise<Response> {
    // 1. Verifica che la richiesta sia una negoziazione WebSocket
    const upgradeHeader = request.headers.get('Upgrade')
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      return new Response('Attesa connessione WebSocket', { status: 426 })
    }

    // 2. Crea la coppia di Socket (Client <-> Server)
    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair)

    if (!server) {
        return new Response('Errore nella creazione della coppia WebSocket', { status: 500 })
    }

    // 3. Genera ID unico e colore casuale per l'utente che si si sta connettendo
    const userId = Math.random().toString(36).substring(2, 9)
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`

    // 4. Accetta la connessione lato Durable Object
    this.ctx.acceptWebSocket(server)
    this.sessions.set(server, userId)

    // 5. Invia all'utente appena connesso le sue credenziali iniziali
    server.send(JSON.stringify({
      type: 'init',
      id: userId,
      color: color
    }))

    // 6. Restituisce al client la risposta HTTP 101 Switching Protocols
    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  }

  // Gestore automatico dei messaggi WebSocket in arrivo dai client
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string') return

    try {
      const data = JSON.parse(message)

      // Quando un utente invia il movimento del mouse:
      if (data.type === 'move') {
        const senderId = this.sessions.get(ws)
        if (!senderId) return

        const payload = JSON.stringify({
          type: 'update',
          id: senderId,
          x: data.x,
          y: data.y,
          color: data.color
        })

        // Broadcast a TUTTI gli ALTRI client connessi
        for (const [session, id] of this.sessions.entries()) {
          if (id !== senderId && session.readyState === WebSocket.OPEN) {
            session.send(payload)
          }
        }
      }
    } catch (e) {
      console.error('Errore nel parsing del messaggio WebSocket:', e)
    }
  }

  // Gestore automatico della chiusura della connessione (utenti che escono o chiudono il tab)
  async webSocketClose(ws: WebSocket) {
    const userId = this.sessions.get(ws)
    this.sessions.delete(ws)

    if (userId) {
      const payload = JSON.stringify({
        type: 'leave',
        id: userId
      })

      // Avvisa gli altri client che l'utente ha abbandonato la pagina
      for (const [session] of this.sessions.entries()) {
        if (session.readyState === WebSocket.OPEN) {
          session.send(payload)
        }
      }
    }
  }
}