import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Flex';

const ScrollableContent = styled(Flex, {
  mt: '$24',
  maxHeight: 'calc(100vh - 180px)',
  overflowY: 'auto',
  pb: '$10',
});

export { ScrollableContent };
