import * as PopoverPrimitive from '@radix-ui/react-popover';

import { styled } from '@/styles/stitches/stitches.config';

import {
  slideDownAndFade,
  slideLeftAndFade,
  slideRightAndFade,
  slideUpAndFade,
} from 'animations/Slide';
import Flex from './Flex';

const StyledContent = styled(PopoverPrimitive.Content, {
  mt: '5px',
  borderRadius: 12,
  py: '$8',
  width: 251,
  zIndex: 999,
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
  backgroundColor: '$primary50',
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
});

const StyledPopoverTrigger = styled(PopoverPrimitive.Trigger, {
  p: 0,
  m: 0,
  size: 'fit-content',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '$round',
  '&:active': {
    border: 'none',
  },
  '&:focus': {
    border: 'none',
  },
  '@hover': {
    '&:hover': {
      backgroundColor: '$primary100',
    },
  },
});

const StyledRootPopover = styled(PopoverPrimitive.Root);
const StyledClosePopover = styled(PopoverPrimitive.Close);

// Exports
export const Popover = StyledRootPopover;
export const PopoverTrigger = StyledPopoverTrigger;
export const PopoverContent = StyledContent;
export const PopoverItem = StyledPopoverItem;
export const PopoverClose = StyledClosePopover;
