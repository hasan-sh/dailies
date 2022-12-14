/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
})

const removeImports = require('next-remove-imports')();

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  env: {
    API_KEY: process.env.API_KEY,
    APP_ID: process.env.APP_ID,
  },
  ...removeImports({}),
}

// module.exports = withPWA(nextConfig)
module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);

