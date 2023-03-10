import { styled } from '@/styles/stitches/stitches.config';

import { PopoverItem } from '@/components/Primitives/Popovers/Popover/Popover';

const PopoverItemSquareStyled = styled(PopoverItem, {
  alignItems: 'center',
  backgroundColor: '$transparent',
  py: '$5',
  px: '$5',
  gap: '$8',
  ml: '$14',
  '@hover': {
    '&:hover': {
      backgroundColor: '$transparent',
    },
  },
});

export { PopoverItemSquareStyled };
