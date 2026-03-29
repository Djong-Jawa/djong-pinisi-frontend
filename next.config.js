const withFlowbiteReact = require("flowbite-react/plugin/nextjs");

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  devIndicators: false, 
  images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http', // Use 'http' if your image uses http, not https
                hostname: '91.108.104.69',
                pathname: '/media/**'
            },
            {
                protocol: 'https', // Use 'http' if your image uses http, not https
                hostname: 'picsum.photos',
                pathname: '/'
            },
        ],
    },
};

module.exports = withFlowbiteReact(nextConfig);