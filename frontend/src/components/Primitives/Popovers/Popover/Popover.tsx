import * as PopoverPrimitive from '@radix-ui/react-popover';

import { styled } from '@/styles/stitches/stitches.config';

import {
  slideDownAndFade,
  slideLeftAndFade,
  slideRightAndFade,
  slideUpAndFade,
} from '@/animations/Slide';
import Flex from '../../Layout/Flex';

const StyledContent = styled(PopoverPrimitive.Content, {
  mt: '5px',
  borderRadius: 12,
  py: '$8',
  width: 251,
  zIndex: 128,
  backgroundColor: 'white',
  '&:focus': {
    border: 'none',
    outline: 'none',
  },
  '&:active': {
    border: 'none',
    outline: 'none',
  },
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledPopoverItem = styled(Flex, {
  pl: '$16',
  py: '$8',
  gap: '$8',
  alignItems: 'center',
  '& svg': {
    color: '$primary400',
    size: '$16',
  },
  '@hover': {
    '&:hover': {
      backgroundColor: '$primary500',
      cursor: 'pointer',
      '& span': {
        color: 'white',
      },
      '& svg': {
        color: 'white',
      },
    },
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$primary50',
        '&>*': { color: '$primary800' },
      },
    },
  },
});

const StyledPopoverTrigger = styled(PopoverPrimitive.Trigger, {
  p: 0,
  m: 0,
  size: 'fit-content',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '$round',
  position: 'relative',
  cursor: 'pointer',
  '&:active': {
    border: 'none',
  },
  '&:focus': {
    border: 'none',
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },
  variants: {
    variant: {
      dark: {
        '&:hover&:enabled': {
          backgroundColor: '$primary500',
          color: 'white',
        },
      },
      light: {
        color: '$primary300',
        '&:hover&:enabled, &[data-state="open"]': {
          backgroundColor: '$primary100',
          color: '$primary300',
        },
        '&:disabled': {
          opacity: '0.5',
        },
      },
    },
    size: {
      sm: {
        width: '$20',
        height: '$20',
        '& svg': {
          size: '$20',
        },
      },
      md: {
        width: '$24',
        height: '$24',
        '& svg': {
          size: '$24',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const StyledClosePopover = styled(PopoverPrimitive.Close, {
  width: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
});

const StyledRootPopover = styled(PopoverPrimitive.Root);

// Exports
export const Popover = StyledRootPopover;
export const PopoverTrigger = StyledPopoverTrigger;
export const PopoverContent = StyledContent;
export const PopoverItem = StyledPopoverItem;
export const PopoverClose = StyledClosePopover;
