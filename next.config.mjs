/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'child_process': false,
        'node:stream': false,
        'node:buffer': false,
        'node:crypto': false,
        'node:util': false,
        'node:events': false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false,
        events: false,
      };
      
      // Mark server-only packages as external for client
      config.externals = [...(config.externals || []), 'mssql', 'bcryptjs', 'jsonwebtoken'];
    }
    
    return config;
  },
  // Ensure edge runtime compatibility
  experimental: {
    serverComponentsExternalPackages: ['mssql', 'bcryptjs', 'jsonwebtoken'],
  },
}

export default nextConfig
