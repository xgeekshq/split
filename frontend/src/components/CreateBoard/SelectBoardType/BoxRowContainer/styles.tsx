import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
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
    background: 'black',
    [`& ${Text}`]: {
      color: 'white',
    },
  },
});

const DisabledStylesBox = styled(StyledBox, {
  opacity: 0.5,
  '&:hover': {
    cursor: 'not-allowed',
    background: 'white',
    [`& ${Text}`]: {
      color: 'black',
    },
  },
});

export { StyledBox, DisabledStylesBox };
