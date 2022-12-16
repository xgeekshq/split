import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Flex';

const Container = styled(Flex, {
  // remove 108px from header to the 100vh
  overflow: 'hidden',

  alignItems: 'flex-start',
  justifyContent: 'center',
  px: '$36',
});

export { Container };
