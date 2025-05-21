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

# Make sure we're using npm from the correct Node version
echo "Using npm from: $(which npm)"
echo "npm version: $(npm -v)"

# Verify Next.js installation
echo "Checking for next command..."
npx next --version || echo "Next.js not found in path"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Run the build
echo "Running Next.js build..."
npx --no-install next build

# Copy necessary files for Cloudflare Pages deployment
echo "Preparing files for Cloudflare Pages..."
if [ -d ".next/standalone" ]; then
    echo "Copying static files to standalone folder..."
    cp -r .next/static .next/standalone/.next/
    
    if [ -d "public" ]; then
        echo "Copying public files to standalone folder..."
        cp -r public/* .next/standalone/
    fi
else
    echo "Warning: .next/standalone directory not found"
fi

echo "Build completed successfully!"
