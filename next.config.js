/** @type {import('next').NextConfig} */

const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  ...removeImports({}),
}

module.exports = nextConfig
