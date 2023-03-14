import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Box from '@/components/Primitives/Layout/Box/Box';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  py: '$22',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  maxHeight: '$76',
});

export { InnerContainer };
