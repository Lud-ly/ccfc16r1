/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn-transverse.azureedge.net'],
  },
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
