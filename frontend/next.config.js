/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

require("dotenv").config({ path: "../.env" });
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    outputStandalone: true,
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

    return config;
  },
};
