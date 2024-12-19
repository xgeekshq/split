/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  trailingSlash: true,
  output: 'standalone',
  swcMinify: true,
  publicRuntimeConfig: {
    NEXT_PUBLIC_EXPIRATION_TIME: process.env.NEXT_PUBLIC_EXPIRATION_TIME,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    SECRET: process.env.SECRET,
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    NEXT_PUBLIC_ENABLE_AZURE: process.env.NEXT_PUBLIC_ENABLE_AZURE,
    NEXT_PUBLIC_ENABLE_GIT: process.env.NEXT_PUBLIC_ENABLE_GIT,
    NEXT_PUBLIC_ENABLE_GOOGLE: process.env.NEXT_PUBLIC_ENABLE_GOOGLE,
    NEXT_PUBLIC_LOGIN_SSO_ONLY: process.env.NEXT_PUBLIC_LOGIN_SSO_ONLY,
    NEXT_PUBLIC_REGULAR_BOARD: process.env.NEXT_PUBLIC_REGULAR_BOARD,
    NEXT_PUBLIC_RECOIL_DEV_TOOLS: process.env.NEXT_PUBLIC_RECOIL_DEV_TOOLS
  },
  serverRuntimeConfig: {
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
  },
  images: {
    domains: [process.env.AZURE_STORAGE_HOSTNAME]
  },
  rewrites: async () => {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
      },
    ];
  },
};
