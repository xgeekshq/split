import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Box from '@/components/Primitives/Layout/Box/Box';
import { styled } from '@/styles/stitches/stitches.config';

export const StyledForm = styled('form', Flex, {
  flex: '1 1 auto',
  padding: '64px 92px 57px 152px',
});

export const InnerContainer = styled(Flex, Box, {
  px: '$32',
  py: '$22',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  maxHeight: '$76',
});
