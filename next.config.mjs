/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Mark server-only packages that use Node.js built-ins
  experimental: {
    serverComponentsExternalPackages: ['mssql', 'bcryptjs', 'jsonwebtoken'],
  },
}

export default nextConfig
