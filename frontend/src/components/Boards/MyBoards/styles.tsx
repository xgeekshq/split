import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Flex';

const ScrollableContent = styled(Flex, {
  mt: '$24',
  height: 'calc(100vh - 180px)',
  overflowY: 'auto',
  pb: '$10',
  pr: '$10',
});

export { ScrollableContent };
