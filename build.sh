#!/bin/bash

# Exit on error
set -e

# Print each command
set -x

# Check current Node.js version
echo "Current Node.js version: $(node -v)"

# Ensure Node.js 20+ is used
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Error: Node.js version 20+ is required. Current version: $(node -v)"
    echo "Attempting to use nvm to switch to Node.js 20..."
    
    # Try to install nvm if not available
    if ! command -v nvm &> /dev/null; then
        echo "nvm not found, trying to load it..."
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    # Try to use nvm if available now
    if command -v nvm &> /dev/null; then
        nvm use 20 || nvm install 20
        echo "Now using Node.js version: $(node -v)"
    else
        # If nvm is not available, try to use Cloudflare's Node.js version selection
        echo "nvm not available. Setting NODE_VERSION=20 environment variable..."
        export NODE_VERSION=20
    fi
fi

# Make sure we're using pnpm from the correct Node version
echo "Using pnpm from: $(which pnpm)"
echo "pnpm version: $(pnpm -v)"

# Verify Next.js installation
echo "Checking for next command..."
pnpm exec next --version || echo "Next.js not found in path"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install --frozen-lockfile
fi

# # Run tests before building
# echo "Running tests..."
pnpm test -- --passWithNoTests --watchAll=false --ci

# Run linting before build
echo "Running linter..."
pnpm run lint

# Run the build
echo "Running Next.js build..."
pnpm exec next build

# Copy necessary files for Cloudflare Pages deployment
echo "Preparing files for Cloudflare Pages..."
if [ -d ".next/standalone" ]; then
    echo "Copying static files to standalone folder..."
    mkdir -p .next/standalone/.next/static
    cp -r .next/static .next/standalone/.next/

    # Ensure server.js is in the output directory
    if [ -f ".next/standalone/server.js" ]; then
        echo "server.js exists in standalone directory"
    else
        echo "Warning: server.js not found in standalone directory"
        if [ -f ".next/server.js" ]; then
            echo "Copying server.js from .next directory"
            cp .next/server.js .next/standalone/
        fi
    fi
    
    # Copy public directory contents
    if [ -d "public" ]; then
        echo "Copying public files to standalone folder..."
        cp -r public/* .next/standalone/
    fi
    
    # Create an _worker.js file to serve as an entry point for Cloudflare Pages
    echo "Creating Cloudflare Pages worker entry point..."
    cat > .next/standalone/_worker.js << 'EOL'
// Cloudflare Pages Worker for Next.js
export default {
  async fetch(request, env, ctx) {
    try {
      // Get the URL and pathname
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Special handling for static files
      if (pathname.startsWith('/_next/static') || 
          pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico)$/)) {
        // Serve from ASSETS
        const response = await env.ASSETS.fetch(request);
        if (response.status === 200) {
          // Add cache header for static assets
          const newResponse = new Response(response.body, response);
          newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return newResponse;
        }
      }
      
      // For non-static paths
      try {
        // First try to get from ASSETS
        const response = await env.ASSETS.fetch(request);
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        console.error('Error fetching from ASSETS:', error);
      }
      
      // If not found or error, redirect to the root HTML and let client-side routing handle it
      if (pathname !== '/' && !pathname.endsWith('.html')) {
        // Rewrite all other URLs to root index.html for client-side routing
        const indexRequest = new Request(`${url.origin}/index.html`, request);
        return await env.ASSETS.fetch(indexRequest);
      }
      
      // If we've exhausted all options, return 404
      return new Response('Not Found', { status: 404 });
    } catch (e) {
      return new Response(`Server Error: ${e.message}`, { status: 500 });
    }
  }
};
EOL
    
    # Create a simple index.html as a fallback
    echo "Creating fallback index.html..."
    cat > .next/standalone/index.html << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=/">
  <title>Redirecting...</title>
</head>
<body>
  <p>If you are not redirected automatically, follow this <a href="/">link</a>.</p>
</body>
</html>
EOL
else
    echo "Warning: .next/standalone directory not found"
fi

echo "Build completed successfully!"
