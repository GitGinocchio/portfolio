export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env

  if (!env || !env.CURSOR_TRACKER) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Binding CURSOR_TRACKER non trovato nel contesto Cloudflare'
    })
  }

  const id = env.CURSOR_TRACKER.idFromName('global-cursors')
  const stub = env.CURSOR_TRACKER.get(id)

  return stub.fetch(event.node.req as unknown as Request)
})