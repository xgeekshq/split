import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const StyledSubBoardItem = styled(Flex, Box, {
  backgroundColor: 'white',
  height: '$64',
  width: '100%',
  borderRadius: '$12',
  ml: '$40',
  py: '$16',
  pl: '$32',
  pr: '$24',
});

const LotteryButton = styled(Flex, {
  height: '$24',
  width: '$24',
  borderRadius: '$round',
  border: '1px solid $colors$primary400',
  variants: {
    disabled: {
      true: {
        opacity: 0.2,
      },
      false: {
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '$primary400',
          color: '$white',
        },
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export { StyledSubBoardItem, LotteryButton };
