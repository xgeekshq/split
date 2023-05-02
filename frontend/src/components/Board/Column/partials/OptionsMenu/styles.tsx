import { PopoverItem } from '@/components/Primitives/Popovers/Popover/Popover';
import { styled } from '@/styles/stitches/stitches.config';

const PopoverItemSquareStyled = styled(PopoverItem, {
  alignItems: 'center',
  backgroundColor: '$transparent',
  py: '$5',
  px: '$5',
  gap: '$8',
  '@hover': {
    '&:hover': {
      backgroundColor: '$transparent',
    },
  },
});

export { PopoverItemSquareStyled };
