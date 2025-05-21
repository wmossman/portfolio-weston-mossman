// Specific handler for root path
export async function onRequest(context) {
  return Response.redirect(`${new URL(context.request.url).origin}/app`, 302);
}
