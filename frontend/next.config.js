/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    return config;
  },
};
