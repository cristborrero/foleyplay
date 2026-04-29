import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '/tmp/netflix-clone-next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'www.themoviedb.org',
      },
    ],
  },
};

export default nextConfig;
