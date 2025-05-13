import withPWA from 'next-pwa'
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['103.165.119.119']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

// Merge configs
export default withPWAConfig(nextConfig)
