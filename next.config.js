// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-mdx-remote'],
  output: 'standalone', // Optimizes for Cloudflare Pages
};

module.exports = nextConfig;
