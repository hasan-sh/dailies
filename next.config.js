/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
})

const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  ...removeImports({}),
}

// module.exports = withPWA(nextConfig)
module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);

