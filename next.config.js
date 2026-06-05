// ============================================================
// FILE: next.config.js
// PURPOSE: Next.js configuration for Vercel-ready deployment
// DEPENDS ON: None
// ============================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Output standalone for Vercel deployment optimization
  output: 'standalone',
};

module.exports = nextConfig;