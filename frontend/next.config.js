/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

require('dotenv').config({ path: '../.env' });
const webpack = require('webpack');

module.exports = {
	reactStrictMode: true,
	swcMinify: false,
	experimental: {
		outputStandalone: true
	},
	webpackDevMiddleware: (config) => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300
		};
		return config;
	},
	webpack(config) {
		config.plugins.push(new webpack.EnvironmentPlugin(process.env));

		return config;
	}
};
