// Cloudflare Pages Worker for handling page transitions and routing
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Special handling for _next/static files - prioritize caching
      if (url.pathname.startsWith('/_next/static')) {
        let response = await env.ASSETS.fetch(request);
        response = new Response(response.body, response);
        response.headers.set(
          'Cache-Control',
          'public, max-age=31536000, immutable',
        );
        return response;
      }

      // For all other requests, apply normal handling
      let response = await env.ASSETS.fetch(request);
      response = new Response(response.body, response);

      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload',
      );
      response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()',
      );

      // Add cache control for static assets
      if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp)$/)) {
        response.headers.set(
          'Cache-Control',
          'public, max-age=31536000, immutable',
        );
      } else {
        response.headers.set('Cache-Control', 'public, max-age=3600');
      }

      return response;
    } catch (e) {
      // Return friendly error if something goes wrong
      return new Response(`Server Error: ${e.message}`, { status: 500 });
    }
  },
};
