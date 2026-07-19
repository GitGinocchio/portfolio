// server/middleware/cors.ts
export default defineEventHandler((event) => {
  // Aggiungi header di sicurezza necessari per SharedArrayBuffer
  setResponseHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin');
  setResponseHeader(event, 'Cross-Origin-Embedder-Policy', 'require-corp');
  
  // CORS: Permetti il caricamento di risorse cross-origin
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
  setResponseHeader(event, 'Access-Control-Allow-Headers', '*');
});