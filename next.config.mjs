/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential for Dokploy deployment
  output: 'standalone', // Creates optimized standalone build for Docker
  
  // Optimize for production
  swcMinify: true,
  reactStrictMode: true,
  compress: true,
  
  // Image optimization (disable if using external image service)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // If using external domains, add them here:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: '**',
    //   },
    // ],
  },

  // Environment variables for client-side
  env: {
    // Example: NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Webpack configuration (your existing SVG setup)
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  // Headers for security (optional but recommended)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Enable experimental features if needed
  experimental: {
    // Remove if you're not using server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize for memory usage
    optimizeCss: true,
    // Enable if using Turbopack locally
    // turbo: {},
  },
  
  // Optional: For static export (uncomment if needed)
  // output: 'export', // Use instead of 'standalone' for static sites
  // trailingSlash: true, // For better compatibility with static hosting
  
  // Optional: Base path if deploying to subdirectory
  // basePath: '/your-base-path',
  
  // Optional: Redirects and rewrites
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;