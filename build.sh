#!/bin/bash

# Check current Node.js version
echo "Current Node.js version: $(node -v)"

# Try to use nvm if available
if command -v nvm &> /dev/null; then
    echo "nvm is installed, attempting to use Node.js 20..."
    nvm use 20 || nvm install 20
    echo "Now using Node.js version: $(node -v)"
fi

# Run the build
echo "Running Next.js build..."
npm run build
