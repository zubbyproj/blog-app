/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['fs', 'path']
  },
  images: {
    domains: ['source.unsplash.com']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to resolve these modules on the client
      config.resolve.fallback = {
        fs: false,
        path: false
      }
    }
    return config
  }
}

module.exports = nextConfig 