const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-next'
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = '/storybook/';
    }

    return config;
  },
  managerWebpack: async (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = '/storybook/';
    }
    return config;
  },
};
