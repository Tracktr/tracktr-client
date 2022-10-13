/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["picsum.photos", "avatars.githubusercontent.com", "image.tmdb.org", "lh3.googleusercontent.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
