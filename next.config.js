/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { hostname: "img.youtube.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "i.vimeocdn.com" },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
