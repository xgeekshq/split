import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

const StyledBox = styled(Flex, Box, {
  width: '$308',
  height: '$260',
  pt: '$24',
  pb: '$24',
  px: '$32',
  mt: '$40',
  borderRadius: '$12',
  background: 'white',
  '&:hover': {
    cursor: 'pointer',
    background: 'black',
    [`& ${Text}`]: {
      color: 'white',
    },
  },
});

export { StyledBox };
