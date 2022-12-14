import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const StyledBox = styled(Flex, Box, {
  width: '510px',
  pt: '$32',
  pb: '$32',
  px: '$32',
  borderRadius: '$12',
  background: 'white',
  '&:hover': {
    cursor: 'pointer',
  },
});

export { StyledBox };
