import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex';

const Container = styled(Flex, {
  overflow: 'hidden',
  alignItems: 'flex-start',
  justifyContent: 'center',
  px: '$36',
});

export { Container };
