import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { styled } from '@/styles/stitches/stitches.config';

const StyledSeparator = styled(SeparatorPrimitive.Root, {
  backgroundColor: '$primary100',
  variants: {
    orientation: {
      horizontal: {
        height: 1,
      },
      vertical: {
        width: 1,
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
      full: {},
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      orientation: 'horizontal',
      css: {
        width: '$8',
      },
    },
    {
      size: 'sm',
      orientation: 'vertical',
      css: {
        height: '$8',
      },
    },
    {
      size: 'md',
      orientation: 'horizontal',
      css: {
        width: '$12',
      },
    },
    {
      size: 'md',
      orientation: 'vertical',
      css: {
        height: '$12',
      },
    },
    {
      size: 'lg',
      orientation: 'horizontal',
      css: {
        width: '$24',
      },
    },
    {
      size: 'lg',
      orientation: 'vertical',
      css: {
        height: '$24',
      },
    },
    {
      size: 'full',
      orientation: 'horizontal',
      css: {
        width: '100%',
      },
    },
    {
      size: 'full',
      orientation: 'vertical',
      css: {
        height: '100%',
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    size: 'full',
  },
});

const Separator = StyledSeparator;

export default Separator;
