const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@tomfreudenberg/next-auth-mock/storybook',
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];
    config.resolve.alias['@tomfreudenberg/next-auth-mock/storybook/preview-mock-auth-states'] =
      path.resolve(__dirname, 'previewMockAuthStates.js');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, '../src/components'),
      '@helper': path.resolve(__dirname, '../src/helper'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@schemas': path.resolve(__dirname, '../src/schemas'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@animations': path.resolve(__dirname, '../src/animations'),
      '@': path.resolve(__dirname, '../src'),
    };

    return config;
  },
  managerWebpack: async (config) => {
    return config;
  },
  docs: {
    autodocs: true,
  },
};
