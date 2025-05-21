// Cloudflare Pages Worker for handling page transitions and routing
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add security headers
    let response = await env.ASSETS.fetch(request);
    response = new Response(response.body, response);
    
    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    
    // Add cache control for static assets
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp)$/)) {
      response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      response.headers.set("Cache-Control", "public, max-age=3600");
    }
    
    return response;
  },
};
