/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'soundhelix.com', 'i.ibb.co'],
  },
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}

module.exports = nextConfig
