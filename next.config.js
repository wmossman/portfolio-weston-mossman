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
    optimizeCss: false,
  },
};

module.exports = nextConfig;
