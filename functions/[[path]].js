// Cloudflare Pages Functions catch-all route handler
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// Function to get local file content for static file serving
const getFileContent = (path) => {
  try {
    const fullPath = join(process.cwd(), path);
    if (!existsSync(fullPath)) {
      return null;
    }
    return readFileSync(fullPath);
  } catch (e) {
    console.error(`Error reading file ${path}:`, e);
    return null;
  }
};

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);

    // Try to fetch from ASSETS first
    try {
      const response = await context.env.ASSETS.fetch(context.request);

      // If the response is OK, return it with security headers
      if (response.status === 200) {
        const newResponse = new Response(response.body, response);

        // Add security headers
        newResponse.headers.set('X-Content-Type-Options', 'nosniff');
        newResponse.headers.set('X-Frame-Options', 'DENY');
        newResponse.headers.set(
          'Referrer-Policy',
          'strict-origin-when-cross-origin',
        );
        newResponse.headers.set('X-XSS-Protection', '1; mode=block');
        newResponse.headers.set(
          'Strict-Transport-Security',
          'max-age=63072000; includeSubDomains; preload',
        );

        // Add cache control for static assets
        if (
          url.pathname.startsWith('/_next/static') ||
          url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp)$/)
        ) {
          newResponse.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable',
          );
        } else {
          newResponse.headers.set('Cache-Control', 'public, max-age=3600');
        }

        return newResponse;
      }
    } catch (e) {
      console.error('Error fetching from ASSETS:', e);
    }

    // For the home page and direct routes, try to serve the appropriate HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return Response.redirect(`${url.origin}/app`, 302);
    } else if (url.pathname.startsWith('/app')) {
      // This should go to our main Next.js app
      return await serveNextApp(context);
    } else if (
      url.pathname.startsWith('/devblog') ||
      url.pathname.startsWith('/projects') ||
      url.pathname.startsWith('/resume')
    ) {
      // Redirects for main sections
      return Response.redirect(`${url.origin}/app${url.pathname}`, 302);
    }

    // For everything else, try to serve static content
    return await serveStaticContent(context);
  } catch (e) {
    console.error('Error in onRequest:', e);
    return new Response(`Server Error: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function serveNextApp(context) {
  try {
    // Try to serve the Next.js app through the asset handler
    const modifiedRequest = new Request(
      `${new URL(context.request.url).origin}/app/index.html`,
      context.request,
    );

    const response = await context.env.ASSETS.fetch(modifiedRequest);

    if (response.status === 200) {
      return response;
    }

    // Fallback to index.html in .next/standalone
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weston Mossman - Portfolio</title>
  <script>window.location.href = '/app';</script>
</head>
<body>
  <h1>Redirecting to portfolio...</h1>
</body>
</html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      },
    );
  } catch (e) {
    console.error('Error serving Next.js app:', e);
    return new Response(`Error serving application: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function serveStaticContent(context) {
  try {
    // Try to get the file from ASSETS
    const response = await context.env.ASSETS.fetch(context.request);

    if (response.status === 200) {
      return response;
    }

    // If not found, return 404
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (e) {
    console.error('Error serving static content:', e);
    return new Response(`Error serving content: ${e.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
