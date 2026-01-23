/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Enable XSS protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HSTS - Force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Referrer Policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions Policy
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Cache Control for static assets
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache HTML pages
      {
        source: "/:path((?!api).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
    ];
  },

  // CORS Configuration
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Performance Optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Turbopack Configuration (Next.js 16 default bundler)
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
};

export default nextConfig;
