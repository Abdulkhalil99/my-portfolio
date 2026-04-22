/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from these domains
  images: {
    domains: [
      'localhost',
      'avatars.githubusercontent.com',
      // Add your domain here later
    ],
  },

  // Environment variables available in browser
  // These are PUBLIC — do not put secrets here
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
