/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['lineup-images.scdn.co', 'wrapped-images.spotifycdn.com'],
  },
}

module.exports = nextConfig
