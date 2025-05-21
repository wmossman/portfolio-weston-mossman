// Enhanced Cloudflare worker for static Next.js sites
export default {
  async fetch(request, env, ctx) {
    try {
      // Get the URL and pathname
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Special handling for dynamic routes
      let modifiedRequest = request;
      
      // Convert paths that might be dynamic routes to HTML files
      if (pathname.startsWith('/blog/') && !pathname.endsWith('.html') && 
          !pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
        // For blog posts, try the HTML version
        const htmlUrl = new URL(`${pathname}.html`, url.origin);
        modifiedRequest = new Request(htmlUrl, request);
      } else if (pathname.startsWith('/projects/') && !pathname.endsWith('.html') && 
                !pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
        // For project pages, try the HTML version
        const htmlUrl = new URL(`${pathname}.html`, url.origin);
        modifiedRequest = new Request(htmlUrl, request);
      }
      
      // Try to serve the file directly
      let response = await env.ASSETS.fetch(modifiedRequest);
      
      // If we get a 200 response, great! Add headers and return
      if (response.status === 200) {
        // Add headers
        response = new Response(response.body, response);
        
        // Add security headers
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        response.headers.set("X-XSS-Protection", "1; mode=block");
        response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
        
        // Cache static assets
        if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
          response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          response.headers.set("Cache-Control", "public, max-age=3600");
        }
        
        return response;
      }
      
      // If we get here, the file wasn't found directly - try fallbacks
      
      // For root path, serve index.html
      if (pathname === '/') {
        const indexUrl = new URL("/index.html", url.origin);
        const indexResponse = await env.ASSETS.fetch(new Request(indexUrl, request));
        
        if (indexResponse.status === 200) {
          const newResponse = new Response(indexResponse.body, indexResponse);
          newResponse.headers.set("Content-Type", "text/html; charset=utf-8");
          return newResponse;
        }
      }
      
      // Try without trailing slash or with trailing slash
      let altPathRequest;
      if (pathname.endsWith('/')) {
        // Try without trailing slash
        const noSlashUrl = new URL(pathname.slice(0, -1), url.origin);
        altPathRequest = new Request(noSlashUrl, request);
      } else {
        // Try with trailing slash
        const withSlashUrl = new URL(`${pathname}/`, url.origin);
        altPathRequest = new Request(withSlashUrl, request);
      }
      
      const altResponse = await env.ASSETS.fetch(altPathRequest);
      if (altResponse.status === 200) {
        return new Response(altResponse.body, altResponse);
      }
      
      // Try with .html extension
      const htmlUrl = new URL(`${pathname}.html`, url.origin);
      const htmlResponse = await env.ASSETS.fetch(new Request(htmlUrl, request));
      
      if (htmlResponse.status === 200) {
        return new Response(htmlResponse.body, htmlResponse);
      }
      
      // For nested paths, try to serve the main section page
      // For example, /blog/something -> /blog.html
      if (pathname.includes('/')) {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          const sectionUrl = new URL(`/${parts[0]}.html`, url.origin);
          const sectionResponse = await env.ASSETS.fetch(new Request(sectionUrl, request));
          
          if (sectionResponse.status === 200) {
            return Response.redirect(`${url.origin}/${parts[0]}`, 302);
          }
        }
      }
      
      // Handle 404 by serving the custom 404 page
      const notFoundUrl = new URL("/404.html", url.origin);
      const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl));
      
      if (notFoundResponse.status === 200) {
        const newResponse = new Response(notFoundResponse.body, { 
          status: 404,
          headers: notFoundResponse.headers
        });
        newResponse.headers.set("Content-Type", "text/html; charset=utf-8");
        return newResponse;
      }
      
      // Last resort, try to serve the index page
      const indexUrl = new URL("/index.html", url.origin);
      const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
      
      if (indexResponse.status === 200) {
        return Response.redirect(url.origin, 302);
      }
      
      // Fallback to original response if nothing else worked
      return response;
    } catch (e) {
      return new Response(`Server error: ${e.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}
