/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

require('dotenv').config({ path: '../.env' });
const webpack = require('webpack');

module.exports = {
	reactStrictMode: true,
	output: 'standalone',
	swcMinify: true,
	publicRuntimeConfig: {
		NEXT_PUBLIC_EXPIRATION_TIME: process.env.NEXT_PUBLIC_EXPIRATION_TIME,
		NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
		SECRET: process.env.SECRET,
		NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
		NEXT_PUBLIC_ENABLE_AZURE: process.env.NEXT_PUBLIC_ENABLE_AZURE,
		NEXT_PUBLIC_ENABLE_GIT: process.env.NEXT_PUBLIC_ENABLE_GIT,
		NEXT_PUBLIC_ENABLE_GOOGLE: process.env.NEXT_PUBLIC_ENABLE_GOOGLE
	},
	serverRuntimeConfig: {
		AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
		AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
		AZURE_TENANT_ID: process.env.AZURE_TENANT_ID
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
