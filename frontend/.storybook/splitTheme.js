import { create } from '@storybook/theming';
import logo from '../public/split_logo.svg';

export default create({
  base: 'light',

  appBorderColor: '#A9B3BF',
  appBorderRadius: 8,

  fontBase: '"DM Sans", sans-serif',
  fontCode: 'monospace',

  brandUrl: 'https://split.kigroup.de/',
  brandTarget: '_blank',
  brandImage: logo,
});
