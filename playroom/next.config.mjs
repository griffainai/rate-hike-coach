/** @type {import('next').NextConfig} */
const nextConfig = {
  // The coach markdown files live in ../, outside the Next.js src tree.
  // We read them at runtime via fs in the API route.
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk']
  }
};

export default nextConfig;
