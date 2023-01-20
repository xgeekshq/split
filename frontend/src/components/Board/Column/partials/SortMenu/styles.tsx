import { styled } from '@/styles/stitches/stitches.config';

import { PopoverItem, PopoverTrigger } from '@/components/Primitives/Popover';

const PopoverTriggerStyled = styled(PopoverTrigger, {
  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },

  cursor: 'pointer',
  color: '$primary300',

  '&:svg': {
    size: '$24',
  },

  '&:hover,&[data-state="open"]': {
    backgroundColor: '$primary100',
    color: '$primary300',
  },
});

const PopoverItemStyled = styled(PopoverItem, {
  variants: {
    active: {
      true: {
        backgroundColor: '$primary50',
        '&>*': { color: '$primary800' },
      },
      false: {},
    },
    sorting: {
      true: {
        '&:hover': {},
      },
      false: {
        '&>svg': { color: '$primary300' },

        '&:hover': {
          backgroundColor: '$primary500',
          '& span': { color: '$white' },
          '& svg': { color: '$white' },
        },
      },
    },
  },

  defaultVariants: {
    sorting: true,
    active: false,
  },

  alignItems: 'center',
  gap: '$8',
});

export { PopoverItemStyled, PopoverTriggerStyled };
