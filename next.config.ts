const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  basePath: isDev ? '' : '/nekopress',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
