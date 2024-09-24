/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn-transverse.azureedge.net'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
