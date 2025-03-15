/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["img.clerk.com"], // Keep Clerk domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/attachments/**", // Matches your Discord URL pattern
      },
    ],
  },
};

module.exports = nextConfig;
