// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  
  // Enable static exports for Cloudflare Pages static hosting
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slashes for better compatibility
  trailingSlash: true,

  // Add basePath configuration
  basePath: '',
  
  // Configure Cloudflare specific settings
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
  },
  
  // Static site generation
  // Add rewrites to help with dynamic routes
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite /blog/[slug] to the correct path
        {
          source: '/blog/:slug*',
          destination: '/blog/:slug*.html',
        },
        // Rewrite /projects/[slug] to the correct path
        {
          source: '/projects/:slug*',
          destination: '/projects/:slug*.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
