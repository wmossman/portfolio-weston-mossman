#!/bin/bash
set -e

# Check Node.js version
echo "Node.js version: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Build static export instead of server components
echo "Building static export..."
cp next.config.static.js next.config.js.bak
cp next.config.js next.config.js.original
cp next.config.static.js next.config.js
npx next build
cp next.config.js.original next.config.js
rm next.config.js.bak

# Copy necessary files to the output directory
echo "Copying static files..."
if [ -d ".next/static" ]; then
  mkdir -p out/_next
  cp -r .next/static out/_next/
fi

# Copy public files
echo "Copying public files..."
if [ -d "public" ]; then
  cp -r public/* out/
fi

# Copy the enhanced worker file
echo "Copying enhanced Cloudflare worker..."
cp public/enhanced-worker.js out/_worker.js

# Create a backup _worker.js in case the enhanced one doesn't exist
echo "Creating backup Cloudflare worker..."
if [ ! -f "out/_worker.js" ]; then
  cat > out/_worker.js << 'EOL'
export default {
  async fetch(request, env, ctx) {
    try {
      // Get the URL and pathname
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Try to serve the file directly
      let response = await env.ASSETS.fetch(request);
      if (response.status === 200) {
        // Add headers
        response = new Response(response.body, response);
        
        // Add security headers
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        response.headers.set("X-XSS-Protection", "1; mode=block");
        
        // Cache static assets
        if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
          response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
        }
        
        return response;
      }
      
      // Handle 404 by serving the custom 404 page
      if (response.status === 404) {
        // Try to serve the 404 page
        const notFoundUrl = new URL("/404.html", url.origin);
        const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl));
        
        if (notFoundResponse.status === 200) {
          return new Response(notFoundResponse.body, { 
            status: 404,
            headers: notFoundResponse.headers
          });
        }
        
        // If custom 404 page doesn't exist, try to serve index.html
        const indexUrl = new URL("/index.html", url.origin);
        const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
        
        if (indexResponse.status === 200) {
          return new Response(indexResponse.body, { 
            status: 200,
            headers: indexResponse.headers
          });
        }
      }
      
      // Fallback
      return response;
    } catch (e) {
      return new Response(`Server error: ${e.message}`, { status: 500 });
    }
  }
}
EOL

echo "Build completed successfully!"
