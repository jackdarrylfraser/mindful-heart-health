import type { NextConfig } from 'next'
import nextra from 'nextra'

const withNextra = nextra({
  // Nextra specific options
  // contentDirBasePath: '/docs', 
})

const nextConfig: NextConfig = {
  // Standard Next.js options
  reactStrictMode: true,
   turbopack: {
   resolveAlias: {
     // Path to your `mdx-components` file with extension
     'next-mdx-import-source-file': './mdx-components.tsx'
   }
 }
}

export default withNextra(nextConfig)