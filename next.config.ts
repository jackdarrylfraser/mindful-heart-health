import type { NextConfig } from 'next'
import nextra from 'nextra'

const withNextra = nextra({
  // Nextra specific options
  // contentDirBasePath: '/docs', 
})

const nextConfig: NextConfig = {
  // Standard Next.js options
  reactStrictMode: true,
}

export default withNextra(nextConfig)