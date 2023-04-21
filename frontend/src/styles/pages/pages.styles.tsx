import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

export const StyledForm = styled('form', Flex, {
  flex: '1 1 auto',
  padding: '64px 92px 57px 152px',
});

export const FlexForm = styled('form', Flex, { width: '100%' });

export const InnerContainer = styled(Flex, Box, {
  px: '$32',
  py: '$22',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  maxHeight: '$76',
  variants: {
    size: {
      sm: {
        maxHeight: '$64',
      },
      md: {
        maxHeight: '$76',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
