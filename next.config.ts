/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // ✅ Helps catch common React issues
  swcMinify: true, // ✅ Optimizes JavaScript with SWC
  images: {
    domains: ["img.clerk.com"], // ✅ Allow Clerk's image domain
  },
};

module.exports = nextConfig;
