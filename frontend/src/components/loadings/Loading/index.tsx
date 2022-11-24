import { keyframes, styled } from '@/styles/stitches/stitches.config';

const spinner = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const Loading = styled('div', {
  variants: {
    size: {
      50: {
        width: '50px',
        height: '50px',
      },
      80: {
        width: '$80',
        height: '$80',
      },
      100: {
        width: '$100',
        height: '$100',
      },
      150: {
        width: '150px',
        height: '150px',
      },
      220: {
        width: '$220',
        height: '$220',
      },
    },
    color: {
      dark: {
        border: '$sizes$8 solid rgba(0,0,0,0.02)',
        borderTop: '$sizes$8 solid $colors$primary800',
      },
      white: {
        border: '$sizes$8 solid rgba(255,255,255,.02)',
        borderTop: '$sizes$8 solid $colors$white',
      },
    },
  },

  defaultVariants: {
    size: '80',
    color: 'dark',
  },

  borderRadius: '50%',
  animation: `${spinner} 2s linear infinite`,
});

export { Loading };
