/** @type {import('next').NextConfig} */
const nextConfig = {
  // The coach markdown files live in ../, outside the Next.js src tree.
  // We read them at runtime via fs in the API route.
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk']
  },

  // Backwards-compat redirects for older URLs.
  async redirects() {
    return [
      // /demo used to host the slideshow. Now it lives at /.
      { source: '/demo', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
