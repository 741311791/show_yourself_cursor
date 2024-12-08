import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'liancheng-app.oss-cn-hangzhou.aliyuncs.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
