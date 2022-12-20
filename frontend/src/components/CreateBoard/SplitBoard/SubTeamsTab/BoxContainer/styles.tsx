import { styled } from '@/styles/stitches/stitches.config';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';

const StyledBox = styled(Flex, Box, {
  width: '100%',
  py: '$12',
  pl: '$17',
  pr: '$16',
  borderRadius: '$4',
  border: '1px solid $primary200',
  height: '$64',
  minWidth: 0,
});

export { StyledBox };
