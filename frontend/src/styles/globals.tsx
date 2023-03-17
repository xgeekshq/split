import { globalCss } from './stitches/stitches.config';

const globalStyles = globalCss({
  '@import': [
    'url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap")',
    'url("/fonts/digital-7-mono-italic.woff")',
  ],
  '@font-face': [
    {
      fontFamily: '"DM Sans", sans-serif',
      src: 'url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap")',
    },
    {
      fontFamily: 'Digital-7 Mono',
      src: 'url("/fonts/digital-7-mono-italic.woff")',
    },
  ],
  '*': {
    boxSizing: 'border-box',
  },

  body: {
    bc: '$background',
    margin: 0,
    fontFamily: '$body',
    fontWeight: '$regular',
    fontSize: '$16',
    lineHeight: '$24',
    minHeight: '100vh',

    '&::-webkit-scrollbar': {
      width: '$8',
    },
    '&::-webkit-scrollbar-track': {
      background: '$primary50',
      borderRadius: '$pill',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '$primary200',
      borderRadius: '$pill',

      '&:hover': {
        background: '$primary400',
      },
    },

    // custom scroll for firefox
    scrollbarWidth: 'thin',
    scrollbarColor: '$primary200 $primary50',
  },

  '::-webkit-scrollbar': {
    width: '$8',
  },
  '::-webkit-scrollbar-track': {
    background: '$primary50',
    borderRadius: '$pill',
  },
  '::-webkit-scrollbar-thumb': {
    background: '$primary200',
    borderRadius: '$pill',

    '&:hover': {
      background: '$primary400',
    },
  },

  '#__next': {
    minHeight: '100vh',
    overflow: 'auto',
  },

  a: {
    textDecoration: 'none',
  },
  svg: { verticalAlign: 'middle' },
});

export default globalStyles;
