import * as AccordionPrimitive from '@radix-ui/react-accordion';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { keyframes, styled } from '@/styles/stitches/stitches.config';

/**
 * Accordion Animations
 */

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: '100%' },
});

const slideUp = keyframes({
  from: { height: '100%' },
  to: { height: 0 },
});

/**
 * Accordion Styles
 */
const StyledAccordionHeader = styled(AccordionPrimitive.Header, {
  all: 'unset',
  display: 'flex',

  variants: {
    variant: {
      first: {
        pt: '$16',
      },
      others: {
        pt: '$40',
      },
    },
  },

  defaultVariants: {
    variant: 'others',
  },
});

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger, {
  all: 'unset',

  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '$8',

  cursor: 'pointer',

  /**
   * Rotate icon if is open
   */
  '&[data-state="open"]': {
    svg: {
      transform: 'rotate(180deg)',
    },
  },
  '&:hover': {
    textDecoration: 'underline',
  },
});

const StyledAccordionContent = styled(AccordionPrimitive.Content, {
  paddingTop: '$16',

  overflow: 'hidden',

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
});

const StyledAccordionIcon = styled(Icon, {
  color: '$primary400',
  size: '$24',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
});

const StyledAccordionItem = styled(AccordionPrimitive.Item, {
  overflow: 'hidden',
  px: ' $32',
  variants: {
    variant: {
      first: {
        borderTop: 'none',
        mb: '$40',
      },
      others: {
        borderTop: '1px solid $colors$primary100',
        mb: '$40',
      },
    },
  },

  defaultVariants: {
    variant: 'others',
  },
});

export {
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionIcon,
  StyledAccordionItem,
  StyledAccordionTrigger,
};
