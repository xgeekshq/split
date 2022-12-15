import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { styled } from '@/styles/stitches/stitches.config';

const StyledBox = styled(Flex, Box, {
  width: '$308',
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
